# Guide des tests unitaires

## Objectif

Ce guide explique comment lancer, lire et etendre les tests unitaires du projet.

## Stack retenue

- Vitest
- provider de couverture V8
- resolution des alias TypeScript via `vite-tsconfig-paths`

## Scripts disponibles

```bash
npm run test:unit
npm run test:unit:watch
npm run test:unit:coverage
```

## Perimetre initial couvert

Les premiers tests couvrent la logique metier pure, donc la plus stable et la plus rentable a automatiser rapidement :

- calcul DUERP,
- acces abonnement et labels d'etat.

## Emplacement des tests

Les tests unitaires sont ranges dans :

```bash
tests/unit
```

## Philosophie de couverture recommandee

Priorite aux fonctions :

1. pures,
2. critiques metier,
3. independantes de Next.js runtime,
4. utilisees dans plusieurs parcours.

## Strategie de progression recommandee

### Niveau 1

Tester les utilitaires purs :

- calculs DUERP,
- labels et gardes abonnement,
- helpers de formatage si critiques.

### Niveau 2

Tester les fonctions de mapping et de validation :

- transformation des donnees de paiements,
- validation des entrees,
- logique de priorisation.

### Niveau 3

Ajouter des tests d'integration cibles sur :

- server actions sensibles,
- droits par role,
- transitions de statut de paiement.

## Regles pour ecrire un nouveau test

1. isoler une seule responsabilite par test,
2. nommer le test par comportement attendu,
3. privilegier les cas limites et les seuils metier,
4. eviter les tests sur implementation details UI tant qu'aucune couche React testee n'est mise en place.

## Exemple de workflow equipe

1. modifier une fonction metier
2. ajouter ou mettre a jour le test associe
3. lancer `npm run test:unit`
4. si besoin, verifier `npm run test:unit:coverage`
5. completer par une recette manuelle si la modification touche un parcours critique

## Limitations actuelles

- pas encore de tests React components,
- pas encore de tests end-to-end,
- pas encore de harnais d'integration Prisma/NextAuth.

## Prochaines extensions conseillees

1. tests sur `payments.ts` avec isolation des dependances,
2. tests sur les redirections role + abonnement,
3. tests sur la creation d'audit et de DUERP via couches de service,
4. eventuelle introduction d'une couche de services plus facilement testable que les server actions directes.