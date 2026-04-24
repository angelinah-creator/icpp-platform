1) Explication du changement
Petit modification dans le calcul
Problème actuel 
Dans les données actuelles, le champ P a été utilisé comme F×G (ex : “P=12”), alors que dans le DUERP modèle, P signifie pondération liée au niveau de maîtrise (un coefficient < 1).
Nouveau modèle  du DUERP 
On distingue 3 choses :
A) Cotation brute (avant prévention)
•	risque_brut = F × G

B) Pondération / maîtrise (P)
•	P = coefficient selon les mesures déjà en place (maîtrise du risque)

C) Cotation résiduelle (après prévention)
•	risque_residuel = F × G × P

Barème Pondération P 
niveau_maitrise (enum) → P
•	Aucune → 1

•	Partielle (EPI / rappel simple) → 0,7

•	Organisationnelle (procédure, rotation, planning, formation) → 0,5

•	Protection collective (hotte, aspiration, capotage, antidérapant…) → 0,3

•	Maîtrise optimale → 0,2

Priorité d’action calcul auto
Sur la base du risque résiduel :
•	>= 12 → Critique

•	>= 8 → Élevé

•	>= 4 → Modéré

•	< 4 → Faible

✅ Migration (pour ne rien casser)
•	L’ancien champ P (qui valait F×G) → renommer en risque_brut

•	Ajouter :
◦	niveau_maitrise (default “Aucune”)

◦	ponderation (default 1)

◦	risque_residuel (calculé)

◦	priorite_action (calculée)

✅ Données à stocker vs calculer
À stocker :
•	métier, UT, catégorie, risque, description, action_recommandee, F, G, niveau_maitrise (+ éventuellement “mesures existantes” texte)

À calculer :
•	risque_brut, ponderation, risque_residuel, priorite_action


2) Liste recalculée (métier par métier)
Hypothèses par défaut :
•	niveau_maitrise_default = "Aucune"

•	P = 1

•	donc risque_residuel = risque_brut


1) Explication du changement pour le dev (copier-coller)
✅ Problème actuel
Dans les données actuelles, le champ P a été utilisé comme F×G (ex : “P=12”), alors que dans le DUERP modèle, P signifie pondération liée au niveau de maîtrise (un coefficient < 1).
✅ Nouveau modèle (celui du DUERP que tu veux)
On distingue 3 choses :
A) Cotation brute (avant prévention)
•	risque_brut = F × G

B) Pondération / maîtrise (P)
•	P = coefficient selon les mesures déjà en place (maîtrise du risque)

C) Cotation résiduelle (après prévention)
•	risque_residuel = F × G × P

✅ Barème Pondération P (simple à coder)
niveau_maitrise (enum) → P
•	Aucune → 1

•	Partielle (EPI / rappel simple) → 0,7

•	Organisationnelle (procédure, rotation, planning, formation) → 0,5

•	Protection collective (hotte, aspiration, capotage, antidérapant…) → 0,3

•	Maîtrise optimale → 0,2

✅ Priorité d’action (calcul auto)
Sur la base du risque résiduel :
•	>= 12 → Critique

•	>= 8 → Élevé

•	>= 4 → Modéré

•	< 4 → Faible

✅ Migration (pour ne rien casser)
•	L’ancien champ P (qui valait F×G) → renommer en risque_brut

•	Ajouter :
◦	niveau_maitrise (default “Aucune”)

◦	ponderation (default 1)

◦	risque_residuel (calculé)

◦	priorite_action (calculée)

✅ Données à stocker vs calculer
À stocker :
•	métier, UT, catégorie, risque, description, action_recommandee, F, G, niveau_maitrise (+ éventuellement “mesures existantes” texte)

À calculer :
•	risque_brut, ponderation, risque_residuel, priorite_action


2) Liste recalculée (métier par métier)
Hypothèses par défaut pour toute la base MVP :
•	niveau_maitrise_default = "Aucune"

•	P = 1

•	donc risque_residuel = risque_brut


MÉTIER 1 — COIFFURE / BARBIER
metier_nom : "Coiffure / Barbier"
UT1 — ACCUEIL / CAISSE / PRISE DE RENDEZ-VOUS
Catégorie : Psychosociaux
•	nom_risque : Stress lié à la clientèle
description_risque : Exigences fortes, remarques, conflits potentiels, pression sur les rendez-vous et l’attente.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Formation gestion relation client, règles d’apaisement, script d’accueil.

•	nom_risque : Rythme de travail soutenu
description_risque : Enchaînement de rendez-vous sans pause, pics d’activité, surcharge au comptoir.
gravite_default : 2
frequence_default : 4
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 8
risque_residuel_default : 8
priorite_action_default : Élevé
action_recommandee : Organisation du planning, temps tampon, pauses planifiées.

•	nom_risque : Conflits internes
description_risque : Tensions entre collègues autour des clients, des horaires, du partage des tâches.
gravite_default : 2
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 4
risque_residuel_default : 4
priorite_action_default : Modéré
action_recommandee : Temps d’échange, règles claires, point d’équipe hebdomadaire.

UT2 — POSTE COUPE / COIFFAGE
Catégorie : Physiques
•	nom_risque : TMS dos / épaules / nuque
description_risque : Station debout prolongée, bras levés, posture statique, mouvements répétitifs (brushing/coupe).
gravite_default : 3
frequence_default : 4
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 12
risque_residuel_default : 12
priorite_action_default : Critique
action_recommandee : Formation gestes & postures, fauteuils réglables, rotation des tâches, micro-pauses.

•	nom_risque : Coupures ciseaux / rasoirs / tondeuses
description_risque : Coupures lors de la coupe, du rasage, du nettoyage ou du changement de lames/embouts.
gravite_default : 2
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 4
risque_residuel_default : 4
priorite_action_default : Modéré
action_recommandee : Outils en bon état, rangement immédiat, procédure changement lames, trousse de secours.

•	nom_risque : Brûlures par appareils chauffants
description_risque : Contact de la peau avec fers, plaques, boucleurs, sèche-cheveux (air très chaud) ou eau trop chaude.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Contrôle température, supports isolants, rangement sécurisé, consignes aux salariés.

Catégorie : Organisationnels
•	nom_risque : Ergonomie du poste insuffisante
description_risque : Matériel/hauteur inadaptés (fauteuil, miroir, plan de travail) augmentant fatigue et TMS.
gravite_default : 3
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 9
risque_residuel_default : 9
priorite_action_default : Élevé
action_recommandee : Ajustement mobilier, investissement progressif, audit ergonomique simple.

UT3 — ZONE BAC / SHAMPOING
Catégorie : Physiques
•	nom_risque : Glissade zone bac
description_risque : Eau au sol, tapis mouillés, produits renversés autour des bacs.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Séchage immédiat, tapis absorbants, signalisation ponctuelle, chaussures adaptées.

•	nom_risque : TMS dos (flexion répétée)
description_risque : Position penchée prolongée lors des shampoings et soins, torsions du dos.
gravite_default : 3
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 9
risque_residuel_default : 9
priorite_action_default : Élevé
action_recommandee : Réglage hauteur du bac/siège, pauses, alternance tâches.

UT4 — ZONE TECHNIQUE (COLORATION / PRODUITS)
Catégorie : Chimiques
•	nom_risque : Décolorants – inhalation et contact
description_risque : Poussières/vapeurs et contact cutané lors de la préparation, application, rinçage.
gravite_default : 3
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 9
risque_residuel_default : 9
priorite_action_default : Élevé
action_recommandee : Gants adaptés, ventilation, respect FDS, préparation en zone dédiée.

•	nom_risque : Colorations – sensibilisation cutanée
description_risque : Risque d’irritation/allergie (contact peau), exposition répétée aux produits.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Port de gants, hygiène, respect des dosages/temps de pose, FDS accessibles.

•	nom_risque : Produits lissants / défrisants – vapeurs
description_risque : Inhalation de vapeurs irritantes en application (pièce peu ventilée).
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Ventilation renforcée, limiter exposition, suivre FDS, gants/masque si besoin.


Catégorie : Incendie & Locaux
•	nom_risque : Ventilation insuffisante
description_risque : Renouvellement d’air trop faible, accumulation de vapeurs/odeurs, inconfort.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Extraction d’air adaptée, entretien VMC, aération régulière.

UT5 — RÉSERVE / STOCK / PRODUITS
Catégorie : Incendie & Locaux
•	nom_risque : Produits inflammables mal stockés
description_risque : Stockage proche sources de chaleur, aérosols/alcools mal rangés.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Stockage éloigné chaleur, armoire adaptée, quantités limitées.

Catégorie : Organisationnels
•	nom_risque : Manque de procédures d’hygiène
description_risque : Consignes insuffisantes sur désinfection matériel/linge, risque sanitaire et non-conformité.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Protocole écrit + formation, check-list nettoyage, suivi.

•	nom_risque : Planning instable
description_risque : Changements de planning fréquents, sous-effectif ponctuel, stress et fatigue.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Planification anticipée, règles de remplacement, buffers horaires.

UT6 — LOCAUX / CIRCULATIONS / ENTRETIEN
Catégorie : Physiques
•	nom_risque : Chutes de plain-pied
description_risque : Sol glissant (cheveux, eau, produits), obstacles dans les allées.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Balayage après chaque client, allées dégagées, tapis antidérapants.

Catégorie : Chimiques
•	nom_risque : Produits de nettoyage
description_risque : Irritation cutanée/respiratoire lors de l’utilisation de détergents/désinfectants.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Gants, respect des doses, ventilation, stockage sécurisé.

Catégorie : Incendie & Locaux
•	nom_risque : Installation électrique surchargée
description_risque : Multiprises, appareils chauffants, risque de surchauffe/court-circuit.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Vérification installation, multiprises certifiées, éviter surcharges.


✅ MÉTIER 2 — ESTHÉTIQUE / ONGLES / BIEN-ÊTRE
metier_nom : "Esthétique / Onglerie / Bien-être"
UT1 — ACCUEIL / CAISSE / PRISE DE RENDEZ-VOUS
Catégorie : Psychosociaux
•	nom_risque : Pression liée à l’image et au résultat
description_risque : Attentes élevées des clients, risque d’insatisfaction, stress de performance.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Communication claire, gestion des attentes, soutien responsable.

•	nom_risque : Gestion approximative des rendez-vous
description_risque : Retards, chevauchements, surcharge administrative, tension client.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Outil planning, temps tampon, règles de confirmation.

•	nom_risque : Rythme soutenu en période de pointe
description_risque : Forte affluence (week-ends/fêtes), réduction des pauses, fatigue.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Limiter surbooking, renfort ponctuel, pauses planifiées.




UT2 — POSTE MANUCURE / ONGLES
Catégorie : Physiques
•	nom_risque : TMS mains / poignets
description_risque : Gestes fins répétitifs (pose gel, limage), posture fixe des mains.
gravite_default : 3
frequence_default : 4
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 12
risque_residuel_default : 12
priorite_action_default : Critique
action_recommandee : Alternance tâches, micro-pauses, matériel ergonomique, formation gestes.

•	nom_risque : TMS dos / épaules
description_risque : Posture penchée prolongée sur cliente, tension cervicale/épaules.
gravite_default : 3
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 9
risque_residuel_default : 9
priorite_action_default : Élevé
action_recommandee : Réglage sièges, soutien lombaire, pauses régulières, rotation.

•	nom_risque : Coupures petits instruments
description_risque : Coupures lors de l’usage de pinces/ciseaux/cutters, nettoyage et rangement.
gravite_default : 2
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 4
risque_residuel_default : 4
priorite_action_default : Modéré
action_recommandee : Rangement sécurisé, procédure de désinfection, instruments en bon état.

Catégorie : Chimiques
•	nom_risque : Solvants (vernis, dissolvants)
description_risque : Inhalation de vapeurs + contact cutané, irritation/allergies.
gravite_default : 3
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 9
risque_residuel_default : 9
priorite_action_default : Élevé
action_recommandee : Ventilation efficace, port de gants, flacons fermés, respect FDS.

•	nom_risque : Résines et gels UV
description_risque : Sensibilisation cutanée, contact répété, exposition lors de la pose.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Protection cutanée, respect FDS, éviter contact peau, hygiène des mains.

•	nom_risque : Huiles essentielles / parfums
description_risque : Risque d’allergies/irritations, gêne respiratoire en espace confiné.
gravite_default : 2
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 4
risque_residuel_default : 4
priorite_action_default : Modéré
action_recommandee : Limiter usage, aération, privilégier produits moins volatils.

UT3 — CABINE SOINS VISAGE / CORPS
Catégorie : Physiques
•	nom_risque : TMS dos / épaules
description_risque : Postures contraintes pendant les soins, gestes répétitifs de massage/soin.
gravite_default : 3
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 9
risque_residuel_default : 9
priorite_action_default : Élevé
action_recommandee : Table réglable, positionnement matériel, alternance soins, pauses.

•	nom_risque : Brûlures par cire chaude
description_risque : Cire trop chaude, coulures, contact peau lors de l’épilation.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Contrôle température, test avant application, protocole sécurité.

•	nom_risque : Chutes de plain-pied
description_risque : Sols glissants (huiles/produits), câbles, objets au sol en cabine.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Nettoyage immédiat, tapis antidérapants, câbles rangés.

Catégorie : Psychosociaux
•	nom_risque : Isolement en cabine
description_risque : Travail seul, difficulté à appeler à l’aide en cas d’incident.
gravite_default : 2
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 4
risque_residuel_default : 4
priorite_action_default : Modéré
action_recommandee : Procédure d’alerte, présence d’un collègue sur site, check-in.

UT4 — ZONE PRODUITS / DÉSINFECTION
Catégorie : Chimiques
•	nom_risque : Désinfectants concentrés
description_risque : Irritation cutanée/respiratoire lors des dilutions et usages répétés.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Gants, respect dilution, ventilation, stockage sécurisé.

•	nom_risque : Produits de peeling / acides
description_risque : Risque de brûlure/irritation, projection possible lors de l’application.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Protection oculaire si besoin, formation, respect FDS/protocoles.

Catégorie : Organisationnels
•	nom_risque : Hygiène du matériel insuffisamment encadrée
description_risque : Désinfection irrégulière, risque sanitaire et non-conformité.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Protocole écrit + registre suivi, formation, check-list.

•	nom_risque : Traçabilité des produits et soins insuffisante
description_risque : Absence d’historique produit/lot/soin, difficulté en cas d’incident client.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Fiches clients détaillées, suivi lots/dates, procédure.

UT5 — LOCAUX / CIRCULATIONS
Catégorie : Physiques
•	nom_risque : Chutes de plain-pied
description_risque : Sols humides, obstacles, passages étroits, câbles.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Sols propres et secs, rangement, tapis antidérapants.

UT6 — INSTALLATIONS ÉLECTRIQUES / INCENDIE
Catégorie : Incendie & Locaux
•	nom_risque : Utilisation de bougies / appareils chauffants
description_risque : Risque de départ de feu par bougies, chauffe-cire, appareils laissés sans surveillance.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Ne jamais laisser sans surveillance, zone dédiée, extincteur à proximité.

•	nom_risque : Surcharge de multiprises
description_risque : Trop d’équipements sur une même ligne, surchauffe/court-circuit.
gravite_default : 3
frequence_default : 2
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Répartition électrique, multiprises certifiées, contrôle périodique.

•	nom_risque : Ventilation des cabines insuffisante
description_risque : Air confiné, concentration de vapeurs/odeurs, gêne respiratoire.
gravite_default : 2
frequence_default : 3
niveau_maitrise_default : Aucune
ponderation_default : 1
risque_brut_default : 6
risque_residuel_default : 6
priorite_action_default : Modéré
action_recommandee : Extraction d’air efficace, entretien VMC, aération régulière.

