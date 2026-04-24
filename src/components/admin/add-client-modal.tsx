"use client"

import { useState, useEffect } from "react"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { createCompany } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface AddClientModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    metiers?: { code: string; nom: string }[]
    plans?: { code: string; nom: string; prix: number }[]
}

interface UT {
    id: string
    nom: string
    description: string | null
}

export function AddClientModal({ open, onOpenChange, onSuccess, metiers = [], plans = [] }: AddClientModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedMetier, setSelectedMetier] = useState("")
    const router = useRouter()

    // Unités de Travail
    const [availableUTs, setAvailableUTs] = useState<UT[]>([])
    const [selectedUTIds, setSelectedUTIds] = useState<string[]>([])
    const [isLoadingUTs, setIsLoadingUTs] = useState(false)

    useEffect(() => {
        if (!selectedMetier) {
            setAvailableUTs([])
            setSelectedUTIds([])
            return
        }
        setIsLoadingUTs(true)
        fetch(`/api/metier/${encodeURIComponent(selectedMetier)}/uts`)
            .then(res => res.json())
            .then((uts: UT[]) => {
                setAvailableUTs(uts)
                setSelectedUTIds(uts.map(ut => ut.id))
            })
            .catch(err => console.error("Erreur chargement UTs:", err))
            .finally(() => setIsLoadingUTs(false))
    }, [selectedMetier])

    const handleUTToggle = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedUTIds(prev => [...prev, id])
        } else {
            setSelectedUTIds(prev => prev.filter(utId => utId !== id))
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createCompany({
                name: formData.get("raisonSociale") as string,
                siret: formData.get("siret") as string || undefined,
                email: formData.get("email") as string || undefined,
                phone: formData.get("telephone") as string || undefined,
                address: formData.get("adresse") as string || undefined,
                postalCode: formData.get("codePostal") as string || undefined,
                city: formData.get("ville") as string || undefined,
                metierCode: selectedMetier || undefined,
                employeeCount: parseInt(formData.get("nombreSalaries") as string) || 1,
                planCode: formData.get("formule") as string || undefined,
                selectedUtIds: selectedUTIds,
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                setSelectedMetier("")
                setAvailableUTs([])
                setSelectedUTIds([])
                onOpenChange(false)
                onSuccess?.()
                router.refresh()
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la création")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-600" />
                        Ajouter un nouveau client
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* INFORMATIONS ENTREPRISES */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            INFORMATIONS ENTREPRISES
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="raisonSociale" className="text-sm">Raison sociale *</Label>
                                <Input
                                    id="raisonSociale"
                                    name="raisonSociale"
                                    placeholder="Nom de l'entreprise"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nomCommercial" className="text-sm">Nom commercial</Label>
                                <Input
                                    id="nomCommercial"
                                    name="nomCommercial"
                                    placeholder="Nom commercial (optionnel)"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="siret" className="text-sm">SIRET</Label>
                                <Input
                                    id="siret"
                                    name="siret"
                                    placeholder="123 456 789 00012"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="codeApe" className="text-sm">Code APE</Label>
                                <Input
                                    id="codeApe"
                                    name="codeApe"
                                    placeholder="9602A"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ACTIVITE */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            ACTIVITE
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="metier" className="text-sm">Métier *</Label>
                                <select
                                    id="metier"
                                    name="metier"
                                    value={selectedMetier}
                                    onChange={(e) => setSelectedMetier(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">Sélectionner un métier</option>
                                    {metiers.length > 0 ? (
                                        metiers.map((m) => (
                                            <option key={m.code} value={m.code}>{m.nom}</option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="COIFFURE">Coiffure</option>
                                            <option value="RESTAURATION">Restauration</option>
                                            <option value="BOULANGERIE">Boulangerie</option>
                                            <option value="GARAGE">Garage automobile</option>
                                            <option value="ESTHETIQUE">Esthétique</option>
                                            <option value="COMMERCE">Commerce</option>
                                            <option value="BATIMENT">Bâtiment</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activiteDetaillee" className="text-sm">Activité détaillée</Label>
                                <Input
                                    id="activiteDetaillee"
                                    name="activiteDetaillee"
                                    placeholder="Coiffure, mixte, soins ..."
                                />
                            </div>
                        </div>

                        {/* Unités de travail dynamiques */}
                        {selectedMetier && (
                            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                <div>
                                    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                        Unités de travail présentes dans l&apos;établissement
                                    </Label>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Cochez les unités réellement présentes. Elles définiront la base du DUERP.
                                    </p>
                                </div>
                                {isLoadingUTs ? (
                                    <div className="text-sm text-slate-400">Chargement...</div>
                                ) : availableUTs.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {availableUTs.map((ut) => (
                                            <div key={ut.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`modal-ut-${ut.id}`}
                                                    checked={selectedUTIds.includes(ut.id)}
                                                    onCheckedChange={(checked) => handleUTToggle(ut.id, checked as boolean)}
                                                />
                                                <label
                                                    htmlFor={`modal-ut-${ut.id}`}
                                                    className="text-sm font-medium cursor-pointer leading-none"
                                                >
                                                    {ut.nom}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-amber-600">Aucune unité de travail configurée pour ce métier.</div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="nombreSalaries" className="text-sm">Nombre de salariés *</Label>
                            <Input
                                id="nombreSalaries"
                                name="nombreSalaries"
                                type="number"
                                placeholder="1"
                                defaultValue="1"
                                className="w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            CONTACT
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm">Adresse e-mail *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="contact@entreprise.fr"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telephone" className="text-sm">Téléphone</Label>
                                <Input
                                    id="telephone"
                                    name="telephone"
                                    type="tel"
                                    placeholder="01 23 45 67 89"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nomDirigeant" className="text-sm">Nom du dirigeant</Label>
                                <Input
                                    id="nomDirigeant"
                                    name="nomDirigeant"
                                    placeholder="Dupont"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prenomDirigeant" className="text-sm">Prénom du dirigeant</Label>
                                <Input
                                    id="prenomDirigeant"
                                    name="prenomDirigeant"
                                    placeholder="Jean"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ADRESSE */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            ADRESSE
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="adresse" className="text-sm">Adresse</Label>
                            <Input
                                id="adresse"
                                name="adresse"
                                placeholder="124 rue de Paris"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="codePostal" className="text-sm">Code postal</Label>
                                <Input
                                    id="codePostal"
                                    name="codePostal"
                                    placeholder="75001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ville" className="text-sm">Ville</Label>
                                <Input
                                    id="ville"
                                    name="ville"
                                    placeholder="Paris"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ABONNEMENT */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            ABONNEMENT
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="formule" className="text-sm">Formule</Label>
                            <Select name="formule">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une formule" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.length > 0 ? (
                                        plans.map((p) => (
                                            <SelectItem key={p.code} value={p.code}>
                                                {p.nom} - {p.prix}€/mois
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="ESSENTIEL">Essentiel - 29€/mois</SelectItem>
                                            <SelectItem value="PRO">Pro - 49€/mois</SelectItem>
                                            <SelectItem value="PREMIUM">Premium - 79€/mois</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="commentaire" className="text-sm">Commentaire interne</Label>
                            <Textarea
                                id="commentaire"
                                name="commentaire"
                                placeholder="Notes internes sur ce client ..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                        >
                            {isSubmitting ? "Création..." : "Créer le client"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
