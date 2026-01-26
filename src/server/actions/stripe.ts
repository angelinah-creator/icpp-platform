"use server"

import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"

/**
 * Create a Stripe checkout session for a subscription
 */
export async function createCheckoutSession(planCode: string) {
    const user = await getCurrentUser()

    if (!user || !user.companyId) {
        throw new Error("Unauthorized")
    }

    // Get plan details
    const plan = await prisma.planTarifaire.findUnique({
        where: { code: planCode },
    })

    if (!plan) {
        throw new Error("Plan not found")
    }

    // Get company
    const company = await prisma.company.findUnique({
        where: { id: user.companyId },
    })

    if (!company) {
        throw new Error("Company not found")
    }

    // Create or get subscription record
    let subscription = await prisma.subscription.findUnique({
        where: { company Id: user.companyId },
    })

    if (!subscription) {
        subscription = await prisma.subscription.create({
            data: {
                companyId: user.companyId,
                planCode: planCode,
                status: "TRIALING",
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        })
    }

    // Create Stripe checkout session
    // @ts-ignore - Stripe checkout types
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: company.email || user.email,
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: plan.nom,
                        description: plan.description,
                    },
                    recurring: {
                        interval: "month",
                    },
                    unit_amount: plan.prixMensuel,
                },
                quantity: 1,
            },
        ],
        metadata: {
            companyId: user.companyId,
            userId: user.id,
            planCode: planCode,
        },
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    })

    if (!session.url) {
        throw new Error("Failed to create checkout session")
    }

    return session.url
}

/**
 * Create a Stripe customer portal session
 */
export async function createCustomerPortalSession() {
    const user = await getCurrentUser()

    if (!user || !user.companyId) {
        throw new Error("Unauthorized")
    }

    const subscription = await prisma.subscription.findUnique({
        where: { companyId: user.companyId },
    })

    if (!subscription || !subscription.stripeCustomerId) {
        throw new Error("No active subscription found")
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard/settings`,
    })

    return session.url
}
