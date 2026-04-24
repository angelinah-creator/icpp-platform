-- ============================================================
-- SEED — Données de test complètes ICPP Platform
-- 3 entreprises × 3 secteurs : Snack, Commerce, Bureau
-- Mot de passe universel : Test1234!
-- ============================================================

-- Nettoyage des données de test précédentes (ordre inverse des FK)
DELETE FROM notifications WHERE id IN (
  'notif_admin_01','notif_admin_02','notif_admin_03','notif_admin_04','notif_admin_05','notif_admin_06',
  'notif_aud_01','notif_aud_02','notif_aud_03','notif_aud_04','notif_aud_05','notif_aud_06',
  'notif_sn_01','notif_sn_02','notif_sn_03',
  'notif_co_01','notif_co_02','notif_co_03',
  'notif_bu_01','notif_bu_02','notif_bu_03'
);
DELETE FROM evaluations_risques WHERE id IN (
  'ev_sn_01','ev_sn_02','ev_sn_03','ev_sn_04','ev_sn_05','ev_sn_06',
  'ev_co_01','ev_co_02','ev_co_03','ev_co_04','ev_co_05',
  'ev_bu_01','ev_bu_02','ev_bu_03'
);
DELETE FROM duerp_documents WHERE id IN ('duerp_snack_01','duerp_commerce_01','duerp_bureau_01');
DELETE FROM salaries WHERE id IN (
  'sal_sn_01','sal_sn_02','sal_sn_03','sal_sn_04','sal_sn_05',
  'sal_co_01','sal_co_02','sal_co_03','sal_co_04',
  'sal_bu_01','sal_bu_02','sal_bu_03','sal_bu_04','sal_bu_05','sal_bu_06'
);
DELETE FROM signalements WHERE id IN ('sig_sn_01','sig_sn_02','sig_co_01','sig_co_02','sig_bu_01');
DELETE FROM taches WHERE id IN ('tache_sn_01','tache_sn_02','tache_co_01','tache_co_02','tache_bu_01');
DELETE FROM affichages WHERE id IN ('aff_sn_01','aff_sn_02','aff_sn_03','aff_co_01','aff_co_02','aff_bu_01');
DELETE FROM audits WHERE id IN ('audit_sn_01','audit_co_01','audit_bu_01');
DELETE FROM subscriptions WHERE id IN ('sub_snack_01','sub_commerce_01','sub_bureau_01');
DELETE FROM users WHERE id IN ('usr_auditeur_test_01','usr_client_snack_01','usr_client_commerce_01','usr_client_bureau_01');
DELETE FROM companies WHERE id IN ('cmp_snack_01','cmp_commerce_01','cmp_bureau_01');

-- ============================================================
-- 1. ENTREPRISES (en premier car les users y font référence)
-- ============================================================

INSERT INTO companies (id, name, siret, address, city, "postalCode", phone, "metierCode", "employeeCount", "createdAt", "updatedAt")
VALUES
  ('cmp_snack_01','Le Snack du Marché','12345678900014','15 Rue du Marché','Lyon','69001','04 78 12 34 56','SNACK',8,NOW()-INTERVAL '60 days',NOW()),
  ('cmp_commerce_01','Boutique Mode & Style','23456789000025','42 Avenue de la République','Marseille','13001','04 91 23 45 67','COMMERCE',5,NOW()-INTERVAL '45 days',NOW()),
  ('cmp_bureau_01','Cabinet Renard Conseil','34567890100036','8 Place de la Mairie','Bordeaux','33000','05 56 78 90 12','BUREAU',12,NOW()-INTERVAL '20 days',NOW());

-- ============================================================
-- 2. UTILISATEURS (companyId référence les companies créées ci-dessus)
-- Password 'Test1234!' hashé avec bcrypt cost 10
-- ============================================================

INSERT INTO users (id, email, name, role, password, "companyId", "createdAt", "updatedAt")
VALUES
  ('usr_auditeur_test_01','auditeur.test@icpp.fr','Marc Leblanc','AUDITOR',
   '$2b$10$yaQRRcGhm2CJm3.k.R2i7ONaMHxPoBNAZEgpiYC2xdBZ8ZJy6x4Oi',
   NULL, NOW()-INTERVAL '30 days', NOW()),
  ('usr_client_snack_01','client.snack@demo.fr','Sophie Durand','CLIENT',
   '$2b$10$yaQRRcGhm2CJm3.k.R2i7ONaMHxPoBNAZEgpiYC2xdBZ8ZJy6x4Oi',
   'cmp_snack_01', NOW()-INTERVAL '60 days', NOW()),
  ('usr_client_commerce_01','client.commerce@demo.fr','Thomas Martin','CLIENT',
   '$2b$10$yaQRRcGhm2CJm3.k.R2i7ONaMHxPoBNAZEgpiYC2xdBZ8ZJy6x4Oi',
   'cmp_commerce_01', NOW()-INTERVAL '45 days', NOW()),
  ('usr_client_bureau_01','client.bureau@demo.fr','Isabelle Renard','CLIENT',
   '$2b$10$yaQRRcGhm2CJm3.k.R2i7ONaMHxPoBNAZEgpiYC2xdBZ8ZJy6x4Oi',
   'cmp_bureau_01', NOW()-INTERVAL '20 days', NOW());

-- Assigner l'auditeur aux entreprises
UPDATE companies SET "auditorId" = 'usr_auditeur_test_01'
WHERE id IN ('cmp_snack_01','cmp_commerce_01','cmp_bureau_01');

-- ============================================================
-- 3. ABONNEMENTS
-- ============================================================

INSERT INTO subscriptions (id, "companyId", "planCode", status, "currentPeriodStart", "currentPeriodEnd", "createdAt", "updatedAt")
VALUES
  ('sub_snack_01','cmp_snack_01','PRO','ACTIVE',NOW()-INTERVAL '60 days',NOW()+INTERVAL '305 days',NOW()-INTERVAL '60 days',NOW()),
  ('sub_commerce_01','cmp_commerce_01','PREMIUM','ACTIVE',NOW()-INTERVAL '45 days',NOW()+INTERVAL '320 days',NOW()-INTERVAL '45 days',NOW()),
  ('sub_bureau_01','cmp_bureau_01','ESSENTIEL','ACTIVE',NOW()-INTERVAL '20 days',NOW()+INTERVAL '345 days',NOW()-INTERVAL '20 days',NOW());

-- ============================================================
-- 4. SALARIÉS
-- ============================================================

INSERT INTO salaries (id, "companyId", nom, prenom, poste, "uniteTravail", "dateEntree", "typeContrat", "tempsTravail", "isActive", "createdAt", "updatedAt")
VALUES
  ('sal_sn_01','cmp_snack_01','Durand','Sophie','Gérante','UT1 — Direction / Gestion',NOW()-INTERVAL '5 years','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_sn_02','cmp_snack_01','Petit','Lucas','Cuisinier','UT2 — Cuisine / Préparation',NOW()-INTERVAL '2 years','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_sn_03','cmp_snack_01','Morel','Emma','Serveuse','UT3 — Service en Salle',NOW()-INTERVAL '1 year','CDI','PARTIEL',true,NOW(),NOW()),
  ('sal_sn_04','cmp_snack_01','Girard','Yanis','Plongeur','UT4 — Plonge / Nettoyage',NOW()-INTERVAL '6 months','CDD','COMPLET',true,NOW(),NOW()),
  ('sal_sn_05','cmp_snack_01','Bernard','Camille','Livreur','UT5 — Livraison',NOW()-INTERVAL '8 months','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_co_01','cmp_commerce_01','Martin','Thomas','Gérant','UT1 — Direction / Caisse',NOW()-INTERVAL '4 years','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_co_02','cmp_commerce_01','Dupont','Léa','Vendeuse','UT2 — Vente / Conseil client',NOW()-INTERVAL '18 months','CDI','PARTIEL',true,NOW(),NOW()),
  ('sal_co_03','cmp_commerce_01','Fontaine','Axel','Vendeur','UT2 — Vente / Conseil client',NOW()-INTERVAL '1 year','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_co_04','cmp_commerce_01','Leroy','Julie','Gestionnaire stock','UT3 — Stockage / Réserve',NOW()-INTERVAL '8 months','CDD','COMPLET',true,NOW(),NOW()),
  ('sal_bu_01','cmp_bureau_01','Renard','Isabelle','Directrice','UT1 — Direction',NOW()-INTERVAL '8 years','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_bu_02','cmp_bureau_01','Simon','Antoine','Conseiller clientèle','UT2 — Conseil client',NOW()-INTERVAL '3 years','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_bu_03','cmp_bureau_01','Laurent','Marie','Assistante administrative','UT3 — Administration',NOW()-INTERVAL '2 years','CDI','PARTIEL',true,NOW(),NOW()),
  ('sal_bu_04','cmp_bureau_01','Rousseau','Pierre','Expert-comptable','UT2 — Conseil client',NOW()-INTERVAL '4 years','CDI','COMPLET',true,NOW(),NOW()),
  ('sal_bu_05','cmp_bureau_01','Michel','Zoé','Stagiaire','UT3 — Administration',NOW()-INTERVAL '3 months','STAGE','COMPLET',true,NOW(),NOW()),
  ('sal_bu_06','cmp_bureau_01','Blanc','Romain','Responsable informatique','UT4 — Informatique',NOW()-INTERVAL '1 year','CDI','COMPLET',true,NOW(),NOW());

-- ============================================================
-- 5. DUERP DOCUMENTS
-- ============================================================

INSERT INTO duerp_documents (id, "companyId", version, status, "signedAt", "signedBy", "nextReviewDate", "createdAt", "updatedAt")
VALUES
  ('duerp_snack_01','cmp_snack_01',2,'ACTIVE',NOW()-INTERVAL '15 days','usr_client_snack_01',NOW()+INTERVAL '350 days',NOW()-INTERVAL '20 days',NOW()-INTERVAL '15 days'),
  ('duerp_commerce_01','cmp_commerce_01',1,'ACTIVE',NOW()-INTERVAL '5 days','usr_client_commerce_01',NOW()+INTERVAL '360 days',NOW()-INTERVAL '10 days',NOW()-INTERVAL '5 days'),
  ('duerp_bureau_01','cmp_bureau_01',1,'DRAFT',NULL,NULL,NOW()+INTERVAL '365 days',NOW()-INTERVAL '3 days',NOW());

-- ============================================================
-- 6. ÉVALUATIONS DE RISQUES (mesuresAppliquees requis)
-- ============================================================

INSERT INTO evaluations_risques (id, "duerpId", "risqueId", "uniteTravail", frequence, gravite, "niveauRisque", "mesuresAppliquees", observations, applicable, "actionCorrective", delai, responsable, ponderation, "risqueResiduel", "createdAt", "updatedAt")
VALUES
  -- Snack
  ('ev_sn_01','duerp_snack_01','rm_snack_05','UT2 — Cuisine',7,7,49,'Port de protège-mains imposé','Risque élevé identifié lors de l''audit',true,'Installer des protège-mains et former le personnel','1 mois','Gérante',0.5,24.5,NOW()-INTERVAL '15 days',NOW()),
  ('ev_sn_02','duerp_snack_01','rm_snack_01','UT3 — Service en Salle',7,3,21,'Pauses imposées 10 min/2h','Personnel sous tension en heures de pointe',true,'Mettre en place des pauses régulières','Immédiat','RH',0.35,7.35,NOW()-INTERVAL '15 days',NOW()),
  ('ev_sn_03','duerp_snack_01','rm_snack_07','UT4 — Plonge / Nettoyage',7,3,21,'Tapis antidérapants en plonge','Sol glissant en fin de service',true,'Poser des tapis antidérapants supplémentaires','2 semaines','Gérante',0.5,10.5,NOW()-INTERVAL '15 days',NOW()),
  ('ev_sn_04','duerp_snack_01','rm_snack_08','UT2 — Cuisine',3,10,30,'Contrôle mensuel friteuses','Contrôle mensuel préconisé',true,'Maintenance trimestrielle des friteuses','3 mois','Responsable cuisine',0.5,15.0,NOW()-INTERVAL '15 days',NOW()),
  ('ev_sn_05','duerp_snack_01','rm_snack_16','UT4 — Plonge / Nettoyage',7,7,49,'EPI obligatoires (gants, tablier)','Produits chimiques utilisés quotidiennement',true,'EPI obligatoires + affichage FDES','1 mois','Chef d''équipe',0.35,17.15,NOW()-INTERVAL '15 days',NOW()),
  ('ev_sn_06','duerp_snack_01','rm_snack_02','UT3 — Service en Salle',3,3,9,'Procédure gestion remontées clients','',true,'Formation gestion des conflits','6 mois','Gérante',1,9.0,NOW()-INTERVAL '15 days',NOW()),
  -- Commerce
  ('ev_co_01','duerp_commerce_01','rm_com_01','UT2 — Vente',7,3,21,'Objectifs individuels plafonnés','Objectifs de vente jugés trop élevés',true,'Réunions bimensuelles d''équipe','2 mois','Gérant',0.35,7.35,NOW()-INTERVAL '5 days',NOW()),
  ('ev_co_02','duerp_commerce_01','rm_com_07','UT3 — Stockage',7,3,21,'Allées dégagées mensuellement','Zone de stock encombrée',true,'Dégager allées + tapis antidérapants','1 mois','Gestionnaire stock',0.5,10.5,NOW()-INTERVAL '5 days',NOW()),
  ('ev_co_03','duerp_commerce_01','rm_com_08','UT2 — Vente',10,3,30,'Rotation 30 min caisse / rayon','TMS liés à la caisse toute la journée',true,'Rotation des tâches + ergonomie poste caisse','3 mois','Gérant',0.5,15.0,NOW()-INTERVAL '5 days',NOW()),
  ('ev_co_04','duerp_commerce_01','rm_com_13','UT3 — Stockage',3,3,9,'Produits rangés en espace ventilé','Produits de nettoyage stockés séparément',true,'','','',1,9.0,NOW()-INTERVAL '5 days',NOW()),
  ('ev_co_05','duerp_commerce_01','rm_com_06','UT1 — Direction',3,7,21,'Coffre-fort verrouillé nuit','Vols constatés deux fois par an',true,'Installer caméra + coffre-fort','2 mois','Gérant',0.5,10.5,NOW()-INTERVAL '5 days',NOW()),
  -- Bureau
  ('ev_bu_01','duerp_bureau_01','rm_bur_04','UT2 — Conseil client',10,3,30,'Réaménagement de planning','RPS fréquents en période de clôture comptable',true,'Formation gestion du stress + télétravail partiel','3 mois','DRH',0.35,10.5,NOW()-INTERVAL '2 days',NOW()),
  ('ev_bu_02','duerp_bureau_01','rm_bur_01','UT3 — Administration',10,1,10,'Filtre écran + fauteuil réglable','TMS liés aux postes informatiques',true,'Audit postes de travail + réglage écrans','1 mois','Responsable informatique',0.5,5.0,NOW()-INTERVAL '2 days',NOW()),
  ('ev_bu_03','duerp_bureau_01','rm_bur_03','UT2 — Conseil client',3,3,9,'Médiation disponible sur demande','Conflits relationnels ponctuels',true,'','','',1,9.0,NOW()-INTERVAL '2 days',NOW());

-- ============================================================
-- 7. AFFICHAGES OBLIGATOIRES
-- ============================================================

INSERT INTO affichages (id, type, category, title, description, "companyId", version, "isLocked", downloaded, "createdAt", "updatedAt")
VALUES
  ('aff_sn_01','DUERP','FICHE_1','DUERP — Document Unique v2','Document Unique d''Évaluation des Risques Professionnels — Signé le '||(NOW()-INTERVAL '15 days')::date::text,'cmp_snack_01',1,false,true,NOW()-INTERVAL '15 days',NOW()),
  ('aff_sn_02','REGLEMENTATION','FICHE_2','Règlement intérieur','Règlement intérieur applicable au personnel de la restauration rapide.','cmp_snack_01',1,false,true,NOW()-INTERVAL '15 days',NOW()),
  ('aff_sn_03','SECURITE','FICHE_3','Consignes incendie','Consignes sécurité incendie — Extincteurs révisés le 01/01/2026.','cmp_snack_01',1,false,false,NOW()-INTERVAL '15 days',NOW()),
  ('aff_co_01','DUERP','FICHE_1','DUERP — Document Unique v1','Document Unique d''Évaluation des Risques Professionnels — Signé le '||(NOW()-INTERVAL '5 days')::date::text,'cmp_commerce_01',1,false,true,NOW()-INTERVAL '5 days',NOW()),
  ('aff_co_02','JURIDIQUE','FICHE_4','Affichage RGPD','Information sur le traitement des données clients conformément au RGPD.','cmp_commerce_01',1,false,false,NOW()-INTERVAL '5 days',NOW()),
  ('aff_bu_01','MEDECINE','FICHE_5','Coordonnées médecin du travail','Service de Santé au Travail — 12 Rue de la Santé, Bordeaux — 05 56 00 00 00.','cmp_bureau_01',1,false,false,NOW()-INTERVAL '3 days',NOW());

-- ============================================================
-- 8. SIGNALEMENTS
-- ============================================================

INSERT INTO signalements (id, "companyId", "userId", type, titre, description, status, "createdAt", "updatedAt")
VALUES
  ('sig_sn_01','cmp_snack_01','usr_client_snack_01','EQUIPEMENT','Panne lave-vaisselle professionnel','Lave-vaisselle professionnel en panne depuis 3 jours. Risque hygiénique important.','NOUVEAU',NOW()-INTERVAL '4 days',NOW()),
  ('sig_sn_02','cmp_snack_01','usr_client_snack_01','INCIDENT','Glissade en cuisine — quasi-accident','Glissade d''un employé sur sol gras. Pas de blessure grave mais déclaration requise.','EN_COURS',NOW()-INTERVAL '10 days',NOW()-INTERVAL '8 days'),
  ('sig_co_01','cmp_commerce_01','usr_client_commerce_01','NOUVEL_EMBAUCHE','Nouvel embauché : Pierre Marchand','Nouveau vendeur en CDI. Mise à jour du DUERP nécessaire.','NOUVEAU',NOW()-INTERVAL '2 days',NOW()),
  ('sig_co_02','cmp_commerce_01','usr_client_commerce_01','DEMENAGEMENT','Déménagement du stock au sous-sol','Nouveaux risques ergonomiques à évaluer suite au déménagement.','NOUVEAU',NOW()-INTERVAL '1 day',NOW()),
  ('sig_bu_01','cmp_bureau_01','usr_client_bureau_01','EQUIPEMENT','3 nouvelles stations informatiques','Nouvelles stations USB-C installées. Évaluation des risques électriques demandée.','NOUVEAU',NOW()-INTERVAL '1 day',NOW());

-- ============================================================
-- 9. TÂCHES
-- ============================================================

INSERT INTO taches (id, "companyId", titre, description, type, status, priorite, echeance, "assigneId", "createdAt", "updatedAt")
VALUES
  ('tache_sn_01','cmp_snack_01','Mise à jour DUERP suite glissade','Réaliser une réévaluation des risques cuisine après l''incident déclaré.','DUERP','EN_COURS','HAUTE',NOW()+INTERVAL '7 days','usr_auditeur_test_01',NOW()-INTERVAL '8 days',NOW()),
  ('tache_sn_02','cmp_snack_01','Vérification EPI plonge','Contrôler la disponibilité et l''usage des EPI (gants, tabliers, bottes).','INSPECTION','A_FAIRE','HAUTE',NOW()+INTERVAL '3 days','usr_auditeur_test_01',NOW()-INTERVAL '5 days',NOW()),
  ('tache_co_01','cmp_commerce_01','Audit annuel Boutique Mode & Style','Planifier et réaliser l''audit réglementaire annuel.','AUDIT','A_FAIRE','MOYENNE',NOW()+INTERVAL '14 days','usr_auditeur_test_01',NOW()-INTERVAL '2 days',NOW()),
  ('tache_co_02','cmp_commerce_01','DUERP — Intégration nouveau salarié','Mettre à jour le DUERP suite à l''embauche de Pierre Marchand.','DUERP','A_FAIRE','FAIBLE',NOW()+INTERVAL '21 days','usr_auditeur_test_01',NOW()-INTERVAL '1 day',NOW()),
  ('tache_bu_01','cmp_bureau_01','Premier audit Cabinet Renard','Réaliser le premier audit complet pour ce nouveau client Premium.','AUDIT','A_FAIRE','HAUTE',NOW()+INTERVAL '5 days','usr_auditeur_test_01',NOW()-INTERVAL '1 day',NOW());

-- ============================================================
-- 10. AUDITS
-- ============================================================

INSERT INTO audits (id, "companyId", "auditorId", type, status, "dateAudit", "dateRealisation", "scoreConformite", observations, "createdAt", "updatedAt")
VALUES
  ('audit_sn_01','cmp_snack_01','usr_auditeur_test_01','ANNUEL','REALISE',NOW()-INTERVAL '20 days',NOW()-INTERVAL '18 days',72,'DUERP mis à jour. Risques cuisine critiques identifiés. Plan d''action transmis au gérant.',NOW()-INTERVAL '25 days',NOW()-INTERVAL '18 days'),
  ('audit_co_01','cmp_commerce_01','usr_auditeur_test_01','INITIAL','REALISE',NOW()-INTERVAL '8 days',NOW()-INTERVAL '6 days',85,'Excellent niveau de conformité. Quelques TMS à surveiller. DUERP signé sans réserve.',NOW()-INTERVAL '10 days',NOW()-INTERVAL '6 days'),
  ('audit_bu_01','cmp_bureau_01','usr_auditeur_test_01','INITIAL','PLANIFIE',NOW()+INTERVAL '5 days',NULL,NULL,'Premier audit planifié pour ce nouveau client Cabinet Renard Conseil.',NOW()-INTERVAL '1 day',NOW());

-- ============================================================
-- 11. NOTIFICATIONS (déjà insérées, réinsertion sécurisée)
-- ============================================================

INSERT INTO notifications (id, type, title, message, "userId", read, "actionUrl", "createdAt")
VALUES
  -- Admin (userId = NULL)
  ('notif_admin_01','SIGNALEMENT_RECU','Signalement urgent — Snack du Marché','Panne lave-vaisselle signalée par Le Snack du Marché.',NULL,false,'/admin/signalements',NOW()-INTERVAL '4 days'),
  ('notif_admin_02','DUERP_SIGNE','DUERP signé — Le Snack du Marché','Le DUERP v2 a été signé électroniquement par Sophie Durand.',NULL,false,'/admin/duerp',NOW()-INTERVAL '15 days'),
  ('notif_admin_03','DUERP_SIGNE','DUERP signé — Boutique Mode & Style','Le DUERP v1 a été signé par Thomas Martin. Archivage effectué.',NULL,false,'/admin/duerp',NOW()-INTERVAL '5 days'),
  ('notif_admin_04','NOUVEAU_CLIENT','Nouveau client inscrit','Cabinet Renard Conseil vient de rejoindre la plateforme.',NULL,true,'/admin/entreprises',NOW()-INTERVAL '20 days'),
  ('notif_admin_05','AUDIT_PLANIFIE','Audit planifié — Cabinet Renard','Marc Leblanc a planifié un audit initial pour Cabinet Renard Conseil.',NULL,false,'/admin/audits',NOW()-INTERVAL '1 day'),
  ('notif_admin_06','SIGNALEMENT_RECU','Signalement — Boutique Mode & Style','Déménagement stock signalé par Boutique Mode & Style.',NULL,false,'/admin/signalements',NOW()-INTERVAL '1 day'),
  -- Auditeur
  ('notif_aud_01','NOUVEAU_SIGNALEMENT','Signalement urgent — Snack du Marché','Panne lave-vaisselle. Intervention requise sous 48h.','usr_auditeur_test_01',false,'/auditeur/signalements',NOW()-INTERVAL '4 days'),
  ('notif_aud_02','TACHE_ASSIGNEE','Nouvelle tâche — Vérification EPI','Contrôle EPI plonge à réaliser avant 3 jours.','usr_auditeur_test_01',false,'/auditeur/taches',NOW()-INTERVAL '5 days'),
  ('notif_aud_03','TACHE_ASSIGNEE','Tâche urgente — Mise à jour DUERP Snack','Mise à jour DUERP suite à la glissade. Délai : 7 jours.','usr_auditeur_test_01',false,'/auditeur/taches',NOW()-INTERVAL '8 days'),
  ('notif_aud_04','AUDIT_RAPPEL','Rappel : audit dans 5 jours — Cabinet Renard','Cabinet Renard Conseil attend votre premier audit initial.','usr_auditeur_test_01',false,'/auditeur/audits',NOW()-INTERVAL '1 day'),
  ('notif_aud_05','SIGNALEMENT_RECU','Signalement — Boutique Mode & Style','Nouvel embauché déclaré. DUERP à mettre à jour.','usr_auditeur_test_01',true,'/auditeur/signalements',NOW()-INTERVAL '2 days'),
  ('notif_aud_06','DUERP_SIGNE','DUERP signé — Boutique Mode & Style','Thomas Martin a signé le DUERP v1. Archivage effectué.','usr_auditeur_test_01',true,'/auditeur/duerp',NOW()-INTERVAL '5 days'),
  -- Client Snack
  ('notif_sn_01','DUERP_DISPONIBLE','Votre DUERP v2 est disponible','Votre Document Unique a été mis à jour et signé.','usr_client_snack_01',false,'/dashboard/duerp',NOW()-INTERVAL '15 days'),
  ('notif_sn_02','AUDIT_COMPLETE','Audit annuel terminé — 72/100','Votre audit est terminé. 3 actions correctives prioritaires identifiées.','usr_client_snack_01',true,'/dashboard/duerp',NOW()-INTERVAL '18 days'),
  ('notif_sn_03','RAPPEL_ACTION','Action corrective en attente','Tapis antidérapants en cuisine à poser avant '||(NOW()+INTERVAL '3 days')::date::text||'.','usr_client_snack_01',false,'/dashboard/duerp',NOW()-INTERVAL '5 days'),
  -- Client Commerce
  ('notif_co_01','DUERP_DISPONIBLE','Votre DUERP v1 est disponible','Votre premier Document Unique est signé et archivé. Félicitations !','usr_client_commerce_01',false,'/dashboard/duerp',NOW()-INTERVAL '5 days'),
  ('notif_co_02','AUDIT_COMPLETE','Audit initial terminé — 85/100','Excellent niveau de conformité. Consultez le rapport complet.','usr_client_commerce_01',true,'/dashboard/duerp',NOW()-INTERVAL '6 days'),
  ('notif_co_03','RAPPEL_ACTION','DUERP à mettre à jour','L''embauche de Pierre Marchand nécessite une mise à jour de votre DUERP.','usr_client_commerce_01',false,'/dashboard/duerp',NOW()-INTERVAL '2 days'),
  -- Client Bureau
  ('notif_bu_01','DUERP_EN_COURS','Votre DUERP est en cours de finalisation','Votre auditeur ICPP prépare votre Document Unique. Vous serez notifié(e) dès qu''il sera prêt.','usr_client_bureau_01',false,'/dashboard/duerp',NOW()-INTERVAL '2 days'),
  ('notif_bu_02','AUDIT_PLANIFIE','Audit initial planifié','Marc Leblanc réalisera votre audit le '||(NOW()+INTERVAL '5 days')::date::text||'. Préparez vos documents.','usr_client_bureau_01',false,'/dashboard',NOW()-INTERVAL '1 day'),
  ('notif_bu_03','BIENVENUE','Bienvenue sur ICPP Conformité !','Votre compte est activé. Votre auditeur vous contactera sous 48h.','usr_client_bureau_01',true,'/dashboard',NOW()-INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

SELECT 'Seed terminé avec succès ! 3 entreprises, 4 users, 15 salariés, 3 DUERP, 3 audits, 5 signalements, 5 tâches, 21 notifications.' AS result;
