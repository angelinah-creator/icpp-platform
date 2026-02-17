# ICPP Platform - Contexte Serveur

## 📌 Informations Générales

**Projet** : ICPP Conformité - Plateforme SaaS de gestion DUERP et conformité réglementaire pour TPE  
**Statut** : ✅ Déployé en production sur Hostinger VPS  
**Domaine** : `https://icpp-conformite.cloud`  
**Repository** : `https://github.com/angelinah-creator/icpp-platform` (branche `develop`)  
**Progression globale** : ~70% (Build stable, déploiement OK, fonctionnalités cœur terminées)

---

## 🏗️ Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js | 16.1.1 (App Router + Turbopack) |
| Runtime | Node.js | 20 |
| Langage | TypeScript | 5.x (strict mode) |
| ORM | Prisma | 5.22.0 |
| Base de données | PostgreSQL | 16 |
| Auth | NextAuth.js | v5 (beta.30) |
| CSS | TailwindCSS | 4.x |
| UI Components | shadcn/ui | - |
| Validation | React Hook Form + Zod | - |
| PDF Generation | @react-pdf/renderer | 4.3.2 |
| Paiement | Stripe | 20.1.2 (optionnel) |
| Email | Resend | 6.7.0 |
| Container | Docker + Docker Compose | - |
| Reverse Proxy | Nginx | - |
| SSL | Let's Encrypt (Certbot) | - |

---

## 🗄️ Architecture Base de Données

### Schema Prisma (`prisma/schema.prisma`)
- **Provider** : `postgresql` (prod) / `sqlite` (dev local si nécessaire)
- **URL** : Configurée via `DATABASE_URL` dans `.env`

### Tables Principales

#### Authentification & Utilisateurs
- `User` - Utilisateurs (CLIENT, ADMIN, AUDITOR, COMMERCIAL, TECHNICIEN)
- `Account`, `Session`, `VerificationToken` - NextAuth
- `Company` - Entreprises (TPE clientes)

#### Métiers & Risques
- `MetierICPP` - 10 métiers (COIFFURE, RESTAURATION, ESTHETIQUE, etc.)
- `RisqueCategorie` - 8 catégories de risques
- `RisqueMetier` - Risques associés aux métiers
- `UniteTravail` - Unités de travail par métier (~60 UTs)

#### DUERP & Conformité
- `DuerpDocument` - Documents DUERP (versions, signatures)
- `EvaluationRisque` - Évaluations Fréquence × Gravité
- `Affichage` - Affichages obligatoires
- `Contrat` - Contrats générés
- `CGVVersion`, `CGVAcceptation` - Gestion CGV

#### Gestion Audits
- `Audit` - Audits terrain planifiés/réalisés
- `Signalement` - Incidents/signalements
- `Tache` - Tâches auditeurs/techniciens

#### Abonnements
- `PlanTarifaire` - 3 plans (ESSENTIEL, PRO, PREMIUM)
- `Subscription` - Abonnements actifs (lien Stripe)

#### Divers
- `Reglementation` - Veille réglementaire
- `AppSettings` - Paramètres système (key-value)
- `AuditLog` - Logs d'audit RGPD

---

## 🔐 Environnement & Secrets

### Fichier `.env` (Production)

Localisation : `/opt/icpp-platform/.env`

Variables critiques :
```env
# PostgreSQL
DATABASE_URL="postgresql://icpp_user:<PASSWORD>@postgres:5432/icpp_platform?schema=public"

# NextAuth (IMPORTANT: NEXTAUTH_SECRET = AUTH_SECRET)
NEXTAUTH_URL=https://icpp-conformite.cloud
NEXTAUTH_SECRET=<openssl rand -base64 32>
AUTH_SECRET=<MEME VALEUR QUE NEXTAUTH_SECRET>

# Stripe (optionnel pour l'instant)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=re_PWjZWJE3_9P7Xjrck15F3qCcVZwQVv2qn

# App
NEXT_PUBLIC_APP_URL=https://icpp-conformite.cloud
NODE_ENV=production
```

---

## 👤 Comptes de Test

### Admin Principal
- **Email** : `admin@icpp.re`
- **Mot de passe** : `Admin123!`
- **Rôle** : ADMIN

> ⚠️ **IMPORTANT** : Changer ce mot de passe après le premier login en production.

### Seed Data
Le script `prisma/seed.ts` crée :
- 10 métiers ICPP
- 8 catégories de risques
- 3 plans tarifaires (19€, 39€, 79€ /mois)
- 1 utilisateur admin
- 2 entreprises exemples

---

## 📂 Structure du Projet

```
icpp-platform/
├── prisma/
│   ├── schema.prisma          # Schema DB (provider: postgresql)
│   ├── seed.ts                # Script seed initial
│   ├── seed-complete.sql      # Seed complet (UTs + Risques)
│   └── migrations/            # Migrations Prisma
├── src/
│   ├── app/
│   │   ├── admin/            # Interface Admin (CRUD entités)
│   │   ├── auditeur/         # Interface Auditeur (audits, DUERP)
│   │   ├── dashboard/        # Dashboard Client TPE
│   │   ├── technicien/       # Interface Technicien
│   │   ├── api/              # API Routes (PDF, webhooks)
│   │   ├── login/            # Page login
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── admin/            # Composants admin
│   │   ├── auditeur/         # Composants auditeur
│   │   ├── client/           # Composants client
│   │   ├── technicien/       # Composants technicien
│   │   ├── duerp/            # Composants DUERP
│   │   └── ui/               # shadcn/ui components
│   ├── server/
│   │   └── actions/          # Server Actions (admin, client, auth, etc.)
│   ├── lib/
│   │   ├── auth.ts           # Config NextAuth
│   │   ├── prisma.ts         # Prisma client
│   │   └── pdf/              # Templates PDF (@react-pdf)
│   └── types/                # Types TypeScript
├── public/                    # Assets statiques
├── Dockerfile                 # Build multi-stage
├── docker-compose.prod.yml    # PostgreSQL + App
├── .env.production.example    # Template env
└── clickup_checklist.md       # Checklist tâches projet
```

---

## ✅ Fonctionnalités Terminées

### Authentification
- ✅ Login (NextAuth Credentials)
- ✅ Mot de passe oublié + reset
- ✅ Middleware de protection routes
- ✅ Redirection selon rôle (admin/auditeur/client/technicien)

### Interface Admin (`/admin/*`)
- ✅ Dashboard admin avec statistiques
- ✅ CRUD Entreprises (TPE)
- ✅ CRUD Auditeurs (+ toggle actif/inactif)
- ✅ CRUD Métiers ICPP
- ✅ CRUD Risques (catégories + risques par métier)
- ✅ CRUD Réglementations
- ✅ CRUD Unités de Travail (UTs)
- ✅ Gestion Audits (liste, planification, statuts)
- ✅ Gestion Signalements (liste, prise en charge, statut)
- ✅ Gestion Abonnements (liste)
- ✅ Gestion Affichages obligatoires
- ✅ Paramètres globaux

### Interface Auditeur (`/auditeur/*`)
- ✅ Dashboard auditeur avec KPIs
- ✅ Liste mes audits (filtres, statuts)
- ✅ Wizard création audit terrain (4 étapes)
- ✅ Liste DUERP (par entreprise assignée)
- ✅ Liste entreprises assignées
- ✅ Gestion signalements
- ✅ Gestion tâches
- ✅ Paramètres profil

### Interface Client (`/dashboard/*`)
- ✅ Dashboard client avec conformité
- ✅ Page DUERP (liste versions)
- ✅ Page Signalements (création + liste)
- ✅ Page Salariés
- ✅ Page Affichages obligatoires
- ✅ Page Documents
- ✅ Page Factures
- ✅ Paramètres profil

### Interface Technicien (`/technicien/*`)
- ✅ Dashboard technicien
- ✅ Gestion tâches
- ✅ Paramètres profil

### PDFs
- ✅ Génération PDF DUERP (`/api/duerp/[id]/pdf`)
- ✅ Génération PDF Audit (`/api/audits/[id]/pdf`)
- ✅ Génération PDF Affichages (4 fiches)

### Déploiement
- ✅ Dockerfile multi-stage
- ✅ docker-compose.prod.yml (PostgreSQL + App)
- ✅ Nginx reverse proxy configuré
- ✅ SSL Let's Encrypt (Certbot)
- ✅ Déployé sur Hostinger VPS

---

## 🚧 Fonctionnalités en Cours / À Terminer

### Priorité 1 - DUERP Backend

**Objectif** : Compléter le workflow DUERP côté serveur

- [ ] Backend complet wizard DUERP
  - [ ] Étape 1 : Sélection métier → chargement risques associés
  - [ ] Étape 2 : Ajout salariés + unités de travail
  - [ ] Étape 3 : Évaluation risques par UT (F×G)
  - [ ] Étape 4 : Mesures de prévention
  - [ ] Sauvegarde brouillon (auto-save)
  - [ ] Validation finale → status ACTIVE
- [ ] PDF DUERP complet (toutes données wizard)
- [ ] Signature électronique simple (case + IP + timestamp)
- [ ] Versionning DUERP (incrémentation, archivage)

**Fichiers concernés** :
- `src/server/actions/duerp.ts` (actions serveur)
- `src/app/dashboard/duerp/*` (wizard client)
- `src/lib/pdf/duerp-pdf.tsx` (template PDF)

---

### Priorité 2 - Audits Terrain Finalisés

**Objectif** : Terminer le workflow audit auditeur

- [ ] Sauvegarde finale audit (après step 4 wizard)
- [ ] Génération rapport PDF audit complet
- [ ] Envoi email client après audit finalisé
- [ ] Historique modifications audit

**Fichiers concernés** :
- `src/server/actions/admin.ts` (ou créer `src/server/actions/audits.ts`)
- `src/app/auditeur/audits/[id]/*` (édition audit)
- `src/lib/pdf/audit-pdf.tsx` (compléter template)

---

### Priorité 3 - Stripe Intégration Complète

**Objectif** : Activer les paiements et abonnements

- [ ] Configuration Stripe (API keys live)
- [ ] Page souscription (`/subscribe`) avec Checkout
- [ ] Customer Portal (gestion abonnement client)
- [ ] Webhooks Stripe (payment_succeeded, subscription_updated, etc.)
- [ ] Restrictions accès selon abonnement actif
- [ ] Liste factures Stripe côté client

**Fichiers concernés** :
- `src/server/actions/stripe.ts` (revoir/compléter)
- `src/app/api/webhooks/stripe/route.ts` (webhook handler)
- Créer `src/app/subscribe/page.tsx`

---

### Priorité 4 - Inscription Client (Self-Service)

**Objectif** : Permettre inscription autonome TPE

- [ ] Page `/register` (formulaire multi-étapes)
- [ ] Étape 1 : Infos entreprise (SIRET, nom, adresse)
- [ ] Étape 2 : Compte utilisateur (email, mot de passe)
- [ ] Étape 3 : Choix plan + acceptation CGV
- [ ] Étape 4 : Paiement Stripe
- [ ] Création Company + User + Subscription
- [ ] Email de bienvenue (Resend)

**Fichiers à créer** :
- `src/app/register/page.tsx`
- `src/server/actions/registration.ts`

---

### Priorité 5 - Rappels & Notifications

**Objectif** : Automatiser les relances

- [ ] Cron job révision annuelle DUERP (emails)
- [ ] Notifications in-app (modèle `Notification`)
- [ ] Emails transactionnels (DUERP signé, audit finalisé, etc.)

**Fichiers concernés** :
- Créer `src/lib/cron/` (ou utiliser service externe comme Vercel Cron)
- `src/lib/email/` (templates email Resend)

---

### Priorité 6 - Tests & QA

**Objectif** : Valider stabilité production

- [ ] Tests unitaires actions serveur critiques
- [ ] Tests E2E (Playwright) sur workflows clés
- [ ] Tests manuels rôles (admin, auditeur, client)
- [ ] Fix bugs remontés en production

---

## 🐛 Bugs Connus / Points d'Attention

### Stripe Optionnel
Le code est configuré pour **ne pas crasher** si les clés Stripe sont absentes (mode développement).  
→ Activer Stripe nécessite de configurer les clés dans `.env` et tester les webhooks.

### NEXTAUTH_SECRET = AUTH_SECRET
**CRITIQUE** : NextAuth v5 nécessite que `NEXTAUTH_SECRET` et `AUTH_SECRET` aient **la même valeur** dans `.env`.  
→ Si différentes, l'auth ne fonctionnera pas.

### Migrations Prisma
En production, **ne jamais utiliser `prisma db push`** après le déploiement initial.  
→ Utiliser `prisma migrate deploy` pour appliquer les migrations de façon sécurisée.

### Permissions Fichiers
Le container Docker tourne avec l'utilisateur `nextjs` (UID 1001).  
→ Vérifier les permissions si vous montez des volumes (logs, uploads).

---

## 🛠️ Commandes Utiles

### Sur le Serveur (dans `/opt/icpp-platform`)

| Action | Commande |
|--------|----------|
| Logs app | `docker compose -f docker-compose.prod.yml logs -f app` |
| Logs PostgreSQL | `docker compose -f docker-compose.prod.yml logs -f postgres` |
| Restart app | `docker compose -f docker-compose.prod.yml restart app` |
| Rebuild app | `git pull && docker compose -f docker-compose.prod.yml up -d --build` |
| Shell app container | `docker compose -f docker-compose.prod.yml exec app sh` |
| Shell PostgreSQL | `docker compose -f docker-compose.prod.yml exec postgres psql -U icpp_user icpp_platform` |
| Prisma Studio | `docker compose -f docker-compose.prod.yml exec app npx prisma studio` |
| Backup DB | `docker compose -f docker-compose.prod.yml exec postgres pg_dump -U icpp_user icpp_platform > backup_$(date +%Y%m%d).sql` |
| Restore DB | `cat backup.sql \| docker compose -f docker-compose.prod.yml exec -T postgres psql -U icpp_user icpp_platform` |

### Migrations Prisma (Production)

```bash
# Dans le container app
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### Seed Database (si nécessaire)

```bash
docker compose -f docker-compose.prod.yml exec app npx tsx prisma/seed.ts
```

---

## 📋 Prochaines Tâches Recommandées

1. **DUERP Backend** → Terminer le wizard côté serveur (sauvegarde, PDF complet, signatures)
2. **Audits Finalisés** → Compléter le workflow audit (sauvegarde, PDF, emails)
3. **Stripe Live** → Activer les abonnements en production
4. **Inscription Self-Service** → Permettre aux TPE de s'inscrire seules
5. **Notifications** → Implémenter les rappels automatiques
6. **Tests & QA** → Tests E2E et validation production

---

## 📖 Documentation Complémentaire

- **Checklist détaillée** : `clickup_checklist.md` (à jour, 616 lignes)
- **Déploiement** : Voir artifact `deployment_instructions.md`
- **Schema Prisma** : `prisma/schema.prisma` (avec commentaires)
- **Seed Data** : `prisma/seed.ts` + `prisma/seed-complete.sql`

---

## 🔗 Liens Utiles

- **Production** : https://icpp-conformite.cloud
- **GitHub** : https://github.com/angelinah-creator/icpp-platform
- **Prisma Docs** : https://www.prisma.io/docs
- **NextAuth.js v5** : https://authjs.dev
- **Stripe Docs** : https://stripe.com/docs
- **React PDF** : https://react-pdf.org

---

## 💡 Notes Importantes pour l'Agent IA Serveur

1. **Ne jamais commiter directement sur `develop`** — créer une branche de feature, push, puis merge via PR si possible.
2. **Toujours tester localement** avant de push (si docker disponible : `docker compose -f docker-compose.prod.yml up --build`).
3. **Utiliser TypeScript strict** — le projet est en mode strict, respecter les types.
4. **Suivre les conventions** :
   - Server Actions dans `src/server/actions/`
   - Composants client dans `src/components/`
   - Pages dans `src/app/`
5. **Prisma** : Après modification du schema → `npx prisma generate` puis `npx prisma db push` (dev) ou `npx prisma migrate dev` (prod).
6. **Build** : Toujours vérifier `npm run build` passe avant de push.

---

**Date de dernière mise à jour** : 17 février 2026  
**Agent précédent** : Antigravity (local dev)  
**Agent actuel** : [TBD] (serveur production)
