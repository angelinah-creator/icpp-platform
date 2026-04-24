"use server"

import { getStripe, isStripeEnabled } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"

export interface StripeInvoiceItem {
    id: string
    number: string | null
    date: string
    periodStart: string
    periodEnd: string
    amount: number
    currency: string
    status: string
    description: string
    pdfUrl: string | null
    hostedUrl: string | null
}

export interface FacturesPageData {
    subscription: {
        plan: string
        price: number
        status: string
        nextBilling: string | null
        stripeConnected: boolean
        stripeCustomerId: string | null
        cancelAtPeriodEnd: boolean
    }
    invoices: StripeInvoiceItem[]
    stats: {
        successfulPayments: number
        totalInvoices: number
        totalPaid: number
    }
    hasStripeAccess: boolean
}

export async function getFacturesPageData(): Promise<FacturesPageData | null> {
    const user = await getCurrentUser()
    if (!user || !user.companyId) return null

    const company = await prisma.company.findUnique({
        where: { id: user.companyId },
        include: {
            subscription: {
                include: { plan: true }
            }
        }
    })

    if (!company) return null

    const subscription = company.subscription
    const stripeCustomerId = subscription?.stripeCustomerId || null
    const stripeEnabled = isStripeEnabled()

    const subscriptionData = {
        plan: subscription?.plan?.nom || "Aucun abonnement",
        price: subscription?.customPrice || subscription?.plan?.prixMensuel || 0,
        status: subscription?.status || "INACTIVE",
        nextBilling: subscription?.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")
            : null,
        stripeConnected: Boolean(stripeCustomerId),
        stripeCustomerId,
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
    }

    // Try to fetch real invoices from Stripe
    if (stripeEnabled && stripeCustomerId) {
        try {
            const stripe = getStripe()
            if (stripe) {
                const stripeInvoices = await stripe.invoices.list({
                    customer: stripeCustomerId,
                    limit: 24,
                    expand: ["data.subscription"],
                })

                const invoices: StripeInvoiceItem[] = stripeInvoices.data.map((inv) => ({
                    id: inv.id,
                    number: inv.number ?? null,
                    date: new Date(inv.created * 1000).toLocaleDateString("fr-FR"),
                    periodStart: inv.period_start
                        ? new Date(inv.period_start * 1000).toLocaleDateString("fr-FR")
                        : "",
                    periodEnd: inv.period_end
                        ? new Date(inv.period_end * 1000).toLocaleDateString("fr-FR")
                        : "",
                    amount: inv.amount_paid,
                    currency: inv.currency.toUpperCase(),
                    status: inv.status ?? "unknown",
                    description: inv.description ?? "Abonnement ICPP Conformité",
                    pdfUrl: inv.invoice_pdf ?? null,
                    hostedUrl: inv.hosted_invoice_url ?? null,
                }))

                const paid = invoices.filter((i) => i.status === "paid")

                return {
                    subscription: subscriptionData,
                    invoices,
                    stats: {
                        successfulPayments: paid.length,
                        totalInvoices: invoices.length,
                        totalPaid: paid.reduce((sum, i) => sum + i.amount, 0),
                    },
                    hasStripeAccess: true,
                }
            }
        } catch (err) {
            console.error("Stripe invoices fetch error:", err)
            // Fall through to local payments
        }
    }

    // Fallback: use local SubscriptionPayment records (before Stripe account connected)
    const localPayments = await prisma.subscriptionPayment.findMany({
        where: {
            companyId: user.companyId,
            status: "PAID",
        },
        orderBy: { createdAt: "desc" },
        take: 24,
    })

    const invoices: StripeInvoiceItem[] = localPayments.map((p) => ({
        id: p.id,
        number: p.receiptNumber,
        date: new Date(p.createdAt).toLocaleDateString("fr-FR"),
        periodStart: new Date(p.createdAt).toLocaleDateString("fr-FR"),
        periodEnd: "",
        amount: p.amount,
        currency: p.currency,
        status: "paid",
        description: `Abonnement ${p.planCode || "ICPP"}`,
        pdfUrl: p.receiptNumber ? `/api/payments/${p.id}/receipt` : null,
        hostedUrl: null,
    }))

    const totalPaid = invoices.reduce((sum, i) => sum + i.amount, 0)

    return {
        subscription: subscriptionData,
        invoices,
        stats: {
            successfulPayments: invoices.length,
            totalInvoices: invoices.length,
            totalPaid,
        },
        hasStripeAccess: false,
    }
}
