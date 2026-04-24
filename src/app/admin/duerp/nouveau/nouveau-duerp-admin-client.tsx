"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft, ArrowRight, Check, Building2, Briefcase, AlertTriangle, ShieldCheck,
    Loader2, ChevronDown, ChevronUp, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin/admin-header"
import { getRisquesParMetier, createAdminDuerp } from "@/server/actions/admin"
import { NIVEAUX_MAITRISE, NIVEAUX_MAITRISE_LABELS, calcIndicateurs } from "@/lib/duerp-calcul"
import Link from "next/link"

type Step = 1 | 2 | 3 | 4

interface Company { 
    id: string; 
    name: string; 
    metierCode?: string | null; 
    address?: string | null; 
    city?: string | null;
    selectedUnitesTravail?: { id: string; nom: string }[];
}
interface Metier { code: string; nom: string }

interface RisqueItem {
    id: string
    label: string
    categorie: string
    utNom: string
    checked: boolean
    frequence: number
    gravite: number
    niveauMaitrise: string
    // Mesures de prévention (step 4)
    actionCorrective: string
    delai: string
    responsable: string
    observations: string
}

interface NouveauDuerpAdminClientProps {
    companies: Company[]
    metiers?: Metier[]
}

const NIVEAUX_LABELS: Record<string, string> = {
    Aucune: "1.0",
    Partielle: "0.7",
    Organisationnelle: "0.5",
    "Protection collective": "0.35",
    "Maîtrise optimale": "0.2",
}

const PONDERATION_VALUES: Record<string, number> = {
    Aucune: 1,
    Partielle: 0.7,
    Organisationnelle: 0.5,
    "Protection collective": 0.35,
    "Maîtrise optimale": 0.2,
}

function getPrioriteColor(priorite: string) {
    switch (priorite) {
        case "Critique": return "bg-red-100 text-red-700 border-red-200"
        case "Élevé": return "bg-orange-100 text-orange-700 border-orange-200"
        case "Modéré": return "bg-yellow-100 text-yellow-700 border-yellow-200"
        case "Faible": return "bg-green-100 text-green-700 border-green-200"
        default: return "bg-slate-100 text-slate-600"
    }
}

export function NouveauDuerpAdminClient({ companies, metiers = [] }: NouveauDuerpAdminClientProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Step 1 – Informations générales
    const [selectedCompanyId, setSelectedCompanyId] = useState("")
    const [nextReviewDate, setNextReviewDate] = useState("")
    const [lastUpdateReason, setLastUpdateReason] = useState("")

    // Step 2+3 – Risques
    const [risks, setRisks] = useState<RisqueItem[]>([])
    const [loadingRisks, setLoadingRisks] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    const selectedCompany = companies.find(c => c.id === selectedCompanyId)

    // Load risks when company changes
    useEffect(() => {
        const metierCode = selectedCompany?.metierCode
        if (!metierCode) {
            setRisks([])
            return
        }
        setLoadingRisks(true)
        getRisquesParMetier(metierCode).then(res => {
            if (res.success && Object.keys(res.grouped).length > 0) {
                const dynamic: RisqueItem[] = []
                const selectedUtIds = selectedCompany?.selectedUnitesTravail?.map(ut => ut.id)
                
                for (const [catCode, cat] of Object.entries(res.grouped)) {
                    for (const [utKey, ut] of Object.entries(cat.uts)) {
                        // Filter by selected UTs if any are defined for the company
                        if (selectedUtIds && selectedUtIds.length > 0) {
                            // utKey is the ID of the UniteTravail
                            if (!selectedUtIds.includes(utKey)) {
                                continue
                            }
                        }
                        
                        for (const r of ut.risques) {
                            dynamic.push({
                                id: r.id,
                                label: r.nom,
                                categorie: catCode,
                                utNom: ut.nom,
                                checked: false,
                                frequence: r.frequence,
                                gravite: r.gravite,
                                niveauMaitrise: "Aucune",
                                actionCorrective: "",
                                delai: "",
                                responsable: "",
                                observations: "",
                            })
                        }
                    }
                }
                setRisks(dynamic)
                // Auto-expand all categories
                setExpandedCategories(new Set(dynamic.map(r => r.categorie + "|||" + r.utNom)))
            } else {
                setRisks([])
            }
            setLoadingRisks(false)
        })
    }, [selectedCompanyId, selectedCompany])

    function toggleRisk(id: string) {
        setRisks(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r))
    }

    function updateRiskValue(id: string, field: "frequence" | "gravite", value: number) {
        setRisks(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    function updateRiskMaitrise(id: string, value: string) {
        setRisks(prev => prev.map(r => r.id === id ? { ...r, niveauMaitrise: value } : r))
    }

    function updateRiskPrevention(id: string, field: "actionCorrective" | "delai" | "responsable" | "observations", value: string) {
        setRisks(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    function toggleCategory(key: string) {
        setExpandedCategories(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const checkedRisks = risks.filter(r => r.checked)

    // Group risks by category + UT for Step 3/4
    const groupedRisks: Record<string, { categorie: string; utNom: string; items: RisqueItem[] }> = {}
    for (const r of risks) {
        const key = r.categorie + "|||" + r.utNom
        if (!groupedRisks[key]) groupedRisks[key] = { categorie: r.categorie, utNom: r.utNom, items: [] }
        groupedRisks[key].items.push(r)
    }

    const steps = [
        { id: 1, label: "Informations générales", icon: Building2 },
        { id: 2, label: "Postes de travail", icon: Briefcase },
        { id: 3, label: "Risques professionnels", icon: AlertTriangle },
        { id: 4, label: "Mesures de prévention", icon: ShieldCheck },
    ]

    function canProceed() {
        if (currentStep === 1) return !!selectedCompanyId
        if (currentStep === 2) return risks.length > 0
        if (currentStep === 3) return checkedRisks.length > 0
        return true
    }

    async function handleSubmit() {
        setIsSubmitting(true)
        setError(null)
        try {
            const evaluations = checkedRisks.map(r => {
                const ponderation = PONDERATION_VALUES[r.niveauMaitrise] ?? 1
                const risqueResiduel = r.frequence * r.gravite * ponderation
                const { prioriteAction } = calcIndicateurs(r.frequence, r.gravite, r.niveauMaitrise)
                return {
                    risqueId: r.id,
                    uniteTravail: r.utNom,
                    frequence: r.frequence,
                    gravite: r.gravite,
                    niveauMaitrise: r.niveauMaitrise,
                    ponderation,
                    risqueResiduel,
                    prioriteAction,
                    actionCorrective: r.actionCorrective || undefined,
                    delai: r.delai || undefined,
                    responsable: r.responsable || undefined,
                    observations: r.observations || undefined,
                }
            })

            const result = await createAdminDuerp({
                companyId: selectedCompanyId,
                nextReviewDate: nextReviewDate || undefined,
                lastUpdateReason: lastUpdateReason || undefined,
                evaluations,
            })

            if (result.error) {
                setError(result.error)
            } else {
                router.push("/admin/duerp")
            }
        } catch {
            setError("Une erreur est survenue. Veuillez réessayer.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <AdminHeader
                title="Nouveau DUERP"
                subtitle="Créer un Document Unique d'Évaluation des Risques Professionnels"
            />

            {/* Step indicator */}
            <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-4">
                {steps.map((step, idx) => {
                    const Icon = step.icon
                    const done = currentStep > step.id
                    const active = currentStep === step.id
                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl flex-1 transition-all ${active ? "bg-blue-600 text-white" : done ? "bg-green-50 text-green-700" : "text-slate-400"}`}>
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${active ? "bg-white text-blue-600" : done ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                                    {done ? <Check className="h-3 w-3" /> : step.id}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-xs font-semibold leading-tight">{step.label}</p>
                                </div>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-4 h-0.5 flex-shrink-0 mx-1 ${currentStep > step.id ? "bg-green-400" : "bg-slate-200"}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Step content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[400px]">

                {/* STEP 1 — Informations générales */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">Informations générales</h2>
                            <p className="text-sm text-slate-500">Sélectionnez l&apos;entreprise et renseignez les métadonnées du DUERP.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="company">Entreprise *</Label>
                                <select
                                    id="company"
                                    value={selectedCompanyId}
                                    onChange={e => setSelectedCompanyId(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Sélectionner une entreprise...</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reviewDate">Prochaine révision</Label>
                                <Input
                                    id="reviewDate"
                                    type="date"
                                    value={nextReviewDate}
                                    onChange={e => setNextReviewDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {selectedCompany && (
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm space-y-1">
                                    {selectedCompany.address && <p className="text-blue-700">Adresse : {selectedCompany.address}</p>}
                                    {selectedCompany.city && <p className="text-blue-700">Ville : {selectedCompany.city}</p>}
                                    {selectedCompany.metierCode ? (
                                        <p className="text-blue-700">Métier : {metiers.find(m => m.code === selectedCompany.metierCode)?.nom || selectedCompany.metierCode}</p>
                                    ) : (
                                        <p className="text-orange-600 font-medium">⚠ Aucun métier assigné — les risques seront génériques</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="reason">Motif de mise à jour (optionnel)</Label>
                            <Textarea
                                id="reason"
                                placeholder="Ex: Révision annuelle, nouveau poste de travail, incident..."
                                value={lastUpdateReason}
                                onChange={e => setLastUpdateReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2 — Postes de travail */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">Postes de travail</h2>
                            <p className="text-sm text-slate-500">Unités de travail identifiées pour <strong>{selectedCompany?.name}</strong> selon son secteur d&apos;activité.</p>
                        </div>

                        {loadingRisks ? (
                            <div className="flex items-center gap-3 py-12 justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                <span className="text-slate-500">Chargement des unités de travail...</span>
                            </div>
                        ) : risks.length === 0 ? (
                            <div className="text-center py-12">
                                <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">Aucune unité de travail trouvée</p>
                                <p className="text-sm text-slate-400 mt-1">Assurez-vous que l&apos;entreprise a un métier assigné et des risques configurés.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {Array.from(new Set(risks.map(r => r.utNom))).map(ut => {
                                    const utRisks = risks.filter(r => r.utNom === ut)
                                    const categories = Array.from(new Set(utRisks.map(r => r.categorie)))
                                    return (
                                        <div key={ut} className="rounded-xl border border-slate-200 overflow-hidden">
                                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Briefcase className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-sm">{ut}</p>
                                                        <p className="text-xs text-slate-500">{utRisks.length} risque{utRisks.length > 1 ? "s" : ""} · {categories.length} catégorie{categories.length > 1 ? "s" : ""}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {categories.map(cat => (
                                                        <Badge key={cat} variant="secondary" className="text-[10px] px-1.5 py-0.5">{cat}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex gap-2 items-start">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-green-800">
                                        <strong>{Array.from(new Set(risks.map(r => r.utNom))).length} poste{Array.from(new Set(risks.map(r => r.utNom))).length > 1 ? "s" : ""} de travail</strong> identifié{Array.from(new Set(risks.map(r => r.utNom))).length > 1 ? "s" : ""} avec <strong>{risks.length} risques</strong> au total.
                                        Passez à l&apos;étape suivante pour sélectionner les risques applicables.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3 — Risques professionnels */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">Risques professionnels</h2>
                            <p className="text-sm text-slate-500">Cochez les risques applicables et évaluez leur fréquence (F) et gravité (G).</p>
                            {checkedRisks.length > 0 && (
                                <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">{checkedRisks.length} risque{checkedRisks.length > 1 ? "s" : ""} sélectionné{checkedRisks.length > 1 ? "s" : ""}</Badge>
                            )}
                        </div>

                        <div className="space-y-3">
                            {Object.entries(groupedRisks).map(([key, group]) => {
                                const isExpanded = expandedCategories.has(key)
                                return (
                                    <div key={key} className="rounded-xl border border-slate-200 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(key)}
                                            className="w-full bg-slate-50 hover:bg-slate-100 px-4 py-3 flex items-center justify-between transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-blue-100 text-blue-700 border-0 font-medium">{group.categorie}</Badge>
                                                <span className="text-sm font-semibold text-slate-700">{group.utNom}</span>
                                                <span className="text-xs text-slate-400">{group.items.filter(r => r.checked).length}/{group.items.length} sélectionnés</span>
                                            </div>
                                            {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="divide-y divide-slate-100">
                                                {group.items.map(risk => {
                                                    const brut = risk.frequence * risk.gravite
                                                    return (
                                                        <div key={risk.id} className={`px-4 py-3 flex gap-4 items-start transition-colors ${risk.checked ? "bg-blue-50/30" : ""}`}>
                                                            <input
                                                                type="checkbox"
                                                                id={`risk-${risk.id}`}
                                                                checked={risk.checked}
                                                                onChange={() => toggleRisk(risk.id)}
                                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                                                            />
                                                            <div className="flex-1">
                                                                <label htmlFor={`risk-${risk.id}`} className="text-sm font-medium text-slate-800 cursor-pointer">{risk.label}</label>
                                                                {risk.checked && (
                                                                    <div className="mt-3 flex items-center gap-6 flex-wrap">
                                                                        <div className="flex items-center gap-2">
                                                                            <Label className="text-xs text-slate-500 w-16">Fréquence</Label>
                                                                            <div className="flex gap-1">
                                                                                {[1, 2, 3, 4, 5].map(v => (
                                                                                    <button
                                                                                        key={v}
                                                                                        type="button"
                                                                                        onClick={() => updateRiskValue(risk.id, "frequence", v)}
                                                                                        className={`w-7 h-7 rounded text-xs font-bold transition-colors ${risk.frequence === v ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                                                                                    >{v}</button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Label className="text-xs text-slate-500 w-14">Gravité</Label>
                                                                            <div className="flex gap-1">
                                                                                {[1, 2, 3, 4, 5].map(v => (
                                                                                    <button
                                                                                        key={v}
                                                                                        type="button"
                                                                                        onClick={() => updateRiskValue(risk.id, "gravite", v)}
                                                                                        className={`w-7 h-7 rounded text-xs font-bold transition-colors ${risk.gravite === v ? "bg-orange-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                                                                                    >{v}</button>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-xs">
                                                                            <span className="text-slate-400">Score brut = </span>
                                                                            <span className="font-bold text-slate-700">{brut}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* STEP 4 — Mesures de prévention */}
                {currentStep === 4 && (
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-1">Mesures de prévention</h2>
                            <p className="text-sm text-slate-500">Pour chaque risque sélectionné, renseignez le niveau de maîtrise et les actions de prévention.</p>
                        </div>

                        <div className="space-y-4">
                            {checkedRisks.map(risk => {
                                const ponderation = PONDERATION_VALUES[risk.niveauMaitrise] ?? 1
                                const residuel = risk.frequence * risk.gravite * ponderation
                                const { prioriteAction } = calcIndicateurs(risk.frequence, risk.gravite, risk.niveauMaitrise)
                                return (
                                    <div key={risk.id} className="rounded-xl border border-slate-200 overflow-hidden">
                                        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{risk.label}</p>
                                                <p className="text-xs text-slate-500">{risk.utNom} · {risk.categorie}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400">Résiduel: <strong>{residuel.toFixed(1)}</strong></span>
                                                <Badge className={`${getPrioriteColor(prioriteAction)} border text-[10px]`}>{prioriteAction}</Badge>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {/* Niveau de maîtrise */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Niveau de maîtrise (P)</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {NIVEAUX_MAITRISE.map(niveau => (
                                                        <button
                                                            key={niveau}
                                                            type="button"
                                                            onClick={() => updateRiskMaitrise(risk.id, niveau)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${risk.niveauMaitrise === niveau ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
                                                        >
                                                            {NIVEAUX_MAITRISE_LABELS[niveau]} <span className="opacity-60">({NIVEAUX_LABELS[niveau]})</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action corrective */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor={`action-${risk.id}`} className="text-xs font-semibold text-slate-600">Action de prévention recommandée</Label>
                                                    <Textarea
                                                        id={`action-${risk.id}`}
                                                        placeholder="Décrivez l'action corrective ou préventive..."
                                                        value={risk.actionCorrective}
                                                        onChange={e => updateRiskPrevention(risk.id, "actionCorrective", e.target.value)}
                                                        rows={2}
                                                        className="text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor={`delai-${risk.id}`} className="text-xs font-semibold text-slate-600">Délai</Label>
                                                        <Input
                                                            id={`delai-${risk.id}`}
                                                            placeholder="Ex: 3 mois, 1 an..."
                                                            value={risk.delai}
                                                            onChange={e => updateRiskPrevention(risk.id, "delai", e.target.value)}
                                                            className="text-sm h-8"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor={`resp-${risk.id}`} className="text-xs font-semibold text-slate-600">Responsable</Label>
                                                        <Input
                                                            id={`resp-${risk.id}`}
                                                            placeholder="Ex: Direction, RH..."
                                                            value={risk.responsable}
                                                            onChange={e => updateRiskPrevention(risk.id, "responsable", e.target.value)}
                                                            className="text-sm h-8"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor={`obs-${risk.id}`} className="text-xs font-semibold text-slate-600">Observations complémentaires</Label>
                                                <Textarea
                                                    id={`obs-${risk.id}`}
                                                    placeholder="Situation actuelle, contexte particulier..."
                                                    value={risk.observations}
                                                    onChange={e => updateRiskPrevention(risk.id, "observations", e.target.value)}
                                                    rows={2}
                                                    className="text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <div>
                    {currentStep > 1 ? (
                        <Button variant="outline" onClick={() => setCurrentStep(prev => (prev - 1) as Step)}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
                        </Button>
                    ) : (
                        <Button variant="ghost" asChild>
                            <Link href="/admin/duerp"><ArrowLeft className="h-4 w-4 mr-2" /> Annuler</Link>
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">Étape {currentStep}/4</span>
                    {currentStep < 4 ? (
                        <Button
                            onClick={() => setCurrentStep(prev => (prev + 1) as Step)}
                            disabled={!canProceed() || loadingRisks}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Suivant <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || checkedRisks.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Création...</>
                            ) : (
                                <><Check className="h-4 w-4 mr-2" /> Créer le DUERP</>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
