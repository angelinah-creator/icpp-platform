import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import { Fiche1Coordonnees } from "@/lib/pdf/affichage-fiche1"
import type { Fiche1Data } from "@/lib/pdf/affichage-fiche1"
import { Fiche2DroitsObligations } from "@/lib/pdf/affichage-fiche2"
import { Fiche3InterdictionFumer } from "@/lib/pdf/affichage-fiche3"
import { Fiche4ConsignesIncendie } from "@/lib/pdf/affichage-fiche4"

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

        const affichage = await prisma.affichage.findUnique({
            where: { id },
            include: {
                company: true,
            },
        })

        if (!affichage) {
            return NextResponse.json({ error: "Affichage non trouvé" }, { status: 404 })
        }

        const company = {
            name: affichage.company.name,
            address: affichage.company.address,
            city: affichage.company.city,
            siret: affichage.company.siret || undefined,
            employeeCount: affichage.company.employeeCount,
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let element: any

        switch (affichage.category) {
            case "FICHE_1": {
                let dynamicData: Fiche1Data = {}
                try {
                    dynamicData = JSON.parse(affichage.dynamicData || "{}")
                } catch {
                    dynamicData = {}
                }
                element = React.createElement(Fiche1Coordonnees, { company, data: dynamicData })
                break
            }
            case "FICHE_2":
                element = React.createElement(Fiche2DroitsObligations, {
                    company: { name: company.name },
                    version: affichage.version,
                })
                break
            case "FICHE_3":
                element = React.createElement(Fiche3InterdictionFumer, {
                    company: { name: company.name },
                })
                break
            case "FICHE_4":
                element = React.createElement(Fiche4ConsignesIncendie, {
                    company: { name: company.name },
                })
                break
            default:
                return NextResponse.json(
                    { error: `Catégorie d'affichage non supportée: ${affichage.category}` },
                    { status: 400 }
                )
        }

        const pdfBuffer: Buffer = await renderToBuffer(element)

        await prisma.affichage.update({
            where: { id },
            data: { generatedAt: new Date() },
        })

        const body = new Uint8Array(pdfBuffer)
        const slug = affichage.category.replace(/_/g, "")
        const companySlug = company.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 25)
        const filename = `Affichage_${slug}_${companySlug}.pdf`

        return new Response(body, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": String(pdfBuffer.length),
            },
        })
    } catch (error) {
        console.error("Erreur génération PDF affichage:", error)
        return NextResponse.json(
            { error: "Erreur lors de la génération du PDF" },
            { status: 500 }
        )
    }
}
