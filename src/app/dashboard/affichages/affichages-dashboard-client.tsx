"use client"

import { Download, FileText, CheckCircle2, Info, Lock, Shield, Flame, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AffichageItem {
    id: string
    category: string
    type: string
    title: string
    description: string
    downloaded: boolean
    isLocked: boolean
    generatedAt: string | null
}

interface Props {
    companyName: string
    affichages: AffichageItem[]
}

const CATEGORIES: Record<string, { label: string; color: string; icon: typeof FileText }> = {
    FICHE_1: { label: "Fiche 1 — Coordonnées", color: "bg-blue-100 text-blue-700", icon: FileText },
    FICHE_2: { label: "Fiche 2 — Droits & Obligations", color: "bg-purple-100 text-purple-700", icon: Shield },
    FICHE_3: { label: "Fiche 3 — Interdiction fumer", color: "bg-red-100 text-red-700", icon: Ban },
    FICHE_4: { label: "Fiche 4 — Sécurité incendie", color: "bg-orange-100 text-orange-700", icon: Flame },
}

function getCategoryInfo(cat: string) {
    return CATEGORIES[cat] || { label: cat, color: "bg-slate-100 text-slate-700", icon: FileText }
}

export function AffichagesClientDashboard({ companyName, affichages }: Props) {
    const downloadedCount = affichages.filter(a => a.downloaded).length
    const totalCount = affichages.length
    const progress = totalCount > 0 ? Math.round((downloadedCount / totalCount) * 100) : 0

    const grouped: Record<string, AffichageItem[]> = {}
    for (const a of affichages) {
        if (!grouped[a.category]) grouped[a.category] = []
        grouped[a.category].push(a)
    }

    const categoryOrder = ["FICHE_1", "FICHE_2", "FICHE_3", "FICHE_4"]
    const sortedCategories = Object.keys(grouped).sort(
        (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
    )

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Affichages obligatoires</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {downloadedCount} sur {totalCount} téléchargés — {companyName}
                    </p>
                </div>
            </div>

            <div className="p-6">
                {/* Progress Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-900">Progression</span>
                        <span className="text-sm text-slate-500">{progress}% complété</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {totalCount === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 mb-2">Aucun affichage disponible</h3>
                        <p className="text-sm text-slate-500">
                            Vos affichages obligatoires seront disponibles ici une fois générés par votre auditeur ICPP.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedCategories.map((cat) => {
                            const info = getCategoryInfo(cat)
                            const Icon = info.icon
                            const items = grouped[cat]

                            return (
                                <div key={cat}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Icon className="h-4 w-4 text-slate-600" />
                                        <h2 className="font-semibold text-slate-900">{info.label}</h2>
                                        <Badge className={info.color}>{items.length}</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        {items.map((affichage) => (
                                            <div
                                                key={affichage.id}
                                                className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${affichage.downloaded ? "bg-green-50" : "bg-slate-50"
                                                        }`}>
                                                        {affichage.downloaded ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                            <FileText className="h-5 w-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-slate-900">{affichage.title}</h3>
                                                            {affichage.isLocked && (
                                                                <Lock className="h-3.5 w-3.5 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-500">{affichage.description}</p>
                                                        {affichage.generatedAt && (
                                                            <p className="text-xs text-slate-400 mt-0.5">
                                                                Généré le {new Date(affichage.generatedAt).toLocaleDateString("fr-FR")}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Obligatoire</Badge>
                                                    <a
                                                        href={`/api/affichages/${affichage.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant={affichage.downloaded ? "outline" : "default"}
                                                            size="sm"
                                                            className={affichage.downloaded
                                                                ? "text-sm"
                                                                : "bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                                            }
                                                        >
                                                            <Download className="h-4 w-4 mr-2" />
                                                            {affichage.downloaded ? "Re-télécharger" : "Télécharger"}
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Conseils */}
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 mt-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Info className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Conseils d'affichage</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Imprimez ces documents en format A4 et affichez-les dans un lieu visible et accessible à tous les salariés (salle de pause, couloir, entrée...). La loi impose leur affichage permanent dans les locaux de l'entreprise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
