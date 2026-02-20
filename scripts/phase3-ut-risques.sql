-- =======================================================
-- PHASE 3 — UTs et Risques pour les métiers manquants
-- SNACK, TRANSPORT, PHARMACIE, COMMERCE, NETTOYAGE, BUREAU
-- =======================================================

BEGIN;

-- ========================
-- MÉTIER : SNACK (Snack / Restauration rapide)
-- ========================

INSERT INTO unites_travail (id, "metierCode", nom, description, ordre, "createdAt", "updatedAt") VALUES
('ut_snack_01', 'SNACK', 'UT1 : Accueil / Caisse / Service client',   'Zone de commande, encaissement et relation client', 1, NOW(), NOW()),
('ut_snack_02', 'SNACK', 'UT2 : Poste Cuisson (friteuses / plaques)',  'Friteuses, plaques de cuisson, fours', 2, NOW(), NOW()),
('ut_snack_03', 'SNACK', 'UT3 : Poste Préparation / Découpe',          'Préparation et assemblage des aliments', 3, NOW(), NOW()),
('ut_snack_04', 'SNACK', 'UT4 : Zone Stockage / Chambre froide',       'Réserves, chambres froides, congélateurs', 4, NOW(), NOW()),
('ut_snack_05', 'SNACK', 'UT5 : Plonge / Nettoyage',                   'Laverie, nettoyage surfaces et matériel', 5, NOW(), NOW()),
('ut_snack_06', 'SNACK', 'UT6 : Locaux / Installations / Électricité', 'Zones générales, électricité, sorties de secours', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO risques_metier (id, "categorieCode", "metierCode", "uniteTravailId", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
-- UT1 Psychosociaux
('rm_snack_01','PSYCHOSOCIAUX','SNACK','ut_snack_01','Stress lié au rythme soutenu','Pics d''activité importants entraînant surcharge et pression continue.',3,3,'Prévoir renforts et organiser le planning intelligemment.',true,NOW(),NOW()),
('rm_snack_02','PSYCHOSOCIAUX','SNACK','ut_snack_01','Pression clientèle','Exigence forte de rapidité pouvant générer tensions et erreurs.',2,3,'Encadrer les files et mettre en place des procédures de communication.',true,NOW(),NOW()),
('rm_snack_03','PSYCHOSOCIAUX','SNACK','ut_snack_01','Conflits internes','Communication difficile lors de périodes de rush.',2,2,'Clarifier les rôles et instaurer un briefing quotidien.',true,NOW(),NOW()),
-- UT1 Biologiques
('rm_snack_04','BIOLOGIQUE','SNACK','ut_snack_01','Contact avec la clientèle','Exposition aux virus et bactéries lors des échanges avec les clients.',2,3,'Hygiène des mains, nettoyage des surfaces, gestes barrières.',true,NOW(),NOW()),
-- UT2 Physiques
('rm_snack_05','PHYSIQUE','SNACK','ut_snack_02','Brûlures par friteuse et surfaces chaudes','Contact avec l''huile chaude, projections lors de la manipulation.',4,3,'Former aux gestes sécurisés et maintenir un matériel entretenu.',true,NOW(),NOW()),
('rm_snack_06','PHYSIQUE','SNACK','ut_snack_02','Brûlures par vapeur','Ouverture de couvercles chauds ou remontées de vapeur lors des cuissons.',3,3,'Porter gants adaptés et ouvrir lentement les cuves.',true,NOW(),NOW()),
('rm_snack_07','PHYSIQUE','SNACK','ut_snack_02','Chutes dues aux sols gras ou humides','Sols glissants liés à l''huile, sauces ou eau renversée en cuisine.',3,4,'Mise en place de tapis antidérapants et nettoyage immédiat.',true,NOW(),NOW()),
-- UT2 Incendie
('rm_snack_08','INCENDIE','SNACK','ut_snack_02','Risque incendie lié aux friteuses','Surchauffe ou débordement d''huile lors de la cuisson.',4,2,'Installer extincteur type F et respecter les niveaux d''huile.',true,NOW(),NOW()),
('rm_snack_09','INCENDIE','SNACK','ut_snack_02','Incendie lié à hotte encrassée','Départ de feu lié à l''accumulation de graisses dans les filtres.',4,3,'Nettoyer les filtres hebdomadairement.',true,NOW(),NOW()),
-- UT3 Physiques
('rm_snack_10','PHYSIQUE','SNACK','ut_snack_03','Coupures liées aux couteaux et trancheurs','Manipulation quotidienne de couteaux et lames pour la préparation.',3,3,'Stockage sécurisé, gants anti-coupures, affûtage régulier.',true,NOW(),NOW()),
('rm_snack_11','PHYSIQUE','SNACK','ut_snack_03','TMS bras / gestes répétitifs','Gestes rapides et répétitifs au poste de préparation.',2,4,'Alterner les tâches et ajuster la hauteur des postes.',true,NOW(),NOW()),
-- UT3 Organisationnels
('rm_snack_12','ORGANISATIONNELS','SNACK','ut_snack_03','Hygiène alimentaire insuffisante','Risques de contamination croisée liés au rythme rapide.',4,3,'Appliquer strictement les méthodes HACCP.',true,NOW(),NOW()),
('rm_snack_13','ORGANISATIONNELS','SNACK','ut_snack_03','Traçabilité alimentaire déficiente','Absence d''étiquetage ou gestion approximative des produits ouverts.',3,3,'Étiqueter systématiquement les denrées.',true,NOW(),NOW()),
-- UT4 Organisationnels
('rm_snack_14','ORGANISATIONNELS','SNACK','ut_snack_04','Rupture de la chaîne du froid','Défaut de contrôle des températures lors du stockage.',4,3,'Tenir un registre et vérifier les équipements quotidiennement.',true,NOW(),NOW()),
('rm_snack_15','ORGANISATIONNELS','SNACK','ut_snack_04','Entretien insuffisant des hottes et fours','Accumulation de graisse augmentant les risques d''incendie.',4,3,'Nettoyage programmé et suivi régulier.',true,NOW(),NOW()),
-- UT5 Chimiques
('rm_snack_16','CHIMIQUE','SNACK','ut_snack_05','Exposition aux dégraissants puissants','Contact cutané ou inhalation de produits pour nettoyer les surfaces.',3,3,'Porter gants adaptés et respecter les dilutions.',true,NOW(),NOW()),
('rm_snack_17','CHIMIQUE','SNACK','ut_snack_05','Inhalation de vapeurs de cuisson','Fumées grasses dégagées par les cuissons successives.',2,4,'Assurer l''efficacité des hottes et ventilation.',true,NOW(),NOW()),
('rm_snack_18','CHIMIQUE','SNACK','ut_snack_05','Désinfectants alimentaires concentrés','Irritations lors de la dilution ou du nettoyage des surfaces.',2,3,'Porter des gants et diluer dans un espace ventilé.',true,NOW(),NOW()),
-- UT6 Incendie
('rm_snack_19','INCENDIE','SNACK','ut_snack_06','Surcharge de prises électriques','Multiplication d''appareils branchés sur un même circuit.',3,2,'Répartir les charges et vérifier l''installation.',true,NOW(),NOW()),
('rm_snack_20','INCENDIE','SNACK','ut_snack_06','Issues de secours encombrées','Zones d''évacuation bloquées par des cartons ou stocks.',3,2,'Dégager les passages et maintenir la signalisation visible.',true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================
-- MÉTIER : TRANSPORT (Transport / Livraison)
-- ========================

INSERT INTO unites_travail (id, "metierCode", nom, description, ordre, "createdAt", "updatedAt") VALUES
('ut_trans_01', 'TRANSPORT', 'UT1 : Conduite / Circulation routière',         'Déplacements en véhicule, conduite sur voie publique', 1, NOW(), NOW()),
('ut_trans_02', 'TRANSPORT', 'UT2 : Chargement / Déchargement',               'Manutention des colis et marchandises', 2, NOW(), NOW()),
('ut_trans_03', 'TRANSPORT', 'UT3 : Relation client / Livraison sur site',     'Remise des colis, contact client final', 3, NOW(), NOW()),
('ut_trans_04', 'TRANSPORT', 'UT4 : Carburant / Produits et entretien courant','Plein carburant, entretien courant véhicule', 4, NOW(), NOW()),
('ut_trans_05', 'TRANSPORT', 'UT5 : Organisation des tournées',                'Planification des itinéraires et des livraisons', 5, NOW(), NOW()),
('ut_trans_06', 'TRANSPORT', 'UT6 : Véhicule / Sécurité / Incendie',          'Maintenance, sécurité électrique, produits à bord', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO risques_metier (id, "categorieCode", "metierCode", "uniteTravailId", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
-- UT1 Physiques
('rm_trans_01','PHYSIQUE','TRANSPORT','ut_trans_01','Risque routier — circulation','Accidents de la route lors des déplacements professionnels.',5,3,'Conduite préventive, entretien régulier, pauses réglementaires.',true,NOW(),NOW()),
('rm_trans_02','PHYSIQUE','TRANSPORT','ut_trans_01','Risque routier — stationnement / manœuvres','Accidents lors des stationnements et manœuvres en milieu urbain.',4,3,'Formation manœuvres sécurisées, caméra de recul.',true,NOW(),NOW()),
-- UT1 Psychosociaux
('rm_trans_03','PSYCHOSOCIAUX','TRANSPORT','ut_trans_01','Pression liée aux délais','Stress généré par des délais de livraison très courts.',3,4,'Marges horaires réalistes, organisation planning.',true,NOW(),NOW()),
('rm_trans_04','PSYCHOSOCIAUX','TRANSPORT','ut_trans_01','Isolement professionnel','Travail seul en véhicule sur de longues durées.',2,3,'Procédures d''alerte, contact régulier avec le dépôt.',true,NOW(),NOW()),
('rm_trans_05','PSYCHOSOCIAUX','TRANSPORT','ut_trans_01','Manque de pauses / fatigue','Fatigue liée à la conduite prolongée sans repos suffisant.',4,3,'Pause 15 min toutes les 2h, respect réglementation.',true,NOW(),NOW()),
-- UT2 Physiques
('rm_trans_06','PHYSIQUE','TRANSPORT','ut_trans_02','Port de charges','Manutention répétée de colis pouvant être lourds.',3,4,'Diable, transpalette, formation gestes et postures.',true,NOW(),NOW()),
('rm_trans_07','PHYSIQUE','TRANSPORT','ut_trans_02','TMS épaules / dos','Douleurs musculo-squelettiques liées à la manutention répétée.',3,4,'Optimisation rangement véhicule, alternance des tâches.',true,NOW(),NOW()),
('rm_trans_08','PHYSIQUE','TRANSPORT','ut_trans_02','Chutes de hauteur (camion / fourgon)','Chute lors de la montée/descente du véhicule.',3,2,'Marchepied antidérapant, poignées de maintien.',true,NOW(),NOW()),
('rm_trans_09','PHYSIQUE','TRANSPORT','ut_trans_02','Chutes de plain-pied','Chutes sur le sol lors des livraisons (pavés, escaliers).',2,3,'Chaussures antidérapantes, vigilance terrain.',true,NOW(),NOW()),
-- UT2 Organisationnels
('rm_trans_10','ORGANISATIONNELS','TRANSPORT','ut_trans_02','Mauvaise répartition du chargement','Chargement déséquilibré pouvant affecter la stabilité du véhicule.',3,2,'Sanglage et répartition homogène des charges.',true,NOW(),NOW()),
-- UT3 Psychosociaux
('rm_trans_11','PSYCHOSOCIAUX','TRANSPORT','ut_trans_03','Relation client difficile','Tensions lors de la livraison (erreurs, délais, accès difficile).',2,2,'Procédure d''accueil et communication adaptée.',true,NOW(),NOW()),
-- UT4 Chimiques
('rm_trans_12','CHIMIQUE','TRANSPORT','ut_trans_04','Exposition carburant','Contact cutané ou inhalation de vapeurs lors du plein.',2,2,'Gants, éviter inhalation vapeurs, pas de siphonnage.',true,NOW(),NOW()),
('rm_trans_13','CHIMIQUE','TRANSPORT','ut_trans_04','Produits d''entretien véhicule','Contact avec liquide de frein, huile moteur lors de l''entretien.',2,2,'Gants, lavage mains après manipulation.',true,NOW(),NOW()),
-- UT5 Organisationnels
('rm_trans_14','ORGANISATIONNELS','TRANSPORT','ut_trans_05','Planification imprécise','Tournées mal organisées générant du stress et des retards.',2,3,'Optimisation GPS, ordre logique des livraisons.',true,NOW(),NOW()),
-- UT6 Incendie
('rm_trans_15','INCENDIE','TRANSPORT','ut_trans_06','Véhicule mal entretenu','Risque de panne ou d''incendie lié à un entretien insuffisant.',4,2,'Maintenance régulière, contrôle technique à jour.',true,NOW(),NOW()),
('rm_trans_16','INCENDIE','TRANSPORT','ut_trans_06','Surchauffe électrique (chargeurs, batteries)','Risque de court-circuit lié au chargement d''appareils dans le véhicule.',3,2,'Débrancher hors usage, ne pas laisser charger sans surveillance.',true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================
-- MÉTIER : PHARMACIE (Pharmacie / Parapharmacie)
-- ========================

INSERT INTO unites_travail (id, "metierCode", nom, description, ordre, "createdAt", "updatedAt") VALUES
('ut_pharma_01', 'PHARMACIE', 'UT1 : Accueil patient / Conseil / Encaissement', 'Comptoir d''accueil, conseil client, encaissement', 1, NOW(), NOW()),
('ut_pharma_02', 'PHARMACIE', 'UT2 : Surface de vente / Rayons',                 'Rangement, réassort, orientation client en rayon', 2, NOW(), NOW()),
('ut_pharma_03', 'PHARMACIE', 'UT3 : Réserve / Stockage / Réassort',             'Stockage des médicaments et produits, réassort', 3, NOW(), NOW()),
('ut_pharma_04', 'PHARMACIE', 'UT4 : Entretien / Désinfection',                   'Nettoyage des locaux et matériels', 4, NOW(), NOW()),
('ut_pharma_05', 'PHARMACIE', 'UT5 : Locaux / Circulation / Sécurité',            'Zones de circulation, sécurité générale', 5, NOW(), NOW()),
('ut_pharma_06', 'PHARMACIE', 'UT6 : Manipulation produits sensibles',            'Médicaments, alcool, désinfectants concentrés', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO risques_metier (id, "categorieCode", "metierCode", "uniteTravailId", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
-- UT1 Physiques
('rm_pharma_01','PHYSIQUE','PHARMACIE','ut_pharma_01','Station debout prolongée','Travail debout continu au comptoir toute la journée.',2,4,'Tapis anti-fatigue, alternance assis/debout.',true,NOW(),NOW()),
('rm_pharma_02','PHYSIQUE','PHARMACIE','ut_pharma_01','Gestes répétitifs comptoir','Manipulation répétitive des boîtes de médicaments et du clavier.',2,4,'Poste ergonomique et pauses courtes régulières.',true,NOW(),NOW()),
-- UT1 Psychosociaux
('rm_pharma_03','PSYCHOSOCIAUX','PHARMACIE','ut_pharma_01','Pression liée au conseil patient','Responsabilité du conseil médical, peur de l''erreur.',2,3,'Formation continue, gestion du stress.',true,NOW(),NOW()),
('rm_pharma_04','PSYCHOSOCIAUX','PHARMACIE','ut_pharma_01','Exposition émotionnelle (maladies, urgences)','Contact régulier avec des patients en détresse ou gravement malades.',3,2,'Briefing d''équipe, soutien interne.',true,NOW(),NOW()),
('rm_pharma_05','PSYCHOSOCIAUX','PHARMACIE','ut_pharma_01','Périodes de forte affluence','Surcharge lors des épidémies, remboursements urgents.',2,4,'Renforcement des horaires, organisation file d''attente.',true,NOW(),NOW()),
-- UT1 Biologiques
('rm_pharma_06','BIOLOGIQUE','PHARMACIE','ut_pharma_01','Contact avec la clientèle','Transmission de pathogènes en contact avec des patients malades.',2,3,'Hygiène des mains, désinfection comptoir.',true,NOW(),NOW()),
-- UT2 Physiques
('rm_pharma_07','PHYSIQUE','PHARMACIE','ut_pharma_02','Chutes de plain-pied','Sol glissant, obstacles en rayon.',2,3,'Nettoyage immédiat, marquage au sol.',true,NOW(),NOW()),
('rm_pharma_08','PHYSIQUE','PHARMACIE','ut_pharma_02','TMS dos / épaules lors du réassort','Port et placement de boîtes en hauteur ou en profondeur.',3,3,'Formation gestes et postures, escabeau stable.',true,NOW(),NOW()),
-- UT2 Chimiques
('rm_pharma_09','CHIMIQUE','PHARMACIE','ut_pharma_02','Exposition aux aérosols','Pulvérisation accidentelle de produits en rayon.',2,3,'Ventilation, manipulation avec précaution.',true,NOW(),NOW()),
-- UT3 Physiques
('rm_pharma_10','PHYSIQUE','PHARMACIE','ut_pharma_03','TMS dos / épaules (manutention)','Port répété de cartons et manipulation en réserve.',3,3,'Diable ou chariot de transport.',true,NOW(),NOW()),
('rm_pharma_11','PHYSIQUE','PHARMACIE','ut_pharma_03','Stockage en hauteur','Risque de chute d''objet ou de chute de l''opérateur.',3,3,'Escabeau antidérapant, ne jamais se pencher en déséquilibre.',true,NOW(),NOW()),
-- UT3 Organisationnels
('rm_pharma_12','ORGANISATIONNELS','PHARMACIE','ut_pharma_03','Rupture / gestion dates de péremption','Risque d''erreur sur les dates courtes en cas de gestion manuelle.',2,3,'Procédure FIFO, vérification systématique.',true,NOW(),NOW()),
('rm_pharma_13','ORGANISATIONNELS','PHARMACIE','ut_pharma_03','Étiquetage et traçabilité non optimal','Erreur d''identification des produits lors du réassort.',3,2,'Double vérification + code-barres.',true,NOW(),NOW()),
-- UT4 Chimiques
('rm_pharma_14','CHIMIQUE','PHARMACIE','ut_pharma_04','Manipulation produits chimiques entretien','Contact avec détergents, désinfectants lors du nettoyage.',2,2,'Gants, stockage sécurisé des produits.',true,NOW(),NOW()),
('rm_pharma_15','CHIMIQUE','PHARMACIE','ut_pharma_04','Manipulation alcool et désinfectants','Risque de brûlure chimique ou d''inhalation lors des recharges.',2,3,'Gants lors des recharges, ventilation.',true,NOW(),NOW()),
-- UT5 Incendie
('rm_pharma_16','INCENDIE','PHARMACIE','ut_pharma_05','Surcharge des prises','Risque de court-circuit lié à la densité d''appareils.',3,2,'Contrôle régulier de l''installation électrique.',true,NOW(),NOW()),
('rm_pharma_17','INCENDIE','PHARMACIE','ut_pharma_05','Obstruction issues de secours','Zones de sortie bloquées par stockage temporaire.',4,2,'Zone interdite au stockage, contrôle régulier.',true,NOW(),NOW()),
-- UT6 Chimiques
('rm_pharma_18','CHIMIQUE','PHARMACIE','ut_pharma_06','Contact avec médicaments potentiellement irritants','Manipulation sans protection de médicaments cytotoxiques ou irritants.',2,3,'Lavage des mains, manipulation contrôlée, gants si nécessaire.',true,NOW(),NOW()),
-- UT6 Organisationnels
('rm_pharma_19','ORGANISATIONNELS','PHARMACIE','ut_pharma_06','Sécurité de la caisse','Risque de vol ou de manipulation frauduleuse.',3,2,'Coffre sécurisé, protocole fermeture.',true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================
-- MÉTIER : COMMERCE (Boutique / Prêt-à-porter)
-- ========================

INSERT INTO unites_travail (id, "metierCode", nom, description, ordre, "createdAt", "updatedAt") VALUES
('ut_com_01', 'COMMERCE', 'UT1 : Accueil / Vente / Encaissement', 'Accueil client, conseil, encaissement en boutique', 1, NOW(), NOW()),
('ut_com_02', 'COMMERCE', 'UT2 : Surface de vente / Rayons',       'Mise en rayon, présentation, aide à la vente', 2, NOW(), NOW()),
('ut_com_03', 'COMMERCE', 'UT3 : Réserve / Stockage / Réassort',   'Réserve, réassort, préparation des livraisons', 3, NOW(), NOW()),
('ut_com_04', 'COMMERCE', 'UT4 : Entretien / Nettoyage',           'Nettoyage de la surface de vente et des réserves', 4, NOW(), NOW()),
('ut_com_05', 'COMMERCE', 'UT5 : Cabines d''essayage',             'Gestion et entretien des cabines d''essayage', 5, NOW(), NOW()),
('ut_com_06', 'COMMERCE', 'UT6 : Locaux / Sécurité générale',      'Installations générales, sécurité incendie', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO risques_metier (id, "categorieCode", "metierCode", "uniteTravailId", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
-- UT1 Psychosociaux
('rm_com_01','PSYCHOSOCIAUX','COMMERCE','ut_com_01','Pression commerciale','Objectifs de vente élevés générant du stress.',2,3,'Formation commerciale, gestion du stress.',true,NOW(),NOW()),
('rm_com_02','PSYCHOSOCIAUX','COMMERCE','ut_com_01','Conflits clients','Mécontentements, remboursements, tensions.',2,2,'Procédure claire d''accueil et de gestion des conflits.',true,NOW(),NOW()),
('rm_com_03','PSYCHOSOCIAUX','COMMERCE','ut_com_01','Périodes de forte affluence','Surcharge lors des soldes, fêtes, promotions.',2,3,'Renfort temporaire, pauses planifiées.',true,NOW(),NOW()),
('rm_com_04','PSYCHOSOCIAUX','COMMERCE','ut_com_01','Solitude en période creuse','Travail seul en boutique pendant les heures creuses.',3,2,'Procédure sécurité, contact d''urgence disponible.',true,NOW(),NOW()),
-- UT1 Organisationnels
('rm_com_05','ORGANISATIONNELS','COMMERCE','ut_com_01','Absence procédure caisse','Risque d''erreurs ou de fraudes en l''absence de protocole.',2,2,'Formation caisse + procédure écrite.',true,NOW(),NOW()),
('rm_com_06','ORGANISATIONNELS','COMMERCE','ut_com_01','Vols internes / externes','Vol à l''étalage ou par le personnel.',2,3,'Système antivol, caméras, organisation vigilante.',true,NOW(),NOW()),
-- UT2 Physiques
('rm_com_07','PHYSIQUE','COMMERCE','ut_com_02','Chutes de plain-pied','Obstacles, sol mouillé, câbles en surface de vente.',2,4,'Allées dégagées, nettoyage immédiat.',true,NOW(),NOW()),
('rm_com_08','PHYSIQUE','COMMERCE','ut_com_02','TMS poignets / mains','Gestes répétitifs lors de l''étiquetage, rangement, scannage.',2,4,'Outils ergonomiques, pauses régulières.',true,NOW(),NOW()),
('rm_com_09','PHYSIQUE','COMMERCE','ut_com_02','TMS épaules / bras','Port de vêtements, cintres, manipulation de meubles de présentation.',3,3,'Varier les tâches, escabeau stable.',true,NOW(),NOW()),
-- UT3 Physiques
('rm_com_10','PHYSIQUE','COMMERCE','ut_com_03','Port de charges légères répétées','Port répété de cartons lors du réassort.',2,3,'Porter près du corps, chariots de transport.',true,NOW(),NOW()),
('rm_com_11','PHYSIQUE','COMMERCE','ut_com_03','Stock mal organisé','Risque de chute d''objets en réserve mal rangée.',3,3,'Rangement sécurisé, rayonnages stables.',true,NOW(),NOW()),
-- UT3 Organisationnels
('rm_com_12','ORGANISATIONNELS','COMMERCE','ut_com_03','Mauvaise gestion des réassorts','Désorganisation pouvant générer des surcharges ponctuelles.',2,3,'Horaires dédiés au réassort, planification.',true,NOW(),NOW()),
-- UT4 Chimiques
('rm_com_13','CHIMIQUE','COMMERCE','ut_com_04','Produits de nettoyage','Contact avec détergents lors du nettoyage.',2,2,'Port de gants, respect des doses.',true,NOW(),NOW()),
('rm_com_14','CHIMIQUE','COMMERCE','ut_com_04','Désodorisation / parfums','Exposition aux parfums d''ambiance en espace clos.',1,3,'Ventilation naturelle, produits modérés.',true,NOW(),NOW()),
-- UT5 Incendie
('rm_com_15','INCENDIE','COMMERCE','ut_com_05','Éclairage insuffisant en cabines','Risque de chute ou d''accident lié à un mauvais éclairage.',1,3,'Vérification régulière de l''éclairage des cabines.',true,NOW(),NOW()),
-- UT6 Incendie
('rm_com_16','INCENDIE','COMMERCE','ut_com_06','Surcharge électrique','Risque incendie lié à des multiprises surchargées.',3,2,'Répartition conforme, contrôle installation.',true,NOW(),NOW()),
('rm_com_17','INCENDIE','COMMERCE','ut_com_06','Blocage issues de secours','Sorties obstruées par du stock ou du mobilier.',4,2,'Zone interdite au stockage, contrôle hebdomadaire.',true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================
-- MÉTIER : NETTOYAGE (Nettoyage / Entretien)
-- ========================

INSERT INTO unites_travail (id, "metierCode", nom, description, ordre, "createdAt", "updatedAt") VALUES
('ut_net_01', 'NETTOYAGE', 'UT1 : Préparation / Organisation de l''intervention', 'Préparation du matériel et planning d''intervention', 1, NOW(), NOW()),
('ut_net_02', 'NETTOYAGE', 'UT2 : Lavage des sols / Sanitaires',                  'Nettoyage des sols, sanitaires et surfaces', 2, NOW(), NOW()),
('ut_net_03', 'NETTOYAGE', 'UT3 : Nettoyage en hauteur / Vitres',                 'Lavage vitres, néons, surfaces en hauteur', 3, NOW(), NOW()),
('ut_net_04', 'NETTOYAGE', 'UT4 : Utilisation produits chimiques',                 'Manipulation des détergents et désinfectants', 4, NOW(), NOW()),
('ut_net_05', 'NETTOYAGE', 'UT5 : Gestion déchets / Tri / Poubelles',             'Collecte et évacuation des déchets', 5, NOW(), NOW()),
('ut_net_06', 'NETTOYAGE', 'UT6 : Relation usagers / Sécurité locaux',            'Interaction avec les occupants des locaux', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO risques_metier (id, "categorieCode", "metierCode", "uniteTravailId", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
-- UT1 Organisationnels
('rm_net_01','ORGANISATIONNELS','NETTOYAGE','ut_net_01','Oubli signalisation zones mouillées','Absence de panneau avant lavage générant un risque de chute tiers.',3,3,'Vérification systématique du panneau avant lavage.',true,NOW(),NOW()),
('rm_net_02','ORGANISATIONNELS','NETTOYAGE','ut_net_01','Matériel défectueux','Utilisation de matériel usé ou cassé pouvant blesser.',2,3,'Inventaire régulier, remplacement immédiat.',true,NOW(),NOW()),
('rm_net_03','ORGANISATIONNELS','NETTOYAGE','ut_net_01','Absence de formation produits','Non-connaissance des risques des produits utilisés.',3,2,'Formation fiches FDS obligatoire pour tout le personnel.',true,NOW(),NOW()),
-- UT1 Psychosociaux
('rm_net_04','PSYCHOSOCIAUX','NETTOYAGE','ut_net_01','Pression du temps / cadences élevées','Délais courts pour couvrir de grandes surfaces.',2,3,'Répartition réaliste des tâches, pauses.',true,NOW(),NOW()),
-- UT2 Physiques
('rm_net_05','PHYSIQUE','NETTOYAGE','ut_net_02','Glissade sur sol mouillé','Chute lors du lavage des sols sans protection antidérapante.',3,4,'Panneaux sol glissant, chaussures antidérapantes.',true,NOW(),NOW()),
('rm_net_06','PHYSIQUE','NETTOYAGE','ut_net_02','TMS dos / lombaires','Torsions et flexions répétées lors du lavage des sols.',3,4,'Seaux roulants, vadrouilles longues, gestes et postures.',true,NOW(),NOW()),
-- UT2 Organisationnels
('rm_net_07','ORGANISATIONNELS','NETTOYAGE','ut_net_02','Mauvaise gestion des déchets','Tri incorrect ou sacs trop lourds générant des blessures.',3,2,'Sacs plus petits, tri clair, formation.',true,NOW(),NOW()),
-- UT3 Physiques
('rm_net_08','PHYSIQUE','NETTOYAGE','ut_net_03','Chutes de hauteur (escabeau)','Chute lors du nettoyage en hauteur avec un escabeau instable.',3,3,'Escabeau sécurisé, perche télescopique pour les vitres.',true,NOW(),NOW()),
('rm_net_09','PHYSIQUE','NETTOYAGE','ut_net_03','TMS épaules / bras','Efforts répétés avec les bras en hauteur.',2,4,'Alternance tâches, perches légères adaptées.',true,NOW(),NOW()),
('rm_net_10','PHYSIQUE','NETTOYAGE','ut_net_03','Projections dans les yeux','Éclaboussures de produits lors du lavage de vitres.',3,2,'Lunettes de protection obligatoires.',true,NOW(),NOW()),
-- UT4 Chimiques
('rm_net_11','CHIMIQUE','NETTOYAGE','ut_net_04','Détergents irritants','Contact cutané et inhalation de produits irritants.',3,4,'Gants nitrile, ventilation des locaux.',true,NOW(),NOW()),
('rm_net_12','CHIMIQUE','NETTOYAGE','ut_net_04','Eau de javel','Risque de brûlure chimique et d''inhalation de chlore.',4,3,'Ne jamais mélanger, gants et lunettes obligatoires.',true,NOW(),NOW()),
('rm_net_13','CHIMIQUE','NETTOYAGE','ut_net_04','Mélanges accidentels (javel + acide)','Dégagement de gaz toxiques mortels.',5,1,'Interdiction stricte de mélange, formation obligatoire.',true,NOW(),NOW()),
('rm_net_14','CHIMIQUE','NETTOYAGE','ut_net_04','Aérosols désinfectants','Inhalation lors de la pulvérisation en espace confiné.',3,2,'Pulvériser avec porte ouverte, aération.',true,NOW(),NOW()),
('rm_net_15','CHIMIQUE','NETTOYAGE','ut_net_04','Dégraissants industriels','Corrosion cutanée et inhalation lors de l''application.',4,2,'Gants épais, lunettes de protection.',true,NOW(),NOW()),
-- UT5 Physiques
('rm_net_16','PHYSIQUE','NETTOYAGE','ut_net_05','Coupures lors de la collecte des déchets','Contact avec objets tranchants dans les poubelles.',3,2,'Gants renforcés, ne jamais compresser à la main.',true,NOW(),NOW()),
-- UT6 Psychosociaux
('rm_net_17','PSYCHOSOCIAUX','NETTOYAGE','ut_net_06','Travail isolé','Intervention seul en dehors des heures de bureau.',3,3,'Dispositif d''alerte, vérification à intervalles réguliers.',true,NOW(),NOW()),
('rm_net_18','PSYCHOSOCIAUX','NETTOYAGE','ut_net_06','Exposition aux incivilités / usagers','Tensions avec des occupants des locaux.',2,2,'Procédure gestion conflits, signalement hiérarchique.',true,NOW(),NOW()),
-- UT6 Incendie
('rm_net_19','INCENDIE','NETTOYAGE','ut_net_06','Stockage produits inflammables','Produits stockés à proximité de sources de chaleur.',3,2,'Stockage sécurisé, armoire dédiée.',true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

-- ========================
-- MÉTIER : BUREAU (Administratif / Bureautique / Assurance / Cabinets)
-- ========================

INSERT INTO unites_travail (id, "metierCode", nom, description, ordre, "createdAt", "updatedAt") VALUES
('ut_bur_01', 'BUREAU', 'UT1 : Poste de travail informatique / Secrétariat', 'Travail sur écran, saisie, gestion administrative', 1, NOW(), NOW()),
('ut_bur_02', 'BUREAU', 'UT2 : Accueil / Standard téléphonique',              'Accueil physique et téléphonique des clients', 2, NOW(), NOW()),
('ut_bur_03', 'BUREAU', 'UT3 : Archivage / Gestion documentaire',             'Classement, archivage papier et numérique', 3, NOW(), NOW()),
('ut_bur_04', 'BUREAU', 'UT4 : Salle de réunion / Espaces communs',           'Réunions, espaces de pause et de vie', 4, NOW(), NOW()),
('ut_bur_05', 'BUREAU', 'UT5 : Locaux / Sécurité générale',                   'Sécurité des installations, sorties de secours', 5, NOW(), NOW()),
('ut_bur_06', 'BUREAU', 'UT6 : Entretien / Nettoyage des locaux',             'Nettoyage et entretien des bureaux', 6, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO risques_metier (id, "categorieCode", "metierCode", "uniteTravailId", nom, description, gravite, frequence, "mesuresSuggerees", "isActive", "createdAt", "updatedAt") VALUES
-- UT1 Physiques (ergonomiques via PHYSIQUE)
('rm_bur_01','PHYSIQUE','BUREAU','ut_bur_01','TMS liés au travail sur écran','Douleurs cervicales, dorsales et aux poignets liées à la posture prolongée.',3,4,'Réglage du poste, écran à hauteur des yeux, pauses toutes les heures.',true,NOW(),NOW()),
('rm_bur_02','PHYSIQUE','BUREAU','ut_bur_01','Fatigue visuelle','Fatigue oculaire due à une exposition prolongée aux écrans.',2,4,'Règle 20-20-20, protection anti-lumière bleue.',true,NOW(),NOW()),
-- UT1 Psychosociaux
('rm_bur_03','PSYCHOSOCIAUX','BUREAU','ut_bur_01','Surcharge de travail / stress','Accumulation de dossiers, délais serrés, charge cognitive élevée.',3,3,'Organisation du travail, répartition des tâches, pauses.',true,NOW(),NOW()),
('rm_bur_04','PSYCHOSOCIAUX','BUREAU','ut_bur_01','Risques psychosociaux (RPS)','Conflits internes, manque de reconnaissance, isolement.',3,2,'Entretiens réguliers, management participatif.',true,NOW(),NOW()),
-- UT1 Organisationnels
('rm_bur_05','ORGANISATIONNELS','BUREAU','ut_bur_01','Absence de procédures formalisées','Risque d''erreur ou de perte de données en l''absence de process.',3,2,'Rédiger et diffuser les procédures clés.',true,NOW(),NOW()),
-- UT2 Psychosociaux
('rm_bur_06','PSYCHOSOCIAUX','BUREAU','ut_bur_02','Pression relation client','Gestion de clients mécontents ou exigeants au téléphone et en face-à-face.',2,3,'Formation relation client, protocole de désamorçage.',true,NOW(),NOW()),
-- UT2 Physiques
('rm_bur_07','PHYSIQUE','BUREAU','ut_bur_02','Station debout prolongée à l''accueil','Fatigue physique liée au poste d''accueil debout.',2,3,'Tapis anti-fatigue, possibilité d''assise.',true,NOW(),NOW()),
-- UT3 Physiques
('rm_bur_08','PHYSIQUE','BUREAU','ut_bur_03','Port de charges (cartons d''archives)','Port de boîtes d''archives lourdes lors des déménagements.',3,2,'Formation gestes et postures, diable.',true,NOW(),NOW()),
('rm_bur_09','PHYSIQUE','BUREAU','ut_bur_03','Chutes de plain-pied (local archives)','Sol encombré, mauvais éclairage dans les locaux d''archives.',2,2,'Maintenir les allées dégagées, éclairage suffisant.',true,NOW(),NOW()),
-- UT3 Organisationnels
('rm_bur_10','ORGANISATIONNELS','BUREAU','ut_bur_03','Perte ou destruction de données','Risque de perte de documents sensibles (papier ou numérique).',3,2,'Sauvegardes régulières, armoires sécurisées.',true,NOW(),NOW()),
-- UT4 Psychosociaux
('rm_bur_11','PSYCHOSOCIAUX','BUREAU','ut_bur_04','Tensions en réunion','Conflits interpersonnels lors des discussions d''équipe.',2,2,'Animation structurée, règles de réunion.',true,NOW(),NOW()),
-- UT5 Incendie
('rm_bur_12','INCENDIE','BUREAU','ut_bur_05','Surcharge électrique (multiprises)','Risque incendie lié à trop d''appareils sur un même circuit.',3,2,'Limiter les multiprises, contrôle installation.',true,NOW(),NOW()),
('rm_bur_13','INCENDIE','BUREAU','ut_bur_05','Issues de secours obstruées','Sorties bloquées par du mobilier ou des cartons.',3,2,'Contrôle mensuel, zone interdite au stockage.',true,NOW(),NOW()),
-- UT6 Chimiques
('rm_bur_14','CHIMIQUE','BUREAU','ut_bur_06','Produits de nettoyage bureaux','Contact avec détergents lors du nettoyage des locaux.',2,2,'Gants, respect des doses.',true,NOW(),NOW()),
-- UT6 Organisationnels
('rm_bur_15','ORGANISATIONNELS','BUREAU','ut_bur_06','Absence de protocole nettoyage','Absence de planning de nettoyage pouvant affecter l''hygiène.',2,2,'Planning écrit et affiché, contrôle régulier.',true,NOW(),NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
