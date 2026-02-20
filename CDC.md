**BLOC 1**

**(Architecture complète du SaaS ICPP Conformité -- sans les détails
métiers/risques ni le DUERP PDF, qui viendront en Bloc 2 et 3)**

Ta mission est de créer une application SaaS complète appelée :

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

Cette application est destinée à :

des **auditeurs ICPP** (internes)

des **clients entreprises** (TPE / PME)

L'objectif principal de l'application est de :

Permettre aux auditeurs ICPP de réaliser des **audits de conformité
légale** chez les clients (affichage obligatoire, sécurité, DUERP,
risques professionnels, etc.).

Générer automatiquement un **Document Unique d'Évaluation des Risques
Professionnels (DUERP)** propre à chaque client, au format PDF premium
(design institutionnel + moderne).

Gérer les **abonnements** des entreprises via **Stripe** (mensuel /
annuel).

Gérer les **mises à jour DUERP** :

suite à des changements déclarés par le client (nouveaux salariés,
déménagement, etc.)

suite à des évolutions réglementaires

via une **mise à jour annuelle obligatoire**.

Fournir une **interface client** (espace en ligne ICPP) pour :

consulter son niveau de conformité

télécharger ses DUERP

voir les actions recommandées

accéder à ses factures

Signaler une mise a jour ( nouveau employer ou départ, nouvel
équipement, déménagement, nouvelle activité, accident du travail, etc.)

**1. STRUCTURE GLOBALE DE L'APPLICATION**

Crée une application web SaaS **full stack**, responsive, avec :

-   Une **zone d'authentification** (login / mot de passe)

-   Des **rôles utilisateurs** distincts :

    -   **Admin ICPP**

    -   **Auditeur ICPP**

    -   **Client entreprise**

-   Un **backend** avec base de données relationnelle

-   Un **frontend** moderne (composants clairs, interface épurée,
    couleurs bleu marine + bleu clair par exemple)

-   Intégration **Stripe** pour la gestion des abonnements et paiements
    ponctuels

-   Un système de **génération de PDF** (qui sera défini en détail dans
    un prompt séparé -- BLOC 3).

**2. RÔLES UTILISATEURS**

**2.1. Admin ICPP Conformité**

L'admin peut :

Gérer les comptes auditeurs ICPP

Gérer les comptes clients entreprises

Paramétrer les **métiers** et **types de risques** (les risques
détaillés arriveront dans BLOC 2)

Paramétrer les **réglementations** (changements légaux)

Voir les abonnements et paiements

Consulter tous les audits et tous les DUERP

Forcer une mise à jour du DUERP pour certains métiers / clients.

Consulter les signalement des clients pour les mises à jours

-   Valider des demandes de mise à jour transmises par les clients

-   Marquer des actions comme "fait" / "en cours" dans les plans
    d'action.

**2.2. Auditeur ICPP Conformité**

L'auditeur peut :

Consulter la liste des entreprises clientes

Créer un **nouvel audit** pour une entreprise

Remplir un formulaire d'audit complet (organisation, documents, risques
-- la structure des risques viendra dans BLOC 2)

Choisir l'abonnement adapter pour le client

Validé le paiement avec le client

Générer une nouvelle **version DUERP** à partir d'un audit

Voir l'historique des audits & DUERP d'une entreprise

**2.3. Client entreprise**

Le client peut :

Se connecter à son **espace ICPP Conformité**

Voir l'état global de sa conformité (barre de score / statut : conforme,
partiel, non conforme)

Télécharger son **DUERP** en PDF (dernière version et versions
précédentes)

Voir la liste des **actions de prévention** à mettre en place

**Déclarer des changements** (nouveau salarié, changement d'adresse,
nouvelle activité, nouvel équipement, accident du travail, etc.)

Voir ses **factures** et son **statut d'abonnement**

Mettre à jour ses informations administratives (dans une limite
définie).

**3. BASES DE DONNÉES PRINCIPALES**

Crée les tables / collections suivantes (avec relations) :

**3.1. Utilisateurs**

Champs :

-   id

-   nom

-   prenom

-   email

-   mot_de_passe (hash)

-   role (admin_icpp / auditeur_icpp / client_entreprise)

-   entreprise_id (nullable, présent seulement si utilisateur = client
    d'une entreprise)

-   date_creation

**3.2. Entreprises**

Champs :

-   id

-   nom_entreprise

-   nom_commercial (optionnel)

-   siret

-   code_ape

-   adresse

-   code_postal

-   ville

-   pays

-   telephone

-   email_contact

-   dirigeant_nom

-   dirigeant_prenom

-   effectif_total

-   metier_id (relation vers une table Métiers -- définie en BLOC 2)

-   medecine_travail

-   assurance

-   date_creation_client

-   statut_duerp (enum : "A jour", "À renouveler", "À mettre à jour",
    "Non réalisé")

-   date_derniere_mise_a_jour_duerp

-   stripe_customer_id

-   abonnement_statut (actif / en_retard / suspendu / résilié)

-   abonnement_type (mensuel / annuel / autre)

-   abonnement_date_debut

-   abonnement_date_fin

-   commentaire_interne

Relations :

1 entreprise → plusieurs **salariés**

1 entreprise → plusieurs **audits**

1 entreprise → plusieurs **DUERP_versions**

1 entreprise → plusieurs **changements_entreprise**

1 entreprise → plusieurs **paiements**

**3.3. Salariés**

Champs :

-   id

-   entreprise_id (FK)

-   nom

-   prenom

-   poste

-   unite_travail (ex : salon, cuisine, accueil, administratif...)

-   date_entree

-   date_sortie (nullable)

-   temps_travail (temps complet / partiel / saisonnier)

**3.4. Métiers (structure des métiers, risques détaillés ajoutés en BLOC
2)**

Pour l'instant, structure de base :

-   id

-   nom_metier (ex : "Coiffeur / Esthétique", "Snack / Restauration
    rapide", etc.)

-   description

-   actif (bool)

Les risques par métier seront définis dans BLOC 2 (une autre table
liée).

**3.5. Audits**

Un audit = une visite ou une évaluation réalisée par un auditeur ICPP.

Champs :

id

entreprise_id

auditeur_id (relation vers Utilisateurs)

date_audit

metier_id (copie du métier de l'entreprise à l'instant T)

statut (Brouillon / En cours / Terminé / Utilisé pour DUERP)

commentaire_general

documents_obligatoires (structure JSON ou champs séparés booléens pour
DUERP présent, affichages, extincteurs, etc.)

score_conformite (0--100, calculé)

synthese_automatique (texte généré, utile pour interne -- même si on
l'affiche en partie côté client)

Liens vers tables de **risques** (définies plus tard : BLOC 2)

Un audit doit servir de base à une génération de DUERP.

**3.6. DUERP_versions**

Chaque DUERP généré pour une entreprise doit être conservé.

Champs :

-   id

-   entreprise_id

-   audit_id (audit source)

-   version_numero (1, 2, 3, ...)

-   date_generation

-   statut (valide / archivé / remplacé)

-   pdf_url (lien vers le fichier DUERP PDF stocké)

-   commentaire (optionnel)

**3.7. Changements_Entreprise**

Déclarations de changements faites par le client.

Champs :

-   id

-   entreprise_id

-   type_changement (nouveau_salarie / depart_salarie / demenagement /
    nouvel_equipement / accident_travail / nouvelle_activite / autre)

-   details (texte libre)

-   date_declaration

-   statut_traitement (nouveau / en_cours / traité)

-   audit_id_lie (nullable, s'il donne lieu à un nouvel audit)

Ces changements doivent déclencher des tâches côté auditeur et
influencer l'état du DUERP.

**3.8. Réglementation**

Champs :

-   id

-   titre_obligation

-   description

-   categorie (ex : incendie, chimique, affichage, DUERP, RPS...)

-   metiers_concernes (relation ou liste)

-   actif (bool)

-   date_entree_vigueur

-   date_derniere_mise_a_jour

Ces entrées serviront à déclencher des demandes de mise à jour DUERP en
masse.

**3.9. Taches_Auditeur**

Pour gérer la charge de travail des auditeurs.

Champs :

-   id

-   auditeur_id

-   entreprise_id

-   type_tache (nouvel_audit / mise_a_jour_duerp /
    controle_post_accident / mise_a_jour_reglementaire)

-   description

-   priorite (basse / moyenne / haute / urgente)

-   statut (a_faire / en_cours / fait)

-   date_creation

-   date_echeance

**3.10. Paiements / Abonnements (Stripe)**

Champs :

-   id

-   entreprise_id

-   stripe_customer_id

-   stripe_subscription_id

-   montant

-   devise

-   date_paiement

-   statut_paiement (payé / échoué / en_attente)

-   type_paiement (audit_unique / abonnement_mensuel / abonnement_annuel
    / autre)

L'application doit être prévue pour que **Stripe** gère le paiement, et
que les webhooks Stripe mettent à jour ces entrées.

**4. PAGES / ECRANS À CRÉER**

**4.1. Authentification**

Page **Connexion** (email + mot de passe)

Gestion "mot de passe oublié"

Redirection selon rôle (Admin / Auditeur / Client)

**4.2. Dashboard Admin ICPP**

-   Vue d'ensemble :

    -   Nombre d'entreprises

    -   Nombre d'audits réalisés

    -   Nombre de DUERP générés

    -   Abonnements actifs

    -   Alertes (DUERP à mettre à jour, impayés, etc.)

-   Menu :

    -   Entreprises

    -   Auditeurs

    -   Métiers & Risques (BLOC 2)

    -   Réglementation

    -   Paramètres Stripe

    -   Logs / Historique

**4.3. Dashboard Auditeur ICPP**

Liste des **tâches** (Taches_Auditeur)

Filtre par priorité, date, entreprise

Bouton "Créer un nouvel audit"

Liste des audits en cours / terminés

Accès à la fiche entreprise + historique DUERP

Workflow : "Audit → DUERP" (la logique DUERP détaillée sera fournie en
BLOC 3)

**4.4. Dashboard Client Entreprise**

-   Bandeau :

    -   **Nom entreprise**

    -   **Statut DUERP** (A jour / À renouveler / À mettre à jour)

    -   **Dernier DUERP généré** (date + bouton "Télécharger PDF")

-   Sections :

    -   **Mon DUERP** (liste des versions)

    -   **Mes actions à réaliser** (plan d'action dérivé de l'audit /
        DUERP)

    -   **Mes informations** (adresse, effectif...)

    -   **Mes salariés** (liste, ajout, suppression -- dans un cadre
        contrôlé)

    -   **Mes changements** (déclarer un changement important)

    -   **Factures & Abonnement** (Stripe)

**4.5. Fiche entreprise (vue auditeur/admin)**

Contient :

Infos administratives

Médecine du travail / assurance

Dernier audit

Dernier DUERP

Statut de conformité

Liste des salariés

Liste des audits

Liste des DUERP Versions

Liste des changements déclarés

Boutons :

"Créer un nouvel audit"

"Voir le DUERP le plus récent"

"Telecharger DUERP PDF"

**5. WORKFLOWS CLÉS**

**5.1. Création d'une entreprise & abonnement**

Admin / Auditeur crée une entreprise (ou inscription client avec
validation ICPP).

L'entreprise souscrit à une offre via Stripe (abonnement mensuel ou
annuel).

Après validation de paiement, l'entreprise est marquée abonnement_statut
= actif.

L'auditeur peut planifier un premier audit.

**5.2. Workflow Audit** → **DUERP**

L'auditeur sélectionne une entreprise.

Il clique "Nouvel audit".

Un formulaire multi-étapes apparaît :

Informations générales (déjà pré-remplies)

Vérification des documents obligatoires

Évaluation des risques (section par catégorie -- la structure détaillée
sera fournie dans BLOC 2)

À la fin, un **score de conformité** est calculé, ainsi qu'une
**synthèse automatique** (champ texte).

L'auditeur clique sur "Générer le DUERP".

L'application crée une entrée dans DUERP_versions et déclenche la
génération d'un **DUERP PDF** (structure fournie en BLOC 3).

Le PDF est stocké (pdf_url) et accessible dans l'espace client.

**5.3. Déclaration de changement par le client**

Dans son espace, le client clique sur "Déclarer un changement".

Il choisit le type de changement (nouveaux salariés, déménagement, etc.)
et décrit.

L'application crée une entrée Changements_Entreprise.

Une tâche Taches_Admin est créée automatiquement pour un ADMIN ICPP.

Selon le type de changement, l'entreprise est marquée statut_duerp = \"À
mettre à jour\".

**5.4. Mise à jour annuelle DUERP**

Un job planifié vérifie date_derniere_mise_a_jour_duerp.

Si \> 12 mois : statut_duerp = \"À renouveler\".

Une notification email et/ou in-app est envoyée au client + tâche
auditeur.

**5.5. Changement réglementaire**

Un admin modifie / ajoute une entrée dans Réglementation.

L'application identifie les entreprises concernées (via métiers).

Pour chaque entreprise :

statut_duerp = \"À mettre à jour\"

création d'une Tache_Auditeur

optionnel : notification client "Votre DUERP va être mis à jour suite à
une évolution réglementaire".

**6. INTÉGRATION STRIPE**

-   Utiliser Stripe pour :

    -   gérer les abonnements (mensuels / annuels)

    -   gérer les paiements uniques d'audit (si besoin)

-   À la création d'un abonnement :

    -   stocker stripe_customer_id, stripe_subscription_id, etc.

-   Utiliser les webhooks Stripe pour mettre à jour :

    -   abonnement_statut

    -   abonnement_date_debut / abonnement_date_fin

    -   Paiements

Si l'abonnement est en échec ou résilié :

restreindre l'accès client (lecture seule des anciens DUERP)

interdire la génération de nouveaux DUERP tant que le paiement n'est pas
régularisé.

**7. DUERP PDF -- RÉFÉRENCE**

Le détail du contenu du PDF DUERP (12 pages a peu près, design ICPP
Signature, préambule, tableaux, plan d'action, etc.) sera fourni dans
**un prompt séparé (BLOC 3)** et devra être intégré dans la logique de
génération de DUERP_versions.

Pour l'instant :

-   Prévoir une fonction / action "Générer DUERP PDF pour l'entreprise X
    à partir de l'audit Y".

-   Cette action doit :

    -   créer une entrée dans DUERP_versions

    -   produire un PDF dans le style "ICPP -- Document Unique"

    -   sauvegarder l'URL du PDF

    -   mettre à jour statut_duerp = \"A jour\" et
        date_derniere_mise_a_jour_duerp = aujourd'hui.

**BLOC 2 -- STRUCTURE MÉTIERS & CATÉGORIES**

Tu dois maintenant créer et configurer la **structure de la base métiers
& risques** pour l'application :

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

Ce bloc définit :

-   La table des **métiers pris en charge**

-   La table des **catégories de risques**

-   La table des **risques par métier**

-   Les **relations** entre :

    -   Métier

    -   Catégorie de risque

    -   Risques_Metier

    -   Audits

    -   DUERP

    -   Actions de prévention

⚠️ **Les données détaillées de risques (par métier) sont fournies dans
le BLOC 2B ci-dessous.**\
Ce BLOC 2 sert à créer la **structure** et les **listes de base**.

1.  **TABLE Metiers_ICPP**

Créer la table : Metiers_ICPP

**Champs :**

-   id (clé primaire)

-   nom_metier (string)

-   description (string)

-   actif (bool, default = true)

**Insérer les 9 métiers suivants (EXACTEMENT ces libellés) :**

1.  nom_metier : **\"Coiffure / Barbier\"**\
    description : Activités de coiffure, coupe, coloration, soins
    capillaires, taille de barbe.

2.  nom_metier : **\"Esthétique / Ongles / Bien-être\"**\
    description : Soins esthétiques, manucure, onglerie, soins du corps
    et du visage.

3.  nom_metier : **\"Snack / Restauration rapide\"**\
    description : Restauration rapide, snacks, sandwicheries, vente à
    emporter.

4.  nom_metier : **\"Restaurant traditionnel\"**\
    description : Restauration assise, cuisine traditionnelle, service à
    table.

5.  nom_metier : **\"Boutique / Prêt-à-porter\"**\
    description : Magasins de vêtements, chaussures, accessoires.

6.  nom_metier : **\"Pharmacie / Parapharmacie\"**\
    description : Pharmacies d'officine, parapharmacies, vente de
    médicaments et produits de santé.

7.  nom_metier : **\"Transport / Livraison\"**\
    description : Activités de livraison, conduite de véhicules
    légers/utilitaires.

8.  nom_metier : **\"Nettoyage / Entretien\"**\
    description : Agents de propreté, entretien de locaux,
    multiservices.

9.  nom_metier : **\"Administratif / Bureautique / Assurance /
    Cabinets\"**\
    description : Bureaux d'assurance, cabinets administratifs,
    secrétariat, gestion de dossiers.

💡 Important :\
Les valeurs metier_nom utilisées dans le **BLOC 2B** doivent
**correspondre exactement** au champ nom_metier de cette table.

**2. TABLE Risques_Categorie**

Créer la table : Risques_Categorie

**Champs :**

-   id (clé primaire)

-   nom_categorie (string)

**Valeurs à insérer :**

1.  nom_categorie : **\"Physiques\"**

```{=html}
<!-- -->
```
10. nom_categorie : **\"Chimiques\"**

11. nom_categorie : **\"Psychosociaux (RPS)\"**

12. nom_categorie : **\"Organisationnels\"**

13. nom_categorie : **\"Incendie & Locaux\"\`**

Les nom_categorie seront utilisés dans le BLOC 2B pour retrouver
categorie_id.

**3. TABLE Risques_Metier**

Créer la table : Risques_Metier

**Champs :**

-   id (clé primaire)

-   metier_id (FK → Metiers_ICPP.id)

-   categorie_id (FK → Risques_Categorie.id)

-   nom_risque (string)

-   description_risque (text)

-   gravite_default (int, 1 à 5)

-   frequence_default (int, 1 à 5)

-   action_recommandee (text)

Cette table contiendra **tous les risques détaillés** fournis dans le
**BLOC 2B -- RISQUES PAR MÉTIER**.

**4. LIENS AVEC LES AUDITS & DUERP**

Tu dois préparer les liens pour que les risques puissent être utilisés
dans les audits et le DUERP :

Dans la table Audits (déjà définie dans le BLOC 1) :

-   Ajouter un champ (si besoin) :

    -   metier_id (FK → Metiers_ICPP.id)\
        👉 Il est déjà prévu mais tu dois t'assurer de l'utiliser pour
        filtrer les risques.

-   Lors de la création / édition d'un audit :

    -   Quand un metier_id est sélectionné,\
        👉 charger **tous les enregistrements** de Risques_Metier liés à
        ce metier_id.

-   Prévoir une table (ou structure) pour les **risques évalués lors de
    l'audit**, par exemple :

Table Audit_Risques

-   id

-   audit_id (FK → Audits)

-   risque_metier_id (FK → Risques_Metier.id)

-   gravite (int, default = gravite_default)

-   frequence (int, default = frequence_default)

-   priorite (int, auto = gravite × frequence)

-   commentaire (texte optionnel)

-   mesure_existante (texte optionnel)

-   action_complementaire (texte optionnel)

-   action_prioritaire (bool)

Ce sont ces données qui serviront ensuite à générer le DUERP (BLOC 3).

**5. LOGIQUE GLOBALE À RESPECTER**

Tu dois respecter cette logique :

1.  **Création de la structure :**

    -   Créer Metiers_ICPP

    -   Créer Risques_Categorie

    -   Créer Risques_Metier

    -   Créer Audit_Risques (ou équivalent)

```{=html}
<!-- -->
```
2.  **Insertion des données de base :**

    -   Insérer les 10 métiers (noms EXACTS ci-dessus)

    -   Insérer les 5 catégories de risques

```{=html}
<!-- -->
```
2.  **Insertion des risques détaillés :**

    -   Utiliser le **BLOC 2B -- RISQUES PAR MÉTIER** (qui suit)\
        👉 Pour chaque bloc metier_nom + Catégorie,\
        👉 Chercher le bon metier_id et categorie_id\
        👉 Créer les enregistrements dans Risques_Metier.

```{=html}
<!-- -->
```
4.  **Utilisation dans l'audit :**

    -   Lorsqu'un audit est créé :

        -   Le metier_id de l'entreprise est utilisé pour **précharger
            les risques**.

    -   L'auditeur peut :

        -   Garder les valeurs par défaut gravite_default,
            frequence_default

        -   OU les ajuster selon la réalité de l'entreprise.

```{=html}
<!-- -->
```
5.  **Utilisation dans le DUERP :**

    -   Lors de la génération DUERP (BLOC 3) :

        -   Charger tous les Audit_Risques pour l'audit choisi

        -   Regrouper par catégorie (Risques_Categorie)

        -   Calculer ou afficher P = F × G

        -   Classer les risques par **priorité décroissante** dans le
            plan d'action.

**6. IMPORTANT**

📌 **Très important :**

Le **BLOC 2B** qui suit contient les **données de risques complètes**,
métier par métier.

Ce **BLOC 2** doit être exécuté **d'abord** pour créer les tables et les
listes de base.

Ensuite seulement, tu exécutes le **BLOC 2B** pour **remplir** la table
Risques_Metier.

Ne pas redéfinir les métiers ou catégories ailleurs avec d'autres noms,\
sinon les correspondances metier_nom / nom_metier et nom_categorie ne
fonctionneront pas.

**BLOC 2B -- RISQUES PAR MÉTIER**

👉 **Instruction**

**Tu dois insérer les données ci-dessous dans la table
Risques_Metier.**\
**Pour chaque entrée :**

-   retrouve metier_id en fonction du nom du métier (metier_nom) dans la
    table Metiers_INCP

-   retrouve categorie_id en fonction du nom de la catégorie
    (nom_categorie) dans la table Risques_Categorie

-   crée un enregistrement avec :

    -   metier_id

    -   categorie_id

    -   nom_risque

    -   description_risque

    -   gravite_default

    -   frequence_default

    -   action_recommandee

Gravite_default (G)

Frequence_default (F)

✔ P = F × G

✔ Action recommandée

✔ Catégories conformes DUERP

**MÉTIER 1 --- COIFFURE / BARBIER**

**metier_nom : \"Coiffure / Barbier\"**

**Catégorie : Physiques**

-   nom_risque : Chutes de plain-pied\
    description_risque : Sol glissant à cause des cheveux coupés, de
    l'eau ou des produits renversés dans le salon.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Tapis antidérapants, nettoyage régulier,
    consigne de balayage après chaque client.

-   nom_risque : TMS dos / épaules / nuque\
    description_risque : Postures debout prolongées, bras levés, torsion
    du buste lors des coupes, shampoings et brushings.\
    gravite_default : 3\
    frequence_default : 4\
    action_recommandee : Formation gestes et postures, réglage des
    fauteuils, alternance des tâches, pauses actives.

-   nom_risque : Brûlures par appareils chauffants\
    description_risque : Contact de la peau avec les fers, plaques,
    sèche-cheveux ou eau trop chaude.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Contrôle régulier de la température, rangement
    sécurisé, informations aux salariés.

-   nom_risque : Coupures ciseaux / rasoirs / tondeuses\
    description_risque : Coupures des doigts ou du cuir chevelu lors de
    la coupe, de la taille de barbe ou du rasage.\
    gravite_default : 2\
    frequence_default : 2\
    action_recommandee : Utilisation d'outils en bon état, techniques
    adaptées, rangement immédiat des lames.

-   nom_risque : Glissade zone bac\
    description_risque : Présence d'eau autour des bacs à shampoing,
    tapis mouillés, serviettes au sol.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Séchage immédiat, tapis absorbants, consignes
    de vigilance.

**Catégorie : Chimiques**

-   nom_risque : Décolorants -- inhalation et contact\
    description_risque : Exposition aux poudres et crèmes décolorantes
    irritantes pour la peau, les yeux et les voies respiratoires.\
    gravite_default : 3\
    frequence_default : 3\
    action_recommandee : Port de gants, éventuelle protection
    respiratoire, manipulation douce, ventilation.

-   nom_risque : Colorations -- sensibilisation cutanée\
    description_risque : Risques d'allergie de contact ou d'irritation
    cutanée liés aux colorants capillaires.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Port de gants, respect des temps de pause,
    tests allergiques si nécessaire.

-   nom_risque : Produits lissants / défrisants -- vapeurs\
    description_risque : Émission de vapeurs irritantes lors de
    l'application et du passage des plaques.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Ventilation renforcée, limiter la durée
    d'exposition, choix de produits moins nocifs.

-   nom_risque : Produits de nettoyage\
    description_risque : Utilisation de détergents, désinfectants
    pouvant irriter la peau et les voies respiratoires.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Gants adaptés, respect des doses, éviter les
    mélanges.

**Catégorie : Psychosociaux**

-   nom_risque : Stress lié à la clientèle\
    description_risque : Exigences fortes, remarques, conflits
    potentiels avec certains clients.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Formation à la gestion de la relation client,
    soutien managérial, règles d'apaisement.

-   nom_risque : Rythme de travail soutenu\
    description_risque : Enchaînement de rendez-vous sans pause, pics
    d'activité (fêtes, week-ends).\
    gravite_default : 2\
    frequence_default : 4\
    action_recommandee : Organisation du planning, pauses planifiées,
    renfort ponctuel si possible.

-   nom_risque : Conflits internes\
    description_risque : Tensions entre collègues autour des clients,
    des horaires, des commissions.\
    gravite_default : 2\
    frequence_default : 2\
    action_recommandee : Règles claires, temps d'échange, arbitrage par
    le responsable.

**Catégorie : Organisationnels**

-   nom_risque : Manque de procédures d'hygiène\
    description_risque : Absence de consignes formalisées pour le
    nettoyage du matériel, des bacs et du salon.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Rédiger un protocole, former l'équipe, vérifier
    l'application.

-   nom_risque : Planning instable\
    description_risque : Modifications fréquentes des horaires,
    rallongement de journées, travail non anticipé.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Planification à l'avance, communication écrite
    des horaires.

-   nom_risque : Ergonomie du poste insuffisante\
    description_risque : Fauteuils, bacs ou postes non réglables,
    contraintes posturales supplémentaires.\
    gravite_default : 3\
    frequence_default : 3\
    action_recommandee : Ajustement du mobilier, investissement
    progressif dans du matériel ergonomique.

**Catégorie : Incendie & Locaux**

-   nom_risque : Produits inflammables mal stockés\
    description_risque : Présence de solvants, laques, aérosols près de
    sources de chaleur ou prises.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Stockage dans un meuble adapté, éloigné des
    sources de chaleur.

-   nom_risque : Installation électrique surchargée\
    description_risque : Multiprises, rallonges et connexions multiples
    pour plusieurs appareils chauffants.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Limiter les branchements, faire vérifier
    l'installation.

-   nom_risque : Ventilation insuffisante\
    description_risque : Mauvaise évacuation des odeurs, vapeurs et
    chaleur, surtout en zone technique.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Ouvrir régulièrement, ajouter une extraction ou
    un système de ventilation.

**MÉTIER 2 --- ESTHÉTIQUE / ONGLES / BIEN-ÊTRE**

**metier_nom : \"Esthétique / Onglerie / Bien-être\"**

**Catégorie : Physiques**

-   nom_risque : TMS mains / poignets\
    description_risque : Mouvements fins et répétitifs (manucure, pose
    de gel, épilations) générant des douleurs articulaires.\
    gravite_default : 3\
    frequence_default : 4\
    action_recommandee : Alternance des tâches, pauses, formation gestes
    adaptés.

-   nom_risque : TMS dos / épaules\
    description_risque : Posture penchée prolongée sur le client lors
    des soins visage ou corps.\
    gravite_default : 3\
    frequence_default : 3\
    action_recommandee : Réglage des tables et sièges, pauses
    régulières, étirements.

-   nom_risque : Brûlures par cire chaude\
    description_risque : Température trop élevée de la cire ou
    éclaboussures lors de l'application.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Contrôle systématique de la température,
    utilisation d'appareils réglés, consignes.

-   nom_risque : Chutes de plain-pied\
    description_risque : Sol glissant lié aux produits, huiles ou eau
    dans les cabines.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Nettoyage immédiat, tapis antidérapants.

-   nom_risque : Coupures petits instruments\
    description_risque : Utilisation de ciseaux fins, lames, pinces et
    instruments pointus.\
    gravite_default : 2\
    frequence_default : 2\
    action_recommandee : Manipulation prudente, rangement sécurisé,
    désinfection suivant protocole.

**Catégorie : Chimiques**

-   nom_risque : Solvants (vernis, dissolvants)\
    description_risque : Inhalation de vapeurs et contact cutané répété
    avec les solvants de manucure.\
    gravite_default : 3\
    frequence_default : 3\
    action_recommandee : Ventilation efficace, limiter l'exposition,
    port de gants si besoin.

-   nom_risque : Résines et gels UV\
    description_risque : Produits de modelage d'ongles pouvant provoquer
    des allergies cutanées.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Port de gants, respect des fiches de données de
    sécurité.

-   nom_risque : Désinfectants concentrés\
    description_risque : Risques d'irritation cutanée et respiratoire
    lors de la dilution et de l'utilisation.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Porter des gants, respecter les dilutions.

-   nom_risque : Produits de peeling / acides\
    description_risque : Utilisation d'acides de fruits ou autres actifs
    pouvant irriter la peau.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Formation, précautions d'usage, port de gants
    et protection oculaire si nécessaire.

-   nom_risque : Huiles essentielles / parfums\
    description_risque : Risques d'allergies cutanées ou respiratoires
    chez certains salariés.\
    gravite_default : 2\
    frequence_default : 2\
    action_recommandee : Secouer les flacons à distance, limiter
    l'usage, informer le personnel.

**Catégorie : Psychosociaux**

-   nom_risque : Pression liée à l'image et au résultat\
    description_risque : Attentes élevées des clients concernant le
    résultat esthétique.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Gestion des attentes clients, communication
    claire, soutien du responsable.

-   nom_risque : Rythme soutenu en période de pointe\
    description_risque : Surcharge de rendez-vous, faible temps de
    récupération entre les soins.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Organisation du planning, limiter le
    surbooking.

-   nom_risque : Isolement en cabine\
    description_risque : Travail seule dans une pièce, parfois tard ou à
    des horaires décalés.\
    gravite_default : 2\
    frequence_default : 2\
    action_recommandee : Procédures de sécurité, présence d'un autre
    salarié sur place, moyen d'alerte.

**Catégorie : Organisationnels**

-   nom_risque : Hygiène du matériel insuffisamment encadrée\
    description_risque : Nettoyage et désinfection des instruments non
    formalisés ni contrôlés.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Protocole écrit, formation, registre de suivi.

-   nom_risque : Gestion approximative des rendez-vous\
    description_risque : Retards, chevauchements de clients, temps de
    repos non prévus.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Outil de planning, temps tampon, regroupement
    par type de soin.

-   nom_risque : Traçabilité des produits et soins insuffisante\
    description_risque : Pas de suivi des produits utilisés par client,
    difficulté à retracer en cas de réaction.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Fiches clients, enregistrement des soins.

**Catégorie : Incendie & Locaux**

-   nom_risque : Utilisation de bougies / appareils chauffants\
    description_risque : Présence de flammes nues ou appareils chauds
    non surveillés.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Ne jamais laisser sans surveillance, éteindre
    après usage.

-   nom_risque : Surcharge de multiprises\
    description_risque : Brancher trop d'appareils sur une même prise
    dans les cabines.\
    gravite_default : 3\
    frequence_default : 2\
    action_recommandee : Réduire le nombre d'appareils, contrôler
    l'installation.

-   nom_risque : Ventilation des cabines insuffisante\
    description_risque : Mauvaise évacuation des odeurs, vapeurs et
    chaleur dans un espace clos.\
    gravite_default : 2\
    frequence_default : 3\
    action_recommandee : Aération régulière, extraction d'air, ouverture
    des portes entre deux soins.

**MÉTIER 3 --- SNACK / RESTAURATION RAPIDE**

(20 risques -- modèle format ESTHÉTIQUE)

metier_nom : \"Snack / Restauration rapide\"

**Catégorie : Physiques**

**1. Brûlures par friteuse et surfaces chaudes**

description_risque : Contact avec l'huile chaude, projections lors de la
manipulation des paniers ou contact avec plaques chaudes.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Former aux gestes sécurisés et maintenir un
matériel entretenu.

**2. Brûlures par vapeur**

description_risque : Ouverture de couvercles chauds ou remontées de
vapeur lors des cuissons.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Porter gants adaptés et ouvrir lentement les cuves.

**3. Coupures liées aux couteaux et trancheurs**

description_risque : Manipulation quotidienne de couteaux, lames et
trancheurs pour la préparation rapide des aliments.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Stockage sécurisé, gants anti-coupures, affûtage
régulier.

**4. Chutes dues aux sols gras ou humides**

description_risque : Sols glissants liés à l\'huile, sauces ou eau
renversée en cuisine.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Mise en place de tapis antidérapants et nettoyage
immédiat.

**5. Troubles musculo-squelettiques (TMS) des bras**

description_risque : Gestes rapides et répétitifs au poste de
préparation et assemblage.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Alterner les tâches et ajuster la hauteur des
postes.

**Catégorie : Chimiques**

**6. Exposition aux dégraissants puissants**

description_risque : Contact cutané ou inhalation de produits utilisés
pour nettoyer les surfaces grasses.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Porter gants adaptés et respecter les dilutions.

**7. Inhalation de vapeurs de cuisson**

description_risque : Fumées grasses dégagées par les cuissons
successives en espace restreint.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Assurer l'efficacité des hottes et ventilation.

**8. Désinfectants alimentaires concentrés**

description_risque : Irritations lors de la dilution ou du nettoyage des
surfaces.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Porter des gants et diluer dans un espace ventilé.

**9. Contact prolongé avec eau chaude + produits vaisselle**

description_risque : Risque d'irritation ou brûlure lors de la plonge
manuelle.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Porter gants thermiques et organiser la rotation.

**Catégorie : Psychosociaux**

**10. Stress lié au rythme soutenu**

description_risque : Pics d'activité importants entraînant surcharge et
pression continue.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Prévoir renforts et organiser le planning
intelligemment.

**11. Pression clientèle**

description_risque : Exigence forte de rapidité pouvant générer tensions
et erreurs.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Encadrer les files et mettre en place des
procédures de communication.

**12. Conflits internes au sein de l'équipe**

description_risque : Communication difficile lors de périodes de rush,
pouvant générer tensions.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Clarifier les rôles et instaurer un briefing
quotidien.

**Catégorie : Organisationnels**

**13. Rupture de la chaîne du froid**

description_risque : Défaut de contrôle des températures lors du
stockage ou de la préparation rapide.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Tenir un registre et vérifier les équipements
quotidiennement.

**14. Hygiène alimentaire insuffisante**

description_risque : Risques de contamination croisée liés au rythme
rapide et manque de rigueur.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Appliquer strictement les méthodes HACCP.

**15. Traçabilité alimentaire déficiente**

description_risque : Absence d'étiquetage ou gestion approximative des
produits ouverts.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Etiqueter systématiquement les denrées.

**16. Entretien insuffisant des hottes et fours**

description_risque : Accumulation de graisse augmentant les risques
d\'incendie et réduisant la ventilation.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Nettoyage programmé et suivi régulier.

**Catégorie : Incendie & Locaux**

**17. Risque incendie lié aux friteuses**

description_risque : Surchauffe ou débordement d'huile lors de la
cuisson.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Installer extincteur type F et respecter les
niveaux d'huile.

**18. Incendie lié à hotte encrassée**

description_risque : Départ de feu lié à l'accumulation de graisses dans
les filtres.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Nettoyer les filtres hebdomadairement.

**19. Surcharge de prises électriques**

description_risque : Multiplication d'appareils branchés sur un même
circuit.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Répartir les charges et vérifier l'installation.

**20. Issues de secours encombrées**

description_risque : Zones d'évacuation bloquées par des cartons,
poubelles ou stocks rapides.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Dégager les passages et maintenir la signalisation
visible.

**Catégorie : Biologiques**

**nom_risque :** Contact avec la clientèle\
**description_risque :** Exposition aux virus et bactéries lors des
échanges avec les clients.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Hygiène des mains, nettoyage des surfaces,
gestes barrières.

**nom_risque :** Manipulation de lunettes usagées\
**description_risque :** Contact avec des objets potentiellement
contaminés.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Désinfection systématique, port de gants si
nécessaire.

**MÉTIER 4 --- RESTAURANT TRADITIONNEL**

(20 risques --- modèle identique)

metier_nom : \"Restaurant traditionnel\"

**Catégorie : Physiques**

**1. Brûlures de cuisson (four, plaques, marmites)**

description_risque : Manipulation fréquente d'ustensiles chauds lors de
la préparation culinaire.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Porter gants thermiques et respecter les protocoles
de manipulation.

**2. Brûlures par liquides chauds**

description_risque : Renversement de sauces, bouillons ou eau
bouillante.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Manipuler prudemment et sécuriser les déplacements.

**3. Coupures couteaux professionnels**

description_risque : Utilisation de couteaux très affûtés pour découpe
et préparation.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Former aux techniques de coupe et utiliser des
gants adaptés.

**4. Chutes en cuisine (sol humide)**

description_risque : Sol glissant lié à l'eau, matières grasses ou
aliments renversés.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Nettoyage immédiat et tapis antidérapants.

**5. TMS liés à la préparation répétitive**

description_risque : Découpe, mélange, assaisonnement et manipulations
répétitives.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Rotation des postes et ergonomie du plan de
travail.

**Catégorie : Chimiques**

**6. Produits de plonge agressifs**

description_risque : Contact avec produits corrosifs pour le dégraissage
de la vaisselle.\
gravite_default : 3\
frequence_default : 3\
action_recommandede : Porter gants adaptés et suivre les consignes.

**7. Désinfectants cuisine**

description_risque : Risque d'irritation lors du nettoyage quotidien des
surfaces.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Respect des dilutions.

**8. Vapeurs de cuisson intenses**

description_risque : Fumées grasses accumulées lors de cuissons
prolongées.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Assurer une ventilation efficace.

**9. Nettoyants sols cuisine**

description_risque : Risques d'inhalation et glissade si mal rincé.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Respect des protocoles de nettoyage.

**Catégorie : Psychosociaux**

**10. Stress en période de service**

description_risque : Rythme soutenu avec forte exigence de rapidité et
qualité.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Organisation précise et communication.

**11. Pression du chef ou de la hiérarchie**

description_risque : Exigences élevées pouvant provoquer tensions.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Clarification des rôles et médiation interne.

**12. Conflits cuisine / salle**

description_risque : Désaccords liés au rythme, aux commandes ou aux
erreurs.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Mise en place de briefings réguliers.

**Catégorie : Organisationnels**

**13. Rupture chaîne du froid**

description_risque : Températures non respectées, risque de
toxi-infection.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Contrôles alimentaires stricts.

**14. Contamination croisée**

description_risque : Mauvaise séparation des aliments crus/cuits.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Application HACCP.

**15. Traçabilité alimentaire insuffisante**

description_risque : Absence d'étiquetage ou suivi des DLC.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Étiquetage systématique.

**16. Allergènes mal gérés**

description_risque : Affichage ou communication incomplets.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Formation allergènes obligatoire.

**Catégorie : Incendie & Locaux**

**17. Risque incendie lié à hotte encrassée**

description_risque : Dépôts de graisses pouvant s'enflammer.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Nettoyage planifié.

**18. Gaz cuisine (fuites / raccords)**

description_risque : Risque d'explosion ou d'incendie.\
gravite_default : 5\
frequence_default : 1\
action_recommandee : Contrôle périodique.

**19. Surcharge électrique cuisine**

description_risque : Multiplication d\'appareils sur un circuit.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Répartir les charges.

**20. Issues de secours obstruées**

description_risque : Passage bloqué par les stocks ou chariots.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Maintenir les voies dégagées.

**Catégorie : Biologiques**

**nom_risque :** Contact avec la clientèle\
**description_risque :** Exposition aux virus et bactéries lors des
échanges avec les clients.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Hygiène des mains, nettoyage des surfaces,
gestes barrières.

**nom_risque :** Manipulation de lunettes usagées\
**description_risque :** Contact avec des objets potentiellement
contaminés.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Désinfection systématique, port de gants si
nécessaire.

**MÉTIER 5 --- BOUTIQUE / PRÊT-À-PORTER / CHAUSSURES**

Format : **20 risques**, **5 catégories**, **professionnel**, **sans
exemples clients**,

**MÉTIER -- Boutique / Prêt-à-porter**

metier_nom : \"Boutique / Prêt-à-porter\"

**Catégorie : Physiques**

**1. Chutes de plain-pied**

description_risque : Sol glissant ou encombré par des cartons, cintres,
antivols ou articles au sol.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Maintenir allées dégagées et nettoyage immédiat.

**2. TMS épaules / bras**

description_risque : Manipulation répétée de cintres, mise en rayon en
hauteur, manutention légère mais fréquente.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Utiliser escabeau stable et varier les tâches.

**3. Port de charges légères répétées**

description_risque : Transport de cartons, bacs ou colis de vêtements /
chaussures.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Porter près du corps et limiter le poids des
cartons.

**4. TMS poignets / mains**

description_risque : Manipulation manuelle répétée des antivols,
étiquettes, pliage d'articles.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Utilisation d'outils ergonomiques et pauses.

**5. Heurts contre mobilier**

description_risque : Tablettes basses, présentoirs, portants métalliques
situés dans des zones de passage.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Organiser les circulations et installer des
protections.

**Catégorie : Chimiques**

**6. Produits de nettoyage**

description_risque : Contact cutané ou inhalation des produits
d'entretien utilisés dans la boutique.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Port de gants et rangement sécurisé.

**7. Dépoussiérage intensif**

description_risque : Inhalation de poussières textiles lors du nettoyage
et rangement.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Aération et nettoyage humide régulier.

**8. Désodorisation / parfums d'ambiance**

description_risque : Irritation ou allergies liées à l'utilisation de
spray parfumés.\
gravite_default : 1\
frequence_default : 3\
action_recommandee : Favoriser la ventilation naturelle.

**Catégorie : Psychosociaux**

**9. Pression commerciale**

description_risque : Objectifs de vente élevés, gestion du chiffre,
demandes multiples.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Formation commerciale et gestion du stress.

**10. Conflits clients**

description_risque : Réclamations, litiges sur les retours ou échanges.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Mise en place d'une procédure claire d'accueil
client.

**11. Solitude en période creuse**

description_risque : Travail seul en boutique, risque accru en cas
d'agression.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Procédure de sécurité et contact d'urgence.

**12. Périodes de forte affluence**

description_risque : Pics de vente (soldes, fêtes) entraînant fatigue et
surcharge cognitive.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Renfort temporaire ou pauses planifiées.

**Catégorie : Organisationnels**

**13. Stock mal organisé**

description_risque : Accès difficile aux cartons en hauteur, risque de
chute d'objets.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Rangement par poids et accès sécurisé.

**14. Absence de procédure caisse / erreur manipulation**

description_risque : Stress et erreurs entraînant tensions avec la
direction ou clientèle.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Formation initiale + procédure écrite.

**15. Vols internes / externes**

description_risque : Pression psychologique liée au risque de vol et
contrôle fréquent.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Système antivol, organisation discrète.

**16. Mauvaise gestion des réassorts**

description_risque : Accumulation de cartons dans les zones de vente
créant risques physiques.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Prévoir des horaires dédiés.

**Catégorie : Incendie & Locaux**

**17. Surcharge électrique**

description_risque : Multiprises utilisées pour plusieurs appareils
(lumières, caisse, diffuseurs).\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Répartition électrique conforme.

**18. Blocage des issues de secours**

description_risque : Cartons de stocks entreposés devant les portes
arrière.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Zone interdite au stockage.

**19. Éclairage insuffisant**

description_risque : Zones sombres rendant les déplacement risqués.\
gravite_default : 1\
frequence_default : 3\
action_recommandee : Vérification régulière de la lumière.

**20. Ventilation faible**

description_risque : Absence d'aération dans les cabines d'essayage /
réserves.\
gravite_default : 1\
frequence_default : 3\
action_recommandee : Aération naturelle ou extracteur.

**MÉTIER 6 --- PHARMACIE / PARAPHARMACIE**

**MÉTIER -- Pharmacie / Parapharmacie**

metier_nom : \"Pharmacie / Parapharmacie\"

**Catégorie : Physiques**

**1. TMS dos / épaules (réassort & manutention)**

description_risque : Transport de cartons lourds, manipulation répétée
de produits en réserve et en rayon.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Formation gestes & postures, limiter les charges,
diable chariot.

**2. Gestes répétitifs comptoir**

description_risque : Saisie informatique, manipulation d'articles,
utilisation répétée du clavier et souris.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Posture ergonomique + pauses courtes.

**3. Station debout prolongée**

description_risque : Longues périodes debout au comptoir, fatigue
musculaire.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Tapis anti-fatigue, alternance assis/debout.

**4. Chutes de plain-pied**

description_risque : Sol glissant lié aux cartons, produits tombés,
passage en réserve.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Nettoyage immédiat et marquage au sol.

**5. Heurts contre mobiliers bas**

description_risque : Bacs, présentoirs, étagères basses dans les zones
de passage.\
gravite_default : 1\
frequence_default : 3\
action_recommandee : Organisation des allées, protections d'angles.

**Catégorie : Chimiques**

**6. Exposition aux aérosols**

description_risque : Inhalation de produits spray désinfectants,
déodorants, cosmétiques.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Ventilation, port de masques en réassort.

**7. Manipulation de produits chimiques d'entretien**

description_risque : Risque d'irritation cutanée / respiratoire.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Port de gants, stockage sécurisé.

**8. Contact avec médicaments potentiellement irritants**

description_risque : Manipulation répétée d'emballages contenant
substances actives.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Lavage des mains, manipulation contrôlée.

**9. Manipulation d'alcool & désinfectants**

description_risque : Risque de projection, irritation cutanée.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Port de gants lors des recharges.

**10. Odeurs de produits cosmétiques**

description_risque : Risque mineur d'allergies respiratoires.\
gravite_default : 1\
frequence_default : 2\
action_recommandee : Aération régulière.

**Catégorie : Psychosociaux**

**11. Pression liée au conseil patient**

description_risque : Exigences d'explications détaillées, gestion du
flux de patients.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Formation continue, gestion du stress.

**12. Conflits clients**

description_risque : Désaccords sur prescriptions, ruptures de stock,
ordonnances non conformes.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Procédure d'accueil, communication calme.

**13. Exposition émotionnelle (maladies, urgences)**

description_risque : Gestion de patients inquiets, situations
sensibles.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Briefing d'équipe et soutien interne.

**14. Périodes de forte affluence**

description_risque : Pic de demandes, files d'attente, stress
organisationnel.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Renforcement des horaires et rôle clair.

**Catégorie : Organisationnels**

**15. Stockage en hauteur**

description_risque : Atteinte difficile de cartons lourds en hauteur.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Escabeau antidérapant, rangement optimisé.

**16. Rupture / gestion des dates de péremption**

description_risque : Pression liée au tri des lots, vérifications
fréquentes.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Procédure DLActives.

**17. Étiquetage & traçabilité non optimal**

description_risque : Risque d'erreur de produit ou de prix.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Double vérification et protocole écrit.

**18. Sécurité de la caisse**

description_risque : Stress lié à la manipulation d'argent et risques
d'agression.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Coffre sécurisé + protocole fermeture.

**Catégorie : Incendie & Locaux**

**19. Surcharge des prises**

description_risque : Multiprises utilisées pour appareils médicaux /
informatiques.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Contrôle régulier.

**20. Obstruction des issues de secours**

description_risque : Cartons stockés temporairement en réserve ou près
des portes.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Zone interdite au stockage + rappel équipe.

**Catégorie : Biologiques**

**nom_risque :** Contact avec la clientèle\
**description_risque :** Exposition aux virus et bactéries lors des
échanges avec les clients.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Hygiène des mains, nettoyage des surfaces,
gestes barrières.

**nom_risque :** Manipulation de lunettes usagées\
**description_risque :** Contact avec des objets potentiellement
contaminés.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Désinfection systématique, port de gants si
nécessaire.

**MÉTIER 7 --- TRANSPORT / LIVRAISON**

**Métier :** Transport / Livraison (véhicules légers & utilitaires)

**CATÉGORIE : PHYSIQUES**

**1. Risque routier -- circulation**

description_risque : Déplacements fréquents sur route avec exposition
aux accidents, imprévus, freinages brusques.\
gravite_default : 5\
frequence_default : 3\
action_recommandee : Conduite préventive, entretien régulier véhicule,
pauses.

**2. Risque routier -- stationnement / manœuvres**

description_risque : Collisions en manœuvrant dans zones étroites,
parkings, livraisons en marche arrière.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Formation manœuvres sécurisées, caméra recul.

**3. Port de charges**

description_risque : Chargement et déchargement de colis ou marchandises
parfois lourds.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Diable, transpalette, gestes et postures.

**4. TMS épaules / dos**

description_risque : Gestes répétitifs de portage, transport,
manipulation.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Optimisation du rangement véhicule, pauses.

**5. Chutes de hauteur (camion / fourgon)**

description_risque : Descente du véhicule, marche pied glissant, sol
irrégulier.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Antidérapants, vérification zone de livraison.

**6. Chutes de plain-pied**

description_risque : Sols mouillés, irréguliers autour des lieux de
livraison.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Prendre le temps, chaussures antidérapantes.

**CATÉGORIE : CHIMIQUES**

**7. Exposition carburant**

description_risque : Contact ou inhalation légère lors du plein, vapeurs
nocives.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Gants, éloignement des vapeurs.

**8. Produits transportés (si substances irritantes)**

description_risque : Colis contenant produits chimiques, risques de
fuite.\
gravite_default : 3\
frequence_default : 1\
action_recommandee : Vérifier étiquetage, emballages conformes.

**9. Produits d'entretien véhicule**

description_risque : Contact avec nettoyants, graisses, dégraissants.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Gants, lavage mains.

**CATÉGORIE : PSYCHOSOCIAUX (RPS)**

**10. Pression liée aux délais**

description_risque : Livraison rapide exigée, planning serré, retards
pénalisants.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Marges horaires, gestion réaliste des trajets.

**11. Multiples interruptions**

description_risque : Sollicitations téléphoniques, messages, GPS
modifiant le trajet.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Arrêts sécurisés pour répondre.

**12. Isolement professionnel**

description_risque : Travail seul sur route, absence d'équipe à
proximité.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Procédures d'alerte, contact régulier entreprise.

**13. Relation client difficile**

description_risque : Clients mécontents, litiges sur horaires ou colis.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Procédure d'accueil, gestion communication.

**CATÉGORIE : ORGANISATIONNELS**

**14. Planification imprécise**

description_risque : Ordres de livraison peu précis, itinéraires mal
définis.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Optimisation GPS, ordre de tournée.

**15. Mauvaise répartition du chargement**

description_risque : Charge mal répartie dans le véhicule causant
déséquilibre.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Répartition homogène, sanglage.

**16. Mauvaise gestion des colis fragiles**

description_risque : Risque de chute, bris, confusion entre colis.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Zone dédiée, protocole.

**17. Manque de pauses / fatigue**

description_risque : Longs trajets entraînant baisse de vigilance et
somnolence.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Pauses 15 min toutes les 2h.

**CATÉGORIE : INCENDIE & LOCAUX**

**18. Véhicule mal entretenu**

description_risque : Risque de surchauffe, incendie moteur, batterie
défectueuse.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Maintenance régulière, vérification niveaux.

**19. Surchauffe électrique (chargeurs, batteries)**

description_risque : Chargeurs GPS, scanners, téléphones laissés
branchés.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Débrancher hors usage.

**20. Colis inflammables mal étiquetés**

description_risque : Produits inflammables non identifiés dans le
véhicule.\
gravite_default : 4\
frequence_default : 1\
action_recommandee : Vérification étiquette, stockage isolé.

**MÉTIER 8 --- NETTOYAGE / ENTRETIEN**

(ménage pro, multiservices, entretien locaux, agent de propreté)

**CATÉGORIE : PHYSIQUES (6 risques)**

**1. Glissade sur sol mouillé**

description_risque : Sols fraîchement lavés ou détergents rendant la
surface glissante, notamment en couloirs et sanitaires.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Panneaux sol glissant, chaussures antidérapantes,
séchage zone par zone.

**2. Chutes de hauteur (escabeau)**

description_risque : Utilisation d'escabeaux pour nettoyer en hauteur
(vitres, meubles), risque de perte d'équilibre.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Escabeau sécurisé, nettoyage perche télescopique si
possible.

**3. TMS dos / lombaires**

description_risque : Flexions répétées, manutention de seaux, positions
contraignantes prolongées.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Gestes et postures, seaux roulants, matériel
ergonomique.

**4. TMS épaules / bras**

description_risque : Répétition des mouvements circulaires de lavage,
frottage, raclage de vitres.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Alternance tâches, perches légères.

**5. Projections dans les yeux**

description_risque : Jet de produits ou poussières lors de brossage,
pulvérisation ou dilution.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Lunettes protection, dilution prudente.

**6. Coupures**

description_risque : Contact avec objets tranchants laissés dans les
poubelles, bris de verre au sol.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Gants renforcés, tri des déchets.

**CATÉGORIE : CHIMIQUES (5 risques)**

**7. Détergents irritants**

description_risque : Irritations cutanées ou respiratoires dues à
l'exposition répétée au liquide vaisselle, multi-usages.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Gants nitrile, ventilation, éviter contact peau.

**8. Eau de javel**

description_risque : Risques irritants, corrosifs, projections,
inhalation de chlore.\
gravite_default : 4\
frequence_default : 3\
action_recommandee : Jamais mélanger, dosages contrôlés, gants +
lunettes.

**9. Mélanges accidentels (javel + acide)**

description_risque : Production de chlore toxique si produits
incompatibles mélangés involontairement.\
gravite_default : 5\
frequence_default : 1\
action_recommandee : Interdiction stricte de mélange, formation FDS.

**10. Aérosols désinfectants**

description_risque : Inhalation microgouttelettes irritantes,
sur-exposition dans pièces fermées.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Pulvériser porte ouverte, aérer 10 minutes.

**11. Dégraissants industriels**

description_risque : Produits agressifs pouvant brûler la peau ou
détériorer les tissus respiratoires.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Gants, lunettes, éviter nébulisation.

**CATÉGORIE : RPS -- RISQUES PSYCHOSOCIAUX (3 risques)**

**12. Travail isolé**

description_risque : Interventions tôt le matin ou tard le soir dans
locaux vides, absence d'assistance immédiate.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Dispositif d'alerte, rondes, binôme si possible.

**13. Pression du temps / cadences élevées**

description_risque : Nettoyage de grandes zones en temps limité,
pression du planning.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Répartition réaliste, pauses.

**14. Exposition aux incivilités / usagers**

description_risque : Réflexions négatives, irrespect, interruptions lors
du nettoyage en présence du public.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Procédure gestion conflits, accompagnement
hiérarchie.

**CATÉGORIE : ORGANISATIONNELS (4 risques)**

**15. Oubli signalisation zones mouillées**

description_risque : Pas de panneau au sol, exposition des
usagers/salariés aux chutes.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Vérification systématique panneau avant lavage.

**16. Matériel défectueux**

description_risque : Balais cassés, aspirateurs à câbles abîmés
augmentant fatigue ou accidents.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Inventaire régulier, remplacement.

**17. Mauvaise gestion des déchets**

description_risque : Sacs trop lourds, déchets dangereux non
identifiés.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Sacs plus petits, tri clair.

**18. Absence de formation produits**

description_risque : Mauvaise dilution, mauvaise utilisation ou
incompatibilité méconnue.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Formation fiches FDS obligatoire.

**CATÉGORIE : INCENDIE & LOCAUX (2 risques)**

**19. Stockage produits inflammables**

description_risque : Accumulation de produits contenant alcool ou
solvants dans placard non ventilé.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Stockage fermé, éloigné sources chaleur.

**20. Câbles électriques au sol**

description_risque : Aspirateurs branchés avec rallonges endommagées,
risque court-circuit ou surchauffe.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Vérification câbles, limitation multiprises.

**Catégorie : Biologiques**

**nom_risque :** Contact avec la clientèle\
**description_risque :** Exposition aux virus et bactéries lors des
échanges avec les clients.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Hygiène des mains, nettoyage des surfaces,
gestes barrières.

**nom_risque :** Manipulation de lunettes usagées\
**description_risque :** Contact avec des objets potentiellement
contaminés.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Désinfection systématique, port de gants si
nécessaire.

**MÉTIER 9 --- ADMINISTRATIF / BUREAUTIQUE / ASSURANCE / CABINETS**

**CATÉGORIE : PHYSIQUES (6 risques)**

**1. TMS --- douleurs cervicales**

description_risque : Postures fixes prolongées devant écran, mauvaise
hauteur de siège ou angle de vision.\
gravite_default : 3\
frequence_default : 4\
action_recommandee : Réglage écran/chaise, pauses micro-coupures.

**2. TMS --- poignets / mains (souris, clavier)**

description_risque : Surcharge sur articulations due à l'utilisation
répétée du clavier et de la souris.\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Souris ergonomique, repose-poignet, alternance
tâches.

**3. Fatigue visuelle / lumière inadaptée**

description_risque : Éblouissement, reflets, écran trop lumineux,
lumière artificielle trop forte/faible.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Éclairage adapté, positionnement écran correct.

**4. Chutes de plain-pied**

description_risque : Câbles qui traînent, sols glissants, objets au sol
(courriers, cartons).\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Rangement, gaines câblage.

**5. Chutes de hauteur (fauteuils utilisés comme escabeau)**

description_risque : Tentative d'atteindre des dossiers en hauteur en
montant sur un fauteuil mobile.\
gravite_default : 3\
frequence_default : 1\
action_recommandee : Petit escabeau stable obligatoire.

**6. Port de charges (cartons archives)**

description_risque : Transport de dossiers volumineux, manipulation
d'archives lourdes.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Diable, limiter charge, rangement accessible.

**CATÉGORIE : CHIMIQUES (2 risques)**

**7. Produits d'entretien léger**

description_risque : Utilisation ponctuelle de sprays nettoyants
irritants sur bureau ou clavier.\
gravite_default : 2\
frequence_default : 1\
action_recommandee : Aération, essuyage gants coton.

**8. Toner / cartouches imprimante**

description_risque : Exposition faible aux fines particules lors du
changement de toner.\
gravite_default : 2\
frequence_default : 1\
action_recommandee : Manipulation douce, stockage fermé.

**CATÉGORIE : RPS --- RISQUES PSYCHOSOCIAUX (5 risques)**

**9. Stress lié aux objectifs / délais**

description_risque : Pression temporelle liée au traitement des
dossiers, clients, contrats, échéances.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Répartition charges, priorisation, planification.

**10. Relations clients difficiles**

description_risque : Appels agressifs, demandes pressantes, situations
conflictuelles.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Procédure gestion conflit, soutien hiérarchie.

**11. Charge mentale importante**

description_risque : Multiplicité de tâches simultanées (accueil,
téléphone, dossiers).\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Découpage tâches, pauses.

**12. Isolement (télétravail ou bureau isolé)**

description_risque : Communication moins fluide, manque de supervision,
difficulté à alerter en cas de problème.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Check-in régulier, outils collaboration.

**13. Conflits internes**

description_risque : Tensions relationnelles, incompréhensions au sein
de l'équipe administrative.\
gravite_default : 2\
frequence_default : 2\
action_recommandee : Médiation, clarification des rôles.

**CATÉGORIE : ORGANISATIONNELS (5 risques)**

**14. Cybersécurité insuffisante**

description_risque : Mots de passe faibles, absence double
authentification, risque perte de données sensibles.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Politique mot de passe, sauvegardes automatiques.

**15. Confidentialité dossiers**

description_risque : Dossiers visibles, documents sensibles non rangés,
conversations confidentielles audibles.\
gravite_default : 3\
frequence_default : 3\
action_recommandee : Clés, armoires fermées, politique confidentialité.

**16. Mauvaise ergonomie du poste**

description_risque : Disposition incorrecte du bureau (écran trop
bas/haut, siège non réglé).\
gravite_default : 2\
frequence_default : 4\
action_recommandee : Ajustement complet du poste, support écran.

**17. Organisation chaotique des dossiers**

description_risque : Perte de dossiers, retards, surcharge de travail
due au manque de classement.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Méthode de classement, logiciel de gestion.

**18. Surcharge de planning**

description_risque : Trop de rendez-vous, appels, deadlines rapprochées
sans coordination.\
gravite_default : 2\
frequence_default : 3\
action_recommandee : Agenda partagé, buffers de temps.

**CATÉGORIE : INCENDIE & LOCAUX (2 risques)**

**19. Multiprises / surcharge électrique**

description_risque : Raccordement de nombreux équipements (PC,
imprimante, box) sur une même ligne.\
gravite_default : 3\
frequence_default : 2\
action_recommandee : Contrôle régulier, multiprise certifiée.

**20. Mauvaise évacuation / issue de secours encombrée**

description_risque : Stockage de cartons ou mobilier bloquant
partiellement l'accès aux issues en cas d'incendie.\
gravite_default : 4\
frequence_default : 2\
action_recommandee : Couloirs dégagés, plan affiché.

**MÉTIER 10 --- OPTICIEN / OPTICIEN-LUNETIER**

**metier_nom :** \"Opticien / Opticien-lunetier\"

**Catégorie : Physiques**

**nom_risque :** Chutes de plain-pied\
**description_risque :** Sols glissants, câbles apparents, cartons,
marches ou encombrements en magasin ou en atelier.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Maintenir les circulations dégagées, sols
propres et secs, tapis antidérapants.

**nom_risque :** Chutes de hauteur\
**description_risque :** Utilisation d'escabeaux pour le stockage en
hauteur de matériel ou de produits.\
**gravite_default :** 3\
**frequence_default :** 1\
**action_recommandee :** Escabeaux conformes, formation à l'utilisation,
interdiction de monter sur supports inadaptés.

**nom_risque :** Manutentions manuelles\
**description_risque :** Port et déplacement de cartons, colis de
montures, équipements ou machines.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Formation gestes et postures, aide mécanique,
limitation des charges.

**nom_risque :** Température inconfortable\
**description_risque :** Température excessive ou insuffisante en
atelier ou en magasin.\
**gravite_default :** 1\
**frequence_default :** 2\
**action_recommandee :** Régulation du chauffage/climatisation, pauses
adaptées.

**Catégorie : Mécaniques / Machines**

**nom_risque :** Coupures\
**description_risque :** Coupures lors de la manipulation de verres,
montures, outils ou machines.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Utilisation d'outils adaptés, formation,
rangement sécurisé.

**nom_risque :** Projections de particules\
**description_risque :** Projection de poussières ou fragments lors du
taillage et meulage des verres.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Port de lunettes de protection, entretien des
machines.

**nom_risque :** Bruit en atelier\
**description_risque :** Exposition au bruit généré par les machines de
taillage.\
**gravite_default :** 1\
**frequence_default :** 2\
**action_recommandee :** Entretien des machines, limitation du temps
d'exposition.

**nom_risque :** Vibrations\
**description_risque :** Vibrations transmises par certaines machines
d'atelier.\
**gravite_default :** 1\
**frequence_default :** 1\
**action_recommandee :** Maintenance régulière, utilisation conforme.

**Catégorie : Chimiques**

**nom_risque :** Produits de nettoyage des verres\
**description_risque :** Exposition à des produits pouvant irriter la
peau ou les voies respiratoires.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Port de gants, respect des dosages,
ventilation.

**nom_risque :** Solvants, colles et adhésifs\
**description_risque :** Utilisation de colles ou solvants lors des
réparations.\
**gravite_default :** 2\
**frequence_default :** 1\
**action_recommandee :** Aération du poste, stockage conforme, FDS
disponibles.

**nom_risque :** Aérosols et sprays nettoyants\
**description_risque :** Inhalation de vapeurs lors de l'utilisation de
sprays.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Ventilation, utilisation ponctuelle, port de
gants.

**nom_risque :** Poussières de verres et plastiques\
**description_risque :** Inhalation de poussières issues du taillage.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Aspiration, nettoyage régulier, protection
adaptée.

**Catégorie : Biologiques**

**nom_risque :** Contact avec la clientèle\
**description_risque :** Exposition aux virus et bactéries lors des
échanges avec les clients.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Hygiène des mains, nettoyage des surfaces,
gestes barrières.

**nom_risque :** Manipulation de lunettes usagées\
**description_risque :** Contact avec des objets potentiellement
contaminés.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Désinfection systématique, port de gants si
nécessaire.

**Catégorie : Ergonomiques / TMS**

**nom_risque :** Postures statiques prolongées\
**description_risque :** Station debout ou assise prolongée en magasin
ou à l'atelier.\
**gravite_default :** 3\
**frequence_default :** 4\
**action_recommandee :** Alternance des postures, pauses régulières,
tapis antifatigue.

**nom_risque :** Gestes répétitifs\
**description_risque :** Réglage et montage répétés des lunettes.\
**gravite_default :** 3\
**frequence_default :** 3\
**action_recommandee :** Rotation des tâches, formation ergonomique.

**nom_risque :** Travail sur écran\
**description_risque :** Utilisation prolongée des logiciels de vente et
gestion.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Réglage du poste informatique, pauses
visuelles.

**Catégorie : Psychosociaux**

**nom_risque :** Stress lié aux objectifs commerciaux\
**description_risque :** Pression sur les ventes et les résultats.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Objectifs réalistes, accompagnement managérial.

**nom_risque :** Pression et conflits clientèle\
**description_risque :** Réclamations, insatisfaction, incivilités.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Formation relation client, procédures de
gestion des conflits.

**nom_risque :** Isolement professionnel\
**description_risque :** Travail seul en magasin.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Organisation du travail, communication
régulière.

**Catégorie : Organisationnels**

**nom_risque :** Sous-effectif\
**description_risque :** Charge de travail excessive en période
d'affluence.\
**gravite_default :** 3\
**frequence_default :** 2\
**action_recommandee :** Ajustement des effectifs, renforts ponctuels.

**nom_risque :** Absence de procédures écrites\
**description_risque :** Manque de consignes formalisées sécurité et
atelier.\
**gravite_default :** 3\
**frequence_default :** 2\
**action_recommandee :** Rédaction de procédures, formation du
personnel.

**Catégorie : Électriques**

**nom_risque :** Installation électrique défectueuse\
**description_risque :** Prises abîmées, multiprises surchargées, câbles
apparents.\
**gravite_default :** 3\
**frequence_default :** 2\
**action_recommandee :** Vérifications périodiques, remplacement du
matériel défectueux.

**Catégorie : Incendie & Explosion**

**nom_risque :** Produits inflammables\
**description_risque :** Présence de solvants et sprays inflammables mal
stockés.\
**gravite_default :** 3\
**frequence_default :** 1\
**action_recommandee :** Stockage sécurisé, éloigné des sources de
chaleur.

**nom_risque :** Absence ou défaillance des moyens incendie\
**description_risque :** Extincteurs absents ou non vérifiés,
signalisation insuffisante.\
**gravite_default :** 4\
**frequence_default :** 1\
**action_recommandee :** Installation et vérification périodique des
extincteurs, formation incendie.

**Catégorie : Public / Clientèle**

**nom_risque :** Agressions verbales et incivilités\
**description_risque :** Tensions avec certains clients, situations
conflictuelles.\
**gravite_default :** 2\
**frequence_default :** 2\
**action_recommandee :** Procédures d'accueil, formation à la gestion
des situations difficiles.

**Catégorie : Examen de vue**

**nom_risque :** Fatigue visuelle de l'opticien\
**description_risque :** Sollicitation visuelle intense lors des examens
de vue.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Pauses visuelles, réglage de l'éclairage et du
matériel.

**nom_risque :** Postures contraignantes lors des examens\
**description_risque :** Proximité prolongée avec le client et positions
inconfortables.\
**gravite_default :** 2\
**frequence_default :** 3\
**action_recommandee :** Ajustement du matériel, formation ergonomique.

**BLOC 3 --- GÉNÉRATEUR DUERP PREMIUM ICPP (VERSION FINALE -- PAYSAGE)**

📌 *Inclut toutes les règles légales, les modèles, la structure, et les
pages 1--12 finalisées*

Tu dois générer un **DUERP PDF PREMIUM INCP**, en **format paysage pour
les tableau de risque**, avec design professionnel, identité visuelle
officielle, 12 pages fixes, contenu dynamique selon métier + audit.

**IDENTITÉ VISUELLE OFFICIELLE**

Couleur bleu République : **#001F3F**

Bleu clair : **#E8F0FF**

Gris anthracite : **#333333**

Logo INCP en en-tête

Police sans-serif moderne

PDF format paysage A4

En-tête : **ICPP -- Institut de Conformité et de Prévention
Professionnelle**

Pied de page : numéro + "Document officiel DUERP -- ICPP"

**PAGE 1 -- PAGE DE GARDE**

Titre centré :\
**DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS (DUERP)**\
Sous-titre :\
**Établi par l'ICPP -- Institut de Conformité et de Prévention
Professionnelle**

Données dynamiques :

Entreprise : {{entreprise.nom}}

SIRET : {{entreprise.siret}}

Adresse : {{entreprise.adresse_complete}}

Activité / Métier : {{entreprise.metier_principal}}

Effectif total : {{entreprise.effectif}}

Date d'édition : {{duerp.date_generation}}

Version DUERP : {{duerp.version}}

Mention légale :\
**Confidentiel -- Usage interne**

**PAGE 2 -- SOMMAIRE**

**SOMMAIRE**

I --- Préambule du DUERP\
II --- Cadre légal\
III --- Présentation de l'entreprise\
IV --- Unités de travail & effectifs\
V --- Méthodologie F / G / P\
VI --- Risques professionnels (5 catégories)\
VII --- Plan d'action priorisé\
VIII --- Signatures officielles INCP

🧠 *Les pages 7 à 12 sont générées automatiquement selon métier +
audit.*

**PAGE 3 -- PRÉAMBULE**

Le Document Unique d'Évaluation des Risques Professionnels (DUERP) est
une **obligation légale** pour toutes les entreprises employant au moins
un salarié (articles **L4121-1 à L4121-5** et **R4121-1** du Code du
travail).

Il vise à :

identifier les risques professionnels,

évaluer la gravité (G) et la fréquence (F),

définir des actions de prévention,

protéger la santé et la sécurité des salariés.

Le DUERP doit être mis à jour :

1.  **Une fois par an**

2.  **Lors de tout changement dans l'organisation**

3.  **Après un accident du travail**

4.  **Lorsqu'un nouveau risque apparaît**

L'évaluation est réalisée par l'employeur, accompagné par l'INCP.

**PAGE 4 -- CADRE LÉGAL**

**SANCTIONS EN CAS DE NON-CONFORMITÉ DUERP**

Amende administrative pour absence ou mise à jour non réalisée

Mise en demeure par l'inspection du travail

Engagement de la responsabilité civile & pénale

Surcotisation AT/MP

**OBLIGATIONS FORMELLES :**

Conservation du DUERP : **40 ans minimum**

Consultation : salariés, CSE, inspection du travail, CARSAT, médecine du
travail

Structuration obligatoire par **unités de travail**

Mise à jour **annuelle** ou événementielle

L'unité de travail regroupe les salariés exposés à des risques
similaires.

**PAGE 5 -- PRÉSENTATION DE L'ENTREPRISE**

  ---------------------------- ------------------------------------------
  **ÉLÉMENT**                  **VALEUR**

  Nom de l'entreprise          {{entreprise.nom}}

  SIRET                        {{entreprise.siret}}

  Adresse                      {{entreprise.adresse_complete}}

  Activité principale          {{entreprise.metier_principal}}

  Convention collective        {{entreprise.cc}}

  Médecine du travail          {{entreprise.medecine}}

  Assureur                     {{entreprise.assurance}}

  Responsable légal            {{entreprise.responsable}}

  Auditeur ICPP                {{auditeur.nom}}
  ---------------------------- ------------------------------------------

**PAGE 6 -- UNITÉS DE TRAVAIL & EFFECTIFS**

  ------------------------------ ----------------------------------------
  **Unité de travail**           **Effectif**

  {{unite1}}                     {{effectif1}}

  {{unite2}}                     {{effectif2}}

  {{unite3}}                     {{effectif3}}

  **TOTAL**                      {{entreprise.effectif}}
  ------------------------------ ----------------------------------------

Notes légales :\
• CSE obligatoire à partir de 11 salariés\
• Apprentis, stagiaires → non comptés dans effectif DUERP\
• L'unité de travail = exposition à un même danger

**PAGE 7 -- MÉTHODOLOGIE F / G / P**

Définition :

-   **F = Fréquence** (1 à 5)

-   **G = Gravité** (1 à 5)

-   **P = Priorité (F × G)**

Afficher un tableau explicatif + un graphique simple des niveaux de
risque.

**PAGE 8 -- RISQUES PHYSIQUES (PAYSAGE)**

Importer automatiquement tous les risques physiques du métier (Bloc 2).\
Afficher pour chaque risque :

Nom

Description

F, G, P

Action recommandée

PAGE 9 -- RISQUES CHIMIQUES (PAYSAGE)

Idem page précédente.

**PAGE 10 -- RISQUES PSYCHOSOCIAUX (RPS)**

Importer automatiquement selon métier.

**PAGE 11 -- RISQUES ORGANISATIONNELS & INCENDIE**

Importer selon métier :

organisationnels

incendie / locaux

**PAGE 12 -- PLAN D'ACTION + SIGNATURES**

Générer un tableau trié par priorité :\
\| Risque \| F \| G \| P \| Action corrective \| Délai \| Responsable \|

Bloc signatures :

Signature employeur

Signature auditeur ICCP

Date & lieu

Mention obligatoire :\
« Le DUERP doit être mis à jour annuellement ou en cas de changement. »

**LOGIQUE AUTOMATIQUE DU DUERP**

TU DOIS:\
✔ Lire les données de l'audit\
✔ Charger les risques du métier\
✔ Calculer F × G\
✔ Générer les 12 pages paysage\
✔ Enregistrer le PDF dans "DUERP_versions"\
✔ Mettre à jour l'entreprise : statut_duerp = \"À jour\"

> **BLOC SUPPLÉMENTAIRE --- CONTRAT AUTOMATIQUE & SIGNATURE
> ÉLECTRONIQUE**

Tu dois maintenant intégrer la fonctionnalité **"Contrat Client ICPP
Automatique"** à l'application :

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

Ce module doit permettre :

la génération automatique d'un **contrat PDF personnalisé**

la **signature électronique simple** via case à cocher

le stockage du contrat dans la base de données

l'accès au contrat depuis l'espace client

l'accès depuis l'espace administrateur

le renouvellement automatique à la date anniversaire

**1. CRÉATION TABLE : "Contrats_Client"**

Créer une nouvelle collection :

**Contrats_Client**

Champs :

-   id

-   client_id (FK → Clients)

-   date_generation (datetime)

-   date_signature (datetime)

-   contrat_pdf_url (string)

-   etat (enum : "Non signé", "Signé", "En attente", "Suspendu",
    "Résilié")

-   tarif (39 €/mois par défaut)

-   duree_engagement (int, par défaut : 12 mois)

-   check_signature (boolean, case à cocher = signature électronique
    simple)

-   version_contrat (string : ex "V1-2025")

**2. MODIFICATION ESPACE CLIENT**

Ajouter dans l'Espace Client :

**Section "Mon Contrat ICPP"**

Contenu :

Nom du client

Numéro contrat

Date de génération

Statut : Signé / Non signé

Bouton **"Lire le contrat"** (affiche PDF viewer)

Case à cocher :\
**« J'accepte le contrat d'abonnement ICPP et ses conditions »**

Bouton **"Signer électroniquement"**

Lorsque le client coche et clique sur "Signer" →\
➡️ check_signature = true\
➡️ date_signature = now()\
➡️ etat = \"Signé\"\
➡️ Génération du PDF signé

**3. GÉNÉRATION AUTOMATIQUE DU CONTRAT PDF**

Lorsque l'on clique sur :\
**Créer un contrat** ou **Signer électroniquement**

Tu dois générer automatiquement un PDF avec les éléments suivants :

**PAGE 1 -- ENTÊTE CONTRAT INCP**

Logo ICPP

Titre "Contrat d'Abonnement -- Mise en Conformité Professionnelle"

Version contrat : {{version_contrat}}

Date génération : {{date_generation}}

**PAGE 2 -- INFORMATIONS CLIENT**

Nom entreprise : {{client.nom}}

SIRET : {{client.siret}}

Adresse : {{client.adresse}}

Responsable : {{client.responsable}}

Métier : {{client.metier}}

Effectif : {{client.effectif}}

**PAGE 3 -- SERVICES INCLUS**

Importer le contenu du contrat que je t'ai fourni :

Audit initial

DUERP

Affichages obligatoires

Mises à jour annuelles

Mises à jour événementielles

Stockage

Assistance conformité

**PAGE 4 -- TARIFS & ENGAGEMENT**

Tarif : {{tarif}}

Durée engagement : {{duree_engagement}} mois

Paiement : Stripe auto

Renouvellement : annuel

**PAGE 5 -- SIGNATURES**

Signature électronique du client :\
**si check_signature = true** → **afficher : "Signé électroniquement le
{{date_signature}}"**

Signature ICPP

Mention légale de validité :\
*La signature électronique simple par acceptation constitue un
engagement contractuel conforme au règlement européen eIDAS.*

**4. LOGIQUE AUTOMATIQUE À AJOUTER**

**Lorsqu'un nouveau client est créé :**

-   créer une entrée dans Contrats_Client

    -   etat = "Non signé"

    -   générer automatiquement un contrat PDF vierge

    -   stocker contrat_pdf_url

**Lorsque le client signe :**

mettre etat = \"Signé\"

regénérer le PDF avec date de signature

stocker nouvelle version

mettre dans l'espace client → "Contrat signé disponible"

**Lors de la suspension Stripe :**

etat = \"Suspendu\"

bloquer accès aux documents

**5. INTÉGRATION DANS ESPACE AUDITEUR**

Ajouter dans la fiche client :

Section **"Contrat ICPP"** :

État

Date signature

Bouton "Télécharger contrat signé"

Bouton "Regénérer contrat"

Bouton "Envoyer au client"

**6. BOUTONS À AJOUTER**

Créer les actions :

**Action 1** → **generer_contrat_client(client_id)**

lire les données client

générer le PDF

créer ou mettre à jour l'entrée Contrats_Client

stocker contrat_pdf_url

**Action 2** → **signer_contrat(client_id)**

check_signature = true

date_signature = now()

etat = \"Signé\"

regénérer PDF signé

**Action 3** → **envoyer_contrat(client_id)**

envoyer email au client :\
"Votre contrat ICPP est disponible dans votre espace."

**7. MISE EN PAGE PDF**

Utiliser **le même Header & Footer ICPP** que le DUERP :

Header bleu #001F3F

Footer "Document officiel -- ICPP"

Pagination automatique

✔ **FIN DU BLOC --- CONTRAT ELECTRONIQUE ICPP**

**BLOC ADDITIONNEL --- EN-TÊTE & PIED DE PAGE PDF (ICPP Signature)**

Ce bloc indique comment construire l'entête et le pied de page *sur
toutes les pages* du DUERP Premium.

🔷 **OBJECTIF DU BLOC**

la structure exacte de l'en-tête

la structure exacte du pied de page

les couleurs à appliquer

les espacements

ce qui est fixe

ce qui change selon l'entreprise

comment l'intégrer dans **chaque page PDF automatiquement**

**BLOC --- HEADER & FOOTER PDF INCP**

Tu dois maintenant intégrer **un en-tête et un pied de page uniformes**
sur toutes les pages du DUERP Premium PDF généré pour :

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

Ces éléments doivent être ajoutés automatiquement **à chaque page**,
même si le contenu change.

**1. EN-TÊTE (HEADER) --- SPÉCIFICATIONS**

**Structure à appliquer sur chaque page :**

-   **Texte à afficher dans l'en-tête :**\
    \
    \
    \
    ICPP -- Institut de Conformité et de Prévention Professionnelle

-   Document Unique d\'Évaluation des Risques Professionnels

Le header doit être **répété automatiquement sur toutes les pages**.

**2. PIED DE PAGE (FOOTER) --- SPÉCIFICATIONS**

**Structure à appliquer sur chaque page :**

-   **Barre fine en haut du pied de page :**

    -   Couleur : bleu république **#001F3F**

    -   Hauteur : 1.5 px

    -   Largeur : 100%

-   **Contenu du pied de page :**

    -   À gauche :\
        \
        \
        \
        INCP -- Document officiel DUERP

    -   

    -   À droite :\
        \
        \
        \
        Page {{numéro_page}} / {{nombre_total_pages}}

Le footer doit être **automatique et identique sur toutes les pages**.

**3. INTÉGRATION PDF**

Lors de la génération du DUERP Premium :

page 1 → header + footer

page 2 → header + footer

page 3 → header + footer

...

page 12 → header + footer

Aucune page ne doit être générée sans en-tête ou pied de page.

✔ **FIN DU BLOC ADDITIONNEL HEADER/FOOTER**

**STRUCTURE COMPLÈTE -- ESPACE CLIENT ICPP**

Voici la structure **exacte**, prête à intégrer ultra professionnelle.

🏛 **ESPACE CLIENT INCP -- STRUCTURE OFFICIELLE**

**MENU PRINCIPAL (barre latérale ou onglets)**

**Tableau de bord**

**Mes documents**

📁 DUERP

📁 Affichages obligatoires

📁 Classeur conformité

📁 Modèles & formulaires

**Mon entreprise**

**Mes salariés**

**Mes paiements**

**Mon abonnement**

**Support ICPP**

**Déconnexion**

**1. TABLEAU DE BORD -- ICPP**

Contenu :

-   Score de conformité (barre de progression)

-   Dernière mise à jour DUERP

-   Dernier audit réalisé

-   Affichages obligatoires : ✔ complet / ✖ incomplet

-   Rappels automatiques :

    -   salariés ajoutés récemment ?

    -   documents manquants

    -   affichages à actualiser

-   CTA : "Mettre à jour mon entreprise"

-   CTA : "Ajouter un salarié"

-   CTA : "Télécharger mon DUERP"

**2. MES DOCUMENTS**

📁 **A. DUERP**

Contient :

Dernière version PDF

Historique des versions

Téléchargement

Bouton "Mettre à jour DUERP"

Résumé automatique des risques

Recommandations ICPP (générées par IA)

Structure base de données :

duerp_client

id

client_id

version

date_generation

url_pdf

statut (actif / obsolète)

📁 **B. Affichages obligatoires**

Contient les **7 affiches obligatoires** :

Inspection du travail

Médecine du travail

Numéros d'urgence

Interdiction de fumer / vapoter

Harcèlement / discrimination

Égalité professionnelle

Consignes incendie

Horaires de travail (si applicable)

Structure BD :

affichages_type

id

nom

contenu_modele (texte brut)

categorie = "affichage_mur"

obligatoire = true

affichages_client

id

client_id

affichage_type_id

date_generation

url_pdf

Boutons :

"🖨 Télécharger"

"📄 Voir"

"🔁 Régénérer après modification entreprise"

📁 **C. Classeur conformité**

Contient :

Registre du personnel

Liste salariés par unité de travail

Registre accidents bénins

Fiche entrée salarié

Fiche sortie salarié

Analyse accident du travail

Procédures internes

Structure BD :

documents_classeur_type

id

nom

categorie = "classeur_conformité"

modele (texte)

obligatoire (true / false)

documents_classeur_client

id

client_id

document_type_id

date_generation

url_pdf

📁 **D. Modèles & formulaires**

Modèles vierges à télécharger :

Fiche entrée

Fiche sortie

Modèle planning

Modèle registre AT bénins

**3. MON ENTREPRISE**

Champs du client :

Nom entreprise

SIRET

Adresse

Email

Téléphone

Responsable légal

Métier / activité

Nombre de salariés

Unités de travail

Horaires

Local (surface, pièces, zones)

⚠️ IMPORTANT :\
→ **mise à jour ici déclenche automatiquement :**

mise à jour DUERP

régénération affichages

mise à jour registres

**4. MES SALARIÉS**

Base de données :

salariés

id

client_id

nom

prénom

poste

type contrat

date entrée

date sortie

unité de travail

statut actif

Actions :

Ajouter salarié\
→ impact DUERP\
→ impact registre personnel

Modifier salarié

Désactiver salarié

**5. MES PAIEMENTS**

Historique factures

Reçus

Abonnements

Moyen de paiement

Impayés (alerte rouge)

CTA "Mettre à jour carte"

Stripe connecté.

**6. MON ABONNEMENT**

Informations :

Offre ICPP (39€/mois ou autre)

Date de début

Engagement (0 ou 12 mois)

Statut actif / suspendu

CTA "Changer d'offre"

**7. SUPPORT ICCP**

Chat

Mail

FAQ

Fichier "Guide conformité 2025"

📄 **CGV OFFICIELLES ICCP**

**CONDITIONS GÉNÉRALES DE VENTE**\
**INCP -- Institut de Conformité et de Prévention Professionnelle**\
Version : CGV-INCP-2025\
Entrée en vigueur : \[date\]

**1. OBJET**

Les présentes Conditions Générales de Vente (ci-après "CGV") régissent
les relations entre :

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
(ci-après "ICPP", "nous", "le Prestataire"),

et

Toute entreprise cliente (ci-après "le Client").

Les services incluent :

Audit professionnel

Production du DUERP

Mise à disposition des affichages obligatoires

Mise à jour annuelle ou événementielle

Assistance conformité

Accès à l'espace client

**2. ACCEPTATION DES CONDITIONS**

Le Client reconnaît accepter les CGV sans réserve :

✔ lors de la signature électronique\
✔ ou lors du paiement\
✔ ou lors du premier accès à son espace client

La signature électronique simple via case à cocher constitue une preuve
valable conformément au règlement eIDAS.

**3. DESCRIPTION DES SERVICES**

ICPP fournit :

Audit initial (questionnaire + analyse)

Création d'un DUERP conforme

Mise à jour annuelle

Mises à jour événementielles en cas de changement

Tableau d'analyse des risques

Affichages obligatoires PDF

Espace client

Assistance sous 72h ouvrées

ICPP n'intervient pas physiquement dans les locaux sauf accord écrit.

**4. TARIFS & ABONNEMENTS**

**4.1 Frais de mise en place -- 49 € TTC (obligatoire)**

Ce montant couvre :

l'audit initial

la création du DUERP

la configuration de l'espace client

la préparation des affichages obligatoires

Il n'est facturé **qu'une seule fois**, uniquement l'année d'entrée.

**4.2 Formules d'abonnement**

Le Client choisit 1 des 3 packs suivants :

🔹 **PACK ESSENTIEL -- 19 € / mois (228 € / an)**

Pour très petites entreprises (0 à 1 salarié en fonction des risques et
mise à jour).

Inclut :

DUERP initial

Mise à jour annuelle simple

Affichages obligatoires essentiels

Accès espace client

Assistance email

🔹 **PACK PRO -- 39 € / mois (468 € / an)**

Pour TPE / PME (1 à 5 salariés en fonction des risques et mise à jour).

Inclut :

DUERP initial + **mises à jour illimitées**

Gestion des salariés

Affichages obligatoires complets

Assistance prioritaire

Support conformité avancé

🔹 **PACK PREMIUM -- 79 € / mois (948 € / an)**

Pour entreprises exigeantes, multi-sites, cabinets.

Inclut :

Prestations du pack Pro

Suivi conformité continu

Gestion multi-sites

Adaptations sur mesure

Assistance renforcée

**4.3 Geste commercial (optionnel)**

L'auditeur peut exceptionnellement offrir :

-   **1 mois offert** (maximum)

Cela ne constitue **pas un droit**, mais un geste commercial ponctuel.\
Pour être valide :\
➡️ il doit être coché dans le contrat.

**4.4 Paiements**

Paiement mensuel ou annuel

Par carte bancaire via Stripe

Prélèvement automatique obligatoire

**5. IMPAYÉS, SUSPENSION & RÉSILIATION**

**5.1 Impayés**

J+0 : email de rappel\
J+7 : suspension espace client\
J+14 : suspension de service\
J+30 : résiliation automatique

**5.2 Conséquences**

En cas de suspension/résiliation :

Le client redevient non conforme

Le DUERP n'est plus mis à jour

Les documents sont inaccessibles

ICPP décline toute responsabilité en cas de contrôle

**6. DURÉE DU CONTRAT**

Le contrat est conclu pour 12 mois, renouvelable tacitement.

Résiliation possible :

à échéance (+ 30 jours avant)

cessation d'activité

force majeure

**7. OBLIGATIONS DU CLIENT**

Le Client doit :

fournir des informations exactes

signaler tout changement

conserver et afficher les documents obligatoires

suivre les recommandations

payer les échéances

INCP décline toute responsabilité en cas d'informations erronées ou non
mises à jour.

**8. LIMITATION DE RESPONSABILITÉ**

ICPP n'est pas responsable :

des erreurs déclaratives

d'un accident du travail non signalé

d'un changement d'activité non communiqué

d'un défaut d'affichage

des sanctions administratives liées à un manquement du Client

**9. PROPRIÉTÉ INTELLECTUELLE**

Restent la propriété exclusive de ICPP :

DUERP

Méthodologie

Modèles PDF

Modèles d'affichages

Scripts et systèmes internes

Architecture / Notion / SASS

Toute reproduction, utilisation ou imitation entraînera une action en
contrefaçon.

**10. CONFIDENTIALITÉ**

Les données du Client sont strictement confidentielles.\
ICPP ne revend ni ne partage aucune donnée.

**11. PROTECTION DES DONNÉES (RGPD)**

Collecte limitée

Stockage sécurisé

Espace client conforme

Droit d'accès / modification / suppression

Conservation 5 ans

Contact RGPD : contact@icpp.fr

**12. SIGNATURE ÉLECTRONIQUE**

Le contrat devient valable :

✔ par case "J'accepte les CGV"\
✔ ou par signature électronique\
✔ ou par paiement du premier mois

**13. LOI APPLICABLE & TRIBUNAL**

Loi française.\
Juridiction choisie par ICCP :

Tribunal de Saint-Denis (974)\
OU

Tribunal de Paris

Valable et opposable.

**14. ACCEPTATION**

Le Client reconnaît que :

la signature électronique = accord total

l'abonnement se renouvelle automatiquement

les impayés entraînent non-conformité

le DUERP nécessite une collaboration active

✔ **FIN DES CGV**

📦 **BLOC -- CGV AUTOMATIQUES + PLANS TARIFAIRES INCP**

Tu dois mettre en place la **gestion automatique des CGV et des plans
tarifaires ICPP** pour l'application :

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

Objectifs :

Stocker les CGV (avec version)

Gérer l'acceptation des CGV par chaque client (signature électronique
simple)

Gérer les plans tarifaires (Essentiel / Pro / Premium)

Gérer les frais de mise en place (49 € HT une seule fois)

Permettre (optionnellement) d'offrir le 1er mois d'abonnement au client

Bloquer le paiement tant que les CGV ne sont pas acceptées

**1**️⃣ **TABLE : CGV_Versions**

Créer la table : **CGV_Versions**

**Champs :**

-   id

-   version_code (string)\
    👉 Exemple : \"CGV-ICPP-2025\"

-   contenu_cgv (long text / rich text)\
    👉 C'est ici qu'on colle **le texte intégral des CGV** (version que
    tu as déjà rédigée)

-   date_mise_en_ligne (datetime)

-   actif (bool)

**Règles :**

-   Une seule CGV avec actif = true à la fois.

-   Lors d'une nouvelle version :

    -   Ancienne version → actif = false

    -   Nouvelle version → actif = true

**2**️⃣ **TABLE : CGV_Acceptation**

Créer la table : **CGV_Acceptation**

**Champs :**

-   id

-   client_id (FK → table Entreprises ou Users, selon ce que tu as
    choisi comme "Client entreprise")

-   version_cgv_id (FK → CGV_Versions.id de la version active)

-   date_acceptation (datetime)

-   ip_signature (string) -- IP au moment de la signature

-   user_agent (string) -- navigateur / device (facultatif mais utile)

-   preuve_signature (string) -- hash ou texte du type :\
    \"CGV-ICPP-2025 accepté le {{date}} par {{nom_client}} via case à
    cocher\"

**Règles :**

-   Un client peut accepter plusieurs versions dans le temps
    (historique).

-   Pour considérer un client "en règle" :

    -   Il doit exister **une ligne** dans CGV_Acceptation\
        avec client_id = X et version_cgv_id = version active.

**3**️⃣ **TABLE : Plans_Tarifaires_ICPP**

Créer la table : **Plans_Tarifaires_ICPP**

**Champs :**

-   id

-   nom_plan (string)\
    👉 valeurs : \"Essentiel\", \"Pro\", \"Premium\"

-   code_plan (string)\
    👉 \"ESSENTIEL\", \"PRO\", \"PREMIUM\"

-   description_commerciale (string)\
    👉 ex :

    -   Essentiel : \"Micro-structure / 1 salarié -- Conformité de
        base\"

    -   Pro : \"TPE 1 à 9 salariés -- Suivi complet\"

    -   Premium : \"Structures 10 à 20 salariés -- Accompagnement
        renforcé\"

-   prix_mensuel_ht (decimal)\
    👉 19.00 / 39.00 / 79.00

-   frais_mise_en_place_ht (decimal)\
    👉 49.00 par défaut (pour tous les plans, mais **payé une seule
    fois** par client)

-   duree_engagement_mois (int)\
    👉 12 (engagement 12 mois)

-   effectif_min (int)\
    👉 Essentiel = 1, Pro = 2, Premium = 10

-   effectif_max (int)\
    👉 Essentiel = 1, Pro = 9, Premium = 20 (par exemple)

-   offre_mois_gratuit_possible (bool)\
    👉 true si ce plan peut bénéficier d'un mois offert en option

-   actif (bool)

**Données à insérer :**

-   Plan 1 -- Essentiel

    -   nom_plan = \"Essentiel\"

    -   code_plan = \"ESSENTIEL\"

    -   prix_mensuel_ht = 19.00

    -   frais_mise_en_place_ht = 49.00

    -   effectif_min = 1

    -   effectif_max = 1

    -   duree_engagement_mois = 12

    -   offre_mois_gratuit_possible = true

    -   actif = true

-   Plan 2 -- Pro

    -   nom_plan = \"Pro\"

    -   code_plan = \"PRO\"

    -   prix_mensuel_ht = 39.00

    -   frais_mise_en_place_ht = 49.00

    -   effectif_min = 2

    -   effectif_max = 9

    -   duree_engagement_mois = 12

    -   offre_mois_gratuit_possible = true

    -   actif = true

-   Plan 3 -- Premium

    -   nom_plan = \"Premium\"

    -   code_plan = \"PREMIUM\"

    -   prix_mensuel_ht = 79.00

    -   frais_mise_en_place_ht = 49.00

    -   effectif_min = 6

    -   effectif_max = 20

    -   duree_engagement_mois = 12

    -   offre_mois_gratuit_possible = true

    -   actif = true

**4**️⃣ **AJOUT DANS LA TABLE Entreprises / Clients**

Dans la table **Entreprises** (ou Clients entreprises), ajouter les
champs :

-   plan_tarifaire_id (FK → Plans_Tarifaires_INCP.id)

-   montant_mensuel_ht (decimal) -- valeur copiée depuis le plan au
    moment de la signature

-   frais_mise_en_place_ht (decimal) -- 49.00 par défaut À CHAQUE
    RENOUVELEMENT ANNUEL

-   frais_mise_en_place_payes (bool) -- false au début, true après
    paiement

-   mois_gratuit_offert (bool) -- false par défaut\
    👉 peut être passé à true si tu décides de faire un geste commercial

-   date_debut_mois_gratuit (datetime, nullable)

-   date_fin_mois_gratuit (datetime, nullable)

Règles :

-   Quand un nouveau client signe :

    -   tu choisis un **plan_tarifaire**

    -   tu copies prix_mensuel_ht → montant_mensuel_ht

    -   tu mets frais_mise_en_place_ht = 49.00

-   Le booléen mois_gratuit_offert est **optionnel** :

    -   si tu veux faire un geste → tu passes à true pour ce client

    -   sinon tu laisses false

**5**️⃣ **FLUX FRONT : ACCEPTATION DES CGV AVANT PAIEMENT**

V0 doit imposer la logique suivante :

Lors de l'onboarding client (avant Stripe) :

-   Afficher un encadré "Conditions Générales de Vente"

-   Afficher :

    -   Nom de la version CGV : CGV-ICPP-2025

    -   Lien "Lire les CGV complètes" → contenu de
        CGV_Versions.contenu_cgv (version active)

        Afficher une **case à cocher obligatoire** :

☐ Je reconnais avoir lu et j'accepte les Conditions Générales de Vente
ICPP (version {{version_code}}).

Tant que la case n'est pas cochée :

-   **bloquer** le bouton "Continuer vers le paiement"

-   ne pas créer de souscription

    Quand la case est cochée et l'utilisateur valide :

-   Créer une ligne dans **CGV_Acceptation** :

    -   client_id = id du client

    -   version_cgv_id = id de la CGV active

    -   date_acceptation = now()

    -   ip_signature + user_agent = récupérés du navigateur

    -   preuve_signature = texte du type :\
        \"CGV-ICPP-2025 acceptées le {{date}} par
        {{raison_sociale_client}}\"

        Une fois l'acceptation CGV enregistrée → autoriser la
        redirection Stripe.

**6**️⃣ **LOGIQUE PAIEMENT AVEC FRAIS DE MISE EN PLACE + ABONNEMENT**

V0 doit gérer **2 types de paiements** :

1.  **Frais de mise en place (49 € HT -- one shot)**

```{=html}
<!-- -->
```
5.  **Abonnement mensuel (19 / 39 / 79 € HT)**

**Règles à appliquer :**

-   Lors de la première souscription :

    -   Si frais_mise_en_place_payes = false :

        -   Créer un paiement Stripe pour 49,00 € HT (one shot)

        -   Une fois Stripe OK → frais_mise_en_place_payes = true

    -   Ensuite, créer l'abonnement mensuel Stripe :

        -   montant = montant_mensuel_ht (19 ou 39 ou 79)

-   Si mois_gratuit_offert = true :

    -   Demander à Stripe de :

        -   soit mettre 1er mois d'abonnement à 0 €

        -   soit appliquer un coupon 100% sur la 1ère facture

    -   Puis abonnement normal à partir du mois 2

-   Si mois_gratuit_offert = false :

    -   1er mois est payé normalement.

**7**️⃣ **BLOQUAGE EN CAS DE NON-ACCEPTATION CGV**

Avant toute création de souscription :

-   Vérifier :

    -   Existe-t-il une ligne dans **CGV_Acceptation** pour ce client\
        avec version_cgv_id = version active ?

-   Si NON :

    -   **Bloquer la création d'abonnement**

    -   Afficher :\
        "Vous devez accepter les CGV ICPP pour finaliser votre
        abonnement."

**8**️⃣ **VISIBILITÉ DANS L'ESPACE CLIENT**

Dans l'**espace client**, ajouter une section :

**"Mes CGV & Conditions contractuelles"**

Contenu :

-   Afficher :

    -   Version CGV acceptée : version_code (ex : CGV-ICPP-2025)

    -   Date d'acceptation

-   Bouton : **"Voir les CGV"** → affiche contenu_cgv

-   Si une nouvelle version CGV est mise en ligne (actif = true
    différent) :

    -   Au prochain login :

        -   afficher une bannière :\
            "Les CGV ICPP ont été mises à jour. Merci de les lire et de
            confirmer votre accord."

        -   obliger l'acceptation avant modification de l'abonnement ou
            génération d'un nouveau DUERP.

**9**️⃣ **VISIBILITÉ CÔTÉ ADMIN / ICPP**

Dans le **Dashboard Admin** :

-   Dans la fiche client :

    -   Afficher :

        -   Plan : Essentiel / Pro / Premium

        -   Montant mensuel

        -   Frais de mise en place payés ? (oui/non)

        -   CGV acceptées ? (oui/non)

        -   Version CGV acceptée + date

-   Ajouter une vue :

    -   Liste des clients **qui n'ont pas encore accepté** les CGV
        actives

    -   Liste des clients **avec ancienne version** (si tu changes de
        CGV plus tard)

**1**️⃣ **CONTRAT D'ABONNEMENT ICPP -- VERSION COMPLÈTE (PRÊT À SIGNER)**

📌 Tu pourras le copier tel quel dans Word / Google Docs / Notion et
juste remplir les zones entre \[crochets\].

**CONTRAT D'ABONNEMENT**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

Entre les soussignés :

**INCP -- Institut National de Conformité Professionnelle**\
\[Forme juridique\] -- \[Capital social\]\
Siège social : \[Adresse ICPP\]\
SIRET : \[SIRET ICPP\]\
Représentée par : \[Nom / Prénom du représentant\]\
Ci-après dénommée **« ICPP »** ou **« le Prestataire »**,

D'une part,

ET

**\[Nom de l'entreprise cliente\]**\
Forme juridique : \[ex : SARL, EURL, EI...\]\
SIRET : \[Numéro SIRET\]\
Adresse : \[Adresse complète\]\
Représentée par : \[Nom / Prénom du dirigeant\]\
Fonction : \[Gérant(e) / Président(e)...\]\
Ci-après dénommée **« le Client »**,

D'autre part,

Ensemble dénommés **« les Parties »**.

**ARTICLE 1 -- OBJET DU CONTRAT**

Le présent contrat a pour objet de définir les conditions dans
lesquelles ICPP accompagne le Client dans sa **mise en conformité
légale**, notamment concernant :

l'évaluation des risques professionnels,

la rédaction et la mise à jour du **Document Unique d'Évaluation des
Risques Professionnels (DUERP)**,

la fourniture des **affichages obligatoires**,

la mise à disposition d'un **espace client en ligne**,

les **mises à jour annuelles et événementielles** liées à la conformité.

Les prestations sont détaillées dans les **Conditions Générales de Vente
(CGV)** en vigueur, annexées au présent contrat.

Les CGV font partie intégrante du contrat.

**ARTICLE 2 -- DOCUMENTS CONTRACTUELS**

Les documents contractuels sont, par ordre de priorité :

Le présent **Contrat d'Abonnement**,

Les **Conditions Générales de Vente (CGV) -- Réf :
\[CGV-INCP-2025-V...\]**,

Les éventuelles **conditions particulières** mentionnées en page 1 ou en
annexe,

Les devis ou propositions commerciales validés par le Client.

En cas de contradiction, le document de rang supérieur prévaut.

**ARTICLE 3 -- DESCRIPTION DES SERVICES INCLUS**

ICPP fournit au Client, selon le plan choisi (Essentiel / Pro / Premium)
:

**3.1 -- Audit initial de conformité**

Recueil des informations sur l'entreprise,

Analyse des risques professionnels par métier,

Vérification des obligations légales (DUERP, affichages, registres,
etc.).

**3.2 -- Élaboration et fourniture du DUERP**

DUERP complet au format PDF,

Structuré selon la méthodologie ICPP,

Mise à disposition dans l'espace client.

**3.3 -- Mises à jour**

**Mise à jour annuelle** du DUERP,

Mises à jour **événementielles** en cas de modifications déclarées
(nouveaux salariés, déménagement, nouvelle activité...), selon les
modalités du plan.

**3.4 -- Affichages obligatoires**

Fourniture de modèles d'affichages obligatoires (inspection du travail,
numéros d'urgence, interdiction de fumer, etc.) au format PDF.

**3.5 -- Espace client ICPP**

-   Accès sécurisé à un espace en ligne, permettant de :

    -   consulter les documents de conformité,

    -   télécharger le DUERP,

    -   accéder aux factures,

    -   déclarer des changements.

Le détail exact des services inclus selon chaque plan figure dans la
documentation commerciale et/ou les CGV.

**ARTICLE 4 -- DURÉE DU CONTRAT**

Le contrat est conclu pour une **durée ferme de 12 mois** à compter de
la **Date d'Entrée en Vigueur** :

Date d'entrée en vigueur : **\[JJ/MM/AAAA\]**

À l'issue de cette période initiale de 12 mois, le contrat est
**renouvelé tacitement** pour des périodes successives d'un (1) an, sauf
dénonciation par l'une des Parties dans les conditions prévues à
l'Article 10 (Résiliation).

**ARTICLE 5 -- PLAN CHOISI ET TARIFS**

**5.1 -- Plan d'abonnement choisi**

Le Client souscrit au plan suivant :

-   **Plan :** \[☐ Essentiel / ☐ Pro / ☐ Premium\]

-   **Nom du plan retenu :** \[Ex : Pro\]

-   **Prix mensuel HT :** \[XX\] € HT / mois

-   **Nombre de salariés couverts :** \[Ex : 1--13 salariés\]

Ces montants correspondent à la grille tarifaire ICPP en vigueur à la
date de signature.

*(Dans ton cas réel, par exemple : Pro = 39 € HT / mois)*

**5.2 -- Frais de mise en place**

En plus de l'abonnement mensuel, le Client s'acquitte de **frais de mise
en place** correspondant à la création initiale de son dossier de
conformité et de son DUERP :

-   **Frais de mise en place (forfait initial) :** **\[49\] € HT**\
    *(montant configurable, tu peux l'ajuster si besoin)*

Ce montant est facturé **une seule fois**, au démarrage du contrat.

**5.3 -- Total initial à la signature**

À la date de signature, le Client s'engage à régler :

Frais de mise en place : \[49\] € HT

Premier mois d'abonnement : \[XX\] € HT

**Total initial HT : \[XX + 49\] € HT**\
Conditions de paiement : **immédiat, via Stripe ou tout autre moyen
accepté par INCP.**

Remise commerciale éventuelle :\
\[☐ Aucune remise\]\
\[☐ Remise exceptionnelle accordée : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \]\
(ex : 1er mois offert, remise de X €, etc. -- à remplir manuellement si
tu fais un geste)

**ARTICLE 6 -- MODALITÉS DE PAIEMENT**

Les paiements sont effectués :

par **prélèvement automatique mensuel** via Stripe,

ou par tout autre moyen sécurisé mis à disposition par ICPP.

En signant le présent contrat, le Client autorise ICPP (ou son
prestataire de paiement) à prélever automatiquement les montants dus,
selon la fréquence prévue.

**ARTICLE 7 -- OBLIGATIONS DU CLIENT**

Le Client s'engage notamment à :

Fournir des informations exactes, complètes et à jour,

Signaler **sans délai** tout changement susceptible d'impacter le DUERP
(nouveau salarié, déménagement, nouvelle activité, nouvelle machine,
etc.),

Afficher les documents obligatoires fournis par ICPP dans ses locaux,

Respecter les recommandations essentielles transmises,

Régler les sommes dues à l'échéance.

Le Client reconnaît que la qualité et la conformité du DUERP dépendent
directement des informations transmises à ICPP.

**ARTICLE 8 -- IMPAYÉS ET SUSPENSION**

En cas de non-paiement partiel ou total d'une échéance :

1.  **J+0 :** rappel automatique par email,

```{=html}
<!-- -->
```
6.  **J+7 :** suspension de l'accès à certains services (espace client
    limité, impossibilité de générer de nouveaux documents),

7.  **J+14 :** suspension des prestations de mise à jour DUERP,

8.  **J+30 :** résiliation de plein droit possible du contrat par ICPP,
    après notification écrite.

En cas de suspension ou résiliation pour impayé, le Client est informé
qu'il **redevient non conforme** au regard de certaines obligations
réglementaires jusqu'à régularisation ou nouvelle souscription.

**ARTICLE 9 -- RÉFÉRENCE AUX CGV**

Les **CGV ICPP -- Réf : \[CGV-INCP-2025-V...\]** sont remises au Client
:

soit en annexe papier,

soit disponibles en ligne à l'adresse : \[URL des CGV\],

soit accessibles via l'espace client.

Le Client reconnaît avoir pris connaissance des CGV et les accepter sans
réserve.\
En cas de contradiction entre le présent contrat et les CGV, le présent
contrat prévaut.

**ARTICLE 10 -- RÉSILIATION**

Le contrat peut être résilié :

**À l'échéance annuelle**, par l'une ou l'autre des Parties, sous
réserve de respecter un préavis de **30 jours**,

En cas de **force majeure**,

En cas de **manquement grave** de l'autre Partie à ses obligations, non
réparé dans un délai de 30 jours après mise en demeure écrite.

La résiliation n'exonère pas le Client du paiement des sommes échues et
restant dues au titre de la période en cours.

**ARTICLE 11 -- DONNÉES PERSONNELLES**

ICPP traite les données du Client conformément au RGPD et aux
dispositions décrites dans les CGV (article « Protection des données
»).\
Le Client dispose d'un droit d'accès, de rectification et de suppression
dans les conditions légales.

**ARTICLE 12 -- LOI APPLICABLE & JURIDICTION**

Le présent contrat est régi par le **droit français**.

En cas de litige, et sauf disposition d'ordre public contraire, ICPP se
réserve le droit de saisir, au choix :

le **Tribunal de Saint-Denis (La Réunion)**,

ou le **Tribunal de Paris**.

**ARTICLE 13 -- SIGNATURES**

Fait à : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\
Le : \_\_\_\_ / \_\_\_\_ / 20\_\_\_\_

Pour ICPP,\
Nom : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\
Fonction : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\
Signature : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

Pour le Client,\
Nom : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\
Fonction : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\
Signature : \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**BLOC-- CONTRAT AUTOMATISÉ AVEC VARIABLES (PLAN + PRIX + FRAIS + CGV)**

📌 (dans un bloc "Contrat automatique").\
va ainsi générer le contrat PDF en allant chercher les bonnes infos en
base.

🔷 **INSTRUCTION GÉNÉRALE POUR**

Tu dois mettre en place la **gestion automatique des contrats
d'abonnement ICPP**, en utilisant des variables dynamiques :

plan choisi (Essentiel / Pro / Premium),

prix mensuel HT associé,

frais de mise en place,

éventuelle remise commerciale,

version des CGV applicable.

Tu dois :

Créer / compléter la table des contrats,

Lier chaque contrat à une entreprise cliente,

Générer un PDF de contrat à partir du modèle ICPP,

Remplir automatiquement les variables,

Stocker l'URL du contrat PDF,

Permettre la signature électronique (case à cocher).

**2.1 -- TABLE : Contrats_Client**

Si la table existe déjà, l'enrichir.\
Sinon, la créer avec les champs suivants :

**Table : Contrats_Client**

-   id (clé primaire)

-   entreprise_id (FK → Entreprises.id)

-   date_generation (datetime)

-   date_signature (datetime, nullable)

-   etat (enum : \"Non signé\" / \"Signé\" / \"Suspendu\" / \"Résilié\")

**Champs liés au plan :**

-   plan_code (string, ex : \"ESSENTIEL\", \"PRO\", \"PREMIUM\")

-   plan_label (string, ex : \"Pack Essentiel\", \"Pack Pro\", etc.)

-   prix_mensuel_ht (decimal, ex : 19.00 / 39.00 / 79.00)

-   frais_mise_en_place_ht (decimal, ex : 49.00)

-   remise_exceptionnelle_ht (decimal, nullable, ex : 0.00 par défaut)

**Champs CGV :**

-   cgv_version_code (string, ex : \"CGV-ICPP-2025-V1\")

-   cgv_url (string, URL PDF ou page web des CGV)

**Autres :**

-   contrat_pdf_url (string, URL du contrat généré)

-   check_signature (boolean -- case à cocher = signature électronique
    simple)

**2.2 -- LIAISON AVEC LES PLANS TARIFAIRES**

Créer une petite table de référence :

**Table : Plans_Tarifaires_ICPP**

-   id

-   code (ex : \"ESSENTIEL\", \"PRO\", \"PREMIUM\")

-   label (string)

-   prix_mensuel_ht (decimal)

-   frais_mise_en_place_ht (decimal, ex : 49.00)

-   description_courte (string)

**Logique :**

Quand on crée un contrat :

-   l'utilisateur (auditeur ou admin) choisit un plan dans une liste
    (ESSENTIEL / PRO / PREMIUM),

-   V0 copie dans Contrats_Client :

    -   plan_code

    -   plan_label

    -   prix_mensuel_ht

    -   frais_mise_en_place_ht

**2.3 -- ACTIONS À CRÉER**

🔹 **Action 1 : creer_contrat_client(entreprise_id, plan_code)**

-   Récupérer l'entreprise dans Entreprises.

-   Récupérer le plan dans Plans_Tarifaires_INCP via plan_code.

-   Créer une entrée dans Contrats_Client avec :

    -   entreprise_id

    -   plan_code, plan_label, prix_mensuel_ht, frais_mise_en_place_ht

    -   remise_exceptionnelle_ht = 0 par défaut

    -   cgv_version_code = \"CGV-ICPP-2025-V1\" (par exemple)

    -   cgv_url = \[URL des CGV\]

    -   etat = \"Non signé\"

    -   date_generation = now()

-   Puis appeler l'action generer_contrat_pdf(contrat_id).

🔹 **Action 2 : generer_contrat_pdf(contrat_id)**

**Objectif :** générer le PDF du contrat à partir du modèle texte (celui
que je t'ai donné en 1️⃣), en remplaçant les variables par les données du
contrat + entreprise.

Charger le contrat (table Contrats_Client)

Charger l'entreprise (Entreprises)

Injecter dans le modèle les variables :

-   {{nom_entreprise}}

-   {{siret}}

-   {{adresse_entreprise}}

-   {{representant_nom}}

-   {{plan_label}}

-   {{plan_code}}

-   {{prix_mensuel_ht}}

-   {{frais_mise_en_place_ht}}

-   {{remise_exceptionnelle_ht}}

-   {{cgv_version_code}}

-   {{cgv_url}}

-   {{date_generation}}

    Générer un **PDF** au format A4, en reprenant la structure :

    Titre,

    Articles 1 à 13 (ceux du contrat plus haut),

    Bloc signatures.

    Sauvegarder le fichier PDF dans le stockage (ex :
    contrats/contrat-{{contrat_id}}.pdf).

    Mettre à jour contrat_pdf_url avec l'URL générée.

🔹 **Action 3 : signer_contrat(contrat_id)**

Quand le client coche **"J'accepte le contrat et les CGV"** dans son
espace client :

Mettre check_signature = true

Mettre date_signature = now()

Mettre etat = \"Signé\"

Regénérer le contrat PDF en ajoutant la mention :\
« Signé électroniquement le {{date_signature}} par \[Nom de
l'entreprise\]. »

Mettre à jour contrat_pdf_url avec la nouvelle version.

**2.4 -- CONTRÔLE CGV AVANT PAIEMENT**

-   **Tant que** check_signature ≠ true\
    → **interdire** le déclenchement du paiement Stripe (ou afficher un
    message :\
    « Vous devez accepter le contrat et les CGV avant de procéder au
    paiement. »)

**2.5 -- ESPACE CLIENT -- SECTION « MON CONTRAT »**

Dans l'espace client, créer une section :

**Mon Contrat d'abonnement ICPP**

Afficher :

Plan : {{plan_label}}

Prix mensuel : {{prix_mensuel_ht}} € HT / mois

Frais de mise en place : {{frais_mise_en_place_ht}} € HT

Statut contrat : {{etat}}

Date de signature : {{date_signature}} (si signé)

Lien : **« Télécharger mon contrat signé »** → contrat_pdf_url

Lien : **« Lire les CGV »** → cgv_url

En dessous :

Case à cocher :\
« Je reconnais avoir lu et accepté le Contrat d'abonnement ICPP et les
Conditions Générales de Vente. »

Bouton : **« Signer électroniquement »** → appelle
signer_contrat(contrat_id).

**PACK OFFICIEL AFFICHAGES OBLIGATOIRES -- ICPP *( DANS UNE SEULE PAGE
C'EST OK)***

*(modèle à générer avec les inactions du Bloc Header & Footer PDF )*

**1**️⃣ **AFFICHAGE : Coordonnées Inspection du Travail**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**AFFICHAGE OBLIGATOIRE -- INSPECTION DU TRAVAIL**

**Inspection du Travail compétente :**\
Dénomination : *Inspection du Travail -- \[Ville / Département\]*\
Adresse : *\[Adresse complète\]*\
Téléphone : *\[Numéro\]*\
Email : *\[Email\]*

**Nom de l'agent de contrôle :**\
*\[Nom si connu, sinon "non communiqué"\]*

**Article L8112-1 du Code du Travail**\
Cet affichage doit être consultable par tous les salariés.

**2**️⃣ **AFFICHAGE : Médecine du Travail**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**SERVICE DE SANTÉ AU TRAVAIL -- COORDONNÉES OBLIGATOIRES**

Service : *\[Nom du Service de Prévention et de Santé au Travail\]*\
Adresse : *\[Adresse\]*\
Téléphone : *\[Numéro\]*\
Email : *\[Email\]*

Médecin du Travail référent : *\[Nom\]*

**Article D4711-1 du Code du Travail**

**3**️⃣ **AFFICHAGE : Numéros d'Urgence**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**AFFICHAGE OBLIGATOIRE -- NUMÉROS D'URGENCE**

Urgences : **112**\
SAMU : **15**\
Pompiers : **18**\
Police secours : **17**\
Violences femmes : **3919**\
Numéro anti-harcèlement : **3020**\
Enfance en danger : **119**

**Adresse de l'établissement :**\
*\[Adresse complète\]*

**Consignes en cas d'urgence :**

Prévenir immédiatement un responsable

Appeler les secours

Expliquer clairement la situation

Évacuer si nécessaire

**4**️⃣ **AFFICHAGE : Interdiction de Fumer / Vapoter**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**INTERDICTION DE FUMER & VAPOTER**

Conformément au **Décret n°2006-1386**,\
il est **strictement interdit de fumer ou vapoter** dans tous les locaux
fermés et couverts affectés au travail.

L'infraction expose à :

68 € d'amende pour le salarié

1500 € d'amende pour l\'employeur

**5**️⃣ **AFFICHAGE : Harcèlement moral & sexuel**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**INFORMATION OBLIGATOIRE -- HARCÈLEMENT MORAL & SEXUEL**

**Harcèlement moral :**\
Aucun salarié ne doit subir des agissements répétés ayant pour effet une
dégradation de ses conditions de travail.\
(Article L1152-1)

**Harcèlement sexuel :**\
Aucun salarié ne doit subir des propos ou comportements à connotation
sexuelle répétés.\
(Article L1153-1)

**Contacts utiles :**

Défenseur des droits : 09 69 39 00 00

Inspection du travail

Police / gendarmerie

**6**️⃣ **AFFICHAGE : Égalité Professionnelle Femme/Homme**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**ÉGALITÉ PROFESSIONNELLE -- INFORMATIONS OBLIGATOIRES**

L'employeur doit garantir l'égalité salariale entre les femmes et les
hommes au sein de l'entreprise.\
(Article L3221-2 du Code du Travail)

Toute discrimination est interdite.

**7**️⃣ **AFFICHAGE : Consignes Sécurité Incendie**

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**CONSINGES DE SÉCURITÉ -- INCENDIE**

Donner l'alerte

Évacuer calmement

Ne pas utiliser les ascenseurs

Rejoindre le point de rassemblement

Appeler les pompiers (18 ou 112)

Utiliser les extincteurs uniquement si formé

**Point de rassemblement :**\
*\[À compléter\]*

**8**️⃣ **AFFICHAGE : Horaire de Travail (TPE)**

*(Optionnel mais fortement recommandé)*

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
**HORAIRES DE TRAVAIL -- ENTREPRISE TPE**

Horaires d'ouverture :

Lundi--Vendredi : *\[Horaires\]*

Pause déjeuner : *\[Horaires\]*

Dérogations / pauses : *\[Si applicable\]*

**BLOC: AFFICHE OBLIGATOIRE + CLASSEUR + LOGIQUE DE GÉNÉRATION**

**BLOC -- PACK INCP OFFICIEL**

**BLOC : STRUCTURE DOCUMENTAIRE ICPP**

**1**️⃣ **Créer une table : documents_type_icpp**

Champs :

id (auto)

nom (texte)

categorie (sélection) : affichage_mur / classeur / bonus / duerp

contenu_modele (long text)

obligatoire (bool)

**2**️⃣ **Créer une table : documents_client**

Champs :

id (auto)

client_id (relation clients)

type_id (relation documents_type_incp)

date_generation (datetime)

url_pdf (file or url)

etat (statut) : actif / remplacé

**3**️⃣ **Ajouter les types de documents ICPP dans documents_type_icpp :**

**Catégorie : affichage_mur**

Inspection du travail

Médecine du travail

Interdiction de fumer / vapoter

Numéros d'urgence

Harcèlement / discrimination

Égalité professionnelle

Consignes incendie

Horaires de travail

**Catégorie : classeur**

Registre du personnel

Registre accidents bénins

Liste salariés par unité de travail

Fiche entrée salarié

Fiche sortie salarié

Analyse AT

Procédures internes

**Catégorie : duerp**

DUERP complet entreprise

**Catégorie : bonus**

Check-list affichages obligatoires

Check-list contrôle DREETS

Guide conformité 2025

**4**️⃣ **Logique de génération (actions automatiques)**

Créer un workflow :

**Trigger : Audit validé + Contrat signé + Paiement validé**

Actions :

1.  Générer le DUERP (à partir du modèle "DUERP complet entreprise")

2.  Générer les affichages obligatoires (7 PDF) ( si on peu les regroupé
    en 3 pages c'est bien)

3.  Générer les documents classeur obligatoires

4.  Stocker chaque PDF dans documents_client

5.  Activer module "Espace client"

6.  Envoyer email "Pack conformité ICPP prêt"

**5**️⃣ **Logique de mise à jour automatisée**

Créer un workflow :

**Trigger 1 : modification entreprise (adresse / horaires / nombre de
salariés)**

Actions :

-   régénérer DUERP

-   régénérer affichages impactés

-   archivage version précédente

-   envoyer email "Mise à jour conformité ICPP effectuée"

**Trigger 2 : ajout salarié**

Actions :

-   mettre à jour registre personnel

-   mettre à jour DUERP

**6**️⃣ **Interface Espace Client**

Créer des vues filtrées :

-   Vue DUERP → type = duerp

-   Vue Affichages mur → type = affichage_mur

-   Vue Classeur → type = classeur

-   Vue Bonus → type = bonus

📦 **BLOC 7 -- STRIPE & PAIEMENTS (À COLLER DANS**

Tu dois maintenant configurer **la gestion des paiements avec Stripe**
pour l'application :

ICPP -- Institut de Conformité et de Prévention Professionnelle

Objectifs de ce bloc :

Créer le **workflow complet de paiement** :

1.  CGV acceptées ✅

2.  Contrat signé ✅

3.  Création client Stripe ✅

4.  Facturation **frais de mise en place (49 €)** ✅

5.  Création de l'abonnement mensuel (39 € Pro) ✅

    Gérer les **statuts d'abonnement** dans la base

    Bloquer / restreindre l'accès en cas d'impayé

    Permettre ponctuellement un **mois offert / remise** (via champ
    booléen ou promo)

**1**️⃣ **PARAMÈTRES STRIPE**

Créer une section de configuration Stripe, avec :

-   STRIPE_SECRET_KEY

-   STRIPE_WEBHOOK_SECRET

-   STRIPE_PRICE_PLAN_PRO (prix mensuel 39€)

-   STRIPE_SETUP_FEE_PRODUCT (frais de mise en place 49€)

Ces valeurs seront renseignées manuellement dans l'interface d'admin ou
dans un fichier de configuration.

**2**️⃣ **TABLES À UTILISER / COMPLÉTER**

Réutiliser les tables déjà définies dans les blocs précédents :

**a) Table Entreprises**

Champs déjà présents (rappel important) :

-   stripe_customer_id (string, nullable)

-   abonnement_statut (enum) : actif / en_retard / suspendu / resilie

-   abonnement_type : mensuel / annuel / autre

-   abonnement_date_debut (datetime)

-   abonnement_date_fin (datetime)

Ajouter les champs suivants si pas encore créés :

-   plan_code (string) -- ex : \"pro_39\"

-   setup_fee_payee (bool) -- true si les 49 € ont été payés

-   promo_mois_offert (bool, par défaut false) -- utilisé si l'admin
    accorde un mois offert.

**b) Table Paiements (ou Payments_INCP)**

Si déjà créée, utiliser la même. Sinon créer :

-   id

-   entreprise_id (FK → Entreprises.id)

-   stripe_payment_id (string, nullable)

-   stripe_subscription_id (string, nullable)

-   montant (decimal)

-   devise (string, ex \"EUR\")

-   type_paiement (enum) : setup_fee / abonnement_mensuel /
    abonnement_annuel / autre

-   statut_paiement (enum) : payé / échoué / en_attente

-   date_paiement (datetime)

-   commentaire (texte libre)

**3**️⃣ **WORKFLOW : ACTIVATION D'UN CLIENT (ÉTAPES OBLIGATOIRES)**

Le workflow standard d'activation doit respecter l'ordre suivant :

✅ CGV acceptées (table CGV_Acceptation → enregistrement avec accepte =
true)

✅ Contrat signé (table Contrats_Client → etat = \"Signé\")

✅ Paiement frais de mise en place (49€)

✅ Abonnement mensuel actif (39€ / mois, plan Pro)

💡 **Règle :**

Tant que les CGV ne sont pas acceptées → aucun paiement possible\
Tant que le contrat n'est pas signé → aucun paiement possible\
Tant que le setup fee n'est pas payé → abonnement non actif

**4**️⃣ **ACTION : creer_client_stripe(entreprise_id)**

Créer une action serveur :

**Objectif :**

Créer automatiquement un customer Stripe pour l'entreprise

Lier stripe_customer_id à Entreprises.stripe_customer_id

**Logique :**

Lire les données dans Entreprises : nom_entreprise, email_contact,
adresse, etc.

Appeler l'API Stripe pour créer un customer.

Enregistrer l'id du customer Stripe dans Entreprises.stripe_customer_id.

Si un stripe_customer_id existe déjà → ne pas recréer, retourner
l'existant.

**5**️⃣ **ACTION V0 : facturer_frais_mise_en_place(entreprise_id)**

Objectif : **facturer les 49 € HT une seule fois**.

Conditions préalables :

-   CGV_Acceptation existe pour entreprise_id ET accepte = true

-   Contrats_Client → etat = \"Signé\"

Logique :

1.  Vérifier si setup_fee_payee = true

    -   Si oui → ne rien faire (déjà facturé).

2.  Sinon :

    -   Créer un PaymentIntent ou Invoice Stripe d'un montant de 49 €

    -   À la confirmation de paiement :

        -   Créer une ligne dans Paiements avec :

            -   type_paiement = \"setup_fee\"

            -   statut_paiement = \"payé\"

            -   montant = 49

        -   Mettre à jour setup_fee_payee = true

    -   En cas d'échec :

        -   statut_paiement = \"échoué\"

**6**️⃣ **ACTION V0 : creer_abonnement_pro(entreprise_id)**

Objectif : **créer l'abonnement mensuel standard Pro (39€/mois)**.

Conditions préalables :

-   setup_fee_payee = true

-   Contrats_Client.etat = \"Signé\"

-   CGV_Acceptation.accepte = true

Logique :

1.  Si stripe_customer_id est vide → appeler
    creer_client_stripe(entreprise_id)

```{=html}
<!-- -->
```
3.  Vérifier si promo_mois_offert = true :

    -   Si oui → créer un abonnement Stripe avec un **trial_period_days
        = 30** (ou équivalent)

    -   Si non → abonnement directement payant dès le premier jour.

4.  Utiliser STRIPE_PRICE_PLAN_PRO comme référence du plan.

5.  À la création de l'abonnement :

    -   Stocker stripe_subscription_id dans Paiements ou dans
        l'entreprise.

    -   Mettre à jour l'entreprise :

        -   abonnement_statut = \"actif\"

        -   abonnement_type = \"mensuel\"

        -   abonnement_date_debut = now

```{=html}
<!-- -->
```
5.  En cas d'erreur Stripe → ne pas activer, renvoyer un message
    d'échec.

**7**️⃣ **GESTION DES WEBHOOKS STRIPE**

Configurer les webhooks Stripe pour recevoir :

-   invoice.payment_succeeded

-   invoice.payment_failed

-   customer.subscription.deleted

-   customer.subscription.updated

Créer une action serveur traiter_webhook_stripe(payload) avec la logique
suivante :

**a) invoice.payment_succeeded**

-   Identifier l'entreprise (entreprise_id) via customer_id ou
    subscription_id

-   Créer une entrée dans Paiements :

    -   type_paiement = abonnement_mensuel

    -   statut_paiement = \"payé\"

-   Mettre à jour abonnement_statut = \"actif\"

**b) invoice.payment_failed**

-   Créer une entrée dans Paiements :

    -   statut_paiement = \"échoué\"

-   Passer l'entreprise en abonnement_statut = \"en_retard\"

**c) En cas d'impayés prolongés :**

Tu peux implémenter la logique CGV suivante, sous forme de **job
planifié** (tâche CRON interne) :

-   J+0 (échec) : statut en_retard → envoi email automatique de rappel

-   J+7 : si toujours en retard → abonnement_statut = \"suspendu\"

    -   L'espace client passe en mode **lecture seule**

    -   Impossible de générer un nouveau DUERP

-   J+14 : services suspendus (aucune nouvelle action)

-   J+30 : abonnement_statut = \"resilie\"

    -   Rupture du contrat (comme prévu dans les CGV)

**8**️⃣ **RÈGLES D'ACCÈS DANS L'APPLICATION (LIÉES AU STATUT
D'ABONNEMENT)**

-   Si abonnement_statut = \"actif\"\
    → accès complet (audit, génération DUERP, affichages, espace client
    complet)

-   Si abonnement_statut = \"en_retard\"\
    → accès **limité**, mais DUERP **consultable** (pas de blocage
    brutal)

-   Si abonnement_statut = \"suspendu\"\
    → accès **lecture seule** :

    -   DUERP consultable

    -   plus de mises à jour

    -   plus d'actions d'audit

-   Si abonnement_statut = \"resilie\"\
    → accès **très restreint** :

    -   éventuellement accès aux documents historiques

    -   pas de nouveaux services

**9**️⃣ **INTÉGRATION DANS L'INTERFACE (RÉSUMÉ)**

Dans l'interface auditeur ou admin, ajouter :

-   Bouton : **"Lancer le paiement de mise en place (49 €)"**\
    → appelle facturer_frais_mise_en_place(entreprise_id)

-   Bouton : **"Activer l'abonnement Pro (39 €/mois)"**\
    → appelle creer_abonnement_pro(entreprise_id)

-   Case à cocher admin :

    -   promo_mois_offert → si cochée, crée un abonnement avec période
        d'essai.

Dans l'espace client :

-   Bloc "Mon abonnement" :

    -   Plan : Pro 39€/mois

    -   Statut affiché avec couleur (vert/orange/rouge)

    -   Date début / prochaine échéance

    -   Message si en_retard ou suspendu.

📦 **BLOC 7 --- MODULE DATA & STATISTIQUES ICPP + RAPPORTS + COURRIERS**

Tu dois maintenant créer le **module Data & Statistiques ICPP** pour
l'application :

ICPP -- Institut de Conformité et de Prévention Professionnelle

Ce module doit permettre :

d'enregistrer automatiquement les données issues des audits & DUERP

d'analyser la conformité par secteur / zone / taille d'entreprise

de générer des rapports sectoriels automatiques (PDF)

de générer des **courriers officiels** à destination des organismes
(DEETS, Médecine du Travail, CGSS/CPAM, CMA, CCI, INSEE)

de gérer des **exports anonymisés payants** (modèle économique)

**1**️⃣ **STRUCTURE BASE DE DONNÉES -- MODULE DATA**

**1.1 Table : Audit_Stats_ICPP**

Créer une table pour stocker les données **par DUERP / audit** :

**Nom table** : Audit_Stats_ICPP

**Champs :**

-   id

-   entreprise_id (FK → Entreprises)

-   audit_id (FK → Audits)

-   duerp_version_id (FK → DUERP_versions)

-   secteur_activite (string) → ex : "Coiffure / Barbier", "Snack /
    Restauration rapide"...

-   code_ape (string)

-   commune (string)

-   code_postal (string)

-   effectif_total (int)

-   type_etablissement (enum : \"Micro\", \"TPE\", \"PME\")

-   date_audit (datetime)

**Conformité globale :**

-   statut_conformite (enum : \"Conforme\", \"Partiellement conforme\",
    \"Non conforme\")

-   score_conformite (int, 0--100)

**Synthèse risques (par catégorie) :**

-   nb_risques_physiques (int)

-   nb_risques_chimiques (int)

-   nb_risques_rps (int)

-   nb_risques_organisationnels (int)

-   nb_risques_incendie_locaux (int)

**Cotations :**

-   nb_risques_prioritaires_P_eleve (int) → P = F×G au-dessus d'un seuil
    (ex : ≥ 12)

-   top_risques_principaux (texte court) → concat liste des 3 risques
    principaux

**Actions :**

-   nb_actions_correction_immediate (int)

-   nb_actions_correction_moyen_terme (int)

-   nb_actions_correction_long_terme (int)

**1.2 Table : Stats_Secteur_Zone**

Table d'agrégats **par secteur + zone géographique**.

**Nom table** : Stats_Secteur_Zone

**Champs :**

-   id

-   secteur_activite (string)

-   commune (string)

-   periode (string) → ex : \"2025-01\", \"2025-T1\", \"2025-ANNUEL\"

-   nb_entreprises_auditees (int)

-   nb_salaries_couverts (int)

-   taux_conformes (float, %)

-   taux_non_conformes (float, %)

-   taux_partiellement_conformes (float, %)

-   top5_risques_frequents (texte)

-   top5_risques_graves (texte)

-   date_maj (datetime)

Cette table est mise à jour automatiquement à partir de
Audit_Stats_ICPP.

**1.3 Table : Rapports_Sectoriels_ICPP**

Table pour les **rapports sectoriels PDF**.

**Nom table** : Rapports_Sectoriels_ICPP

**Champs :**

-   id

-   secteur_activite

-   commune

-   periode (mois / trimestre / année)

-   type_rapport (enum : \"Mensuel\", \"Trimestriel\", \"Annuel\")

-   date_generation

-   url_pdf (string)

-   resume (texte court)

-   nb_entreprises (int)

-   nb_salaries (int)

-   taux_conformes (float)

-   taux_non_conformes (float)

-   taux_partiellement_conformes (float)

-   etat (enum : \"Actif\", \"Archivé\")

**1.4 Table : Courriers_Modele_ICPP**

Table pour **stocker les modèles de courriers**.

**Nom table** : Courriers_Modele_ICPP

**Champs :**

-   id

-   type_organisme (enum : \"DEETS\", \"MEDECINE_TRAVAIL\",
    \"CGSS_CPAM\", \"CMA\", \"CCI\", \"INSEE\")

-   titre_modele (string)\
    ex : \"Courrier DEETS -- Synthèse sectorielle\"

-   objet_modele (texte)\
    ex : \"Transmission de données sectorielles -- Conformité DUERP --
    \[Commune / Secteur\]\"

-   corps_modele (long text)\
    → **contient le texte fourni dans ta demande, avec variables :**\
    \[Commune\], \[Secteur\], \[X\], \[X%\], \[Risques 1, 2, 3\], etc.

-   actif (bool)

Les textes que tu as donnés (DEETS, Médecine du travail, CGSS, CMA, CCI,
INSEE) doivent être recopiés dans corps_modele avec des **placeholders**
pour les données dynamiques.

**1.5 Table : Courriers_Generes_ICPP**

Table pour chaque courrier généré automatiquement.

**Nom table** : Courriers_Generes_ICPP

**Champs :**

-   id

-   courrier_modele_id (FK → Courriers_Modele_ICPP)

-   type_organisme

-   secteur_activite

-   commune

-   periode

-   date_generation

-   donnees_utilisees (JSON)\
    → stocker les valeurs injectées dans le texte (X, %, risques, etc.)

-   contenu_final (long text)\
    → version prête à imprimer (avec les champs remplis)

-   url_pdf (optionnel si tu génères un PDF)

-   etat (enum : \"Brouillon\", \"Validé\", \"Envoyé\")

**1.6 Table : Exports_Data_ICPP**

Pour la partie **modèle économique / vente de data**.

**Nom table** : Exports_Data_ICPP

**Champs :**

-   id

-   type_export (enum : \"Anonymise\", \"Nominatif\")

-   destinataire_type (enum : \"INSEE\", \"Institut_etudes\",
    \"Assureur\", \"CMA\", \"CCI\", \"DEETS\", \"Autre\")

-   description (texte)

-   periode (string)

-   date_generation

-   fichier_url (string)

-   payant (bool)

-   montant (decimal)

-   etat (enum : \"Brouillon\", \"Disponible\", \"Envoyé\")

**2**️⃣ **PAGE "ICPP DATA" -- TABLEAU DE BORD STATISTIQUES**

Créer une page réservée **Admin ICPP** :

**Nom page** : ICPP Data & Statistiques

Elle doit afficher :

**2.1 Bloc "Vue globale France / Réunion"**

Nombre total d'entreprises auditées

Nombre total de salariés couverts

\% conformes / non conformes / partiels

Nombre total de DUERP générés

Histogramme : conformes / non conformes / partiels

Courbe : évolution mensuelle du taux de conformité

Source : agrégation de Audit_Stats_ICPP.

**2.2 Bloc "Par secteur d'activité"**

Filtre : secteur_activite

Pour le secteur sélectionné :

nb_entreprises_auditees (Stats_Secteur_Zone)

taux_conformes, taux_non_conformes, taux_partiellement_conformes

Top 5 risques fréquents (texte ou liste)

Top 5 risques graves (texte ou liste)

Graphique camembert : répartition Physiques / Chimiques / RPS /
Organisationnels / Incendie

Temps moyen de mise en conformité (si tu as ce champ dans Audits /
Actions)

**2.3 Bloc "Par zone géographique"**

Filtre : commune + option code_postal

\% conformes / non conformes

Secteurs les plus en retard

Risques typiques de la zone

Carte simple (si possible) ou tableau par commune

**2.4 Bloc "Exports"**

Boutons :

"Exporter données anonymisées (.CSV)"\
→ basé sur Audit_Stats_ICPP sans entreprise_id ni identifiants

"Exporter données nominatives (usage interne ICPP uniquement)"\
→ protégé, réservé admin

Chaque export doit créer une entrée dans Exports_Data_ICPP.

**3**️⃣ **WORKFLOWS AUTOMATIQUES -- ALIMENTATION DES STATS**

**3.1 Trigger : à chaque DUERP finalisé**

**Déclencheur :** lorsqu'un DUERP est généré et son statut = \"A jour\".

Actions :

Lire :

Entreprise (secteur, commune, effectif)

Audit lié (score, statut, risques par catégories, actions proposées)

Créer ou mettre à jour une ligne dans Audit_Stats_ICPP :

Renseigner secteur, commune, effectif

Calculer statut_conformite + score

Compter nombre de risques par catégorie

Identifier les 3 risques principaux (P élevés)

Renseigner les champs nb_actions...

Mettre à jour les agrégats dans Stats_Secteur_Zone pour :

secteur = métier de l'entreprise

commune = commune de l'entreprise

période = mois / trimestre / année courante

**3.2 Batch mensuel (tâche planifiée)**

Tous les mois :

-   recalculer/raffraîchir Stats_Secteur_Zone

-   générer automatiquement des entrées dans Rapports_Sectoriels_INCP

-   générer des courriers brouillons dans Courriers_Generes_INCP pour :

    -   DEETS

    -   Médecine du travail

    -   CGSS

    -   CMA / CCI

    -   INSEE (data anonymisée)

**4**️⃣ **GÉNÉRATION AUTOMATIQUE DES RAPPORTS SECTORIELS (PDF)**

Créer une **action serveur** :

**Nom action** : generer_rapport_sectoriel(secteur, commune, periode)

Étapes :

Lire les données dans Stats_Secteur_Zone pour (secteur, commune,
période).

Calculer :

nb_entreprises, nb_salaries

répartitions (% conformes / non conformes / partiels)

top risques fréquents / graves

Générer un PDF structuré **selon le modèle fourni** dans ta demande :

Page de garde (secteur, zone, période)

Sommaire

Volume d'audits

Niveau global de conformité

Top 5 risques fréquents

Top 5 risques graves

Recommandations ICPP

Graphiques (histogrammes, camembert)

Synthèse + annexes (si possible)

Sauvegarder le PDF (URL) dans Rapports_Sectoriels_ICPP.

Mettre l'état = \"Actif\".

Un bouton **"Générer rapport sectoriel"** doit être disponible dans la
page "ICPP Data".

**5**️⃣ **COURRIERS AUTOMATIQUES AUX ORGANISMES**

**5.1 Modèles (Courriers_Modele_ICPP)**

Pour chaque type :

DEETS

Médecine du travail

CGSS/CPAM

CMA

CCI

INSEE

Enregistrer dans Courriers_Modele_ICPP.corps_modele les textes que tu as
écrits, en remplaçant les éléments variables par des **tags** :

\[Date\]

\[Commune\]

\[Secteur\]

\[X\]

\[X%\]

\[Risques 1, 2, 3\]

etc.

**5.2 Action : generer_courrier_organisme(type_organisme, secteur,
commune, periode)**

Étapes :

Lire les stats dans Stats_Secteur_Zone pour secteur + commune + période.

Charger le modèle dans Courriers_Modele_ICPP pour type_organisme.

Remplacer automatiquement les tags dans corps_modele avec les valeurs
réelles.

Créer une entrée dans Courriers_Generes_ICPP :

type_organisme

secteur, commune, période

donnees_utilisees (JSON)

contenu_final (texte complet)

éventuellement générer un PDF et remplir url_pdf.

Option :

État = \"Brouillon\" → vérification humaine

Puis basculer à \"Validé\" / \"Envoyé\"

**6**️⃣ **AUTOMATISATION (MENSUEL / TRIMESTRIEL)**

**6.1 Tâche mensuelle**

Pour chaque **secteur x commune** où il y a assez d'audits :

-   generer_rapport_sectoriel(secteur, commune, periode_mois)

-   generer_courrier_organisme(\"DEETS\"\...)

-   generer_courrier_organisme(\"MEDECINE_TRAVAIL\"\...)

-   generer_courrier_organisme(\"CGSS_CPAM\"\...)

-   generer_courrier_organisme(\"CMA\"\...)

-   generer_courrier_organisme(\"CCI\"\...)

-   generer_courrier_organisme(\"INSEE\"\...) → **version anonymisée**

**6.2 Tâche trimestrielle**

Créer un **rapport consolidé** type :

"La Réunion -- État de conformité des TPE -- \[Trimestre / Année\]"

en agrégeant toutes les Stats_Secteur_Zone de la Réunion.

**7**️⃣ **MODÈLE ÉCONOMIQUE -- EXPORT DATA**

Le module doit permettre :

-   Export anonymisé payant (type \"Anonymise\") :

    -   pour INSEE, instituts d'étude, assureurs, CMA, CCI

    -   via Exports_Data_ICPP avec payant = true et montant défini

-   Export nominatif (type \"Nominatif\") :

    -   réservé aux organismes habilités (DEETS, Médecine du travail,
        CGSS)

    -   **uniquement si l'entreprise a donné son consentement**

    -   marquer dans Entreprises : consentement_partage_donnees = bool

Workflows :

Quand un export est généré → créer une entrée Exports_Data_ICPP.

Si payant = true → relier au module Stripe / facturation.

**Tu va maintenant réaliser un bloc :**

**Le module Data & Statistiques ICPP**

**Le module de génération automatique de rapports sectoriels**

**Le module de génération automatique de courriers pour les organismes**
(DEETS, Médecine du travail, CGSS/CPAM, CMA, CCI, INSEE)

🎯 **OBJECTIF DU MODULE**

Créer dans le SaaS ICPP un système automatique de **collecte, analyse et
génération de données statistiques** issues des audits et des DUERP
réalisés par les auditeurs terrain.\
Ces données doivent permettre :

-   d'analyser les niveaux de conformité par secteur d'activité, zone
    géographique et taille d'entreprise

-   d'extraire les risques les plus fréquents par métier

-   de générer automatiquement des rapports destinés aux organismes
    publics

-   de générer automatiquement des courriers à envoyer à :

    -   Direction du Travail (DEETS)

    -   Médecine du Travail

    -   Sécurité Sociale / CGSS

    -   Chambre des métiers (CMA)

    -   Chambre du commerce (CCI)

    -   INSEE (export Data anonymisée)

**FONCTIONNALITÉ 1 : COLLECTE AUTOMATISÉE DES DONNÉES**

Le système doit enregistrer automatiquement :

🔹 **Informations générales**

-   Secteur d'activité (NAF/APE)

-   Localisation (commune + code postal)

-   Nombre de salariés

-   Type d'établissement (TPE, PME)

🔹 **Niveau de conformité**

Enregistrer si l'entreprise est :

-   **Conforme**

-   **Non conforme**

-   **Partiellement conforme**

🔹 **Typologie des risques détectés**

Pour chaque unité de travail :

-   Risques physiques

-   Risques chimiques

-   Risques RPS

-   Risques organisationnels

-   Risques liés aux équipements

-   Risques environnementaux

-   Cotations (Fréquence x Gravité)

-   Risques récurrents à forte prévalence

🔹 **Actions correctives recommandées**

-   Type de correction nécessaire

-   Urgence : faible / moyenne / élevée

-   Taux de mise en conformité prévu

**FONCTIONNALITÉ 2 : TABLEAU DE BORD STATISTIQUES**

Créer une page "**ICPP Data**" contenant :

🔵 **Statistiques globales**

-   \% d'entreprises conformes / non conformes

-   Moyenne des risques par secteur

-   Nombre d'audits réalisés (par jour / semaine / mois)

**Statistiques par secteur (coiffure, restauration, BTP, etc.)**

Affichage automatique :

-   \% d'entreprises à jour DUERP

-   Risques les plus fréquents

-   Risques les plus graves

-   Actions correctives les plus demandées

-   Temps moyen de mise en conformité

**Statistiques par zone géographique (ex : Saint-Pierre, Saint-Denis, Le
Port...)**

-   \% conformes / non conformes

-   Secteurs les plus en retard

-   Risques typiques de la zone

**Export automatique**

Export CSV/Excel :

-   Data anonymisée

-   Données par entreprise (pour usage interne)

-   Données macro (pour organismes publics)

**FONCTIONNALITÉ 3 : RAPPORT SECTORIEL AUTOMATIQUE (PDF)**

Le SaaS doit générer automatiquement un rapport PDF contenant :

✔ **Sommaire automatique**

✔ **Analyse globale du secteur**

✔ **Pourcentage de conformité**

✔ **Top 5 des risques les plus fréquents**

✔ **Top 5 des risques les plus graves**

✔ **Recommandations ICPP**

✔ **Graphiques automatiques :**

-   Histogrammes

-   Courbes

-   Camemberts

✔ **Exemple :**

"Sur 12 salons de coiffure audités à Saint-Pierre, 18% étaient
conformes, 82% non conformes.\
Les risques les plus fréquents sont : postures prolongées, risques
chimiques, glissades, coupures."

Le rapport doit être **PDF + prêt à télécharger + version pour
impression papier**.

**FONCTIONNALITÉ 4 : COURRIERS AUTOMATIQUES AUX ORGANISMES**

Le SaaS doit générer des courriers institutionnels **prêts à imprimer**,
dans un style administratif INCP.

⚠️ **Les données doivent être anonymisées par défaut.**

Sauf si l'entreprise donne une autorisation explicite.

📩 **Courriers automatiques :**

**1. Direction du Travail (DEETS)**

Objet : *Synthèse sectorielle -- Conformité DUERP -- Commune X*

Contenu généré automatiquement :

-   Nombre d'établissements contrôlés

-   \% conformes / non conformes

-   Risques majeurs du secteur

-   Besoin d'interventions ciblées

**2. Médecine du Travail**

Objet : *Analyse des risques professionnels du secteur X*

-   Focus sur risques ergonomiques, RPS, chimiques

-   Indicateurs santé au travail

-   Suggestions de campagnes de prévention

**3. Sécurité Sociale / CGSS**

Objet : *Statistiques de prévention -- Risques d'accidents du travail*

-   Risques générant des AT potentiels

-   Recommandations ICPP pour réduire les cotisations AT/MP

**4. CMA / CCI**

Objet : *Niveau de conformité des TPE du secteur X*

-   Informations macro (jamais nominatives)

**5. INSEE**

Objet : *Transmission de jeux de données statistiques (anonymisées)*

**FONCTIONNALITÉ 5 : AUTOMATISATION & RÈGLES DE DÉCLENCHEMENT**

Le SaaS doit déclencher automatiquement :

📌 **À chaque DUERP finalisé :**

→ Mise à jour des statistiques ICPP Data\
→ Enregistrement des risques\
→ Mise à jour des graphiques

📌 **Chaque fin de mois :**

→ Génération automatique des rapports sectoriels\
→ Génération des courriers institutionnels\
→ Export automatique vers tableau INSEE interne

📌 **Chaque trimestre :**

→ Rapport trimestriel consolidé\
→ Synthèse régionale "La Réunion -- état de conformité des TPE"

**FONCTIONNALITÉ 7 : MODÈLE ÉCONOMIQUE**

Le SaaS doit fournir :

✔ **Export anonymisé payant pour :**

-   INSEE

-   Instituts d'études

-   Assureurs

-   Chambres consulaires

✔ **Export nominatif réservé aux organismes habilités (DEETS, médecin du
travail)**

et **uniquement avec consentement de l'entreprise**.

Voici **les modèles de courriers officiels ICPP**, déjà rédigés dans un
**style administratif**, prêts à imprimer ou à intégrer dans ton SaaS
pour génération automatique.

Ils respectent :

-   Le ton institutionnel

-   La formulation administrative

-   La présentation d'un organisme de contrôle / conformité

-   Ton positionnement ICPP

Chaque courrier est prévu pour être **personnalisé automatiquement**
selon :\
✔ la commune\
✔ le secteur d'activité\
✔ le nombre d'entreprises auditées\
✔ le taux de conformité\
✔ les risques observés\
✔ la date\
✔ les informations de ton auditeur

**1**️⃣ **COURRIER : Direction du Travail (DEETS)**

**Objet : Transmission de données sectorielles -- Conformité DUERP --
\[Commune / Secteur\]**

**\[Date\]**

**À l'attention de la DEETS -- Direction de l'Économie, de l'Emploi, du
Travail et des Solidarités**\
**\[Adresse DEETS\]**

Madame, Monsieur,

Dans le cadre de nos missions d'accompagnement à la mise en conformité
des entreprises sur le territoire, l'ICPP -- Institut National de
Conformité Professionnelle a réalisé une série d'audits auprès
d'établissements situés dans la commune de **\[Commune\]**, appartenant
au secteur d'activité **\[Secteur : Coiffure / BTP / Restauration /
Commerce / etc.\]**.

Les données recueillies dans le cadre de l'évaluation du DUERP et des
obligations de prévention font apparaître les éléments suivants :

-   **Nombre d'entreprises auditées : \[X\]**

-   **Taux d'entreprises conformes : \[X%\]**

-   **Taux d'entreprises non conformes : \[X%\]**

-   **Risques les plus fréquemment identifiés : \[Risques 1, 2, 3\]**

-   **Risques présentant la gravité la plus élevée : \[Risques
    majeurs\]**

Ces résultats indiquent un besoin accru de sensibilisation et
d'accompagnement des entreprises du secteur, notamment concernant :\
--- la mise à jour annuelle du DUERP ;\
--- l'identification correcte des risques professionnels ;\
--- la formalisation du plan d'actions de prévention.

Nous restons à votre disposition pour toute information complémentaire
ou pour organiser, si nécessaire, une réunion de travail sur ces
constats.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations
distinguées.

**ICPP -- Institut de Conformité et de Prévention Professionnelle**\
\[Nom de l'auditeur / responsable\]\
\[Email\] -- \[Téléphone\]

**2**️⃣ **COURRIER : Médecine du Travail**

**Objet : Transmission d'indicateurs de risques professionnels --
\[Secteur / Commune\]**

**\[Date\]**

**À l'attention de : \[Nom du service de Santé au Travail\]**\
**\[Adresse\]**

Madame, Monsieur,

Dans le cadre de nos actions de prévention et d'évaluation des risques
professionnels, nous avons réalisé plusieurs audits auprès d'entreprises
du secteur **\[Secteur\]** situées à **\[Commune\]**.

Les données recueillies mettent en évidence les points suivants :

-   **Nombre d'entreprises auditées : \[X\]**

-   **Taux d'entreprises disposant d'un DUERP à jour : \[X%\]**

-   **Principaux risques identifiés : \[Liste\]**

-   **Risques ergonomiques / TMS observés : \[Détail\]**

-   **Risques psychosociaux (RPS) : \[Détail si applicable\]**

Ces observations rejoignent des problématiques déjà connues dans le
secteur, notamment concernant les postures prolongées, l'organisation du
travail ou l'exposition à certains agents (chimiques, bruit, chaleur,
etc.).

Nous sommes disponibles pour échanger avec votre service sur
d'éventuelles actions collectives de prévention ou campagnes ciblées
destinées aux entreprises concernées.

Veuillez recevoir, Madame, Monsieur, nos salutations distinguées.

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

**3**️⃣ **COURRIER : Sécurité Sociale / CGSS -- Risques AT/MP**

**Objet : Indicateurs de risques liés aux Accidents du Travail --
\[Secteur\]**

**\[Date\]**

**À l'attention de : CGSS / CPAM -- Service Prévention AT/MP**\
**\[Adresse\]**

Madame, Monsieur,

L'ICPP a procédé à une série d'audits dans le secteur **\[Secteur\]**,
zone **\[Commune\]**, portant sur la conformité DUERP et l'exposition
des salariés aux risques professionnels.

Les données issues de ces audits sont les suivantes :

-   **Entreprises auditées : \[X\]**

-   **Entreprises non conformes aux obligations DUERP : \[X%\]**

-   **Risques observés pouvant entraîner des AT/MP :**

    -   \[Liste des risques\]

    -   \[Éléments de gravité\]

Nous attirons votre attention sur plusieurs risques critiques pouvant
potentiellement générer des accidents du travail ou maladies
professionnelles, tels que :\
--- glissades / chutes de plain-pied ;\
--- exposition à des produits chimiques ;\
--- manutentions répétitives ;\
--- absence de formations obligatoires.

Nous restons disponibles pour collaborer sur des programmes de
prévention ciblés ou des actions de sensibilisation.

Veuillez agréer, Madame, Monsieur, nos salutations distinguées.

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

**4**️⃣ **COURRIER : Chambre des Métiers (CMA)**

**Objet : État de conformité des entreprises artisanales -- \[Commune /
Secteur\]**

**\[Date\]**

Madame, Monsieur,

L'ICPP a audité plusieurs établissements artisanaux dans le secteur
**\[Secteur\]**, situés sur la commune de **\[Commune\]**.

Les constats suivants ont été relevés :

-   **Nombre d'ateliers / commerces audités : \[X\]**

-   **Taux de conformité DUERP : \[X%\]**

-   **Principales lacunes observées : \[Liste\]**

-   **Risques les plus fréquents : \[Liste\]**

Ces résultats soulignent l'importance de renforcer la sensibilisation
des TPE artisanales à leurs obligations de prévention.

Nous restons à votre disposition pour mettre en place des actions
conjointes.

Cordialement,

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

**5**️⃣ **COURRIER : Chambre de Commerce (CCI)**

**Objet : Niveau de conformité des entreprises commerciales --
\[Commune\]**

Même structure que CMA, adapté aux commerces.

**6**️⃣ **COURRIER : INSEE -- transmission data anonymisée**

**Objet : Transmission de données statistiques anonymisées -- INCP**

**\[Date\]**

Madame, Monsieur,

Dans le cadre de nos missions de prévention et de suivi de la conformité
des entreprises, l'ICPP met à disposition un jeu de données anonymisées
concernant :

-   le taux de conformité DUERP,

-   la typologie des risques par secteur,

-   la répartition géographique,

-   les tendances observées.

Nous restons ouverts à des partenariats visant à améliorer la
connaissance statistique en matière de risques professionnels.

Respectueusement,

**ICPP -- Institut de Conformité et de Prévention Professionnelle**

📄 **Modèle PDF -- Rapport Sectoriel Automatique ICPP**

**PAGE DE GARDE**

**\[Logo ICPP\]**\
INCP CONFORMITÉ\
*Institut National de Conformité Professionnelle*

**RAPPORT SECTORIEL DE CONFORMITÉ**

**Secteur : \[Secteur d'activité\]**\
**Zone géographique : \[Commune / Région\]**\
**Période : \[Mois / Trimestre / Année\]**

**Document généré automatiquement par le système ICPP -- Version
\[V0/V1\]**

**PAGE 2 --- SOMMAIRE**

1.  Présentation du secteur audité

```{=html}
<!-- -->
```
7.  Volume d'audits réalisés

8.  Niveau global de conformité

9.  Analyse des risques professionnels

10. Risques prioritaires par gravité

11. Recommandations ICPP

12. Comparaison avec les normes de prévention

13. Synthèse et conclusion

14. Annexes (tableaux et graphiques)

**1. PRÉSENTATION DU SECTEUR AUDITÉ**

**Secteur : \[Nom du secteur\]**

**Commune / Zone : \[Lieu\]**

Ce rapport présente une analyse consolidée des audits réalisés dans les
entreprises du secteur **\[Secteur\]**, sur la zone de **\[Commune\]**,
durant la période **\[Mois/Année\]**.

Les données recueillies proviennent des évaluations officielles du
**Document Unique (DUERP)** et des obligations légales de prévention.

**2. VOLUME D'AUDITS RÉALISÉS**

-   Nombre total d'entreprises auditées : **\[X\]**

-   Nombre de salariés couverts : **\[X\]**

-   Taille moyenne des entreprises : **\[X salariés\]**

**Répartition des audits par type d'établissement :**

-   Micro-entreprises : \[X%\]

-   TPE (1 à 9 salariés) : \[X%\]

-   PME : \[X%\]

**3. NIVEAU GLOBAL DE CONFORMITÉ**

**Taux de conformité DUERP :**

-   Entreprises conformes : **\[X%\]**

-   Entreprises non conformes : **\[X%\]**

-   Entreprises partiellement conformes : **\[X%\]**

**Graphique automatique n°1 :**

Histogramme : Conformes / Non conformes / Partiellement conformes\
👉 Généré automatiquement par le SaaS

**Graphique automatique n°2 :**

Courbe d'évolution de la conformité sur 12 mois\
👉 Généré automatiquement si historique disponible

**4. ANALYSE DES RISQUES PROFESSIONNELS**

Les audits ont permis d'identifier les risques suivants :

**Top 5 des risques les plus fréquents :**

1.  \[Risque\] --- \[X% des entreprises\]

```{=html}
<!-- -->
```
15. \[Risque\] --- \[X%\]

16. \[Risque\] --- \[X%\]

17. \[Risque\] --- \[X%\]

18. \[Risque\] --- \[X%\]

**Top 5 des risques les plus graves (cotation F×G) :**

1.  \[Risque\] --- Cotation : \[X\]

```{=html}
<!-- -->
```
19. \[Risque\] --- Cotation : \[X\]

20. \[Risque\] --- Cotation : \[X\]

**Graphique automatique n°3 :**

Camembert -- Répartition des catégories de risques\
(Chimiques / Physiques / RPS / Organisationnels / Équipement / Hygiène,
etc.)

**5. RISQUES PRIORITAIRES À TRAITER**

Il ressort de l'analyse que les risques prioritaires du secteur sont :

**Risque prioritaire 1**

-   Description : \[Texte\]

-   Impact potentiel : \[Accidents / Arrêts / TMS / ATMP\]

-   Urgence : \[Faible / Moyenne / Élevée\]

**Risque prioritaire 2**

-   Description : \[Texte\]

-   Impact : \[Texte\]

-   Urgence : \[X\]

**Risque prioritaire 3**

-   Description : \[Texte\]

-   Urgence : \[X\]

**6. RECOMMANDATIONS ICPP**

L'ICPP préconise la mise en place d'un plan d'action comprenant :

🔹 **1. Actions immédiates (0--3 mois)**

-   Mise à jour du DUERP

-   Sensibilisation des salariés

-   Correction des risques critiques

🔹 **2. Actions à moyen terme (3--12 mois)**

-   Formation gestes & postures

-   Formalisation du plan de prévention

-   Remplacement ou entretien des équipements

🔹 **3. Actions à long terme (12--24 mois)**

-   Standardisation des procédures

-   Audit annuel récurrent

-   Intégration d'un suivi digital via ICPP SaaS

**7. COMPARAISON AVEC LES NORMES DE PRÉVENTION**

Comparaison automatique avec :

-   Le Code du Travail

-   Les obligations DUERP (article R4121-1 et suivants)

-   Les règles CNAM / INRS

-   Les indicateurs AT/MP de la Sécurité Sociale

Le SaaS doit générer automatiquement un tableau :

  ---------------------------- -------------------------- -----------------
  **Obligation légale**        **% entreprises            **Commentaire**
                               conformes**                

  DUERP à jour                 \[X%\]                     OK / À corriger

  Plan d\'action               \[X%\]                     ---

  Affichages obligatoires      \[X%\]                     ---

  Formation SST / prévention   \[X%\]                     ---
  ---------------------------- -------------------------- -----------------

**8. SYNTHÈSE ET CONCLUSION**

Le secteur audité présente :

-   Un niveau de conformité **\[faible/modéré/élevé\]**

-   Une exposition notable aux risques suivants : **\[Liste\]**

-   Une nécessité de renforcer la prévention sur **\[Points clés\]**

L'ICPP recommande :

-   Un suivi annuel obligatoire

-   La mise en conformité immédiate pour les entreprises à risque élevé

-   Des actions collectives avec les organismes publics

**9. ANNEXES**

**Annexe A --- Liste des risques détaillés par entreprise (anonymisée)**

**Annexe B --- Graphiques statistiques complets**

**Annexe C --- Modèles d'actions correctives**

**Annexe D --- Carte géographique des entreprises auditées**

📥 **Format PDF généré automatiquement**

Le PDF doit intégrer :

-   Logo ICPP en en-tête

-   Identité visuelle bleu foncé / bleu clair

-   Numérotation automatique des pages

-   Graphiques générés en direct

-   Données dynamiques remplies par le SaaS
