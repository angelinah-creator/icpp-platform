"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    CreditCard,
    Download,
    ShieldCheck,
    Sparkles,
    UserRoundCheck,
    Wallet,
} from "lucide-react"
import { createCheckoutSession } from "@/server/actions/stripe"
import { type PaymentListItem } from "@/server/actions/payments"
import { logoutAction } from "@/server/actions/auth"
import { getSubscriptionStatusLabel } from "@/lib/subscription-access"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PlanItem {
    code: string
    nom: string
    description: string
    prixMensuel: number
    fraisSetup: number
    fonctionnalites: string[]
}

interface OnboardingData {
    user: {
        id: string
        name: string | null
        email: string | null
    }
    company: {
        id: string
        name: string
        metier: string
        setupFeePaid: boolean
    }
    subscription: {
        planCode: string
        planName: string
        status: string
        customPrice: number | null
    } | null
    recommendedPlanCode: string | null
    recommendedAmount: number | null
    assignedPlan: PlanItem | null
    hasAccess: boolean
    collectors: unknown[]
    plans: PlanItem[]
    recentPayments: PaymentListItem[]
}

interface SubscriptionOnboardingClientProps {
    data: OnboardingData
    flashMessage: { type: "success" | "error" | "info"; text: string } | null
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount / 100)
}

function statusBadgeClass(status: string) {
    if (status === "PAID") return "bg-emerald-100 text-emerald-700"
    if (status === "AWAITING_VALIDATION") return "bg-amber-100 text-amber-700"
    if (status === "REJECTED") return "bg-rose-100 text-rose-700"
    return "bg-slate-100 text-slate-700"
}

export function SubscriptionOnboardingClient({ data, flashMessage }: SubscriptionOnboardingClientProps) {
    const router = useRouter()
    const [selectedPlanCode] = useState(data.assignedPlan?.code || data.recommendedPlanCode || "")
    const [message, setMessage] = useState(flashMessage)
    const [isPending, startTransition] = useTransition()
    const [cgvAccepted, setCgvAccepted] = useState(false)

    const selectedPlan = useMemo(
        () => data.assignedPlan || data.plans.find((plan) => plan.code === selectedPlanCode) || data.plans[0],
        [data.assignedPlan, data.plans, selectedPlanCode]
    )

    async function handleStripeCheckout() {
        if (!selectedPlanCode) {
            setMessage({ type: "error", text: "Aucun abonnement n'a encore été assigné par votre conseiller ICPP." })
            return
        }
        setMessage(null)
        startTransition(async () => {
            const result = await createCheckoutSession(selectedPlanCode)
            if (typeof result === "object") {
                setMessage({ type: "error", text: result.error })
                return
            }
            window.location.href = result
        })
    }

    return (
        <div className="min-h-screen overflow-hidden bg-[#06122f] text-white">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(103,156,255,0.26),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(31,205,255,0.18),_transparent_24%),linear-gradient(145deg,#06122f_0%,#0c1d46_45%,#071228_100%)]" />
            <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#2b56df]/25 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
                {/* Header */}
                <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-[26px] bg-white/10 p-3 backdrop-blur-xl ring-1 ring-white/10">
                            <Image src="/logo.png" alt="ICPP" width={48} height={48} className="h-12 w-auto object-contain" priority />
                        </div>
                        <div>
                            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Activation client</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white lg:text-5xl">
                                Activez votre espace {data.company.name}
                            </h1>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Statut actuel</p>
                        <p className="mt-2 text-lg font-medium text-white">
                            {getSubscriptionStatusLabel(data.subscription?.status || null)}
                        </p>
                        <p className="text-sm text-slate-300">
                            Votre tableau de bord sera ouvert automatiquement dès validation du paiement.
                        </p>
                        <form action={logoutAction} className="mt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                            >
                                Retour à la connexion
                            </button>
                        </form>
                    </div>
                </header>

                {/* Main content */}
                <section className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
                    {/* Left — Plan info */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden border-white/10 bg-white/8 text-white shadow-2xl backdrop-blur-xl">
                            <CardContent className="p-0">
                                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                                    <div className="space-y-6 p-8">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                                            <Sparkles className="h-4 w-4" />
                                            Expérience d'activation guidée
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-semibold text-white lg:text-4xl">
                                                Une seule étape avant d'ouvrir votre espace client.
                                            </h2>
                                            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200/90">
                                                Votre formule est assignée par votre conseiller ICPP. Réglez en ligne par carte bancaire via Stripe. Votre accès se débloque automatiquement dès validation.
                                            </p>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div className="rounded-2xl border border-white/10 bg-[#0d1e4c] p-4">
                                                <Building2 className="h-6 w-6 text-cyan-300" />
                                                <p className="mt-3 text-sm text-slate-300">Entreprise</p>
                                                <p className="text-lg font-semibold text-white">{data.company.name}</p>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-[#0d1e4c] p-4">
                                                <ShieldCheck className="h-6 w-6 text-cyan-300" />
                                                <p className="mt-3 text-sm text-slate-300">Activité</p>
                                                <p className="text-lg font-semibold text-white">{data.company.metier}</p>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-[#0d1e4c] p-4">
                                                <UserRoundCheck className="h-6 w-6 text-cyan-300" />
                                                <p className="mt-3 text-sm text-slate-300">Compte</p>
                                                <p className="text-lg font-semibold text-white">{data.user.name || data.user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between border-l border-white/10 bg-[linear-gradient(180deg,rgba(103,156,255,0.16),rgba(31,205,255,0.12))] p-8">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-slate-200/70">Abonnement assigné</p>
                                            <p className="mt-3 text-3xl font-semibold text-white">
                                                {selectedPlan?.nom || "Formule ICPP"}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-slate-100/85">
                                                {selectedPlan?.description || "Activez votre accompagnement conformité complet."}
                                            </p>
                                        </div>
                                        <div className="rounded-[28px] border border-white/10 bg-[#06122f]/65 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
                                            <p className="text-sm text-slate-300">Mensualité</p>
                                            <p className="mt-2 text-4xl font-semibold text-white">
                                                {selectedPlan ? formatAmount(data.recommendedAmount || selectedPlan.prixMensuel) : "-"}
                                            </p>
                                            <p className="mt-2 text-sm text-slate-300">mise en place incluse et activation immédiate après validation</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Flash message */}
                        {message && (
                            <div className={`rounded-2xl border px-5 py-4 text-sm backdrop-blur-xl ${
                                message.type === "success"
                                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                                    : message.type === "error"
                                    ? "border-rose-400/25 bg-rose-400/10 text-rose-100"
                                    : "border-cyan-400/25 bg-cyan-400/10 text-cyan-100"
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Plan features */}
                        {selectedPlan ? (
                            <div className="rounded-[28px] border border-cyan-300 bg-white/14 p-5 text-left shadow-[0_24px_60px_rgba(21,147,255,0.25)]">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xl font-semibold text-white">{selectedPlan.nom}</p>
                                        <p className="mt-1 text-sm text-slate-300">{selectedPlan.description}</p>
                                    </div>
                                </div>
                                <p className="mt-5 text-3xl font-semibold text-white">
                                    {formatAmount(data.recommendedAmount || selectedPlan.prixMensuel)}
                                </p>
                                <div className="mt-4 space-y-2 text-sm text-slate-200">
                                    {selectedPlan.fonctionnalites.slice(0, 4).map((feature) => (
                                        <div key={feature} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
                                Aucun abonnement n'a encore été assigné par votre conseiller ICPP. Merci de contacter votre auditeur ou commercial.
                            </div>
                        )}
                    </div>

                    {/* Right — Payment + History */}
                    <div className="space-y-6">
                        {/* Stripe Payment Card */}
                        <Card className="border-white/10 bg-white/8 text-white shadow-2xl backdrop-blur-xl">
                            <CardContent className="space-y-6 p-6">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Paiement sécurisé</p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">Activez votre abonnement via Stripe</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-200/85">
                                        Paiement carte bancaire sécurisé, validation automatique et facture disponible dès confirmation.
                                    </p>
                                </div>

                                {(() => {
                                    const SETUP_FEE = 4900 // 49,00 €
                                    const showSetupFee = !data.company.setupFeePaid
                                    const baseAmount = data.recommendedAmount || selectedPlan?.prixMensuel || 0
                                    const totalFirstPayment = baseAmount + (showSetupFee ? SETUP_FEE : 0)

                                    return (
                                        <div className="rounded-3xl border border-white/10 bg-[#071736] p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm text-slate-300">Formule sélectionnée</p>
                                                    <p className="mt-2 text-xl font-semibold text-white">{selectedPlan?.nom || "Non assignée"}</p>
                                                </div>
                                                <Wallet className="h-6 w-6 text-cyan-300" />
                                            </div>
                                            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                                                <div className="flex items-center justify-between text-sm text-slate-300">
                                                    <span>Abonnement mensuel</span>
                                                    <span>{formatAmount(baseAmount)}</span>
                                                </div>
                                                {showSetupFee && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-amber-300">Frais de mise en place <span className="text-xs">(unique)</span></span>
                                                        <span className="font-medium text-amber-300">{formatAmount(SETUP_FEE)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                                                    <span className="font-semibold text-white">Total {showSetupFee ? "premier paiement" : "mensuel"}</span>
                                                    <span className="text-2xl font-bold text-white">{formatAmount(totalFirstPayment)}</span>
                                                </div>
                                                {showSetupFee && (
                                                    <p className="text-xs text-slate-400">A partir du 2e paiement : {formatAmount(baseAmount)}/mois</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })()}

                                {/* CGV Acceptance */}
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                    <label className="flex cursor-pointer items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="cgv-accept"
                                            checked={cgvAccepted}
                                            onChange={(e) => setCgvAccepted(e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded accent-cyan-400 cursor-pointer"
                                        />
                                        <span className="text-sm text-slate-300 leading-relaxed">
                                            J&apos;accepte les{" "}
                                            <a
                                                href="/cgv"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-300 underline hover:text-cyan-100"
                                            >
                                                Conditions Générales de Vente
                                            </a>{" "}
                                            et la{" "}
                                            <a
                                                href="/politique-confidentialite"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-300 underline hover:text-cyan-100"
                                            >
                                                Politique de Confidentialité
                                            </a>{" "}
                                            d&apos;ICPP Conformité.
                                        </span>
                                    </label>
                                </div>

                                <Button
                                    onClick={handleStripeCheckout}
                                    disabled={isPending || !selectedPlanCode || !cgvAccepted}
                                    className="h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#14b8ff_0%,#2d53e6_100%)] text-base font-semibold text-white hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {isPending ? "Redirection en cours..." : "Régler via Stripe"}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    <span>Paiement sécurisé par Stripe · SSL · PCI DSS compliant</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment history */}
                        <Card className="border-white/10 bg-white/8 text-white backdrop-blur-xl">
                            <CardContent className="space-y-4 p-6">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-cyan-300" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Historique de vos paiements</h3>
                                        <p className="text-sm text-slate-300">Suivi de vos paiements Stripe.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {data.recentPayments.filter(p => p.method === "STRIPE").length === 0 ? (
                                        <div className="rounded-2xl border border-dashed border-white/15 bg-[#071736] p-5 text-sm text-slate-300">
                                            Aucun paiement n'a encore été enregistré pour votre entreprise.
                                        </div>
                                    ) : (
                                        data.recentPayments
                                            .filter((p) => p.method === "STRIPE")
                                            .map((payment) => (
                                                <div key={payment.id} className="rounded-2xl border border-white/10 bg-[#071736] p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(payment.status)}`}>
                                                                    {payment.status === "PAID" ? "Payé" : payment.status}
                                                                </span>
                                                                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">STRIPE</span>
                                                            </div>
                                                            <p className="mt-3 text-lg font-semibold text-white">
                                                                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(payment.amount / 100)}
                                                            </p>
                                                            <p className="text-sm text-slate-300">Plan {payment.planCode || "ICPP"}</p>
                                                        </div>
                                                        <div className="text-right text-xs text-slate-400">
                                                            <p>{new Date(payment.createdAt).toLocaleDateString("fr-FR")}</p>
                                                            {payment.receiptNumber && (
                                                                <Link
                                                                    href={`/api/payments/${payment.id}/receipt`}
                                                                    target="_blank"
                                                                    className="mt-3 inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
                                                                >
                                                                    <Download className="h-3.5 w-3.5" />
                                                                    Ticket
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}