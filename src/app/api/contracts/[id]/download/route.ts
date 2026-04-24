import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import React from "react"
import { ContractPdfDocument } from "@/lib/pdf/contract-pdf"

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true, companyId: true },
    })

    if (!user) {
        return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const { id } = await params
    const contract = await prisma.contrat.findUnique({
        where: { id },
        include: {
            company: {
                select: {
                    id: true,
                    name: true,
                    auditorId: true,
                    commercialId: true,
                },
            },
            cgv: true,
        },
    })

    if (!contract) {
        return NextResponse.json({ error: "Contrat introuvable" }, { status: 404 })
    }

    let isAuditCreatorAuditor = false
    if (user.role === "AUDITOR") {
        const createdAudit = await prisma.audit.findFirst({
            where: {
                companyId: contract.companyId,
                auditorId: user.id,
            },
            select: { id: true },
        })
        isAuditCreatorAuditor = Boolean(createdAudit)
    }

    const canAccess =
        user.role === "ADMIN" ||
        (user.role === "CLIENT" && user.companyId === contract.companyId) ||
        ((user.role === "AUDITOR" || user.role === "COMMERCIAL") &&
            (
                contract.company.auditorId === user.id ||
                contract.company.commercialId === user.id ||
                isAuditCreatorAuditor
            ))

    if (!canAccess) {
        return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
    }

    let signatureDataUrl = ""
    try {
        const payload = contract.signatureData ? JSON.parse(contract.signatureData) : null
        signatureDataUrl = payload?.drawingDataUrl || ""
    } catch {
        signatureDataUrl = ""
    }

    const document = React.createElement(ContractPdfDocument as React.ComponentType<any>, {
        data: {
            numeroContrat: contract.numeroContrat,
            companyName: contract.company.name,
            cgvVersion: contract.cgvVersion,
            dateDebut: contract.dateDebut,
            signedAt: contract.signedAt,
            cgvContenu: contract.cgv.contenu,
            signatureDataUrl: signatureDataUrl || null,
        },
    })

    const buffer = await renderToBuffer(document as unknown as React.ReactElement<DocumentProps>)
    const pdfBytes = new Uint8Array(buffer)

    return new NextResponse(pdfBytes, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="contrat-${contract.numeroContrat}.pdf"`,
        },
    })
}
