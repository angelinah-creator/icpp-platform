import { NextRequest, NextResponse } from "next/server"
import { getAuditDetails } from "@/server/actions/client"
import { generateAuditPDF } from "@/lib/pdf/audit-pdf"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const audit = await getAuditDetails(id)

        if (!audit) {
            return NextResponse.json(
                { error: "Audit non trouvé" },
                { status: 404 }
            )
        }

        const pdfBuffer = await generateAuditPDF(audit)

        return new NextResponse(pdfBuffer.buffer as ArrayBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="audit-${audit.company.name.replace(/\s+/g, "-")}-${new Date(audit.createdAt).toISOString().split("T")[0]}.pdf"`
            }
        })
    } catch (error) {
        console.error("Error generating PDF:", error)
        return NextResponse.json(
            { error: "Erreur lors de la génération du PDF" },
            { status: 500 }
        )
    }
}
