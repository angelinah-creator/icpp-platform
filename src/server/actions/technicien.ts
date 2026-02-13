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

        // Stats for technician
        const stats = {
            tachesEnCours: await prisma.audit.count({
                where: { status: "EN_COURS" }
            }),
            tachesAFaire: await prisma.audit.count({
                where: { status: "PLANIFIE" }
            }),
            tachesTerminees: await prisma.audit.count({
                where: { status: "TERMINE" }
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
        if (!session?.user) return []

        // Get audits and signalements for tasks
        const audits = await prisma.audit.findMany({
            where: {
                status: { in: ["PLANIFIE", "EN_COURS"] }
            },
            include: {
                company: true
            },
            orderBy: {
                dateAudit: 'asc'
            }
        })

        const signalements = await prisma.signalement.findMany({
            where: {
                status: { in: ["NOUVEAU", "EN_COURS"] }
            },
            include: {
                company: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        // Format as tasks
        const tasks = [
            ...audits.map(audit => ({
                id: `audit-${audit.id}`,
                companyName: audit.company.name,
                task: `Audit ${audit.type}`,
                date: audit.dateAudit.toLocaleDateString('fr-FR'),
                status: audit.status === "PLANIFIE" ? "À faire" : "En cours",
                statusColor: audit.status === "PLANIFIE" ? "orange" : "blue"
            })),
            ...signalements.map(sig => ({
                id: `sig-${sig.id}`,
                companyName: sig.company?.name || "Entreprise inconnue",
                task: sig.type,
                date: sig.createdAt.toLocaleDateString('fr-FR'),
                status: sig.status === "NOUVEAU" ? "À faire" : "En cours",
                statusColor: sig.status === "NOUVEAU" ? "orange" : "blue"
            }))
        ]

        return tasks
    } catch (error) {
        console.error("Error fetching technician tasks:", error)
        return []
    }
}
