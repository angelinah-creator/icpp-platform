import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"
import { renderToBuffer } from "@react-pdf/renderer"
import React from "react"
import { FacturePDF } from "@/lib/pdf/facture-pdf"

function numberToFrenchWords(num: number): string {
    // Simple mock to fulfill the mockup requirement without writing a complex library.
    // In a real app, you would use a package like 'written-number' or similar.
    return "Montant acquitté"
}

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
        include: {
            company: {
                include: {
                    subscription: true
                }
            }
        },
    })

    if (!user || !user.company) {
        return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const { id } = await params

    const stripe = getStripe()
    if (!stripe) {
        return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 })
    }

    try {
        const invoice = await stripe.invoices.retrieve(id)

        // Verify that the user is ADMIN or the invoice belongs to their Stripe customer ID
        const stripeCustomerId = user.company.subscription?.stripeCustomerId
        if (user.role !== "ADMIN" && invoice.customer !== stripeCustomerId) {
            return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
        }

        const factureProps = {
            company: {
                name: user.company.name,
                metier: null, // Removed direct access to user.company.metier
            },
            facture: {
                numero: invoice.number || id,
                reference: invoice.id,
                dateFacture: new Date(invoice.created * 1000).toLocaleDateString("fr-FR"),
                dateEcheance: invoice.due_date 
                    ? new Date(invoice.due_date * 1000).toLocaleDateString("fr-FR") 
                    : new Date(invoice.created * 1000).toLocaleDateString("fr-FR"),
                items: invoice.lines.data.map((l: any) => ({
                    description: l.description || "Article",
                    qte: l.quantity || 1,
                    tarif: l.price?.unit_amount ? l.price.unit_amount / 100 : l.amount / 100,
                    montant: l.amount / 100
                })),
                subtotal: invoice.subtotal / 100,
                tax: ((invoice as any).tax || 0) / 100,
                total: invoice.total / 100,
                totalInWords: `Total en euros: ${invoice.total / 100}`,
            }
        }

        const document = React.createElement(FacturePDF as React.ComponentType<any>, factureProps)
        const buffer = await renderToBuffer(document as any)
        const pdfBytes = new Uint8Array(buffer)

        return new NextResponse(pdfBytes, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="facture-${invoice.number || id}.pdf"`,
            },
        })
    } catch (err) {
        console.error("Facture download error:", err)
        return NextResponse.json({ error: "Erreur lors de la génération de la facture" }, { status: 500 })
    }
}
