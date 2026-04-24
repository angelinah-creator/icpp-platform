"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BadgeCheck, Banknote, CheckCircle2, CreditCard, Download, Search, ShieldAlert, XCircle } from "lucide-react"
import { validateCashPayment, rejectCashPayment, type PaymentListItem } from "@/server/actions/payments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PaymentManagementBoardProps {
    payments: PaymentListItem[]
    title: string
    subtitle: string
    currentRole: "ADMIN" | "AUDITOR" | "COMMERCIAL"
    currentUserId?: string
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount / 100)
}

function statusLabel(status: string) {
    if (status === "AWAITING_VALIDATION") return "En attente de validation"
    if (status === "PAID") return "Payé"
    if (status === "REJECTED") return "Refusé"
    if (status === "PENDING") return "Initié"
    return status
}

function statusClass(status: string) {
    if (status === "AWAITING_VALIDATION") return "bg-amber-100 text-amber-700"
    if (status === "PAID") return "bg-emerald-100 text-emerald-700"
    if (status === "REJECTED") return "bg-rose-100 text-rose-700"
    return "bg-slate-100 text-slate-700"
}

export function PaymentManagementBoard({ payments, title, subtitle, currentRole, currentUserId }: PaymentManagementBoardProps) {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [activePayment, setActivePayment] = useState<PaymentListItem | null>(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [isPending, startTransition] = useTransition()

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const haystack = [
                payment.company.name,
                payment.clientUser.name || "",
                payment.clientUser.email || "",
                payment.collector?.name || "",
                payment.planCode || "",
                payment.method,
                payment.status,
            ].join(" ").toLowerCase()

            return haystack.includes(query.toLowerCase())
        })
    }, [payments, query])

    const stats = useMemo(() => ({
        total: payments.length,
        pending: payments.filter((payment) => payment.status === "AWAITING_VALIDATION").length,
        paid: payments.filter((payment) => payment.status === "PAID").length,
        stripe: payments.filter((payment) => payment.method === "STRIPE").length,
    }), [payments])

    const canValidate = (payment: PaymentListItem) => {
        return false // Désactivation du flux de validation cash
    }

    function handleApprove(paymentId: string) {
        startTransition(async () => {
            const result = await validateCashPayment(paymentId)
            if (result.error) {
                alert(result.error)
                return
            }
            router.refresh()
        })
    }

    function handleReject() {
        if (!activePayment) return
        startTransition(async () => {
            const result = await rejectCashPayment(activePayment.id, rejectionReason)
            if (result.error) {
                alert(result.error)
                return
            }
            setActivePayment(null)
            setRejectionReason("")
            router.refresh()
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Total opérations</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Paiements confirmés</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-600">{stats.paid}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Réglés via Stripe</p>
                    <p className="mt-2 text-3xl font-semibold text-blue-600">{stats.stripe}</p>
                </div>
            </div>

            <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un client, une entreprise, un statut..."
                    className="bg-white pl-10"
                />
            </div>

            <div className="space-y-4">
                {filteredPayments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                        Aucune opération ne correspond à votre recherche.
                    </div>
                ) : (
                    filteredPayments.map((payment) => (
                        <div key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(payment.status)}`}>
                                            {statusLabel(payment.status)}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {payment.method === "CASH" ? <Banknote className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
                                            {payment.method}
                                        </span>
                                        {payment.receiptNumber && (
                                            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                                                Ticket {payment.receiptNumber}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">{payment.company.name}</h2>
                                        <p className="text-sm text-slate-500">
                                            {payment.clientUser.name || payment.clientUser.email} • Plan {payment.planCode || "ICPP"}
                                        </p>
                                    </div>

                                    <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Montant</p>
                                            <p className="mt-1 font-medium text-slate-900">{formatAmount(payment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Collecteur</p>
                                            <p className="mt-1 font-medium text-slate-900">{payment.collector?.name || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Date déclarée</p>
                                            <p className="mt-1 font-medium text-slate-900">
                                                {new Date(payment.createdAt).toLocaleString("fr-FR")}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Paiement effectif</p>
                                            <p className="mt-1 font-medium text-slate-900">
                                                {payment.paidAt ? new Date(payment.paidAt).toLocaleString("fr-FR") : payment.scheduledFor ? new Date(payment.scheduledFor).toLocaleString("fr-FR") : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {payment.notes && (
                                        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                                            {payment.notes}
                                        </div>
                                    )}

                                    {payment.rejectionReason && (
                                        <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
                                            Motif de refus : {payment.rejectionReason}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 xl:max-w-[280px] xl:justify-end">
                                    {payment.receiptNumber && (
                                        <Button variant="outline" asChild>
                                            <Link href={`/api/payments/${payment.id}/receipt`} target="_blank">
                                                <Download className="mr-2 h-4 w-4" />
                                                Ticket
                                            </Link>
                                        </Button>
                                    )}

                                    {canValidate(payment) && (
                                        <>
                                            <Button
                                                onClick={() => handleApprove(payment.id)}
                                                disabled={isPending}
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                            >
                                                <BadgeCheck className="mr-2 h-4 w-4" />
                                                Valider
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setActivePayment(payment)}
                                                disabled={isPending}
                                                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                                            >
                                                <ShieldAlert className="mr-2 h-4 w-4" />
                                                Refuser
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={!!activePayment} onOpenChange={(open) => !open && setActivePayment(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refuser le paiement cash</DialogTitle>
                        <DialogDescription>
                            Expliquez au client ce qui doit être corrigé avant validation.
                        </DialogDescription>
                    </DialogHeader>

                    <Textarea
                        value={rejectionReason}
                        onChange={(event) => setRejectionReason(event.target.value)}
                        placeholder="Ex: montant déclaré différent du montant encaissé, date incohérente, justificatif manquant..."
                        className="min-h-[120px]"
                    />

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActivePayment(null)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isPending}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Refuser le paiement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}