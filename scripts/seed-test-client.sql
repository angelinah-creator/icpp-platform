-- ===== CLIENT TEST COMPLET =====
-- Email: client.test@icpp.fr / Même mot de passe que l'admin

BEGIN;

-- 1. Créer l'entreprise
INSERT INTO companies (id, name, siret, "metierCode", "employeeCount", address, "postalCode", city, phone, email, "contactName", "contactRole", "contactEmail", "createdAt", "updatedAt")
VALUES (
  'cmp_test_client_001',
  'Boulangerie Dupont',
  '98765432109876',
  'COIFFURE',
  8,
  '15 Rue de la Paix',
  '75002',
  'Paris',
  '01 42 00 00 00',
  'contact@boulangerie-dupont.fr',
  'Marie Dupont',
  'Gérante',
  'marie.dupont@boulangerie-dupont.fr',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer l'utilisateur client
INSERT INTO users (id, email, name, password, role, phone, "companyId", "createdAt", "updatedAt")
VALUES (
  'usr_test_client_001',
  'client.test@icpp.fr',
  'Marie Dupont',
  '$2b$10$J7vLvJoHX9xOz0L7V2uu9O0T5r.CqRYBT9F5Fy7B6Q0VJh0rB5x/K',
  'CLIENT',
  '06 12 34 56 78',
  'cmp_test_client_001',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Abonnement PRO (expire dans 200 jours)
INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd", "createdAt", "updatedAt")
VALUES (
  'sub_test_client_001',
  'cmp_test_client_001',
  'PRO',
  'ACTIVE',
  NOW() - INTERVAL '165 days',
  NOW() + INTERVAL '200 days',
  NOW(),
  NOW()
)
ON CONFLICT ("companyId") DO NOTHING;

-- 4. DUERP actif et signé
INSERT INTO duerp_documents (id, version, status, "companyId", "signedAt", "signedBy", "nextReviewDate", "createdAt", "updatedAt")
VALUES (
  'duerp_test_001',
  1,
  'ACTIVE',
  'cmp_test_client_001',
  NOW() - INTERVAL '30 days',
  'usr_test_client_001',
  NOW() + INTERVAL '335 days',
  NOW() - INTERVAL '30 days',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 5. Salariés (8 salariés variés)
INSERT INTO salaries (id, "companyId", nom, prenom, poste, "uniteTravail", "dateEntree", "typeContrat", "isActive", "createdAt", "updatedAt") VALUES
('sal_test_001', 'cmp_test_client_001', 'Dupont', 'Marie', 'Gérante', 'Direction', '2018-03-15', 'CDI', true, NOW(), NOW()),
('sal_test_002', 'cmp_test_client_001', 'Martin', 'Lucas', 'Coiffeur Senior', 'Salon', '2020-01-10', 'CDI', true, NOW(), NOW()),
('sal_test_003', 'cmp_test_client_001', 'Bernard', 'Sophie', 'Coiffeuse', 'Salon', '2021-06-20', 'CDI', true, NOW(), NOW()),
('sal_test_004', 'cmp_test_client_001', 'Petit', 'Julie', 'Coloriste', 'Salon', '2022-09-01', 'CDI', true, NOW(), NOW()),
('sal_test_005', 'cmp_test_client_001', 'Moreau', 'Thomas', 'Apprenti coiffeur', 'Salon', '2025-09-01', 'APPRENTISSAGE', true, NOW(), NOW()),
('sal_test_006', 'cmp_test_client_001', 'Garcia', 'Camille', 'Réceptionniste', 'Accueil', '2023-03-01', 'CDD', true, NOW(), NOW()),
('sal_test_007', 'cmp_test_client_001', 'Roux', 'Emma', 'Stagiaire', 'Salon', '2025-11-01', 'STAGE', true, NOW(), NOW()),
('sal_test_008', 'cmp_test_client_001', 'Lefebvre', 'Antoine', 'Barbier', 'Salon', '2024-01-15', 'CDI', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Affichages obligatoires (6 affichages)
INSERT INTO affichages (id, type, category, title, description, "companyId", version, "isLocked", downloaded, printed, "createdAt", "updatedAt") VALUES
('aff_test_001', 'INSPECTION_TRAVAIL', 'FICHE_1', 'Inspection du travail', 'Coordonnées de inspection du travail', 'cmp_test_client_001', 1, false, true, true, NOW() - INTERVAL '30 days', NOW()),
('aff_test_002', 'MEDECINE_TRAVAIL', 'FICHE_1', 'Médecine du travail', 'Coordonnées du service de médecine du travail', 'cmp_test_client_001', 1, false, true, false, NOW() - INTERVAL '30 days', NOW()),
('aff_test_003', 'REGLEMENT_INTERIEUR', 'FICHE_2', 'Règlement intérieur', 'Règlement intérieur de entreprise', 'cmp_test_client_001', 1, true, false, false, NOW() - INTERVAL '25 days', NOW()),
('aff_test_004', 'HORAIRES_TRAVAIL', 'FICHE_1', 'Horaires de travail', 'Horaires ouverture et de travail', 'cmp_test_client_001', 1, false, true, true, NOW() - INTERVAL '25 days', NOW()),
('aff_test_005', 'EGALITE_PROFESSIONNELLE', 'FICHE_2', 'Égalité professionnelle', 'Affichage égalité hommes/femmes', 'cmp_test_client_001', 1, true, false, false, NOW() - INTERVAL '20 days', NOW()),
('aff_test_006', 'INTERDICTION_FUMER', 'FICHE_2', 'Interdiction de fumer', 'Signalisation interdiction de fumer', 'cmp_test_client_001', 1, true, true, true, NOW() - INTERVAL '20 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. Signalements (3 signalements à différents statuts)
INSERT INTO signalements (id, "userId", "companyId", type, titre, description, status, "createdAt", "updatedAt") VALUES
('sig_test_001', 'usr_test_client_001', 'cmp_test_client_001', 'EQUIPEMENT', 'Nouveau bac de lavage installé', 'Un nouveau bac de lavage ergonomique a été installé dans le salon pour améliorer le confort des clients et réduire les TMS.', 'NOUVEAU', NOW() - INTERVAL '5 days', NOW()),
('sig_test_002', 'usr_test_client_001', 'cmp_test_client_001', 'INCIDENT', 'Glissade sur sol mouillé', 'Un salarié a glissé sur le sol mouillé près des bacs de lavage. Pas de blessure grave mais nécessité de revoir le protocole de nettoyage.', 'EN_COURS', NOW() - INTERVAL '10 days', NOW()),
('sig_test_003', 'usr_test_client_001', 'cmp_test_client_001', 'NOUVEL_EMBAUCHE', 'Recrutement apprenti coiffeur', 'Arrivée un nouvel apprenti coiffeur en septembre 2025.', 'TRAITE', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;
