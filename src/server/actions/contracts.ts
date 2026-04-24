"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"
import { createNotification } from "@/server/actions/notifications"
import { revalidatePath } from "next/cache"
import { ensureContractAfterPayment } from "@/lib/contracts"
import { getStripe, isStripeEnabled } from "@/lib/stripe"

interface ContractListItem {
    id: string
    numeroContrat: string
    companyId: string
    companyName: string
    cgvVersion: string
    status: string
    dateDebut: Date
    signedAt: Date | null
    createdAt: Date
}

interface OnsiteFinalizationData {
    auditId: string
    status: string
    companyId: string
    companyName: string
    clientUserId: string | null
    clientName: string
    clientEmail: string | null
    assignedPlanCode: string | null
    assignedPlanName: string | null
    assignedAmount: number | null
    paymentCompleted: boolean
    latestPayment: {
        id: string
        method: string
        status: string
        amount: number
        paidAt: Date | null
        createdAt: Date
    } | null
    contract: {
        id: string
        numeroContrat: string
        signedAt: Date | null
        signatureDraft: string | null
    } | null
}

function isFacilitatorRole(role: string) {
    return ["ADMIN", "AUDITOR", "COMMERCIAL"].includes(role)
}

function isAllowedReturnPath(path: string) {
    return /^\/(auditeur|admin)\/audits\/[^/]+\/finalisation$/.test(path)
}

function pickAssignedAmount(audit: any, planPrice: number | null, customPrice: number | null) {
    if (audit.proposedPrice) return Math.round(audit.proposedPrice)
    if (customPrice) return Math.round(customPrice)
    if (planPrice) return Math.round(planPrice)
    return null
}

async function getAuditWithAuthorization(auditId: string, user: { id: string; role: string }) {
    const audit = await prisma.audit.findUnique({
        where: { id: auditId },
        include: {
            company: {
                include: {
                    users: {
                        where: { role: "CLIENT" },
                        select: { id: true, name: true, email: true },
                        take: 1,
                    },
                    subscription: {
                        include: { plan: true },
                    },
                },
            },
        },
    })

    if (!audit) return { error: "Audit introuvable" as const }

    if (user.role !== "ADMIN") {
        const isAuditCreator = audit.auditorId === user.id
        const isCompanyAssigned = audit.company.auditorId === user.id || audit.company.commercialId === user.id
        const isAssigned = isAuditCreator || isCompanyAssigned
        if (!isAssigned) return { error: "Acces refuse" as const }
    }

    return { audit }
}

async function activateSubscriptionAndContract(params: {
    companyId: string
    planCode: string
    amount: number
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
}) {
    const now = new Date()
    await prisma.subscription.upsert({
        where: { companyId: params.companyId },
        update: {
            planCode: params.planCode,
            status: "ACTIVE",
            customPrice: params.amount,
            stripeCustomerId: params.stripeCustomerId || undefined,
            stripeSubscriptionId: params.stripeSubscriptionId || undefined,
            currentPeriodStart: now,
            currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            setupFeePaid: true,
            setupFeePaidAt: now,
            canceledAt: null,
            cancelAtPeriodEnd: false,
        },
        create: {
            companyId: params.companyId,
            planCode: params.planCode,
            status: "ACTIVE",
            customPrice: params.amount,
            stripeCustomerId: params.stripeCustomerId || null,
            stripeSubscriptionId: params.stripeSubscriptionId || null,
            currentPeriodStart: now,
            currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            setupFeePaid: true,
            setupFeePaidAt: now,
        },
    })

    await ensureContractAfterPayment(params.companyId)
}

export async function getOnsiteAuditFinalization(auditId: string): Promise<OnsiteFinalizationData | null> {
    const user = await getCurrentUser()
    if (!user || !isFacilitatorRole(user.role)) return null

    const resolved = await getAuditWithAuthorization(auditId, { id: user.id, role: user.role })
    if ("error" in resolved) return null

    const { audit } = resolved

    const [latestPayment, latestContract] = await Promise.all([
        prisma.subscriptionPayment.findFirst({
            where: { companyId: audit.companyId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                method: true,
                status: true,
                amount: true,
                paidAt: true,
                createdAt: true,
            },
        }),
        prisma.contrat.findFirst({
            where: { companyId: audit.companyId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                numeroContrat: true,
                signedAt: true,
                signatureData: true,
            },
        }),
    ])

    let signatureDraft: string | null = null
    if (latestContract?.signatureData) {
        try {
            signatureDraft = JSON.parse(latestContract.signatureData)?.drawingDataUrl || null
        } catch {
            signatureDraft = null
        }
    }

    const assignedPlanCode = audit.proposedPlanCode || audit.company.subscription?.planCode || null
    const assignedPlanName = assignedPlanCode
        ? audit.company.subscription?.plan?.nom || assignedPlanCode
        : null

    const assignedAmount = pickAssignedAmount(
        audit,
        audit.company.subscription?.plan?.prixMensuel || null,
        audit.company.subscription?.customPrice || null
    )

    const paymentCompleted =
        audit.company.subscription?.status === "ACTIVE" ||
        latestPayment?.status === "PAID"

    return {
        auditId: audit.id,
        status: audit.status,
        companyId: audit.companyId,
        companyName: audit.company.name,
        clientUserId: audit.company.users[0]?.id || null,
        clientName: audit.company.users[0]?.name || audit.company.name,
        clientEmail: audit.company.users[0]?.email || null,
        assignedPlanCode,
        assignedPlanName,
        assignedAmount,
        paymentCompleted,
        latestPayment,
        contract: latestContract
            ? {
                id: latestContract.id,
                numeroContrat: latestContract.numeroContrat,
                signedAt: latestContract.signedAt,
                signatureDraft,
            }
            : null,
    }
}

export async function createOnsiteCheckoutSession(auditId: string, returnPath: string) {
    const user = await getCurrentUser()
    const stripe = getStripe()

    if (!user || !isFacilitatorRole(user.role)) {
        return { error: "Non autorise" }
    }

    if (!isAllowedReturnPath(returnPath)) {
        return { error: "Route de retour invalide" }
    }

    if (!isStripeEnabled() || !stripe) {
        return { error: "Stripe n'est pas configure" }
    }

    const resolved = await getAuditWithAuthorization(auditId, { id: user.id, role: user.role })
    if ("error" in resolved) return { error: resolved.error }

    const { audit } = resolved

    if (audit.status !== "TERMINE") {
        return { error: "Finalisez d'abord l'audit pour encaisser le paiement." }
    }

    const assignedPlanCode = audit.proposedPlanCode || audit.company.subscription?.planCode || null
    if (!assignedPlanCode) {
        return { error: "Aucun abonnement n'a ete assigne a ce client." }
    }

    const plan = await prisma.planTarifaire.findUnique({ where: { code: assignedPlanCode } })
    if (!plan) return { error: "Plan assigne introuvable" }

    const amount = pickAssignedAmount(audit, plan.prixMensuel, audit.company.subscription?.customPrice || null)
    if (!amount || amount <= 0) {
        return { error: "Montant de paiement invalide" }
    }

    const clientUserId = audit.company.users[0]?.id
    if (!clientUserId) {
        return { error: "Aucun utilisateur client lie a cette entreprise" }
    }

    const payment = await prisma.subscriptionPayment.create({
        data: {
            companyId: audit.companyId,
            clientUserId,
            method: "STRIPE",
            status: "PENDING",
            planCode: assignedPlanCode,
            amount,
            currency: "EUR",
            metadata: JSON.stringify({
                source: "onsite_audit_flow",
                auditId: audit.id,
                facilitatorId: user.id,
            }),
        },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: audit.company.email || audit.company.users[0]?.email || undefined,
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: `Abonnement ${plan.nom}`,
                        description: plan.description,
                    },
                    recurring: { interval: "month" },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        metadata: {
            companyId: audit.companyId,
            auditId: audit.id,
            planCode: assignedPlanCode,
            paymentId: payment.id,
            facilitatorId: user.id,
        },
        success_url: `${baseUrl}${returnPath}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}${returnPath}?canceled=1`,
    })

    await prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: { stripeCheckoutSessionId: session.id },
    })

    if (!session.url) {
        return { error: "Impossible de creer la session Stripe" }
    }

    return { success: true, url: session.url }
}

export async function finalizeOnsiteStripePayment(auditId: string, sessionId: string) {
    const user = await getCurrentUser()
    const stripe = getStripe()
    if (!user || !isFacilitatorRole(user.role)) return { error: "Non autorise" }
    if (!isStripeEnabled() || !stripe) return { error: "Stripe n'est pas configure" }

    const resolved = await getAuditWithAuthorization(auditId, { id: user.id, role: user.role })
    if ("error" in resolved) return { error: resolved.error }
    const { audit } = resolved

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["subscription", "payment_intent"],
        })

        if (session.metadata?.companyId !== audit.companyId) {
            return { error: "Session Stripe non correspondante" }
        }

        if (session.payment_status !== "paid") {
            return { error: "Le paiement n'est pas encore confirme" }
        }

        const planCode = session.metadata?.planCode || audit.proposedPlanCode || audit.company.subscription?.planCode
        if (!planCode) return { error: "Plan manquant" }

        const amount = session.amount_total || 0
        await activateSubscriptionAndContract({
            companyId: audit.companyId,
            planCode,
            amount,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
        })

        const paymentId = session.metadata?.paymentId || null
        if (paymentId) {
            await prisma.subscriptionPayment.updateMany({
                where: { id: paymentId },
                data: {
                    status: "PAID",
                    amount,
                    paidAt: new Date(),
                    validatedAt: new Date(),
                    validatedById: user.id,
                    stripeCheckoutSessionId: session.id,
                    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
                    stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
                    receiptIssuedAt: new Date(),
                },
            })
        }

        revalidatePath("/admin/audits")
        revalidatePath("/auditeur/audits")
        revalidatePath("/admin/contrats")
        revalidatePath("/auditeur/contrats")

        return { success: true }
    } catch (error) {
        console.error("finalizeOnsiteStripePayment error:", error)
        return { error: "Impossible de finaliser ce paiement Stripe" }
    }
}

export async function confirmOnsiteCashPayment(auditId: string) {
    const user = await getCurrentUser()
    if (!user || !isFacilitatorRole(user.role)) return { error: "Non autorise" }

    const resolved = await getAuditWithAuthorization(auditId, { id: user.id, role: user.role })
    if ("error" in resolved) return { error: resolved.error }
    const { audit } = resolved

    if (audit.status !== "TERMINE") {
        return { error: "Finalisez d'abord l'audit." }
    }

    const assignedPlanCode = audit.proposedPlanCode || audit.company.subscription?.planCode || null
    if (!assignedPlanCode) return { error: "Aucun plan assigne" }

    const plan = await prisma.planTarifaire.findUnique({ where: { code: assignedPlanCode } })
    const amount = pickAssignedAmount(audit, plan?.prixMensuel || null, audit.company.subscription?.customPrice || null)
    if (!amount || amount <= 0) return { error: "Montant invalide" }

    const clientUserId = audit.company.users[0]?.id
    if (!clientUserId) return { error: "Aucun utilisateur client lie" }

    await activateSubscriptionAndContract({
        companyId: audit.companyId,
        planCode: assignedPlanCode,
        amount,
    })

    await prisma.subscriptionPayment.create({
        data: {
            companyId: audit.companyId,
            clientUserId,
            collectorId: user.id,
            validatedById: user.id,
            method: "CASH",
            status: "PAID",
            planCode: assignedPlanCode,
            amount,
            currency: "EUR",
            paidAt: new Date(),
            validatedAt: new Date(),
            receiptIssuedAt: new Date(),
            metadata: JSON.stringify({
                source: "onsite_audit_flow",
                auditId: audit.id,
                facilitatorId: user.id,
            }),
        },
    })

    revalidatePath("/admin/audits")
    revalidatePath("/auditeur/audits")
    revalidatePath("/admin/contrats")
    revalidatePath("/auditeur/contrats")

    return { success: true }
}

export async function generateContractForOnsiteAudit(auditId: string) {
    const user = await getCurrentUser()
    if (!user || !isFacilitatorRole(user.role)) return { error: "Non autorise" }

    const resolved = await getAuditWithAuthorization(auditId, { id: user.id, role: user.role })
    if ("error" in resolved) return { error: resolved.error }
    const { audit } = resolved

    const hasPaid = await prisma.subscriptionPayment.findFirst({
        where: {
            companyId: audit.companyId,
            status: "PAID",
        },
        select: { id: true },
    })

    if (!hasPaid && audit.company.subscription?.status !== "ACTIVE") {
        return { error: "Le paiement doit etre confirme avant generation du contrat." }
    }

    await ensureContractAfterPayment(audit.companyId)
    revalidatePath("/admin/contrats")
    revalidatePath("/auditeur/contrats")
    return { success: true }
}

export async function saveOnsiteContractSignature(contractId: string, drawingDataUrl: string, signerName?: string) {
    const user = await getCurrentUser()
    if (!user || !isFacilitatorRole(user.role)) return { error: "Non autorise" }
    if (!drawingDataUrl || !drawingDataUrl.startsWith("data:image/")) {
        return { error: "Signature invalide" }
    }

    const contract = await prisma.contrat.findUnique({
        where: { id: contractId },
        include: {
            company: {
                select: {
                    auditorId: true,
                    commercialId: true,
                },
            },
        },
    })

    if (!contract) return { error: "Contrat introuvable" }

    if (user.role !== "ADMIN") {
        const isAssigned = contract.company.auditorId === user.id || contract.company.commercialId === user.id
        let isAuditCreator = false
        if (user.role === "AUDITOR") {
            const createdAudit = await prisma.audit.findFirst({
                where: {
                    companyId: contract.companyId,
                    auditorId: user.id,
                },
                select: { id: true },
            })
            isAuditCreator = Boolean(createdAudit)
        }

        if (!isAssigned && !isAuditCreator) return { error: "Acces refuse" }
    }

    let payload: Record<string, unknown> = {}
    try {
        payload = contract.signatureData ? JSON.parse(contract.signatureData) : {}
    } catch {
        payload = {}
    }

    await prisma.contrat.update({
        where: { id: contract.id },
        data: {
            signatureData: JSON.stringify({
                ...payload,
                drawingDataUrl,
                signerName: signerName || payload.signerName || "Client",
                signedInPresence: true,
                facilitatorId: user.id,
                lastDraftAt: new Date().toISOString(),
            }),
        },
    })

    revalidatePath("/admin/contrats")
    revalidatePath("/auditeur/contrats")
    return { success: true }
}

export async function validateOnsiteContractSignature(contractId: string) {
    const user = await getCurrentUser()
    if (!user || !isFacilitatorRole(user.role)) return { error: "Non autorise" }

    const contract = await prisma.contrat.findUnique({
        where: { id: contractId },
        include: {
            company: {
                include: {
                    users: {
                        where: { role: "CLIENT" },
                        select: { id: true },
                    },
                },
            },
        },
    })

    if (!contract) return { error: "Contrat introuvable" }

    if (user.role !== "ADMIN") {
        const isAssigned = contract.company.auditorId === user.id || contract.company.commercialId === user.id
        let isAuditCreator = false
        if (user.role === "AUDITOR") {
            const createdAudit = await prisma.audit.findFirst({
                where: {
                    companyId: contract.companyId,
                    auditorId: user.id,
                },
                select: { id: true },
            })
            isAuditCreator = Boolean(createdAudit)
        }

        if (!isAssigned && !isAuditCreator) return { error: "Acces refuse" }
    }

    let payload: Record<string, unknown> = {}
    try {
        payload = contract.signatureData ? JSON.parse(contract.signatureData) : {}
    } catch {
        payload = {}
    }

    if (typeof payload.drawingDataUrl !== "string" || !payload.drawingDataUrl) {
        return { error: "Merci de faire signer le client avant validation." }
    }

    const signedAt = new Date()
    await prisma.contrat.update({
        where: { id: contract.id },
        data: {
            signedAt,
            signatureData: JSON.stringify({
                ...payload,
                signedAt: signedAt.toISOString(),
                validatedByFacilitatorId: user.id,
            }),
        },
    })

    const adminUsers = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    })

    const receivers = new Set<string>([
        user.id,
        ...adminUsers.map((u) => u.id),
        contract.company.auditorId || "",
        contract.company.commercialId || "",
        ...contract.company.users.map((u) => u.id),
    ])
    receivers.delete("")

    await Promise.all(
        Array.from(receivers).map((userId) =>
            createNotification({
                userId,
                type: "CONTRACT_SIGNED",
                title: "Contrat signe et disponible",
                message: `${contract.company.name} a finalise la signature du contrat ${contract.numeroContrat}.`,
                actionUrl: userId === contract.company.users[0]?.id ? "/dashboard/contrat" : "/admin/contrats",
            })
        )
    )

    revalidatePath("/dashboard/contrat")
    revalidatePath("/admin/contrats")
    revalidatePath("/auditeur/contrats")

    return { success: true }
}

function mapContract(contract: any): ContractListItem {
    return {
        id: contract.id,
        numeroContrat: contract.numeroContrat,
        companyId: contract.companyId,
        companyName: contract.company.name,
        cgvVersion: contract.cgvVersion,
        status: contract.status,
        dateDebut: contract.dateDebut,
        signedAt: contract.signedAt,
        createdAt: contract.createdAt,
    }
}

export async function requestClientPaymentAfterAudit(auditId: string) {
    const user = await getCurrentUser()
    if (!user || !["ADMIN", "AUDITOR", "COMMERCIAL"].includes(user.role)) {
        return { error: "Non autorise" }
    }

    const audit = await prisma.audit.findUnique({
        where: { id: auditId },
        include: {
            company: {
                include: {
                    users: {
                        where: { role: "CLIENT" },
                        select: { id: true },
                    },
                },
            },
        },
    })

    if (!audit) return { error: "Audit introuvable" }

    if (user.role !== "ADMIN") {
        const isAssigned = audit.company.auditorId === user.id || audit.company.commercialId === user.id
        if (!isAssigned) return { error: "Acces refuse" }
    }

    if (audit.status !== "TERMINE") {
        return { error: "Le bouton est disponible uniquement apres finalisation de l'audit." }
    }

    if (!audit.proposedPlanCode) {
        return { error: "Choisissez d'abord un abonnement adapte au client avant de lancer le paiement." }
    }

    if (audit.company.users.length === 0) {
        return { error: "Aucun utilisateur client rattache a cette entreprise." }
    }

    await Promise.all(
        audit.company.users.map((client) =>
            createNotification({
                userId: client.id,
                type: "PAYMENT_ACTION_REQUIRED",
                title: "Proceder au paiement",
                message: `Votre audit est termine. Merci de proceder au paiement de l'abonnement ${audit.proposedPlanCode}.`,
                actionUrl: "/abonnement",
            })
        )
    )

    revalidatePath("/admin/audits")
    revalidatePath("/auditeur/audits")

    return { success: true }
}

export async function getClientContractForSigning() {
    const user = await getCurrentUser()
    if (!user || user.role !== "CLIENT" || !user.companyId) return null

    const contract = await prisma.contrat.findFirst({
        where: { companyId: user.companyId },
        include: {
            company: {
                include: {
                    subscription: {
                        include: { plan: true },
                    },
                },
            },
            cgv: true,
        },
        orderBy: { createdAt: "desc" },
    })

    if (!contract) return null

    let signaturePayload: any = null
    try {
        signaturePayload = contract.signatureData ? JSON.parse(contract.signatureData) : null
    } catch {
        signaturePayload = null
    }

    return {
        id: contract.id,
        numeroContrat: contract.numeroContrat,
        status: contract.status,
        cgvVersion: contract.cgvVersion,
        cgvContenu: contract.cgv.contenu,
        dateDebut: contract.dateDebut.toISOString(),
        signedAt: contract.signedAt ? contract.signedAt.toISOString() : null,
        signatureDraft: signaturePayload?.drawingDataUrl || null,
        companyName: contract.company.name,
        planName: contract.company.subscription?.plan?.nom || "Plan ICPP",
    }
}

export async function saveClientContractSignature(contractId: string, drawingDataUrl: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== "CLIENT" || !user.companyId) {
        return { error: "Non autorise" }
    }

    if (!drawingDataUrl || !drawingDataUrl.startsWith("data:image/")) {
        return { error: "Signature invalide" }
    }

    const contract = await prisma.contrat.findFirst({
        where: {
            id: contractId,
            companyId: user.companyId,
            status: "ACTIF",
        },
    })

    if (!contract) return { error: "Contrat introuvable" }

    let payload: Record<string, unknown> = {}
    try {
        payload = contract.signatureData ? JSON.parse(contract.signatureData) : {}
    } catch {
        payload = {}
    }

    await prisma.contrat.update({
        where: { id: contract.id },
        data: {
            signatureData: JSON.stringify({
                ...payload,
                drawingDataUrl,
                signerName: user.name || null,
                signerEmail: user.email || null,
                lastDraftAt: new Date().toISOString(),
            }),
        },
    })

    revalidatePath("/dashboard/contrat")
    return { success: true }
}

export async function validateClientContract(contractId: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== "CLIENT" || !user.companyId) {
        return { error: "Non autorise" }
    }

    const contract = await prisma.contrat.findFirst({
        where: {
            id: contractId,
            companyId: user.companyId,
            status: "ACTIF",
        },
        include: {
            company: {
                select: {
                    name: true,
                    auditorId: true,
                    commercialId: true,
                },
            },
        },
    })

    if (!contract) return { error: "Contrat introuvable" }

    let payload: Record<string, unknown> = {}
    try {
        payload = contract.signatureData ? JSON.parse(contract.signatureData) : {}
    } catch {
        payload = {}
    }

    if (typeof payload.drawingDataUrl !== "string" || !payload.drawingDataUrl) {
        return { error: "Merci de signer le contrat avant validation." }
    }

    const signedAt = new Date()

    await prisma.contrat.update({
        where: { id: contract.id },
        data: {
            signedAt,
            signatureData: JSON.stringify({
                ...payload,
                signedAt: signedAt.toISOString(),
                signedByUserId: user.id,
                signerName: user.name || null,
                signerEmail: user.email || null,
            }),
        },
    })

    const adminUsers = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    })

    const receivers = [
        ...adminUsers.map((u) => u.id),
        contract.company.auditorId,
        contract.company.commercialId,
    ].filter(Boolean) as string[]

    await Promise.all(
        receivers.map((userId) =>
            createNotification({
                userId,
                type: "CONTRACT_SIGNED",
                title: "Contrat client signe",
                message: `${contract.company.name} a signe numeriquement son contrat ${contract.numeroContrat}.`,
                actionUrl: "/admin/contrats",
            })
        )
    )

    revalidatePath("/dashboard/contrat")
    revalidatePath("/admin/contrats")
    revalidatePath("/auditeur/contrats")

    return { success: true }
}

export async function getAdminContracts() {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return []

    const contracts = await prisma.contrat.findMany({
        include: {
            company: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return contracts.map(mapContract)
}

export async function getAuditeurContracts() {
    const user = await getCurrentUser()
    if (!user || !["AUDITOR", "COMMERCIAL"].includes(user.role)) return []

    const contracts = await prisma.contrat.findMany({
        where: {
            company: {
                OR: [
                    { auditorId: user.id },
                    { commercialId: user.id },
                ],
            },
        },
        include: {
            company: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
    })

    return contracts.map(mapContract)
}
