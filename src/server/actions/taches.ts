'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export type TaskPriority = "Urgente" | "Haute" | "Moyenne" | "Basse"
export type TaskStatus = "a_faire" | "en_cours" | "terminee"
export type TaskType = "Audit" | "Signalement" | "DUERP"

export interface AuditorTask {
    id: string
    sourceId: string // ID in the original table (Audit.id or Signalement.id)
    sourceType: "AUDIT" | "SIGNALEMENT"
    titre: string
    type: string
    priorite: TaskPriority
    entreprise: string
    echeance: Date
    statut: TaskStatus
}

export async function getAuditeurTasks(): Promise<AuditorTask[]> {
    try {
        const session = await auth()
        if (!session?.user) return []

        // In a real scenario, filter by auditorId. 
        // For now, fetch all available items to populate the view as requested by user (using real data).

        // 1. Fetch Audits (PLANIFIE or EN_COURS)
        const audits = await prisma.audit.findMany({
            where: {
                status: { in: ["PLANIFIE", "EN_COURS"] }
            },
            include: {
                company: true
            }
        })

        // 2. Fetch Signalements (NOUVEAU or EN_COURS)
        const signalements = await prisma.signalement.findMany({
            where: {
                status: { in: ["NOUVEAU", "EN_COURS"] }
            },
            include: {
                company: true
            }
        })

        // Map Audits to Tasks
        const auditTasks: AuditorTask[] = audits.map(audit => ({
            id: `audit-${audit.id}`,
            sourceId: audit.id,
            sourceType: "AUDIT",
            titre: `Audit ${audit.type} - ${audit.company.name}`,
            type: "Audit terrain",
            priorite: "Haute", // Default priority for audits
            entreprise: audit.company.name,
            echeance: audit.dateAudit,
            statut: audit.status === "PLANIFIE" ? "a_faire" : "en_cours"
        }))

        // Map Signalements to Tasks
        const signalementTasks: AuditorTask[] = signalements.map(sig => ({
            id: `sig-${sig.id}`,
            sourceId: sig.id,
            sourceType: "SIGNALEMENT",
            titre: `${sig.type} - ${sig.company?.name || "Entreprise inconnue"}`,
            type: "Signalement",
            priorite: sig.type.includes("ACCIDENT") ? "Urgente" : "Moyenne",
            entreprise: sig.company?.name || "Entreprise inconnue",
            echeance: sig.createdAt, // Using creation date as "echeance" for now or deadline
            statut: sig.status === "NOUVEAU" ? "a_faire" : "en_cours"
        }))

        // Sort by date (echeance)
        const allTasks = [...auditTasks, ...signalementTasks].sort((a, b) =>
            new Date(a.echeance).getTime() - new Date(b.echeance).getTime()
        )

        return allTasks
    } catch (error) {
        console.error("Error fetching tasks:", error)
        return []
    }
}

export async function updateTaskStatus(sourceId: string, sourceType: "AUDIT" | "SIGNALEMENT", newStatus: TaskStatus) {
    try {
        if (sourceType === "AUDIT") {
            // Map simple status to Audit status
            let auditStatus = "PLANIFIE"
            if (newStatus === "en_cours") auditStatus = "EN_COURS"
            if (newStatus === "terminee") auditStatus = "TERMINE"

            await prisma.audit.update({
                where: { id: sourceId },
                data: { status: auditStatus }
            })
        } else if (sourceType === "SIGNALEMENT") {
            // Map simple status to Signalement status
            let sigStatus = "NOUVEAU"
            if (newStatus === "en_cours") sigStatus = "EN_COURS"
            if (newStatus === "terminee") sigStatus = "TRAITE" // or TRAITÉ

            await prisma.signalement.update({
                where: { id: sourceId },
                data: { status: sigStatus }
            })
        }

        revalidatePath("/auditeur/taches")
        return { success: true }
    } catch (error) {
        console.error("Error updating task status:", error)
        return { error: "Failed to update status" }
    }
}

// Get tasks for TECHNICIEN role (same as auditor)
export async function getTechnicienTasks(): Promise<AuditorTask[]> {
    return getAuditeurTasks() // Technicians see the same tasks as auditors
}
