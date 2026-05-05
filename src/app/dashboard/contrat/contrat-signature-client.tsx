"use client"

import { useMemo, useState, useTransition } from "react"
import { saveClientContractSignature, validateClientContract } from "@/server/actions/contracts"
import { SignaturePad } from "@/components/contracts/signature-pad"

interface ContractData {
    id: string
    numeroContrat: string
    status: string
    cgvVersion: string
    cgvContenu: string
    dateDebut: string
    signedAt: string | null
    signatureDraft: string | null
    companyName: string
    planName: string
}

export function ContratSignatureClient({ contract }: { contract: ContractData }) {
    const [signature, setSignature] = useState<string | null>(contract.signatureDraft)
    const [message, setMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [cgvOpen, setCgvOpen] = useState(false)

    const signed = useMemo(() => !!contract.signedAt, [contract.signedAt])

    function saveDraft() {
        if (!signature) {
            setMessage("Veuillez d'abord signer dans la zone de signature.")
            return
        }

        setMessage(null)
        startTransition(async () => {
            const result = await saveClientContractSignature(contract.id, signature)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Signature enregistree. Vous pouvez maintenant valider le contrat.")
        })
    }

    function validateContract() {
        setMessage(null)
        startTransition(async () => {
            const result = await validateClientContract(contract.id)
            if (result.error) {
                setMessage(result.error)
                return
            }
            setMessage("Contrat valide avec succes.")
            window.location.reload()
        })
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Contrat client</h1>
                        <p className="mt-1 text-sm text-slate-500">Numero {contract.numeroContrat}</p>
                    </div>
                    <a
                        href={`/api/contracts/${contract.id}/download`}
                        className="rounded-xl bg-[#2048BF] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a3ca2]"
                    >
                        Telecharger le contrat
                    </a>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Entreprise</p>
                        <p className="mt-1 font-medium text-slate-900">{contract.companyName}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Plan</p>
                        <p className="mt-1 font-medium text-slate-900">{contract.planName}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Statut</p>
                        <p className="mt-1 font-medium text-slate-900">{signed ? "Signe" : "En attente de signature"}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Conditions contractuelles (CGV v{contract.cgvVersion})</h2>
                    <button
                        type="button"
                        onClick={() => setCgvOpen(!cgvOpen)}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        {cgvOpen ? "Masquer" : "Lire les CGV"}
                        <span className="text-xs">{cgvOpen ? "▲" : "▼"}</span>
                    </button>
                </div>
                {cgvOpen && (
                    <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
                        {contract.cgvContenu}
                    </div>
                )}
                {!cgvOpen && (
                    <p className="mt-2 text-sm text-slate-500 italic">
                        Cliquez sur &quot;Lire les CGV&quot; pour consulter les conditions contractuelles complètes.
                    </p>
                )}
            </section>

            {!signed && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Signature numerique</h2>
                    <p className="mt-1 text-sm text-slate-500">Signez au stylet, a la souris ou au doigt comme dans un mode crayon.</p>

                    <div className="mt-4">
                        <SignaturePad value={signature} onChange={setSignature} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={saveDraft}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Enregistrer la signature
                        </button>
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={validateContract}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            Valider le contrat
                        </button>
                    </div>

                    {message && (
                        <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            {message}
                        </p>
                    )}
                </section>
            )}

            {signed && (
                <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
                    Contrat signe le {new Date(contract.signedAt || "").toLocaleDateString("fr-FR")}. Il est maintenant visible dans les espaces Admin et Auditeur/Commercial.
                </section>
            )}
        </div>
    )
}
