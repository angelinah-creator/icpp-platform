-- Seed affichages obligatoires de test (un seul document global par entreprise)
-- Supprime les anciens enregistrements UNIQUE
DELETE FROM affichages WHERE category = 'UNIQUE';

-- 1. Salon Belle Allure
INSERT INTO affichages (id, type, category, title, description, "companyId", "dynamicData", "isLocked", version, downloaded, printed, "createdAt", "updatedAt")
VALUES (
  'aff_test_salon_belle_allure_01',
  'GLOBAL', 'UNIQUE', 'Affichages Obligatoires A4', 'Document complet — A4 Paysage',
  'cmlkumhhu000m2v85li5jsu4x',
  '{"inspectionNom":"UD DIECCTE Réunion","inspectionAdresse":"6 rue du Stade Flamart, 97400 Saint-Denis","inspectionTelephone":"0262 40 26 00","inspectionHoraires":"Lundi-Vendredi 8h30-12h","medecineNom":"SISTBI Saint-Denis","medecineAdresse":"24 Avenue de la Victoire, 97400 Saint-Denis","medecineTelephone":"0262 21 08 91","medecinMedecin":"Dr. Marie-Claire Fontaine","referentNom":"Isabelle Morel","referentTelephone":"0692 12 34 56","horairesCollectifs":"Lundi-Vendredi 9h-18h","conventionIntitule":"Convention collective nationale de la coiffure","conventionIdcc":"2596","lieuConsultation":"Affichage au salon","urgenceSamu":"15","urgencePolice":"17","urgencePompiers":"18","duerp_lieu":"Direction — Salon Belle Allure","duerp_acces":"Sur demande","horairesLundi":"09:00 - 18:00","horairesMardi":"09:00 - 18:00","horairesMercredi":"09:00 - 18:00","horairesJeudi":"09:00 - 18:00","horairesVendredi":"09:00 - 18:00","horairesSamedi":"09:00 - 13:00","horairesDimanche":"Fermé","conges":"Consultable auprès du responsable","tempsPause":"30 min","horaireMatin":"09:00","horaireApresMidi":"14:00 - 18:00"}',
  false, 1, false, false, NOW(), NOW()
);

-- 2. Restaurant Le Créole
INSERT INTO affichages (id, type, category, title, description, "companyId", "dynamicData", "isLocked", version, downloaded, printed, "createdAt", "updatedAt")
VALUES (
  'aff_test_restaurant_creole_01',
  'GLOBAL', 'UNIQUE', 'Affichages Obligatoires A4', 'Document complet — A4 Paysage',
  'cmlkumhi0000o2v8575zsivde',
  '{"inspectionNom":"UD DIECCTE Réunion","inspectionAdresse":"6 rue du Stade Flamart, 97400 Saint-Denis","inspectionTelephone":"0262 40 26 10","inspectionHoraires":"Lundi-Vendredi 9h-12h","medecineNom":"SISTBI — Antenne Sud","medecineAdresse":"12 Rue des Flamboyants, 97430 Le Tampon","medecineTelephone":"0262 27 00 10","medecinMedecin":"Dr. Henri Beaumont","referentNom":"Jean-Pierre Grondin","referentTelephone":"0693 45 67 89","horairesCollectifs":"Mardi-Dimanche 11h-14h30 / 18h30-22h30","conventionIntitule":"Convention collective nationale CHR","conventionIdcc":"1979","lieuConsultation":"Bureau du gérant","urgenceSamu":"15","urgencePolice":"17","urgencePompiers":"18","duerp_lieu":"Bureau de direction","duerp_acces":"Sur demande","horairesLundi":"Fermé","horairesMardi":"11:00 - 22:30","horairesMercredi":"11:00 - 22:30","horairesJeudi":"11:00 - 22:30","horairesVendredi":"11:00 - 23:00","horairesSamedi":"11:00 - 23:00","horairesDimanche":"11:00 - 22:00","conges":"Consultable auprès du gérant","tempsPause":"45 min","horaireMatin":"11:00","horaireApresMidi":"18:30 - 22:30"}',
  false, 1, false, false, NOW(), NOW()
);

-- 3. Boulangerie du Lagon
INSERT INTO affichages (id, type, category, title, description, "companyId", "dynamicData", "isLocked", version, downloaded, printed, "createdAt", "updatedAt")
VALUES (
  'aff_test_boulangerie_lagon_01',
  'GLOBAL', 'UNIQUE', 'Affichages Obligatoires A4', 'Document complet — A4 Paysage',
  'cmluhroa7000j3wenbp3n6f6p',
  '{"inspectionNom":"UD DIECCTE Réunion — Antenne Ouest","inspectionAdresse":"6 rue du Stade Flamart, 97400 Saint-Denis","inspectionTelephone":"0262 40 26 20","inspectionHoraires":"Lundi-Vendredi 9h-12h","medecineNom":"SISTBI — Antenne Ouest","medecineAdresse":"8 Rue des Jacarandas, 97460 Saint-Paul","medecineTelephone":"0262 22 14 50","medecinMedecin":"Dr. Nathalie Clain","referentNom":"Chantal Payet","referentTelephone":"0692 78 90 12","horairesCollectifs":"Lundi-Samedi 5h-13h","conventionIntitule":"Convention nationale boulangerie-pâtisserie artisanale","conventionIdcc":"843","lieuConsultation":"Salle de pause","urgenceSamu":"15","urgencePolice":"17","urgencePompiers":"18","duerp_lieu":"Bureau du responsable","duerp_acces":"Libre sur demande","horairesLundi":"05:00 - 13:00","horairesMardi":"05:00 - 13:00","horairesMercredi":"05:00 - 13:00","horairesJeudi":"05:00 - 13:00","horairesVendredi":"05:00 - 13:00","horairesSamedi":"05:00 - 13:00","horairesDimanche":"Fermé","conges":"Consultable auprès du responsable","tempsPause":"20 min","horaireMatin":"05:00","horaireApresMidi":"—"}',
  false, 1, false, false, NOW(), NOW()
);

SELECT id, "companyId", category, title FROM affichages WHERE category = 'UNIQUE';
