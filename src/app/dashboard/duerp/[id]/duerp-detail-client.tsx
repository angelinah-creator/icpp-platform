"use client"

import Link from "next/link"
import { ArrowLeft, Download, FileText, Shield, Calendar, MapPin, Clock, AlertTriangle, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface RisqueItem {
    id: string
    risqueNom: string
    risqueDescription: string
    categorieCode: string
    categorieNom: string
    uniteTravail: string
    frequence: number
    gravite: number
    niveauRisque: number
    actionRecommandee: string | null
    actionCorrective: string | null
    delai: string | null
    responsable: string | null
    observations: string | null
}

interface DuerpData {
    id: string
    version: number
    status: string
    signedAt: string | null
    signedByName: string | null
    createdAt: string
    nextReviewDate: string | null
    companyName: string
    companyAddress: string
    companyCity: string
    risques: RisqueItem[]
}

// ─── Seuils de criticité (captures fournies) ─────────────────────────────────
// 0-9 : Vert  |  10-19 : Orange  |  20+ : Ambre/Or
function getScoreStyle(score: number): { bg: string; text: string } {
    if (score >= 20) return { bg: "bg-amber-400", text: "text-white" }
    if (score >= 10) return { bg: "bg-orange-400", text: "text-white" }
    return { bg: "bg-emerald-500", text: "text-white" }
}

function ScoreBadge({ score }: { score: number }) {
    const { bg, text } = getScoreStyle(score)
    return (
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${bg} ${text}`}>
            {score}
        </span>
    )
}

// Ordre d'affichage des catégories
const CATEGORIE_ORDER = [
    "PHYSIQUE",
    "CHIMIQUE",
    "BIOLOGIQUE",
    "PSYCHOSOCIAL",
    "RPS",
    "ORGANISATIONNEL",
    "INCENDIE",
    "ELECTRIQUE",
]

function getCategorieOrder(code: string): number {
    const idx = CATEGORIE_ORDER.indexOf(code.toUpperCase())
    return idx === -1 ? 99 : idx
}

export function DuerpDetailClient({ duerp }: { duerp: DuerpData }) {
    // Groupement par catégorie (comme les maquettes) ─────────────────────────
    const groupedByCategorie: Record<string, { nom: string; risques: RisqueItem[] }> = {}
    for (const r of duerp.risques) {
        const key = r.categorieCode
        if (!groupedByCategorie[key]) {
            groupedByCategorie[key] = { nom: r.categorieNom, risques: [] }
        }
        groupedByCategorie[key].risques.push(r)
    }

    // Trié selon l'ordre standard
    const sortedCategories = Object.entries(groupedByCategorie).sort(
        ([a], [b]) => getCategorieOrder(a) - getCategorieOrder(b)
    )

    // Plan d'action : tous les risques, triés par score décroissant
    const planAction = [...duerp.risques].sort((a, b) => b.niveauRisque - a.niveauRisque)

    // Stats
    const critiques = duerp.risques.filter(r => r.niveauRisque >= 20).length
    const eleves = duerp.risques.filter(r => r.niveauRisque >= 10 && r.niveauRisque < 20).length
    const faibles = duerp.risques.filter(r => r.niveauRisque < 10).length

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── En-tête ────────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/duerp">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold text-slate-900">
                                    DUERP v{duerp.version}.0
                                </h1>
                                {duerp.signedAt ? (
                                    <Badge className="bg-green-100 text-green-700">Signé</Badge>
                                ) : (
                                    <Badge className="bg-blue-100 text-blue-700">{duerp.status}</Badge>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm mt-0.5">{duerp.companyName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <a href={`/api/duerp/${duerp.id}/pdf`} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                DUERP PDF
                            </Button>
                        </a>
                        {duerp.signedAt && (
                            <a href={`/api/duerp/${duerp.id}/attestation`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50" size="sm">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Attestation de Conformité
                                </Button>
                            </a>
                        )}
                    </div>

                </div>
            </div>

            <div className="p-6 space-y-6 max-w-6xl mx-auto">

                {/* ── Stats ────────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Total risques</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{duerp.risques.length}</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                        <p className="text-xs text-amber-600 uppercase tracking-wide">Prioritaires (≥ 20)</p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">{critiques}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
                        <p className="text-xs text-orange-600 uppercase tracking-wide">Élevés (10-19)</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{eleves}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
                        <p className="text-xs text-emerald-600 uppercase tracking-wide">Acceptables (&lt; 10)</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-1">{faibles}</p>
                    </div>
                </div>

                {/* ── Informations ─────────────────────────────────────────── */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>Créé le {format(new Date(duerp.createdAt), "dd MMMM yyyy", { locale: fr })}</span>
                        </div>
                        {duerp.nextReviewDate && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span>Prochaine révision : {format(new Date(duerp.nextReviewDate), "dd MMMM yyyy", { locale: fr })}</span>
                            </div>
                        )}
                        {duerp.signedAt && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>Signé le {format(new Date(duerp.signedAt), "dd MMMM yyyy", { locale: fr })}{duerp.signedByName ? ` par ${duerp.signedByName}` : ""}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{duerp.companyAddress}{duerp.companyCity ? `, ${duerp.companyCity}` : ""}</span>
                        </div>
                    </div>
                </div>

                {/* ── Tableaux de risques par catégorie (style maquettes) ───── */}
                {duerp.risques.length === 0 ? (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Aucun risque évalué dans ce DUERP</p>
                    </div>
                ) : (
                    sortedCategories.map(([code, { nom, risques }]) => (
                        <div key={code} className="bg-white rounded-xl border overflow-hidden">
                            {/* Titre catégorie */}
                            <div className="px-6 py-4">
                                <h2 className="text-xl font-bold text-slate-900">Risques {nom}</h2>
                            </div>

                            {/* Tableau */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#1e2d40] text-white">
                                            <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider w-[200px]">Risque</th>
                                            <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Description</th>
                                            <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider w-12">F</th>
                                            <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider w-12">G</th>
                                            <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider w-16">Brut</th>
                                            <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Action Recommandée</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {risques.map((r, idx) => (
                                            <tr
                                                key={r.id}
                                                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                            >
                                                <td className="px-5 py-3 font-semibold text-slate-900 align-top">
                                                    {r.risqueNom}
                                                </td>
                                                <td className="px-5 py-3 text-slate-400 align-top">
                                                    {r.risqueDescription || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-center font-medium text-slate-700 align-top">
                                                    {r.frequence}
                                                </td>
                                                <td className="px-4 py-3 text-center font-medium text-slate-700 align-top">
                                                    {r.gravite}
                                                </td>
                                                <td className="px-4 py-3 text-center align-top">
                                                    <div className="flex justify-center">
                                                        <ScoreBadge score={r.niveauRisque} />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-slate-400 align-top">
                                                    {r.actionRecommandee || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}

                {/* ── Plan d'action priorisé ────────────────────────────────── */}
                {planAction.length > 0 && (
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="px-6 py-4">
                            <h2 className="text-xl font-bold text-slate-900">Plan d&apos;action priorisé</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#1e2d40] text-white">
                                        <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Risque</th>
                                        <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider w-12">F</th>
                                        <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider w-12">G</th>
                                        <th className="text-center px-4 py-3 font-semibold uppercase text-xs tracking-wider w-16">P</th>
                                        <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Action Corrective</th>
                                        <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wider w-28">Délai</th>
                                        <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wider w-32">Responsable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planAction.map((r, idx) => (
                                        <tr
                                            key={r.id}
                                            className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                        >
                                            <td className="px-5 py-3 font-semibold text-slate-900 align-top">
                                                {r.risqueNom}
                                            </td>
                                            <td className="px-4 py-3 text-center font-medium text-slate-700 align-top">{r.frequence}</td>
                                            <td className="px-4 py-3 text-center font-medium text-slate-700 align-top">{r.gravite}</td>
                                            <td className="px-4 py-3 text-center align-top">
                                                <div className="flex justify-center">
                                                    <ScoreBadge score={r.niveauRisque} />
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-slate-400 align-top">
                                                {r.actionCorrective || r.actionRecommandee || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 align-top">
                                                {r.delai || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 align-top">
                                                {r.responsable || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Bloc Signatures ───────────────────────────────────────── */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-base font-semibold text-slate-900 uppercase tracking-wide mb-5">Signatures</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Signature employeur */}
                        <div>
                            <div className="flex items-center gap-2 text-slate-600 mb-3">
                                <Pen className="h-4 w-4" />
                                <span className="text-sm font-medium">Signature employeur</span>
                            </div>
                            <div className="h-24 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center">
                                {duerp.signedAt ? (
                                    <div className="text-center">
                                        <Shield className="h-5 w-5 text-green-500 mx-auto mb-1" />
                                        <p className="text-xs text-green-600 font-medium">Signé électroniquement</p>
                                        <p className="text-xs text-slate-400">
                                            {format(new Date(duerp.signedAt), "dd/MM/yyyy", { locale: fr })}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">En attente de signature</p>
                                )}
                            </div>
                        </div>

                        {/* Signature auditeur ICPP */}
                        <div>
                            <div className="flex items-center gap-2 text-slate-600 mb-3">
                                <Pen className="h-4 w-4" />
                                <span className="text-sm font-medium">Signature auditeur ICPP</span>
                            </div>
                            <div className="h-24 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center">
                                {duerp.signedAt && duerp.signedByName ? (
                                    <div className="text-center">
                                        <Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                                        <p className="text-xs text-blue-600 font-medium">{duerp.signedByName}</p>
                                        <p className="text-xs text-slate-400">Auditeur ICPP certifié</p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">En attente de signature</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Date & Lieu */}
                    <div className="mt-5 flex flex-wrap items-center gap-6 sm:gap-10 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Date : </span>
                            <span className="font-medium text-slate-700">
                                {duerp.signedAt
                                    ? format(new Date(duerp.signedAt), "dd/MM/yyyy", { locale: fr })
                                    : "___________"
                                }
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Lieu : </span>
                            <span className="font-medium text-slate-700">{duerp.companyCity || "___________"}</span>
                        </div>
                    </div>

                    {/* Mention légale */}
                    <p className="mt-5 text-xs text-slate-400 italic border-t pt-4">
                        &laquo; Le DUERP doit être mis à jour annuellement ou en cas de changement majeur dans l&apos;organisation de l&apos;entreprise. &raquo;
                    </p>
                </div>

            </div>
        </div>
    )
}
