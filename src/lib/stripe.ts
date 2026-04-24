import Stripe from "stripe"

// Stripe est optionnel en mode développement
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

/**
 * Stripe instance is initialized lazily to avoid crashing during SSR if the key is invalid.
 */
let stripeInstance: Stripe | null = null

/**
 * Returns the Stripe instance, initializing it if necessary.
 * Truly lazy initialization.
 */
export function getStripe(): Stripe | null {
    if (stripeInstance) return stripeInstance

    if (stripeSecretKey && stripeSecretKey.startsWith("sk_") && stripeSecretKey.length > 20) {
        try {
            stripeInstance = new Stripe(stripeSecretKey, {
                apiVersion: "2024-12-18.acacia" as any,
            })
            return stripeInstance
        } catch (e) {
            console.error("Stripe initialization error:", e)
            return null
        }
    }
    return null
}

/**
 * Vérifie si Stripe est configuré et disponible
 */
export function isStripeEnabled(): boolean {
    return getStripe() !== null
}
