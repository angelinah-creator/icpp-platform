"use server"

import { prisma } from "@/lib/prisma"
import { getStripe, isStripeEnabled } from "@/lib/stripe"
import { getCurrentUser } from "@/lib/auth-helpers"
import { hasSubscriptionAccess } from "@/lib/subscription-access"
import { createNotification } from "@/server/actions/notifications"
import { revalidatePath } from "next/cache"
import { ensureContractAfterPayment } from "@/lib/contracts"

const PAYMENT_VALIDATOR_ROLES = ["ADMIN", "AUDITOR", "COMMERCIAL"] as const

export interface PaymentParty {
    id: string
    name: string | null
    email: string | null
    role: string
}

export interface PaymentListItem {
    id: string
    method: string
    status: string
    amount: number
    currency: string
    planCode: string | null
    scheduledFor: Date | null
    paidAt: Date | null
    validatedAt: Date | null
    notes: string | null
    rejectionReason: string | null
    receiptNumber: string | null
    createdAt: Date
    company: { id: string; name: string }
    clientUser: PaymentParty
    collector: PaymentParty | null
    validatedBy: PaymentParty | null
}

function generateReceiptNumber() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const random = Math.random().toString(36).slice(2, 8).toUpperCase()
    return `ABO-${year}${month}${day}-${random}`
}

function addThirtyDays(date: Date) {
    return new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000)
}

async function getValidatorUsers() {
    return prisma.user.findMany({
        where: {
            role: { in: [...PAYMENT_VALIDATOR_ROLES] },
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
        orderBy: [
            { role: "asc" },
            { name: "asc" },
        ],
    })
}

async function notifyAdmins(title: string, message: string, actionUrl: string) {
    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    })

    await Promise.all(
        admins.map((admin) =>
            createNotification({
                userId: admin.id,
                type: "PAYMENT_ADMIN_ALERT",
                title,
                message,
                actionUrl,
            })
        )
    )
}

async function activateSubscriptionForPayment(params: {
    companyId: string
    planCode: string | null
    amount: number
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
}) {
    const selectedPlanCode = params.planCode || "ESSENTIEL"
    const now = new Date()

    const subscription = await prisma.subscription.upsert({
        where: { companyId: params.companyId },
        update: {
            planCode: selectedPlanCode,
            status: "ACTIVE",
            customPrice: params.amount,
            stripeCustomerId: params.stripeCustomerId || undefined,
            stripeSubscriptionId: params.stripeSubscriptionId || undefined,
            currentPeriodStart: now,
            currentPeriodEnd: addThirtyDays(now),
            setupFeePaid: true,
            setupFeePaidAt: now,
            canceledAt: null,
            cancelAtPeriodEnd: false,
        },
        create: {
            companyId: params.companyId,
            planCode: selectedPlanCode,
            status: "ACTIVE",
            customPrice: params.amount,
            stripeCustomerId: params.stripeCustomerId || null,
            stripeSubscriptionId: params.stripeSubscriptionId || null,
            currentPeriodStart: now,
            currentPeriodEnd: addThirtyDays(now),
            setupFeePaid: true,
            setupFeePaidAt: now,
        },
    })

    await ensureContractAfterPayment(params.companyId)
    return subscription
}

function mapPayment(payment: any): PaymentListItem {
    return {
        id: payment.id,
        method: payment.method,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        planCode: payment.planCode,
        scheduledFor: payment.scheduledFor,
        paidAt: payment.paidAt,
        validatedAt: payment.validatedAt,
        notes: payment.notes,
        rejectionReason: payment.rejectionReason,
        receiptNumber: payment.receiptNumber,
        createdAt: payment.createdAt,
        company: {
            id: payment.company.id,
            name: payment.company.name,
        },
        clientUser: payment.clientUser,
        collector: payment.collector,
        validatedBy: payment.validatedBy,
    }
}

export async function getSubscriptionOnboardingData() {
    const user = await getCurrentUser()
    if (!user || user.role !== "CLIENT" || !user.companyId) {
        return null
    }

    const [company, collectors, plans, recentPayments, latestAudit] = await Promise.all([
        prisma.company.findUnique({
            where: { id: user.companyId },
            include: {
                subscription: { include: { plan: true } },
                metier: true,
            },
        }),
        getValidatorUsers(),
        prisma.planTarifaire.findMany({
            where: { isActive: true },
            orderBy: { ordre: "asc" },
            select: {
                code: true,
                nom: true,
                description: true,
                prixMensuel: true,
                fraisSetup: true,
                fonctionnalites: true,
            },
        }),
        prisma.subscriptionPayment.findMany({
            where: { companyId: user.companyId },
            include: {
                company: { select: { id: true, name: true } },
                clientUser: { select: { id: true, name: true, email: true, role: true } },
                collector: { select: { id: true, name: true, email: true, role: true } },
                validatedBy: { select: { id: true, name: true, email: true, role: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 8,
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

    if (!company) return null

    const assignedPlanCode = latestAudit?.proposedPlanCode || company.subscription?.planCode || null
    const assignedAmount = latestAudit?.proposedPrice || company.subscription?.customPrice || null
    const assignedPlan = assignedPlanCode
        ? plans.find((plan) => plan.code === assignedPlanCode) || null
        : null

    return {
        user: {
            id: user.id,
            name: user.name || null,
            email: user.email || null,
        },
        company: {
            id: company.id,
            name: company.name,
            metier: company.metier?.nom || "Entreprise cliente",
            setupFeePaid: (company as any).setupFeePaid || company.subscription?.setupFeePaid,
        },
        subscription: company.subscription
            ? {
                planCode: company.subscription.planCode,
                planName: company.subscription.plan?.nom || company.subscription.planCode,
                status: company.subscription.status,
                customPrice: company.subscription.customPrice,
            }
            : null,
        recommendedPlanCode: assignedPlanCode,
        recommendedAmount: assignedAmount,
        assignedPlan: assignedPlan
            ? {
                code: assignedPlan.code,
                nom: assignedPlan.nom,
                description: assignedPlan.description,
                prixMensuel: assignedPlan.prixMensuel,
                fraisSetup: assignedPlan.fraisSetup,
                fonctionnalites: JSON.parse(assignedPlan.fonctionnalites || "[]") as string[],
            }
            : null,
        hasAccess: hasSubscriptionAccess(company.subscription),
        collectors,
        plans: plans.map((plan) => ({
            ...plan,
            fonctionnalites: JSON.parse(plan.fonctionnalites || "[]") as string[],
        })),
        recentPayments: recentPayments.map(mapPayment),
    }
}

export async function requestCashSubscriptionPayment(input: {
    collectorId: string
    scheduledFor: string
    amount: number
    planCode?: string | null
    notes?: string
}) {
    const user = await getCurrentUser()
    if (!user || user.role !== "CLIENT" || !user.companyId) {
        return { error: "Non autorisé" }
    }

    const collector = await prisma.user.findFirst({
        where: {
            id: input.collectorId,
            role: { in: [...PAYMENT_VALIDATOR_ROLES] },
        },
        select: { id: true, name: true, role: true },
    })

    if (!collector) {
        return { error: "Collecteur introuvable" }
    }

    const scheduledFor = new Date(input.scheduledFor)
    if (Number.isNaN(scheduledFor.getTime())) {
        return { error: "Date de paiement invalide" }
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return { error: "Montant invalide" }
    }

    const [subscription, latestAudit] = await Promise.all([
        prisma.subscription.findUnique({
            where: { companyId: user.companyId },
            select: {
                planCode: true,
                customPrice: true,
            },
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

    const assignedPlanCode = latestAudit?.proposedPlanCode || subscription?.planCode || null
    if (!assignedPlanCode) {
        return { error: "Aucun abonnement n'a encore été assigné par votre conseiller ICPP." }
    }

    const assignedAmount = latestAudit?.proposedPrice || subscription?.customPrice || null
    const finalAmount = Math.round(assignedAmount ?? input.amount)

    if (assignedAmount && Math.round(input.amount) !== Math.round(assignedAmount)) {
        return { error: "Le montant doit correspondre à l'abonnement assigné par votre conseiller ICPP." }
    }

    const payment = await prisma.subscriptionPayment.create({
        data: {
            companyId: user.companyId,
            clientUserId: user.id,
            collectorId: collector.id,
            method: "CASH",
            status: "AWAITING_VALIDATION",
            planCode: assignedPlanCode,
            amount: finalAmount,
            currency: "EUR",
            scheduledFor,
            notes: input.notes || null,
            metadata: JSON.stringify({ source: "client_subscription_gate" }),
        },
        include: {
            company: { select: { id: true, name: true } },
            clientUser: { select: { id: true, name: true, email: true, role: true } },
            collector: { select: { id: true, name: true, email: true, role: true } },
            validatedBy: { select: { id: true, name: true, email: true, role: true } },
        },
    })

    await createNotification({
        userId: collector.id,
        type: "CASH_PAYMENT_REQUESTED",
        title: "Nouveau paiement cash à vérifier",
        message: `${payment.company.name} a déclaré un paiement cash de ${(payment.amount / 100).toFixed(2)} EUR.`,
        actionUrl: "/auditeur/paiements",
    })

    await notifyAdmins(
        "Paiement cash déclaré",
        `${payment.company.name} a soumis un paiement cash en attente de validation.`,
        "/admin/paiements"
    )

    revalidatePath("/abonnement")
    revalidatePath("/admin/paiements")
    revalidatePath("/auditeur/paiements")

    return { success: true, payment: mapPayment(payment) }
}

export async function getPaymentsForCurrentUser() {
    const user = await getCurrentUser()
    if (!user) return []

    const where = user.role === "ADMIN"
        ? {}
        : user.role === "AUDITOR" || user.role === "COMMERCIAL"
            ? {
                OR: [
                    { collectorId: user.id },
                    { company: { is: { auditorId: user.id } } },
                    { company: { is: { commercialId: user.id } } },
                ],
            }
            : { clientUserId: user.id }

    const payments = await prisma.subscriptionPayment.findMany({
        where,
        include: {
            company: { select: { id: true, name: true } },
            clientUser: { select: { id: true, name: true, email: true, role: true } },
            collector: { select: { id: true, name: true, email: true, role: true } },
            validatedBy: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return payments.map(mapPayment)
}

export async function validateCashPayment(paymentId: string) {
    const user = await getCurrentUser()
    if (!user || !PAYMENT_VALIDATOR_ROLES.includes(user.role as (typeof PAYMENT_VALIDATOR_ROLES)[number])) {
        return { error: "Non autorisé" }
    }

    const payment = await prisma.subscriptionPayment.findUnique({
        where: { id: paymentId },
        include: {
            company: { select: { id: true, name: true } },
            clientUser: { select: { id: true, name: true } },
        },
    })

    if (!payment || payment.method !== "CASH") {
        return { error: "Paiement introuvable" }
    }

    if (payment.status === "PAID") {
        return { success: true }
    }

    if (user.role !== "ADMIN" && payment.collectorId !== user.id) {
        return { error: "Seul le collecteur sélectionné peut valider ce paiement" }
    }

    await activateSubscriptionForPayment({
        companyId: payment.companyId,
        planCode: payment.planCode,
        amount: payment.amount,
    })

    const updatedPayment = await prisma.subscriptionPayment.update({
        where: { id: paymentId },
        data: {
            status: "PAID",
            paidAt: payment.paidAt || payment.scheduledFor || new Date(),
            validatedAt: new Date(),
            validatedById: user.id,
            receiptNumber: payment.receiptNumber || generateReceiptNumber(),
            receiptIssuedAt: new Date(),
        },
    })

    await createNotification({
        userId: payment.clientUserId,
        type: "CASH_PAYMENT_CONFIRMED",
        title: "Paiement cash confirmé",
        message: `Votre paiement cash a été validé. Votre abonnement est maintenant actif.`,
        actionUrl: "/dashboard",
    })

    await notifyAdmins(
        "Paiement cash validé",
        `${payment.company.name} a désormais un abonnement actif suite à une validation cash.`,
        "/admin/paiements"
    )

    revalidatePath("/abonnement")
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/contrat")
    revalidatePath("/admin/paiements")
    revalidatePath("/auditeur/paiements")
    revalidatePath("/admin/abonnements")
    revalidatePath("/admin/contrats")
    revalidatePath("/auditeur/contrats")

    return { success: true, paymentId: updatedPayment.id }
}

export async function rejectCashPayment(paymentId: string, reason: string) {
    const user = await getCurrentUser()
    if (!user || !PAYMENT_VALIDATOR_ROLES.includes(user.role as (typeof PAYMENT_VALIDATOR_ROLES)[number])) {
        return { error: "Non autorisé" }
    }

    const payment = await prisma.subscriptionPayment.findUnique({
        where: { id: paymentId },
    })

    if (!payment || payment.method !== "CASH") {
        return { error: "Paiement introuvable" }
    }

    if (user.role !== "ADMIN" && payment.collectorId !== user.id) {
        return { error: "Seul le collecteur sélectionné peut rejeter ce paiement" }
    }

    await prisma.subscriptionPayment.update({
        where: { id: paymentId },
        data: {
            status: "REJECTED",
            rejectionReason: reason || "Informations invalides",
            validatedById: user.id,
            validatedAt: new Date(),
        },
    })

    await createNotification({
        userId: payment.clientUserId,
        type: "CASH_PAYMENT_REJECTED",
        title: "Paiement cash à corriger",
        message: "Votre déclaration de paiement cash a été refusée. Merci de vérifier les informations saisies.",
        actionUrl: "/abonnement",
    })

    revalidatePath("/abonnement")
    revalidatePath("/admin/paiements")
    revalidatePath("/auditeur/paiements")

    return { success: true }
}

export async function confirmStripeSubscriptionPayment(sessionId: string) {
    const user = await getCurrentUser()
    const stripe = getStripe()

    if (!user || user.role !== "CLIENT" || !user.companyId) {
        return { error: "Non autorisé" }
    }

    if (!isStripeEnabled() || !stripe) {
        return { error: "Stripe n'est pas configuré" }
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["subscription", "payment_intent"],
        })

        if (session.metadata?.companyId !== user.companyId) {
            return { error: "Cette session de paiement ne correspond pas à votre compte" }
        }

        if (session.payment_status !== "paid") {
            return { error: "Le paiement Stripe n'est pas confirmé. Votre accès reste bloqué jusqu'à validation du paiement." }
        }

        const stripeSubscription = typeof session.subscription === "object" && session.subscription
            ? session.subscription
            : null

        const amount = session.amount_total || 0
        const paymentId = session.metadata?.paymentId || null

        await activateSubscriptionForPayment({
            companyId: user.companyId,
            planCode: session.metadata?.planCode || null,
            amount,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : stripeSubscription?.id || null,
        })

        const payment = paymentId
            ? await prisma.subscriptionPayment.update({
                where: { id: paymentId },
                data: {
                    status: "PAID",
                    amount,
                    paidAt: new Date(),
                    validatedAt: new Date(),
                    planCode: session.metadata?.planCode || null,
                    stripeCheckoutSessionId: session.id,
                    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
                    stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : stripeSubscription?.id,
                    receiptNumber: generateReceiptNumber(),
                    receiptIssuedAt: new Date(),
                    metadata: JSON.stringify({ source: "stripe_success_redirect" }),
                },
            })
            : await prisma.subscriptionPayment.create({
                data: {
                    companyId: user.companyId,
                    clientUserId: user.id,
                    method: "STRIPE",
                    status: "PAID",
                    amount,
                    currency: session.currency?.toUpperCase() || "EUR",
                    planCode: session.metadata?.planCode || null,
                    paidAt: new Date(),
                    validatedAt: new Date(),
                    stripeCheckoutSessionId: session.id,
                    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
                    stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : stripeSubscription?.id,
                    receiptNumber: generateReceiptNumber(),
                    receiptIssuedAt: new Date(),
                    metadata: JSON.stringify({ source: "stripe_success_redirect" }),
                },
            })

        await createNotification({
            userId: user.id,
            type: "STRIPE_PAYMENT_CONFIRMED",
            title: "Paiement Stripe confirmé",
            message: "Votre paiement a bien été confirmé. Votre espace client est maintenant disponible.",
            actionUrl: "/dashboard",
        })

        await notifyAdmins(
            "Paiement Stripe confirmé",
            `Le client ${user.name || user.email} a activé son abonnement via Stripe.`,
            "/admin/paiements"
        )

        revalidatePath("/abonnement")
        revalidatePath("/dashboard")
        revalidatePath("/dashboard/contrat")
        revalidatePath("/admin/paiements")
        revalidatePath("/admin/abonnements")
        revalidatePath("/admin/contrats")
        revalidatePath("/auditeur/contrats")

        return { success: true, paymentId: payment.id }
    } catch (error) {
        console.error("confirmStripeSubscriptionPayment error:", error)
        return { error: "Impossible de confirmer cette session Stripe" }
    }
}