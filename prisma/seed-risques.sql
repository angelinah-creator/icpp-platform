-- Script de seed pour les données de test des risques
-- À exécuter manuellement ou via Prisma seed

-- 1. CATÉGORIES DE RISQUES
INSERT INTO risques_categories (id, code, nom, description, ordre, "createdAt", "updatedAt") VALUES
('cat_physique', 'PHYSIQUE', 'Risques physiques', 'Risques liés aux conditions physiques de travail', 1, NOW(), NOW()),
('cat_chimique', 'CHIMIQUE', 'Risques chimiques', 'Exposition à des substances dangereuses', 2, NOW(), NOW()),
('cat_biologique', 'BIOLOGIQUE', 'Risques biologiques', 'Exposition à des agents biologiques', 3, NOW(), NOW()),
('cat_ergonomique', 'ERGONOMIQUE', 'Risques ergonomiques', 'Troubles musculo-squelettiques et postures', 4, NOW(), NOW()),
('cat_psychosocial', 'PSYCHOSOCIAL', 'Risques psychosociaux', 'Stress, harcèlement, surcharge', 5, NOW(), NOW()),
('cat_electrique', 'ELECTRIQUE', 'Risques électriques', 'Exposition aux installations électriques', 6, NOW(), NOW());

-- 2. EXEMPLES DE RISQUES MÉTIER (à adapter selon les métiers existants)
-- Note: Remplacer les metierCode par les codes réels de votre base

-- Risques physiques communs
INSERT INTO "RisqueMetier" (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
('risk_001', 'PHYSIQUE', 'COMMERCE', 'Chute de plain-pied', 'Glissade ou trébuchement sur sol mouillé ou encombré', 'MOYEN', 3, '["Sol antidérapant", "Signalétique sol mouillé", "Rangement régulier des allées"]', true, NOW(), NOW()),
('risk_002', 'PHYSIQUE', 'COMMERCE', 'Chute de hauteur', 'Utilisation d''escabeaux ou échelles pour rayonnage', 'ELEVE', 2, '["Formation utilisation échelles", "Équipements conformes", "Harnais si nécessaire"]', true, NOW(), NOW()),
('risk_003', 'PHYSIQUE', 'RESTAURATION', 'Brûlures thermiques', 'Contact avec surfaces chaudes en cuisine', 'ELEVE', 4, '["Gants thermiques", "Signalétique surfaces chaudes", "Formation manipulation"]', true, NOW(), NOW()),

-- Risques chimiques
('risk_004', 'CHIMIQUE', 'NETTOYAGE', 'Exposition aux produits de nettoyage', 'Inhalation ou contact cutané avec détergents', 'MOYEN', 4, '["Ventilation adéquate", "EPI: gants, masque", "Fiches de données sécurité"]', true, NOW(), NOW()),
('risk_005', 'CHIMIQUE', 'COIFFURE', 'Exposition aux produits capillaires', 'Contact avec colorations et décolorations', 'MOYEN', 5, '["Gants nitrile", "Ventilation salon", "Rotation des tâches"]', true, NOW(), NOW()),

-- Risques ergonomiques
('risk_006', 'ERGONOMIQUE', 'COMMERCE', 'Manutention manuelle', 'Port de charges lourdes lors des livraisons', 'MOYEN', 4, '["Aide à la manutention", "Formation gestes et postures", "Limitation des charges"]', true, NOW(), NOW()),
('risk_007', 'ERGONOMIQUE', 'BUREAUTIQUE', 'Travail sur écran', 'Station prolongée devant ordinateur', 'FAIBLE', 5, '["Écran à bonne hauteur", "Pauses régulières", "Siège ergonomique"]', true, NOW(), NOW()),

-- Risques psychosociaux
('risk_008', 'PSYCHOSOCIAL', 'COMMERCE', 'Relation clientèle difficile', 'Gestion des clients mécontents ou agressifs', 'MOYEN', 3, '["Formation gestion conflits", "Procédure d''escalade", "Soutien managérial"]', true, NOW(), NOW()),
('risk_009', 'PSYCHOSOCIAL', 'RESTAURATION', 'Horaires atypiques', 'Travail en soirée, week-end, jours fériés', 'MOYEN', 4, '["Planning équilibré", "Compensation repos", "Rotation équipes"]', true, NOW(), NOW()),

-- Risques électriques
('risk_010', 'ELECTRIQUE', 'BUREAUTIQUE', 'Équipements électriques', 'Utilisation d''appareils électriques de bureau', 'FAIBLE', 2, '["Vérification périodique", "Prises conformes", "Pas de multiprises en cascade"]', true, NOW(), NOW());

-- Instructions de vérification:
-- SELECT * FROM risques_categories ORDER BY ordre;
-- SELECT rm.nom, rc.nom as categorie, m.nom as metier, rm.gravite, rm."isActive"
-- FROM "RisqueMetier" rm
-- JOIN risques_categories rc ON rm."categorieCode" = rc.code
-- JOIN "MetierICPP" m ON rm."metierCode" = m.code
-- ORDER BY rc.ordre, rm.nom;
