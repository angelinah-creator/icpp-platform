# Documentation detaillee pour les responsables projet

## Finalite du document

Ce document sert de support de pilotage pour comprendre :

- l'etat actuel du produit,
- les parcours utilisateurs reellement disponibles,
- la logique de segmentation par role,
- les zones stabilisees et les zones restant a industrialiser.

## Vue d'ensemble du produit

ICPP Platform est une plateforme SaaS de conformite professionnelle organisee autour de quatre grandes familles de parcours :

- pilotage administratif,
- execution des audits,
- gestion client et abonnement,
- intervention terrain.

Le socle applicatif est un projet Next.js App Router avec Prisma, PostgreSQL, NextAuth, Tailwind et Stripe.

## Architecture fonctionnelle par role

### 1. Administrateur

Mission principale : piloter l'ensemble du portefeuille, controler les audits, suivre les paiements et consulter les rapports.

Parcours principal :

1. connexion sur `/login`
2. redirection vers `/admin`
3. pilotage via dashboard admin
4. suivi des entreprises, DUERP, audits, paiements, rapports, signalements et parametres

Capacites clefs :

- supervision globale du portefeuille client,
- visualisation des paiements d'abonnement,
- creation d'audit admin,
- creation de DUERP admin,
- consultation des rapports des intervenants,
- suivi des signalements et de la conformite.

### 2. Auditeur / Commercial

Mission principale : gerer les entreprises affectees, realiser des audits et suivre les taches metier.

Parcours principal :

1. connexion sur `/login`
2. redirection vers `/auditeur`
3. acces aux entreprises, audits, DUERP, taches, paiements, parametres

Capacites clefs :

- demarrage d'un nouvel audit via un formulaire multi-etapes,
- identification des risques selon le metier,
- proposition d'une offre d'abonnement,
- traitement des paiements cash quand l'utilisateur est collecteur,
- suivi des signalements et des actions a mener.

Note produit : le role `COMMERCIAL` est actuellement aligne sur l'espace auditeur pour reutiliser les memes ecrans et la meme logique d'affectation.

### 3. Technicien

Mission principale : executer les interventions terrain et traiter les taches assignees.

Parcours principal :

1. connexion sur `/login`
2. redirection vers `/technicien`
3. acces au dashboard technicien, aux taches et aux parametres

Capacites clefs :

- consultation des interventions,
- suivi des taches assignees,
- production potentielle de rapports d'intervention,
- remontes visibles cote admin via le module rapports.

### 4. Client

Mission principale : consulter son espace conformite, suivre ses documents et gerer son activation abonnement.

Parcours principal avec abonnement actif :

1. connexion sur `/login`
2. verification du statut abonnement
3. redirection vers `/dashboard`
4. acces au DUERP, documents, affichages, salaries, signalements, factures, parametres

Parcours principal sans abonnement actif :

1. connexion sur `/login`
2. verification du statut abonnement
3. redirection vers `/abonnement`
4. choix du plan
5. paiement Stripe ou declaration cash
6. attente de validation puis ouverture de l'espace client

## Parcours metier transverses

### Parcours abonnement

- declencheur : client sans abonnement actif
- ecran de gate : `/abonnement`
- possibilites :
  - paiement Stripe avec confirmation,
  - paiement cash avec declaration et validation interne
- sortie attendue : abonnement actif puis acces au dashboard client

### Parcours paiement cash

1. le client declare un paiement cash
2. un collecteur ICPP est designe
3. le paiement passe en attente de validation
4. un auditeur/commercial ou admin valide ou refuse
5. si valide, l'abonnement est active et un ticket est genere

### Parcours audit vers abonnement

1. l'auditeur ou l'admin cree un audit
2. les documents et risques sont qualifies
3. une proposition de plan ou de prix peut etre jointe
4. cette proposition nourrit ensuite le parcours d'activation client

### Parcours DUERP

1. selection de l'entreprise
2. recuperation des risques lies au metier
3. evaluation frequence / gravite / maitrise
4. calcul des indicateurs de priorisation
5. production du DUERP et de son plan d'action

## Etat d'avancement par domaine

### Domaine identite et acces

- effectif et exploitable
- segmentation par role operationnelle

### Domaine conformite

- audits et DUERP disponibles
- calculs DUERP integres

### Domaine financier

- gate abonnement deploye
- Stripe et cash pris en charge
- tickets PDF disponibles

### Domaine exploitation

- taches et rapports presents
- notifications presentes

## Dette technique et points a surveiller

- renforcer les tests autour des server actions et des flux de paiement,
- harmoniser certains parcours entre `/client` et `/dashboard` si les deux espaces doivent coexister durablement,
- ajouter des tests de non-regression sur les redirections role + abonnement,
- cadrer le niveau d'observabilite attendu avant mise en production.

## Recommandations responsables projet

1. Utiliser le guide de test fonctionnel pour une campagne de recette par role.
2. Prioriser les cas critiques : login, gate abonnement, validation cash, ticket PDF.
3. Demander une phase de fiabilisation centree sur les tests automatises avant generalisation du produit.
4. Fixer un perimetre MVP ferme si une mise en production pilote est envisagee.