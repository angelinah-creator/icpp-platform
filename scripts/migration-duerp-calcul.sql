-- ============================================================
-- Migration DUERP : Correction des noms de colonnes et calculs
-- ============================================================

-- 1. Renommer les colonnes si elles ont été créées en snake_case par erreur
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations_risques' AND column_name = 'niveau_maitrise') THEN
        ALTER TABLE evaluations_risques RENAME COLUMN niveau_maitrise TO "niveauMaitrise";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations_risques' AND column_name = 'priorite_action') THEN
        ALTER TABLE evaluations_risques RENAME COLUMN priorite_action TO "prioriteAction";
    END IF;
END $$;

-- 2. Ajouter les colonnes si elles n'existent pas du tout (cas nominal)
ALTER TABLE evaluations_risques
  ADD COLUMN IF NOT EXISTS "niveauMaitrise" VARCHAR(50) NOT NULL DEFAULT 'Aucune',
  ADD COLUMN IF NOT EXISTS "prioriteAction" VARCHAR(20);

-- 3. Recalculer risqueResiduel pour toutes les lignes existantes
--    (niveauMaitrise = Aucune => ponderation = 1 => risqueResiduel = niveauRisque)
UPDATE evaluations_risques
SET "risqueResiduel" = "niveauRisque"::float
WHERE "risqueResiduel" IS NULL;

-- 4. Recalculer prioriteAction sur la base du risqueResiduel
UPDATE evaluations_risques
SET "prioriteAction" = CASE
  WHEN "risqueResiduel" >= 12 THEN 'Critique'
  WHEN "risqueResiduel" >= 8  THEN 'Élevé'
  WHEN "risqueResiduel" >= 4  THEN 'Modéré'
  ELSE 'Faible'
END;

SELECT 'Migration DUERP calcul terminée.' AS status;
