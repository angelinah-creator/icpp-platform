-- ==========================================
-- Script de seed pour tester la gestion TPE
-- Exécuter: npx prisma db execute --file ./prisma/seed-tpe.sql
-- ==========================================

-- Auditeur de test (assurez-vous qu'il existe)
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'auditeur_tpe_test', 'auditeur.tpe@icpp.fr', 'Sophie Martin', 'AUDITEUR', '$2b$10$dummyhashforpassword', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'auditeur.tpe@icpp.fr');

-- Entreprises TPE de test
INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'tpe_coiffure_1', 'Salon Coiffure Élégance', '12345678901234', 'contact@elegance-coiffure.fr', '01 23 45 67 89', '15 rue des Ciseaux', '75009', 'Paris', 'COIFFURE', 4
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'tpe_coiffure_1');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'tpe_boulangerie_1', 'Boulangerie du Blé Doré', '98765432109876', 'ble.dore@boulangerie.fr', '01 98 76 54 32', '8 place du Marché', '69001', 'Lyon', 'BOULANGERIE', 6
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'tpe_boulangerie_1');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'tpe_restaurant_1', 'Restaurant Le Bon Goût', '45678912345678', 'reservation@lebongout.fr', '04 56 78 91 23', '22 avenue Gourmet', '13001', 'Marseille', 'RESTAURATION', 12
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'tpe_restaurant_1');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'tpe_garage_1', 'Auto Service Plus', '78912345678912', 'contact@autoserviceplus.fr', '03 78 91 23 45', '45 route de la Mécanique', '31000', 'Toulouse', 'GARAGE', 5
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'tpe_garage_1');

INSERT INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
SELECT 'tpe_beaute_1', 'Institut Beauté Zen', '32165498732165', 'rdv@beautezen.fr', '02 32 16 54 98', '10 rue du Bien-être', '44000', 'Nantes', 'ESTHETIQUE', 3
WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = 'tpe_beaute_1');

-- Abonnements pour les entreprises de test
INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_coiffure_1', 'tpe_coiffure_1', 'PREMIUM', 'ACTIVE', now(), now() + interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_coiffure_1');

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_boulangerie_1', 'tpe_boulangerie_1', 'ESSENTIEL', 'ACTIVE', now(), now() + interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_boulangerie_1');

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd")
SELECT 'sub_restaurant_1', 'tpe_restaurant_1', 'PRO', 'ACTIVE', now(), now() + interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM subscriptions WHERE id = 'sub_restaurant_1');

-- Message de confirmation
SELECT 'Données TPE insérées avec succès' as message;
