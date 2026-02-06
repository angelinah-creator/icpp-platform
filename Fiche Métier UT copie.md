
🧠 EXPLICATION POUR LE DÉVELOPPEUR — STRUCTURE MÉTIERS / UT / RISQUES
🎯 Objectif
Après observation et réflexion, il est important que chaque métier intégré dans l’application soit structuré par :
1.	Métier

2.	Unités de Travail (UT)

3.	Risques associés

4.	Gravité (G)

5.	Fréquence (F)

6.	Priorité calculée (P = F × G)

7.	Mesures de prévention

Cela permet :
•	d’être juridiquement conforme à la logique DUERP

•	d’avoir une structure cohérente

•	de permettre un calcul automatique du niveau de risque

•	de rendre l’audit logique pour l’auditeur

•	d’assurer une mise à jour intelligente dans le futur


📌 1️⃣ Qu’est-ce qu’une Unité de Travail (UT) ?
Une Unité de Travail n’est PAS un risque.
C’est une zone ou un poste identifiable dans l’entreprise.
Exemples :
Bijouterie :
•	UT1 : Accueil / Vente

•	UT2 : Atelier fabrication

•	UT3 : Polissage

•	UT4 : Poste sertissage

•	UT5 : Stockage produits chimiques

•	UT6 : Installations générales

Coiffure :
•	UT1 : Accueil

•	UT2 : Postes de coupe

•	UT3 : Zone shampoing

•	UT4 : Réserve produits

•	UT5 : Espace technique

•	UT6 : Installations générales

Chaque UT contient des risques spécifiques.

📌 2️⃣ Structure logique en base de données
Structure recommandée :
Table 1 — Métiers
•	id_metier

•	nom_metier

Table 2 — Unités de Travail
•	id_ut

•	id_metier (relation)

•	nom_ut

•	description_ut

•	ordre_affichage

Table 3 — Risques
•	id_risque

•	id_ut (relation)

•	categorie (physique, chimique, psychosocial, etc.)

•	nom_risque

•	description_risque

•	gravite_default (1 à 5)

•	frequence_default (1 à 5)

•	priorite_auto (calculé = F × G)

•	action_recommandee

📌 5️⃣ Échelle à standardiser (OBLIGATOIRE)
Gravité (G)
1 = Mineur
2 = Blessure légère
3 = Blessure sérieuse
4 = Accident grave / incapacité
5 = Décès
Fréquence (F)
1 = Rare
2 = Occasionnel
3 = Régulier
4 = Fréquent
5 = Permanent

📌 6️⃣ Calcul automatique
P = F × G
Le développeur doit :
•	calculer automatiquement la priorité

•	permettre modification F et G par l’auditeur

•	recalculer dynamiquement la priorité


📌 7️⃣ Ce que cela permet
✔	Génération d’un DUERP structuré
✔ Classement automatique des risques
✔ Vision claire par zone
✔ Mise à jour intelligente
✔ Évolutivité V2
✔ Possibilité future scoring conformité

Voici un exemple de comment cela peut être positionné


✅ MÉTIER 1 — COIFFURE / BARBIER
metier_nom : "Coiffure / Barbier"

 UT1 — ACCUEIL / CAISSE / PRISE DE RENDEZ-VOUS
Catégorie : Psychosociaux
nom_risque : Stress lié à la clientèle
description_risque : Exigences fortes, remarques, conflits potentiels avec certains clients, pression sur les rendez-vous.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Formation gestion relation client, règles d’apaisement.
nom_risque : Rythme de travail soutenu
description_risque : Enchaînement de rendez-vous sans pause, pics d’activité.
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Organisation du planning, pauses planifiées.
nom_risque : Conflits internes
description_risque : Tensions entre collègues autour des clients et des horaires.
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Temps d’échange, règles claires.

 UT2 — POSTE COUPE / COIFFAGE
Catégorie : Physiques
nom_risque : TMS dos / épaules / nuque
description_risque : Postures debout prolongées, bras levés.
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Formation gestes et postures, fauteuils réglables.
nom_risque : Coupures ciseaux / rasoirs / tondeuses
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Outils en bon état, rangement immédiat.
nom_risque : Brûlures par appareils chauffants
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Contrôle température, rangement sécurisé.
Catégorie : Organisationnels
nom_risque : Ergonomie du poste insuffisante
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Ajustement mobilier, investissement progressif.

 UT3 — ZONE BAC / SHAMPOING
Catégorie : Physiques
nom_risque : Glissade zone bac
description_risque : Présence d’eau autour des bacs, tapis mouillés.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Séchage immédiat, tapis absorbants.
nom_risque : TMS dos (flexion répétée)
description_risque : Position penchée prolongée lors des shampoings.
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Réglage hauteur bac, pauses.

 UT4 — ZONE TECHNIQUE (COLORATION / PRODUITS)
Catégorie : Chimiques
nom_risque : Décolorants – inhalation et contact
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gants, ventilation.
nom_risque : Colorations – sensibilisation cutanée
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Port de gants, respect des temps de pause.
nom_risque : Produits lissants / défrisants – vapeurs
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Ventilation renforcée.
Catégorie : Incendie & Locaux
nom_risque : Ventilation insuffisante
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Extraction d’air adaptée.

 UT5 — RÉSERVE / STOCK / PRODUITS
Catégorie : Incendie & Locaux
nom_risque : Produits inflammables mal stockés
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Stockage éloigné sources chaleur.
Catégorie : Organisationnels
nom_risque : Manque de procédures d’hygiène
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Protocole écrit + formation.
nom_risque : Planning instable
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Planification anticipée.

 UT6 — LOCAUX / CIRCULATIONS / ENTRETIEN
Catégorie : Physiques
nom_risque : Chutes de plain-pied
description_risque : Sol glissant à cause des cheveux, eau ou produits renversés.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Balayage après chaque client.
Catégorie : Chimiques
nom_risque : Produits de nettoyage
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Gants, respect des doses.
Catégorie : Incendie & Locaux
nom_risque : Installation électrique surchargée
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Vérification installation.

✅ MÉTIER 2 — ESTHÉTIQUE / ONGLES / BIEN-ÊTRE
metier_nom : "Esthétique / Onglerie / Bien-être"

 UT1 — ACCUEIL / CAISSE / PRISE DE RENDEZ-VOUS
Catégorie : Psychosociaux
nom_risque : Pression liée à l’image et au résultat
description_risque : Attentes élevées des clients concernant le résultat esthétique.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Communication claire, gestion des attentes, soutien du responsable.
nom_risque : Gestion approximative des rendez-vous
description_risque : Retards, chevauchements, surcharge administrative.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Outil de planning structuré, temps tampon.
nom_risque : Rythme soutenu en période de pointe
description_risque : Forte affluence (week-ends, fêtes), stress organisationnel.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Limiter le surbooking, planifier les pauses.

 UT2 — POSTE MANUCURE / ONGLES
Catégorie : Physiques
nom_risque : TMS mains / poignets
description_risque : Gestes fins répétitifs (pose gel, limage).
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Alternance tâches, pauses, formation gestes adaptés.
nom_risque : TMS dos / épaules
description_risque : Posture penchée prolongée sur cliente.
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Réglage sièges, pauses régulières.
nom_risque : Coupures petits instruments
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Rangement sécurisé, désinfection protocolaire.
Catégorie : Chimiques
nom_risque : Solvants (vernis, dissolvants)
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Ventilation efficace, port de gants.
nom_risque : Résines et gels UV
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Respect FDS, protection cutanée.
nom_risque : Huiles essentielles / parfums
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Limiter usage, aération.

 UT3 — CABINE SOINS VISAGE / CORPS
Catégorie : Physiques
nom_risque : TMS dos / épaules
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Table réglable, pauses.
nom_risque : Brûlures par cire chaude
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Contrôle température.
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Nettoyage immédiat, tapis antidérapants.
Catégorie : Psychosociaux
nom_risque : Isolement en cabine
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédure d’alerte, présence d’un collègue sur site.

 UT4 — ZONE PRODUITS / DÉSINFECTION
Catégorie : Chimiques
nom_risque : Désinfectants concentrés
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Gants, respect dilution.
nom_risque : Produits de peeling / acides
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Protection oculaire, formation.
Catégorie : Organisationnels
nom_risque : Hygiène du matériel insuffisamment encadrée
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Protocole écrit + registre suivi.
nom_risque : Traçabilité des produits et soins insuffisante
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Fiches clients détaillées.

 UT5 — LOCAUX / CIRCULATIONS
Catégorie : Physiques
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Maintenir sols propres.

 UT6 — INSTALLATIONS ÉLECTRIQUES / INCENDIE
Catégorie : Incendie & Locaux
nom_risque : Utilisation de bougies / appareils chauffants
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Ne jamais laisser sans surveillance.
nom_risque : Surcharge de multiprises
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Répartition électrique conforme.
nom_risque : Ventilation des cabines insuffisante
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Extraction d’air efficace.
✅ MÉTIER 2 — ESTHÉTIQUE / ONGLES / BIEN-ÊTRE
metier_nom : "Esthétique / Onglerie / Bien-être"

 UT1 — ACCUEIL / CAISSE / PRISE DE RENDEZ-VOUS
Catégorie : Psychosociaux
nom_risque : Pression liée à l’image et au résultat
description_risque : Attentes élevées des clients concernant le résultat esthétique.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Communication claire, gestion des attentes, soutien du responsable.
nom_risque : Gestion approximative des rendez-vous
description_risque : Retards, chevauchements, surcharge administrative.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Outil de planning structuré, temps tampon.
nom_risque : Rythme soutenu en période de pointe
description_risque : Forte affluence (week-ends, fêtes), stress organisationnel.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Limiter le surbooking, planifier les pauses.

 UT2 — POSTE MANUCURE / ONGLES
Catégorie : Physiques
nom_risque : TMS mains / poignets
description_risque : Gestes fins répétitifs (pose gel, limage).
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Alternance tâches, pauses, formation gestes adaptés.
nom_risque : TMS dos / épaules
description_risque : Posture penchée prolongée sur cliente.
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Réglage sièges, pauses régulières.
nom_risque : Coupures petits instruments
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Rangement sécurisé, désinfection protocolaire.
Catégorie : Chimiques
nom_risque : Solvants (vernis, dissolvants)
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Ventilation efficace, port de gants.
nom_risque : Résines et gels UV
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Respect FDS, protection cutanée.
nom_risque : Huiles essentielles / parfums
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Limiter usage, aération.

 UT3 — CABINE SOINS VISAGE / CORPS
Catégorie : Physiques
nom_risque : TMS dos / épaules
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Table réglable, pauses.
nom_risque : Brûlures par cire chaude
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Contrôle température.
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Nettoyage immédiat, tapis antidérapants.
Catégorie : Psychosociaux
nom_risque : Isolement en cabine
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédure d’alerte, présence d’un collègue sur site.

 UT4 — ZONE PRODUITS / DÉSINFECTION
Catégorie : Chimiques
nom_risque : Désinfectants concentrés
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Gants, respect dilution.
nom_risque : Produits de peeling / acides
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Protection oculaire, formation.
Catégorie : Organisationnels
nom_risque : Hygiène du matériel insuffisamment encadrée
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Protocole écrit + registre suivi.
nom_risque : Traçabilité des produits et soins insuffisante
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Fiches clients détaillées.

 UT5 — LOCAUX / CIRCULATIONS
Catégorie : Physiques
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Maintenir sols propres.

 UT6 — INSTALLATIONS ÉLECTRIQUES / INCENDIE
Catégorie : Incendie & Locaux
nom_risque : Utilisation de bougies / appareils chauffants
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Ne jamais laisser sans surveillance.
nom_risque : Surcharge de multiprises
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Répartition électrique conforme.
nom_risque : Ventilation des cabines insuffisante
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Extraction d’air efficace.
✅ MÉTIER 3 — SNACK / RESTAURATION RAPIDE
metier_nom : "Snack / Restauration rapide"

 UT1 — ACCUEIL / CAISSE / SERVICE CLIENT
Catégorie : Psychosociaux
nom_risque : Stress lié au rythme soutenu
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Organisation planning + renforts.
nom_risque : Pression clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Procédure communication claire.
nom_risque : Conflits internes au sein de l’équipe
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Briefing quotidien.
Catégorie : Biologiques
nom_risque : Contact avec la clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Hygiène des mains.
nom_risque : Manipulation d’objets clients (paiements, plateaux)
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Désinfection régulière.

 UT2 — POSTE CUISSON (FRITEUSES / PLAQUES)
Catégorie : Physiques
nom_risque : Brûlures par friteuse et surfaces chaudes
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Formation gestes sécurisés.
nom_risque : Brûlures par vapeur
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Ouvrir lentement les cuves.
nom_risque : Chutes dues aux sols gras ou humides
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Nettoyage immédiat.
Catégorie : Incendie & Locaux
nom_risque : Risque incendie lié aux friteuses
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Extincteur type F.
nom_risque : Incendie lié à hotte encrassée
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Nettoyage hebdomadaire.

 UT3 — POSTE PRÉPARATION / DÉCOUPE
Catégorie : Physiques
nom_risque : Coupures liées aux couteaux et trancheurs
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gants anti-coupures.
nom_risque : TMS bras / gestes répétitifs
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Alterner les tâches.
Catégorie : Organisationnels
nom_risque : Hygiène alimentaire insuffisante
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Application HACCP.
nom_risque : Traçabilité alimentaire déficiente
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Étiquetage systématique.

 UT4 — ZONE STOCKAGE / CHAMBRE FROIDE
Catégorie : Organisationnels
nom_risque : Rupture de la chaîne du froid
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Registre température.
nom_risque : Entretien insuffisant des hottes et fours
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Planning maintenance.

 UT5 — PLONGE / NETTOYAGE
Catégorie : Chimiques
nom_risque : Exposition aux dégraissants puissants
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gants + dilution conforme.
nom_risque : Désinfectants alimentaires concentrés
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Dilution ventilée.
nom_risque : Contact prolongé eau chaude + produits
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Gants thermiques.
nom_risque : Inhalation vapeurs de cuisson
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Ventilation efficace.

 UT6 — INSTALLATIONS / LOCAUX / ÉLECTRICITÉ
Catégorie : Incendie & Locaux
nom_risque : Surcharge de prises électriques
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Répartition électrique.
nom_risque : Issues de secours encombrées
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Maintenir dégagées.
✅ MÉTIER 4 — RESTAURANT TRADITIONNEL
metier_nom : "Restaurant traditionnel"

 UT1 — ACCUEIL / SALLE / SERVICE CLIENT
Catégorie : Psychosociaux
nom_risque : Stress en période de service
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Organisation précise, coordination cuisine/salle.
nom_risque : Conflits cuisine / salle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Briefings réguliers.
Catégorie : Biologiques
nom_risque : Contact avec la clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Hygiène des mains.
nom_risque : Manipulation objets clients
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Désinfection régulière.

 UT2 — POSTE CUISSON (FOURS / PLAQUES / GAZ)
Catégorie : Physiques
nom_risque : Brûlures de cuisson
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Gants thermiques.
nom_risque : Brûlures par liquides chauds
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Déplacements sécurisés.
nom_risque : Chutes en cuisine (sol humide)
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Nettoyage immédiat.
Catégorie : Incendie & Locaux
nom_risque : Gaz cuisine (fuites / raccords)
gravite_default : 5
frequence_default : 1
P = 5
action_recommandee : Contrôle périodique.
nom_risque : Risque incendie hotte encrassée
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Nettoyage planifié.
nom_risque : Surcharge électrique cuisine
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Répartition charges.

 UT3 — POSTE PRÉPARATION / DÉCOUPE
Catégorie : Physiques
nom_risque : Coupures couteaux professionnels
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Formation découpe.
nom_risque : TMS préparation répétitive
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Rotation des postes.
Catégorie : Organisationnels
nom_risque : Contamination croisée
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Application HACCP.
nom_risque : Traçabilité alimentaire insuffisante
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Étiquetage systématique.
nom_risque : Allergènes mal gérés
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Formation allergènes.

 UT4 — STOCKAGE / CHAMBRE FROIDE
Catégorie : Organisationnels
nom_risque : Rupture chaîne du froid
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Registre température.

 UT5 — PLONGE / NETTOYAGE
Catégorie : Chimiques
nom_risque : Produits de plonge agressifs
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gants adaptés.
nom_risque : Désinfectants cuisine
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Respect dilutions.
nom_risque : Nettoyants sols cuisine
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Protocole nettoyage.
nom_risque : Vapeurs de cuisson intenses
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Ventilation efficace.

 UT6 — LOCAUX / ORGANISATION GÉNÉRALE
Catégorie : Psychosociaux
nom_risque : Pression du chef / hiérarchie
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Clarification rôles.
Catégorie : Incendie & Locaux
nom_risque : Issues de secours obstruées
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Maintenir dégagées.
✅ MÉTIER 5 — BOUTIQUE / PRÊT-À-PORTER / CHAUSSURES
metier_nom : "Boutique / Prêt-à-porter"

 UT1 — ACCUEIL / VENTE / ENCAISSEMENT
Catégorie : Psychosociaux
nom_risque : Pression commerciale
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Formation commerciale, gestion du stress.
nom_risque : Conflits clients
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédure claire d’accueil client.
nom_risque : Périodes de forte affluence
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Renfort temporaire, pauses planifiées.
nom_risque : Solitude en période creuse
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Procédure sécurité, contact d’urgence.
Catégorie : Organisationnels
nom_risque : Absence procédure caisse
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Formation + procédure écrite.
nom_risque : Vols internes / externes
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Système antivol, organisation discrète.

 UT2 — SURFACE DE VENTE / RAYONS
Catégorie : Physiques
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Allées dégagées, nettoyage immédiat.
nom_risque : Heurts contre mobilier
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Organisation des circulations.
nom_risque : TMS poignets / mains
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Outils ergonomiques, pauses.
nom_risque : TMS épaules / bras
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Varier les tâches, escabeau stable.

 UT3 — RÉSERVE / STOCKAGE / RÉASSORT
Catégorie : Physiques
nom_risque : Port de charges légères répétées
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Porter près du corps.
nom_risque : Stock mal organisé
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Rangement sécurisé.
Catégorie : Organisationnels
nom_risque : Mauvaise gestion des réassorts
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Horaires dédiés au réassort.

 UT4 — ENTRETIEN / NETTOYAGE
Catégorie : Chimiques
nom_risque : Produits de nettoyage
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Port de gants.
nom_risque : Dépoussiérage intensif
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Nettoyage humide, aération.
nom_risque : Désodorisation / parfums
gravite_default : 1
frequence_default : 3
P = 3
action_recommandee : Ventilation naturelle.

 UT5 — CABINES D’ESSAYAGE
Catégorie : Incendie & Locaux
nom_risque : Éclairage insuffisant
gravite_default : 1
frequence_default : 3
P = 3
action_recommandee : Vérification éclairage.
nom_risque : Ventilation faible
gravite_default : 1
frequence_default : 3
P = 3
action_recommandee : Aération régulière.

 UT6 — LOCAUX / SÉCURITÉ GÉNÉRALE
Catégorie : Incendie & Locaux
nom_risque : Surcharge électrique
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Répartition conforme.
nom_risque : Blocage issues de secours
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Zone interdite au stockage.
✅ MÉTIER 6 — PHARMACIE / PARAPHARMACIE
metier_nom : "Pharmacie / Parapharmacie"

 UT1 — ACCUEIL PATIENT / CONSEIL / ENCAISSEMENT
Catégorie : Physiques
nom_risque : Station debout prolongée
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Tapis anti-fatigue, alternance assis/debout.
nom_risque : Gestes répétitifs comptoir
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Poste ergonomique + pauses courtes.
nom_risque : Heurts contre mobiliers bas
gravite_default : 1
frequence_default : 3
P = 3
action_recommandee : Organisation des allées, protections d’angles.
Catégorie : Psychosociaux
nom_risque : Pression liée au conseil patient
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Formation continue, gestion du stress.
nom_risque : Conflits clients
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédure d’accueil, communication calme.
nom_risque : Exposition émotionnelle (maladies, urgences)
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Briefing d’équipe, soutien interne.
nom_risque : Périodes de forte affluence
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Renforcement des horaires.
Catégorie : Biologiques
nom_risque : Contact avec la clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Hygiène des mains, désinfection comptoir.
nom_risque : Manipulation de lunettes usagées
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Désinfection systématique.
Catégorie : Organisationnels
nom_risque : Sécurité de la caisse
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Coffre sécurisé + protocole fermeture.

 UT2 — SURFACE DE VENTE / RAYONS
Catégorie : Physiques
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Nettoyage immédiat, marquage au sol.
nom_risque : TMS dos / épaules (réassort léger)
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gestes & postures.
Catégorie : Chimiques
nom_risque : Exposition aux aérosols
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Ventilation.
nom_risque : Odeurs de produits cosmétiques
gravite_default : 1
frequence_default : 2
P = 2
action_recommandee : Aération régulière.

 UT3 — RÉSERVE / STOCKAGE / RÉASSORT
Catégorie : Physiques
nom_risque : TMS dos / épaules (manutention lourde)
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Diable, chariot.
nom_risque : Stockage en hauteur
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Escabeau antidérapant.
Catégorie : Organisationnels
nom_risque : Rupture / gestion dates péremption
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Procédure DLActives.
nom_risque : Étiquetage & traçabilité non optimal
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Double vérification.

 UT4 — ENTRETIEN / DÉSINFECTION
Catégorie : Chimiques
nom_risque : Manipulation produits chimiques entretien
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Gants, stockage sécurisé.
nom_risque : Manipulation alcool & désinfectants
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Gants lors des recharges.

 UT5 — LOCAUX / CIRCULATION / SÉCURITÉ
Catégorie : Incendie & Locaux
nom_risque : Surcharge des prises
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Contrôle régulier.
nom_risque : Obstruction issues de secours
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Zone interdite au stockage.

 UT6 — MANIPULATION PRODUITS SENSIBLES
Catégorie : Chimiques
nom_risque : Contact avec médicaments potentiellement irritants
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Lavage des mains, manipulation contrôlée.
✅ MÉTIER 7 — TRANSPORT / LIVRAISON
metier_nom : "Transport / Livraison"

 UT1 — CONDUITE / CIRCULATION ROUTIÈRE
Catégorie : Physiques
nom_risque : Risque routier – circulation
gravite_default : 5
frequence_default : 3
P = 15
action_recommandee : Conduite préventive, entretien régulier, pauses.
nom_risque : Risque routier – stationnement / manœuvres
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Formation manœuvres sécurisées, caméra recul.
Catégorie : Psychosociaux
nom_risque : Pression liée aux délais
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Marges horaires réalistes.
nom_risque : Multiples interruptions
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Arrêt sécurisé pour répondre.
nom_risque : Isolement professionnel
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Procédures d’alerte, contact régulier.
nom_risque : Manque de pauses / fatigue
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Pause 15 min toutes les 2h.

 UT2 — CHARGEMENT / DÉCHARGEMENT
Catégorie : Physiques
nom_risque : Port de charges
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Diable, transpalette, gestes et postures.
nom_risque : TMS épaules / dos
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Optimisation rangement véhicule.
nom_risque : Chutes de hauteur (camion / fourgon)
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Marchepied antidérapant.
nom_risque : Chutes de plain-pied
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Chaussures antidérapantes.
Catégorie : Organisationnels
nom_risque : Mauvaise répartition du chargement
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Sanglage et répartition homogène.
nom_risque : Mauvaise gestion des colis fragiles
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Zone dédiée + protocole.

 UT3 — RELATION CLIENT / LIVRAISON SUR SITE
Catégorie : Psychosociaux
nom_risque : Relation client difficile
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédure d’accueil et communication adaptée.

 UT4 — CARBURANT / PRODUITS & ENTRETIEN COURANT
Catégorie : Chimiques
nom_risque : Exposition carburant
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Gants, éviter inhalation vapeurs.
nom_risque : Produits transportés (substances irritantes)
gravite_default : 3
frequence_default : 1
P = 3
action_recommandee : Vérification emballage et étiquetage.
nom_risque : Produits d’entretien véhicule
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Gants, lavage mains.

 UT5 — ORGANISATION DES TOURNÉES
Catégorie : Organisationnels
nom_risque : Planification imprécise
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Optimisation GPS, ordre logique.

 UT6 — VÉHICULE / SÉCURITÉ / INCENDIE
Catégorie : Incendie & Locaux
nom_risque : Véhicule mal entretenu
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Maintenance régulière.
nom_risque : Surchauffe électrique (chargeurs, batteries)
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Débrancher hors usage.
nom_risque : Colis inflammables mal étiquetés
gravite_default : 4
frequence_default : 1
P = 4
action_recommandee : Stockage isolé, vérification.
✅ MÉTIER 8 — NETTOYAGE / ENTRETIEN
metier_nom : "Nettoyage / Entretien"

 UT1 — PRÉPARATION / ORGANISATION DE L’INTERVENTION
Catégorie : Organisationnels
nom_risque : Oubli signalisation zones mouillées
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Vérification systématique panneau avant lavage.
nom_risque : Matériel défectueux
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Inventaire régulier, remplacement.
nom_risque : Absence de formation produits
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Formation fiches FDS obligatoire.
Catégorie : Psychosociaux
nom_risque : Pression du temps / cadences élevées
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Répartition réaliste, pauses.

 UT2 — LAVAGE DES SOLS / SANITAIRES
Catégorie : Physiques
nom_risque : Glissade sur sol mouillé
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Panneaux sol glissant, chaussures antidérapantes.
nom_risque : TMS dos / lombaires
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Seaux roulants, gestes et postures.
Catégorie : Organisationnels
nom_risque : Mauvaise gestion des déchets
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Sacs plus petits, tri clair.

 UT3 — NETTOYAGE EN HAUTEUR / VITRES
Catégorie : Physiques
nom_risque : Chutes de hauteur (escabeau)
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Escabeau sécurisé, perche télescopique.
nom_risque : TMS épaules / bras
gravite_default : 2
frequence_default : 4
P = 8
action_recommandee : Alternance tâches, perches légères.
nom_risque : Projections dans les yeux
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Lunettes protection.

 UT4 — UTILISATION PRODUITS CHIMIQUES
Catégorie : Chimiques
nom_risque : Détergents irritants
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Gants nitrile, ventilation.
nom_risque : Eau de javel
gravite_default : 4
frequence_default : 3
P = 12
action_recommandee : Jamais mélanger, gants + lunettes.
nom_risque : Mélanges accidentels (javel + acide)
gravite_default : 5
frequence_default : 1
P = 5
action_recommandee : Interdiction stricte de mélange.
nom_risque : Aérosols désinfectants
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Pulvériser porte ouverte, aération.
nom_risque : Dégraissants industriels
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Gants, lunettes.

 UT5 — GESTION DÉCHETS / TRI / POUBELLES
Catégorie : Physiques
nom_risque : Coupures
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Gants renforcés.

 UT6 — RELATION USAGERS / SÉCURITÉ LOCAUX
Catégorie : Psychosociaux
nom_risque : Travail isolé
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Dispositif d’alerte.
nom_risque : Exposition aux incivilités / usagers
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédure gestion conflits.
Catégorie : Incendie & Locaux
nom_risque : Stockage produits inflammables
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Stockage sécurisé.
nom_risque : Câbles électriques au sol
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Vérification câbles.
Catégorie : Biologiques
nom_risque : Contact avec la clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Hygiène des mains.
nom_risque : Manipulation de lunettes usagées
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Désinfection systématique.
✅ MÉTIER 10 — OPTICIEN / OPTICIEN-LUNETIER
metier_nom : "Opticien / Opticien-lunetier"

 UT1 — ACCUEIL / ESPACE VENTE / RELATION CLIENT
Catégorie : Physiques
nom_risque : Chutes de plain-pied
description_risque : Sols glissants, câbles apparents, cartons ou obstacles dans les zones de circulation.
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Maintenir les circulations dégagées, sols propres et secs.

Catégorie : Psychosociaux
nom_risque : Stress lié aux objectifs commerciaux
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Objectifs réalistes, accompagnement managérial.
nom_risque : Pression et conflits clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Formation relation client.
nom_risque : Agressions verbales / incivilités
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Procédures d’accueil sécurisées.
nom_risque : Isolement professionnel
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Organisation travail, contact régulier.

 UT2 — ATELIER DE TAILLAGE / MONTAGE / RÉPARATION
Catégorie : Mécaniques / Machines
nom_risque : Coupures outils / verres
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Utilisation d’outils adaptés, formation.
nom_risque : Projections de particules
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Lunettes de protection obligatoires.
nom_risque : Bruit machines de taillage
gravite_default : 1
frequence_default : 2
P = 2
action_recommandee : Limiter exposition, entretien.
nom_risque : Vibrations outils
gravite_default : 1
frequence_default : 1
P = 1
action_recommandee : Maintenance régulière.

Catégorie : Chimiques
nom_risque : Poussières de verres et plastiques
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Aspiration localisée.
nom_risque : Solvants, colles et adhésifs
gravite_default : 2
frequence_default : 1
P = 2
action_recommandee : Ventilation + stockage sécurisé.
nom_risque : Produits de nettoyage verres
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Port gants, respect FDS.

 UT3 — SALLE D’EXAMEN DE VUE
Catégorie : Ergonomiques / TMS
nom_risque : Fatigue visuelle de l’opticien
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Pauses visuelles régulières.
nom_risque : Postures contraignantes examen
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Ajustement du matériel.

Catégorie : Biologiques
nom_risque : Contact rapproché clientèle
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Hygiène des mains.
nom_risque : Manipulation lunettes usagées
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Désinfection systématique.

 UT4 — POSTE ADMINISTRATIF / INFORMATIQUE
Catégorie : Ergonomiques
nom_risque : Travail sur écran prolongé
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Réglage ergonomique poste.
nom_risque : Postures statiques prolongées
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Alternance assis/debout.

Catégorie : Organisationnels
nom_risque : Sous-effectif en période d’affluence
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Ajustement effectifs.
nom_risque : Absence de procédures écrites
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Formalisation des protocoles.

 UT5 — STOCK / RÉSERVE / MANUTENTION
Catégorie : Physiques
nom_risque : Manutentions manuelles
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Formation gestes et postures.
nom_risque : Chutes de hauteur (escabeau)
gravite_default : 3
frequence_default : 1
P = 3
action_recommandee : Escabeau conforme.
nom_risque : Température inconfortable
gravite_default : 1
frequence_default : 2
P = 2
action_recommandee : Régulation thermique.

 UT6 — INSTALLATIONS / SÉCURITÉ GÉNÉRALE
Catégorie : Électriques
nom_risque : Installation électrique défectueuse
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Vérification périodique.

Catégorie : Incendie & Explosion
nom_risque : Produits inflammables mal stockés
gravite_default : 3
frequence_default : 1
P = 3
action_recommandee : Stockage sécurisé.
nom_risque : Absence ou défaillance moyens incendie
gravite_default : 4
frequence_default : 1
P = 4
action_recommandee : Extincteurs vérifiés.

✅ MÉTIER 11 — BIJOUTERIE / JOAILLERIE
metier_nom : "Bijouterie / Joaillerie"

 UT1 — ACCUEIL / ESPACE VENTE / RELATION CLIENT
Catégorie : Psychosociaux
nom_risque : Stress valeur des biens
description_risque : Pression liée à la manipulation et à la responsabilité de bijoux de grande valeur.
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Procédures de sécurité écrites, double vérification manipulation.

nom_risque : Agression / vol
description_risque : Risque d’agression physique ou verbale en raison de la valeur des marchandises.
gravite_default : 4
frequence_default : 1
P = 4
action_recommandee : Alarme, bouton panique, vidéosurveillance, protocole sécurité.

nom_risque : Pression commerciale
description_risque : Exigences élevées des clients sur délais et qualité.
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Organisation claire du travail, gestion des délais.

Catégorie : Physiques
nom_risque : Chutes de plain-pied
description_risque : Sol glissant, câbles, poussières métalliques ou liquides en zone vente.
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Nettoyage régulier, tapis antidérapants.

 UT2 — ATELIER FABRICATION / SOUDURE / FONTE
Catégorie : Physiques
nom_risque : Coupures outils tranchants
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gants anti-coupures, formation technique.

nom_risque : Brûlures par chalumeaux
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Gants thermiques, balisage zone chaude.

nom_risque : Brûlures par fours
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Procédure manipulation sécurisée.

nom_risque : Projections métal en fusion
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Lunettes + écran facial obligatoire.

nom_risque : Éclats de pierre
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Protection oculaire.

nom_risque : Vibrations outils
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Outils anti-vibrations, pauses.

 UT3 — POLISSAGE / FINITION
Catégorie : Chimiques
nom_risque : Inhalation fumées de soudure
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Aspiration localisée + ventilation.

nom_risque : Poussières métalliques
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Masque + aspiration.

nom_risque : Solvants de nettoyage
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Gants + ventilation.

nom_risque : Pâtes abrasives
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Gants, hygiène des mains.

 UT4 — POSTE DE TRAVAIL ASSIS / SERTISSAGE
Catégorie : Ergonomiques / TMS
nom_risque : Gestes répétitifs
gravite_default : 3
frequence_default : 4
P = 12
action_recommandee : Alternance tâches, pauses régulières.

nom_risque : Postures statiques prolongées
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Siège ergonomique, réglage établi.

nom_risque : Ergonomie insuffisante
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Investissement mobilier adapté.

 UT5 — STOCKAGE PRODUITS / CHIMIQUES / GAZ
Catégorie : Chimiques
nom_risque : Produits de décapage acides
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Gants, lunettes, stockage sécurisé.

nom_risque : Produits de nettoyage locaux
gravite_default : 2
frequence_default : 2
P = 4
action_recommandee : Respect des doses.

Catégorie : Incendie & Explosion
nom_risque : Produits inflammables mal stockés
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Armoires sécurisées ventilées.

nom_risque : Risque incendie chalumeaux
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Extincteur classe adaptée + formation.

nom_risque : Fuite de gaz
gravite_default : 4
frequence_default : 1
P = 4
action_recommandee : Contrôle périodique installations.

 UT6 — INSTALLATIONS / ORGANISATION GÉNÉRALE
Catégorie : Électriques & Machines
nom_risque : Outils électroportatifs
gravite_default : 3
frequence_default : 3
P = 9
action_recommandee : Formation + carters protection.

nom_risque : Installation électrique défectueuse
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Vérification annuelle.

nom_risque : Multiprises surchargées
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Limiter branchements multiples.

Catégorie : Organisationnels
nom_risque : Absence de procédures sécurité
gravite_default : 4
frequence_default : 2
P = 8
action_recommandee : Rédiger protocoles écrits.

nom_risque : Charge de travail déséquilibrée
gravite_default : 2
frequence_default : 3
P = 6
action_recommandee : Planification.

nom_risque : Manque de formation sécurité
gravite_default : 3
frequence_default : 2
P = 6
action_recommandee : Formation annuelle obligatoire.
