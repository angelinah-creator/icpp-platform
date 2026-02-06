import Stripe from "stripe"

// Stripe est optionnel en mode développement
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// @ts-ignore - Stripe API version compatibility
export const stripe = stripeSecretKey 
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2024-12-18.acacia" as any,
    })
    : null

/**
 * Vérifie si Stripe est configuré et disponible
 */
export function isStripeEnabled(): boolean {
    return stripe !== null
}
