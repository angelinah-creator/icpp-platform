/**
 * Utilitaire de calcul DUERP
 * Nouveau modèle : risque_brut = F×G | pondération P | risque_résiduel = F×G×P
 */

// ── Niveaux de maîtrise disponibles ──────────────────────────────────────────
export const NIVEAUX_MAITRISE = [
    "Aucune",
    "Partielle",
    "Organisationnelle",
    "Protection collective",
    "Maîtrise optimale",
] as const

export type NiveauMaitrise = (typeof NIVEAUX_MAITRISE)[number]

// Correspondance labels étendus pour l'UI
export const NIVEAUX_MAITRISE_LABELS: Record<string, string> = {
    "Aucune": "Aucune",
    "Partielle": "Partielle (EPI / rappel simple)",
    "Organisationnelle": "Organisationnelle (procédure, formation…)",
    "Protection collective": "Protection collective (hotte, aspiration…)",
    "Maîtrise optimale": "Maîtrise optimale",
}

// ── Barème pondération P ──────────────────────────────────────────────────────
const PONDERATION_MAP: Record<string, number> = {
    "Aucune": 1,
    "Partielle": 0.7,
    "Organisationnelle": 0.5,
    "Protection collective": 0.3,
    "Maîtrise optimale": 0.2,
}

/**
 * Retourne le coefficient P pour un niveau de maîtrise donné
 */
export function getPonderation(niveauMaitrise: string): number {
    return PONDERATION_MAP[niveauMaitrise] ?? 1
}

/**
 * Calcule le risque brut : F × G
 */
export function calcRisqueBrut(frequence: number, gravite: number): number {
    return frequence * gravite
}

/**
 * Calcule le risque résiduel : F × G × P  (arrondi à 2 décimales)
 */
export function calcRisqueResiduel(
    frequence: number,
    gravite: number,
    ponderation: number
): number {
    return Math.round(frequence * gravite * ponderation * 100) / 100
}

/**
 * Calcule la priorité d'action selon le risque résiduel
 * >= 12 → Critique | >= 8 → Élevé | >= 4 → Modéré | < 4 → Faible
 */
export function calcPrioriteAction(risqueResiduel: number): string {
    if (risqueResiduel >= 12) return "Critique"
    if (risqueResiduel >= 8) return "Élevé"
    if (risqueResiduel >= 4) return "Modéré"
    return "Faible"
}

/**
 * Calcule tous les indicateurs d'un coup depuis F, G et niveauMaitrise
 */
export function calcIndicateurs(
    frequence: number,
    gravite: number,
    niveauMaitrise: string
) {
    const ponderation = getPonderation(niveauMaitrise)
    const risqueBrut = calcRisqueBrut(frequence, gravite)
    const risqueResiduel = calcRisqueResiduel(frequence, gravite, ponderation)
    const prioriteAction = calcPrioriteAction(risqueResiduel)
    return { ponderation, risqueBrut, risqueResiduel, prioriteAction }
}

// ── Styles de criticité (pour l'UI) ──────────────────────────────────────────
export type PrioriteStyle = {
    bg: string
    text: string
    border: string
    label: string
}

export function getPrioriteStyle(prioriteAction: string): PrioriteStyle {
    switch (prioriteAction) {
        case "Critique":
            return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", label: "Critique" }
        case "Élevé":
            return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", label: "Élevé" }
        case "Modéré":
            return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", label: "Modéré" }
        default:
            return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", label: "Faible" }
    }
}

// Couleur pour le score badge circulaire (score = risqueResiduel)
export function getScoreStyleNew(score: number): { bg: string; text: string } {
    if (score >= 12) return { bg: "bg-red-500", text: "text-white" }
    if (score >= 8) return { bg: "bg-amber-400", text: "text-white" }
    if (score >= 4) return { bg: "bg-orange-400", text: "text-white" }
    return { bg: "bg-emerald-500", text: "text-white" }
}
