-- ====================================================================
-- SEED COMPLET UNITÉS DE TRAVAIL (UT) PAR MÉTIER
-- Date: 2026-02-05
-- ====================================================================

-- Ce script crée 6 UTs par métier selon la structure DUERP ICPP
-- Chaque métier a une structure similaire adaptée à son contexte

-- ============================================
-- COIFFURE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_coif_01', 'COIFFURE', 'UT1 : Accueil / Caisse', 'Espace accueil clients, encaissement, prise de RDV', 1, datetime('now'), datetime('now')),
('ut_coif_02', 'COIFFURE', 'UT2 : Poste Coupe / Coiffage', 'Zone de coupe, coiffage et styling', 2, datetime('now'), datetime('now')),
('ut_coif_03', 'COIFFURE', 'UT3 : Zone Bac / Shampoing', 'Espace lavage, soins et shampoings', 3, datetime('now'), datetime('now')),
('ut_coif_04', 'COIFFURE', 'UT4 : Zone Technique (Coloration)', 'Zone de coloration, permanentes, produits chimiques', 4, datetime('now'), datetime('now')),
('ut_coif_05', 'COIFFURE', 'UT5 : Réserve / Stockage', 'Stockage produits et matériel', 5, datetime('now'), datetime('now')),
('ut_coif_06', 'COIFFURE', 'UT6 : Locaux Sociaux / Entretien', 'Vestiaires, sanitaires, entretien général', 6, datetime('now'), datetime('now'));

-- ============================================
-- ESTHÉTIQUE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_esth_01', 'ESTHETIQUE', 'UT1 : Accueil / Vente', 'Réception clients, vente produits, encaissement', 1, datetime('now'), datetime('now')),
('ut_esth_02', 'ESTHETIQUE', 'UT2 : Cabine Soins Visage', 'Soins du visage, maquillage', 2, datetime('now'), datetime('now')),
('ut_esth_03', 'ESTHETIQUE', 'UT3 : Cabine Soins Corps', 'Soins corporels, massages, épilations', 3, datetime('now'), datetime('now')),
('ut_esth_04', 'ESTHETIQUE', 'UT4 : Espace Manucure / Pédicure', 'Onglerie, prothèses ongulaires', 4, datetime('now'), datetime('now')),
('ut_esth_05', 'ESTHETIQUE', 'UT5 : Réserve / Produits', 'Stockage produits cosmétiques', 5, datetime('now'), datetime('now')),
('ut_esth_06', 'ESTHETIQUE', 'UT6 : Locaux Techniques', 'Buanderie, entretien, locaux sociaux', 6, datetime('now'), datetime('now'));

-- ============================================
-- RESTAURATION (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_rest_01', 'RESTAURATION', 'UT1 : Salle / Service', 'Salle de restaurant, service client, terrasse', 1, datetime('now'), datetime('now')),
('ut_rest_02', 'RESTAURATION', 'UT2 : Cuisine / Zone Chaude', 'Poste de cuisson, fours, plaques', 2, datetime('now'), datetime('now')),
('ut_rest_03', 'RESTAURATION', 'UT3 : Préparation / Zone Froide', 'Préparation des aliments, découpe', 3, datetime('now'), datetime('now')),
('ut_rest_04', 'RESTAURATION', 'UT4 : Plonge / Laverie', 'Lavage vaisselle, nettoyage matériel', 4, datetime('now'), datetime('now')),
('ut_rest_05', 'RESTAURATION', 'UT5 : Stockage / Chambre Froide', 'Réserves, chambres froides, congélateurs', 5, datetime('now'), datetime('now')),
('ut_rest_06', 'RESTAURATION', 'UT6 : Réception / Livraisons', 'Zone de réception marchandises', 6, datetime('now'), datetime('now'));

-- ============================================
-- BOULANGERIE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_boul_01', 'BOULANGERIE', 'UT1 : Boutique / Vente', 'Espace vente, encaissement', 1, datetime('now'), datetime('now')),
('ut_boul_02', 'BOULANGERIE', 'UT2 : Fournil', 'Fabrication du pain, pétrissage, cuisson', 2, datetime('now'), datetime('now')),
('ut_boul_03', 'BOULANGERIE', 'UT3 : Laboratoire Pâtisserie', 'Fabrication pâtisseries et viennoiseries', 3, datetime('now'), datetime('now')),
('ut_boul_04', 'BOULANGERIE', 'UT4 : Zone Fours / Chambres de Pousse', 'Fours, chambres de fermentation', 4, datetime('now'), datetime('now')),
('ut_boul_05', 'BOULANGERIE', 'UT5 : Stockage / Réserve', 'Stockage matières premières, ingrédients', 5, datetime('now'), datetime('now')),
('ut_boul_06', 'BOULANGERIE', 'UT6 : Locaux Annexes', 'Vestiaires, sanitaires, entretien', 6, datetime('now'), datetime('now'));

-- ============================================
-- COMMERCE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_comm_01', 'COMMERCE', 'UT1 : Accueil / Caisse', 'Accueil clients, encaissement', 1, datetime('now'), datetime('now')),
('ut_comm_02', 'COMMERCE', 'UT2 : Surface de Vente', 'Rayons, présentation produits', 2, datetime('now'), datetime('now')),
('ut_comm_03', 'COMMERCE', 'UT3 : Cabines Essayage', 'Espace cabines (si textile)', 3, datetime('now'), datetime('now')),
('ut_comm_04', 'COMMERCE', 'UT4 : Réserve / Stock', 'Stockage marchandises, réassort', 4, datetime('now'), datetime('now')),
('ut_comm_05', 'COMMERCE', 'UT5 : Zone Réception', 'Réception livraisons, déballage', 5, datetime('now'), datetime('now')),
('ut_comm_06', 'COMMERCE', 'UT6 : Locaux Sociaux', 'Bureau, vestiaires, sanitaires', 6, datetime('now'), datetime('now'));

-- ============================================
-- GARAGE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_gara_01', 'GARAGE', 'UT1 : Accueil / Bureau', 'Réception clients, devis, facturation', 1, datetime('now'), datetime('now')),
('ut_gara_02', 'GARAGE', 'UT2 : Atelier Mécanique', 'Réparations mécaniques, ponts élévateurs', 2, datetime('now'), datetime('now')),
('ut_gara_03', 'GARAGE', 'UT3 : Zone Carrosserie / Peinture', 'Travaux de carrosserie, cabine de peinture', 3, datetime('now'), datetime('now')),
('ut_gara_04', 'GARAGE', 'UT4 : Fosse / Vidange', 'Zone vidange, fosse de visite', 4, datetime('now'), datetime('now')),
('ut_gara_05', 'GARAGE', 'UT5 : Stockage Pièces / Produits', 'Pièces détachées, huiles, produits', 5, datetime('now'), datetime('now')),
('ut_gara_06', 'GARAGE', 'UT6 : Parking / Extérieur', 'Circulation véhicules, stationnement', 6, datetime('now'), datetime('now'));

-- ============================================
-- NETTOYAGE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_nett_01', 'NETTOYAGE', 'UT1 : Préparation / Base', 'Préparation matériel, chargement véhicule', 1, datetime('now'), datetime('now')),
('ut_nett_02', 'NETTOYAGE', 'UT2 : Nettoyage Sols', 'Aspiration, lavage, décapage sols', 2, datetime('now'), datetime('now')),
('ut_nett_03', 'NETTOYAGE', 'UT3 : Nettoyage Sanitaires', 'Entretien sanitaires, désinfection', 3, datetime('now'), datetime('now')),
('ut_nett_04', 'NETTOYAGE', 'UT4 : Nettoyage Vitres / Hauteur', 'Vitrerie, travaux en hauteur', 4, datetime('now'), datetime('now')),
('ut_nett_05', 'NETTOYAGE', 'UT5 : Gestion Déchets', 'Tri, évacuation, containers', 5, datetime('now'), datetime('now')),
('ut_nett_06', 'NETTOYAGE', 'UT6 : Déplacements', 'Transport entre sites clients', 6, datetime('now'), datetime('now'));

-- ============================================
-- BUREAU (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_bure_01', 'BUREAU', 'UT1 : Accueil / Réception', 'Réception visiteurs, standard téléphonique', 1, datetime('now'), datetime('now')),
('ut_bure_02', 'BUREAU', 'UT2 : Espace Open Space', 'Postes de travail informatiques', 2, datetime('now'), datetime('now')),
('ut_bure_03', 'BUREAU', 'UT3 : Bureaux Individuels', 'Bureaux fermés, direction', 3, datetime('now'), datetime('now')),
('ut_bure_04', 'BUREAU', 'UT4 : Salle de Réunion', 'Espaces de réunion, visioconférence', 4, datetime('now'), datetime('now')),
('ut_bure_05', 'BUREAU', 'UT5 : Espace Reprographie', 'Imprimantes, photocopieurs, archives', 5, datetime('now'), datetime('now')),
('ut_bure_06', 'BUREAU', 'UT6 : Locaux Communs', 'Cuisine, sanitaires, circulations', 6, datetime('now'), datetime('now'));

-- ============================================
-- BATIMENT (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_bati_01', 'BATIMENT', 'UT1 : Bureau / Administration', 'Bureau de chantier, administratif', 1, datetime('now'), datetime('now')),
('ut_bati_02', 'BATIMENT', 'UT2 : Travaux au Sol', 'Fondations, maçonnerie, gros œuvre', 2, datetime('now'), datetime('now')),
('ut_bati_03', 'BATIMENT', 'UT3 : Travaux en Hauteur', 'Échafaudages, toiture, façades', 3, datetime('now'), datetime('now')),
('ut_bati_04', 'BATIMENT', 'UT4 : Travaux Second Œuvre', 'Plâtrerie, peinture, finitions', 4, datetime('now'), datetime('now')),
('ut_bati_05', 'BATIMENT', 'UT5 : Zone Stockage Chantier', 'Matériaux, équipements, engins', 5, datetime('now'), datetime('now')),
('ut_bati_06', 'BATIMENT', 'UT6 : Base Vie', 'Vestiaires, sanitaires, réfectoire chantier', 6, datetime('now'), datetime('now'));

-- ============================================
-- HOTELLERIE (6 UTs)
-- ============================================

INSERT OR REPLACE INTO unites_travail (id, metierCode, nom, description, ordre, createdAt, updatedAt) VALUES
('ut_hote_01', 'HOTELLERIE', 'UT1 : Réception / Hall', 'Accueil clients, check-in/out', 1, datetime('now'), datetime('now')),
('ut_hote_02', 'HOTELLERIE', 'UT2 : Étages / Chambres', 'Entretien chambres, service étages', 2, datetime('now'), datetime('now')),
('ut_hote_03', 'HOTELLERIE', 'UT3 : Lingerie / Buanderie', 'Lavage, repassage, stockage linge', 3, datetime('now'), datetime('now')),
('ut_hote_04', 'HOTELLERIE', 'UT4 : Espaces Communs', 'Lobby, couloirs, ascenseurs', 4, datetime('now'), datetime('now')),
('ut_hote_05', 'HOTELLERIE', 'UT5 : Restaurant / Petit-déjeuner', 'Salle petit-déjeuner, service', 5, datetime('now'), datetime('now')),
('ut_hote_06', 'HOTELLERIE', 'UT6 : Locaux Techniques', 'Maintenance, chaufferie, stockage', 6, datetime('now'), datetime('now'));

-- ============================================
-- VÉRIFICATION
-- ============================================

SELECT '=== SEED UNITÉS DE TRAVAIL TERMINÉ ===' as status;
SELECT metierCode, COUNT(*) as nb_uts FROM unites_travail GROUP BY metierCode ORDER BY metierCode;
SELECT 'Total UTs: ' || COUNT(*) as total FROM unites_travail;
