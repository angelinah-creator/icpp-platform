"use server"

import { getStripe, isStripeEnabled } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"

export type CheckoutError = { error: string }

/**
 * Create a Stripe checkout session for a subscription
 */
export async function createCheckoutSession(_planCode: string, offerFirstMonth = false): Promise<string | CheckoutError> {
    const stripe = getStripe()
    // Vérifier si Stripe est configuré
    if (!isStripeEnabled() || !stripe) {
        return { error: "Stripe n'est pas configuré. Veuillez contacter l'administrateur." }
    }

    const user = await getCurrentUser()

    if (!user || !user.companyId) {
        return { error: "Non autorisé" }
    }

    const [company, existingSubscription, latestAudit] = await Promise.all([
        prisma.company.findUnique({
            where: { id: user.companyId },
        }),
        prisma.subscription.findUnique({
            where: { companyId: user.companyId },
        }),
        prisma.audit.findFirst({
            where: { companyId: user.companyId },
            orderBy: { createdAt: "desc" },
            select: {
                proposedPlanCode: true,
                proposedPrice: true,
            },
        }),
    ])

    if (!company) {
        return { error: "Entreprise introuvable" }
    }

    const assignedPlanCode = latestAudit?.proposedPlanCode || existingSubscription?.planCode || null
    if (!assignedPlanCode) {
        return { error: "Aucun abonnement n'a encore été assigné par votre conseiller ICPP." }
    }

    // Force server-side assigned plan even if client sends another planCode.
    const forcedPlanCode = assignedPlanCode

    const plan = await prisma.planTarifaire.findUnique({
        where: { code: forcedPlanCode },
    })

    if (!plan) {
        return { error: "L'abonnement assigné est introuvable ou inactif." }
    }

    const assignedAmount = latestAudit?.proposedPrice || existingSubscription?.customPrice || null

    const subscription = existingSubscription
        ? await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
                planCode: forcedPlanCode,
                status: existingSubscription.status || "SUSPENDED",
                customPrice: assignedAmount ?? existingSubscription.customPrice ?? undefined,
            },
        })
        : await prisma.subscription.create({
            data: {
                companyId: user.companyId,
                planCode: forcedPlanCode,
                status: "SUSPENDED",
                customPrice: assignedAmount ?? undefined,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        })

    const amount = subscription.customPrice || plan.prixMensuel

    const payment = await prisma.subscriptionPayment.create({
        data: {
            companyId: user.companyId,
            clientUserId: user.id,
            method: "STRIPE",
            status: "PENDING",
            planCode: forcedPlanCode,
            amount,
            currency: "EUR",
            metadata: JSON.stringify({ source: "stripe_checkout" }),
        },
    })

    const SETUP_FEE_AMOUNT = 4900 // 49,00 €
    const chargeSetupFee = !(company as any).setupFeePaid

    // Construire les line_items : abonnement + frais de mise en place si premier paiement
    const lineItems: any[] = [
        {
            price_data: {
                currency: "eur",
                product_data: {
                    name: `Abonnement ${plan.nom}`,
                    description: `Plan ${plan.nom} - ${plan.description}`,
                    metadata: { planCode: forcedPlanCode },
                },
                recurring: { interval: "month" },
                unit_amount: amount,
            },
            quantity: 1,
        },
    ]

    if (chargeSetupFee) {
        lineItems.push({
            price_data: {
                currency: "eur",
                product_data: {
                    name: "Frais de mise en place",
                    description: "Frais uniques d'installation et de configuration de votre environnement ICPP",
                },
                unit_amount: SETUP_FEE_AMOUNT,
            },
            quantity: 1,
        })
    }

    // @ts-ignore - Stripe checkout types
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: subscription.stripeCustomerId || undefined,
        customer_email: subscription.stripeCustomerId ? undefined : (company.email || user.email),
        line_items: lineItems,
        metadata: {
            companyId: user.companyId,
            userId: user.id,
            planCode: forcedPlanCode,
            subscriptionId: subscription.id,
            paymentId: payment.id,
            chargeSetupFee: chargeSetupFee ? "true" : "false",
        },
        subscription_data: {
            // 1er mois offert = 30 jours de trial sans débit
            ...(offerFirstMonth ? { trial_period_days: 30 } : {}),
            metadata: {
                companyId: user.companyId,
                planCode: forcedPlanCode,
                paymentId: payment.id,
                offerFirstMonth: offerFirstMonth ? "true" : "false",
            }
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/abonnement?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/abonnement?canceled=true`,
    })

    await prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: {
            stripeCheckoutSessionId: session.id,
        },
    })

    if (!session.url) {
        return { error: "Impossible de créer la session de paiement" }
    }

    return session.url
}

/**
 * Create a Stripe customer portal session
 */
export async function createCustomerPortalSession(): Promise<string | CheckoutError> {
    const stripe = getStripe()
    // Vérifier si Stripe est configuré
    if (!isStripeEnabled() || !stripe) {
        return { error: "Stripe n'est pas configuré. Veuillez contacter l'administrateur." }
    }

    const user = await getCurrentUser()

    if (!user || !user.companyId) {
        return { error: "Non autorisé" }
    }

    const subscription = await prisma.subscription.findUnique({
        where: { companyId: user.companyId },
    })

    if (!subscription || !subscription.stripeCustomerId) {
        return { error: "Aucun abonnement actif trouvé" }
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/dashboard/parametres?tab=abonnement`,
    })

    return session.url
}
