'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getTechnicienDashboardData() {
    try {
        const session = await auth()
        if (!session?.user?.email) return null

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user || user.role !== "TECHNICIEN") return null

        // Stats from Tache table (tasks assigned to this technician)
        const stats = {
            tachesEnCours: await prisma.tache.count({
                where: { assigneId: user.id, status: "EN_COURS" }
            }),
            tachesAFaire: await prisma.tache.count({
                where: { assigneId: user.id, status: "A_FAIRE" }
            }),
            tachesTerminees: await prisma.tache.count({
                where: { assigneId: user.id, status: "TERMINEE" }
            })
        }

        return {
            user: {
                name: user.name,
                email: user.email
            },
            stats
        }
    } catch (error) {
        console.error("Error fetching technician dashboard data:", error)
        return null
    }
}

export async function getTechnicienTaches() {
    try {
        const session = await auth()
        if (!session?.user?.email) return []

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) return []

        // Get tasks assigned to this technician from the Tache table
        const taches = await prisma.tache.findMany({
            where: { assigneId: user.id },
            include: {
                company: { select: { name: true } },
                signalement: { select: { type: true, titre: true } }
            },
            orderBy: [
                { status: 'asc' },
                { createdAt: 'desc' }
            ]
        })

        return taches.map(t => ({
            id: t.id,
            companyName: t.company?.name || "Non renseigné",
            task: t.titre,
            description: t.description,
            date: t.createdAt.toLocaleDateString('fr-FR'),
            echeance: t.echeance?.toLocaleDateString('fr-FR') || null,
            status: t.status === "A_FAIRE" ? "À faire"
                : t.status === "EN_COURS" ? "En cours"
                    : "Terminée",
            rawStatus: t.status,
            statusColor: t.status === "A_FAIRE" ? "orange"
                : t.status === "EN_COURS" ? "blue"
                    : "green",
            priorite: t.priorite
        }))
    } catch (error) {
        console.error("Error fetching technician tasks:", error)
        return []
    }
}
