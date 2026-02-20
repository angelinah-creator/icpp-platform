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
            createdAt: t.createdAt
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
