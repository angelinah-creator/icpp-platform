"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Building2, FileText, AlertTriangle, ClipboardCheck, Loader2, Plus, CreditCard, MinusCircle, Euro } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { createAudit, createCompanyAsAuditeur } from "@/server/actions/client"
import { getRisquesParMetier } from "@/server/actions/admin"
import { NIVEAUX_MAITRISE, NIVEAUX_MAITRISE_LABELS, calcIndicateurs } from "@/lib/duerp-calcul"
import Link from "next/link"

type Step = 1 | 2 | 3 | 4 | 5

interface DocumentItem {
    id: string
    label: string
    checked: boolean
}

interface RisqueItem {
    id: string
    risqueId?: string
    label: string
    categorie: string
    utNom: string
    checked: boolean
    gravite: number
    frequence: number
    niveauMaitrise: string
}

interface Client {
    id: string
    name: string
    metierCode?: string | null
    activity?: string | null
    address?: string | null
    email?: string | null
}

interface Metier {
    code: string
    nom: string
}

interface Plan {
    code: string
    nom: string
    prix?: number
}

interface NouvelAuditClientProps {
    clients: Client[]
    metiers?: Metier[]
    plans?: Plan[]
}

const STATIC_DOCUMENTS: DocumentItem[] = [
    { id: "duerp", label: "DUERP existant et accessible", checked: false },
    { id: "affichages", label: "Affichages obligatoires présents", checked: false },
    { id: "extincteurs", label: "Extincteurs présents et vérifiés", checked: false },
    { id: "registre", label: "Registre de sécurité à jour", checked: false },
    { id: "personnel", label: "Registre unique du personnel", checked: false },
    { id: "formations", label: "Formations sécurité réalisées", checked: false },
]

const STATIC_RISKS: RisqueItem[] = [
    { id: "chutes-plain-pied", label: "Chutes de plain-pied", categorie: "PHYSIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "manutention", label: "Manutention manuelle", categorie: "PHYSIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "bruit", label: "Bruit", categorie: "PHYSIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "chutes-hauteur", label: "Chutes de hauteur", categorie: "PHYSIQUE", utNom: "Général", checked: false, gravite: 3, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "postures", label: "Postures contraignantes", categorie: "PHYSIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "corrosion", label: "Produits de corrosion", categorie: "CHIMIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "aerosols", label: "Aérosols", categorie: "CHIMIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "cmr", label: "CMR", categorie: "CHIMIQUE", utNom: "Général", checked: false, gravite: 4, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "nettoyage", label: "Produits de nettoyage", categorie: "CHIMIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "allergenes", label: "Allergènes", categorie: "CHIMIQUE", utNom: "Général", checked: false, gravite: 2, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "infectieux", label: "Agents infectieux", categorie: "BIOLOGIQUE", utNom: "Général", checked: false, gravite: 3, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "charge-travail", label: "Charge de travail excessive", categorie: "PSYCHOSOCIAL", utNom: "Général", checked: false, gravite: 2, frequence: 2, niveauMaitrise: "Aucune" },
    { id: "harcelement", label: "Harcèlement moral / sexuel", categorie: "PSYCHOSOCIAL", utNom: "Général", checked: false, gravite: 4, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "incendie-elec", label: "Installations électriques", categorie: "INCENDIE", utNom: "Général", checked: false, gravite: 4, frequence: 1, niveauMaitrise: "Aucune" },
    { id: "secours", label: "Issues de secours inaccessibles", categorie: "INCENDIE", utNom: "Général", checked: false, gravite: 4, frequence: 1, niveauMaitrise: "Aucune" },
]

export function NouvelAuditClient({ clients, metiers = [], plans = [] }: NouvelAuditClientProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [selectedClientId, setSelectedClientId] = useState("")
    const [commentaire, setCommentaire] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [proposedPlanCode, setProposedPlanCode] = useState<string>("")
    const [proposedPrice, setProposedPrice] = useState<string>("")

    // Documents
    const [documents, setDocuments] = useState<DocumentItem[]>(STATIC_DOCUMENTS)

    // Risques dynamiques
    const [risks, setRisks] = useState<RisqueItem[]>(STATIC_RISKS)
    const [loadingRisks, setLoadingRisks] = useState(false)

    // Modal création nouveau client
    const [showNewClient, setShowNewClient] = useState(false)
    const [newClient, setNewClient] = useState({
        name: "", siret: "", email: "", phone: "",
        address: "", city: "", postalCode: "", metierCode: "", employeeCount: 1
    })
    const [creatingClient, setCreatingClient] = useState(false)
    const [localClients, setLocalClients] = useState<Client[]>(clients)

    const selectedClient = localClients.find(c => c.id === selectedClientId)

    // Charger les risques dynamiquement quand le client change
    useEffect(() => {
        const metierCode = selectedClient?.metierCode
        if (!metierCode) {
            setRisks(STATIC_RISKS)
            return
        }
        setLoadingRisks(true)
        getRisquesParMetier(metierCode).then(res => {
            if (res.success && Object.keys(res.grouped).length > 0) {
                const dynamicRisks: RisqueItem[] = []
                for (const [catCode, cat] of Object.entries(res.grouped)) {
                    for (const [, ut] of Object.entries(cat.uts)) {
                        for (const r of ut.risques) {
                            dynamicRisks.push({
                                id: r.id,
                                risqueId: r.id,
                                label: r.nom,
                                categorie: catCode,
                                utNom: ut.nom,
                                checked: false,
                                gravite: r.gravite,
                                frequence: r.frequence,
                                niveauMaitrise: "Aucune",
                            })
                        }
                    }
                }
                setRisks(dynamicRisks.length > 0 ? dynamicRisks : STATIC_RISKS)
            } else {
                setRisks(STATIC_RISKS)
            }
            setLoadingRisks(false)
        })
    }, [selectedClientId, selectedClient])

    const steps = [
        { id: 1, label: "Entreprise", icon: Building2, completed: currentStep > 1 },
        { id: 2, label: "Documents", icon: FileText, completed: currentStep > 2 },
        { id: 4, label: "Synthèse", icon: ClipboardCheck, completed: currentStep > 4 },
        { id: 5, label: "Offre", icon: CreditCard, completed: false },
    ]

    async function handleCreateClient() {
        if (!newClient.name || !newClient.address || !newClient.city) return
        setCreatingClient(true)
        try {
            const result = await createCompanyAsAuditeur({
                name: newClient.name,
                siret: newClient.siret || undefined,
                email: newClient.email || undefined,
                phone: newClient.phone || undefined,
                address: newClient.address,
                city: newClient.city,
                postalCode: newClient.postalCode || undefined,
                metierCode: newClient.metierCode || undefined,
                employeeCount: newClient.employeeCount || 1,
            })
            if ('error' in result) {
                setError(result.error as string)
            } else {
                const created: Client = {
                    id: result.company.id,
                    name: result.company.name,
                    metierCode: result.company.metierCode
                }
                setLocalClients(prev => [created, ...prev])
                setSelectedClientId(created.id)
                setShowNewClient(false)
                setNewClient({ name: "", siret: "", email: "", phone: "", address: "", city: "", postalCode: "", metierCode: "", employeeCount: 1 })
            }
        } catch {
            setError("Erreur lors de la création")
        } finally {
            setCreatingClient(false)
        }
    }

    function handleDocumentToggle(id: string) {
        setDocuments(docs => docs.map(d => d.id === id ? { ...d, checked: !d.checked } : d))
    }

    function handleDocumentChecked(id: string, checked: boolean) {
        setDocuments(docs => docs.map(d => d.id === id ? { ...d, checked } : d))
    }

    function handleRiskToggle(id: string) {
        setRisks(rs => rs.map(r => r.id === id ? { ...r, checked: !r.checked } : r))
    }

    function handleRiskChecked(id: string, checked: boolean) {
        setRisks(rs => rs.map(r => r.id === id ? { ...r, checked } : r))
    }

    function handleRiskValue(id: string, field: "gravite" | "frequence", value: number) {
        setRisks(rs => rs.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    function handleRiskMaitrise(id: string, value: string) {
        setRisks(rs => rs.map(r => r.id === id ? { ...r, niveauMaitrise: value } : r))
    }

    async function handleSubmit() {
        if (!selectedClientId) { setError("Sélectionnez une entreprise"); return }
        setIsSubmitting(true)
        setError(null)
        try {
            const documentsData: { [key: string]: boolean } = {}
            documents.forEach(d => { documentsData[d.id] = d.checked })

            const risksData = risks.map(r => ({
                categorie: r.categorie,
                nom: r.label,
                identifie: r.checked,
                gravite: r.checked ? r.gravite : undefined,
                frequence: r.checked ? r.frequence : undefined,
                niveauMaitrise: r.checked ? (r.niveauMaitrise || "Aucune") : undefined,
            }))

            const result = await createAudit({
                companyId: selectedClientId,
                documents: documentsData,
                risks: risksData,
                commentaire: commentaire || undefined,
                proposedPlanCode: proposedPlanCode || undefined,
                proposedPrice: proposedPrice ? parseFloat(proposedPrice) : undefined
            })

            if ('error' in result) {
                setError(result.error ?? "Erreur")
            } else {
                router.push(`/auditeur/audits/${result.auditId}/finalisation`)
                router.refresh()
            }
        } catch {
            setError("Une erreur est survenue")
        } finally {
            setIsSubmitting(false)
        }
    }

    const documentsChecked = documents.filter(d => d.checked).length
    const risksChecked = risks.filter(r => r.checked).length
    const docScore = documents.length > 0 ? Math.round((documentsChecked / documents.length) * 100) : 0
    const overallScore = Math.max(0, docScore - risksChecked * 3)

    // Grouper risques par catégorie
    const risksByCategory: Record<string, { label: string; items: RisqueItem[] }> = {}
    for (const r of risks) {
        if (!risksByCategory[r.categorie]) {
            risksByCategory[r.categorie] = {
                label: r.categorie.charAt(0) + r.categorie.slice(1).toLowerCase().replace("_", " "),
                items: []
            }
        }
        risksByCategory[r.categorie].items.push(r)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-8 max-w-5xl mx-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link href="/auditeur/audits">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Nouvel audit</h1>
                            <p className="text-sm text-slate-500 mt-1">Réaliser un audit de conformité terrain</p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between bg-white rounded-lg border p-6">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = step.completed
                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-500" : isActive ? "bg-blue-600" : "bg-slate-200"}`}>
                                            {isCompleted
                                                ? <Check className="h-6 w-6 text-white" />
                                                : <Icon className={`h-6 w-6 ${isActive ? "text-white" : "text-slate-400"}`} />}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${isActive || isCompleted ? "text-slate-900" : "text-slate-400"}`}>{step.label}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-0.5 flex-1 -mt-6 ${isCompleted ? "bg-green-500" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Step Content */}
                    <div className="bg-white rounded-lg border p-8">

                        {/* Étape 1 : Entreprise */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Sélection de l'entreprise</h2>
                                    <p className="text-sm text-slate-500">Choisissez parmi vos clients ou créez-en un nouveau</p>
                                </div>

                                <div className="space-y-2 max-w-2xl">
                                    <div className="flex items-center justify-between">
                                        <Label>Entreprise *</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => setShowNewClient(true)}
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                            Créer un nouveau client
                                        </Button>
                                    </div>
                                    <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Sélectionner un client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {localClients.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedClient && (
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 max-w-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{selectedClient.name}</p>
                                                {selectedClient.metierCode && (
                                                    <p className="text-sm text-slate-600 mt-0.5">
                                                        Métier : <Badge variant="secondary" className="text-xs">{selectedClient.metierCode}</Badge>
                                                        {" "}— les risques seront chargés automatiquement
                                                    </p>
                                                )}
                                                {!selectedClient.metierCode && (
                                                    <p className="text-xs text-amber-600 mt-0.5">Aucun métier associé — risques génériques utilisés</p>
                                                )}
                                                {selectedClient.address && (
                                                    <p className="text-xs text-slate-500 mt-0.5">{selectedClient.address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Étape 2 : Documents */}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-1">Vérification documentaire</h2>
                                <p className="text-sm text-slate-500 mb-6">Cochez les documents présents et conformes chez {selectedClient?.name}</p>

                                <div className="space-y-3 mb-6">
                                    {documents.map(doc => (
                                        <div
                                            key={doc.id}
                                            className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${doc.checked ? "bg-green-50 border-green-200" : "border-slate-200 hover:bg-slate-50"}`}
                                            onClick={() => handleDocumentToggle(doc.id)}
                                        >
                                            <Checkbox
                                                checked={doc.checked}
                                                onClick={(e) => e.stopPropagation()}
                                                onCheckedChange={(checked) => handleDocumentChecked(doc.id, checked === true)}
                                            />
                                            <span className="flex-1 text-sm font-medium">{doc.label}</span>
                                            {doc.checked && <Check className="h-4 w-4 text-green-600" />}
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-900">Documents conformes</span>
                                        <span className="text-sm font-semibold">{documentsChecked}/{documents.length}</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${docScore}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Étape 3 : Risques */}
                        {currentStep === 3 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-1">Évaluation des risques</h2>
                                <p className="text-sm text-slate-500 mb-6">
                                    {selectedClient?.metierCode
                                        ? `Risques chargés depuis la base pour le métier : ${selectedClient.metierCode}`
                                        : "Risques génériques — associez un métier à cette entreprise pour des risques personnalisés"
                                    }
                                </p>

                                {loadingRisks ? (
                                    <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Chargement des risques en cours...
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {Object.entries(risksByCategory).map(([catCode, cat]) => (
                                            <div key={catCode}>
                                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />
                                                    Risques {cat.label}
                                                </h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {cat.items.map(risk => (
                                                        <div
                                                            key={risk.id}
                                                            className={`p-3 rounded-lg border transition-colors ${risk.checked ? "bg-orange-50 border-orange-200" : "border-slate-200 hover:bg-slate-50"}`}
                                                        >
                                                            <div className="flex items-start gap-2 cursor-pointer" onClick={() => handleRiskToggle(risk.id)}>
                                                                <Checkbox
                                                                    checked={risk.checked}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onCheckedChange={(checked) => handleRiskChecked(risk.id, checked === true)}
                                                                    className="mt-0.5"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium leading-tight">{risk.label}</p>
                                                                    {risk.utNom && risk.utNom !== "Général" && (
                                                                        <p className="text-xs text-slate-400 mt-0.5">{risk.utNom}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {risk.checked && (
                                                                <div className="mt-3 space-y-3">
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <Label className="text-xs">Gravité (1-5)</Label>
                                                                            <Select
                                                                                value={String(risk.gravite)}
                                                                                onValueChange={v => handleRiskValue(risk.id, "gravite", parseInt(v))}
                                                                            >
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
                                                                            <Select
                                                                                value={String(risk.frequence)}
                                                                                onValueChange={v => handleRiskValue(risk.id, "frequence", parseInt(v))}
                                                                            >
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
                                                                    {/* Niveau de maîtrise */}
                                                                    <div>
                                                                        <Label className="text-xs">Maîtrise</Label>
                                                                        <Select
                                                                            value={risk.niveauMaitrise || "Aucune"}
                                                                            onValueChange={v => handleRiskMaitrise(risk.id, v)}
                                                                        >
                                                                            <SelectTrigger className="h-8 mt-1 text-xs">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                {NIVEAUX_MAITRISE.map(nm => (
                                                                                    <SelectItem key={nm} value={nm} className="text-xs">
                                                                                        {NIVEAUX_MAITRISE_LABELS[nm]}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    {/* Calcul résiduel */}
                                                                    {(() => {
                                                                        const { risqueBrut, risqueResiduel, prioriteAction } = calcIndicateurs(risk.frequence, risk.gravite, risk.niveauMaitrise || "Aucune")
                                                                        const c = prioriteAction === "Critique" ? "text-red-600" : prioriteAction === "Élevé" ? "text-amber-600" : prioriteAction === "Modéré" ? "text-orange-600" : "text-green-600"
                                                                        return (
                                                                            <div className={`text-xs rounded p-1.5 flex gap-3 font-medium ${c} bg-opacity-10 bg-current`}>
                                                                                Brut: {risqueBrut} → Rés: {risqueResiduel} — <span className="font-bold">{prioriteAction}</span>
                                                                            </div>
                                                                        )
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Étape 4 : Synthèse */}
                        {currentStep === 4 && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-1">Synthèse de l'audit</h2>
                                <p className="text-sm text-slate-500 mb-6">Vérifiez les informations avant de finaliser l'audit</p>

                                <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
                                    <p className="text-sm text-slate-600 mb-2">Score de conformité estimé</p>
                                    <p className={`text-5xl font-bold mb-1 ${overallScore >= 80 ? "text-green-600" : overallScore >= 50 ? "text-orange-500" : "text-red-600"}`}>
                                        {overallScore}%
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {overallScore >= 80 ? "Bonne conformité" : overallScore >= 50 ? "Conformité partielle" : "Non conforme — actions à prendre"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-600 mb-1">Entreprise auditée</p>
                                        <p className="font-semibold text-slate-900">{selectedClient?.name || "—"}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-600 mb-1">Documents conformes</p>
                                        <p className="text-2xl font-bold text-slate-900">{documentsChecked}/{documents.length}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <p className="text-sm text-slate-600 mb-1">Risques identifiés</p>
                                        <p className="text-2xl font-bold text-slate-900">{risksChecked}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="commentaire">Observations générales</Label>
                                    <Textarea
                                        id="commentaire"
                                        placeholder="Commentaires, recommandations, actions correctives suggérées..."
                                        value={commentaire}
                                        onChange={e => setCommentaire(e.target.value)}
                                        className="mt-1.5 min-h-[110px]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Étape 5 : Proposition d'abonnement */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-1">Proposition d'abonnement</h2>
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

                            </div>

                            <div className="p-4 rounded-xl border-2 border-slate-100 bg-white space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                        <Euro className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Montant personnalisé</h3>
                                        <p className="text-sm text-slate-500">Saisissez un montant libre</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Ex: 50.00"
                                        className="pl-10 h-11"
                                        value={proposedPrice}
                                        onChange={(e) => {
                                            setProposedPrice(e.target.value)
                                            if (e.target.value) setProposedPlanCode("")
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                onClick={() => {
                                    setProposedPlanCode("")
                                    setProposedPrice("")
                                }}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${proposedPlanCode === "" && !proposedPrice
                                    ? "border-slate-600 bg-slate-50 shadow-md"
                                    : "border-slate-100 hover:border-slate-200 bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${proposedPlanCode === "" && !proposedPrice ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                        <MinusCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Ne rien proposer</h3>
                                        <p className="text-sm text-slate-500">Finaliser sans offre</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    {error && <p className="text-sm text-red-600 flex-1 mr-4">{error}</p>}
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as Step)}
                        disabled={currentStep === 1 || isSubmitting}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                            if (currentStep < 5) {
                                setCurrentStep((currentStep + 1) as Step)
                            } else {
                                handleSubmit()
                            }
                        }}
                        disabled={isSubmitting || (currentStep === 1 && !selectedClientId)}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Création...</>
                        ) : currentStep === 5 ? (
                            <><Check className="h-4 w-4 mr-2" />Finaliser l'audit</>
                        ) : (
                            <>Suivant<ArrowRight className="h-4 w-4 ml-2" /></>
                        )}
                    </Button>
                </div>

                {/* Modal Nouveau Client */}
                <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Créer un nouveau client
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1 col-span-2">
                                    <Label>Raison sociale *</Label>
                                    <Input
                                        value={newClient.name}
                                        onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                        placeholder="Ex: Restaurant Le Petit Paris"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>SIRET</Label>
                                    <Input
                                        value={newClient.siret}
                                        onChange={e => setNewClient({ ...newClient, siret: e.target.value })}
                                        placeholder="123 456 789 00012"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={newClient.email}
                                        onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                        placeholder="contact@ent.fr"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Téléphone</Label>
                                    <Input
                                        value={newClient.phone}
                                        onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                                        placeholder="01 23 45 67 89"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Nb salariés</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={newClient.employeeCount}
                                        onChange={e => setNewClient({ ...newClient, employeeCount: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <Label>Adresse *</Label>
                                    <Input
                                        value={newClient.address}
                                        onChange={e => setNewClient({ ...newClient, address: e.target.value })}
                                        placeholder="123 rue de la Paix"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Code postal</Label>
                                    <Input
                                        value={newClient.postalCode}
                                        onChange={e => setNewClient({ ...newClient, postalCode: e.target.value })}
                                        placeholder="75001"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Ville *</Label>
                                    <Input
                                        value={newClient.city}
                                        onChange={e => setNewClient({ ...newClient, city: e.target.value })}
                                        placeholder="Paris"
                                    />
                                </div>
                                {metiers.length > 0 && (
                                    <div className="space-y-1 col-span-2">
                                        <Label>Métier</Label>
                                        <Select
                                            value={newClient.metierCode}
                                            onValueChange={v => setNewClient({ ...newClient, metierCode: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un métier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {metiers.map(m => (
                                                    <SelectItem key={m.code} value={m.code}>{m.nom}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowNewClient(false)}>Annuler</Button>
                            <Button
                                onClick={handleCreateClient}
                                disabled={creatingClient || !newClient.name || !newClient.address || !newClient.city}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {creatingClient
                                    ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Création...</>
                                    : "Créer et sélectionner"
                                }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    )
}
