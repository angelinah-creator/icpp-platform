"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth-helpers"
import { calcIndicateurs } from "@/lib/duerp-calcul"

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

    return duerps.map((d: any) => ({
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
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
        return null
    }

    // Get companies assigned to this auditor/commercial
    const companies = await prisma.company.findMany({
        where: {
            OR: [
                { auditorId: user.id },
                { commercialId: user.id }
            ]
        },
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
        clients: companies.map((c: any) => ({
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
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) return []

    // Cherche d'abord les entreprises explicitement assignées à cet auditeur
    const assignedClients = await prisma.company.findMany({
        where: {
            OR: [
                { auditorId: user.id },
                { commercialId: user.id }
            ]
        },
        include: {
            duerps: { orderBy: { updatedAt: "desc" }, take: 1 },
            subscription: { include: { plan: true } },
            metier: true
        }
    })

    // Si aucune entreprise assignée, retourne toutes les entreprises
    // (cas d'un auditeur nouvellement créé ou non encore assigné)
    const clients = assignedClients.length > 0
        ? assignedClients
        : await prisma.company.findMany({
            include: {
                duerps: { orderBy: { updatedAt: "desc" }, take: 1 },
                subscription: { include: { plan: true } },
                metier: true
            },
            orderBy: { name: "asc" }
        })

    return clients.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        metier: c.metier?.nom || "Non défini",
        metierCode: c.metierCode || null,
        employeeCount: c.employeeCount,
        subscription: c.subscription?.plan?.nom || "Aucun",
        duerpStatus: getDuerpStatusClient(c.duerps[0]),
        lastUpdate: c.duerps[0]?.updatedAt
    }))
}

export async function getAuditeurAudits() {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) return []

    const audits = await prisma.audit.findMany({
        where: { auditorId: user.id },
        include: {
            company: {
                include: { metier: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return audits.map((a: any) => {
        const statusColor =
            a.status === "PLANIFIÉ" ? "bg-blue-100 text-blue-700" :
                a.status === "EN_COURS" ? "bg-orange-100 text-orange-700" :
                    a.status === "TERMINÉ" ? "bg-green-100 text-green-700" :
                        "bg-slate-100 text-slate-700"

        let parsedScore: number | null = null
        try {
            if (a.observations) {
                const obs = JSON.parse(a.observations)
                parsedScore = obs.score ?? null
            }
        } catch { /* not JSON */ }

        return {
            id: a.id,
            companyName: a.company.name,
            companyActivity: a.company.metier?.nom || null,
            date: a.createdAt.toISOString().split('T')[0],
            score: parsedScore,
            status: a.status,
            statusColor: statusColor
        }
    })
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

export async function getPlansForAuditeur() {
    return prisma.planTarifaire.findMany({
        where: { isActive: true },
        select: { code: true, nom: true, prixMensuel: true },
        orderBy: { ordre: "asc" }
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
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
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
                employeeCount: data.employeeCount || 1,
                auditorId: user.id  // Auto-assigner l'auditeur créateur
            }
        })

        // Auto-generate 4 affichages obligatoires
        const { seedAffichagesForCompany } = await import("@/lib/seed-affichages")
        await seedAffichagesForCompany(company.id)

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
    planCode?: string
    status?: string
}) {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
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

        // Gérer l'abonnement si planCode ou status fourni
        if (data.planCode || data.status) {
            await prisma.subscription.upsert({
                where: { companyId: id },
                update: {
                    planCode: data.planCode || undefined,
                    status: data.status || undefined,
                    updatedAt: new Date()
                },
                create: {
                    companyId: id,
                    planCode: data.planCode || "ESSENTIEL",
                    status: data.status || "ACTIVE",
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                }
            })
        }

        return { success: true, company }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour" }
    }
}

export async function getCompanyDetailForAuditeur(id: string) {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
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
            },
            internalNotes: {
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        }
                    }
                },
                orderBy: [
                    { isPinned: "desc" },
                    { createdAt: "desc" }
                ]
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
        subscriptionCode: company.subscription?.planCode || null,
        subscriptionStatus: company.subscription?.status,
        internalNotes: company.internalNotes,
        duerps: company.duerps.map((d: any) => ({
            id: d.id,
            status: d.status,
            createdAt: d.createdAt,
            signedAt: d.signedAt
        })),
        audits: company.audits.map((a: any) => ({
            id: a.id,
            type: a.type,
            status: a.status,
            dateAudit: a.dateAudit
        })),
        contacts: company.users
    }
}
// ============================================
// AUDIT CREATION (Priorité 1.1)
// ============================================

export async function createAudit(data: {
    companyId: string
    documents: { [key: string]: boolean }
    risks: Array<{
        categorie: string
        nom: string
        identifie: boolean
        gravite?: number
        frequence?: number
        niveauMaitrise?: string
    }>
    commentaire?: string
    proposedPlanCode?: string
    proposedPrice?: number
}) {
    const user = await getCurrentUser()

    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
        return { error: "Non autorisé" }
    }

    try {
        const totalDocuments = Object.keys(data.documents).length
        const documentsPresents = Object.values(data.documents).filter(Boolean).length
        const scoreDocuments = totalDocuments > 0 ? (documentsPresents / totalDocuments) * 100 : 0

        const risquesIdentifies = data.risks.filter(r => r.identifie).length
        const scoreRisques = data.risks.length > 0 ? (risquesIdentifies / data.risks.length) * 30 : 0
        const scoreGlobal = Math.round((scoreDocuments * 0.7) + scoreRisques)

        const auditDetails = JSON.stringify({
            score: scoreGlobal,
            documents: data.documents,
            risks: data.risks.filter(r => r.identifie).map(r => {
                const f = r.frequence || 2
                const g = r.gravite || 2
                const niveauMaitrise = r.niveauMaitrise || "Aucune"
                const { ponderation, risqueBrut, risqueResiduel, prioriteAction } = calcIndicateurs(f, g, niveauMaitrise)
                return {
                    categorie: r.categorie,
                    nom: r.nom,
                    gravite: g,
                    frequence: f,
                    niveauMaitrise,
                    ponderation,
                    risqueBrut,
                    risqueResiduel,
                    prioriteAction,
                    // Kept for backward-compat
                    priorite: risqueBrut,
                }
            }),
            commentaire: data.commentaire || null
        })

        const audit = await prisma.audit.create({
            data: {
                companyId: data.companyId,
                auditorId: user.id,
                type: "INITIAL",
                status: "TERMINE",
                dateAudit: new Date(),
                dateRealisation: new Date(),
                observations: auditDetails,
                proposedPlanCode: data.proposedPlanCode || null,
                proposedPrice: data.proposedPrice ? Math.round(data.proposedPrice * 100) : null
            }
        })

        revalidatePath("/admin/audits")
        revalidatePath("/dashboard")

        return {
            success: true,
            auditId: audit.id,
            score: scoreGlobal
        }
    } catch (error) {
        console.error("[createAudit] Erreur:", error)
        return { error: "Erreur lors de la création de l'audit" }
    }
}

// ============================================
// AUDITEUR TÂCHES & SIGNALEMENTS
// ============================================

export async function getAuditeurTaches() {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) return []

    // Récupérer les DUERP en attente de validation
    const duerpsEnAttente = await prisma.duerpDocument.findMany({
        where: {
            company: {
                OR: [
                    { auditorId: user.id },
                    { commercialId: user.id }
                ]
            },
            status: { in: ["BROUILLON", "EN_COURS"] }
        },
        include: {
            company: true
        },
        orderBy: { updatedAt: "desc" },
        take: 10
    })

    return duerpsEnAttente.map((d: any) => ({
        id: d.id,
        companyName: d.company?.name || "Entreprise inconnue",
        task: "Mise à jour DUERP",
        date: d.updatedAt.toISOString().split('T')[0],
        status: d.status === "BROUILLON" ? "URGENT" : "En cours",
        statusColor: d.status === "BROUILLON" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
    }))
}

export async function getAuditeurSignalements() {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) return []

    const signalements = await prisma.signalement.findMany({
        where: {
            company: {
                OR: [
                    { auditorId: user.id },
                    { commercialId: user.id }
                ]
            },
            status: { in: ["NOUVEAU", "EN_COURS"] }
        },
        include: {
            company: true
        },
        orderBy: { createdAt: "desc" },
        take: 10
    })

    return signalements.map((s: any) => ({
        id: s.id,
        companyName: s.company?.name || "Entreprise inconnue",
        type: s.type,
        date: s.createdAt.toISOString().split('T')[0],
        status: s.status === "NOUVEAU" ? "NOUVEAU" : "En cours",
        statusColor: s.status === "NOUVEAU" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
    }))
}

export async function getAuditDetails(auditId: string) {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) return null

    const audit = await prisma.audit.findUnique({
        where: { id: auditId },
        include: {
            company: {
                include: {
                    metier: true
                }
            },
            auditor: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    if (!audit) return null

    if (audit.auditorId !== user.id && audit.company.auditorId !== user.id && audit.company.commercialId !== user.id) {
        return null
    }

    let parsedObservations: { score?: number; commentaire?: string; documents?: Record<string, boolean>; risks?: Array<{ categorie: string; nom: string; gravite: number | null; frequence: number | null; priorite: number | null }> } = {}
    try {
        if (audit.observations) {
            parsedObservations = JSON.parse(audit.observations)
        }
    } catch { /* observations is plain text */ }

    return {
        id: audit.id,
        status: audit.status,
        score: parsedObservations.score || null,
        commentaire: parsedObservations.commentaire || audit.observations,
        proposedPlanCode: audit.proposedPlanCode,
        createdAt: audit.createdAt,
        updatedAt: audit.updatedAt,
        company: {
            id: audit.company.id,
            name: audit.company.name,
            email: audit.company.email,
            phone: audit.company.phone,
            address: audit.company.address,
            city: audit.company.city,
            postalCode: audit.company.postalCode,
            employeeCount: audit.company.employeeCount,
            metier: audit.company.metier?.nom || null
        },
        auditor: audit.auditor ? {
            name: audit.auditor.name,
            email: audit.auditor.email
        } : null,
        documents: parsedObservations.documents ? Object.entries(parsedObservations.documents).map(([type, present]) => ({
            type,
            present: present as boolean,
            conforme: present as boolean
        })) : [],
        risques: parsedObservations.risks || []
    }
}

// ============================================
// DELETE AUDIT
// ============================================

export async function deleteAudit(auditId: string) {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
        return { success: false, error: "Non autorisé" }
    }

    try {
        const audit = await prisma.audit.findFirst({
            where: {
                id: auditId,
                auditorId: user.id
            }
        })

        if (!audit) {
            return { success: false, error: "Audit non trouvé ou accès refusé" }
        }

        await prisma.audit.delete({
            where: { id: auditId }
        })

        return { success: true }
    } catch (error) {
        console.error("[deleteAudit] Erreur:", error)
        return { success: false, error: "Erreur lors de la suppression" }
    }
}

// ============================================
// GET AUDIT FOR EDIT
// ============================================

export async function getAuditForEdit(auditId: string) {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
        return null
    }

    const audit = await prisma.audit.findFirst({
        where: {
            id: auditId,
            auditorId: user.id
        },
        include: {
            company: {
                include: {
                    metier: true
                }
            }
        }
    })

    if (!audit) {
        return null
    }

    let parsedObservations: { documents?: Record<string, boolean>; risks?: Array<{ categorie: string; nom: string; gravite: number | null; frequence: number | null; priorite: number | null; niveauMaitrise?: string; risqueResiduel?: number; prioriteAction?: string }> } = {}
    try {
        if (audit.observations) {
            parsedObservations = JSON.parse(audit.observations)
        }
    } catch { /* observations is plain text */ }

    return {
        id: audit.id,
        companyId: audit.companyId,
        companyName: audit.company.name,
        metierNom: audit.company.metier?.nom || "",
        proposedPlanCode: audit.proposedPlanCode || "",
        documents: parsedObservations.documents ? Object.entries(parsedObservations.documents).map(([type, present]) => ({
            type,
            present: present as boolean,
            conforme: present as boolean
        })) : [],
        risques: (parsedObservations.risks || []).map(r => ({
            id: r.nom,
            categorie: r.categorie,
            nom: r.nom,
            gravite: r.gravite,
            frequence: r.frequence,
            niveauMaitrise: r.niveauMaitrise || "Aucune",
            priorite: r.priorite,
            risqueResiduel: r.risqueResiduel ?? null,
            prioriteAction: r.prioriteAction ?? null,
            identifie: true
        }))
    }
}

// ============================================
// UPDATE AUDIT
// ============================================

export async function updateAudit(
    auditId: string,
    companyId: string,
    documents: Array<{ type: string; present: boolean; conforme: boolean }>,
    risques: Array<{ categorie: string; nom: string; gravite: number; frequence: number; priorite: number; niveauMaitrise?: string }>,
    proposedPlanCode?: string
) {
    const user = await getCurrentUser()
    if (!user || (user.role !== "AUDITOR" && user.role !== "COMMERCIAL")) {
        return { error: "Non autorisé" }
    }

    try {
        const existingAudit = await prisma.audit.findFirst({
            where: {
                id: auditId,
                auditorId: user.id
            }
        })

        if (!existingAudit) {
            return { error: "Audit non trouvé ou accès refusé" }
        }

        const documentsConformes = documents.filter(d => d.conforme).length
        const totalDocuments = documents.length

        // New calculation: use risqueResiduel (F×G×P) to decide conformity (<= 4 = faible = conforme)
        const enrichedRisques = risques.map(r => {
            const niveauMaitrise = r.niveauMaitrise || "Aucune"
            const { ponderation, risqueBrut, risqueResiduel, prioriteAction } = calcIndicateurs(r.frequence, r.gravite, niveauMaitrise)
            return { ...r, niveauMaitrise, ponderation, risqueBrut, risqueResiduel, prioriteAction }
        })

        const risquesConformes = enrichedRisques.filter(r => r.risqueResiduel <= 4).length
        const totalRisques = enrichedRisques.length

        const scoreDocuments = totalDocuments > 0 ? (documentsConformes / totalDocuments) * 100 : 0
        const scoreRisques = totalRisques > 0 ? (risquesConformes / totalRisques) * 100 : 0
        const scoreGlobal = Math.round(scoreDocuments * 0.7 + scoreRisques * 0.3)

        const documentsMap: Record<string, boolean> = {}
        documents.forEach(d => { documentsMap[d.type] = d.present })

        const auditDetails = JSON.stringify({
            score: scoreGlobal,
            documents: documentsMap,
            risks: enrichedRisques.map(r => ({
                categorie: r.categorie,
                nom: r.nom,
                gravite: r.gravite,
                frequence: r.frequence,
                niveauMaitrise: r.niveauMaitrise,
                ponderation: r.ponderation,
                risqueBrut: r.risqueBrut,
                risqueResiduel: r.risqueResiduel,
                prioriteAction: r.prioriteAction,
                priorite: r.risqueBrut,
            }))
        })

        await prisma.audit.update({
            where: { id: auditId },
            data: {
                observations: auditDetails,
                proposedPlanCode: proposedPlanCode || null,
                updatedAt: new Date()
            }
        })

        return {
            success: true,
            auditId,
            score: scoreGlobal
        }
    } catch (error) {
        console.error("[updateAudit] Erreur:", error)
        return { error: "Erreur lors de la mise à jour de l'audit" }
    }
}

