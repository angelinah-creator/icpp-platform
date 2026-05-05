import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { differenceInDays, addYears, format } from "date-fns"
import { fr } from "date-fns/locale"

export const dynamic = "force-dynamic"

/**
 * POST /api/admin/duerp-reminders
 * Envoie les emails de rappel DUERP pour les entreprises dont le DUERP expire dans < 60 jours.
 * Réservé aux ADMIN.
 *
 * Body: { dryRun?: boolean, companyIds?: string[] }
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true }
        })
        if (!["ADMIN"].includes(user?.role || "")) {
            return NextResponse.json({ error: "Accès refusé — réservé aux admins" }, { status: 403 })
        }

        const body = await req.json().catch(() => ({}))
        const dryRun: boolean = body.dryRun ?? false
        const companyIds: string[] | undefined = body.companyIds

        // Récupérer les entreprises avec DUERP signé
        const whereClause = companyIds?.length
            ? { id: { in: companyIds } }
            : {}

        const companies = await prisma.company.findMany({
            where: whereClause,
            include: {
                duerps: {
                    where: { signedAt: { not: null } },
                    orderBy: { version: "desc" },
                    take: 1,
                },
                users: {
                    where: { role: "CLIENT" },
                    take: 1,
                    select: { email: true, name: true }
                },
                subscription: true
            }
        })

        const now = new Date()
        const results: Array<{
            companyId: string
            companyName: string
            email: string
            daysUntilExpiry: number
            sent: boolean
            reason: string
        }> = []

        for (const company of companies) {
            const duerp = company.duerps[0]
            if (!duerp?.signedAt) continue

            const signedAt = new Date(duerp.signedAt)
            const expiryDate = addYears(signedAt, 1)
            const daysUntilExpiry = differenceInDays(expiryDate, now)

            // Seuils de rappel: 60j, 30j, 7j avant expiration + déjà expiré
            const shouldSend = daysUntilExpiry <= 60
            const clientEmail = company.users[0]?.email

            if (!clientEmail) {
                results.push({
                    companyId: company.id,
                    companyName: company.name,
                    email: "—",
                    daysUntilExpiry,
                    sent: false,
                    reason: "Aucun email client trouvé"
                })
                continue
            }

            if (!shouldSend) {
                results.push({
                    companyId: company.id,
                    companyName: company.name,
                    email: clientEmail,
                    daysUntilExpiry,
                    sent: false,
                    reason: "Pas encore dans la période de rappel (> 60j)"
                })
                continue
            }

            const expiryLabel = format(expiryDate, "dd MMMM yyyy", { locale: fr })
            const urgencyLabel = daysUntilExpiry < 0
                ? "EXPIRÉ"
                : daysUntilExpiry <= 7
                    ? `dans ${daysUntilExpiry} jour${daysUntilExpiry > 1 ? "s" : ""} ⚠️`
                    : `dans ${daysUntilExpiry} jours`

            if (!dryRun) {
                // Envoi email via Resend (ou autre provider configuré)
                try {
                    const emailPayload = {
                        to: clientEmail,
                        subject: `[ICPP] Votre DUERP expire ${urgencyLabel} — Action requise`,
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <div style="background: #031F5C; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
                                    <h1 style="margin: 0; font-size: 20px;">ICPP Conformité</h1>
                                    <p style="margin: 4px 0 0; opacity: 0.8; font-size: 14px;">Rappel de mise à jour DUERP</p>
                                </div>
                                <div style="background: white; padding: 24px; border: 1px solid #e2e8f0; border-top: 0;">
                                    <p>Bonjour,</p>
                                    <p>
                                        Nous vous contactons au sujet du Document Unique d'Évaluation des Risques Professionnels (DUERP) de l'entreprise
                                        <strong>${company.name}</strong>.
                                    </p>
                                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
                                        <strong>Votre DUERP arrive à échéance le ${expiryLabel}</strong><br>
                                        <small>Soit ${urgencyLabel}.</small>
                                    </div>
                                    <p>
                                        Conformément à l'article R4121-2 du Code du travail, le DUERP doit être mis à jour au minimum une fois par an.
                                        Le non-respect de cette obligation expose l'employeur à des sanctions.
                                    </p>
                                    <p>
                                        Notre équipe va prendre contact avec vous prochainement pour planifier la mise à jour de votre DUERP.
                                        Si vous souhaitez anticiper, n'hésitez pas à nous contacter directement.
                                    </p>
                                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                                        <p>ICPP Conformité | +262 692 45 19 13 | emmanuellekaisse@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        `
                    }

                    // Appel à l'API email interne (Resend, SendGrid, etc.)
                    const emailRes = await fetch(`${process.env.NEXTAUTH_URL}/api/email/send`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-api-key": process.env.INTERNAL_API_KEY || "" },
                        body: JSON.stringify(emailPayload)
                    })

                    results.push({
                        companyId: company.id,
                        companyName: company.name,
                        email: clientEmail,
                        daysUntilExpiry,
                        sent: emailRes.ok,
                        reason: emailRes.ok ? "Email envoyé" : `Erreur envoi: ${emailRes.status}`
                    })
                } catch (emailErr) {
                    results.push({
                        companyId: company.id,
                        companyName: company.name,
                        email: clientEmail,
                        daysUntilExpiry,
                        sent: false,
                        reason: `Exception: ${emailErr}`
                    })
                }
            } else {
                // Dry run — simulation seulement
                results.push({
                    companyId: company.id,
                    companyName: company.name,
                    email: clientEmail,
                    daysUntilExpiry,
                    sent: false,
                    reason: `[DRY RUN] Serait envoyé — expiry ${urgencyLabel}`
                })
            }
        }

        const sentCount = results.filter(r => r.sent).length
        const eligibleCount = results.filter(r => r.daysUntilExpiry <= 60 && r.email !== "—").length

        return NextResponse.json({
            success: true,
            dryRun,
            summary: {
                totalChecked: companies.length,
                eligible: eligibleCount,
                sent: sentCount,
                skipped: eligibleCount - sentCount,
            },
            results
        })
    } catch (error) {
        console.error("Erreur envoi rappels DUERP:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

/**
 * GET /api/admin/duerp-reminders
 * Aperçu des DUERP qui devraient recevoir un rappel (sans envoyer).
 */
export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    })
    if (!["ADMIN", "AUDITOR"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // Forward as dry run
    const body = JSON.stringify({ dryRun: true })
    const fakeReq = new NextRequest(req.url, {
        method: "POST",
        headers: { "content-type": "application/json", ...Object.fromEntries(req.headers) },
        body
    })
    return POST(fakeReq)
}
