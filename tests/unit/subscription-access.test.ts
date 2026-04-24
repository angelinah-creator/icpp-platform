import { describe, expect, it } from "vitest"
import {
    ACTIVE_SUBSCRIPTION_STATUSES,
    getSubscriptionStatusLabel,
    hasSubscriptionAccess,
} from "@/lib/subscription-access"

describe("subscription-access", () => {
    it("exposes the active statuses used by the subscription gate", () => {
        expect(ACTIVE_SUBSCRIPTION_STATUSES).toEqual(["ACTIVE"])
    })

    it("allows access only for active subscriptions", () => {
        expect(hasSubscriptionAccess("ACTIVE")).toBe(true)
        expect(hasSubscriptionAccess("TRIALING")).toBe(false)
        expect(hasSubscriptionAccess("SUSPENDED")).toBe(false)
        expect(hasSubscriptionAccess("CANCELED")).toBe(false)
        expect(hasSubscriptionAccess(undefined)).toBe(false)
        expect(hasSubscriptionAccess(null)).toBe(false)
    })

    it("returns readable labels for subscription states", () => {
        expect(getSubscriptionStatusLabel("ACTIVE")).toBe("Actif")
        expect(getSubscriptionStatusLabel("TRIALING")).toBe("Essai en cours")
        expect(getSubscriptionStatusLabel("PAST_DUE")).toBe("Paiement en retard")
        expect(getSubscriptionStatusLabel("SUSPENDED")).toBe("Suspendu")
        expect(getSubscriptionStatusLabel("CANCELED")).toBe("Résilié")
        expect(getSubscriptionStatusLabel(null)).toBe("Aucun abonnement")
    })

    it("falls back to the raw status when no label mapping exists", () => {
        expect(getSubscriptionStatusLabel("UNKNOWN_STATUS")).toBe("UNKNOWN_STATUS")
    })
})