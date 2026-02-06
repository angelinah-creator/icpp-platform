-- ====================================================================
-- SEED COMPLET - Schema avec UniteTravail
-- Date: 2026-02-05
-- ====================================================================

-- ============================================
-- 1. PLANS TARIFAIRES
-- ============================================

INSERT OR IGNORE INTO plans_tarifaires (id, code, nom, description, prixMensuel, fraisSetup, fonctionnalites, isActive, ordre, createdAt, updatedAt) VALUES
('plan_starter', 'STARTER', 'Starter', 'Idéal pour les TPE', 29, 0, '["DUERP simple","1 audit/an","Support email"]', 1, 1, datetime('now'), datetime('now')),
('plan_pro', 'PRO', 'Professionnel', 'Pour PME exigeantes', 79, 0, '["DUERP complet","4 audits/an","Support prioritaire","Formations"]', 1, 2, datetime('now'), datetime('now')),
('plan_enterprise', 'ENTERPRISE', 'Enterprise', 'Solution complète', 199, 0, '["DUERP multi-sites","Audits illimités","Support dédié","API","Personnalisation"]', 1, 3, datetime('now'), datetime('now'));

-- ============================================
-- 2. CATÉGORIES DE RISQUES
-- ============================================

INSERT OR IGNORE INTO risques_categories (id, code, nom, description, ordre, createdAt, updatedAt) VALUES
('cat_physique', 'PHYSIQUE', 'Risques physiques', 'Chutes, TMS, bruit, température', 1, datetime('now'), datetime('now')),
('cat_chimique', 'CHIMIQUE', 'Risques chimiques', 'Exposition aux produits chimiques', 2, datetime('now'), datetime('now')),
('cat_biologique', 'BIOLOGIQUE', 'Risques biologiques', 'Virus, bactéries, contamination', 3, datetime('now'), datetime('now')),
('cat_psychosociaux', 'PSYCHOSOCIAUX', 'Risques psychosociaux', 'Stress, harcèlement, charge mentale', 4, datetime('now'), datetime('now')),
('cat_electrique', 'ELECTRIQUE', 'Risques électriques', 'Contact électrique, court-circuit', 5, datetime('now'), datetime('now')),
('cat_incendie', 'INCENDIE', 'Risques incendie-explosion', 'Feu, explosion, évacuation', 6, datetime('now'), datetime('now')),
('cat_ergonomique', 'ERGONOMIQUE', 'Risques ergonomiques', 'Postures, gestes répétitifs, manutention', 7, datetime('now'), datetime('now'));

-- ============================================
-- 3. MÉTIERS ICPP
-- ============================================

INSERT OR IGNORE INTO metiers_icpp (id, code, nom, description, isActive, createdAt, updatedAt) VALUES
('metier_coiffure', 'COIFFURE', 'Salon de Coiffure', 'Coiffure, barbier, soins capillaires', 1, datetime('now'), datetime('now')),
('metier_esthetique', 'ESTHETIQUE', 'Institut de Beauté', 'Esthétique, onglerie, bien-être', 1, datetime('now'), datetime('now')),
('metier_restauration', 'RESTAURATION', 'Restauration', 'Restaurant, snack, restauration rapide', 1, datetime('now'), datetime('now')),
('metier_boulangerie', 'BOULANGERIE', 'Boulangerie-Pâtisserie', 'Fabrication et vente de pain et pâtisseries', 1, datetime('now'), datetime('now')),
('metier_commerce', 'COMMERCE', 'Commerce de Détail', 'Boutique, prêt-à-porter, commerce', 1, datetime('now'), datetime('now')),
('metier_garage', 'GARAGE', 'Garage Automobile', 'Mécanique, carrosserie, entretien véhicules', 1, datetime('now'), datetime('now')),
('metier_nettoyage', 'NETTOYAGE', 'Services de Nettoyage', 'Nettoyage, entretien, propreté', 1, datetime('now'), datetime('now')),
('metier_bureau', 'BUREAU', 'Activités de Bureau', 'Bureaux, administratif, tertiaire', 1, datetime('now'), datetime('now')),
('metier_batiment', 'BATIMENT', 'Bâtiment et Travaux Publics', 'Construction, rénovation, BTP', 1, datetime('now'), datetime('now')),
('metier_hotellerie', 'HOTELLERIE', 'Hôtellerie', 'Hébergement, réception, services hôteliers', 1, datetime('now'), datetime('now'));

-- ============================================
-- 4. UNITÉS DE TRAVAIL - COIFFURE
-- ============================================

INSERT OR IGNORE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_coiffure_01', 'COIFFURE', 'UT1 : Accueil / Caisse', 'Espace accueil et encaissement', 1, datetime('now'), datetime('now')),
('ut_coiffure_02', 'COIFFURE', 'UT2 : Poste Coupe / Coiffage', 'Zone de coupe et coiffage', 2, datetime('now'), datetime('now')),
('ut_coiffure_03', 'COIFFURE', 'UT3 : Zone Bac / Shampoing', 'Espace lavage et shampoings', 3, datetime('now'), datetime('now')),
('ut_coiffure_04', 'COIFFURE', 'UT4 : Zone Technique (Coloration)', 'Zone coloration et produits', 4, datetime('now'), datetime('now')),
('ut_coiffure_05', 'COIFFURE', 'UT5 : Réserve / Stock', 'Stockage produits', 5, datetime('now'), datetime('now')),
('ut_coiffure_06', 'COIFFURE', 'UT6 : Locaux / Entretien', 'Installations générales', 6, datetime('now'), datetime('now'));

-- UNITÉS DE TRAVAIL - ESTHÉTIQUE
INSERT OR IGNORE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_esthetique_01', 'ESTHETIQUE', 'UT1 : Accueil / Caisse', 'Espace accueil', 1, datetime('now'), datetime('now')),
('ut_esthetique_02', 'ESTHETIQUE', 'UT2 : Poste Manucure / Ongles', 'Manucure et pédicure', 2, datetime('now'), datetime('now')),
('ut_esthetique_03', 'ESTHETIQUE', 'UT3 : Cabine Soins', 'Cabine soins visage/corps', 3, datetime('now'), datetime('now')),
('ut_esthetique_04', 'ESTHETIQUE', 'UT4 : Zone Produits', 'Stockage et préparation', 4, datetime('now'), datetime('now')),
('ut_esthetique_05', 'ESTHETIQUE', 'UT5 : Locaux / Circulations', 'Espaces communs', 5, datetime('now'), datetime('now')),
('ut_esthetique_06', 'ESTHETIQUE', 'UT6 : Installations Techniques', 'Électricité, sécurité', 6, datetime('now'), datetime('now'));

-- UNITÉS DE TRAVAIL - RESTAURATION
INSERT OR IGNORE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_resto_01', 'RESTAURATION', 'UT1 : Accueil / Service', 'Salle et service client', 1, datetime('now'), datetime('now')),
('ut_resto_02', 'RESTAURATION', 'UT2 : Poste Cuisson', 'Zone de cuisson', 2, datetime('now'), datetime('now')),
('ut_resto_03', 'RESTAURATION', 'UT3 : Préparation / Découpe', 'Préparation aliments', 3, datetime('now'), datetime('now')),
('ut_resto_04', 'RESTAURATION', 'UT4 : Stockage / Chambre Froide', 'Conservation aliments', 4, datetime('now'), datetime('now')),
('ut_resto_05', 'RESTAURATION', 'UT5 : Plonge / Nettoyage', 'Zone de lavage', 5, datetime('now'), datetime('now')),
('ut_resto_06', 'RESTAURATION', 'UT6 : Installations', 'Équipements techniques', 6, datetime('now'), datetime('now'));

-- UNITÉS DE TRAVAIL - BOULANGERIE
INSERT OR IGNORE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_boulangerie_01', 'BOULANGERIE', 'UT1 : Vente / Encaissement', 'Espace vente', 1, datetime('now'), datetime('now')),
('ut_boulangerie_02', 'BOULANGERIE', 'UT2 : Fournil', 'Zone de fabrication du pain', 2, datetime('now'), datetime('now')),
('ut_boulangerie_03', 'BOULANGERIE', 'UT3 : Zone Pâtisserie', 'Pâtisseries et viennoiseries', 3, datetime('now'), datetime('now')),
('ut_boulangerie_04', 'BOULANGERIE', 'UT4 : Stockage', 'Stockage matières premières', 4, datetime('now'), datetime('now')),
('ut_boulangerie_05', 'BOULANGERIE', 'UT5 : Nettoyage', 'Nettoyage et hygiène', 5, datetime('now'), datetime('now')),
('ut_boulangerie_06', 'BOULANGERIE', 'UT6 : Fours / Équipements', 'Équipements techniques', 6, datetime('now'), datetime('now'));

-- UNITÉS DE TRAVAIL - COMMERCE
INSERT OR IGNORE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_commerce_01', 'COMMERCE', 'UT1 : Accueil / Caisse', 'Accueil client et encaissement', 1, datetime('now'), datetime('now')),
('ut_commerce_02', 'COMMERCE', 'UT2 : Surface de Vente', 'Rayons et espace vente', 2, datetime('now'), datetime('now')),
('ut_commerce_03', 'COMMERCE', 'UT3 : Réserve / Stock', 'Stockage et réassort', 3, datetime('now'), datetime('now')),
('ut_commerce_04', 'COMMERCE', 'UT4 : Entretien', 'Nettoyage magasin', 4, datetime('now'), datetime('now')),
('ut_commerce_05', 'COMMERCE', 'UT5 : Cabines Essayage', 'Cabines essayage', 5, datetime('now'), datetime('now')),
('ut_commerce_06', 'COMMERCE', 'UT6 : Locaux / Sécurité', 'Sécurité et installations', 6, datetime('now'), datetime('now'));

-- UNITÉS DE TRAVAIL - NETTOYAGE
INSERT OR IGNORE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_nettoyage_01', 'NETTOYAGE', 'UT1 : Préparation Intervention', 'Préparation du matériel', 1, datetime('now'), datetime('now')),
('ut_nettoyage_02', 'NETTOYAGE', 'UT2 : Lavage Sols / Sanitaires', 'Nettoyage sols et sanitaires', 2, datetime('now'), datetime('now')),
('ut_nettoyage_03', 'NETTOYAGE', 'UT3 : Nettoyage Hauteur / Vitres', 'Travaux en hauteur', 3, datetime('now'), datetime('now')),
('ut_nettoyage_04', 'NETTOYAGE', 'UT4 : Produits Chimiques', 'Manipulation produits', 4, datetime('now'), datetime('now')),
('ut_nettoyage_05', 'NETTOYAGE', 'UT5 : Gestion Déchets', 'Collecte et tri', 5, datetime('now'), datetime('now')),
('ut_nettoyage_06', 'NETTOYAGE', 'UT6 : Sécurité Locaux', 'Sécurité générale', 6, datetime('now'), datetime('now'));

-- ============================================
-- 5. QUELQUES RISQUES EXEMPLES
-- ============================================

-- Risques pour COIFFURE - UT Zone Technique
INSERT OR IGNORE INTO risques_metier (id, categorieCode, uniteTravailId, nom, description, gravite, frequence, mesuresSuggerees, isActive, createdAt, updatedAt) VALUES
('risque_coiff_01', 'CHIMIQUE', 'ut_coiffure_04', 'Exposition aux produits chimiques', 'Colorations, permanentes, produits contenant ammoniaque', 4, 4, '["Port de gants adaptés","Ventilation du local","Formation produits chimiques"]', 1, datetime('now'), datetime('now')),
('risque_coiff_02', 'ERGONOMIQUE', 'ut_coiffure_02', 'Troubles musculo-squelettiques', 'Station debout prolongée, gestes répétitifs', 3, 5, '["Pauses régulières","Sièges ergonomiques","Rotation des postes"]', 1, datetime('now'), datetime('now')),
('risque_coiff_03', 'PHYSIQUE', 'ut_coiffure_03', 'Risque de glissade', 'Sols mouillés zone bac', 3, 4, '["Sols antidérapants","Essuyage régulier","Chaussures adaptées"]', 1, datetime('now'), datetime('now'));

-- Risques pour RESTAURATION - Cuisine
INSERT OR IGNORE INTO risques_metier (id, categorieCode, uniteTravailId, nom, description, gravite, frequence, mesuresSuggerees, isActive, createdAt, updatedAt) VALUES
('risque_resto_01', 'PHYSIQUE', 'ut_resto_02', 'Risque de brûlure', 'Contact avec surfaces chaudes, huiles, vapeurs', 4, 5, '["EPI adaptés","Formation sécurité","Affichage consignes"]', 1, datetime('now'), datetime('now')),
('risque_resto_02', 'PHYSIQUE', 'ut_resto_03', 'Risque de coupure', 'Utilisation de couteaux et lames', 3, 5, '["Couteaux adaptés","Gants anti-coupure","Formation découpe"]', 1, datetime('now'), datetime('now')),
('risque_resto_03', 'BIOLOGIQUE', 'ut_resto_04', 'Contamination alimentaire', 'Non-respect de la chaîne du froid', 4, 3, '["Contrôle températures","HACCP","Formations hygiène"]', 1, datetime('now'), datetime('now'));

-- ============================================
-- 6. UTILISATEUR ADMIN PAR DÉFAUT
-- ============================================

INSERT OR IGNORE INTO users (id, name, email, password, role, emailVerified, createdAt, updatedAt) VALUES
('admin_default', 'Administrateur', 'admin@icpp.re', '$2b$10$J7vLvJoHX9xOz0L7V2uu9O0T5r.CqRYBT9F5Fy7B6Q0VJh0rB5x/K', 'ADMIN', datetime('now'), datetime('now'), datetime('now'));

-- ============================================
-- VÉRIFICATION
-- ============================================

SELECT 'Seed completed' as status;
SELECT 'Métiers: ' || COUNT(*) FROM metiers_icpp;
SELECT 'UTs: ' || COUNT(*) FROM unites_travail;
SELECT 'Risques: ' || COUNT(*) FROM risques_metier;
