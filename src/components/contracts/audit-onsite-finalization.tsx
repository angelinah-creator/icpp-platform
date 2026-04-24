"use client"

import { useEffect, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import {
    confirmOnsiteCashPayment,
    createOnsiteCheckoutSession,
    finalizeOnsiteStripePayment,
    generateContractForOnsiteAudit,
    saveOnsiteContractSignature,
    validateOnsiteContractSignature,
} from "@/server/actions/contracts"
import { SignaturePad } from "@/components/contracts/signature-pad"

type FinalizationData = {
    auditId: string
    status: string
    companyName: string
    clientName: string
    clientEmail: string | null
    assignedPlanCode: string | null
    assignedPlanName: string | null
    assignedAmount: number | null
    paymentCompleted: boolean
    latestPayment: {
        id: string
        method: string
        status: string
        amount: number
        paidAt: Date | null
        createdAt: Date
    } | null
    contract: {
        id: string
        numeroContrat: string
        signedAt: Date | null
        signatureDraft: string | null
    } | null
}

function formatAmount(amount: number | null) {
    if (!amount) return "-"
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount / 100)
}

export function AuditOnsiteFinalization({
    data,
    returnPath,
}: {
    data: FinalizationData
    returnPath: string
}) {
    const searchParams = useSearchParams()
    const [message, setMessage] = useState<string | null>(null)
    const [signerName, setSignerName] = useState<string>(data.clientName || "")
    const [signature, setSignature] = useState<string | null>(data.contract?.signatureDraft || null)
    const [isPending, startTransition] = useTransition()

    const sessionId = searchParams.get("session_id")
    const paid = searchParams.get("paid")

    useEffect(() => {
        if (!sessionId || paid !== "1") return

        startTransition(async () => {
            const result = await finalizeOnsiteStripePayment(data.auditId, sessionId)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Paiement Stripe confirme. Vous pouvez maintenant generer le contrat.")
            window.location.replace(returnPath)
        })
    }, [sessionId, paid, data.auditId, returnPath])

    function handleStripe() {
        setMessage(null)
        startTransition(async () => {
            const result = await createOnsiteCheckoutSession(data.auditId, returnPath)
            if (result.error) {
                setMessage(result.error)
                return
            }
            if (!result.url) {
                setMessage("Impossible d'ouvrir la session de paiement Stripe.")
                return
            }
            window.location.href = result.url
        })
    }

    function handleCash() {
        setMessage(null)
        startTransition(async () => {
            const result = await confirmOnsiteCashPayment(data.auditId)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Paiement cash confirme. Le contrat peut etre genere.")
            window.location.reload()
        })
    }

    function handleGenerateContract() {
        setMessage(null)
        startTransition(async () => {
            const result = await generateContractForOnsiteAudit(data.auditId)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Contrat genere et pret pour signature.")
            window.location.reload()
        })
    }

    function handleSaveSignature() {
        if (!data.contract?.id) {
            setMessage("Generez d'abord le contrat.")
            return
        }
        if (!signature) {
            setMessage("Merci de recueillir la signature du client.")
            return
        }

        setMessage(null)
        startTransition(async () => {
            const result = await saveOnsiteContractSignature(data.contract!.id, signature, signerName)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Signature enregistree. Vous pouvez valider le contrat.")
        })
    }

    function handleValidateContract() {
        if (!data.contract?.id) {
            setMessage("Contrat introuvable")
            return
        }

        setMessage(null)
        startTransition(async () => {
            const result = await validateOnsiteContractSignature(data.contract!.id)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Contrat valide. Notifications envoyees en temps reel.")
            window.location.reload()
        })
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Finalisation sur place de l'audit</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Flow guide: paiement client immediat, generation contrat, signature, validation.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Entreprise</p>
                        <p className="mt-1 font-medium text-slate-900">{data.companyName}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Client present</p>
                        <p className="mt-1 font-medium text-slate-900">{data.clientName}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Offre assignee</p>
                        <p className="mt-1 font-medium text-slate-900">{data.assignedPlanName || data.assignedPlanCode || "Non definie"}</p>
                        <p className="text-xs text-slate-500">{formatAmount(data.assignedAmount)}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">1. Paiement immediat sur place</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Passez l'appareil au client pour regler la carte, ou confirmez un paiement cash sur place.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleStripe}
                        disabled={isPending || !data.assignedPlanCode || data.status !== "TERMINE"}
                        className="rounded-xl bg-[#2048BF] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3ca2] disabled:opacity-50"
                    >
                        Proceder au paiement (Stripe)
                    </button>
                    <button
                        type="button"
                        onClick={handleCash}
                        disabled={isPending || !data.assignedPlanCode || data.status !== "TERMINE"}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Confirmer paiement cash
                    </button>
                </div>

                {data.latestPayment && (
                    <p className="mt-3 text-sm text-slate-600">
                        Dernier paiement: {data.latestPayment.method} - {data.latestPayment.status} - {formatAmount(data.latestPayment.amount)}
                    </p>
                )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">2. Generation du contrat</h2>
                <p className="mt-1 text-sm text-slate-500">Apres paiement confirme, generer le contrat pret a signer.</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleGenerateContract}
                        disabled={isPending || !data.paymentCompleted}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Generer contrat pret pour signature
                    </button>
                    {data.contract?.id && (
                        <a
                            href={`/api/contracts/${data.contract.id}/download`}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Telecharger contrat
                        </a>
                    )}
                </div>
            </section>

            {data.contract?.id && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">3. Signature du client et validation</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Le client signe immediatement sur place. Ensuite validez pour notifier en temps reel l'auditeur/commercial, l'admin et le client.
                    </p>

                    <div className="mt-4 max-w-md">
                        <label htmlFor="signerName" className="mb-1 block text-sm font-medium text-slate-700">
                            Nom du signataire client
                        </label>
                        <input
                            id="signerName"
                            value={signerName}
                            onChange={(e) => setSignerName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="mt-4">
                        <SignaturePad value={signature} onChange={setSignature} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={handleSaveSignature}
                            disabled={isPending}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Enregistrer la signature
                        </button>
                        <button
                            type="button"
                            onClick={handleValidateContract}
                            disabled={isPending}
                            className="rounded-xl bg-[#0f172a] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e293b] disabled:opacity-50"
                        >
                            Valider le contrat signe
                        </button>
                    </div>

                    {data.contract.signedAt && (
                        <p className="mt-3 text-sm font-medium text-emerald-700">
                            Contrat deja signe le {new Date(data.contract.signedAt).toLocaleDateString("fr-FR")}
                        </p>
                    )}
                </section>
            )}

            {message && (
                <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {message}
                </section>
            )}
        </div>
    )
}
