import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { prisma } from "@/lib/prisma"
import { RegistrePersonnelPDF } from "@/lib/pdf/registre-personnel"
import { auth } from "@/lib/auth"
import React from "react"

export const dynamic = "force-dynamic"

/**
 * GET /api/companies/[id]/registre-personnel
 * Génère le Registre du Personnel en PDF pour l'entreprise spécifiée.
 * Accès : admin/auditeur OU client propriétaire de l'entreprise.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { id: companyId } = await params

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, companyId: true },
        })

        const isStaff = ["ADMIN", "AUDITOR", "COMMERCIAL"].includes(user?.role || "")
        const isOwner = user?.companyId === companyId

        if (!isStaff && !isOwner) {
            return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
        }

        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                metier: true,
                salaries: {
                    orderBy: [{ isActive: "desc" }, { dateEntree: "asc" }]
                }
            }
        })

        if (!company) {
            return NextResponse.json({ error: "Entreprise introuvable" }, { status: 404 })
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const element = React.createElement(RegistrePersonnelPDF, {
            company: {
                name: company.name,
                siret: company.siret,
                address: company.address,
                postalCode: company.postalCode,
                city: company.city,
                metier: company.metier?.nom,
                employeeCount: company.employeeCount,
            },
            salaries: company.salaries.map(s => ({
                id: s.id,
                nom: s.nom,
                prenom: s.prenom,
                poste: s.poste,
                uniteTravail: s.uniteTravail,
                dateEntree: s.dateEntree,
                dateSortie: s.dateSortie,
                typeContrat: s.typeContrat,
                tempsTravail: s.tempsTravail,
                isActive: s.isActive,
            })),
            generatedAt: new Date(),
        }) as any // eslint-disable-line @typescript-eslint/no-explicit-any

        const pdfBuffer: Buffer = await renderToBuffer(element)
        const filename = `Registre-Personnel-${company.name.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`

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
        console.error("Erreur génération registre personnel:", error)
        return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 })
    }
}
