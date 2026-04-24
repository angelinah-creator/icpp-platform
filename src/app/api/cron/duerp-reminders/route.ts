import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDuerpReminderToClient, sendDuerpSummaryToAuditor } from "@/lib/email"

const CRON_SECRET = process.env.CRON_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://icpp-conformite.cloud"

// Seuils en jours
const DAYS_PRE_EXPIRY = 335  // 30 jours avant l'expiration (12 mois - 30j)
const DAYS_OVERDUE    = 365  // DUERP expiré

/**
 * POST /api/cron/duerp-reminders
 * Protégé par : Authorization: Bearer <CRON_SECRET>
 *
 * Logique :
 * - Cherche tous les DUERP ACTIVE dont updatedAt > 335 jours
 * - Envoie un email "rappel" ou "expiré" au contact client
 * - Compile un récapitulatif par auditeur et envoie un email de synthèse
 */
export async function POST(req: NextRequest) {
    // ── Sécurité ──────────────────────────────────────────────────────────────
    if (!CRON_SECRET) {
        return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 500 })
    }
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const now = new Date()
    const cutoffDate = new Date(now.getTime() - DAYS_PRE_EXPIRY * 24 * 60 * 60 * 1000)

    try {
        // ── Récupérer les DUERP à relancer ───────────────────────────────────
        const duerps = await prisma.duerpDocument.findMany({
            where: {
                status: "ACTIVE",
                updatedAt: { lte: cutoffDate },
            },
            include: {
                company: {
                    include: {
                        users: {
                            where: { role: { in: ["CLIENT", "AUDITOR"] } },
                            select: { email: true, name: true, role: true },
                        },
                    },
                },
            },
        })

        if (duerps.length === 0) {
            return NextResponse.json({ message: "Aucun DUERP à relancer", sent: 0 })
        }

        const results: { companyId: string; status: string }[] = []

        // Map auditor → companies à récapituler
        const auditorMap = new Map<string, {
            name: string
            email: string
            companies: { companyName: string; daysSinceUpdate: number; contactEmail: string }[]
        }>()

        // ── Envoi des emails clients ─────────────────────────────────────────
        for (const duerp of duerps) {
            const company = duerp.company
            const clientUser = company.users.find(u => u.role === "CLIENT")
            const auditorUser = company.users.find(u => u.role === "AUDITOR")
            const daysSince = Math.floor(
                (now.getTime() - new Date(duerp.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
            )

            // Email au contact client
            if (clientUser?.email) {
                await sendDuerpReminderToClient({
                    to: clientUser.email,
                    companyName: company.name,
                    contactName: clientUser.name,
                    duerpCreatedAt: duerp.createdAt,
                    daysSinceUpdate: daysSince,
                    appUrl: APP_URL,
                })
                results.push({ companyId: company.id, status: "email_client_sent" })
            }

            // Accumuler pour l'auditeur
            if (auditorUser?.email) {
                if (!auditorMap.has(auditorUser.email)) {
                    auditorMap.set(auditorUser.email, {
                        name: auditorUser.name,
                        email: auditorUser.email,
                        companies: [],
                    })
                }
                auditorMap.get(auditorUser.email)!.companies.push({
                    companyName: company.name,
                    daysSinceUpdate: daysSince,
                    contactEmail: clientUser?.email ?? "",
                })
            }
        }

        // ── Envoi des récapitulatifs aux auditeurs ────────────────────────────
        for (const [, auditor] of auditorMap) {
            await sendDuerpSummaryToAuditor({
                to: auditor.email,
                auditorName: auditor.name,
                companies: auditor.companies,
                appUrl: APP_URL,
            })
        }

        console.log(`[CRON] DUERP reminders sent: ${duerps.length} companies, ${auditorMap.size} auditors`)

        return NextResponse.json({
            message: "Rappels envoyés avec succès",
            duerpCount: duerps.length,
            auditorsNotified: auditorMap.size,
            results,
        })
    } catch (error) {
        console.error("[CRON] duerp-reminders error:", error)
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
    }
}

/**
 * GET /api/cron/duerp-reminders — Info rapide (sans authentification)
 */
export async function GET() {
    const count = await prisma.duerpDocument.count({
        where: {
            status: "ACTIVE",
            updatedAt: {
                lte: new Date(Date.now() - DAYS_PRE_EXPIRY * 24 * 60 * 60 * 1000),
            },
        },
    }).catch(() => -1)

    return NextResponse.json({
        endpoint: "POST /api/cron/duerp-reminders",
        auth: "Authorization: Bearer <CRON_SECRET>",
        duerpsDueForReminder: count,
        thresholdDays: DAYS_PRE_EXPIRY,
    })
}
