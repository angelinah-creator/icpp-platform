"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { createAffichage } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface AddAffichageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    companies: Array<{ id: string; name: string }>
}

const CATEGORY_CONFIGS: Record<string, { title: string; type: string; description: string; isLocked: boolean }> = {
    FICHE_1: {
        title: "Coordonnées & Informations obligatoires",
        type: "COORDONNEES",
        description: "Inspection du travail, médecine du travail, référent harcèlement, horaires, CSE, urgences",
        isLocked: false,
    },
    FICHE_2: {
        title: "Droits & Obligations — Textes juridiques",
        type: "DROITS_OBLIGATIONS",
        description: "Harcèlement sexuel/moral, discrimination, égalité F/H (texte verrouillé ICPP)",
        isLocked: true,
    },
    FICHE_3: {
        title: "Interdiction de fumer et de vapoter",
        type: "INTERDICTION_FUMER",
        description: "Affiche avec pictogrammes obligatoires",
        isLocked: true,
    },
    FICHE_4: {
        title: "Consignes de sécurité incendie",
        type: "CONSIGNES_INCENDIE",
        description: "Plan d'évacuation, numéros d'urgence, consignes",
        isLocked: true,
    },
}

export function AddAffichageModal({ open, onOpenChange, onSuccess, companies }: AddAffichageModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [category, setCategory] = useState("FICHE_1")
    const [selectedCompany, setSelectedCompany] = useState("")
    const router = useRouter()

    // Fiche 1 dynamic fields
    const [inspectionNom, setInspectionNom] = useState("")
    const [inspectionAdresse, setInspectionAdresse] = useState("")
    const [inspectionTelephone, setInspectionTelephone] = useState("")
    const [inspectionHoraires, setInspectionHoraires] = useState("")
    const [medecineNom, setMedecineNom] = useState("")
    const [medecineAdresse, setMedecineAdresse] = useState("")
    const [medecineTelephone, setMedecineTelephone] = useState("")
    const [medecinMedecin, setMedecinMedecin] = useState("")
    const [referentNom, setReferentNom] = useState("")
    const [referentTelephone, setReferentTelephone] = useState("")
    const [horairesCollectifs, setHorairesCollectifs] = useState("")

    const config = CATEGORY_CONFIGS[category]

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedCompany) {
            setError("Veuillez sélectionner une entreprise")
            return
        }

        setIsSubmitting(true)
        setError(null)

        let dynamicData: string | undefined
        if (category === "FICHE_1") {
            dynamicData = JSON.stringify({
                inspectionNom, inspectionAdresse, inspectionTelephone, inspectionHoraires,
                medecineNom, medecineAdresse, medecineTelephone, medecinMedecin,
                referentNom, referentTelephone, horairesCollectifs,
            })
        }

        try {
            const result = await createAffichage({
                type: config.type,
                category,
                title: config.title,
                description: config.description,
                companyId: selectedCompany,
                dynamicData,
                isLocked: config.isLocked,
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                onOpenChange(false)
                onSuccess?.()
                router.refresh()
                resetForm()
            }
        } catch {
            setError("Une erreur est survenue lors de la création")
        } finally {
            setIsSubmitting(false)
        }
    }

    function resetForm() {
        setSelectedCompany("")
        setCategory("FICHE_1")
        setInspectionNom(""); setInspectionAdresse(""); setInspectionTelephone(""); setInspectionHoraires("")
        setMedecineNom(""); setMedecineAdresse(""); setMedecineTelephone(""); setMedecinMedecin("")
        setReferentNom(""); setReferentTelephone(""); setHorairesCollectifs("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg font-semibold">
                        Nouvel affichage obligatoire
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Entreprise */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Entreprise</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Sélectionner une entreprise" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Type de fiche</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FICHE_1">Fiche 1 — Coordonnées & Informations</SelectItem>
                                <SelectItem value="FICHE_2">Fiche 2 — Droits & Obligations (verrouillé)</SelectItem>
                                <SelectItem value="FICHE_3">Fiche 3 — Interdiction fumer/vapoter (verrouillé)</SelectItem>
                                <SelectItem value="FICHE_4">Fiche 4 — Consignes sécurité incendie (verrouillé)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">{config.description}</p>
                    </div>

                    {/* Fiche 1 : formulaire coordonnées dynamiques */}
                    {category === "FICHE_1" && (
                        <div className="space-y-4 border border-blue-200 bg-blue-50/30 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-800">Coordonnées à renseigner</h3>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Inspection du travail</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Nom / Service</Label>
                                        <Input className="bg-white h-9 text-sm" value={inspectionNom} onChange={e => setInspectionNom(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Téléphone</Label>
                                        <Input className="bg-white h-9 text-sm" value={inspectionTelephone} onChange={e => setInspectionTelephone(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Adresse</Label>
                                    <Input className="bg-white h-9 text-sm" value={inspectionAdresse} onChange={e => setInspectionAdresse(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Horaires</Label>
                                    <Input className="bg-white h-9 text-sm" value={inspectionHoraires} onChange={e => setInspectionHoraires(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Médecine du travail</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Nom / Service</Label>
                                        <Input className="bg-white h-9 text-sm" value={medecineNom} onChange={e => setMedecineNom(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Téléphone</Label>
                                        <Input className="bg-white h-9 text-sm" value={medecineTelephone} onChange={e => setMedecineTelephone(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Adresse</Label>
                                    <Input className="bg-white h-9 text-sm" value={medecineAdresse} onChange={e => setMedecineAdresse(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Médecin du travail</Label>
                                    <Input className="bg-white h-9 text-sm" value={medecinMedecin} onChange={e => setMedecinMedecin(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Référent harcèlement</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Nom</Label>
                                        <Input className="bg-white h-9 text-sm" value={referentNom} onChange={e => setReferentNom(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Téléphone</Label>
                                        <Input className="bg-white h-9 text-sm" value={referentTelephone} onChange={e => setReferentTelephone(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Horaires collectifs</p>
                                <Textarea
                                    className="bg-white text-sm resize-none"
                                    rows={2}
                                    placeholder="Ex: Lundi-Vendredi 9h-17h"
                                    value={horairesCollectifs}
                                    onChange={e => setHorairesCollectifs(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Fiches verrouillées info */}
                    {category !== "FICHE_1" && (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-sm text-slate-600">
                                Cette fiche sera générée automatiquement avec le contenu juridique standard ICPP. Aucune saisie supplémentaire n'est nécessaire.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                        >
                            {isSubmitting ? "Création..." : "Créer l'affichage"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
