"use client"

import { useState } from "react"
import { Search, Bell, ArrowLeft, ArrowRight, Check, Building2, FileText, AlertTriangle, ClipboardCheck } from "lucide-react"
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

type Step = 1 | 2 | 3 | 4

interface DocumentItem {
    id: string
    label: string
    checked: boolean
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
}

export function NouvelAuditClient() {
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [selectedEntreprise, setSelectedEntreprise] = useState<string>("")
    const [selectedMetier, setSelectedMetier] = useState<string>("")
    const [commentaire, setCommentaire] = useState("")

    // Documents
    const [documents, setDocuments] = useState<DocumentItem[]>([
        { id: "duerp", label: "DUERP existant et accessible", checked: false },
        { id: "affichages", label: "Affichages obligatoires présents", checked: false },
        { id: "extincteurs", label: "Extincteurs présents et vérifiés", checked: false },
        { id: "registre", label: "Registre de sécurité à jour", checked: false },
        { id: "personnel", label: "Registre unique du personnel", checked: false },
        { id: "formations", label: "Formations sécurité réalisées", checked: false },
    ])

    // Risk categories
    const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([
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
    ])

    const entreprises = [
        { id: "1", name: "Restaurant le Gourmet", activite: "Restauration", adresse: "48 Avenue des Champs, 75008 Paris", email: "contact@legourmet.fr" }
    ]

    const metiers = [
        { id: "1", name: "Groupe restauration rapide" }
    ]

    const steps = [
        { id: 1, label: "Entreprise", icon: Building2, completed: currentStep > 1 },
        { id: 2, label: "Documents", icon: FileText, completed: currentStep > 2 },
        { id: 3, label: "Risques", icon: AlertTriangle, completed: currentStep > 3 },
        { id: 4, label: "Synthèse", icon: ClipboardCheck, completed: currentStep > 4 },
    ]

    const handleDocumentToggle = (id: string) => {
        setDocuments(docs =>
            docs.map(doc => doc.id === id ? { ...doc, checked: !doc.checked } : doc)
        )
    }

    const handleRiskToggle = (categoryId: string, riskId: string) => {
        setRiskCategories(cats =>
            cats.map(cat =>
                cat.id === categoryId
                    ? {
                        ...cat,
                        risks: cat.risks.map(risk =>
                            risk.id === riskId ? { ...risk, checked: !risk.checked } : risk
                        )
                    }
                    : cat
            )
        )
    }

    const documentsChecked = documents.filter(d => d.checked).length
    const totalDocuments = documents.length
    const documentScore = Math.round((documentsChecked / totalDocuments) * 100)

    const allRisks = riskCategories.flatMap(cat => cat.risks)
    const checkedRisks = allRisks.filter(r => r.checked)
    const totalRisks = checkedRisks.length

    // Calculate overall compliance score (simplified)
    const overallScore = Math.round((documentsChecked / totalDocuments) * 100)

    const selectedEntrepriseData = entreprises.find(e => e.id === selectedEntreprise)

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Nouvel audit</h1>
                        <p className="text-sm text-slate-500">Créer un audit de conformité</p>
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
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = step.completed

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted
                                            ? "bg-green-500"
                                            : isActive
                                                ? "bg-[#4A7FFF]"
                                                : "bg-slate-200"
                                            }`}>
                                            {isCompleted ? (
                                                <Check className="h-6 w-6 text-white" />
                                            ) : (
                                                <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-slate-400"}`} />
                                            )}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${isActive || isCompleted ? "text-slate-900" : "text-slate-400"
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-0.5 flex-1 -mt-6 ${isCompleted ? "bg-green-500" : "bg-slate-200"
                                            }`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-lg border border-slate-200 p-8">
                    {/* Step 1: Entreprise */}
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Sélection de l'entreprise</h2>
                            <p className="text-sm text-slate-500 mb-6">Choisissez l'entreprise à auditer</p>

                            <div className="space-y-4 max-w-md">
                                <div>
                                    <Label htmlFor="entreprise">Entreprise *</Label>
                                    <Select value={selectedEntreprise} onValueChange={setSelectedEntreprise}>
                                        <SelectTrigger id="entreprise" className="mt-1.5">
                                            <SelectValue placeholder="Sélectionner une entreprise" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {entreprises.map(e => (
                                                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedEntreprise && selectedEntrepriseData && (
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">{selectedEntrepriseData.name}</p>
                                                <p className="text-sm text-slate-600">Activité: {selectedEntrepriseData.activite}</p>
                                                <p className="text-sm text-slate-600">Adresse: {selectedEntrepriseData.adresse}</p>
                                                <p className="text-sm text-slate-600">Email: {selectedEntrepriseData.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="metier">Métier</Label>
                                    <Select value={selectedMetier} onValueChange={setSelectedMetier}>
                                        <SelectTrigger id="metier" className="mt-1.5">
                                            <SelectValue placeholder="Sélectionner un métier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metiers.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Documents */}
                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Vérification documentaire</h2>
                            <p className="text-sm text-slate-500 mb-6">Cochez les documents présents et conformes</p>

                            <div className="space-y-3 mb-6">
                                {documents.map(doc => (
                                    <div
                                        key={doc.id}
                                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${doc.checked
                                            ? "bg-green-50 border-green-200"
                                            : "border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Checkbox
                                            id={doc.id}
                                            checked={doc.checked}
                                            onCheckedChange={() => handleDocumentToggle(doc.id)}
                                        />
                                        <Label
                                            htmlFor={doc.id}
                                            className="flex-1 cursor-pointer text-sm font-medium"
                                        >
                                            {doc.label}
                                        </Label>
                                        {doc.checked && (
                                            <Check className="h-4 w-4 text-green-600" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-900">Score documentaire</span>
                                    <span className="text-sm font-semibold text-slate-900">{documentsChecked}/{totalDocuments}</span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all"
                                        style={{ width: `${documentScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Risques */}
                    {currentStep === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Évaluation des risques</h2>
                            <p className="text-sm text-slate-500 mb-6">Identifiez et évaluez les risques présents</p>

                            <div className="space-y-6">
                                {riskCategories.map(category => (
                                    <div key={category.id}>
                                        <h3 className="text-xs font-semibold text-slate-500 mb-3">{category.title}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {category.risks.map(risk => (
                                                <div
                                                    key={risk.id}
                                                    className={`p-3 rounded-lg border transition-colors ${risk.checked
                                                        ? "bg-orange-50 border-orange-200"
                                                        : "border-slate-200 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={risk.id}
                                                            checked={risk.checked}
                                                            onCheckedChange={() => handleRiskToggle(category.id, risk.id)}
                                                        />
                                                        <Label
                                                            htmlFor={risk.id}
                                                            className="flex-1 cursor-pointer text-sm"
                                                        >
                                                            {risk.label}
                                                        </Label>
                                                    </div>

                                                    {risk.checked && (
                                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                                            <div>
                                                                <Label className="text-xs">Gravité (1-5)</Label>
                                                                <Select defaultValue="2">
                                                                    <SelectTrigger className="h-8 mt-1 text-xs">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[1, 2, 3, 4, 5].map(n => (
                                                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Fréquence (1-5)</Label>
                                                                <Select defaultValue="2">
                                                                    <SelectTrigger className="h-8 mt-1 text-xs">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[1, 2, 3, 4, 5].map(n => (
                                                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Synthèse */}
                    {currentStep === 4 && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-2">Synthèse de l'audit</h2>
                            <p className="text-sm text-slate-500 mb-6">Vérifiez les informations avant validation</p>

                            {/* Score Global */}
                            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
                                <p className="text-sm text-slate-600 mb-2">Score de conformité estimé</p>
                                <p className="text-5xl font-bold text-blue-600 mb-1">{overallScore}%</p>
                                <p className="text-xs text-orange-500 flex items-center justify-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Conformité partielle
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-sm text-slate-600 mb-1">Documents vérifiés</p>
                                    <p className="text-2xl font-bold text-slate-900">{documentsChecked}/{totalDocuments}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-sm text-slate-600 mb-1">Risques identifiés</p>
                                    <p className="text-2xl font-bold text-slate-900">{totalRisks}</p>
                                </div>
                            </div>

                            {/* Commentaire */}
                            <div>
                                <Label htmlFor="commentaire">Commentaire général</Label>
                                <Textarea
                                    id="commentaire"
                                    placeholder="Observations, recommandations, points d'attention..."
                                    value={commentaire}
                                    onChange={(e) => setCommentaire(e.target.value)}
                                    className="mt-1.5 min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as Step)}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Annuler
                    </Button>

                    <Button
                        className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                        onClick={() => {
                            if (currentStep < 4) {
                                setCurrentStep((currentStep + 1) as Step)
                            } else {
                                // Submit audit
                                console.log("Submit audit")
                            }
                        }}
                    >
                        {currentStep === 4 ? "Soumettre" : "Suivant"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
