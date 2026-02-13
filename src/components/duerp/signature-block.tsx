"use client"

import { useState } from "react"
import { CheckCircle2, Download, FileCheck, Loader2, Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signDuerp } from "@/server/actions/duerp"
import { useRouter } from "next/navigation"

interface DuerpSignatureBlockProps {
    duerpId: string
    isSigned: boolean
    signatureInfo?: {
        signedAt: string
        signerName: string
        signerEmail: string
    }
    pdfUrl?: string | null
}

export function DuerpSignatureBlock({
    duerpId,
    isSigned,
    signatureInfo,
    pdfUrl,
}: DuerpSignatureBlockProps) {
    const [certified, setCertified] = useState(false)
    const [signing, setSigning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    async function handleSign() {
        if (!certified) {
            setError("Veuillez d'abord certifier l'exactitude des informations")
            return
        }

        setSigning(true)
        setError(null)

        try {
            const result = await signDuerp(duerpId)

            if ("error" in result) {
                setError(result.error as string)
            } else {
                setSuccess(true)
                router.refresh()
            }
        } catch {
            setError("Une erreur est survenue lors de la signature")
        } finally {
            setSigning(false)
        }
    }

    if (isSigned && signatureInfo) {
        return (
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-green-800">
                            Document signé électroniquement
                        </h3>
                        <p className="text-sm text-green-600">
                            Version verrouillée
                        </p>
                    </div>
                    <Lock className="h-4 w-4 text-green-500 ml-auto" />
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-green-700">Signé par</span>
                        <span className="font-medium text-green-900">{signatureInfo.signerName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-green-700">Email</span>
                        <span className="font-medium text-green-900">{signatureInfo.signerEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-green-700">Date de signature</span>
                        <span className="font-medium text-green-900">
                            {new Date(signatureInfo.signedAt).toLocaleString("fr-FR")}
                        </span>
                    </div>
                </div>

                {pdfUrl && (
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg bg-green-600 hover:bg-green-700 text-white py-2.5 text-sm font-medium transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Télécharger le PDF signé
                    </a>
                )}
            </div>
        )
    }

    if (success) {
        return (
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                    Document signé avec succès
                </h3>
                <p className="text-sm text-green-600 mb-4">
                    Le DUERP a été verrouillé et horodaté.
                </p>
                <a
                    href={`/api/duerp/${duerpId}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Télécharger le PDF signé
                </a>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        Signature du DUERP
                    </h3>
                    <p className="text-sm text-slate-500">
                        Validez et signez électroniquement ce document
                    </p>
                </div>
            </div>

            {/* Aperçu PDF */}
            <a
                href={`/api/duerp/${duerpId}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-3 text-sm text-slate-700 font-medium mb-5 transition-colors"
            >
                <Download className="h-4 w-4 text-slate-500" />
                Prévisualiser / Télécharger le PDF avant signature
            </a>

            {/* Case à cocher certification */}
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all mb-4">
                <input
                    type="checkbox"
                    checked={certified}
                    onChange={(e) => {
                        setCertified(e.target.checked)
                        setError(null)
                    }}
                    className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-medium">Je certifie l&apos;exactitude des informations</span> contenues dans ce Document Unique d&apos;Évaluation des Risques Professionnels et m&apos;engage à mettre en œuvre les mesures de prévention identifiées.
                </span>
            </label>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            <Button
                onClick={handleSign}
                disabled={!certified || signing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 text-sm font-medium disabled:opacity-50"
            >
                {signing ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signature en cours...
                    </>
                ) : (
                    <>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Signer le document
                    </>
                )}
            </Button>

            <p className="text-xs text-slate-400 mt-3 text-center">
                La signature électronique horodate le document et verrouille cette version.
            </p>
        </div>
    )
}
