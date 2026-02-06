# Guide de Test Complet - ICPP Conformité

> **Objectif** : Ce fichier centralise toutes les données de test et instructions pour valider chaque fonctionnalité du système ICPP Conformité.
> 
> **Dernière mise à jour** : 06 Février 2026 - Build stable à 100%

---

## Table des Matières

1. [Prérequis](#prérequis)
2. [Données de Base (Seed)](#données-de-base-seed)
3. [Espace Admin](#espace-admin)
4. [Espace Auditeur](#espace-auditeur)
5. [Espace Client](#espace-client)
6. [Données de Test Complètes par Formulaire](#données-de-test-complètes-par-formulaire)
7. [Vérifications Techniques](#vérifications-techniques)

---

## Prérequis

### Démarrage du serveur

```bash
cd icpp-platform
npm run dev
```

**URL** : http://localhost:3000

### Connexion Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Synchroniser le schema avec la BDD
npx prisma db push

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

### Vérification du Build

```bash
npm run build
```

**Résultat attendu** : Build réussi à 100% (aucune erreur TypeScript)

---

## Données de Base (Seed)

### Script SQL Principal

Exécuter ce script pour initialiser toutes les données de test :

```bash
npx prisma db execute --file ./prisma/seed-all.sql
```

### Contenu du seed-all.sql

```sql
-- ==========================================
-- SEED COMPLET - ICPP CONFORMITE
-- ==========================================

-- ==========================================
-- 1. PLANS D'ABONNEMENT
-- ==========================================
INSERT INTO plans (code, nom, description, prix, "dureeEnMois", "maxEmployees", features)
SELECT 'ESSENTIEL', 'Essentiel', 'Formule de base', 29, 12, 10, '["DUERP simple", "Support email"]'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'ESSENTIEL');

INSERT INTO plans (code, nom, description, prix, "dureeEnMois", "maxEmployees", features)
SELECT 'PRO', 'Professionnel', 'Formule standard', 59, 12, 50, '["DUERP complet", "Mini-audits", "Support prioritaire"]'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE code = 'PRO');

INSERT INTO plans (code, nom, description, prix, "dureeEnMois", "maxEmployees", features)
SELECT 'PREMIUM', 'Premium', 'Formule complète', 99, 12, 200, '["DUERP complet", "Audits illimités", "Support dédié", "Formation"]'
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

-- ==========================================
-- 3. CATÉGORIES DE RISQUES
-- ==========================================
INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'PHYSIQUES', 'Risques Physiques', 'Risques liés aux contraintes physiques', 1
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'PHYSIQUES');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'CHIMIQUES', 'Risques Chimiques', 'Exposition aux substances chimiques', 2
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'CHIMIQUES');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'PSYCHOSOCIAUX', 'Risques Psychosociaux', 'Stress, harcèlement, charge mentale', 3
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'PSYCHOSOCIAUX');

INSERT INTO risque_categories (code, nom, description, ordre)
SELECT 'BIOLOGIQUES', 'Risques Biologiques', 'Agents biologiques et infectieux', 4
WHERE NOT EXISTS (SELECT 1 FROM risque_categories WHERE code = 'BIOLOGIQUES');

-- ==========================================
-- 4. UTILISATEURS DE TEST
-- ==========================================

-- Admin
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'admin_test_001', 'admin@icpp-test.fr', 'Admin Test', 'ADMIN', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@icpp-test.fr');

-- Auditeur 1
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'auditeur_test_001', 'auditeur1@icpp-test.fr', 'Sophie Martin', 'AUDITEUR', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'auditeur1@icpp-test.fr');

-- Auditeur 2
INSERT INTO users (id, email, name, role, password, "emailVerified")
SELECT 'auditeur_test_002', 'auditeur2@icpp-test.fr', 'Pierre Durand', 'AUDITEUR', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'auditeur2@icpp-test.fr');

-- ==========================================
-- 5. ENTREPRISES TPE
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

-- ==========================================
-- 6. ABONNEMENTS
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

-- ==========================================
-- 7. RÉGLEMENTATIONS
-- ==========================================
INSERT INTO reglementations (id, titre, description, type, "dateVigueur", "impactDuerp", "isActive", "metiersCodes")
SELECT 'regl_001', 'Code du Travail - Article L4121', 'Obligations générales de sécurité', 'CODE_TRAVAIL', '2024-01-01', true, true, '[]'
WHERE NOT EXISTS (SELECT 1 FROM reglementations WHERE id = 'regl_001');

INSERT INTO reglementations (id, titre, description, type, "dateVigueur", "impactDuerp", "isActive", "metiersCodes")
SELECT 'regl_002', 'Règlement Sanitaire - Restauration', 'Normes HACCP obligatoires', 'DECRET', '2024-01-01', true, true, '["RESTAURATION", "BOULANGERIE"]'
WHERE NOT EXISTS (SELECT 1 FROM reglementations WHERE id = 'regl_002');

-- Confirmation
SELECT 'Seed complet exécuté avec succès' as message;
```

---

## Espace Admin

### Identifiants de connexion

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@icpp-test.fr` | `Test123!` | ADMIN |

### Fonctionnalités à Tester

---

### 1. Tableau de Bord Admin

**URL** : `/admin`

**Test** :
1. Se connecter avec les identifiants admin
2. Vérifier les statistiques affichées (entreprises, audits, DUERP)
3. Vérifier les graphiques et tendances

---

### 2. Gestion des Entreprises TPE

**URL** : `/admin/entreprises`

**Test - Liste** :
1. Naviguer vers `/admin/entreprises`
2. Vérifier que les entreprises de test apparaissent
3. Tester le filtre de recherche avec "Coiffure"

**Test - Création** :
1. Cliquer sur "Nouveau client"
2. Remplir avec :
   
   **Informations entreprise** :
   - Nom de l'entreprise : `Test Pizzeria Roma`
   - Numéro SIRET : `12345678912345` (optionnel)
   - Métier / Secteur d'activité : `Restauration`
   - Effectif : `8`
   - Formule d'abonnement : `Professionnel - 59€/mois` (optionnel)
   
   **Coordonnées** :
   - Adresse : `5 rue Italia`
   - Code postal : `75001`
   - Ville : `Paris`
   - Téléphone : `01 11 22 33 44`
   - Email professionnel : `test@pizzeria.fr`
   
   **Contact principal** (optionnel) :
   - Nom complet : `Mario Rossi`
   - Fonction : `Gérant`
   - Email du contact : `mario.rossi@pizzeria.fr`

3. Cliquer "Créer le client"
4. Vérifier le toast de succès "Client TPE créé avec succès"
5. Vérifier la redirection vers `/admin/entreprises`


**Test - Modification** :
1. Cliquer sur le menu actions d'une entreprise
2. Sélectionner "Modifier"
3. Changer le nom en "Nouveau Nom Test"
4. Enregistrer et vérifier la mise à jour

**Test - Suppression** :
1. Cliquer sur le menu actions
2. Sélectionner "Supprimer"
3. Confirmer la suppression
4. Vérifier que l'entreprise disparaît

---

### 3. Gestion des Auditeurs / Commerciaux

**URL** : `/admin/auditeurs`

**Fonctionnalités** :
- Liste avec statistiques (auditeurs, commerciaux, audits assignés)
- Filtre par rôle (Tous / Auditeurs / Commerciaux / Inactifs)
- Création avec sélection du rôle
- Modification
- Activation / Désactivation
- Suppression avec confirmation

**Test - Liste et Indicateurs** :
1. Naviguer vers `/admin/auditeurs`
2. Vérifier les 3 cartes de statistiques :
   - Nombre d'auditeurs actifs
   - Nombre de commerciaux actifs
   - Total des audits assignés
3. Vérifier que la liste affiche les auditeurs/commerciaux de test

**Test - Filtrage** :
1. Utiliser le sélecteur "Filtrer par rôle"
2. Sélectionner "Auditeurs" → Vérifier que seuls les auditeurs s'affichent
3. Sélectionner "Commerciaux" → Vérifier que seuls les commerciaux s'affichent
4. Sélectionner "Inactifs" → Vérifier les comptes désactivés
5. Revenir à "Tous les rôles"

**Test - Création Auditeur** :
1. Cliquer "Nouveau compte"
2. Remplir le formulaire :
   - Rôle : `Auditeur ICPP`
   - Prénom : `Marie`
   - Nom : `Dupont`
   - Email : `marie.dupont@icpp-test.fr`
   - Téléphone : `06 12 34 56 78`
3. Cliquer "Créer le compte"
4. Vérifier le toast de succès
5. Vérifier que le nouvel auditeur apparaît avec le badge "Auditeur"

**Test - Création Commercial** :
1. Cliquer "Nouveau compte"
2. Remplir le formulaire :
   - Rôle : `Commercial`
   - Prénom : `Lucas`
   - Nom : `Bernard`
   - Email : `lucas.bernard@icpp-test.fr`
   - Téléphone : `06 98 76 54 32`
3. Cliquer "Créer le compte"
4. Vérifier que le nouveau commercial apparaît avec le badge bleu "Commercial"

**Test - Modification** :
1. Cliquer sur le menu actions (⋮) d'un auditeur
2. Sélectionner "Modifier"
3. Changer le nom en "Nouveau Nom"
4. Enregistrer et vérifier la mise à jour

**Test - Désactivation** :
1. Cliquer sur le menu actions d'un auditeur actif
2. Sélectionner "Désactiver"
3. Vérifier que le statut passe à "Inactif" (badge gris)
4. Le compte désactivé ne peut plus se connecter

**Test - Réactivation** :
1. Cliquer sur le menu actions d'un auditeur inactif
2. Sélectionner "Activer"
3. Vérifier que le statut repasse à "Actif" (badge vert)

**Test - Suppression** :
1. Cliquer sur le menu actions
2. Sélectionner "Supprimer"
3. Confirmer dans la boîte de dialogue
4. Vérifier que le compte disparaît de la liste

**Données de test supplémentaires** :
```sql
-- Commercial de test
INSERT INTO users (id, email, name, role, phone, password, "emailVerified")
SELECT 'commercial_test_001', 'commercial1@icpp-test.fr', 'Marc Leblanc', 'COMMERCIAL', '06 11 22 33 44', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'commercial1@icpp-test.fr');
```

---


### 4. Gestion des Métiers

**URL** : `/admin/metiers`

**Test - Liste** :
1. Vérifier l'affichage des métiers existants
2. Tester le filtre de recherche

**Test - Création** :
1. Cliquer "Nouveau métier"
2. Remplir :
   - Nom : `Fleuriste`
   - Description : `Vente de fleurs et compositions florales`
3. Enregistrer

**Test - Toggle Statut** :
1. Basculer le statut actif/inactif
2. Vérifier le changement visuel

---

### 5. Gestion des Réglementations

**URL** : `/admin/reglementations`

**Test - Création** :
1. Cliquer "Nouvelle réglementation"
2. Remplir :
   - Titre : `Décret Test 2024`
   - Type : `Décret`
   - Date d'entrée en vigueur : `2024-06-01`
   - Impact DUERP : `Oui`
   - Métiers concernés : `Coiffure, Esthétique`
3. Enregistrer

---

### 6. Gestion des Risques

#### 6.1 Catégories de Risques

**URL** : `/admin/risques/categories`

**Test - Création** :
1. Cliquer "Nouvelle catégorie"
2. Remplir :
   - Code : `ERGONOMIQUES`
   - Nom : `Risques Ergonomiques`
   - Description : `Troubles musculo-squelettiques et postures`
3. Enregistrer

**Test - Réorganisation** :
1. Utiliser les boutons flèches pour réordonner
2. Vérifier la mise à jour de l'ordre

#### 6.2 Risques Métiers

**URL** : `/admin/risques/metiers`

**Test - Création** :
1. Cliquer "Nouveau risque"
2. Remplir :
   - Métier : `Coiffure`
   - Catégorie : `Risques Chimiques`
   - Nom : `Exposition aux teintures`
   - Gravité : `Important`
   - Fréquence : `Fréquent`
   - Mesures suggérées : `Gants, Ventilation, Formation`
3. Enregistrer

---

### 7. Planification d'Audits

**URL** : `/admin/audits`

**Test - Création** :
1. Cliquer "Planifier un audit"
2. Remplir :
   - Entreprise : `Salon Coiffure Élégance`
   - Auditeur : `Sophie Martin`
   - Type : `Mini-audit annuel`
   - Date : `Date du lendemain`
3. Confirmer

---

## Espace Auditeur

### Identifiants de connexion

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `auditeur1@icpp-test.fr` | `Test123!` | AUDITEUR |
| `auditeur2@icpp-test.fr` | `Test123!` | AUDITEUR |

### Fonctionnalités à Tester

---

### 1. Tableau de Bord Auditeur

**URL** : `/auditeur`

**Test** :
1. Se connecter avec les identifiants auditeur
2. Vérifier les statistiques (clients assignés, audits en cours)
3. Vérifier la liste des clients récents

---

### 2. Gestion des Clients TPE

**URL** : `/auditeur/entreprises`

**Test - Liste** :
1. Vérifier l'affichage des clients
2. Tester le filtre de recherche

**Test - Création** :
1. Cliquer "Nouveau client"
2. Remplir dans le modal :
   - Nom : `Client Test Auditeur`
   - Métier : `Boulangerie`
   - Adresse : `12 rue du Pain`
   - Ville : `Paris`
   - Email : `test.auditeur@client.fr`
3. Créer et vérifier l'ajout

**Test - Fiche Détail** :
1. Cliquer "Voir la fiche" sur un client
2. URL attendue : `/auditeur/entreprises/[id]`
3. Vérifier les informations affichées

**Test - Modification** :
1. Sur la fiche détail, cliquer "Modifier"
2. Modifier l'adresse
3. Enregistrer et vérifier

---

### 3. Gestion des Audits

**URL** : `/auditeur/audits`

**Test - Liste** :
1. Vérifier l'affichage des audits assignés
2. Filtrer par statut

---

### 4. DUERP

**URL** : `/auditeur/duerp`

**Test** :
1. Vérifier la liste des DUERP
2. Consulter un DUERP existant

---

## Espace Client

### Identifiants de connexion

> Note : Les clients sont créés dynamiquement. Pour tester, créer un utilisateur CLIENT lié à une entreprise.

```sql
-- Créer un utilisateur client de test
INSERT INTO users (id, email, name, role, password, "emailVerified", "companyId")
VALUES ('client_test_001', 'client@test.fr', 'Client Test', 'CLIENT', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', now(), 'company_test_001');
```

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `client@test.fr` | `Test123!` | CLIENT |

### Fonctionnalités à Tester

---

### 1. Tableau de Bord Client

**URL** : `/client`

**Test** :
1. Se connecter avec les identifiants client
2. Vérifier l'affichage des informations entreprise
3. Vérifier le statut DUERP

---

## Vérifications Techniques

### Compilation TypeScript

```bash
npx tsc --noEmit
```

**Résultat attendu** : Aucune erreur

### Build Production

```bash
npm run build
```

**Résultat attendu** : Build réussi à 100% ✅ (Stripe optionnel en dev)

### Vérification Base de Données

```bash
npx prisma studio
```

Vérifier les tables :
- `users` : Utilisateurs de test présents
- `companies` : Entreprises de test présentes
- `metiers_icpp` : Métiers présents
- `plans_tarifaires` : Plans d'abonnement présents
- `signalements` : Table avec relation Company
- `reglementations` : Table avec champs type, dateVigueur, metiersCodes

---

## 📋 Données de Test Complètes par Formulaire

### 🔐 Page Login (`/login`)

| Champ | Type | Valeur Test Admin | Valeur Test Auditeur | Valeur Test Client |
|-------|------|-------------------|----------------------|-------------------|
| Email | email | `admin@icpp-platform.fr` | `auditeur@icpp-platform.fr` | `marie@belleallure.re` |
| Mot de passe | password | `password123` | `password123` | `password123` |

**Onglets disponibles** : Client / Auditeur / Administrateur

> **Script de création des utilisateurs** : `npx tsx prisma/create-test-users.ts`

---

### 🏢 Modal Création Client TPE (`/admin/entreprises` → "Nouveau client")

#### Section : INFORMATIONS ENTREPRISES
| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Raison sociale | `raisonSociale` | text | ✅ Oui | `Pizzeria Roma Test` |
| Nom commercial | `nomCommercial` | text | Non | `Chez Roma` |
| SIRET | `siret` | text | Non | `12345678901234` |
| Code APE | `codeApe` | text | Non | `5610A` |

#### Section : ACTIVITE
| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Métier | `metier` | select | ✅ Oui | `RESTAURATION` |
| Activité détaillée | `activiteDetaillee` | text | Non | `Restaurant italien, pizzeria` |
| Nombre de salariés | `nombreSalaries` | number | ✅ Oui | `8` |

**Options Métier** : COIFFURE, RESTAURATION, BOULANGERIE, GARAGE, ESTHETIQUE, COMMERCE, BATIMENT

#### Section : CONTACT
| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Adresse e-mail | `email` | email | ✅ Oui | `contact@pizzeria-roma.fr` |
| Téléphone | `telephone` | tel | Non | `01 42 33 44 55` |
| Nom du dirigeant | `nomDirigeant` | text | Non | `Rossi` |
| Prénom du dirigeant | `prenomDirigeant` | text | Non | `Mario` |

#### Section : ADRESSE
| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Adresse | `adresse` | text | Non | `15 rue de Naples` |
| Code postal | `codePostal` | text | Non | `75009` |
| Ville | `ville` | text | Non | `Paris` |

#### Section : ABONNEMENT
| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Formule | `formule` | select | Non | `PRO` |
| Commentaire interne | `commentaire` | textarea | Non | `Client apporté par commercial Lucas` |

**Options Formule** : ESSENTIEL (29€), PRO (49€), PREMIUM (79€)

---

### 👤 Modal Création Auditeur/Commercial (`/admin/auditeurs` → "Nouveau compte")

| Champ | Name HTML | Type | Obligatoire | Valeur Test Auditeur | Valeur Test Commercial |
|-------|-----------|------|-------------|----------------------|----------------------|
| Rôle | (state) | select | ✅ Oui | `AUDITEUR` | `COMMERCIAL` |
| Prénom | `prenom` | text | ✅ Oui | `Marie` | `Lucas` |
| Nom | `nom` | text | ✅ Oui | `Dupont` | `Bernard` |
| Email | `email` | email | ✅ Oui | `marie.dupont@icpp.fr` | `lucas.bernard@icpp.fr` |
| Téléphone | `phone` | tel | Non | `06 12 34 56 78` | `06 98 76 54 32` |

**Options Rôle** : Auditeur ICPP, Commercial

---

### 📜 Modal Création Réglementation (`/admin/reglementations` → "Nouvelle réglementation")

| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Titre de l'obligation | `titre` | text | ✅ Oui | `Décret 2026-123 Sécurité Incendie` |
| Description | `description` | textarea | Non | `Nouvelles normes de sécurité incendie applicables aux ERP` |
| Type d'obligation | (state) | select | ✅ Oui | `CODE_TRAVAIL` |
| Date d'entrée en vigueur | `date` | date | Non | `2026-03-01` |
| Impact DUERP | (switch) | boolean | Non | `true` |
| Obligation active | (switch) | boolean | Non | `true` |

**Options Type** : DUERP, CODE_TRAVAIL, CONVENTION

---

### 🏭 Modal Création Métier (`/admin/metiers` → "Nouveau métier")

| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Nom du métier | `nom` | text | ✅ Oui | `Fleuriste` |
| Statut réglementaire | (select) | select | Non | `actif` |
| Description | `description` | textarea | Non | `Vente de fleurs, compositions florales et plantes` |
| Risques standards | (input) | text | Non | `Manipulation de produits chimiques` |
| Mesures de prévention | (input) | text | Non | `Port de gants, aération du local` |

**Options Statut** : actif, inactif

---

### 📅 Modal Planifier Audit (`/admin/audits` → "Planifier un audit")

| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Entreprise | `companyId` | select | ✅ Oui | (sélectionner une entreprise existante) |
| Auditeur assigné | `auditorId` | select | ✅ Oui | (sélectionner un auditeur existant) |
| Type d'audit | `type` | select | ✅ Oui | `AUDIT_INITIAL` |
| Date de l'audit | `dateAudit` | date | ✅ Oui | `2026-02-15` |

**Options Type** : AUDIT_INITIAL, SUIVI_ANNUEL, EXCEPTIONNEL

---

### 📄 Modal Création Affichage (`/admin/affichages` → "Nouvel affichage")

| Champ | Name HTML | Type | Obligatoire | Valeur Test |
|-------|-----------|------|-------------|-------------|
| Type d'affichage | (state) | select | ✅ Oui | `INSPECTION_TRAVAIL` |
| Titre | `title` | text | ✅ Oui | `Inspection du travail - Paris 9ème` |
| Entreprise | (state) | select | ✅ Oui | (sélectionner une entreprise) |
| Description | `description` | textarea | Non | `Coordonnées de l'inspection du travail` |
| URL fichier | `fileUrl` | text | Non | `https://example.com/affichage.pdf` |

**Options Type** : INSPECTION_TRAVAIL, MEDECINE_TRAVAIL, CONSIGNES_SECURITE, HORAIRES_TRAVAIL, AUTRE

---

### 🔍 Wizard Nouvel Audit (`/auditeur/audits/nouveau`)

#### Étape 1 : Entreprise
| Champ | Type | Valeur Test |
|-------|------|-------------|
| Entreprise | select | `Restaurant le Gourmet` |
| Métier | select | `Groupe restauration rapide` |

#### Étape 2 : Documents (6 checkboxes)
| Document | ID | Cocher |
|----------|-----|--------|
| DUERP existant et accessible | `duerp` | ✅ |
| Affichages obligatoires présents | `affichages` | ✅ |
| Extincteurs présents et vérifiés | `extincteurs` | ✅ |
| Registre de sécurité à jour | `registre` | ❌ |
| Registre unique du personnel | `personnel` | ✅ |
| Formations sécurité réalisées | `formations` | ❌ |

#### Étape 3 : Risques (par catégorie)

**RISQUES PHYSIQUES** :
| Risque | ID | Cocher | Gravité | Fréquence |
|--------|-----|--------|---------|-----------|
| Chutes de plain-pied | `chutes-plain-pied` | ✅ | 2 | 3 |
| Manutention manuelle | `manutention` | ✅ | 3 | 4 |
| Bruit | `bruit` | ❌ | - | - |
| Chutes de hauteur | `chutes-hauteur` | ❌ | - | - |
| Postures contraignantes | `postures` | ✅ | 2 | 5 |

**RISQUES CHIMIQUES** :
| Risque | ID | Cocher | Gravité | Fréquence |
|--------|-----|--------|---------|-----------|
| Produits de corrosion | `corrosion` | ❌ | - | - |
| Aérosols | `aerosols` | ❌ | - | - |
| CMR | `cmr` | ❌ | - | - |
| Produits de nettoyage | `nettoyage` | ✅ | 2 | 4 |
| Allergènes | `allergenes` | ✅ | 3 | 3 |

**RISQUES BIOLOGIQUES** :
| Risque | ID | Cocher |
|--------|-----|--------|
| Contact cuisine | `cuisine` | ✅ |
| Agents infectieux | `infectieux` | ❌ |
| Déchets / Piqûres | `dechets` | ✅ |

**RISQUES PSYCHOSOCIAUX** :
| Risque | ID | Cocher |
|--------|-----|--------|
| Charge de travail | `travail` | ✅ |
| Harcèlement d'équipes | `harcelement` | ❌ |
| Relations clients | `clients` | ✅ |
| Travail isolé | `travail-isole` | ❌ |

**RISQUES INCENDIE** :
| Risque | ID | Cocher |
|--------|-----|--------|
| Installations électriques | `electriques` | ✅ |
| Issues de secours | `secours` | ✅ |
| Stockage produits | `stockage` | ❌ |
| Moyens d'extinction | `obstruction` | ✅ |

#### Étape 4 : Synthèse
| Champ | Type | Valeur Test |
|-------|------|-------------|
| Commentaire global | textarea | `Audit initial satisfaisant. Points d'amélioration : mise à jour du registre de sécurité et formation SST à planifier.` |

---

### 🔔 Page Signalements (`/auditeur/signalements`)

**Types de signalements disponibles** :
- `NOUVEAU_SALARIE` - Nouveau salarié
- `ACCIDENT_TRAVAIL` - Accident du travail
- `NOUVEL_EQUIPEMENT` - Nouvel équipement
- `DEMENAGEMENT` - Déménagement

**Statuts** :
- `NOUVEAU` - Nouveau
- `EN_COURS` - En cours
- `TRAITE` - Traité

---

### 🔑 Page Mot de Passe Oublié (`/forgot-password`)

| Champ | Type | Valeur Test |
|-------|------|-------------|
| Email | email | `admin@icpp-test.fr` |

---

### 🔐 Page Réinitialisation Mot de Passe (`/reset-password?token=xxx`)

| Champ | Type | Valeur Test |
|-------|------|-------------|
| Nouveau mot de passe | password | `NouveauMDP123!` |
| Confirmer le mot de passe | password | `NouveauMDP123!` |

**Contraintes** : Minimum 6 caractères

---

## 📊 Scripts SQL de Test Rapide

### Créer tous les utilisateurs de test

```sql
-- Hash pour mot de passe "Test123!" : $2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy

-- Admin
INSERT OR IGNORE INTO users (id, email, name, role, password, "emailVerified")
VALUES ('admin_001', 'admin@icpp-test.fr', 'Admin ICPP', 'ADMIN', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', datetime('now'));

-- Auditeur 1
INSERT OR IGNORE INTO users (id, email, name, role, password, "emailVerified")
VALUES ('auditeur_001', 'auditeur1@icpp-test.fr', 'Sophie Martin', 'AUDITOR', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', datetime('now'));

-- Auditeur 2
INSERT OR IGNORE INTO users (id, email, name, role, password, "emailVerified")
VALUES ('auditeur_002', 'auditeur2@icpp-test.fr', 'Pierre Durand', 'AUDITOR', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', datetime('now'));

-- Commercial
INSERT OR IGNORE INTO users (id, email, name, role, password, "emailVerified")
VALUES ('commercial_001', 'commercial1@icpp-test.fr', 'Marc Leblanc', 'COMMERCIAL', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', datetime('now'));

-- Client (lié à une entreprise)
INSERT OR IGNORE INTO users (id, email, name, role, password, "emailVerified", "companyId")
VALUES ('client_001', 'client@test.fr', 'Client Test', 'CLIENT', '$2b$10$K8kGQG8FqWpZmQfTVeKFxu8p2XQW6lKNJqVOqPzHxHQFWVHfCbJZy', datetime('now'), 'company_test_001');
```

### Créer les entreprises de test

```sql
-- Entreprises TPE
INSERT OR IGNORE INTO companies (id, name, siret, email, phone, address, "postalCode", city, "metierCode", "employeeCount")
VALUES 
('company_test_001', 'Salon Coiffure Élégance', '12345678901234', 'contact@elegance-coiffure.fr', '01 23 45 67 89', '15 rue des Ciseaux', '75009', 'Paris', 'COIFFURE', 4),
('company_test_002', 'Boulangerie du Blé Doré', '98765432109876', 'ble.dore@boulangerie.fr', '01 98 76 54 32', '8 place du Marché', '69001', 'Lyon', 'BOULANGERIE', 6),
('company_test_003', 'Restaurant Le Bon Goût', '45678912345678', 'reservation@lebongout.fr', '04 56 78 91 23', '22 avenue Gourmet', '13001', 'Marseille', 'RESTAURATION', 12),
('company_test_004', 'Auto Service Plus', '78912345678912', 'contact@autoserviceplus.fr', '03 78 91 23 45', '45 route de la Mécanique', '31000', 'Toulouse', 'GARAGE', 5),
('company_test_005', 'Institut Beauté Zen', '32165498732165', 'rdv@beautezen.fr', '02 32 16 54 98', '10 rue du Bien-être', '44000', 'Nantes', 'ESTHETIQUE', 3);
```

### Créer un signalement de test

```sql
INSERT INTO signalements (id, "companyId", type, titre, description, status, "createdAt", "updatedAt")
VALUES (
    'sig_test_001',
    'company_test_001',
    'ACCIDENT_TRAVAIL',
    'Chute d''un employé',
    'Un employé a glissé sur le sol mouillé dans la réserve. Blessure légère au poignet.',
    'NOUVEAU',
    datetime('now'),
    datetime('now')
);
```

---

## Historique des Mises à Jour

| Date | Fonctionnalité | Ajouts |
|------|----------------|--------|
| **2026-02-06** | **BUILD STABLE** | ✅ Build 100%, corrections Prisma, Stripe optionnel, données complètes |
| 2026-02-04 | Gestion Auditeurs/Commerciaux | CRUD complet, sélection rôle, filtre, stats, activation/désactivation |
| 2026-02-04 | Gestion TPE Admin/Auditeur | Tests création/modification/détail entreprises |
| 2026-02-04 | Gestion Risques | Tests catégories et risques métiers |
| 2026-02-02 | Interface Auditeur | Tests auditeur dashboard, audits, DUERP |
| 2026-01-29 | Backend Admin | Tests CRUD entreprises, métiers, réglementations |
