import { NextResponse } from "next/server"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import React from "react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PaymentReceiptDocument } from "@/lib/pdf/payment-receipt"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const [{ id }, user] = await Promise.all([
        params,
        prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, role: true },
        }),
    ])

    if (!user) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    const payment = await prisma.subscriptionPayment.findUnique({
        where: { id },
        include: {
            company: { select: { name: true } },
            clientUser: { select: { id: true, name: true, email: true } },
            collector: { select: { id: true, name: true } },
            validatedBy: { select: { id: true, name: true } },
        },
    })

    if (!payment) {
        return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 })
    }

    const canAccess =
        user.role === "ADMIN" ||
        payment.clientUserId === user.id ||
        payment.collectorId === user.id ||
        payment.validatedById === user.id

    if (!canAccess) {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const receiptRef = payment.receiptNumber || `ICPP-${payment.id.slice(0, 8).toUpperCase()}`

    const document = React.createElement(PaymentReceiptDocument as React.ComponentType<any>, {
        data: {
            receiptNumber: receiptRef,
            companyName: payment.company.name,
            clientName: payment.clientUser.name || payment.clientUser.email || "Client ICPP",
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency,
            planCode: payment.planCode,
            paidAt: payment.paidAt,
            createdAt: payment.createdAt,
            collectorName: payment.collector?.name || null,
            validatorName: payment.validatedBy?.name || null,
        },
    })

    const buffer = await renderToBuffer(document as unknown as React.ReactElement<DocumentProps>)
    const pdfBytes = new Uint8Array(buffer)

    return new NextResponse(pdfBytes, {
        headers: {
            "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${receiptRef}.pdf"`,
        },
    })
}