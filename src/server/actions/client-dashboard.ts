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
        startDate: string | null
        endDate: string | null
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
                            orderBy: { createdAt: "desc" },
                            take: 1
                        },
                        subscription: {
                            include: {
                                plan: true
                            }
                        },
                        affichages: true
                    }
                }
            }
        })

        if (!user?.company) return null

        const company = user.company
        const activeDuerp = company.duerps[0]
        const signedDuerpAt = activeDuerp?.signedAt ?? null
        const hasSignedDuerp = Boolean(signedDuerpAt)

        // Calculate client progress score:
        // DUERP completion gives a baseline, then operational follow-up increases it.
        const complianceChecks = []
        let score = 0

        // Recalibrated client score: core compliance items should place the client clearly above average.
        if (signedDuerpAt) {
            score += 55
            complianceChecks.push({
                label: "DUERP signé",
                status: "completed" as const,
                date: format(new Date(signedDuerpAt), "dd/MM/yyyy", { locale: fr })
            })
        } else {
            complianceChecks.push({
                label: "DUERP signé",
                status: "pending" as const
            })
        }

        // Follow-up item (+25%)
        const hasAffichages = company.affichages.length >= 5
        if (hasAffichages) {
            score += 25
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

        // Follow-up item (+15%)
        const hasPersonnelRegister = company.employeeCount >= 1
        if (hasPersonnelRegister) {
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

        // Follow-up item (+5)
        // Mockup currently remains in warning state.
        const extincteursUpToDate = false
        if (extincteursUpToDate) {
            score += 5
            complianceChecks.push({
                label: "Vérification extincteurs",
                status: "completed" as const,
                date: "10/01/2026"
            })
        } else {
            complianceChecks.push({
                label: "Vérification extincteurs",
                status: "warning" as const,
                daysRemaining: 45
            })
        }

        const hasCoreCompliance = hasSignedDuerp && hasAffichages && hasPersonnelRegister
        if (hasCoreCompliance && score < 85) {
            score = 85
        }

        const complianceLevel = score >= 85 ? "Excellent" : score >= 70 ? "Bon" : "À améliorer"

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
                status: hasSignedDuerp ? "À jour" : activeDuerp ? "En cours" : "Non créé",
                version: activeDuerp ? `Version ${activeDuerp.version}.0` : "N/A"
            },
            employeeCount: company.employeeCount,
            subscription: {
                plan: company.subscription?.plan?.nom || "Essentiel",
                status: company.subscription?.status || "INACTIVE",
                startDate: company.subscription?.currentPeriodStart
                    ? company.subscription.currentPeriodStart.toISOString()
                    : null,
                endDate: company.subscription?.currentPeriodEnd
                    ? company.subscription.currentPeriodEnd.toISOString()
                    : null
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
