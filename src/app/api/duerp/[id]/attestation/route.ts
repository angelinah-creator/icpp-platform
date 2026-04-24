import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { prisma } from "@/lib/prisma"
import { AttestationConformitePDF } from "@/lib/pdf/attestation-conformite"
import { auth } from "@/lib/auth"
import React from "react"

/**
 * GET /api/duerp/[id]/attestation
 * Génère l'attestation de conformité PDF pour un DUERP signé
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { id } = await params

        const duerp = await prisma.duerpDocument.findUnique({
            where: { id },
            include: {
                company: {
                    include: { metier: true },
                },
                signer: true,
            },
        })

        if (!duerp) {
            return NextResponse.json({ error: "DUERP introuvable" }, { status: 404 })
        }

        if (!duerp.signedAt) {
            return NextResponse.json(
                { error: "Ce DUERP n'a pas encore été signé — l'attestation ne peut pas être générée" },
                { status: 400 }
            )
        }

        // Vérification accès : admin, auditor, ou client de l'entreprise
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, companyId: true },
        })

        const isStaff = ["ADMIN", "AUDITOR", "COMMERCIAL"].includes(user?.role || "")
        const isOwner = user?.companyId === duerp.companyId

        if (!isStaff && !isOwner) {
            return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
        }

        // Génération du PDF (pattern identique à /api/duerp/[id]/pdf)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = React.createElement(AttestationConformitePDF, {
            company: {
                name: duerp.company.name,
                siret: duerp.company.siret,
                address: duerp.company.address,
                postalCode: duerp.company.postalCode,
                city: duerp.company.city,
                metier: duerp.company.metier?.nom,
                employeeCount: duerp.company.employeeCount,
            },
            duerp: {
                id: duerp.id,
                version: duerp.version,
                signedAt: duerp.signedAt!,
                nextReviewDate: duerp.nextReviewDate,
            },
            signer: {
                name: duerp.signer?.name || "ICPP",
                role: "Auditeur / Conseiller ICPP",
            },
            generatedAt: new Date(),
        }) as any

        const pdfBuffer: Buffer = await renderToBuffer(element)
        const body = new Uint8Array(pdfBuffer)

        const filename = `Attestation-Conformite-${duerp.company.name.replace(/[^a-zA-Z0-9]/g, "-")}-v${duerp.version}.pdf`

        return new Response(body, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": String(pdfBuffer.length),
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        })
    } catch (error) {
        console.error("Erreur génération attestation:", error)
        return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 })
    }
}
