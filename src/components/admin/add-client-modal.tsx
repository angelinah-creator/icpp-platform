"use client"

import { useState } from "react"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export function AddClientModal({ open, onOpenChange, onSuccess, metiers = [], plans = [] }: AddClientModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

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
                metierCode: formData.get("metier") as string || undefined,
                employeeCount: parseInt(formData.get("nombreSalaries") as string) || 1,
                planCode: formData.get("formule") as string || undefined
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
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
                                <Select name="metier" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un métier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {metiers.length > 0 ? (
                                            metiers.map((m) => (
                                                <SelectItem key={m.code} value={m.code}>{m.nom}</SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="COIFFURE">Coiffure</SelectItem>
                                                <SelectItem value="RESTAURATION">Restauration</SelectItem>
                                                <SelectItem value="BOULANGERIE">Boulangerie</SelectItem>
                                                <SelectItem value="GARAGE">Garage automobile</SelectItem>
                                                <SelectItem value="ESTHETIQUE">Esthétique</SelectItem>
                                                <SelectItem value="COMMERCE">Commerce</SelectItem>
                                                <SelectItem value="BATIMENT">Bâtiment</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
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
