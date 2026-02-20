-- =======================================================
-- PHASE 2 — Ajout des champs manquants (companies, salaries, audits)
-- =======================================================

BEGIN;

-- -------------------------------------------------------
-- 2a. Table companies — champs manquants CDC section 3.2
-- -------------------------------------------------------
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS "nomCommercial"       text,
  ADD COLUMN IF NOT EXISTS "codeApe"             text,
  ADD COLUMN IF NOT EXISTS "pays"                text DEFAULT 'France',
  ADD COLUMN IF NOT EXISTS "medecineTravail"     text,
  ADD COLUMN IF NOT EXISTS "assurance"           text,
  ADD COLUMN IF NOT EXISTS "commentaireInterne"  text;

-- -------------------------------------------------------
-- 2b. Table salaries — champs manquants CDC section 3.3
-- -------------------------------------------------------
ALTER TABLE salaries
  ADD COLUMN IF NOT EXISTS "dateSortie"    timestamp,
  ADD COLUMN IF NOT EXISTS "tempsTravail"  text DEFAULT 'COMPLET';
  -- Valeurs possibles : COMPLET, PARTIEL, SAISONNIER

-- -------------------------------------------------------
-- 2c. Table audits — champs manquants CDC section 3.5
-- -------------------------------------------------------
ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS "scoreConformite"      integer,
  ADD COLUMN IF NOT EXISTS "syntheseAutomatique"  text,
  ADD COLUMN IF NOT EXISTS "documentsObligatoires" text;
  -- documentsObligatoires = JSON string: { duerp: bool, affichages: bool, extincteurs: bool, ... }

COMMIT;
