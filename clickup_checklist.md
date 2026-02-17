# Checklist Globale - ICPP Platform (Alignée ClickUp)

**Légende** : ✅ = Terminé | 🔄 = En cours | ⏳ = À faire | 🚧 = Bloquant

---

## 🏗️ 1. Architecture & Schema (Phase Critique) ✅

### 1.1 Refonte Unités de Travail (UT) ✅
- [x] Modèle `UniteTravail` (Lien MetierICPP)
- [x] Relation `RisqueMetier` update (uniteTravailId)
- [x] Seed initial (60 UTs)
- [x] Server Actions CRUD UTs

### 1.2 Ajout Modèles Manquants (Handover) ✅
- [x] Modèle `Audit` (Planification)
- [x] Modèle `Signalement` (Incidents)
- [x] Modèle `Reglementation` (Veille)
- [x] Modèle `AppSettings` (Config Key-Value)
- [x] Update modèle `User` (auditsAssigned)
- [x] Update modèle `Company` (contact fields + signalements relation)
- [x] Corriger `Signalement` (relation Company ajoutée)
- [x] Corriger `Reglementation` (type, dateVigueur, dateMaj, metiersCodes, impactDuerp)

### 1.3 Stabilisation Build ✅
- [x] Fix `getReglementations` (admin.ts) vs Schema
- [x] Fix calcul `gravite` (String -> Number conversion avec helper `graviteToNumber()`)
- [x] Fix `getSignalements` (gestion company nullable)
- [x] Fix `updateSignalementStatus` (champ `traiteAt`)
- [x] Fix `createClientSignalement` (champ `titre` obligatoire)
- [x] Stripe rendu optionnel (pas de crash si clé manquante)
- [x] Fix Suspense boundary sur `/reset-password`
- [x] Build `npm run build` PASS ✅

---

## 🎨 2. Interface Admin - Gestion Métiers/UTs ✅

### 2.1 Gestion UTs ✅
- [x] Page `/admin/unites-travail`
- [x] Liste collapsible par métier
- [x] Modal Création/Edition UT
- [x] Recherche & Stats

### 2.2 Gestion Risques ✅
- [x] CRUD Risques
- [x] Association Risque <-> UT
- [ ] **TODO:** Sélecteur UT dans formulaire Risque (Phase 4)

---

## 🛡️ 3. Interface Auditeur 🔄

### 3.1 Navigation & Dashboard ✅
- [x] Sidebar Auditeur
- [x] Dashboard avec KPIs
- [x] Page Tâches & Signalements

### 3.2 Gestion Audits Terrain 🔄
- [x] Page Liste Audits (`/auditeur/audits`)
- [x] Wizard Création Audit (Steps 1-4)
- [ ] **TODO:** Stockage final Audit (Validation)
- [ ] **TODO:** Génération PDF Audit Terrain

---

## 📜 4. Gestion DUERP (Client) ⏳

### 4.1 Wizard DUERP 🔄
- [x] Sélection Métier
- [x] Grille évaluation Risques (F x G)
- [ ] **TODO:** Groupement par UTs (au lieu de global)
- [ ] **TODO:** Mesures de prévention

### 4.2 Documents & Signatures ⏳
- [ ] Génération PDF DUERP
- [ ] Signature électronique simple
- [ ] Archivage versions

---

## ⚙️ 5. Configuration & Paramètres ✅

### 5.1 Gestion Utilisateurs (Admin) ✅
- [x] CRUD Entreprises (TPE)
- [x] CRUD Auditeurs
- [x] Assignation Rôles

### 5.2 Paramètres Globaux 🔄
- [x] Page `/admin/parametres`
- [x] Server Action `getSettings` (Rewritten V2)
- [ ] Validation données formulaire

---

## 🚀 6. Déploiement & Ops ✅

### 6.1 Préparation VPS ✅
- [x] Dockeriser l'application
- [x] Configurer Nginx Reverse Proxy
- [x] Configurer SSL (Certbot)
- [x] Migration PostgreSQL Production
- [x] Déploiement Hostinger VPS (`icpp-conformite.cloud`)

### 6.2 Monitoring ⏳
- [ ] Setup Logs
- [ ] Setup Backups BDD automatiques

---

## 📊 État Current (Handover)

**Progression :** ~70%
**Focus actuel :** ✅ Déployé en production sur Hostinger VPS (`icpp-conformite.cloud`)
**Prochaine étape :** DUERP Backend complet + Audits finalisés + Stripe intégration

### Stack Frontend ✅
- [x] Next.js 16.1.1 (App Router + Turbopack)
- [x] TypeScript (strict mode)
- [x] Tailwind CSS v4
- [x] shadcn/ui (20 composants installés)
- [x] React Hook Form + Zod (validation)

### Stack Backend ✅
- [x] Next.js API Routes
- [x] Prisma ORM
- [x] Structure server/ préparée

### Base de Données ✅
- [x] Prisma Schema (relationnel strict)
- [x] SQLite (dev) / PostgreSQL (prod)
- [x] Seed script avec données métiers

### Architecture Authentification ✅
- [x] NextAuth.js v5 configuré
- [x] Providers (Credentials + Google optionnel)
- [x] Middleware de protection routes
- [x] Session management

### Architecture Paiement ✅
- [x] Intégration Stripe
- [x] Webhooks
- [x] Gestion abonnements

### Génération Documents PDF ✅
- [x] @react-pdf/renderer configuré
- [x] Templates DUERP
- [x] Templates Contrat
- [x] Templates Affiches

---

## 2. Modèle de Données ✅

### Structure DUERP ✅
- [x] Table `DuerpDocument`
- [x] Table `EvaluationRisque` (FxG)
- [x] Relation Company → DUERP
- [x] Versionning (champ `version`)
- [x] Schéma logique DUERP (Livrable généré)

### Schéma Utilisateurs / Rôles ✅
- [x] Table `User`
- [x] Enum Roles (CLIENT, ADMIN, AUDITOR, COMMERCIAL)
- [x] Relations User ↔ Company
- [x] Schéma utilisateurs & rôles (Livrable généré)

### Conformité RGPD ✅
- [x] Minimisation données (pas de données inutiles)
- [x] Isolation par `companyId`
- [x] Table `AuditLog` (traçabilité)
- [x] Champs signature avec IP/timestamp
- [x] Conformité RGPD du modèle (Livrable généré)

### Modèle Entreprise & Abonnements ✅
- [x] Table `Company`
- [x] Table `Subscription`
- [x] Table `PlanTarifaire` (3 plans seedés)
- [x] Lien Stripe (customerId, subscriptionId)
- [x] Schéma entreprise & abonnement (Livrable généré)

### Données Risques & Métiers ✅
- [x] Table `MetierICPP` (10 métiers)
- [x] Table `RisqueCategorie` (8 catégories)
- [x] Table `RisqueMetier` (relationnel)
- [x] Seed data complet
- [x] Schéma référentiels risques (Livrable généré)

### Gestion Documents Juridiques ✅
- [x] Table `Contrat`
- [x] Table `CGVVersion`
- [x] Table `CGVAcceptation`
- [x] Signature électronique (champs)
- [x] Schéma documents & signatures (Livrable généré)

---

## 3. Gestion de Rôles ✅

### Admin ✅
- [x] Interface admin (routes `/admin/*`)
- [x] Permissions middleware
- [x] Dashboard admin

### Client ✅
- [x] Interface client (routes `/dashboard/*`)
- [x] Restrictions accès
- [x] Dashboard client

### Auditeur/Commercial ✅
- [x] Sous-rôles Admin
- [x] Permissions spécifiques
- [x] Interface dédiée (routes `/auditeur/*`)

---

## 4. Authentification ⏳

### Inscription & Création Entreprise ⏳
- [ ] Page `/register`
- [ ] Formulaire multi-étapes
- [ ] Création Company + User
- [ ] Acceptation CGV

### Connexion Utilisateur ✅
- [x] Page `/login`
- [x] NextAuth credentials provider
- [x] Redirection selon rôle

### Mot de Passe Oublié ✅
- [x] Page `/forgot-password`
- [x] Email reset (Resend)
- [x] Token validation
- [x] Page `/reset-password`
- [x] Server actions `requestPasswordResetAction` et `resetPasswordAction`

### Sécurisation Accès ✅
- [x] Middleware auth
- [x] Protection routes API
- [x] CSRF protection

---

## 5. Navigation Principale Auditeur ✅
- [x] Sidebar navigation (AuditeurSidebar)
- [x] Menu contextuel par rôle
- [x] Logo + titre ICPP Auditeur
- [x] User profile en bas
- [x] Bouton déconnexion

---

## 6. Interface Auditeur ✅

### Dashboard Auditeur ✅
- [x] Page `/auditeur` (dashboard-client.tsx)
- [x] 4 stat cards (Entreprises, Audits en cours, Audits réalisés, DUERP)
- [x] Section Tâches prioritaires
- [x] Section Signalements récents
- [x] Boutons actions (Nouveau audit, Voir signalements)
- [x] Panel notifications

### Page Mes Audits ✅
- [x] Page `/auditeur/audits`
- [x] Tableau audits avec filtres
- [x] Stats cards (En cours, Planifiés, Finalisés)
- [x] Actions (Voir, Reprendre, Rapport)
- [x] Lien vers création nouvel audit

### Page Nouvel Audit (Wizard) ✅
- [x] Page `/auditeur/audits/nouveau`
- [x] Stepper 4 étapes (Entreprise, Documents, Risques, Synthèse)
- [x] Step 1: Sélection entreprise + métier
- [x] Step 2: Vérification documentaire (6 items)
- [x] Step 3: Évaluation risques (5 catégories, F×G)
- [x] Step 4: Synthèse avec score + commentaire
- [x] Navigation précédent/suivant

### Page Liste DUERP ✅
- [x] Page `/auditeur/duerp`
- [x] Tableau DUERP (Entreprise, Création, Expiration, Risques, Statut)
- [x] Avatars initiales entreprise
- [x] Actions dropdown (Voir, Télécharger, Envoyer, Supprimer)

### Page Entreprises ✅
- [x] Page `/auditeur/entreprises`
- [x] Tableau entreprises (Nom, Email, Activité, Abonnement, Statut, DUERP)
- [x] Badges conformité colorés
- [x] Actions dropdown

### Page Signalements ✅
- [x] Page `/auditeur/signalements`
- [x] 3 stat cards (Nouveaux, En cours, Traités)
- [x] Liste signalements avec bordure colorée gauche
- [x] Badges statut + boutons actions

### Page Tâches ✅
- [x] Page `/auditeur/taches`
- [x] 4 stat cards (À faire, En cours, Terminées, Urgentes)
- [x] Liste tâches avec bordure priorité colorée
- [x] Badges priorité + type
- [x] Boutons Démarrer/Terminer

### Page Paramètres ✅
- [x] Page `/auditeur/parametres`
- [x] Onglet Profil (avatar, prénom, nom, téléphone, email)
- [x] Onglet Notifications (4 toggles)
- [x] Onglet Sécurité (changement mot de passe)

---

## 7. Gestion TPE (Admin) ✅

### Créer Fiche TPE ✅
- [x] Formulaire création Company (AddClientModal)
- [x] Validation SIRET
- [x] Assignation métier
- [x] Server action `createCompany`
- [x] Bouton "Nouveau client" fonctionnel

### Consulter/Modifier Fiche TPE ✅
- [x] Page détail `/admin/entreprises/[id]`
- [x] Modal édition `EditCompanyModal`
- [x] Server action `updateCompany`
- [x] Dropdown "Voir fiche" fonctionnel
- [x] Dropdown "Modifier" fonctionnel

### Suppression TPE ✅
- [x] Server action `deleteCompany` existe
- [x] Dropdown "Supprimer" fonctionnel avec confirmation
- [x] AlertDialog avec avertissement
- [x] Toast de succès

---

## 8. Gestion Auditeur (Admin) ✅

### Création Compte Auditeur ✅
- [x] Formulaire création User (AddAuditeurModal)
- [x] Server action `createAuditor`
- [x] Bouton "Ajouter un auditeur" fonctionnel
- [ ] Email invitation (TODO backend intégration)

### Modification/Désactivation ✅
- [x] Server action `deleteAuditor` existe
- [x] Server action `updateAuditor` créé
- [x] Server action `toggleAuditorStatus` créé
- [x] Toggle actif/inactif (UI + action)
- [x] Édition profil modal `EditAuditeurModal`
- [x] Dropdown "Modifier" fonctionnel
- [x] Dropdown "Supprimer" fonctionnel
- [x] Dropdown "Activer/Désactiver" fonctionnel

### Liste Auditeurs ✅
- [x] Table avec filtres
- [x] Recherche nom/email
- [x] Affichage audits assignés
- [x] Colonne statut avec badge
- [x] Statut visuel (Actif/Inactif)

---

## 9. Création Audit (Admin & Auditeur) ✅
- [x] Bouton "Planifier un audit" (UI)
- [x] Modal avec sélection entreprise + auditeur (UI)
- [x] Server action `planifierAudit`
- [x] Initialisation audit (status=PLANIFIE)
- [x] Success toast + refresh

---

## 10. Formulaire DUERP Guidé (Wizard) 🔄

### Étape Activité ✅
- [x] Sélection métier (depuis MetierICPP) - UI
- [ ] Chargement risques associés - Backend

### Étape Salariés ⏳
- [ ] Nombre d'employés
- [ ] Postes de travail (input dynamique)

### Étape Postes ⏳
- [ ] Liste postes créés
- [ ] Assignation risques par poste

### Étape Risques ✅
- [x] Grille de sélection risques - UI
- [x] Évaluation F x G par risque - UI
- [ ] Mesures préventives - Backend

---

## 11. Calcul Statut Conformité 🔄
- [x] Algorithme score global (UI)
- [x] Badge visuel (Conforme/Non conforme) - UI
- [ ] Affichage dashboard - Backend integration

---

## 12. Consultation et Modification ⏳
- [ ] Page édition DUERP existant
- [ ] Mode lecture seule si signé
- [ ] Création nouvelle version

---

## 13. Sauvegarde DUERP ⏳

### Sauvegarde DUERP ⏳
- [ ] Auto-save (brouillon)
- [ ] Bouton "Enregistrer"

### Vérification Cohérence ⏳
- [ ] Validation Zod
- [ ] Alertes champs manquants

---

## 14. Validation Mini-Audit ⏳

### Résumé Réponses ⏳
- [ ] Page récapitulatif
- [ ] Aperçu PDF

### Bouton Validation ⏳
- [ ] Changement status → ACTIVE
- [ ] Trigger génération PDF

---

## 15. Génération DUERP PDF ⏳
- [ ] Template React-PDF
- [ ] Mise en page paysage
- [ ] Header/Footer personnalisés
- [ ] Upload vers stockage (S3 ou local)

---

## 16. Signature Électronique Simple ⏳
- [ ] Case à cocher "J'accepte"
- [ ] Capture IP + timestamp
- [ ] Stockage `signatureData`

---

## 17. Versionning DUERP ⏳
- [ ] Incrémentation `version`
- [ ] Archivage anciennes versions (status=ARCHIVED)
- [ ] Historique visible

---

## 18. Téléchargement DUERP (Admin) ⏳

### Gestion Versions ⏳
- [ ] Liste versions par Company
- [ ] Filtres date/statut

### Archivage ⏳
- [ ] Soft delete
- [ ] Restauration

### Consultation Historique ⏳
- [ ] Timeline versions
- [ ] Comparaison versions

---

## 19. Formulaire Signalement (Client) ⏳
- [ ] Page `/dashboard/signalement`
- [ ] Formulaire incident
- [ ] Notification admin

---

## 20. Génération Affichages Obligatoires (PDF) ⏳
- [ ] Templates affiches réglementaires
- [ ] Génération automatique
- [ ] Téléchargement client

---

## 21. Classeur Conformité ⏳
- [ ] Page `/dashboard/documents`
- [ ] Liste documents obligatoires
- [ ] Statut téléchargé/imprimé

---

## 22. Historique Documents ⏳
- [ ] Table `Affichage` avec dates
- [ ] Filtres par type

---

## 23. Lecture/Téléchargement (Client) ⏳
- [ ] Visualisation PDF inline
- [ ] Bouton download
- [ ] Tracking téléchargements

---

## 24. Dashboard Conformité (Client) ⏳

### Statut Conformité ⏳
- [ ] Badge global
- [ ] Indicateurs visuels

### Accès DUERP PDF ⏳
- [ ] Lien téléchargement version active
- [ ] Historique versions

### Vérification Lisibilité ⏳
- [ ] Preview PDF
- [ ] Tests affichage

---

## 25. Abonnements ⏳

### Création Abonnements ⏳
- [ ] Workflow souscription
- [ ] Choix plan
- [ ] Paiement Stripe

### Statut Actif/Inactif ⏳
- [ ] Gestion status subscription
- [ ] Webhooks Stripe

### Restriction Accès ⏳
- [ ] Middleware vérification abonnement
- [ ] Bannières expiration

---

## 26. Dashboard Client - Consultation ⏳

### Factures ⏳
- [ ] Liste factures Stripe
- [ ] Téléchargement PDF

### Statut Conformité ⏳
- [ ] Widget résumé
- [ ] Alertes

### Abonnement ⏳
- [ ] Détails plan actuel
- [ ] Bouton upgrade/cancel

---

## 27. Dashboard Admin/Auditeur 🔄
- [x] Dashboard Auditeur avec statistiques (UI)
- [ ] Statistiques globales (Backend)
- [ ] Liste entreprises dynamique
- [ ] Alertes système

---

## 28. Intégration Stripe ⏳
- [ ] Configuration API keys
- [ ] Checkout session
- [ ] Customer portal
- [ ] Webhooks (payment_succeeded, subscription_updated)

---

## 29. Rappels Automatiques ⏳
- [ ] Cron jobs (révision annuelle DUERP)
- [ ] Emails transactionnels
- [ ] Notifications in-app

---

## 30. Mise en Production & Corrections ⏳

### Correction Bugs ⏳
- [ ] Tests unitaires
- [ ] Debugging

### Tests Finaux ⏳
- [ ] Tests E2E
- [ ] Tests manuels

### Déploiement Production ⏳
- [ ] Configuration Vercel/Railway
- [ ] Migration BDD PostgreSQL
- [ ] Variables d'environnement prod
- [ ] Monitoring (Sentry)

---

## 📊 Progression Globale

**Terminé** : ~70% (Architecture + Auth + Interfaces Admin/Auditeur/Client/Technicien + ✅ Déploiement Production)
**En cours** : DUERP Backend complet + Audits finalisés
**Restant** : Stripe intégration live, Inscription self-service, Notifications, Tests E2E

### Dernières mises à jour (17/02/2026)
- ✅ **DÉPLOIEMENT PRODUCTION RÉUSSI** - Hostinger VPS `icpp-conformite.cloud`
- ✅ Docker + PostgreSQL 16 + Nginx + SSL
- ✅ Prisma schema migré vers PostgreSQL
- ✅ Build production stable
- ✅ Admin action buttons fixes (Audits, Signalements, Abonnements, Entreprises detail)

### Mises à jour précédentes (04/02/2026)
- ✅ **Tâches 7-8 complétées à 100%**
- ✅ Gestion TPE complète (CRUD + page détail)
- ✅ Gestion Auditeur complète (CRUD + toggle statut)
- ✅ Tous les dropdowns fonctionnels
- ✅ Confirmations de suppression
- ✅ Modals d'édition
- ✅ Toasts de feedback

