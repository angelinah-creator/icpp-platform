-- =======================================================
-- PHASE 1 — Corrections données pour conformité CDC/UT.md
-- =======================================================

BEGIN;

-- -------------------------------------------------------
-- 1. Corriger le type de gravite : text → integer
--    (table vide donc pas de migration de données)
-- -------------------------------------------------------
ALTER TABLE risques_metier ALTER COLUMN gravite TYPE integer USING gravite::integer;

-- -------------------------------------------------------
-- 2. Ajouter la catégorie manquante : ORGANISATIONNELS
-- -------------------------------------------------------
INSERT INTO risques_categories (id, code, nom, description, ordre, "createdAt", "updatedAt")
VALUES (
  'cat_organisationnels',
  'ORGANISATIONNELS',
  'Organisationnels',
  'Risques liés à l''organisation du travail, procédures, gestion interne',
  40,
  NOW(),
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- Mettre à jour l'ordre des autres catégories pour cohérence CDC
UPDATE risques_categories SET ordre = 10 WHERE code = 'PHYSIQUE';
UPDATE risques_categories SET ordre = 20 WHERE code = 'CHIMIQUE';
UPDATE risques_categories SET ordre = 30 WHERE code = 'PSYCHOSOCIAUX';
UPDATE risques_categories SET ordre = 50 WHERE code = 'INCENDIE';
UPDATE risques_categories SET ordre = 60 WHERE code = 'BIOLOGIQUE';
UPDATE risques_categories SET ordre = 70 WHERE code = 'ERGONOMIQUE';
UPDATE risques_categories SET ordre = 80 WHERE code = 'ELECTRIQUE';

-- -------------------------------------------------------
-- 3. Renommer les métiers existants pour coller au CDC
--    (on garde les mêmes codes → 0 impact sur les FK)
-- -------------------------------------------------------
UPDATE metiers_icpp SET
  nom = 'Coiffure / Barbier',
  description = 'Activités de coiffure, coupe, coloration, soins capillaires, taille de barbe.'
WHERE code = 'COIFFURE';

UPDATE metiers_icpp SET
  nom = 'Esthétique / Ongles / Bien-être',
  description = 'Soins esthétiques, manucure, onglerie, soins du corps et du visage.'
WHERE code = 'ESTHETIQUE';

UPDATE metiers_icpp SET
  nom = 'Restaurant traditionnel',
  description = 'Restauration assise, cuisine traditionnelle, service à table.'
WHERE code = 'RESTAURATION';

UPDATE metiers_icpp SET
  nom = 'Boutique / Prêt-à-porter',
  description = 'Magasins de vêtements, chaussures, accessoires.'
WHERE code = 'COMMERCE';

UPDATE metiers_icpp SET
  nom = 'Nettoyage / Entretien',
  description = 'Agents de propreté, entretien de locaux, multiservices.'
WHERE code = 'NETTOYAGE';

UPDATE metiers_icpp SET
  nom = 'Administratif / Bureautique / Assurance / Cabinets',
  description = 'Bureaux d''assurance, cabinets administratifs, secrétariat, gestion de dossiers.'
WHERE code = 'BUREAU';

-- -------------------------------------------------------
-- 4. Ajouter les 3 métiers manquants du CDC
-- -------------------------------------------------------
INSERT INTO metiers_icpp (id, code, nom, description, "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'SNACK',    'Snack / Restauration rapide',  'Restauration rapide, snacks, sandwicheries, vente à emporter.', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'PHARMACIE','Pharmacie / Parapharmacie',     'Pharmacies d''officine, parapharmacies, vente de médicaments et produits de santé.', true, NOW(), NOW()),
  (gen_random_uuid()::text, 'TRANSPORT','Transport / Livraison',          'Activités de livraison, conduite de véhicules légers/utilitaires.', true, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------
-- 5. Désactiver les 4 métiers hors-CDC (pas de suppression
--    pour préserver l'intégrité des données existantes)
-- -------------------------------------------------------
UPDATE metiers_icpp SET "isActive" = false WHERE code IN ('GARAGE', 'HOTELLERIE', 'BOULANGERIE', 'BATIMENT');

COMMIT;
