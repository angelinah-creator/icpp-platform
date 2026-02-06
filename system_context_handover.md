# CONTEXTE INTÉGRAL PROJET ICPP COMPLIANCE

> **DESTINATAIRE :** Agent IA (GitHub Copilot / Claude Opus 4.5)
> **DATE :** 06 Février 2026
> **ÉTAT :** Phase Developpement / Stabilisation avant déploiement VPS

---

## 1. Vue d'Ensemble du Système

Le projet **ICPP Platform** est une solution SaaS de gestion de conformité (DUERP, Audits, Risques) pour les entreprises.

### Stack Technique
- **Framework :** Next.js 16 (App Router, Turbopack)
- **Langage :** TypeScript Strict
- **Base de Données :** SQLite (Dev) / PostgreSQL (Prod) via **Prisma ORM**
- **UI :** Shadcn/ui, Tailwind CSS, Lucide React
- **Auth :** NextAuth.js (PrismaAdapter)

### Règles Critiques (rules-iccp.md)
1. **Esthétique :** UI Premium, "Whaou effect", pas d'emojis (seulement icônes Lucide).
2. **Architecture :** Séparation stricte Server Actions / Client Components.
3. **Tests :** Pas de navigateur ouvert par l'IA. Validation par build/lint et tests unitaires si demandés.
4. **Code :** Clean code, maintenable, types explicites.

---

## 2. État d'Avancement Actuel

### Ce qui a été fait (Phases 1 à 3 terminées ✅)

#### A. Refonte Schema "Unités de Travail" (UT)
L'architecture a été modifiée pour introduire les Unités de Travail entre les Métiers et les Risques.
- **Ajout `model UniteTravail`** : Lié à `MetierICPP`.
- **Relation `RisqueMetier`** : Ajout champ optionnel `uniteTravailId` (rétrocompatibilité).
- **Seed Base de Données** : Script `seed-initial.sql` exécuté (60 UTs créées).
- **Backend** : Actions CRUD complètes dans `src/server/actions/unites-travail.ts`.

#### B. UI Admin - Gestion des UTs
- Page Admin : `/admin/unites-travail` fonctionnelle.
- Fonctionnalités : Liste groupée par métier (Collapsible), Création/Modif/Suppression UT, Recherche, Stats.
- Composants : `unites-travail-client.tsx`, `collapsible.tsx`.

#### C. Correction Schema & Build (En cours critique 🚧)
Le fichier `src/server/actions/admin.ts` contenait du code pour des fonctionnalités dont les modèles n'existaient pas encore dans le schema.
**Modifications Prisma APPLIQUÉES le 06/02 :**
1. **Ajout modèles manquants :**
   - `Audit` (Planification terrain)
   - `Signalement` (Remontée incidents)
   - `Reglementation` (Veille juridique)
   - `AppSettings` (Configuration globale Clé-Valeur)
2. **Mise à jour `User` :** Ajout relation `auditsAssigned`.
3. **Mise à jour `Company` :** Ajout relation `audits` et champs contact (`contactName`, `contactRole`, `contactEmail`).
4. **Refonte `getSettings` :** Réécriture pour utiliser `AppSettings` en mode Key-Value store.

---

## 3. Points Critiques & Erreurs à Corriger (Roadmap Immédiate)

L'agent doit reprendre ici. Le build `npm run build` échoue actuellement sur des incohérences de types entre `admin.ts` et le nouveau `schema.prisma`.

### A. Modèle `Reglementation` (URGENT)
Le code dans `admin.ts` (`getReglementations`) attend des champs différents de ceux ajoutés récemment au schema.
- **Attendu par admin.ts :** `type`, `dateVigueur`, `metiersCodes` (JSON String), `impactDuerp`.
- **Action requise :** Modifier `model Reglementation` dans `schema.prisma` pour coller EXACTEMENT à l'usage dans `admin.ts`.
  ```prisma
  model Reglementation {
    // ...
    type String
    dateVigueur DateTime
    metiersCodes String // JSON
    // ...
  }
  ```

### B. Modèle `Signalement` (URGENT)
L'erreur de build indique : `Type '{ company: true; }' is not assignable to type 'never'`.
- **Cause :** Manque la relation `@relation` vers `Company` dans le modèle `Signalement`.
- **Action requise :** Ajouter `company Company? @relation(...)` dans `Signalement`.

### C. Server Action `getRisquesByUniteTravail`
- **Problème :** Le champ `gravite` est désormais un `String` (FAIBLE, MOYEN, ELEVE) dans le schema, mais le code tente de faire des maths avec.
- **Action requise :** Convertir la string en nombre (1, 2, 3) avant le calcul de priorité dans `admin.ts`.

---

## 4. Instructions pour la Suite (Handover)

1. **Corriger le Schema** (`prisma/schema.prisma`) :
   - Mettre à jour `Signalement` (ajout relation Company).
   - Mettre à jour `Reglementation` (aligner champs avec `admin.ts`).
2. **Appliquer les changements** :
   - `npx prisma generate`
   - `npx prisma db push`
3. **Corriger TypeScript (`admin.ts`)** :
   - Vérifier `createReglementation` et `getReglementations`.
   - Corriger les calculs de gravité/priorité.
4. **Valider le Build** :
   - `npm run build` DOIT passer à 100%.
5. **Déploiement VPS** :
   - Préparer `docker-compose.yml` ou scripts de déploiement Node.js.
   - Configurer Reverse Proxy (Nginx/Caddy).

---

## 5. Ressources Clés

- **Schema Source :** `prisma/schema.prisma`
- **Logique Backend Admin :** `src/server/actions/admin.ts`
- **Gestion UTs :** `src/server/actions/unites-travail.ts`
- **Tâches Restantes :** Voir `clickup_checklist.md`

**NOTE FINALE :** Ne pas supprimer de code existant dans `admin.ts` si possible. Adapter le schema est préférable pour maintenir les fonctionnalités prévues.
