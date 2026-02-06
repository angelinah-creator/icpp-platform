"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-helpers"

// ============================================
// CLIENT DASHBOARD STATS
// ============================================

export async function getClientDashboardData() {
    const user = await getCurrentUser()
    if (!user || !user.companyId) {
        return null
    }

    const company = await prisma.company.findUnique({
        where: { id: user.companyId },
        include: {
            duerps: {
                orderBy: { updatedAt: "desc" },
                take: 1
            },
            subscription: {
                include: { plan: true }
            },
            metier: true
        }
    })

    if (!company) return null

    // Get DUERP status
    const latestDuerp = company.duerps[0]
    const duerpStatus = getDuerpStatusClient(latestDuerp)

    // Get compliance status
    const conformiteStatus = getConformiteStatusClient(latestDuerp)

    // Get documents count
    const documentsCount = await prisma.duerpDocument.count({
        where: { companyId: company.id }
    })

    return {
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        },
        company: {
            id: company.id,
            name: company.name,
            metier: company.metier?.nom || "Non défini",
            employeeCount: company.employeeCount
        },
        subscription: company.subscription ? {
            plan: company.subscription.plan?.nom || "Aucun",
            status: company.subscription.status,
            expiresAt: company.subscription.currentPeriodEnd
        } : null,
        duerp: latestDuerp ? {
            id: latestDuerp.id,
            status: duerpStatus,
            updatedAt: latestDuerp.updatedAt,
            signedAt: latestDuerp.signedAt
        } : null,
        stats: {
            conformite: conformiteStatus,
            documentsCount,
            notificationsCount: 0 // Notifications system not implemented yet
        }
    }
}

function getDuerpStatusClient(duerp: { status: string; signedAt: Date | null } | undefined) {
    if (!duerp) return "Aucun"
    if (duerp.signedAt) return "Signé"
    if (duerp.status === "DRAFT") return "Brouillon"
    if (duerp.status === "PENDING_SIGNATURE") return "En attente"
    return duerp.status
}

function getConformiteStatusClient(duerp: { signedAt: Date | null; updatedAt: Date } | undefined) {
    if (!duerp || !duerp.signedAt) return "non_conforme"

    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    if (duerp.signedAt > oneYearAgo) return "conforme"
    return "a_mettre_a_jour"
}

// ============================================
// DUERP CLIENT
// ============================================

export async function getClientDuerps() {
    const user = await getCurrentUser()
    if (!user || !user.companyId) return []

    const duerps = await prisma.duerpDocument.findMany({
        where: { companyId: user.companyId },
        orderBy: { updatedAt: "desc" }
    })

    return duerps.map(d => ({
        id: d.id,
        title: `DUERP v${d.version}`,
        status: getDuerpStatusClient(d),
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        signedAt: d.signedAt
    }))
}

// ============================================
// SIGNALEMENTS CLIENT
// ============================================

export async function createClientSignalement(data: {
    type: string
    titre?: string
    description: string
}) {
    const user = await getCurrentUser()
    if (!user || !user.companyId) {
        return { error: "Non autorisé" }
    }

    try {
        const signalement = await prisma.signalement.create({
            data: {
                type: data.type,
                titre: data.titre || data.type, // Utilise le titre fourni ou le type par défaut
                description: data.description,
                companyId: user.companyId,
                status: "NOUVEAU"
            }
        })

        return signalement
    } catch (error) {
        return { error: "Erreur lors de la création" }
    }
}

// ============================================
// AUDITEUR DASHBOARD
// ============================================

export async function getAuditeurDashboardData() {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") {
        return null
    }

    // Get all companies (simplified - no auditeur assignment in current schema)
    const companies = await prisma.company.findMany({
        include: {
            duerps: {
                orderBy: { updatedAt: "desc" },
                take: 1
            },
            subscription: {
                include: { plan: true }
            },
            metier: true
        },
        take: 20
    })

    // Get audits assigned to this auditeur
    const auditsEnCours = await prisma.audit.count({
        where: {
            auditorId: user.id,
            status: { in: ["PLANIFIE", "EN_COURS"] }
        }
    })

    // Get DUERP pending validation
    const duerpAValider = await prisma.duerpDocument.count({
        where: {
            status: "PENDING_SIGNATURE"
        }
    })

    return {
        user: {
            name: user.name,
            email: user.email
        },
        stats: {
            clientsAssignes: companies.length,
            auditsEnCours,
            duerpAValider
        },
        clients: companies.map(c => ({
            id: c.id,
            name: c.name,
            metier: c.metier?.nom || "Non défini",
            employeeCount: c.employeeCount,
            subscription: c.subscription?.plan?.nom || "Aucun",
            duerpStatus: getDuerpStatusClient(c.duerps[0])
        })),
        recentActivity: [] // Audit log system simplified
    }
}

export async function getAuditeurClients() {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") return []

    const clients = await prisma.company.findMany({
        include: {
            duerps: {
                orderBy: { updatedAt: "desc" },
                take: 1
            },
            subscription: {
                include: { plan: true }
            },
            metier: true
        }
    })

    return clients.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        metier: c.metier?.nom || "Non défini",
        employeeCount: c.employeeCount,
        subscription: c.subscription?.plan?.nom || "Aucun",
        duerpStatus: getDuerpStatusClient(c.duerps[0]),
        lastUpdate: c.duerps[0]?.updatedAt
    }))
}

export async function getAuditeurAudits() {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") return []

    const audits = await prisma.audit.findMany({
        where: { auditorId: user.id },
        include: {
            company: true
        },
        orderBy: { dateAudit: "desc" }
    })

    return audits.map(a => ({
        id: a.id,
        entreprise: a.company.name,
        type: a.type,
        dateAudit: a.dateAudit,
        status: a.status
    }))
}

// ============================================
// AUDITEUR TPE MANAGEMENT
// ============================================

export async function getMetiersForAuditeur() {
    return prisma.metierICPP.findMany({
        where: { isActive: true },
        select: { code: true, nom: true },
        orderBy: { nom: "asc" }
    })
}

export async function createCompanyAsAuditeur(data: {
    name: string
    siret?: string
    email?: string
    phone?: string
    address: string
    postalCode?: string
    city: string
    metierCode?: string
    employeeCount?: number
}) {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") {
        return { error: "Non autorisé" }
    }

    try {
        const company = await prisma.company.create({
            data: {
                name: data.name,
                siret: data.siret || null,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                postalCode: data.postalCode || null,
                city: data.city,
                metierCode: data.metierCode || null,
                employeeCount: data.employeeCount || 1
            }
        })

        return { success: true, company }
    } catch (error) {
        return { error: "Erreur lors de la création" }
    }
}

export async function updateCompanyAsAuditeur(id: string, data: {
    name?: string
    siret?: string
    email?: string
    phone?: string
    address?: string
    postalCode?: string
    city?: string
    metierCode?: string
    employeeCount?: number
}) {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") {
        return { error: "Non autorisé" }
    }

    try {
        const company = await prisma.company.update({
            where: { id },
            data: {
                name: data.name,
                siret: data.siret || null,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address,
                postalCode: data.postalCode || null,
                city: data.city,
                metierCode: data.metierCode || null,
                employeeCount: data.employeeCount
            }
        })

        return { success: true, company }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour" }
    }
}

export async function getCompanyDetailForAuditeur(id: string) {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") {
        return null
    }

    const company = await prisma.company.findUnique({
        where: { id },
        include: {
            metier: true,
            subscription: {
                include: { plan: true }
            },
            duerps: {
                orderBy: { createdAt: "desc" },
                take: 5
            },
            audits: {
                where: { auditorId: user.id },
                orderBy: { dateAudit: "desc" },
                take: 5
            },
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    })

    if (!company) return null

    return {
        id: company.id,
        name: company.name,
        siret: company.siret,
        email: company.email,
        phone: company.phone,
        address: company.address,
        postalCode: company.postalCode,
        city: company.city,
        metier: company.metier?.nom || "Non défini",
        metierCode: company.metierCode,
        employeeCount: company.employeeCount,
        subscription: company.subscription?.plan?.nom || "Aucun",
        subscriptionStatus: company.subscription?.status,
        duerps: company.duerps.map(d => ({
            id: d.id,
            status: d.status,
            createdAt: d.createdAt,
            signedAt: d.signedAt
        })),
        audits: company.audits.map(a => ({
            id: a.id,
            type: a.type,
            status: a.status,
            dateAudit: a.dateAudit
        })),
        contacts: company.users
    }
}
