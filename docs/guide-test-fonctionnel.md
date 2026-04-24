# Guide de test fonctionnel complet

## Objectif

Valider de bout en bout le flux metier :

1. audit termine avec plan assigne,
2. demande de paiement client,
3. paiement Stripe ou Cash,
4. creation du contrat,
5. signature numerique client,
6. consultation et telechargement du contrat pour tous les roles autorises.

## Prerequis

- Environnement applicatif en ligne et base de donnees accessible.
- Stripe configure si le scenario Stripe est execute.
- Au moins une entreprise avec :
	- un utilisateur CLIENT,
	- un auditeur ou commercial assigne,
	- un audit termine avec abonnement assigne.

## Comptes de test recommandes

- Client sans abonnement actif : `cash.option@test-icpp.com`.
- Client pour Stripe : `stripe.option@test-icpp.com`.
- Un compte AUDITOR ou COMMERCIAL assigne a l'entreprise test.
- Un compte ADMIN.

## Scenarios prets a executer

## Scenario A - Auditeur lance le paiement apres audit

Etapes :

1. Se connecter en auditeur/commercial.
2. Ouvrir Mes audits puis le detail d'un audit TERMINE avec plan assigne.
3. Cliquer sur Proceder au paiement.
4. Se connecter ensuite en client de la meme entreprise.

Resultat attendu :

- Le client recoit une notification de paiement.
- Le client voit la page abonnement et peut payer via Stripe/Cash.

## Scenario B - Admin lance le paiement apres audit

Etapes :

1. Se connecter en admin.
2. Ouvrir Gestion des audits.
3. Sur un audit Termine, action Proceder au paiement.
4. Se connecter en client.

Resultat attendu :

- Notification client envoyee.
- Paiement possible sur la page abonnement.

## Scenario C - Paiement Stripe et creation du contrat

Etapes :

1. En client, ouvrir abonnement.
2. Choisir Stripe puis finaliser le paiement carte.
3. Revenir sur l'application.
4. Ouvrir Dashboard puis Mon contrat.

Resultat attendu :

- Paiement passe a PAID.
- Abonnement actif.
- Contrat cree automatiquement.
- Bouton de telechargement contrat disponible.

## Scenario D - Paiement Cash et creation du contrat

Etapes :

1. En client, declarer un paiement Cash.
2. En auditeur/commercial/admin, valider ce paiement.
3. Retour en client, ouvrir Mon contrat.

Resultat attendu :

- Paiement valide en PAID.
- Abonnement actif.
- Contrat cree automatiquement.

## Scenario E - Signature numerique client

Etapes :

1. En client, ouvrir Dashboard > Mon contrat.
2. Signer dans la zone de signature (souris, doigt ou stylet).
3. Cliquer Enregistrer la signature.
4. Cliquer Valider le contrat.

Resultat attendu :

- Signature enregistree.
- Contrat passe en etat signe.
- Message de confirmation visible.

## Scenario F - Telechargement contrat PDF signe

Etapes :

1. En client, admin ou auditeur/commercial autorise, ouvrir la fiche contrat.
2. Cliquer Telecharger le contrat.

Resultat attendu :

- Fichier PDF telecharge.
- Le PDF contient : numero contrat, entreprise, CGV, date de signature et image de signature si disponible.

## Scenario G - Visibilite par role

Etapes :

1. En admin : ouvrir Contrats.
2. En auditeur/commercial assigne : ouvrir Contrats.
3. En client : ouvrir Mon contrat.

Resultat attendu :

- Admin voit tous les contrats.
- Auditeur/commercial voit uniquement ses entreprises suivies.
- Client voit uniquement son propre contrat.

## Scenario H - Controle d'acces route de telechargement

Etapes :

1. Copier une URL de telechargement contrat d'une entreprise A.
2. Tenter l'acces avec un utilisateur non autorise (autre entreprise/role).

Resultat attendu :

- Reponse Acces refuse (403) ou Non autorise (401).

## Scenario I - Regression critique finalisation immediate apres audit

Etapes auditeur :

1. Se connecter en auditeur.
2. Ouvrir Audits > Nouveau.
3. Completer les 5 etapes et cliquer Finaliser l'audit.
4. Verifier la navigation automatique.

Resultat attendu auditeur :

- Redirection immediate vers `/auditeur/audits/{auditId}/finalisation`.
- Ecran Finalisation sur place visible avec blocs Paiement, Contrat et Signature.
- Aucun retour silencieux sur la page precedente.

Etapes admin :

1. Se connecter en admin.
2. Ouvrir Gestion des audits > Nouveau.
3. Completer les 5 etapes et cliquer Finaliser l'audit.
4. Verifier la navigation automatique.

Resultat attendu admin :

- Redirection immediate vers `/admin/audits/{auditId}/finalisation`.
- Ecran Finalisation sur place visible.
- Aucun message d'erreur serveur.

Captures obligatoires en cas d'echec :

- URL exacte apres clic Finaliser l'audit.
- Heure precise (UTC ou locale) du clic.
- Message affiché dans l'UI (toast/erreur).
- Role utilise et identifiant de l'audit teste.

## Recette de regression minimale

Executer rapidement apres la campagne principale :

1. Login multi-role et redirections.
2. Gate abonnement client.
3. Paiement Stripe/Cash.
4. Tableau audits admin/auditeur.
5. Consultation DUERP.
6. Redirection post-finalisation audit vers page Finalisation sur place.

## Checklist de validation finale

- [ ] Bouton Proceder au paiement actif apres audit termine.
- [ ] Notification client bien envoyee.
- [ ] Paiement Stripe fonctionne.
- [ ] Paiement Cash fonctionne.
- [ ] Contrat cree automatiquement apres paiement valide.
- [ ] Signature numerique enregistree et validable.
- [ ] Contrat telechargeable en PDF.
- [ ] Contrat visible dans espaces admin, auditeur/commercial et client.
- [ ] Controle d'acces role/entreprise conforme.
- [ ] Redirection immediate vers la page finalisation apres validation audit (admin et auditeur).

## Format de remontée d'anomalie

Pour chaque anomalie, renseigner :

- role utilise,
- route testee,
- etape precise,
- resultat observe,
- resultat attendu,
- capture d'ecran,
- donnees de test utilisees.