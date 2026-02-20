-- =======================================================
-- PHASE 4 — Normalisation types de signalements (CDC 3.7)
-- =======================================================
-- Types CDC : nouveau_salarie / depart_salarie / demenagement /
--             nouvel_equipement / accident_travail / nouvelle_activite / autre
-- On ajoute un commentaire de standardisation sans supprimer les données
-- existantes (qui ont des types libres comme INCIDENT, EQUIPEMENT, etc.)

-- Pas de migration destructive : on se contente de documenter que
-- les nouveaux signalements doivent utiliser ces types standards.
-- Les données existantes sont conservées telles quelles.
SELECT 'Phase 4 : Types de signalements documentés (migration non destructive)' AS info;
