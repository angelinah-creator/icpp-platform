export const ACTIVE_SUBSCRIPTION_STATUSES = ["ACTIVE"] as const

export function hasSubscriptionAccess(status?: string | null): boolean {
    if (!status) return false
    return ACTIVE_SUBSCRIPTION_STATUSES.includes(status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number])
}

export function getSubscriptionStatusLabel(status?: string | null): string {
    if (!status) return "Aucun abonnement"

    switch (status) {
        case "ACTIVE":
            return "Actif"
        case "TRIALING":
            return "Essai en cours"
        case "PAST_DUE":
            return "Paiement en retard"
        case "SUSPENDED":
            return "Suspendu"
        case "CANCELED":
            return "Résilié"
        default:
            return status
    }
}