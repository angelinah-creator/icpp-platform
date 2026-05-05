/**
 * payment-receipt.tsx
 *
 * Réutilise le composant FacturePDF (maquette officielle ICPP) pour les
 * paiements en espèces / chèque collectés par les techniciens.
 * Les données du paiement sont mappées vers la structure FactureProps.
 */
import React from "react"
import { Document } from "@react-pdf/renderer"
import { FacturePDF } from "./facture-pdf"

export interface PaymentReceiptData {
    receiptNumber: string
    companyName: string
    clientName: string
    method: string
    amount: number          // en centimes
    currency: string
    planCode: string | null
    paidAt: Date | null
    createdAt: Date
    collectorName: string | null
    validatorName: string | null
}

function fmtDate(d: Date | null | undefined): string {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

function amountEur(centimes: number): number {
    return Math.round(centimes) / 100
}

function methodLabel(m: string): string {
    const map: Record<string, string> = {
        CASH: "Espèces",
        CHECK: "Chèque",
        BANK_TRANSFER: "Virement bancaire",
        CARD: "Carte bancaire",
    }
    return map[m] || m
}

export function PaymentReceiptDocument({ data }: { data: PaymentReceiptData }) {
    const dateStr = fmtDate(data.paidAt || data.createdAt)
    const total = amountEur(data.amount)
    const planLabel = data.planCode
        ? `Abonnement ${data.planCode} — ICPP Conformité`
        : "Abonnement ICPP Conformité"

    const factureProps = {
        company: {
            name: data.companyName,
            metier: null,
        },
        facture: {
            numero: data.receiptNumber,
            reference: `Paiement ${methodLabel(data.method)}`,
            dateFacture: dateStr,
            dateEcheance: dateStr,
            items: [
                {
                    description: planLabel,
                    qte: 1,
                    tarif: total,
                    montant: total,
                },
            ],
            subtotal: total,
            tax: 0,
            total,
            totalInWords: `Montant acquitté par ${methodLabel(data.method)}`,
        },
    }

    return <FacturePDF {...factureProps} />
}