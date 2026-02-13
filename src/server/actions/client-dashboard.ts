'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ComplianceItem } from "@/components/client/compliance-checklist"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export interface ClientDashboardData {
    companyName: string
    complianceScore: number
    complianceLevel: string
    duerp: {
        status: string
        version: string
    }
    employeeCount: number
    subscription: {
        plan: string
        status: string
    }
    complianceChecklist: ComplianceItem[]
    reminders: Array<{
        title: string
        date: string
        type: "duerp" | "verification"
    }>
    affichagesCount: number
}

export async function getClientDashboardData(): Promise<ClientDashboardData | null> {
    try {
        const session = await auth()
        if (!session?.user?.email) return null

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                company: {
                    include: {
                        duerps: {
                            where: { status: "ACTIVE" },
                            orderBy: { createdAt: "desc" },
                            take: 1
                        },
                        subscription: {
                            include: {
                                plan: true
                            }
                        },
                        affichages: {
                            where: { downloaded: true }
                        }
                    }
                }
            }
        })

        if (!user?.company) return null

        const company = user.company
        const activeDuerp = company.duerps[0]

        // Calculate compliance score
        const complianceChecks = []
        let score = 0

        // DUERP signed (+40%)
        if (activeDuerp?.signedAt) {
            score += 40
            complianceChecks.push({
                label: "DUERP signé",
                status: "completed" as const,
                date: format(new Date(activeDuerp.signedAt), "dd/MM/yyyy", { locale: fr })
            })
        } else {
            complianceChecks.push({
                label: "DUERP signé",
                status: "pending" as const
            })
        }

        // Affichages obligatoires (+30%)
        const hasAffichages = company.affichages.length >= 5
        if (hasAffichages) {
            score += 30
            complianceChecks.push({
                label: "Affichages obligatoires",
                status: "completed" as const,
                date: "10/01/2026"
            })
        } else {
            complianceChecks.push({
                label: "Affichages obligatoires",
                status: "pending" as const
            })
        }

        // Registre du personnel (+15%)
        if (company.employeeCount >= 1) {
            score += 15
            complianceChecks.push({
                label: "Registre du personnel",
                status: "completed" as const
            })
        } else {
            complianceChecks.push({
                label: "Registre du personnel",
                status: "pending" as const
            })
        }

        // Vérification extincteurs (+15%)
        // Mockup: warning status "Dans 45j"
        complianceChecks.push({
            label: "Vérification extincteurs",
            status: "warning" as const,
            daysRemaining: 45
        })

        const complianceLevel = score >= 80 ? "Excellent" : score >= 60 ? "Bon" : "À améliorer"

        // Reminders
        const reminders = [
            {
                title: "Mise à jour DUERP",
                date: "2026-18-20",
                type: "duerp" as const
            },
            {
                title: "Vérification extincteurs",
                date: "Dans 45 jours",
                type: "verification" as const
            }
        ]

        return {
            companyName: company.name,
            complianceScore: score,
            complianceLevel,
            duerp: {
                status: activeDuerp ? "À jour" : "Non créé",
                version: activeDuerp ? `Version ${activeDuerp.version}.0` : "N/A"
            },
            employeeCount: company.employeeCount,
            subscription: {
                plan: company.subscription?.plan?.nom || "Essentiel",
                status: company.subscription?.status || "ACTIVE"
            },
            complianceChecklist: complianceChecks,
            reminders,
            affichagesCount: company.affichages.length
        }
    } catch (error) {
        console.error("Error fetching client dashboard data:", error)
        return null
    }
}
