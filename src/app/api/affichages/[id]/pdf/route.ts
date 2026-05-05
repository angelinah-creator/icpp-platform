import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"


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

        let dynamicData: any = {}
        try {
            dynamicData = JSON.parse(affichage.dynamicData || "{}")
        } catch {
            dynamicData = {}
        }
        
        // Mappage complet vers le format AffichageA4
        const a4Data = {
            company,
            inspection: {
                inspecteur: dynamicData.inspectionNom || "",
                adresse: dynamicData.inspectionAdresse || "",
                telephone: dynamicData.inspectionTelephone || "",
                horaires: dynamicData.inspectionHoraires || "",
            },
            medecine: {
                service: dynamicData.medecineNom || "",
                adresse: dynamicData.medecineAdresse || "",
                telephone: dynamicData.medecineTelephone || "",
                medecinReferent: dynamicData.medecinMedecin || "",
            },
            referent: {
                nom: dynamicData.referentNom || "",
                telephone: dynamicData.referentTelephone || "",
            },
            convention: {
                intitule: dynamicData.conventionIntitule || "",
                idcc: dynamicData.conventionIdcc || "",
                lieuConsultation: dynamicData.lieuConsultation || "Sur demande",
            },
            organisation: {
                LUNDI:     { matin: dynamicData.horairesLundi     || "", apresMidi: "" },
                MARDI:     { matin: dynamicData.horairesMardi     || "", apresMidi: "" },
                MERCREDI:  { matin: dynamicData.horairesMercredi  || "", apresMidi: "" },
                JEUDI:     { matin: dynamicData.horairesJeudi     || "", apresMidi: "" },
                VENDREDI:  { matin: dynamicData.horairesVendredi  || "", apresMidi: "" },
                SAMEDI:    { matin: dynamicData.horairesSamedi    || "", apresMidi: "" },
                DIMANCHE:  { matin: dynamicData.horairesDimanche  || "Fermé", apresMidi: "" },
            },
            horaires: {
                tempsPause: dynamicData.tempsPause  || "",
                matin:      dynamicData.horaireMatin     || "",
                apresMidi:  dynamicData.horaireApresMidi || "",
            },
            conges: {
                consultableAupresDe: dynamicData.conges || "Direction / RH",
            },
            duerp: {
                lieuConsultation: dynamicData.duerp_lieu  || "Direction",
                acces:            dynamicData.duerp_acces || "Sur demande",
            },
            urgences: {
                samu:     dynamicData.urgenceSamu     || "15",
                police:   dynamicData.urgencePolice   || "17",
                pompiers: dynamicData.urgencePompiers || "18",
            },
            horairesCollectifs: dynamicData.horairesCollectifs || "",
        }

        const { AffichageObligatoireA4 } = await import("@/lib/pdf/affichage-a4")
        const element = React.createElement(AffichageObligatoireA4, { data: a4Data })

        const pdfBuffer: Buffer = await renderToBuffer(element as any)

        await prisma.affichage.update({
            where: { id },
            data: { generatedAt: new Date() },
        })

        const body = new Uint8Array(pdfBuffer)
        const companySlug = company.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 25)
        const filename = `Affichages_Obligatoires_${companySlug}.pdf`

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
