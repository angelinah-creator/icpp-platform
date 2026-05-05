import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { prisma } from "@/lib/prisma"
import { AttestationRetraitPDF, AttestationRetraitProps } from "@/lib/pdf/attestation-retrait"
import { auth } from "@/lib/auth"
import React from "react"

export const dynamic = "force-dynamic"

/**
 * GET /api/duerp/[id]/attestation-retrait?motif=MISE_A_JOUR|REMPLACEMENT|RETRAIT&detail=...
 * Génère l'attestation de retrait/mise à jour pour un DUERP archivé
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

        // Seuls admin / auditor peuvent générer ce document
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, companyId: true },
        })
        const isStaff = ["ADMIN", "AUDITOR", "COMMERCIAL"].includes(user?.role || "")
        const isOwner = user?.role === "CLIENT"

        const { id } = await params
        const { searchParams } = new URL(req.url)
        const motifParam = searchParams.get("motif") as AttestationRetraitProps["motif"] | null
        const motif: AttestationRetraitProps["motif"] = motifParam || "MISE_A_JOUR"
        const motifDetail = searchParams.get("detail") || undefined

        const duerp = await prisma.duerpDocument.findUnique({
            where: { id },
            include: {
                company: { include: { metier: true } },
            },
        })

        if (!duerp) {
            return NextResponse.json({ error: "DUERP introuvable" }, { status: 404 })
        }

        if (!isStaff && !(isOwner && user?.companyId === duerp.companyId)) {
            return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
        }

        // Chercher le DUERP suivant de l'entreprise (version supérieure)
        const newDuerp = await prisma.duerpDocument.findFirst({
            where: {
                companyId: duerp.companyId,
                version: { gt: duerp.version },
            },
            orderBy: { version: "asc" },
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = React.createElement(AttestationRetraitPDF, {
            company: {
                name: duerp.company.name,
                siret: duerp.company.siret,
                address: duerp.company.address,
                postalCode: duerp.company.postalCode,
                city: duerp.company.city,
                metier: duerp.company.metier?.nom,
            },
            oldDuerp: {
                id: duerp.id,
                version: duerp.version,
                signedAt: duerp.signedAt,
                createdAt: duerp.createdAt,
            },
            newDuerp: newDuerp
                ? { id: newDuerp.id, version: newDuerp.version, createdAt: newDuerp.createdAt }
                : null,
            motif,
            motifDetail,
            generatedAt: new Date(),
        }) as any // eslint-disable-line @typescript-eslint/no-explicit-any

        const pdfBuffer: Buffer = await renderToBuffer(element)
        const filename = `Attestation-Retrait-DUERP-${duerp.company.name.replace(/[^a-zA-Z0-9]/g, "-")}-v${duerp.version}.pdf`

        return new Response(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": String(pdfBuffer.length),
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        })
    } catch (error) {
        console.error("Erreur génération attestation retrait:", error)
        return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 })
    }
}
