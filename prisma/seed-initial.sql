-- ====================================================================
-- SEED INITIAL COMPLET - Métiers, Catégories, UTs
-- Date: 2026-02-05
-- ====================================================================

-- ============================================
-- 1. MÉTIERS ICPP
-- ============================================

INSERT OR REPLACE INTO metiers_icpp (id, code, nom, description, isActive, createdAt, updatedAt) VALUES
('m_coiffure', 'COIFFURE', 'Salon de Coiffure', 'Coiffure, barbier, soins capillaires', 1, datetime('now'), datetime('now')),
('m_esthetique', 'ESTHETIQUE', 'Institut de Beauté', 'Esthétique, onglerie, bien-être', 1, datetime('now'), datetime('now')),
('m_restauration', 'RESTAURATION', 'Restauration', 'Restaurant, snack, restauration rapide', 1, datetime('now'), datetime('now')),
('m_boulangerie', 'BOULANGERIE', 'Boulangerie-Pâtisserie', 'Fabrication et vente de pain et pâtisseries', 1, datetime('now'), datetime('now')),
('m_commerce', 'COMMERCE', 'Commerce de Détail', 'Boutique, prêt-à-porter, commerce', 1, datetime('now'), datetime('now')),
('m_garage', 'GARAGE', 'Garage Automobile', 'Mécanique, carrosserie, entretien véhicules', 1, datetime('now'), datetime('now')),
('m_nettoyage', 'NETTOYAGE', 'Services de Nettoyage', 'Nettoyage, entretien, propreté', 1, datetime('now'), datetime('now')),
('m_bureau', 'BUREAU', 'Activités de Bureau', 'Bureaux, administratif, tertiaire', 1, datetime('now'), datetime('now')),
('m_batiment', 'BATIMENT', 'Bâtiment et Travaux Publics', 'Construction, rénovation, BTP', 1, datetime('now'), datetime('now')),
('m_hotellerie', 'HOTELLERIE', 'Hôtellerie', 'Hébergement, réception, services hôteliers', 1, datetime('now'), datetime('now'));

-- ============================================
-- 2. CATÉGORIES DE RISQUES
-- ============================================

INSERT OR REPLACE INTO risques_categories (id, code, nom, description, ordre, createdAt, updatedAt) VALUES
('cat_physique', 'PHYSIQUE', 'Risques physiques', 'Chutes, TMS, bruit, température', 1, datetime('now'), datetime('now')),
('cat_chimique', 'CHIMIQUE', 'Risques chimiques', 'Exposition aux produits chimiques', 2, datetime('now'), datetime('now')),
('cat_biologique', 'BIOLOGIQUE', 'Risques biologiques', 'Virus, bactéries, contamination', 3, datetime('now'), datetime('now')),
('cat_psychosociaux', 'PSYCHOSOCIAUX', 'Risques psychosociaux', 'Stress, harcèlement, charge mentale', 4, datetime('now'), datetime('now')),
('cat_electrique', 'ELECTRIQUE', 'Risques électriques', 'Contact électrique, court-circuit', 5, datetime('now'), datetime('now')),
('cat_incendie', 'INCENDIE', 'Risques incendie-explosion', 'Feu, explosion, évacuation', 6, datetime('now'), datetime('now')),
('cat_ergonomique', 'ERGONOMIQUE', 'Risques ergonomiques', 'Postures, gestes répétitifs, manutention', 7, datetime('now'), datetime('now'));

-- ============================================
-- 3. PLANS TARIFAIRES
-- ============================================

INSERT OR REPLACE INTO plans_tarifaires (id, code, nom, description, prixMensuel, fraisSetup, fonctionnalites, isActive, ordre, createdAt, updatedAt) VALUES
('plan_essentiel', 'ESSENTIEL', 'Essentiel', 'Pour démarrer en conformité', 1900, 4900, '["DUERP digital","Affichages obligatoires","Mises à jour réglementaires","Support email"]', 1, 1, datetime('now'), datetime('now')),
('plan_pro', 'PRO', 'Pro', 'Gestion complète', 3900, 4900, '["Tout Essentiel +","Gestion multi-sites","Rapports personnalisés","Support prioritaire","Audit annuel"]', 1, 2, datetime('now'), datetime('now')),
('plan_premium', 'PREMIUM', 'Premium', 'Solution entreprise', 7900, 9900, '["Tout Pro +","Support dédié","Formation incluse","API access","Personnalisation"]', 1, 3, datetime('now'), datetime('now'));

-- ============================================
-- 4. UNITÉS DE TRAVAIL - TOUS MÉTIERS
-- ============================================

-- COIFFURE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_coif_01', 'COIFFURE', 'UT1 : Accueil / Caisse', 'Espace accueil clients, encaissement', 1, datetime('now'), datetime('now')),
('ut_coif_02', 'COIFFURE', 'UT2 : Poste Coupe / Coiffage', 'Zone de coupe et coiffage', 2, datetime('now'), datetime('now')),
('ut_coif_03', 'COIFFURE', 'UT3 : Zone Bac / Shampoing', 'Espace lavage et soins', 3, datetime('now'), datetime('now')),
('ut_coif_04', 'COIFFURE', 'UT4 : Zone Technique', 'Coloration, permanentes, produits', 4, datetime('now'), datetime('now')),
('ut_coif_05', 'COIFFURE', 'UT5 : Réserve / Stock', 'Stockage produits', 5, datetime('now'), datetime('now')),
('ut_coif_06', 'COIFFURE', 'UT6 : Locaux Sociaux', 'Vestiaires, sanitaires', 6, datetime('now'), datetime('now'));

-- ESTHÉTIQUE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_esth_01', 'ESTHETIQUE', 'UT1 : Accueil / Vente', 'Réception, vente, encaissement', 1, datetime('now'), datetime('now')),
('ut_esth_02', 'ESTHETIQUE', 'UT2 : Cabine Soins Visage', 'Soins visage, maquillage', 2, datetime('now'), datetime('now')),
('ut_esth_03', 'ESTHETIQUE', 'UT3 : Cabine Soins Corps', 'Soins corps, épilations', 3, datetime('now'), datetime('now')),
('ut_esth_04', 'ESTHETIQUE', 'UT4 : Manucure / Pédicure', 'Onglerie, prothèses', 4, datetime('now'), datetime('now')),
('ut_esth_05', 'ESTHETIQUE', 'UT5 : Réserve Produits', 'Stockage cosmétiques', 5, datetime('now'), datetime('now')),
('ut_esth_06', 'ESTHETIQUE', 'UT6 : Locaux Techniques', 'Buanderie, entretien', 6, datetime('now'), datetime('now'));

-- RESTAURATION
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_rest_01', 'RESTAURATION', 'UT1 : Salle / Service', 'Salle, service client', 1, datetime('now'), datetime('now')),
('ut_rest_02', 'RESTAURATION', 'UT2 : Cuisine / Zone Chaude', 'Cuisson, fours, plaques', 2, datetime('now'), datetime('now')),
('ut_rest_03', 'RESTAURATION', 'UT3 : Préparation Froide', 'Préparation aliments', 3, datetime('now'), datetime('now')),
('ut_rest_04', 'RESTAURATION', 'UT4 : Plonge', 'Lavage vaisselle', 4, datetime('now'), datetime('now')),
('ut_rest_05', 'RESTAURATION', 'UT5 : Chambre Froide', 'Réserves, stockage', 5, datetime('now'), datetime('now')),
('ut_rest_06', 'RESTAURATION', 'UT6 : Réception', 'Réception livraisons', 6, datetime('now'), datetime('now'));

-- BOULANGERIE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_boul_01', 'BOULANGERIE', 'UT1 : Boutique / Vente', 'Espace vente', 1, datetime('now'), datetime('now')),
('ut_boul_02', 'BOULANGERIE', 'UT2 : Fournil', 'Fabrication pain', 2, datetime('now'), datetime('now')),
('ut_boul_03', 'BOULANGERIE', 'UT3 : Laboratoire Pâtisserie', 'Pâtisseries, viennoiseries', 3, datetime('now'), datetime('now')),
('ut_boul_04', 'BOULANGERIE', 'UT4 : Zone Fours', 'Fours, fermentation', 4, datetime('now'), datetime('now')),
('ut_boul_05', 'BOULANGERIE', 'UT5 : Stockage', 'Matières premières', 5, datetime('now'), datetime('now')),
('ut_boul_06', 'BOULANGERIE', 'UT6 : Locaux Annexes', 'Vestiaires, sanitaires', 6, datetime('now'), datetime('now'));

-- COMMERCE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_comm_01', 'COMMERCE', 'UT1 : Accueil / Caisse', 'Accueil, encaissement', 1, datetime('now'), datetime('now')),
('ut_comm_02', 'COMMERCE', 'UT2 : Surface de Vente', 'Rayons, présentation', 2, datetime('now'), datetime('now')),
('ut_comm_03', 'COMMERCE', 'UT3 : Cabines Essayage', 'Espace cabines', 3, datetime('now'), datetime('now')),
('ut_comm_04', 'COMMERCE', 'UT4 : Réserve', 'Stock, réassort', 4, datetime('now'), datetime('now')),
('ut_comm_05', 'COMMERCE', 'UT5 : Réception', 'Livraisons, déballage', 5, datetime('now'), datetime('now')),
('ut_comm_06', 'COMMERCE', 'UT6 : Locaux Sociaux', 'Bureau, vestiaires', 6, datetime('now'), datetime('now'));

-- GARAGE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_gara_01', 'GARAGE', 'UT1 : Accueil / Bureau', 'Réception, devis', 1, datetime('now'), datetime('now')),
('ut_gara_02', 'GARAGE', 'UT2 : Atelier Mécanique', 'Réparations, ponts', 2, datetime('now'), datetime('now')),
('ut_gara_03', 'GARAGE', 'UT3 : Carrosserie / Peinture', 'Carrosserie, cabine', 3, datetime('now'), datetime('now')),
('ut_gara_04', 'GARAGE', 'UT4 : Fosse / Vidange', 'Zone vidange', 4, datetime('now'), datetime('now')),
('ut_gara_05', 'GARAGE', 'UT5 : Stockage Pièces', 'Pièces, huiles', 5, datetime('now'), datetime('now')),
('ut_gara_06', 'GARAGE', 'UT6 : Parking', 'Circulation véhicules', 6, datetime('now'), datetime('now'));

-- NETTOYAGE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_nett_01', 'NETTOYAGE', 'UT1 : Préparation', 'Préparation matériel', 1, datetime('now'), datetime('now')),
('ut_nett_02', 'NETTOYAGE', 'UT2 : Nettoyage Sols', 'Aspiration, lavage', 2, datetime('now'), datetime('now')),
('ut_nett_03', 'NETTOYAGE', 'UT3 : Sanitaires', 'Entretien sanitaires', 3, datetime('now'), datetime('now')),
('ut_nett_04', 'NETTOYAGE', 'UT4 : Vitres / Hauteur', 'Vitrerie, hauteur', 4, datetime('now'), datetime('now')),
('ut_nett_05', 'NETTOYAGE', 'UT5 : Déchets', 'Tri, évacuation', 5, datetime('now'), datetime('now')),
('ut_nett_06', 'NETTOYAGE', 'UT6 : Déplacements', 'Transport sites', 6, datetime('now'), datetime('now'));

-- BUREAU
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_bure_01', 'BUREAU', 'UT1 : Accueil', 'Réception, standard', 1, datetime('now'), datetime('now')),
('ut_bure_02', 'BUREAU', 'UT2 : Open Space', 'Postes informatiques', 2, datetime('now'), datetime('now')),
('ut_bure_03', 'BUREAU', 'UT3 : Bureaux Fermés', 'Bureaux direction', 3, datetime('now'), datetime('now')),
('ut_bure_04', 'BUREAU', 'UT4 : Salle Réunion', 'Réunions, visio', 4, datetime('now'), datetime('now')),
('ut_bure_05', 'BUREAU', 'UT5 : Reprographie', 'Imprimantes, archives', 5, datetime('now'), datetime('now')),
('ut_bure_06', 'BUREAU', 'UT6 : Locaux Communs', 'Cuisine, sanitaires', 6, datetime('now'), datetime('now'));

-- BATIMENT
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_bati_01', 'BATIMENT', 'UT1 : Bureau Chantier', 'Administration', 1, datetime('now'), datetime('now')),
('ut_bati_02', 'BATIMENT', 'UT2 : Travaux Sol', 'Maçonnerie, fondations', 2, datetime('now'), datetime('now')),
('ut_bati_03', 'BATIMENT', 'UT3 : Travaux Hauteur', 'Échafaudages, toiture', 3, datetime('now'), datetime('now')),
('ut_bati_04', 'BATIMENT', 'UT4 : Second Œuvre', 'Plâtrerie, peinture', 4, datetime('now'), datetime('now')),
('ut_bati_05', 'BATIMENT', 'UT5 : Stockage', 'Matériaux, engins', 5, datetime('now'), datetime('now')),
('ut_bati_06', 'BATIMENT', 'UT6 : Base Vie', 'Vestiaires, réfectoire', 6, datetime('now'), datetime('now'));

-- HOTELLERIE
INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_hote_01', 'HOTELLERIE', 'UT1 : Réception', 'Accueil, check-in/out', 1, datetime('now'), datetime('now')),
('ut_hote_02', 'HOTELLERIE', 'UT2 : Étages / Chambres', 'Entretien chambres', 2, datetime('now'), datetime('now')),
('ut_hote_03', 'HOTELLERIE', 'UT3 : Lingerie', 'Lavage, repassage', 3, datetime('now'), datetime('now')),
('ut_hote_04', 'HOTELLERIE', 'UT4 : Espaces Communs', 'Lobby, couloirs', 4, datetime('now'), datetime('now')),
('ut_hote_05', 'HOTELLERIE', 'UT5 : Restaurant', 'Petit-déjeuner', 5, datetime('now'), datetime('now')),
('ut_hote_06', 'HOTELLERIE', 'UT6 : Locaux Techniques', 'Maintenance', 6, datetime('now'), datetime('now'));

-- ============================================
-- VÉRIFICATION
-- ============================================

SELECT '=== SEED TERMINÉ ===' as status;
SELECT 'Métiers: ' || COUNT(*) FROM metiers_icpp;
SELECT 'Catégories: ' || COUNT(*) FROM risques_categories;
SELECT 'Plans: ' || COUNT(*) FROM plans_tarifaires;
SELECT 'UTs: ' || COUNT(*) FROM unites_travail;
