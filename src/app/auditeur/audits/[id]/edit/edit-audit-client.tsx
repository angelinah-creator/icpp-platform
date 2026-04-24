"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Bell, ArrowLeft, ArrowRight, Check, Building2, FileText, AlertTriangle, ClipboardCheck, Loader2, CreditCard, MinusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateAudit } from "@/server/actions/client"
import { NIVEAUX_MAITRISE, NIVEAUX_MAITRISE_LABELS, calcIndicateurs } from "@/lib/duerp-calcul"

type Step = 1 | 2 | 3 | 4 | 5

interface DocumentItem {
    id: string
    label: string
    checked: boolean
    conforme: boolean
}

interface RiskCategory {
    id: string
    title: string
    risks: RiskItem[]
}

interface RiskItem {
    id: string
    label: string
    checked: boolean
    gravite?: number
    frequence?: number
    niveauMaitrise?: string
}

interface AuditData {
    id: string
    companyId: string
    companyName: string
    metierNom: string
    documents: Array<{ type: string; present: boolean; conforme: boolean }>
    risques: Array<{
        id: string
        categorie: string
        nom: string
        gravite: number | null
        frequence: number | null
        niveauMaitrise?: string
        priorite: number | null
        risqueResiduel?: number | null
        prioriteAction?: string | null
        identifie: boolean
    }>
    proposedPlanCode?: string | null
}

interface Plan {
    code: string
    nom: string
    prix: number
}

interface EditAuditClientProps {
    audit: AuditData
    plans?: Plan[]
}

export function EditAuditClient({ audit, plans = [] }: EditAuditClientProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [commentaire, setCommentaire] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [proposedPlanCode, setProposedPlanCode] = useState<string>(audit.proposedPlanCode || "")

    // Documents d'audit de base
    const baseDocuments = [
        { id: "duerp", label: "DUERP existant et accessible" },
        { id: "affichages", label: "Affichages obligatoires présents" },
        { id: "extincteurs", label: "Extincteurs présents et vérifiés" },
        { id: "registre", label: "Registre de sécurité à jour" },
        { id: "personnel", label: "Registre unique du personnel" },
        { id: "formations", label: "Formations sécurité réalisées" },
    ]

    // Initialiser les documents avec les données de l'audit
    const [documents, setDocuments] = useState<DocumentItem[]>(
        baseDocuments.map(baseDoc => {
            const auditDoc = audit.documents.find(d => d.type === baseDoc.id)
            return {
                id: baseDoc.id,
                label: baseDoc.label,
                checked: auditDoc?.present || false,
                conforme: auditDoc?.conforme || false
            }
        })
    )

    // Risk categories de base
    const baseRiskCategories: RiskCategory[] = [
        {
            id: "physiques",
            title: "RISQUES PHYSIQUES",
            risks: [
                { id: "chutes-plain-pied", label: "Chutes de plain-pied", checked: false },
                { id: "manutention", label: "Manutention manuelle", checked: false },
                { id: "bruit", label: "Bruit", checked: false },
                { id: "chutes-hauteur", label: "Chutes de hauteur", checked: false },
                { id: "postures", label: "Postures contraignantes", checked: false },
            ]
        },
        {
            id: "chimiques",
            title: "RISQUES CHIMIQUES",
            risks: [
                { id: "corrosion", label: "Produits de corrosion", checked: false },
                { id: "aerosols", label: "Aérosols", checked: false },
                { id: "cmr", label: "CMR", checked: false },
                { id: "nettoyage", label: "Produits de nettoyage", checked: false },
                { id: "allergenes", label: "Allergènes", checked: false },
            ]
        },
        {
            id: "biologiques",
            title: "RISQUES BIOLOGIQUES",
            risks: [
                { id: "cuisine", label: "Contact cuisine", checked: false },
                { id: "infectieux", label: "Agents infectieux", checked: false },
                { id: "dechets", label: "Déchets / Piqûres", checked: false },
            ]
        },
        {
            id: "psychosociaux",
            title: "RISQUES PSYCHOSOCIAUX",
            risks: [
                { id: "travail", label: "Charge de travail", checked: false },
                { id: "harcelement", label: "Harcèlement d'équipes", checked: false },
                { id: "clients", label: "Relations clients", checked: false },
                { id: "travail-isole", label: "Travail isolé", checked: false },
            ]
        },
        {
            id: "incendie",
            title: "RISQUES INCENDIE",
            risks: [
                { id: "electriques", label: "Installations électriques", checked: false },
                { id: "secours", label: "Issues de secours", checked: false },
                { id: "stockage", label: "Stockage produits", checked: false },
                { id: "obstruction", label: "Moyens d'extinction", checked: false },
            ]
        },
    ]

    // Initialiser les risques avec les données de l'audit
    const [riskCategories, setRiskCategories] = useState<RiskCategory[]>(
        baseRiskCategories.map(category => ({
            ...category,
            risks: category.risks.map(risk => {
                const auditRisk = audit.risques.find(
                    r => r.categorie.toLowerCase() === category.id && r.nom === risk.label
                )
                return {
                    ...risk,
                    checked: auditRisk?.identifie || false,
                    gravite: auditRisk?.gravite || 2,
                    frequence: auditRisk?.frequence || 2,
                    niveauMaitrise: auditRisk?.niveauMaitrise || "Aucune",
                }
            })
        }))
    )

    const steps = [
        { id: 1, label: "Entreprise", icon: Building2, completed: currentStep > 1 },
        { id: 2, label: "Documents", icon: FileText, completed: currentStep > 2 },
        { id: 3, label: "Risques", icon: AlertTriangle, completed: currentStep > 3 },
        { id: 4, label: "Synthèse", icon: ClipboardCheck, completed: currentStep > 4 },
        { id: 5, label: "Offre", icon: CreditCard, completed: false },
    ]

    const handleDocumentToggle = (id: string) => {
        setDocuments(docs =>
            docs.map(doc => doc.id === id ? { ...doc, checked: !doc.checked } : doc)
        )
    }

    const handleDocumentConformiteToggle = (id: string) => {
        setDocuments(docs =>
            docs.map(doc => doc.id === id ? { ...doc, conforme: !doc.conforme } : doc)
        )
    }

    const handleRiskToggle = (categoryId: string, riskId: string) => {
        setRiskCategories(cats =>
            cats.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        risks: cat.risks.map(risk =>
                            risk.id === riskId
                                ? {
                                    ...risk,
                                    checked: !risk.checked,
                                    gravite: !risk.checked ? 2 : risk.gravite,
                                    frequence: !risk.checked ? 2 : risk.frequence
                                }
                                : risk
                        )
                    }
                    : cat
            )
        )
    }

    const handleRiskGravite = (categoryId: string, riskId: string, gravite: number) => {
        setRiskCategories((cats: RiskCategory[]) =>
            cats.map((cat: RiskCategory) =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        risks: cat.risks.map((risk: RiskItem) =>
                            risk.id === riskId ? { ...risk, gravite } : risk
                        )
                    }
                    : cat
            )
        )
    }

    const handleRiskFrequence = (categoryId: string, riskId: string, frequence: number) => {
        setRiskCategories((cats: RiskCategory[]) =>
            cats.map((cat: RiskCategory) =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        risks: cat.risks.map((risk: RiskItem) =>
                            risk.id === riskId ? { ...risk, frequence } : risk
                        )
                    }
                    : cat
            )
        )
    }

    const handleRiskMaitrise = (categoryId: string, riskId: string, niveauMaitrise: string) => {
        setRiskCategories((cats: RiskCategory[]) =>
            cats.map((cat: RiskCategory) =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        risks: cat.risks.map((risk: RiskItem) =>
                            risk.id === riskId ? { ...risk, niveauMaitrise } : risk
                        )
                    }
                    : cat
            )
        )
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError(null)

        try {
            console.log("🚀 Début de la mise à jour de l'audit")

            // Préparer les données documents
            const documentsData = documents.map((doc: DocumentItem) => ({
                type: doc.id,
                present: doc.checked,
                conforme: doc.conforme
            }))
            console.log("📄 Documents:", documentsData)

            // Préparer les données risques
            const risksData = riskCategories.flatMap((cat: RiskCategory) =>
                cat.risks
                    .filter((risk: RiskItem) => risk.checked)
                    .map((risk: RiskItem) => ({
                        categorie: cat.id.toUpperCase(),
                        nom: risk.label,
                        gravite: risk.gravite || 2,
                        frequence: risk.frequence || 2,
                        niveauMaitrise: risk.niveauMaitrise || "Aucune",
                        priorite: (risk.gravite || 2) * (risk.frequence || 2)
                    }))
            )
            console.log("⚠️ Risques:", risksData)

            // Mettre à jour l'audit
            console.log("📝 Appel de updateAudit avec auditId:", audit.id)
            const result = await updateAudit(
                audit.id,
                audit.companyId,
                documentsData,
                risksData,
                proposedPlanCode || undefined
            )

            console.log("✅ Résultat:", result)

            if ('error' in result) {
                console.error("❌ Erreur retournée:", result.error)
                setError(result.error ?? "Erreur lors de la mise à jour")
            } else {
                console.log("✅ Succès! Redirection vers le détail de l'audit")
                // Succès - rediriger vers le détail de l'audit
                router.push(`/auditeur/audits/${audit.id}`)
                router.refresh()
            }
        } catch (err) {
            console.error("❌ Exception capturée:", err)
            setError("Une erreur est survenue lors de la mise à jour de l'audit")
        } finally {
            setIsSubmitting(false)
        }
    }

    const documentsChecked = documents.filter((d: DocumentItem) => d.checked).length
    const totalDocuments = documents.length
    const documentScore = Math.round((documentsChecked / totalDocuments) * 100)

    const allRisks = riskCategories.flatMap(cat => cat.risks)
    const checkedRisks = allRisks.filter((r: RiskItem) => r.checked)
    const totalRisks = checkedRisks.length

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Modifier l'audit</h1>
                        <p className="text-sm text-slate-500">{audit.companyName} - {audit.metierNom}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-64 bg-slate-50 pl-10 border-slate-200"
                            />
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                2
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 max-w-4xl mx-auto">
                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon
                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep === step.id
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : step.completed
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "bg-white border-slate-200 text-slate-400"
                                                }`}
                                        >
                                            {step.completed ? <Check className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                                        </div>
                                        <span className={`mt-2 text-sm font-medium ${currentStep === step.id ? "text-blue-600" : step.completed ? "text-green-600" : "text-slate-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-4 ${step.completed ? "bg-green-500" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Step 1: Entreprise */}
                {currentStep === 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Entreprise auditée</h2>
                        <div className="space-y-4 bg-slate-50 p-6 rounded-lg">
                            <div>
                                <Label className="text-sm font-medium text-slate-700">Entreprise</Label>
                                <p className="text-lg font-semibold text-slate-900">{audit.companyName}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-slate-700">Métier</Label>
                                <p className="text-lg text-slate-900">{audit.metierNom}</p>
                            </div>
                            <p className="text-sm text-slate-500 mt-4">
                                L'entreprise ne peut pas être modifiée. Pour changer d'entreprise, créez un nouvel audit.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Documents */}
                {currentStep === 2 && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Vérification des documents</h2>
                        <div className="space-y-4">
                            {documents.map((doc: DocumentItem) => (
                                <div key={doc.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Checkbox
                                            id={doc.id}
                                            checked={doc.checked}
                                            onCheckedChange={() => handleDocumentToggle(doc.id)}
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor={doc.id} className="text-base cursor-pointer text-slate-900">
                                                {doc.label}
                                            </Label>
                                            {doc.checked && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Checkbox
                                                        id={`${doc.id}-conforme`}
                                                        checked={doc.conforme}
                                                        onCheckedChange={() => handleDocumentConformiteToggle(doc.id)}
                                                    />
                                                    <Label htmlFor={`${doc.id}-conforme`} className="text-sm cursor-pointer text-slate-600">
                                                        Document conforme
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Score documents : {documentScore}%</strong> ({documentsChecked} sur {totalDocuments} documents vérifiés)
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: Risques */}
                {currentStep === 3 && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Identification des risques</h2>
                        <div className="space-y-6">
                            {riskCategories.map(category => (
                                <div key={category.id} className="border border-slate-200 rounded-lg p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">{category.title}</h3>
                                    <div className="space-y-4">
                                        {category.risks.map(risk => (
                                            <div key={risk.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <Checkbox
                                                        id={risk.id}
                                                        checked={risk.checked}
                                                        onCheckedChange={() => handleRiskToggle(category.id, risk.id)}
                                                    />
                                                    <div className="flex-1">
                                                        <Label htmlFor={risk.id} className="text-base cursor-pointer text-slate-900 mb-3 block">
                                                            {risk.label}
                                                        </Label>
                                                        {risk.checked && (
                                                            <div className="space-y-4 mt-3">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="text-sm text-slate-600 mb-2 block">Gravité</Label>
                                                                        <RadioGroup
                                                                            value={risk.gravite?.toString()}
                                                                            onValueChange={(value) => handleRiskGravite(category.id, risk.id, parseInt(value))}
                                                                            className="flex gap-2"
                                                                        >
                                                                            {[1, 2, 3, 4].map(val => (
                                                                                <div key={val} className="flex items-center">
                                                                                    <RadioGroupItem value={val.toString()} id={`${risk.id}-g${val}`} />
                                                                                    <Label htmlFor={`${risk.id}-g${val}`} className="ml-1 text-sm cursor-pointer">
                                                                                        {val}
                                                                                    </Label>
                                                                                </div>
                                                                            ))}
                                                                        </RadioGroup>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm text-slate-600 mb-2 block">Fréquence</Label>
                                                                        <RadioGroup
                                                                            value={risk.frequence?.toString()}
                                                                            onValueChange={(value) => handleRiskFrequence(category.id, risk.id, parseInt(value))}
                                                                            className="flex gap-2"
                                                                        >
                                                                            {[1, 2, 3, 4].map(val => (
                                                                                <div key={val} className="flex items-center">
                                                                                    <RadioGroupItem value={val.toString()} id={`${risk.id}-f${val}`} />
                                                                                    <Label htmlFor={`${risk.id}-f${val}`} className="ml-1 text-sm cursor-pointer">
                                                                                        {val}
                                                                                    </Label>
                                                                                </div>
                                                                            ))}
                                                                        </RadioGroup>
                                                                    </div>
                                                                </div>
                                                                {/* Niveau de maîtrise */}
                                                                <div>
                                                                    <Label className="text-sm text-slate-600 mb-2 block">Niveau de maîtrise</Label>
                                                                    <Select
                                                                        value={risk.niveauMaitrise || "Aucune"}
                                                                        onValueChange={(value) => handleRiskMaitrise(category.id, risk.id, value)}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {NIVEAUX_MAITRISE.map(nm => (
                                                                                <SelectItem key={nm} value={nm}>
                                                                                    {NIVEAUX_MAITRISE_LABELS[nm]}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                {/* Preview calcul */}
                                                                {(() => {
                                                                    const f = risk.frequence || 2
                                                                    const g = risk.gravite || 2
                                                                    const nm = risk.niveauMaitrise || "Aucune"
                                                                    const { risqueBrut, risqueResiduel, prioriteAction } = calcIndicateurs(f, g, nm)
                                                                    const color = prioriteAction === "Critique" ? "text-red-600" : prioriteAction === "Élevé" ? "text-amber-600" : prioriteAction === "Modéré" ? "text-orange-600" : "text-green-600"
                                                                    return (
                                                                        <div className="text-xs bg-slate-50 rounded p-2 flex gap-4">
                                                                            <span className="text-slate-500">Brut: <strong>{risqueBrut}</strong></span>
                                                                            <span className="text-slate-500">Résiduel: <strong>{risqueResiduel}</strong></span>
                                                                            <span className={`font-semibold ${color}`}>{prioriteAction}</span>
                                                                        </div>
                                                                    )
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>{totalRisks} risques identifiés</strong>
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 4: Synthèse */}
                {currentStep === 4 && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Synthèse de l'audit</h2>

                        {/* Entreprise */}
                        <div className="mb-6 p-6 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Entreprise</h3>
                            <p className="text-slate-700"><strong>{audit.companyName}</strong></p>
                            <p className="text-slate-600">{audit.metierNom}</p>
                        </div>

                        {/* Documents */}
                        <div className="mb-6 p-6 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Documents ({documentsChecked}/{totalDocuments})</h3>
                            <div className="space-y-2">
                                {documents.filter(d => d.checked).map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700">{doc.label}</span>
                                        <span className={`font-medium ${doc.conforme ? "text-green-600" : "text-orange-600"}`}>
                                            {doc.conforme ? "Conforme" : "Non conforme"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Risques */}
                        <div className="mb-6 p-6 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Risques identifiés ({totalRisks})</h3>
                            {riskCategories.map(category => {
                                const categoryRisks = category.risks.filter(r => r.checked)
                                if (categoryRisks.length === 0) return null
                                return (
                                    <div key={category.id} className="mb-4">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">{category.title}</h4>
                                        <div className="space-y-2">
                                            {categoryRisks.map(risk => {
                                                const f = risk.frequence || 2
                                                const g = risk.gravite || 2
                                                const nm = risk.niveauMaitrise || "Aucune"
                                                const { risqueBrut, risqueResiduel, prioriteAction } = calcIndicateurs(f, g, nm)
                                                const prioriteColor = prioriteAction === "Critique" ? "text-red-600" : prioriteAction === "Élevé" ? "text-orange-600" : prioriteAction === "Modéré" ? "text-yellow-600" : "text-green-600"
                                                return (
                                                    <div key={risk.id} className="flex items-center justify-between text-sm">
                                                        <span className="text-slate-700">{risk.label}</span>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-slate-400">G:{g} F:{f} → Brut:{risqueBrut} → Rés:{risqueResiduel}</span>
                                                            <span className={`font-medium ${prioriteColor}`}>{prioriteAction}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Commentaire */}
                        <div className="mb-6">
                            <Label htmlFor="commentaire" className="text-sm font-medium text-slate-700 mb-2 block">Commentaires ou observations</Label>
                            <Textarea
                                id="commentaire"
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                placeholder="Ajoutez des commentaires sur cet audit..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                L'audit sera mis à jour avec les nouvelles informations. Le score de conformité sera recalculé automatiquement.
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 5: Offre */}
                {currentStep === 5 && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Proposition d'abonnement</h2>
                            <p className="text-sm text-slate-500">Suggérez un plan adapté aux besoins identifiés lors de l'audit</p>
                        </div>

                        <div className="grid gap-4">
                            {plans.map((plan) => (
                                <div
                                    key={plan.code}
                                    onClick={() => setProposedPlanCode(plan.code)}
                                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${proposedPlanCode === plan.code
                                        ? "border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600 ring-opacity-10"
                                        : "border-slate-100 hover:border-blue-200 bg-white"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${proposedPlanCode === plan.code ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{plan.nom}</h3>
                                                <p className="text-sm text-slate-500">Plan suggéré</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-slate-900">{plan.prix}€ <span className="text-xs font-normal text-slate-500">/mois</span></p>
                                        </div>
                                    </div>
                                    {proposedPlanCode === plan.code && (
                                        <div className="absolute top-2 right-2">
                                            <Check className="h-4 w-4 text-blue-600" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div
                                onClick={() => setProposedPlanCode("")}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${proposedPlanCode === ""
                                    ? "border-slate-600 bg-slate-50 shadow-md"
                                    : "border-slate-100 hover:border-slate-200 bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${proposedPlanCode === "" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                        <MinusCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Ne rien proposer</h3>
                                        <p className="text-sm text-slate-500">Finaliser sans offre</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as Step)}
                        disabled={currentStep === 1 || isSubmitting}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Précédent
                    </Button>
                    {currentStep < 5 ? (
                        <Button
                            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1) as Step)}
                            disabled={isSubmitting}
                        >
                            Suivant
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Mise à jour en cours...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Enregistrer les modifications
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
