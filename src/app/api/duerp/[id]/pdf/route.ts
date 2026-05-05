import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import { DuerpPdfDocument } from "@/lib/pdf/duerp-pdf"
import type { DuerpPdfData, DuerpEvaluation } from "@/lib/pdf/duerp-pdf"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
                        metier: {
                            include: {
                                unitesTravail: {
                                    orderBy: { ordre: "asc" },
                                },
                            },
                        },
                        auditor: true,
                        signalements: {
                            where: {
                                type: "ACCIDENT_TRAVAIL",
                                createdAt: {
                                    gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
                                },
                            },
                            orderBy: { createdAt: "desc" },
                            take: 10,
                        },
                    },
                },
                evaluations: {
                    include: {
                        risque: {
                            include: {
                                categorie: true,
                                uniteTravail: true,
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

        const evAny = duerp.evaluations as (typeof duerp.evaluations[number] & {
            applicable?: boolean
            descriptionExposition?: string | null
            ponderation?: number
            risqueResiduel?: number | null
            commentaires?: string | null
        })[]

        const evaluations: DuerpEvaluation[] = evAny.map((ev) => {
            let mesures: string[] = []
            try {
                mesures = JSON.parse(ev.risque.mesuresSuggerees || "[]")
            } catch {
                mesures = ev.risque.mesuresSuggerees ? [ev.risque.mesuresSuggerees] : []
            }

            const freq = ev.frequence
            const grav = ev.gravite
            const pond = ev.ponderation ?? 1
            const brut = freq * grav
            const residuel = ev.risqueResiduel ?? brut * pond

            return {
                risqueNom: ev.risque.nom,
                risqueDescription: ev.risque.description || "",
                categorieNom: ev.risque.categorie.nom,
                categorieCode: ev.risque.categorie.code,
                uniteTravail: ev.uniteTravail,
                frequence: freq,
                gravite: grav,
                niveauRisque: brut,
                ponderation: pond,
                risqueResiduel: residuel,
                applicable: ev.applicable !== false,
                descriptionExposition: ev.descriptionExposition || undefined,
                mesuresAppliquees: mesures,
                observations: ev.observations || undefined,
                commentaires: ev.commentaires || undefined,
                actionCorrective: ev.actionCorrective || undefined,
                responsable: ev.responsable || undefined,
                delai: ev.delai || undefined,
                prioriteAction: ev.prioriteAction || undefined,
                niveauMaitrise: ev.niveauMaitrise || undefined,
            }
        })

        // Build accident history from signalements
        const companyWithSignalements = duerp.company as typeof duerp.company & {
            signalements: Array<{
                id: string
                titre: string
                description: string
                createdAt: Date
                reponse: string | null
            }>
        }

        const accidentHistory = (companyWithSignalements.signalements ?? []).map((s) => ({
            date: s.createdAt,
            salarie: "",
            nature: s.titre,
            causes: s.description,
            mesures: s.reponse || "En cours de traitement",
        }))

        // Build UT list from metier if available
        const unitesTravail = (duerp.company.metier?.unitesTravail ?? []).map((ut) => ({
            nom: ut.nom,
            description: ut.description || "",
        }))

        const pdfData: DuerpPdfData = {
            companyName: duerp.company.name,
            siret: duerp.company.siret || "Non renseigné",
            address: duerp.company.address,
            city: duerp.company.city,
            postalCode: duerp.company.postalCode || "",
            activitySector: duerp.company.metier?.nom || "Non spécifié",
            employeeCount: duerp.company.employeeCount,
            contactName: duerp.company.contactName || undefined,
            contactRole: duerp.company.contactRole || undefined,
            contactEmail: duerp.company.contactEmail || undefined,
            version: duerp.version,
            status: duerp.status,
            createdAt: duerp.createdAt,
            updatedAt: duerp.updatedAt || undefined,
            nextReviewDate: duerp.nextReviewDate || undefined,
            evaluations,
            accidentHistory,
            unitesTravail,
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
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
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
