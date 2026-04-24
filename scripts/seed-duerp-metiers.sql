-- ============================================================================
-- Seed DUERP — Risques par métier (FIXED SCHEMA)
-- Métier 1 : Coiffure / Barbier
-- Métier 2 : Esthétique / Onglerie / Bien-être
-- ============================================================================

DO $$
DECLARE
    _coiffure_code TEXT := 'COIFFURE';
    _esthetique_code TEXT := 'ESTHETIQUE';
BEGIN
    -- =========================================================
    -- MÉTIER 1 — COIFFURE / BARBIER
    -- =========================================================

    -- UT1 — ACCUEIL / CAISSE / PRISE DE RENDEZ-VOUS (PSYCHOSOCIAUX)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _coiffure_code, 'PSYCHOSOCIAUX', 
         'Stress lié à la clientèle', 
         'Exigences fortes, remarques, conflits potentiels, pression sur les rendez-vous et l''attente.', 
         '["Formation gestion relation client, règles d''apaisement, script d''accueil."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'PSYCHOSOCIAUX', 
         'Rythme de travail soutenu', 
         'Enchaînement de rendez-vous sans pause, pics d''activité, surcharge au comptoir.', 
         '["Organisation du planning, temps tampon, pauses planifiées."]', 2, 4, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'PSYCHOSOCIAUX', 
         'Conflits internes', 
         'Tensions entre collègues autour des clients, des horaires, du partage des tâches.', 
         '["Temps d''échange, règles claires, point d''équipe hebdomadaire."]', 2, 2, NOW())
    ON CONFLICT DO NOTHING;

    -- UT2 — POSTE COUPE / COIFFAGE (PHYSIQUE + ORGANISATIONNELS)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _coiffure_code, 'PHYSIQUE', 
         'TMS dos / épaules / nuque', 
         'Station debout prolongée, bras levés, posture statique, mouvements répétitifs (brushing/coupe).', 
         '["Formation gestes & postures, fauteuils réglables, rotation des tâches, micro-pauses."]', 3, 4, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'PHYSIQUE', 
         'Coupures ciseaux / rasoirs / tondeuses', 
         'Coupures lors de la coupe, du rasage, du nettoyage ou du changement de lames/embouts.', 
         '["Outils en bon état, rangement immédiat, procédure changement lames, trousse de secours."]', 2, 2, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'PHYSIQUE', 
         'Brûlures par appareils chauffants', 
         'Contact de la peau avec fers, plaques, boucleurs, sèche-cheveux (air très chaud) ou eau trop chaude.', 
         '["Contrôle température, supports isolants, rangement sécurisé, consignes aux salariés."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'ORGANISATIONNELS', 
         'Ergonomie du poste insuffisante', 
         'Matériel/hauteur inadaptés (fauteuil, miroir, plan de travail) augmentant fatigue et TMS.', 
         '["Ajustement mobilier, investissement progressif, audit ergonomique simple."]', 3, 3, NOW())
    ON CONFLICT DO NOTHING;

    -- UT3 — ZONE BAC / SHAMPOING (PHYSIQUE)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _coiffure_code, 'PHYSIQUE', 
         'Glissade zone bac', 
         'Eau au sol, tapis mouillés, produits renversés autour des bacs.', 
         '["Séchage immédiat, tapis absorbants, signalisation ponctuelle, chaussures adaptées."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'PHYSIQUE', 
         'TMS dos (flexion répétée au bac)', 
         'Position penchée prolongée lors des shampoings et soins, torsions du dos.', 
         '["Réglage hauteur du bac/siège, pauses, alternance tâches."]', 3, 3, NOW())
    ON CONFLICT DO NOTHING;

    -- UT4 — ZONE TECHNIQUE (CHIMIQUE + INCENDIE)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _coiffure_code, 'CHIMIQUE', 
         'Décolorants – inhalation et contact', 
         'Poussières/vapeurs et contact cutané lors de la préparation, application, rinçage.', 
         '["Gants adaptés, ventilation, respect FDS, préparation en zone dédiée."]', 3, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'CHIMIQUE', 
         'Colorations – sensibilisation cutanée', 
         'Risque d''irritation/allergie (contact peau), exposition répétée aux produits.', 
         '["Port de gants, hygiène, respect des dosages/temps de pose, FDS accessibles."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'CHIMIQUE', 
         'Produits lissants / défrisants – vapeurs', 
         'Inhalation de vapeurs irritantes en application (pièce peu ventilée).', 
         '["Ventilation renforcée, limiter exposition, suivre FDS, gants/masque si besoin."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'INCENDIE', 
         'Ventilation insuffisante (zone technique)', 
         'Renouvellement d''air trop faible, accumulation de vapeurs/odeurs, inconfort.', 
         '["Extraction d''air adaptée, entretien VMC, aération régulière."]', 2, 3, NOW())
    ON CONFLICT DO NOTHING;

    -- UT5 — RÉSERVE / STOCK / PRODUITS (INCENDIE + ORGANISATIONNELS)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _coiffure_code, 'INCENDIE', 
         'Produits inflammables mal stockés', 
         'Stockage proche sources de chaleur, aérosols/alcools mal rangés.', 
         '["Stockage éloigné chaleur, armoire adaptée, quantités limitées."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'ORGANISATIONNELS', 
         'Manque de procédures d''hygiène', 
         'Consignes insuffisantes sur désinfection matériel/linge, risque sanitaire et non-conformité.', 
         '["Protocole écrit + formation, check-list nettoyage, suivi."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'ORGANISATIONNELS', 
         'Planning instable', 
         'Changements de planning fréquents, sous-effectif ponctuel, stress et fatigue.', 
         '["Planification anticipée, règles de remplacement, buffers horaires."]', 2, 3, NOW())
    ON CONFLICT DO NOTHING;

    -- UT6 — LOCAUX / CIRCULATIONS / ENTRETIEN (PHYSIQUE + CHIMIQUE + INCENDIE)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _coiffure_code, 'PHYSIQUE', 
         'Chutes de plain-pied (salon)', 
         'Sol glissant (cheveux, eau, produits), obstacles dans les allées.', 
         '["Balayage après chaque client, allées dégagées, tapis antidérapants."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'CHIMIQUE', 
         'Produits de nettoyage (salon)', 
         'Irritation cutanée/respiratoire lors de l''utilisation de détergents/désinfectants.', 
         '["Gants, respect des doses, ventilation, stockage sécurisé."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _coiffure_code, 'INCENDIE', 
         'Installation électrique surchargée (salon)', 
         'Multiprises, appareils chauffants, risque de surchauffe/court-circuit.', 
         '["Vérification installation, multiprises certifiées, éviter surcharges."]', 3, 2, NOW())
    ON CONFLICT DO NOTHING;

    -- =========================================================
    -- MÉTIER 2 — ESTHÉTIQUE / ONGLERIE / BIEN-ÊTRE
    -- =========================================================

    -- UT1 — ACCUEIL / CAISSE (PSYCHOSOCIAUX)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _esthetique_code, 'PSYCHOSOCIAUX', 
         'Pression liée à l''image et au résultat', 
         'Attentes élevées des clients, risque d''insatisfaction, stress de performance.', 
         '["Communication claire, gestion des attentes, soutien responsable."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PSYCHOSOCIAUX', 
         'Gestion approximative des rendez-vous', 
         'Retards, chevauchements, surcharge administrative, tension client.', 
         '["Outil planning, temps tampon, règles de confirmation."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PSYCHOSOCIAUX', 
         'Rythme soutenu en période de pointe (esthétique)', 
         'Forte affluence (week-ends/fêtes), réduction des pauses, fatigue.', 
         '["Limiter surbooking, renfort ponctuel, pauses planifiées."]', 2, 3, NOW())
    ON CONFLICT DO NOTHING;

    -- UT2 — POSTE MANUCURE / ONGLES (PHYSIQUE + CHIMIQUE)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'TMS mains / poignets', 
         'Gestes fins répétitifs (pose gel, limage), posture fixe des mains.', 
         '["Alternance tâches, micro-pauses, matériel ergonomique, formation gestes."]', 3, 4, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'TMS dos / épaules (onglerie)', 
         'Posture penchée prolongée sur cliente, tension cervicale/épaules.', 
         '["Réglage sièges, soutien lombaire, pauses régulières, rotation."]', 3, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'Coupures petits instruments', 
         'Coupures lors de l''usage de pinces/ciseaux/cutters, nettoyage et rangement.', 
         '["Rangement sécurisé, procédure de désinfection, instruments en bon état."]', 2, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'CHIMIQUE', 
         'Solvants (vernis, dissolvants)', 
         'Inhalation de vapeurs + contact cutané, irritation/allergies.', 
         '["Ventilation efficace, port de gants, flacons fermés, respect FDS."]', 3, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'CHIMIQUE', 
         'Résines et gels UV', 
         'Sensibilisation cutanée, contact répété, exposition lors de la pose.', 
         '["Protection cutanée, respect FDS, éviter contact peau, hygiène des mains."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'CHIMIQUE', 
         'Huiles essentielles / parfums', 
         'Risque d''allergies/irritations, gêne respiratoire en espace confiné.', 
         '["Limiter usage, aération, privilégier produits moins volatils."]', 2, 2, NOW())
    ON CONFLICT DO NOTHING;

    -- UT3 — CABINE SOINS VISAGE / CORPS (PHYSIQUE + PSYCHOSOCIAUX)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'TMS dos / épaules (cabine soins)', 
         'Postures contraintes pendant les soins, gestes répétitifs de massage/soin.', 
         '["Table réglable, positionnement matériel, alternance soins, pauses."]', 3, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'Brûlures par cire chaude', 
         'Cire trop chaude, coulures, contact peau lors de l''épilation.', 
         '["Contrôle température, test avant application, protocole sécurité."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'Chutes de plain-pied (cabine)', 
         'Sols glissants (huiles/produits), câbles, objets au sol en cabine.', 
         '["Nettoyage immédiat, tapis antidérapants, câbles rangés."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'PSYCHOSOCIAUX', 
         'Isolement en cabine', 
         'Travail seul, difficulté à appeler à l''aide en cas d''incident.', 
         '["Procédure d''alerte, présence d''un collègue sur site, check-in."]', 2, 2, NOW())
    ON CONFLICT DO NOTHING;

    -- UT4 — ZONE PRODUITS / DÉSINFECTION (CHIMIQUE + ORGANISATIONNELS)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _esthetique_code, 'CHIMIQUE', 
         'Désinfectants concentrés', 
         'Irritation cutanée/respiratoire lors des dilutions et usages répétés.', 
         '["Gants, respect dilution, ventilation, stockage sécurisé."]', 2, 3, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'CHIMIQUE', 
         'Produits de peeling / acides', 
         'Risque de brûlure/irritation, projection possible lors de l''application.', 
         '["Protection oculaire si besoin, formation, respect FDS/protocoles."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'ORGANISATIONNELS', 
         'Hygiène du matériel insuffisamment encadrée', 
         'Désinfection irrégulière, risque sanitaire and non-conformité.', 
         '["Protocole écrit + registre suivi, formation, check-list."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'ORGANISATIONNELS', 
         'Traçabilité des produits et soins insuffisante', 
         'Absence d''historique produit/lot/soin, difficulté en cas d''incident client.', 
         '["Fiches clients détaillées, suivi lots/dates, procédure."]', 3, 2, NOW())
    ON CONFLICT DO NOTHING;

    -- UT5 — LOCAUX / CIRCULATIONS (PHYSIQUE)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _esthetique_code, 'PHYSIQUE', 
         'Chutes de plain-pied (circulations)', 
         'Sols humides, obstacles, passages étroits, câbles.', 
         '["Sols propres et secs, rangement, tapis antidérapants."]', 2, 3, NOW())
    ON CONFLICT DO NOTHING;

    -- UT6 — INSTALLATIONS ÉLECTRIQUES / INCENDIE (INCENDIE)
    INSERT INTO risques_metier (id, "metierCode", "categorieCode", nom, description, "mesuresSuggerees", gravite, frequence, "updatedAt")
    VALUES
        (gen_random_uuid()::text, _esthetique_code, 'INCENDIE', 
         'Utilisation de bougies / appareils chauffants', 
         'Risque de départ de feu par bougies, chauffe-cire, appareils laissés sans surveillance.', 
         '["Ne jamais laisser sans surveillance, zone dédiée, extincteur à proximité."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'INCENDIE', 
         'Surcharge de multiprises (esthétique)', 
         'Trop d''équipements sur une même ligne, surchauffe/court-circuit.', 
         '["Répartition électrique, multiprises certifiées, contrôle périodique."]', 3, 2, NOW()),
        (gen_random_uuid()::text, _esthetique_code, 'INCENDIE', 
         'Ventilation des cabines insuffisante', 
         'Air confiné, concentration de vapeurs/odeurs, gêne respiratoire.', 
         '["Extraction d''air efficace, entretien VMC, aération régulière."]', 2, 3, NOW())
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Seed DUERP métiers terminé.';
END $$;
