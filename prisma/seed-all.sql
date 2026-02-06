-- ==========================================
-- SEED COMPLET - ICPP CONFORMITE
-- Exécuter: npx prisma db execute --file ./prisma/seed-all.sql
-- ==========================================

-- ==========================================
-- 1. PLANS D'ABONNEMENT
-- ==========================================
INSERT INTO plans (code, nom, description, prix, "dureeEnMois", "maxEmployees", features)
SELECT 'ESSENTIEL', 'Essentiel', 'Formule de base pour TPE', 29, 12, 10, '["DUERP simple", "Support email"]'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'ESSENTIEL');

INSERT INTO plans (code, nom, description, prix, "dureeEnMois", "maxEmployees", features)
SELECT 'PRO', 'Professionnel', 'Formule standard PME', 59, 12, 50, '["DUERP complet", "Mini-audits", "Support prioritaire"]'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'PRO');

INSERT INTO plans (code, nom, description, prix, "dureeEnMois", "maxEmployees", features)
SELECT 'PREMIUM', 'Premium', 'Formule complète entreprises', 99, 12, 200, '["DUERP complet", "Audits illimités", "Support dédié", "Formation"]'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'PREMIUM');

-- ==========================================
-- 2. MÉTIERS ICPP
-- ==========================================
INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'COIFFURE', 'Coiffure / Barbier', 'Salons de coiffure et barbiers', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'COIFFURE');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'BOULANGERIE', 'Boulangerie / Pâtisserie', 'Boulangeries et pâtisseries artisanales', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'BOULANGERIE');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'RESTAURATION', 'Restauration', 'Restaurants et services de restauration', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'RESTAURATION');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'GARAGE', 'Garage Automobile', 'Garages et mécanique automobile', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'GARAGE');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'ESTHETIQUE', 'Esthétique / Beauté', 'Instituts de beauté et soins esthétiques', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'ESTHETIQUE');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'BTP', 'Bâtiment / Construction', 'Entreprises du bâtiment et travaux publics', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'BTP');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'COMMERCE', 'Commerce de détail', 'Magasins et commerces', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'COMMERCE');

INSERT INTO metiers_icpp (code, nom, description, "isActive")
SELECT 'HOTELLERIE', 'Hôtellerie', 'Hôtels et hébergements', true
WHERE NOT EXISTS (SELECT 1 FROM metiers_icpp WHERE code = 'HOTELLERIE');

-- ==========================================
-- 3. CATÉGORIES DE RISQUES
-- ==========================================
INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'PHYSIQUES', 'Risques Physiques', 'Risques liés aux contraintes physiques et manutention', 1
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'PHYSIQUES');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'CHIMIQUES', 'Risques Chimiques', 'Exposition aux substances et produits chimiques', 2
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'CHIMIQUES');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'PSYCHOSOCIAUX', 'Risques Psychosociaux', 'Stress, harcèlement, charge mentale', 3
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'PSYCHOSOCIAUX');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'BIOLOGIQUES', 'Risques Biologiques', 'Agents biologiques et infectieux', 4
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'BIOLOGIQUES');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'INCENDIE', 'Risques Incendie/Explosion', 'Incendie, explosion, atmosphères dangereuses', 5
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'INCENDIE');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'ELECTRIQUES', 'Risques Électriques', 'Électrocution, brûlures électriques', 6
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'ELECTRIQUES');

-- ==========================================
-- 4. RISQUES MÉTIERS (Exemples)
-- ==========================================
INSERT INTO risques_metier (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive")
SELECT 'risque_coif_001', 'CHIMIQUES', 'COIFFURE', 'Exposition aux produits capillaires', 'Contact avec colorations, permanentes, défrisants', 'MODERE', 'FREQUENT', '["Port de gants obligatoire", "Ventilation adéquate", "Formation produits chimiques"]', true
WHERE NOT EXISTS (SELECT 1 FROM risques_metier WHERE id = 'risque_coif_001');

INSERT INTO risques_metier (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive")
SELECT 'risque_coif_002', 'PHYSIQUES', 'COIFFURE', 'Troubles musculo-squelettiques', 'Postures statiques prolongées, gestes répétitifs', 'IMPORTANT', 'FREQUENT', '["Tabourets ergonomiques", "Pauses régulières", "Exercices d étirement"]', true
WHERE NOT EXISTS (SELECT 1 FROM risques_metier WHERE id = 'risque_coif_002');

INSERT INTO risques_metier (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive")
SELECT 'risque_boul_001', 'PHYSIQUES', 'BOULANGERIE', 'Manutention de charges lourdes', 'Port de sacs de farine, manipulation de pétrin', 'IMPORTANT', 'QUOTIDIEN', '["Aide à la manutention", "Formation gestes et postures", "Équipements de levage"]', true
WHERE NOT EXISTS (SELECT 1 FROM risques_metier WHERE id = 'risque_boul_001');

INSERT INTO risques_metier (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive")
SELECT 'risque_boul_002', 'INCENDIE', 'BOULANGERIE', 'Risque incendie four', 'Utilisation de fours à haute température', 'GRAVE', 'PERMANENT', '["Extincteurs à proximité", "Formation incendie", "Maintenance préventive"]', true
WHERE NOT EXISTS (SELECT 1 FROM risques_metier WHERE id = 'risque_boul_002');

INSERT INTO risques_metier (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive")
SELECT 'risque_rest_001', 'BIOLOGIQUES', 'RESTAURATION', 'Risque alimentaire HACCP', 'Contamination des aliments', 'GRAVE', 'PERMANENT', '["Respect chaîne du froid", "Hygiène des mains", "Formation HACCP"]', true
WHERE NOT EXISTS (SELECT 1 FROM risques_metier WHERE id = 'risque_rest_001');

INSERT INTO risques_metier (id, "categorieCode", "metierCode", nom, description, gravite, frequence, "mesuresSuggerees", "isActive")
SELECT 'risque_rest_002', 'PHYSIQUES', 'RESTAURATION', 'Brûlures cuisine', 'Contact avec surfaces chaudes, huile bouillante', 'MODERE', 'FREQUENT', '["EPI adaptés", "Signalisation surfaces chaudes", "Formation premiers secours"]', true
WHERE NOT EXISTS (SELECT 1 FROM risques_metier WHERE id = 'risque_rest_002');

-- ==========================================
-- 5. UTILISATEURS DE TEST
-- Mot de passe hashé pour "Test123!" : $2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy
-- ==========================================

-- Admin
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'admin_test_001', 'admin@icpp-test.fr', 'Admin Test', 'ADMIN', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@icpp-test.fr');

-- Auditeur 1
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'auditeur_test_001', 'auditeur1@icpp-test.fr', 'Sophie Martin', 'AUDITOR', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'auditeur1@icpp-test.fr');

-- Auditeur 2
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'auditeur_test_002', 'auditeur2@icpp-test.fr', 'Pierre Durand', 'AUDITOR', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'auditeur2@icpp-test.fr');

-- Commercial 1
INSERT INTO users (id, email, name, role, phone, password, "emailVerified")
SELECT 'commercial_test_001', 'commercial1@icpp-test.fr', 'Marc Leblanc', 'COMMERCIAL', '06 11 22 33 44', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'commercial1@icpp-test.fr');

-- Commercial 2
INSERT INTO users (id, email, name, role, phone, password, "emailVerified")
SELECT 'commercial_test_002', 'commercial2@icpp-test.fr', 'Claire Moreau', 'COMMERCIAL', '06 22 33 44 55', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'commercial2@icpp-test.fr');

-- ==========================================
-- 6. ENTREPRISES TPE
-- ==========================================
INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'company_test_001', 'Salon Coiffure Élégance', '12345678901234', 'contact@elegance-coiffure.fr', '01 23 45 67 89', '15 rue des Ciseaux', '75009', 'Paris', 'COIFFURE', 4
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'company_test_001');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'company_test_002', 'Boulangerie du Blé Doré', '98765432109876', 'ble.dore@boulangerie.fr', '01 98 76 54 32', '8 place du Marché', '69001', 'Lyon', 'BOULANGERIE', 6
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'company_test_002');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'company_test_003', 'Restaurant Le Bon Goût', '45678912345678', 'reservation@lebongout.fr', '04 56 78 91 23', '22 avenue Gourmet', '13001', 'Marseille', 'RESTAURATION', 12
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'company_test_003');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'company_test_004', 'Auto Service Plus', '78912345678912', 'contact@autoserviceplus.fr', '03 78 91 23 45', '45 route de la Mécanique', '31000', 'Toulouse', 'GARAGE', 5
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'company_test_004');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'company_test_005', 'Institut Beauté Zen', '32165498732165', 'rdv@beautezen.fr', '02 32 16 54 98', '10 rue du Bien-être', '44000', 'Nantes', 'ESTHETIQUE', 3
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'company_test_005');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'company_test_006', 'Hôtel Le Repos', '11223344556677', 'reservation@hotelrepos.fr', '05 11 22 33 44', '1 boulevard Central', '33000', 'Bordeaux', 'HOTELLERIE', 15
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'company_test_006');

-- ==========================================
-- 7. ABONNEMENTS
-- ==========================================
INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_001', 'company_test_001', 'PREMIUM', 'ACTIVE', now(), now() + interval '365 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_001');

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_002', 'company_test_002', 'ESSENTIEL', 'ACTIVE', now(), now() + interval '365 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_002');

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_003', 'company_test_003', 'PRO', 'ACTIVE', now(), now() + interval '365 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_003');

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_004', 'company_test_004', 'ESSENTIEL', 'ACTIVE', now(), now() + interval '365 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_004');

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_005', 'company_test_005', 'PREMIUM', 'ACTIVE', now(), now() + interval '365 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_005');

-- ==========================================
-- 8. RÉGLEMENTATIONS
-- ==========================================
INSERT INTO reglementations (id, titre, description, type, "dateVigueur", "impactDuerp", "isActive", "metiersCodes")
SELECT 'regl_001', 'Code du Travail - Article L4121', 'Obligations générales de sécurité de l employeur', 'CODE_TRAVAIL', '2024-01-01', true, true, '[]'
WHERE NOT EXISTS (SELECT 1 FROM reglementations WHERE id = 'regl_001');

INSERT INTO reglementations (id, titre, description, type, "dateVigueur", "impactDuerp", "isActive", "metiersCodes")
SELECT 'regl_002', 'Règlement Sanitaire - HACCP', 'Normes d hygiène alimentaire obligatoires', 'DECRET', '2024-01-01', true, true, '["RESTAURATION", "BOULANGERIE"]'
WHERE NOT EXISTS (SELECT 1 FROM reglementations WHERE id = 'regl_002');

INSERT INTO reglementations (id, titre, description, type, "dateVigueur", "impactDuerp", "isActive", "metiersCodes")
SELECT 'regl_003', 'Décret ERP - Sécurité incendie', 'Réglementation incendie établissements recevant du public', 'DECRET', '2024-01-01', true, true, '["RESTAURATION", "HOTELLERIE", "COMMERCE"]'
WHERE NOT EXISTS (SELECT 1 FROM reglementations WHERE id = 'regl_003');

INSERT INTO reglementations (id, titre, description, type, "dateVigueur", "impactDuerp", "isActive", "metiersCodes")
SELECT 'regl_004', 'Arrêté coiffure - Produits chimiques', 'Encadrement utilisation produits capillaires', 'ARRETE', '2024-03-01', true, true, '["COIFFURE"]'
WHERE NOT EXISTS (SELECT 1 FROM reglementations WHERE id = 'regl_004');

-- ==========================================
-- 9. CLIENT UTILISATEUR (lié à une entreprise)
-- ==========================================
INSERT INTO users (id, email, name, role, password, "emailVerified", "companyId")
SELECT 'client_test_001', 'client@test.fr', 'Client Test Coiffure', 'CLIENT', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now(), 'company_test_001'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'client@test.fr');

-- ==========================================
-- 10. AUDITS DE TEST
-- ==========================================
INSERT INTO audits (id, "companyId", "auditorId", type, status, "dateAudit")
SELECT 'audit_test_001', 'company_test_001', 'auditeur_test_001', 'MINI_AUDIT', 'PLANIFIE', now() + interval '7 days'
WHERE NOT EXISTS (SELECT 1 FROM audits WHERE id = 'audit_test_001');

INSERT INTO audits (id, "companyId", "auditorId", type, status, "dateAudit")
SELECT 'audit_test_002', 'company_test_002', 'auditeur_test_001', 'INITIAL', 'EN_COURS', now() - interval '3 days'
WHERE NOT EXISTS (SELECT 1 FROM audits WHERE id = 'audit_test_002');

INSERT INTO audits (id, "companyId", "auditorId", type, status, "dateAudit")
SELECT 'audit_test_003', 'company_test_003', 'auditeur_test_002', 'ANNUAL', 'COMPLETED', now() - interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM audits WHERE id = 'audit_test_003');

-- ==========================================
-- 11. DUERP DE TEST
-- ==========================================
INSERT INTO duerp_documents (id, "companyId", status, "createdAt", "updatedAt")
SELECT 'duerp_test_001', 'company_test_001', 'SIGNED', now() - interval '60 days', now() - interval '55 days'
WHERE NOT EXISTS (SELECT 1 FROM duerp_documents WHERE id = 'duerp_test_001');

INSERT INTO duerp_documents (id, "companyId", status, "createdAt", "updatedAt")
SELECT 'duerp_test_002', 'company_test_002', 'DRAFT', now() - interval '5 days', now()
WHERE NOT EXISTS (SELECT 1 FROM duerp_documents WHERE id = 'duerp_test_002');

INSERT INTO duerp_documents (id, "companyId", status, "createdAt", "updatedAt")
SELECT 'duerp_test_003', 'company_test_003', 'PENDING_SIGNATURE', now() - interval '10 days', now() - interval '2 days'
WHERE NOT EXISTS (SELECT 1 FROM duerp_documents WHERE id = 'duerp_test_003');

-- ==========================================
-- CONFIRMATION
-- ==========================================
SELECT 'Seed complet exécuté avec succès - Toutes les données de test sont prêtes' as message;
