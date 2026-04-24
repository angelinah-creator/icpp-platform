"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { getCurrentUser } from "@/lib/auth-helpers"

// ============================================
// HELPERS
// ============================================

/**
 * Retourne la valeur numérique de gravite.
 * Accepte un Int (1-5, depuis la DB) ou une string (rétro-compat).
 */
function graviteToNumber(gravite: string | number): number {
    if (typeof gravite === 'number') return gravite
    switch (String(gravite).toUpperCase()) {
        case "FAIBLE": return 1
        case "MOYEN": return 3
        case "ELEVE": return 5
        default: {
            const n = parseInt(String(gravite))
            return isNaN(n) ? 1 : n
        }
    }
}

// ============================================
// STATS & DASHBOARD
// ============================================

export async function getAdminStats() {
    const [
        companiesCount,
        duerpsCount,
        subscriptionsActiveCount,
        auditeursCount
    ] = await Promise.all([
        prisma.company.count(),
        prisma.duerpDocument.count(),
        prisma.subscription.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { role: { in: ["AUDITOR", "COMMERCIAL"] } } })
    ])

    // Get subscription revenue
    const subscriptions = await prisma.subscription.findMany({
        where: { status: "ACTIVE" },
        include: { plan: true }
    })
    const revenuMensuel = subscriptions.reduce((acc: number, sub: any) => acc + (sub.customPrice ?? sub.plan.prixMensuel), 0)

    return {
        companies: companiesCount,
        audits: {
            total: duerpsCount,
            planifie: 0,
            enCours: 0,
            termine: duerpsCount
        },
        duerps: duerpsCount,
        subscriptions: subscriptionsActiveCount,
        signalementsPending: 0,
        auditeurs: auditeursCount,
        revenuMensuel: revenuMensuel / 100
    }
}

// ============================================
// COMPANIES (ENTREPRISES)
// ============================================

export async function getCompanies() {
    const companies = await prisma.company.findMany({
        include: {
            metier: true,
            subscription: {
                include: { plan: true }
            },
            duerps: {
                orderBy: { createdAt: "desc" },
                take: 1
            },
            _count: {
                select: { users: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return companies.map(company => ({
        id: company.id,
        nom: company.name,
        email: company.email || "",
        activite: company.metier?.nom || "Non défini",
        abonnement: company.subscription?.plan?.nom || "Aucun",
        abonnementCode: company.subscription?.planCode || "",
        abonnementStatus: company.subscription?.status || "",
        statutConformite: getConformiteStatus(company.duerps[0]),
        duerp: getDuerpStatus(company.duerps[0]),
        createdAt: company.createdAt
    }))
}

function getConformiteStatus(latestDuerp: { status: string; signedAt: Date | null; updatedAt: Date } | undefined) {
    if (!latestDuerp) return "Non conforme"
    if (latestDuerp.status === "ACTIVE" && latestDuerp.signedAt) return "Conforme"
    if (latestDuerp.status === "DRAFT") return "Partiellement conforme"
    return "Non conforme"
}

function getDuerpStatus(latestDuerp: { status: string; signedAt: Date | null } | undefined) {
    if (!latestDuerp) return "A faire"
    if (latestDuerp.status === "ACTIVE" && latestDuerp.signedAt) return "A jour"
    if (latestDuerp.status === "DRAFT") return "En cours"
    return "A faire"
}

export async function createCompany(data: {
    name: string
    siret?: string
    email?: string
    phone?: string
    address?: string
    postalCode?: string
    city?: string
    metierCode?: string
    employeeCount?: number
    planCode?: string
    contactName?: string
    contactRole?: string
    contactEmail?: string
    selectedUtIds?: string[]
}) {
    const company = await prisma.company.create({
        data: {
            name: data.name,
            siret: data.siret || null,
            email: data.email || null,
            phone: data.phone || null,
            address: data.address || "",
            postalCode: data.postalCode || null,
            city: data.city || "",
            metierCode: data.metierCode || null,
            employeeCount: data.employeeCount || 1,
            contactName: data.contactName || null,
            contactRole: data.contactRole || null,
            contactEmail: data.contactEmail || null,
            selectedUnitesTravail: data.selectedUtIds && data.selectedUtIds.length > 0
                ? { connect: data.selectedUtIds.map(id => ({ id })) }
                : undefined,
        }
    })

    // Create subscription if plan provided
    if (data.planCode) {
        await prisma.subscription.create({
            data: {
                companyId: company.id,
                planCode: data.planCode,
                status: "ACTIVE",
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
            }
        })
    }

    // Auto-generate 4 affichages obligatoires
    const { seedAffichagesForCompany } = await import("@/lib/seed-affichages")
    await seedAffichagesForCompany(company.id)

    revalidatePath("/admin/entreprises")
    return { success: true, company }
}

export async function updateCompany(id: string, data: {
    name?: string
    siret?: string
    email?: string
    phone?: string
    address?: string
    postalCode?: string
    city?: string
    metierCode?: string
    employeeCount?: number
    contactName?: string
    contactRole?: string
    contactEmail?: string
    planCode?: string // Nouveau : gestion abonnement
    selectedUtIds?: string[]
}) {
    try {
        const company = await prisma.company.update({
            where: { id },
            data: {
                name: data.name,
                siret: data.siret || null,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || "",
                postalCode: data.postalCode || null,
                city: data.city || "",
                metierCode: data.metierCode || null,
                employeeCount: data.employeeCount || undefined,
                contactName: data.contactName !== undefined ? data.contactName : undefined,
                contactRole: data.contactRole !== undefined ? data.contactRole : undefined,
                contactEmail: data.contactEmail !== undefined ? data.contactEmail : undefined,
                selectedUnitesTravail: data.selectedUtIds !== undefined ? {
                    set: data.selectedUtIds.map(utId => ({ id: utId }))
                } : undefined,
            }
        })

        // Gérer l'abonnement si planCode fourni
        if (data.planCode) {
            await prisma.subscription.upsert({
                where: { companyId: id },
                update: {
                    planCode: data.planCode,
                    status: "ACTIVE",
                    updatedAt: new Date()
                },
                create: {
                    companyId: id,
                    planCode: data.planCode,
                    status: "ACTIVE",
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                }
            })
        }

        revalidatePath("/admin/entreprises")
        revalidatePath(`/admin/entreprises/${id}`)
        return { success: true, company }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour de l'entreprise" }
    }
}

export async function deleteCompany(id: string) {
    await prisma.company.delete({ where: { id } })
    revalidatePath("/admin/entreprises")
    return { success: true }
}

export async function getCompaniesSimple() {
    const companies = await prisma.company.findMany({
        select: {
            id: true,
            name: true,
            metierCode: true,
            address: true,
            city: true,
            selectedUnitesTravail: {
                select: {
                    id: true,
                    nom: true
                }
            }
        },
        orderBy: { name: "asc" }
    })
    return companies
}



// ============================================
// AUDITORS (AUDITEURS)
// ============================================

export async function getAuditors() {
    const auditors = await prisma.user.findMany({
        where: { role: { in: ["AUDITOR", "COMMERCIAL", "INACTIVE"] } },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
                select: { auditsAssigned: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return auditors.map(a => ({
        id: a.id,
        nom: a.name,
        email: a.email,
        role: a.role,
        dateCreation: a.createdAt.toISOString().split("T")[0],
        auditsCount: a._count.auditsAssigned
    }))
}

export async function createAuditor(data: {
    nom: string
    prenom: string
    email: string
    phone?: string
    role?: "AUDITEUR" | "COMMERCIAL"
}) {
    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
        return { error: "Un utilisateur avec cet email existe déjà" }
    }

    // Create user with temporary password
    const tempPassword = await bcrypt.hash("changeme123", 10)

    // Map role to database enum value
    const dbRole = data.role === "COMMERCIAL" ? "COMMERCIAL" : "AUDITOR"

    const user = await prisma.user.create({
        data: {
            name: `${data.prenom} ${data.nom}`,
            email: data.email,
            password: tempPassword,
            role: dbRole,
            phone: data.phone || null,
            emailVerified: new Date()
        }
    })

    // TODO: Send welcome email with password reset link

    revalidatePath("/admin/auditeurs")
    return { success: true, user }
}


export async function updateAuditor(id: string, data: {
    nom?: string
    prenom?: string
    email?: string
}) {
    try {
        const fullName = data.nom && data.prenom ? `${data.prenom} ${data.nom}` : undefined

        const user = await prisma.user.update({
            where: { id },
            data: {
                name: fullName,
                email: data.email
            }
        })

        revalidatePath("/admin/auditeurs")
        return { success: true, user }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour de l'auditeur" }
    }
}

export async function toggleAuditorStatus(id: string) {
    try {
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) {
            return { error: "Auditeur non trouvé" }
        }

        // Toggle between AUDITOR (active) and INACTIVE states
        const newRole = user.role === "AUDITOR" ? "INACTIVE" : "AUDITOR"

        const updated = await prisma.user.update({
            where: { id },
            data: { role: newRole }
        })

        revalidatePath("/admin/auditeurs")
        return { success: true, isActive: newRole === "AUDITOR" }
    } catch (error) {
        return { error: "Erreur lors du changement de statut" }
    }
}

export async function deleteAuditor(id: string) {
    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/auditeurs")
    return { success: true }
}

// ============================================
// AUDITS
// ============================================

export async function getAudits() {
    const audits = await prisma.audit.findMany({
        include: {
            company: true,
            auditor: true
        },
        orderBy: { dateAudit: "desc" }
    })

    return audits.map(audit => ({
        id: audit.id,
        entreprise: audit.company.name,
        type: audit.type === "AUDIT_INITIAL" ? "Audit initial"
            : audit.type === "SUIVI_ANNUEL" ? "Suivi annuel"
                : "Exceptionnel",
        date: audit.dateAudit.toISOString().split("T")[0],
        auditeur: audit.auditor?.name || "Non assigné",
        statut: audit.status === "PLANIFIE" ? "En attente"
            : audit.status === "EN_COURS" ? "En cours"
                : audit.status === "TERMINE" ? "Terminée"
                    : "Annulé"
    }))
}

export async function createAudit(data: {
    companyId: string
    type: string
    dateAudit: Date
    auditorId?: string
}) {
    const audit = await prisma.audit.create({
        data: {
            companyId: data.companyId,
            type: data.type,
            dateAudit: data.dateAudit,
            auditorId: data.auditorId || null,
            status: "PLANIFIE"
        }
    })

    revalidatePath("/admin/audits")
    return { success: true, audit }
}

export async function updateAuditStatus(id: string, status: string) {
    await prisma.audit.update({
        where: { id },
        data: { status }
    })
    revalidatePath("/admin/audits")
    return { success: true }
}

export async function deleteAdminAudit(id: string) {
    await prisma.audit.delete({ where: { id } })
    revalidatePath("/admin/audits")
    return { success: true }
}

export async function createAdminAudit(data: {
    companyId: string
    type: string
    auditorId?: string
    documents: { [key: string]: boolean }
    risks: Array<{
        risqueId?: string
        categorie: string
        nom: string
        identifie: boolean
        gravite?: number
        frequence?: number
    }>
    commentaire?: string
    proposedPlanCode?: string
    proposedPrice?: number
}) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== "ADMIN") {
            return { error: "Non autorisé" }
        }

        // Calculer le score documentaire
        const docKeys = Object.keys(data.documents)
        const docOk = docKeys.filter(k => data.documents[k]).length
        const docScore = docKeys.length > 0 ? Math.round((docOk / docKeys.length) * 100) : 0

        const risquesIdentifies = data.risks.filter(r => r.identifie)
        const scoreConformite = Math.max(0, Math.round(docScore - risquesIdentifies.length * 3))

        const audit = await prisma.audit.create({
            data: {
                companyId: data.companyId,
                type: data.type === "AUDIT_INITIAL" ? "AUDIT_INITIAL" : data.type === "SUIVI_ANNUEL" ? "SUIVI_ANNUEL" : "INITIAL",
                dateAudit: new Date(),
                dateRealisation: new Date(),
                auditorId: data.auditorId || user.id,
                status: "TERMINE",
                scoreConformite,
                documentsObligatoires: JSON.stringify(data.documents),
                observations: data.commentaire || null,
                proposedPlanCode: data.proposedPlanCode || null,
                proposedPrice: data.proposedPrice ? Math.round(data.proposedPrice * 100) : null,
                syntheseAutomatique: `Audit réalisé le ${new Date().toLocaleDateString("fr-FR")}. Score de conformité : ${scoreConformite}%. ${risquesIdentifies.length} risque(s) identifié(s). ${docOk}/${docKeys.length} documents conformes.`
            }
        })

        // Notifier le client de l'entreprise auditée
        const company = await prisma.company.findUnique({
            where: { id: data.companyId },
            include: { users: { select: { id: true, name: true } } }
        })
        if (company) {
            await Promise.all(
                company.users.map(u =>
                    prisma.notification.create({
                        data: {
                            userId: u.id,
                            type: "AUDIT_COMPLETE",
                            title: "Votre audit est disponible",
                            message: `L'audit de conformité de ${company.name} a été réalisé. Score : ${scoreConformite}%.`,
                            actionUrl: "/dashboard",
                        }
                    })
                )
            )
        }

        // Notifier l'auditeur assigné
        if (data.auditorId) {
            await prisma.notification.create({
                data: {
                    userId: data.auditorId,
                    type: "TACHE_ASSIGNEE",
                    title: "Audit assigné",
                    message: `Un audit a été créé pour ${company?.name || "une entreprise"}.`,
                    actionUrl: "/auditeur/audits",
                }
            })
        }

        revalidatePath("/admin/audits")
        revalidatePath("/dashboard")
        return { success: true, audit }
    } catch (error) {
        console.error("Erreur createAdminAudit:", error)
        return { error: "Erreur lors de la création de l'audit" }
    }
}


export async function getRisquesParMetier(metierCode: string) {
    try {
        const risques = await prisma.risqueMetier.findMany({
            where: {
                metierCode,
                isActive: true
            },
            include: {
                categorie: true,
                uniteTravail: true
            },
            orderBy: [
                { categorie: { ordre: "asc" } },
                { uniteTravail: { ordre: "asc" } },
                { nom: "asc" }
            ]
        })

        // Grouper par catégorie → UT
        const grouped: Record<string, {
            nom: string
            code: string
            uts: Record<string, {
                nom: string
                risques: Array<{ id: string; nom: string; description: string; gravite: number; frequence: number }>
            }>
        }> = {}

        for (const r of risques) {
            const catCode = r.categorieCode
            if (!grouped[catCode]) {
                grouped[catCode] = { nom: r.categorie.nom, code: catCode, uts: {} }
            }
            const utKey = r.uniteTravailId || "__general__"
            const utNom = r.uniteTravail?.nom || "Général"
            if (!grouped[catCode].uts[utKey]) {
                grouped[catCode].uts[utKey] = { nom: utNom, risques: [] }
            }
            grouped[catCode].uts[utKey].risques.push({
                id: r.id,
                nom: r.nom,
                description: r.description,
                gravite: r.gravite,
                frequence: r.frequence
            })
        }

        return { success: true, grouped }
    } catch (error) {
        console.error("Erreur getRisquesParMetier:", error)
        return { success: false, grouped: {} }
    }
}

export async function deleteSignalement(id: string) {
    await prisma.signalement.delete({ where: { id } })
    revalidatePath("/admin/signalements")
    return { success: true }
}

// ============================================
// DUERP
// ============================================

export async function getDuerps() {
    const duerps = await prisma.duerpDocument.findMany({
        include: {
            company: true,
            _count: {
                select: { evaluations: true }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return duerps.map(duerp => ({
        id: duerp.id,
        entreprise: duerp.company.name,
        creation: duerp.createdAt.toISOString().split("T")[0],
        expiration: duerp.nextReviewDate?.toISOString().split("T")[0] || "Non défini",
        risques: `${duerp._count.evaluations} risques`,
        statut: duerp.signedAt ? "Signé"
            : duerp.status === "DRAFT" ? "En cours"
                : "En attente"
    }))
}

export async function createAdminDuerp(data: {
    companyId: string
    nextReviewDate?: string
    lastUpdateReason?: string
    // Métadonnées enrichies (Page 9 du DUERP)
    metadata?: {
        medecineTravail?: string
        accidentHistory?: Array<{
            date: string
            salarie?: string
            nature: string
            causes: string
            mesures: string
        }>
    }
    evaluations: Array<{
        risqueId: string
        uniteTravail: string
        frequence: number
        gravite: number
        niveauMaitrise: string
        ponderation: number
        risqueResiduel: number
        prioriteAction: string
        actionCorrective?: string
        delai?: string
        responsable?: string
        observations?: string
    }>
}) {
    try {
        const existing = await prisma.duerpDocument.findMany({
            where: { companyId: data.companyId },
            orderBy: { version: "desc" },
            take: 1
        })
        const version = (existing[0]?.version ?? 0) + 1

        // Archiver l'ancien DUERP ACTIVE avant création du nouveau (versionning)
        await prisma.duerpDocument.updateMany({
            where: { companyId: data.companyId, status: "ACTIVE" },
            data: { status: "ARCHIVED" }
        })

        // Récupérer automatiquement les accidents des 12 derniers mois depuis les signalements
        const twelveMonthsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        const recentAccidents = await prisma.signalement.findMany({
            where: {
                companyId: data.companyId,
                type: "ACCIDENT_TRAVAIL",
                createdAt: { gte: twelveMonthsAgo },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
        })

        // Fusionner les accidents de la DB avec ceux saisis manuellement
        const autoAccidents = recentAccidents.map(s => ({
            date: s.createdAt.toISOString().split("T")[0],
            salarie: "",
            nature: s.titre,
            causes: s.description,
            mesures: s.reponse || "En cours de traitement",
        }))
        const manualAccidents = data.metadata?.accidentHistory ?? []
        const allAccidents = [...autoAccidents, ...manualAccidents]

        const metadataPayload = {
            ...(data.metadata ?? {}),
            accidentHistory: allAccidents,
        }

        const duerp = await prisma.duerpDocument.create({
            data: {
                companyId: data.companyId,
                version,
                status: "DRAFT",
                nextReviewDate: data.nextReviewDate ? new Date(data.nextReviewDate) : null,
                lastUpdateReason: data.lastUpdateReason || null,
                metadata: metadataPayload,
                evaluations: {
                    create: data.evaluations.map(ev => ({
                        risqueId: ev.risqueId,
                        uniteTravail: ev.uniteTravail,
                        frequence: ev.frequence,
                        gravite: ev.gravite,
                        niveauRisque: ev.frequence * ev.gravite,
                        niveauMaitrise: ev.niveauMaitrise,
                        ponderation: ev.ponderation,
                        risqueResiduel: ev.risqueResiduel,
                        prioriteAction: ev.prioriteAction,
                        actionCorrective: ev.actionCorrective || null,
                        delai: ev.delai || null,
                        responsable: ev.responsable || null,
                        observations: ev.observations || null,
                        mesuresAppliquees: "[]",
                    }))
                }
            }
        })

        const company = await prisma.company.findUnique({
            where: { id: data.companyId },
            include: { users: { select: { id: true } } }
        })
        if (company) {
            await Promise.all(company.users.map(u =>
                prisma.notification.create({
                    data: {
                        userId: u.id,
                        type: "DUERP_DISPONIBLE",
                        title: "Votre DUERP est disponible",
                        message: `Le Document Unique d'Évaluation des Risques Professionnels v${version} a été créé. Vous pouvez le consulter dans votre espace.`,
                        actionUrl: "/dashboard/duerp",
                    }
                })
            ))
        }

        revalidatePath("/admin/duerp")
        revalidatePath("/dashboard")
        return { success: true, duerp }
    } catch (error) {
        console.error("Erreur createAdminDuerp:", error)
        return { error: "Erreur lors de la création du DUERP" }
    }
}

// ============================================
// SIGNALEMENTS
// ============================================

export async function getSignalements() {
    const signalements = await prisma.signalement.findMany({
        include: {
            company: true,
            taches: {
                include: {
                    assigne: { select: { id: true, name: true, role: true } }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    const typeLabels: Record<string, string> = {
        NOUVEAU_SALARIE: "Nouveau salarié",
        ACCIDENT_TRAVAIL: "Accident du travail",
        NOUVEL_EQUIPEMENT: "Nouvel équipement",
        DEMENAGEMENT: "Déménagement",
        INCIDENT: "Incident",
        DANGER: "Danger",
        AMELIORATION: "Amélioration"
    }

    return signalements.map(s => ({
        id: s.id,
        entreprise: s.company?.name || "Non renseigné",
        companyId: s.companyId,
        type: typeLabels[s.type] || s.type,
        titre: s.titre,
        description: s.description,
        date: s.createdAt.toISOString().split("T")[0],
        statut: s.status === "NOUVEAU" ? "Nouveau"
            : s.status === "EN_COURS" ? "En cours"
                : s.status === "TRAITE" ? "Traité"
                    : s.status,
        rawStatus: s.status,
        assignedTo: s.taches.length > 0 ? s.taches.map(t => ({
            id: t.id,
            userName: t.assigne.name,
            userRole: t.assigne.role,
            status: t.status,
            priorite: t.priorite
        })) : null
    }))
}

export async function updateSignalementStatus(id: string, status: string) {
    await prisma.signalement.update({
        where: { id },
        data: {
            status,
            traiteAt: status === "TRAITE" ? new Date() : null
        }
    })

    revalidatePath("/admin/signalements")
    return { success: true }
}

// ============================================
// ASSIGNATION SIGNALEMENT → TÂCHE
// ============================================

export async function getUsersByRole(roles: string[]) {
    const users = await prisma.user.findMany({
        where: { role: { in: roles } },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        },
        orderBy: { name: "asc" }
    })
    return users
}

export async function assignSignalementAsTache(data: {
    signalementId: string
    assigneId: string
    priorite: string
    echeance?: Date | null
    commentaire?: string
}) {
    try {
        // Get signalement details
        const signalement = await prisma.signalement.findUnique({
            where: { id: data.signalementId },
            include: { company: true }
        })

        if (!signalement) {
            return { error: "Signalement non trouvé" }
        }

        // Create the task
        const tache = await prisma.tache.create({
            data: {
                titre: `Signalement: ${signalement.titre}`,
                description: data.commentaire || signalement.description,
                type: "SIGNALEMENT",
                priorite: data.priorite,
                status: "A_FAIRE",
                echeance: data.echeance || null,
                signalementId: signalement.id,
                assigneId: data.assigneId,
                companyId: signalement.companyId,
            }
        })

        // Update signalement status to EN_COURS
        await prisma.signalement.update({
            where: { id: data.signalementId },
            data: { status: "EN_COURS" }
        })

        revalidatePath("/admin/signalements")
        return { success: true, tache }
    } catch (error) {
        console.error("Erreur assignation signalement:", error)
        return { error: "Erreur lors de l'assignation" }
    }
}

// ============================================
// SUBSCRIPTIONS (ABONNEMENTS)
// ============================================

export async function getSubscriptions() {
    const subscriptions = await prisma.subscription.findMany({
        include: {
            company: true,
            plan: true
        },
        orderBy: { createdAt: "desc" }
    })

    return subscriptions.map(sub => ({
        id: sub.id,
        companyId: sub.companyId,
        entreprise: sub.company.name,
        plan: sub.plan.nom,
        planCode: sub.planCode,
        prix: sub.customPrice ? `${sub.customPrice / 100}€/mois (Perso)` : `${sub.plan.prixMensuel / 100}€/mois`,
        statut: sub.status,
        customPrice: sub.customPrice
    }))
}

export async function updateSubscriptionStatus(id: string, status: string) {
    try {
        await prisma.subscription.update({
            where: { id },
            data: { status }
        })
        revalidatePath("/admin/abonnements")
        // Force revalidation of client dashboard so suspension banner appears immediately
        revalidatePath("/dashboard", "layout")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour du statut" }
    }
}

export async function getSubscriptionStats() {
    const subscriptions = await prisma.subscription.findMany({
        where: { status: "ACTIVE" },
        include: { plan: true }
    })

    const revenuMensuel = subscriptions.reduce((acc: number, sub: any) => acc + (sub.customPrice ?? sub.plan.prixMensuel), 0)
    const abonnementsActifs = subscriptions.length

    return {
        revenuMensuel: revenuMensuel / 100,
        abonnementsActifs,
        tauxRenouvellement: 1 // Placeholder
    }
}

// ============================================
// MÉTIERS
// ============================================

export async function getMetiers() {
    const metiers = await prisma.metierICPP.findMany({
        include: {
            _count: {
                select: { companies: true, unitesTravail: true }
            }
        },
        orderBy: { nom: "asc" }
    })

    return metiers.map(m => ({
        id: m.id,
        code: m.code,
        nom: m.nom,
        description: m.description,
        isActive: m.isActive,
        companiesCount: m._count.companies,
        unitesTravailCount: m._count.unitesTravail
    }))
}

export async function createMetier(data: {
    code: string
    nom: string
    description: string
    isActive?: boolean
}) {
    const metier = await prisma.metierICPP.create({
        data: {
            code: data.code.toUpperCase().replace(/\s+/g, "_"),
            nom: data.nom,
            description: data.description,
            isActive: data.isActive ?? true
        }
    })

    revalidatePath("/admin/metiers")
    return { success: true, metier }
}

export async function updateMetier(id: string, data: {
    code?: string
    nom?: string
    description?: string
    isActive?: boolean
}) {
    try {
        const metier = await prisma.metierICPP.update({
            where: { id },
            data: {
                ...data,
                code: data.code ? data.code.toUpperCase().replace(/\s+/g, "_") : undefined
            }
        })

        revalidatePath("/admin/metiers")
        return { success: true, metier }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour" }
    }
}

export async function toggleMetierStatus(id: string) {
    try {
        const metier = await prisma.metierICPP.findUnique({ where: { id } })
        if (!metier) return { error: "Métier non trouvé" }

        const updated = await prisma.metierICPP.update({
            where: { id },
            data: { isActive: !metier.isActive }
        })

        revalidatePath("/admin/metiers")
        return { success: true, isActive: updated.isActive }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour" }
    }
}

export async function getMetierUTs(metierCode: string) {
    const uts = await prisma.uniteTravail.findMany({
        where: { metierCode },
        orderBy: { ordre: "asc" }
    })
    return uts.map(ut => ({ id: ut.id, nom: ut.nom, description: ut.description }))
}

// New function for fetching risques by UniteTravail
export async function getRisquesByUniteTravail(uniteTravailId: string) {
    const risques = await prisma.risqueMetier.findMany({
        where: { uniteTravailId },
        include: {
            categorie: true,
            uniteTravail: true
        },
        orderBy: { categorie: { ordre: "asc" } }
    })

    return risques.map(r => ({
        id: r.id,
        nom: r.nom,
        description: r.description,
        categorie: r.categorie.nom,
        categorieCode: r.categorieCode,
        frequence: r.frequence,
        gravite: r.gravite, // Int 1-5
        priorite: r.frequence * r.gravite, // P = F × G
        mesuresSuggerees: r.mesuresSuggerees,
        uniteTravail: r.uniteTravail?.nom || ""
    }))
}

// Backward compatible function - fetches risques via UniteTravail for a given metier
export async function getMetierRisques(metierCode: string) {
    // First get all UTs for this metier
    const uts = await prisma.uniteTravail.findMany({
        where: { metierCode },
        include: {
            risques: {
                include: { categorie: true }
            }
        },
        orderBy: { ordre: "asc" }
    })

    // Flatten and return all risques
    return uts.flatMap(ut =>
        ut.risques.map(r => ({
            id: r.id,
            nom: r.nom,
            description: r.description,
            categorie: r.categorie.nom,
            frequence: r.frequence,
            gravite: r.gravite, // Int 1-5
            priorite: r.frequence * r.gravite, // P = F × G
            mesuresSuggerees: r.mesuresSuggerees,
            uniteTravailNom: ut.nom
        }))
    )
}

// Alias for planifier audit modal
export async function planifierAudit(data: {
    companyId: string
    auditorId: string
    type: string
    dateAudit: Date
}) {
    return createAudit({
        companyId: data.companyId,
        auditorId: data.auditorId,
        type: data.type,
        dateAudit: data.dateAudit
    })
}

// ============================================
// RÉGLEMENTATIONS
// ============================================

export async function getReglementations() {
    const reglementations = await prisma.reglementation.findMany({
        orderBy: { createdAt: "desc" }
    })

    return reglementations.map(r => ({
        id: r.id,
        titre: r.titre,
        description: r.description || "",
        type: r.type,
        isActive: r.isActive,
        enVigueur: r.dateVigueur.toISOString().split("T")[0],
        maj: r.dateMaj.toISOString().split("T")[0],
        metiers: JSON.parse(r.metiersCodes) as string[]
    }))
}

export async function createReglementation(data: {
    titre: string
    description?: string
    type: string
    dateVigueur: Date
    impactDuerp?: boolean
    isActive?: boolean
    metiersCodes?: string[]
}) {
    const reglementation = await prisma.reglementation.create({
        data: {
            titre: data.titre,
            description: data.description || null,
            type: data.type,
            dateVigueur: data.dateVigueur,
            impactDuerp: data.impactDuerp ?? false,
            isActive: data.isActive ?? true,
            metiersCodes: JSON.stringify(data.metiersCodes || [])
        }
    })

    revalidatePath("/admin/reglementations")
    return { success: true, reglementation }
}

export async function updateReglementation(id: string, data: {
    titre?: string
    description?: string
    type?: string
    dateVigueur?: Date
    impactDuerp?: boolean
    isActive?: boolean
    metiersCodes?: string[]
}) {
    try {
        const reglementation = await prisma.reglementation.update({
            where: { id },
            data: {
                titre: data.titre,
                description: data.description || null,
                type: data.type,
                dateVigueur: data.dateVigueur,
                dateMaj: new Date(),
                impactDuerp: data.impactDuerp,
                isActive: data.isActive,
                metiersCodes: data.metiersCodes ? JSON.stringify(data.metiersCodes) : undefined
            }
        })

        revalidatePath("/admin/reglementations")
        return { success: true, reglementation }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour de la réglementation" }
    }
}

export async function deleteReglementation(id: string) {
    try {
        await prisma.reglementation.delete({ where: { id } })
        revalidatePath("/admin/reglementations")
        return { success: true }
    } catch (error) {
        return { error: "Erreur lors de la suppression" }
    }
}

export async function toggleReglementationStatus(id: string) {
    try {
        const reglementation = await prisma.reglementation.findUnique({ where: { id } })
        if (!reglementation) {
            return { error: "Réglementation non trouvée" }
        }

        const updated = await prisma.reglementation.update({
            where: { id },
            data: { isActive: !reglementation.isActive }
        })

        revalidatePath("/admin/reglementations")
        return { success: true, isActive: updated.isActive }
    } catch (error) {
        return { error: "Erreur lors du changement de statut" }
    }
}

// ============================================
// AFFICHAGES OBLIGATOIRES
// ============================================

export async function getAffichages() {
    const affichages = await prisma.affichage.findMany({
        include: {
            company: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return affichages.map(a => ({
        id: a.id,
        type: a.type,
        category: a.category,
        title: a.title,
        description: a.description || "",
        companyName: a.company.name,
        companyId: a.company.id,
        fileUrl: a.fileUrl,
        dynamicData: a.dynamicData,
        version: a.version,
        isLocked: a.isLocked,
        downloaded: a.downloaded,
        printed: a.printed,
        generatedAt: a.generatedAt?.toISOString() || null,
        createdAt: a.createdAt.toISOString()
    }))
}

export async function createAffichage(data: {
    type: string
    category?: string
    title: string
    description?: string
    companyId: string
    fileUrl?: string
    dynamicData?: string
    isLocked?: boolean
}) {
    try {
        const affichage = await prisma.affichage.create({
            data: {
                type: data.type,
                category: data.category || "FICHE_1",
                title: data.title,
                description: data.description || null,
                companyId: data.companyId,
                fileUrl: data.fileUrl || null,
                dynamicData: data.dynamicData || null,
                isLocked: data.isLocked || false,
            }
        })

        revalidatePath("/admin/affichages")
        revalidatePath("/dashboard/affichages")
        return { success: true, affichage }
    } catch (error) {
        return { error: "Erreur lors de la création de l'affichage" }
    }
}

export async function updateAffichage(id: string, data: {
    type?: string
    title?: string
    description?: string
    fileUrl?: string
    downloaded?: boolean
    printed?: boolean
}) {
    try {
        const affichage = await prisma.affichage.update({
            where: { id },
            data: {
                type: data.type,
                title: data.title,
                description: data.description,
                fileUrl: data.fileUrl,
                downloaded: data.downloaded,
                printed: data.printed
            }
        })

        revalidatePath("/admin/affichages")
        return { success: true, affichage }
    } catch (error) {
        return { error: "Erreur lors de la mise à jour de l'affichage" }
    }
}

export async function deleteAffichage(id: string) {
    try {
        await prisma.affichage.delete({ where: { id } })
        revalidatePath("/admin/affichages")
        return { success: true }
    } catch (error) {
        return { error: "Erreur lors de la suppression" }
    }
}



// ============================================
// RISQUES - CATÉGORIES
// ============================================

export async function getRisqueCategories() {
    const categories = await prisma.risqueCategorie.findMany({
        include: {
            _count: { select: { risques: true } }
        },
        orderBy: { ordre: "asc" }
    })

    return categories.map(c => ({
        id: c.id,
        code: c.code,
        nom: c.nom,
        description: c.description || "",
        ordre: c.ordre,
        risquesCount: c._count.risques
    }))
}

export async function createRisqueCategorie(data: {
    code: string
    nom: string
    description?: string
}) {
    try {
        const maxOrdre = await prisma.risqueCategorie.aggregate({ _max: { ordre: true } })
        const categorie = await prisma.risqueCategorie.create({
            data: {
                code: data.code.toUpperCase(),
                nom: data.nom,
                description: data.description || null,
                ordre: (maxOrdre._max.ordre || 0) + 1
            }
        })
        revalidatePath("/admin/risques/categories")
        return { success: true, categorie }
    } catch (error) {
        return { error: "Erreur lors de la création (code déjà existant?)" }
    }
}

export async function updateRisqueCategorie(id: string, data: {
    code?: string
    nom?: string
    description?: string
}) {
    try {
        const categorie = await prisma.risqueCategorie.update({
            where: { id },
            data: {
                code: data.code?.toUpperCase(),
                nom: data.nom,
                description: data.description
            }
        })
        revalidatePath("/admin/risques/categories")
        return { success: true, categorie }
    } catch (error) {
        return { error: "Erreur lors de la modification" }
    }
}

export async function deleteRisqueCategorie(id: string) {
    try {
        const categorie = await prisma.risqueCategorie.findUnique({
            where: { id },
            include: { _count: { select: { risques: true } } }
        })
        if (categorie && categorie._count.risques > 0) {
            return { error: "Impossible de supprimer: des risques sont associés à cette catégorie" }
        }
        await prisma.risqueCategorie.delete({ where: { id } })
        revalidatePath("/admin/risques/categories")
        return { success: true }
    } catch (error) {
        return { error: "Erreur lors de la suppression" }
    }
}

export async function moveRisqueCategorie(id: string, direction: "up" | "down") {
    try {
        const current = await prisma.risqueCategorie.findUnique({ where: { id } })
        if (!current) return { error: "Catégorie non trouvée" }

        const neighbor = await prisma.risqueCategorie.findFirst({
            where: { ordre: direction === "up" ? { lt: current.ordre } : { gt: current.ordre } },
            orderBy: { ordre: direction === "up" ? "desc" : "asc" }
        })

        if (!neighbor) return { error: "Déplacement impossible" }

        await prisma.$transaction([
            prisma.risqueCategorie.update({ where: { id: current.id }, data: { ordre: neighbor.ordre } }),
            prisma.risqueCategorie.update({ where: { id: neighbor.id }, data: { ordre: current.ordre } })
        ])

        revalidatePath("/admin/risques/categories")
        return { success: true }
    } catch (error) {
        return { error: "Erreur lors du déplacement" }
    }
}

// ============================================
// RISQUES - MÉTIER
// ============================================

export async function getRisquesMetier(filters?: {
    metierCode?: string
    categorieCode?: string
    isActive?: boolean
}) {
    const risques = await prisma.risqueMetier.findMany({
        where: {
            ...(filters?.metierCode && { metierCode: filters.metierCode }),
            ...(filters?.categorieCode && { categorieCode: filters.categorieCode }),
            ...(filters?.isActive !== undefined && { isActive: filters.isActive })
        },
        include: {
            categorie: { select: { nom: true, code: true } },
            metier: { select: { nom: true, code: true } }
        },
        orderBy: [{ categorie: { ordre: "asc" } }, { nom: "asc" }]
    })

    return risques.map(r => ({
        id: r.id,
        nom: r.nom,
        description: r.description,
        categorieCode: r.categorieCode,
        categorieNom: r.categorie.nom,
        metierCode: r.metierCode,
        metierNom: r.metier.nom,
        gravite: r.gravite,
        frequence: r.frequence,
        mesuresSuggerees: JSON.parse(r.mesuresSuggerees || "[]") as string[],
        isActive: r.isActive
    }))
}

export async function createRisqueMetier(data: {
    nom: string
    description: string
    categorieCode: string
    metierCode: string
    gravite: number  // Int 1-5 selon CDC
    frequence: number
    mesuresSuggerees: string[]
    uniteTravailId?: string
}) {
    try {
        const risque = await prisma.risqueMetier.create({
            data: {
                nom: data.nom,
                description: data.description,
                categorieCode: data.categorieCode,
                metierCode: data.metierCode,
                gravite: data.gravite,
                frequence: data.frequence,
                mesuresSuggerees: JSON.stringify(data.mesuresSuggerees),
                uniteTravailId: data.uniteTravailId
            }
        })
        revalidatePath("/admin/risques/metiers")
        return { success: true, risque }
    } catch (error) {
        return { error: "Erreur lors de la création du risque" }
    }
}

export async function updateRisqueMetier(id: string, data: {
    nom?: string
    description?: string
    categorieCode?: string
    metierCode?: string
    gravite?: number  // Int 1-5 selon CDC
    frequence?: number
    mesuresSuggerees?: string[]
    uniteTravailId?: string | null
}) {
    try {
        const risque = await prisma.risqueMetier.update({
            where: { id },
            data: {
                nom: data.nom,
                description: data.description,
                categorieCode: data.categorieCode,
                metierCode: data.metierCode,
                gravite: data.gravite,
                frequence: data.frequence,
                mesuresSuggerees: data.mesuresSuggerees ? JSON.stringify(data.mesuresSuggerees) : undefined,
                uniteTravailId: data.uniteTravailId
            }
        })
        revalidatePath("/admin/risques/metiers")
        return { success: true, risque }
    } catch (error) {
        return { error: "Erreur lors de la modification" }
    }
}

export async function deleteRisqueMetier(id: string) {
    try {
        await prisma.risqueMetier.delete({ where: { id } })
        revalidatePath("/admin/risques/metiers")
        return { success: true }
    } catch (error) {
        return { error: "Erreur lors de la suppression" }
    }
}

export async function toggleRisqueMetierStatus(id: string) {
    try {
        const risque = await prisma.risqueMetier.findUnique({ where: { id } })
        if (!risque) return { error: "Risque non trouvé" }

        const updated = await prisma.risqueMetier.update({
            where: { id },
            data: { isActive: !risque.isActive }
        })
        revalidatePath("/admin/risques/metiers")
        return { success: true, isActive: updated.isActive }
    } catch (error) {
        return { error: "Erreur lors du changement de statut" }
    }
}

export async function getRisquesForMiniAudit(metierCode: string) {
    const risques = await prisma.risqueMetier.findMany({
        where: { metierCode, isActive: true },
        include: { categorie: { select: { nom: true, code: true, ordre: true } } },
        orderBy: [{ categorie: { ordre: "asc" } }, { nom: "asc" }]
    })

    const grouped: Record<string, { categorie: string; risques: typeof risques }> = {}
    risques.forEach(r => {
        if (!grouped[r.categorieCode]) {
            grouped[r.categorieCode] = { categorie: r.categorie.nom, risques: [] }
        }
        grouped[r.categorieCode].risques.push(r)
    })
    return grouped
}

// ============================================
// SETTINGS (PARAMÈTRES)
// ============================================

const DEFAULT_SETTINGS = {
    companyName: "ICPP Conformité",
    contactEmail: "contact@icpp.fr",
    contactPhone: "01 23 45 67 89",
    notifEmail: true,
    notifSms: false,
    notifPush: true,
    duerpReminderDays: 30,
    auditReminderDays: 7
}

export async function getSettings() {
    const allSettings = await prisma.appSettings.findMany()

    const settingsMap: Record<string, string> = {}
    allSettings.forEach(s => {
        settingsMap[s.key] = s.value
    })

    return {
        id: "app_settings",
        companyName: settingsMap["companyName"] || DEFAULT_SETTINGS.companyName,
        contactEmail: settingsMap["contactEmail"] || DEFAULT_SETTINGS.contactEmail,
        contactPhone: settingsMap["contactPhone"] || DEFAULT_SETTINGS.contactPhone,
        notifEmail: settingsMap["notifEmail"] === "true" || (settingsMap["notifEmail"] === undefined && DEFAULT_SETTINGS.notifEmail),
        notifSms: settingsMap["notifSms"] === "true",
        notifPush: settingsMap["notifPush"] === "true" || (settingsMap["notifPush"] === undefined && DEFAULT_SETTINGS.notifPush),
        duerpReminderDays: parseInt(settingsMap["duerpReminderDays"]) || DEFAULT_SETTINGS.duerpReminderDays,
        auditReminderDays: parseInt(settingsMap["auditReminderDays"]) || DEFAULT_SETTINGS.auditReminderDays
    }
}

export async function updateSettings(data: {
    id?: string
    companyName?: string
    contactEmail?: string
    contactPhone?: string
    notifEmail?: boolean
    notifSms?: boolean
    notifPush?: boolean
    duerpReminderDays?: number
    auditReminderDays?: number
}) {
    const updates = [
        { key: "companyName", value: data.companyName },
        { key: "contactEmail", value: data.contactEmail },
        { key: "contactPhone", value: data.contactPhone },
        { key: "notifEmail", value: data.notifEmail?.toString() },
        { key: "notifSms", value: data.notifSms?.toString() },
        { key: "notifPush", value: data.notifPush?.toString() },
        { key: "duerpReminderDays", value: data.duerpReminderDays?.toString() },
        { key: "auditReminderDays", value: data.auditReminderDays?.toString() }
    ].filter(u => u.value !== undefined)

    for (const update of updates) {
        await prisma.appSettings.upsert({
            where: { key: update.key },
            update: { value: update.value! },
            create: { key: update.key, value: update.value! }
        })
    }

    revalidatePath("/admin/parametres")
    return { success: true }
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getAdminNotifications() {
    const notifications = await prisma.notification.findMany({
        where: { userId: null }, // Admin notifications have no specific user
        orderBy: { createdAt: "desc" },
        take: 20
    })

    return notifications
}

export async function markNotificationRead(id: string) {
    await prisma.notification.update({
        where: { id },
        data: { read: true, readAt: new Date() }
    })

    revalidatePath("/admin")
    return { success: true }
}

export async function getUnreadNotificationsCount() {
    const count = await prisma.notification.count({
        where: { userId: null, read: false }
    })

    return count
}

// ============================================
// PLANS TARIFAIRES
// ============================================

export async function getPlans() {
    const plans = await prisma.planTarifaire.findMany({
        where: { isActive: true },
        orderBy: { ordre: "asc" }
    })

    return plans.map(p => ({
        code: p.code,
        nom: p.nom,
        prix: p.prixMensuel / 100
    }))
}

export async function updateSubscriptionPrice(subscriptionId: string, customPrice: number | null) {
    try {
        await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                customPrice: customPrice !== null ? Math.round(customPrice * 100) : null
            }
        })

        revalidatePath("/admin/abonnements")
        revalidatePath("/dashboard", "layout")
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Erreur updateSubscriptionPrice:", error)
        return { error: "Erreur lors de la mise à jour du prix" }
    }
}

// ============================================
// NOTES INTERNES
// ============================================

const INTERNAL_ROLES = ["ADMIN", "AUDITOR", "COMMERCIAL"]

export async function getInternalNotes(companyId: string, duerpId?: string) {
    const user = await getCurrentUser()
    if (!user || !INTERNAL_ROLES.includes(user.role)) return []

    const where: any = { companyId }
    if (duerpId) where.duerpId = duerpId

    const notes = await prisma.internalNote.findMany({
        where,
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        include: {
            author: { select: { id: true, name: true, role: true } },
        },
    })
    return notes
}

export async function createInternalNote(data: {
    companyId: string
    duerpId?: string | null
    content: string
    category?: string
}) {
    const user = await getCurrentUser()
    if (!user || !INTERNAL_ROLES.includes(user.role)) {
        return { error: "Accès refusé" }
    }
    if (!data.content?.trim()) return { error: "Le contenu est requis" }

    try {
        const note = await prisma.internalNote.create({
            data: {
                id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                companyId: data.companyId,
                duerpId: data.duerpId ?? null,
                authorId: user.id,
                content: data.content.trim(),
                category: data.category ?? "GENERAL",
            },
            include: { author: { select: { id: true, name: true, role: true } } },
        })

        revalidatePath(`/admin/entreprises/${data.companyId}`)
        if (data.duerpId) revalidatePath(`/admin/duerp/${data.duerpId}`)
        return { success: true, note }
    } catch (error) {
        console.error("Erreur createInternalNote:", error)
        return { error: "Erreur lors de la création de la note" }
    }
}

export async function updateInternalNote(id: string, content: string) {
    const user = await getCurrentUser()
    if (!user || !INTERNAL_ROLES.includes(user.role)) return { error: "Accès refusé" }

    const note = await prisma.internalNote.findUnique({ where: { id } })
    if (!note) return { error: "Note introuvable" }
    // Only the author or ADMIN can edit
    if (note.authorId !== user.id && user.role !== "ADMIN") {
        return { error: "Vous ne pouvez modifier que vos propres notes" }
    }

    try {
        await prisma.internalNote.update({
            where: { id },
            data: { content: content.trim(), updatedAt: new Date() },
        })
        revalidatePath(`/admin/entreprises/${note.companyId}`)
        if (note.duerpId) revalidatePath(`/admin/duerp/${note.duerpId}`)
        return { success: true }
    } catch (error) {
        console.error("Erreur updateInternalNote:", error)
        return { error: "Erreur lors de la mise à jour de la note" }
    }
}

export async function deleteInternalNote(id: string) {
    const user = await getCurrentUser()
    if (!user || !INTERNAL_ROLES.includes(user.role)) return { error: "Accès refusé" }

    const note = await prisma.internalNote.findUnique({ where: { id } })
    if (!note) return { error: "Note introuvable" }
    // Only the author or ADMIN can delete
    if (note.authorId !== user.id && user.role !== "ADMIN") {
        return { error: "Vous ne pouvez supprimer que vos propres notes" }
    }

    try {
        await prisma.internalNote.delete({ where: { id } })
        revalidatePath(`/admin/entreprises/${note.companyId}`)
        if (note.duerpId) revalidatePath(`/admin/duerp/${note.duerpId}`)
        return { success: true }
    } catch (error) {
        console.error("Erreur deleteInternalNote:", error)
        return { error: "Erreur lors de la suppression de la note" }
    }
}

export async function pinInternalNote(id: string, isPinned: boolean) {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") return { error: "Réservé aux administrateurs" }

    const note = await prisma.internalNote.findUnique({ where: { id } })
    if (!note) return { error: "Note introuvable" }

    try {
        await prisma.internalNote.update({ where: { id }, data: { isPinned } })
        revalidatePath(`/admin/entreprises/${note.companyId}`)
        return { success: true }
    } catch (error) {
        console.error("Erreur pinInternalNote:", error)
        return { error: "Erreur lors de la mise à jour de la note" }
    }
}
