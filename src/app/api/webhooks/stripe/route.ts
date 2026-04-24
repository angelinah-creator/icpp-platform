import { NextRequest, NextResponse } from "next/server"
import { getStripe, isStripeEnabled } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/server/actions/notifications"
import { ensureContractAfterPayment } from "@/lib/contracts"
import Stripe from "stripe"

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
    const stripe = getStripe()
    // Vérifier si Stripe est configuré
    if (!isStripeEnabled() || !stripe) {
        return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 })
    }

    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: err.message }, { status: 400 })
    }

    // Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session
                await handleCheckoutSessionCompleted(session)
                break
            }

            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice
                await handleInvoicePaid(invoice)
                break
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice
                await handleInvoicePaymentFailed(invoice)
                break
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionUpdated(subscription)
                break
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionDeleted(subscription)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Error processing webhook:", error)
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        )
    }
}

// Handle checkout session completed
async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
) {
    if (session.payment_status !== "paid") {
        console.warn(`Stripe checkout completed without paid status for session ${session.id}. Activation skipped.`)
        return
    }

    const companyId = session.metadata?.companyId
    const paymentId = session.metadata?.paymentId

    if (!companyId) {
        console.error("No companyId in session metadata")
        return
    }

    // Update subscription in database
    await prisma.subscription.update({
        where: { companyId },
        data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            status: "ACTIVE",
            planCode: session.metadata?.planCode || undefined,
            setupFeePaid: true,
            setupFeePaidAt: new Date(),
        },
    })

    const company = await prisma.company.findUnique({
        where: { id: companyId },
        include: {
            users: {
                where: { role: "CLIENT" },
                select: { id: true, name: true },
                take: 1,
            },
        },
    })

    if (paymentId) {
        await prisma.subscriptionPayment.updateMany({
            where: { id: paymentId },
            data: {
                status: "PAID",
                paidAt: new Date(),
                validatedAt: new Date(),
                stripeCheckoutSessionId: session.id,
                stripeSubscriptionId: session.subscription as string,
                stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
                receiptIssuedAt: new Date(),
            },
        })
    }

    // Marquer les frais de mise en place comme payés si c'était le premier paiement
    const chargeSetupFee = session.metadata?.chargeSetupFee === "true"
    if (chargeSetupFee) {
        await prisma.company.update({
            where: { id: companyId },
            data: { setupFeePaid: true },
        })
        console.log(`✅ Setup fee marked as paid for company ${companyId}`)
    }

    await ensureContractAfterPayment(companyId)

    if (company?.users[0]) {
        await createNotification({
            userId: company.users[0].id,
            type: "STRIPE_PAYMENT_CONFIRMED",
            title: "Paiement Stripe confirmé",
            message: "Votre abonnement est actif. Vous pouvez désormais accéder à votre tableau de bord.",
            actionUrl: "/dashboard",
        })
    }

    console.log(`✅ Subscription activated for company ${companyId}`)
}

// Handle invoice paid
async function handleInvoicePaid(invoice: Stripe.Invoice) {
    const subscription = await prisma.subscription.findUnique({
        where: {
            // @ts-ignore - Stripe type compatibility
            stripeSubscriptionId: invoice.subscription as string,
        },
    })

    if (subscription) {
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: "ACTIVE",
            },
        })
    }
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await prisma.subscription.findUnique({
        where: {
            // @ts-ignore - Stripe type compatibility
            stripeSubscriptionId: invoice.subscription as string,
        },
    })

    if (subscription) {
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: "PAST_DUE",
            },
        })
    }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const dbSubscription = await prisma.subscription.findUnique({
        where: {
            stripeSubscriptionId: subscription.id,
        },
    })

    if (dbSubscription) {
        const planCode = subscription.metadata.planCode as string || dbSubscription.planCode

        await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
                status: subscription.status === "active" ? "ACTIVE" :
                    subscription.status === "past_due" ? "PAST_DUE" :
                        subscription.status === "canceled" ? "CANCELED" :
                            subscription.status.toUpperCase(),
                planCode: planCode,
                // @ts-ignore - Stripe type compatibility
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                // @ts-ignore - Stripe type compatibility
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
        })
        console.log(`✅ Subscription ${subscription.id} updated for company ${dbSubscription.companyId}`)
    }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const dbSubscription = await prisma.subscription.findUnique({
        where: {
            stripeSubscriptionId: subscription.id,
        },
    })

    if (dbSubscription) {
        await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
                status: "CANCELED",
                canceledAt: new Date(),
            },
        })
    }
}
