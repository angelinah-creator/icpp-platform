import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import { DuerpPdfDocument } from "@/lib/pdf/duerp-pdf"
import type { DuerpPdfData, DuerpEvaluation } from "@/lib/pdf/duerp-pdf"

export async function GET(
    request: NextRequest,
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
                    include: {
                        metier: true,
                        auditor: true,
                    },
                },
                evaluations: {
                    include: {
                        risque: {
                            include: {
                                categorie: true,
                            },
                        },
                    },
                    orderBy: { uniteTravail: "asc" },
                },
                signer: true,
            },
        })

        if (!duerp) {
            return NextResponse.json({ error: "DUERP non trouvé" }, { status: 404 })
        }

        const evaluations: DuerpEvaluation[] = duerp.evaluations.map((ev) => {
            let mesures: string[] = []
            try {
                mesures = JSON.parse(ev.mesuresAppliquees || "[]")
            } catch {
                mesures = ev.mesuresAppliquees ? [ev.mesuresAppliquees] : []
            }

            return {
                risqueNom: ev.risque.nom,
                categorieNom: ev.risque.categorie.nom,
                uniteTravail: ev.uniteTravail,
                frequence: ev.frequence,
                gravite: ev.gravite,
                niveauRisque: ev.niveauRisque,
                mesuresAppliquees: mesures,
                observations: ev.observations || undefined,
            }
        })

        const pdfData: DuerpPdfData = {
            company: {
                name: duerp.company.name,
                siret: duerp.company.siret || "Non renseigné",
                address: duerp.company.address,
                city: duerp.company.city,
                postalCode: duerp.company.postalCode || undefined,
                employeeCount: duerp.company.employeeCount,
                metier: duerp.company.metier?.nom || undefined,
                contactName: duerp.company.contactName || undefined,
                contactRole: duerp.company.contactRole || undefined,
            },
            version: duerp.version,
            status: duerp.status,
            createdAt: duerp.createdAt,
            updatedAt: duerp.updatedAt,
            nextReviewDate: duerp.nextReviewDate || undefined,
            evaluations,
            auditorName: duerp.company.auditor?.name || undefined,
        }

        if (duerp.signedAt && duerp.signer) {
            let sigData: Record<string, string> = {}
            try {
                sigData = JSON.parse(duerp.signatureData || "{}")
            } catch {
                sigData = {}
            }

            pdfData.signature = {
                signedAt: duerp.signedAt,
                signerName: duerp.signer.name,
                signerRole: sigData.role || undefined,
                certificationText: sigData.certification || "Je certifie l'exactitude des informations contenues dans ce document.",
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = React.createElement(DuerpPdfDocument, { data: pdfData }) as any
        const pdfBuffer: Buffer = await renderToBuffer(element)

        const companySlug = duerp.company.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)
        const filename = `DUERP_${companySlug}_v${duerp.version}.pdf`
        const body = new Uint8Array(pdfBuffer)

        return new Response(body, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": String(pdfBuffer.length),
            },
        })
    } catch (error) {
        console.error("Erreur génération PDF DUERP:", error)
        return NextResponse.json(
            { error: "Erreur lors de la génération du PDF" },
            { status: 500 }
        )
    }
}
