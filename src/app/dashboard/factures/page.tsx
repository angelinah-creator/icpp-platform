import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Shield, CheckCircle2, FileText, CreditCard, Download, HelpCircle, ExternalLink, XCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getFacturesPageData, type StripeInvoiceItem } from "@/server/actions/stripe-invoices"
import { createCustomerPortalSession } from "@/server/actions/stripe"

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function StatCard({
    icon: Icon,
    value,
    label,
    color,
}: {
    icon: React.ElementType
    value: string | number
    label: string
    color: "green" | "blue" | "orange"
}) {
    const colors = {
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        orange: "bg-orange-50 text-orange-600",
    }
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </div>
    )
}

function InvoiceStatusBadge({ status }: { status: string }) {
    if (status === "paid") {
        return (
            <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium text-sm">Payée</span>
            </div>
        )
    }
    if (status === "open") {
        return (
            <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 font-medium text-sm">En attente</span>
            </div>
        )
    }
    if (status === "void" || status === "uncollectible") {
        return (
            <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500 font-medium text-sm">Annulée</span>
            </div>
        )
    }
    return (
        <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500 font-medium text-sm capitalize">{status}</span>
        </div>
    )
}

function formatAmount(amount: number, currency: string = "EUR") {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(amount / 100)
}

function EmptyInvoices() {
    return (
        <tr>
            <td colSpan={5} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-700">Aucune facture disponible</p>
                    <p className="text-sm text-slate-500 max-w-sm">
                        Vos factures apparaitront ici dès votre premier paiement validé.
                    </p>
                </div>
            </td>
        </tr>
    )
}

// ──────────────────────────────────────────────
// Customer Portal Button (Client Component)
// ──────────────────────────────────────────────

import PortalButton from "./portal-button"

// ──────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────

export const dynamic = "force-dynamic"

export default async function FacturesPage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const data = await getFacturesPageData()
    if (!data) redirect("/login")

    const subStatusLabel = {
        ACTIVE: "Actif",
        SUSPENDED: "Suspendu",
        CANCELED: "Annulé",
        PAST_DUE: "Impayé",
        TRIALING: "Période d'essai",
    } as Record<string, string>

    const subStatusColor = {
        ACTIVE: "bg-green-100 text-green-700",
        SUSPENDED: "bg-orange-100 text-orange-700",
        CANCELED: "bg-red-100 text-red-700",
        PAST_DUE: "bg-red-100 text-red-700",
        TRIALING: "bg-blue-100 text-blue-700",
    } as Record<string, string>

    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Factures</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                        Consultez et téléchargez vos factures d'abonnement
                    </p>
                </div>
                {data.subscription.stripeConnected && (
                    <PortalButton />
                )}
            </div>

            <div className="p-4 sm:p-6 space-y-6">

                {/* Subscription Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 sm:p-6 text-white shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h2 className="text-lg font-semibold text-white">
                                        Abonnement {data.subscription.plan}
                                    </h2>
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${subStatusColor[data.subscription.status] || "bg-white/20 text-white"}`}>
                                        {subStatusLabel[data.subscription.status] || data.subscription.status}
                                    </span>
                                </div>
                                <p className="text-sm text-blue-100">
                                    {formatAmount(data.subscription.price)}/mois
                                    {data.subscription.nextBilling && (
                                        <> • Prochaine facturation le <strong>{data.subscription.nextBilling}</strong></>
                                    )}
                                    {data.subscription.cancelAtPeriodEnd && (
                                        <span className="ml-2 text-orange-200"> • Résiliation programmée</span>
                                    )}
                                </p>
                                {!data.subscription.stripeConnected && (
                                    <p className="text-xs text-blue-200 mt-1">
                                        Connexion Stripe non encore activée — les factures seront disponibles après le premier paiement.
                                    </p>
                                )}
                            </div>
                        </div>
                        {data.subscription.stripeConnected && (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <PortalButton variant="outline-white" label="Gérer ma carte" icon="card" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={CheckCircle2}
                        value={data.stats.successfulPayments}
                        label="Paiements réussis"
                        color="green"
                    />
                    <StatCard
                        icon={FileText}
                        value={data.stats.totalInvoices}
                        label="Factures totales"
                        color="blue"
                    />
                    <StatCard
                        icon={CreditCard}
                        value={formatAmount(data.stats.totalPaid)}
                        label="Total payé"
                        color="orange"
                    />
                </div>

                {/* Invoices Table */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Historique des factures</h2>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Montant</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {data.invoices.length === 0 ? (
                                        <EmptyInvoices />
                                    ) : (
                                        data.invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-slate-900 font-medium">{invoice.date}</p>
                                                    {invoice.number && (
                                                        <p className="text-xs text-slate-400 mt-0.5">{invoice.number}</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-slate-700 text-sm">{invoice.description}</p>
                                                    {invoice.periodStart && invoice.periodEnd && (
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            Période : {invoice.periodStart} → {invoice.periodEnd}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-900">
                                                        {formatAmount(invoice.amount, invoice.currency)}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <InvoiceStatusBadge status={invoice.status} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {invoice.pdfUrl && (
                                                            <a
                                                                href={invoice.pdfUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                PDF
                                                            </a>
                                                        )}
                                                        {invoice.hostedUrl && (
                                                            <a
                                                                href={invoice.hostedUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                                Voir
                                                            </a>
                                                        )}
                                                        {!invoice.pdfUrl && !invoice.hostedUrl && (
                                                            <span className="text-sm text-slate-400">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Help */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Besoin d'aide ?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Pour toute question concernant votre facturation ou votre abonnement, contactez notre équipe support à{" "}
                                <a href="mailto:support@icpp.fr" className="text-blue-600 hover:underline font-medium">
                                    support@icpp.fr
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
