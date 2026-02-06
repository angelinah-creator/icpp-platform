-- Migration manuelle: Ajout UniteTravail et modification RisqueMetier
-- Date: 2026-02-05

-- ============================================
-- ÉTAPE 1: Créer la table unites_travail
-- ============================================

CREATE TABLE IF NOT EXISTS "unites_travail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metierCode" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "unites_travail_metierCode_fkey" FOREIGN KEY ("metierCode") REFERENCES "metiers_icpp" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "unites_travail_metierCode_idx" ON "unites_travail"("metierCode");

-- ============================================
-- ÉTAPE 2: Créer table temporaire pour risques_metier
-- ============================================

CREATE TABLE "risques_metier_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categorieCode" TEXT NOT NULL,
    "uniteTravailId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gravite" INTEGER NOT NULL DEFAULT 2,
    "frequence" INTEGER NOT NULL DEFAULT 1,
    "mesuresSuggerees" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "risques_metier_new_categorieCode_fkey" FOREIGN KEY ("categorieCode") REFERENCES "risques_categories" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "risques_metier_new_uniteTravailId_fkey" FOREIGN KEY ("uniteTravailId") REFERENCES "unites_travail" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "risques_metier_new_categorieCode_idx" ON "risques_metier_new"("categorieCode");
CREATE INDEX IF NOT EXISTS "risques_metier_new_uniteTravailId_idx" ON "risques_metier_new"("uniteTravailId");

-- ============================================
-- ÉTAPE 3: Message - Migration de données nécessaire
-- ============================================

-- NOTE: La migration des données de risques_metier vers risques_metier_new
-- nécessite la création préalable des UnitésTravail pour chaque métier.
-- Une fois les UTs créées, il faudra mapper chaque risque à une UT appropriée.

-- Pour l'instant, on garde l'ancienne table et on créera les nouvelles données
-- dans le script de seed.

SELECT 'Migration schema completed - Old risques_metier table preserved' as status;
SELECT 'Next step: Run seed script to populate unites_travail and new risks' as next_action;
