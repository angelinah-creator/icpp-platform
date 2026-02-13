"use client"

import Link from "next/link"
import { ArrowLeft, Building2, Calendar, Download, FileText, Shield, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DuerpSignatureBlock } from "@/components/duerp/signature-block"

interface Evaluation {
    id: string
    risqueNom: string
    categorieNom: string
    uniteTravail: string
    frequence: number
    gravite: number
    niveauRisque: number
    mesuresAppliquees: string[]
    observations: string | null
}

interface DuerpData {
    id: string
    version: number
    status: string
    createdAt: string
    updatedAt: string
    nextReviewDate: string | null
    pdfUrl: string | null
    company: {
        name: string
        siret: string | null
        address: string
        city: string
        postalCode: string | null
        employeeCount: number
        metier: string | null
        contactName: string | null
        contactRole: string | null
        auditorName: string | null
    }
    evaluations: Evaluation[]
    signature: {
        signedAt: string
        signerName: string
        signerEmail: string
    } | null
}

function getRiskBadge(niveau: number) {
    if (niveau >= 16)
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Critique ({niveau})</Badge>
    if (niveau >= 8)
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Modéré ({niveau})</Badge>
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Faible ({niveau})</Badge>
}

function getStatusBadge(status: string, isSigned: boolean) {
    if (isSigned) return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Signé</Badge>
    if (status === "DRAFT") return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Brouillon</Badge>
    if (status === "ACTIVE") return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Actif</Badge>
    return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">{status}</Badge>
}

export function DuerpDetailClient({ duerp }: { duerp: DuerpData }) {
    const totalRisques = duerp.evaluations.length
    const critiques = duerp.evaluations.filter((e) => e.niveauRisque >= 16).length
    const moderes = duerp.evaluations.filter((e) => e.niveauRisque >= 8 && e.niveauRisque < 16).length

    const grouped: Record<string, Evaluation[]> = {}
    for (const ev of duerp.evaluations) {
        const key = ev.uniteTravail || "Non classé"
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(ev)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <div className="flex items-center gap-4 mb-3">
                    <Link href="/auditeur/duerp" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold text-slate-900">
                                DUERP — {duerp.company.name}
                            </h1>
                            {getStatusBadge(duerp.status, !!duerp.signature)}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Version {duerp.version} — Créé le{" "}
                            {new Date(duerp.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                    </div>
                    <a
                        href={`/api/duerp/${duerp.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Télécharger PDF
                        </Button>
                    </a>
                </div>
            </div>

            <div className="p-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Statistiques */}
                        <div className="grid grid-cols-4 gap-3">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                                <p className="text-2xl font-bold text-slate-900">{totalRisques}</p>
                                <p className="text-xs text-slate-500">Risques</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <AlertTriangle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                                <p className="text-2xl font-bold text-red-600">{critiques}</p>
                                <p className="text-xs text-slate-500">Critiques</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <Shield className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                                <p className="text-2xl font-bold text-amber-600">{moderes}</p>
                                <p className="text-xs text-slate-500">Modérés</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                                <Users className="h-5 w-5 text-slate-600 mx-auto mb-1" />
                                <p className="text-2xl font-bold text-slate-900">{Object.keys(grouped).length}</p>
                                <p className="text-xs text-slate-500">UT</p>
                            </div>
                        </div>

                        {/* Tableau des risques par UT */}
                        {Object.entries(grouped).map(([ut, evals]) => (
                            <div key={ut} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-900">{ut}</h3>
                                    <Badge variant="outline">{evals.length} risque{evals.length > 1 ? "s" : ""}</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Catégorie</th>
                                                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Risque</th>
                                                <th className="text-center px-3 py-2 text-xs font-medium text-slate-500 uppercase">F</th>
                                                <th className="text-center px-3 py-2 text-xs font-medium text-slate-500 uppercase">G</th>
                                                <th className="text-center px-3 py-2 text-xs font-medium text-slate-500 uppercase">Niveau</th>
                                                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Mesures</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {evals
                                                .sort((a, b) => b.niveauRisque - a.niveauRisque)
                                                .map((ev) => (
                                                    <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-slate-500">{ev.categorieNom}</td>
                                                        <td className="px-4 py-3 font-medium text-slate-900">{ev.risqueNom}</td>
                                                        <td className="px-3 py-3 text-center">{ev.frequence}</td>
                                                        <td className="px-3 py-3 text-center">{ev.gravite}</td>
                                                        <td className="px-3 py-3 text-center">{getRiskBadge(ev.niveauRisque)}</td>
                                                        <td className="px-4 py-3 text-slate-600">
                                                            {ev.mesuresAppliquees.length > 0
                                                                ? ev.mesuresAppliquees.join(", ")
                                                                : <span className="text-slate-400 italic">Aucune</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                        {totalRisques === 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="font-medium text-slate-900 mb-1">Aucune évaluation de risque</p>
                                <p className="text-sm text-slate-500">
                                    Les évaluations de risques apparaîtront ici une fois ajoutées.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Colonne latérale */}
                    <div className="space-y-6">
                        {/* Infos entreprise */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                Entreprise
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-slate-500">Raison sociale</p>
                                    <p className="font-medium text-slate-900">{duerp.company.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">SIRET</p>
                                    <p className="font-medium text-slate-900">{duerp.company.siret || "Non renseigné"}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Adresse</p>
                                    <p className="font-medium text-slate-900">
                                        {duerp.company.address}, {duerp.company.postalCode} {duerp.company.city}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Effectif</p>
                                    <p className="font-medium text-slate-900">{duerp.company.employeeCount} salarié{duerp.company.employeeCount > 1 ? "s" : ""}</p>
                                </div>
                                {duerp.company.metier && (
                                    <div>
                                        <p className="text-slate-500">Secteur</p>
                                        <p className="font-medium text-slate-900">{duerp.company.metier}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                Échéances
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Création</span>
                                    <span className="font-medium">{new Date(duerp.createdAt).toLocaleDateString("fr-FR")}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Mise à jour</span>
                                    <span className="font-medium">{new Date(duerp.updatedAt).toLocaleDateString("fr-FR")}</span>
                                </div>
                                {duerp.nextReviewDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Prochaine révision</span>
                                        <span className="font-medium">{new Date(duerp.nextReviewDate).toLocaleDateString("fr-FR")}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bloc Signature */}
                        <DuerpSignatureBlock
                            duerpId={duerp.id}
                            isSigned={!!duerp.signature}
                            signatureInfo={duerp.signature || undefined}
                            pdfUrl={duerp.pdfUrl}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
