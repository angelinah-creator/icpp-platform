-- Migration: Ajout des champs rapport dans la table taches
ALTER TABLE taches
    ADD COLUMN IF NOT EXISTS rapport TEXT,
    ADD COLUMN IF NOT EXISTS rapport_at TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS rapport_statut VARCHAR(20) DEFAULT 'REDIGE';
-- rapport_statut: REDIGE (brouillon) | ENVOYE (soumis à l'admin) | LU (vu par admin)
