# ICPP Platform - SaaS de Conformité Professionnelle

Plateforme SaaS complète dédiée à la gestion de la conformité (DUERP), aux audits de risques professionnels et au suivi réglementaire pour les TPE/PME.

> **Note**: Ce projet suit les spécifications du cahier des charges "SAAS ICPP CONFORMITÉ" (Janvier 2026).

## 🚀 Fonctionnalités Clés

*   **Audits Métiers** : Formulaires intelligents adaptés à 10 secteurs d'activité (Coiffure, Restauration, BTP...).
*   **Génération DUERP** : CRÉATION AUTOMATIQUE du Document Unique en PDF (conforme Code du Travail).
*   **Espace Client** : Portail dédié pour la gestion des documents, affichages obligatoires et mises à jour.
*   **Administratif** : Gestion des contrats, signatures électroniques (eIDAS) et abonnements Stripe.
*   **Statistiques** : Module Data pour le reporting institutionnel (DEETS, Médecine du travail).

## 🛠 Stack Technique

*   **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
*   **Langage** : TypeScript
*   **Base de Données** : PostgreSQL / SQLite (via [Prisma ORM](https://www.prisma.io/))
*   **Auth** : NextAuth.js v5
*   **Styling** : Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/)
*   **Paiement** : Stripe
*   **PDF** : @react-pdf/renderer

## ⚡ Installation & Démarrage

### Pré-requis
*   Node.js 18+
*   NPM ou PNPM

### 1. Cloner le projet
```bash
git clone https://github.com/angelinah-creator/icpp-platform.git
cd icpp-platform
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de l'environnement
Copiez le fichier d'exemple et remplissez les secrets :
```bash
cp .env.example .env.local
```
*(Demander les clés API Stripe et NextAuth secret à l'administrateur)*

### 4. Base de Données (Initialisation)
Nous utilisons Prisma. Pour lancer la BDD locale (SQLite) et injecter les **10 métiers et risques de base** :
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma
npm run db:push

# Peupler la base (Seed : Métiers, Risques, Plans, CGV...)
npm run db:seed
```

### 5. Lancer le serveur de dev
```bash
npm run dev
```
Ouvrir [http://localhost:3000](http://localhost:3000)

## 📂 Structure du projet

Les dossiers principaux à connaître pour contribuer :

*   `src/app` : Routing et Pages (Next.js App Router).
*   `src/components` : Composants React (UI = générique, DUERP/Dashboard = métier).
*   `prisma/schema.prisma` : Définition des modèles de données (Source de vérité).
*   `prisma/seed.ts` : Script d'injection des données métiers (Risques, Catégories).

## 🤝 Contribution

1.  Ne jamais commit sur `main` directement.
2.  Créer une branche pour chaque feature : `git checkout -b feat/nom-de-la-feature`.
3.  Respecter le typage TypeScript strict.
4.  Lancer `npm run format` avant de push.

---
*ICPP Platform 2026 - Tous droits réservés.*
