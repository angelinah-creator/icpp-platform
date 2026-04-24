export const ACTIVE_SUBSCRIPTION_STATUSES = ["ACTIVE"] as const

export function hasSubscriptionAccess(subscription?: { status?: string | null; currentPeriodEnd?: Date | null } | null): boolean {
    if (!subscription?.status) return false
    const isActive = ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status as any)
    if (!isActive) return false

    if (subscription.currentPeriodEnd) {
        return new Date(subscription.currentPeriodEnd).getTime() > Date.now()
    }

    return true
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