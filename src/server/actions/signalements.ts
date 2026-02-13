'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAuditeurSignalements() {
    try {
        const signalements = await prisma.signalement.findMany({
            include: {
                company: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return signalements
    } catch (error) {
        console.error("Error fetching signalements:", error)
        return []
    }
}

export async function updateSignalementStatus(id: string, status: string) {
    try {
        await prisma.signalement.update({
            where: { id },
            data: {
                status,
                updatedAt: new Date()
            }
        })
        revalidatePath("/auditeur/signalements")
        return { success: true }
    } catch (error) {
        console.error("Error updating signalement status:", error)
        return { error: "Failed to update status" }
    }
}

// ============================================
// CLIENT FUNCTIONS
// ============================================

export interface CreateSignalementInput {
    type: string
    title: string
    description: string
}

export async function createSignalement(input: CreateSignalementInput) {
    const { auth } = await import("@/lib/auth")

    try {
        const session = await auth()
        if (!session?.user?.email) {
            return { success: false, error: "Non authentifié" }
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        })

        if (!user?.companyId) {
            return { success: false, error: "Entreprise non trouvée" }
        }

        const signalement = await prisma.signalement.create({
            data: {
                companyId: user.companyId,
                type: input.type,
                titre: input.title,
                description: input.description,
                status: "EN_COURS"
            }
        })

        revalidatePath("/dashboard/signalements")

        return { success: true, data: signalement }
    } catch (error) {
        console.error("Erreur création signalement:", error)
        return { success: false, error: "Erreur lors de la création" }
    }
}

export async function getClientSignalements() {
    const { auth } = await import("@/lib/auth")

    try {
        const session = await auth()
        if (!session?.user?.email) return null

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        })

        if (!user?.companyId) return null

        const signalements = await prisma.signalement.findMany({
            where: { companyId: user.companyId },
            orderBy: { createdAt: "desc" }
        })

        return signalements
    } catch (error) {
        console.error("Erreur récupération signalements:", error)
        return null
    }
}
