'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export type TaskPriority = "URGENTE" | "HAUTE" | "MOYENNE" | "BASSE"
export type TaskStatus = "A_FAIRE" | "EN_COURS" | "TERMINEE"

export interface TacheData {
    id: string
    titre: string
    description: string | null
    type: string
    priorite: string
    status: string
    echeance: Date | null
    entreprise: string
    signalementId: string | null
    createdAt: Date
    rapport?: string | null
    rapportAt?: Date | null
    rapportStatut?: string | null
}

/**
 * Get tasks assigned to the current user (Auditeur/Technicien/Commercial)
 */
export async function getMyTaches(): Promise<TacheData[]> {
    try {
        const session = await auth()
        if (!session?.user?.email) return []

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })
        if (!user) return []

        const taches = await prisma.tache.findMany({
            where: { assigneId: user.id },
            include: {
                company: { select: { name: true } },
                signalement: { select: { type: true, titre: true } }
            },
            orderBy: [
                { priorite: 'asc' },
                { createdAt: 'desc' }
            ]
        })

        return taches.map(t => ({
            id: t.id,
            titre: t.titre,
            description: t.description,
            type: t.type,
            priorite: t.priorite,
            status: t.status,
            echeance: t.echeance,
            entreprise: t.company?.name || "Non renseigné",
            signalementId: t.signalementId,
            createdAt: t.createdAt,
            rapport: (t as typeof t & { rapport?: string | null }).rapport ?? null,
            rapportAt: (t as typeof t & { rapportAt?: Date | null }).rapportAt ?? null,
            rapportStatut: (t as typeof t & { rapportStatut?: string | null }).rapportStatut ?? null,
        }))
    } catch (error) {
        console.error("Error fetching tasks:", error)
        return []
    }
}

/**
 * Update a task status (A_FAIRE → EN_COURS → TERMINEE)
 */
export async function updateTacheStatus(tacheId: string, newStatus: TaskStatus) {
    try {
        const tache = await prisma.tache.update({
            where: { id: tacheId },
            data: { status: newStatus }
        })

        // If the task is TERMINEE and linked to a signalement, mark it as TRAITE
        if (newStatus === "TERMINEE" && tache.signalementId) {
            await prisma.signalement.update({
                where: { id: tache.signalementId },
                data: {
                    status: "TRAITE",
                    traiteAt: new Date(),
                    traiteParId: tache.assigneId
                }
            })
            revalidatePath("/admin/signalements")
        }

        revalidatePath("/auditeur/taches")
        revalidatePath("/technicien/taches")
        return { success: true }
    } catch (error) {
        console.error("Error updating task status:", error)
        return { error: "Erreur lors de la mise à jour du statut" }
    }
}

// Legacy aliases for backward compatibility
export async function getAuditeurTasks() {
    return getMyTaches()
}

export async function getTechnicienTasks() {
    return getMyTaches()
}

// ============================================================
// RAPPORT DE TÂCHE
// ============================================================

/**
 * Enregistrer (brouillon) ou envoyer le rapport d'une tâche
 */
export async function saveRapportTache(tacheId: string, rapport: string, send: boolean = false) {
    try {
        const session = await auth()
        if (!session?.user?.email) return { error: "Non authentifié" }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) return { error: "Utilisateur introuvable" }

        // Vérifier que la tâche appartient bien à cet utilisateur
        const tache = await prisma.tache.findUnique({
            where: { id: tacheId },
            include: { company: { select: { name: true } } }
        })
        if (!tache || tache.assigneId !== user.id) return { error: "Tâche introuvable ou non autorisée" }

        const newStatut = send ? "ENVOYE" : "REDIGE"

        await prisma.tache.update({
            where: { id: tacheId },
            data: {
                rapport,
                rapportAt: new Date(),
                rapportStatut: newStatut,
            }
        })

        if (send) {
            // Notifier tous les admins
            const admins = await prisma.user.findMany({
                where: { role: "ADMIN" },
                select: { id: true }
            })
            const auteurNom = user.name || "Auditeur"
            await Promise.all(admins.map(admin =>
                prisma.notification.create({
                    data: {
                        userId: admin.id,
                        type: "RAPPORT_TACHE",
                        title: "Nouveau rapport de tâche",
                        message: `${auteurNom} a soumis un rapport pour la tâche « ${tache.titre} » — ${tache.company?.name || "N/A"}.`,
                        actionUrl: "/admin/rapports",
                    }
                })
            ))
            revalidatePath("/admin/rapports")
        }

        revalidatePath("/auditeur/taches")
        revalidatePath("/technicien/taches")
        return { success: true }
    } catch (error) {
        console.error("Error saving rapport:", error)
        return { error: "Erreur lors de l'enregistrement du rapport" }
    }
}

/**
 * Récupère tous les rapports envoyés (pour l'admin)
 */
export async function getAdminRapports() {
    try {
        const taches = await prisma.tache.findMany({
            where: { rapportStatut: { in: ["ENVOYE", "LU"] } },
            include: {
                assigne: { select: { id: true, name: true, role: true } },
                company: { select: { name: true } },
                signalement: { select: { type: true, titre: true } }
            },
            orderBy: { rapportAt: "desc" }
        })
        return taches
    } catch (error) {
        console.error("Error fetching admin rapports:", error)
        return []
    }
}

/**
 * Marquer un rapport comme lu (par l'admin)
 */
export async function markRapportLu(tacheId: string) {
    try {
        await prisma.tache.update({
            where: { id: tacheId },
            data: { rapportStatut: "LU" }
        })
        revalidatePath("/admin/rapports")
        return { success: true }
    } catch (error) {
        console.error("Error marking rapport as lu:", error)
        return { error: "Erreur" }
    }
}
