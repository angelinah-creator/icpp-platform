"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, Building, Mail, Phone, MapPin, User, Check, Building2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { createCompany } from "@/server/actions/admin"

interface NouveauClientFormProps {
    metiers: Array<{ code: string; nom: string }>
    plans: Array<{ code: string; nom: string; prix: number }>
}

interface UT {
    id: string
    nom: string
    description: string | null
}

export default function NouveauClientForm({ metiers, plans }: NouveauClientFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedMetier, setSelectedMetier] = useState<string>("")
    const [selectedPlan, setSelectedPlan] = useState<string>("")
    const [showSuccess, setShowSuccess] = useState(false)
    
    // Unités de travail state
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
                // Par défaut, toutes les UTs sont cochées
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
                name: formData.get("nom") as string,
                siret: formData.get("siret") as string || undefined,
                email: formData.get("email") as string || undefined,
                phone: formData.get("telephone") as string || undefined,
                address: formData.get("adresse") as string || undefined,
                postalCode: formData.get("codePostal") as string || undefined,
                city: formData.get("ville") as string || undefined,
                metierCode: selectedMetier || undefined,
                employeeCount: parseInt(formData.get("effectif") as string) || 1,
                planCode: selectedPlan || undefined,
                contactName: formData.get("contactNom") as string || undefined,
                contactRole: formData.get("contactFonction") as string || undefined,
                contactEmail: formData.get("contactEmail") as string || undefined,
                selectedUtIds: selectedUTIds,
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                setShowSuccess(true)
                setTimeout(() => {
                    router.push("/admin/entreprises")
                }, 1500)
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la création")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/entreprises">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Nouveau client TPE</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Créez une fiche pour une nouvelle entreprise cliente
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informations entreprise */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building className="h-5 w-5 text-blue-600" />
                                Informations entreprise
                            </CardTitle>
                            <CardDescription>
                                Détails de l&apos;entreprise cliente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nom">Nom de l&apos;entreprise *</Label>
                                <Input
                                    id="nom"
                                    name="nom"
                                    placeholder="Ex: Boulangerie Martin"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siret">Numéro SIRET</Label>
                                <Input
                                    id="siret"
                                    name="siret"
                                    placeholder="XXX XXX XXX XXXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="secteur">Métier / Secteur d&apos;activité *</Label>
                                <select
                                    id="secteur"
                                    value={selectedMetier}
                                    onChange={(e) => setSelectedMetier(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Sélectionnez un métier</option>
                                    {metiers.map(m => (
                                        <option key={m.code} value={m.code}>{m.nom}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Unités de travail dynamiques */}
                            {selectedMetier && (
                                <div className="space-y-3 p-4 bg-slate-50 border rounded-lg">
                                    <div>
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                            <Building2 className="h-4 w-4 text-blue-600" />
                                            Unités de travail présentes (Locaux)
                                        </Label>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Cochez les unités de travail réellement présentes dans cette entreprise. Elles définiront la base du DUERP.
                                        </p>
                                    </div>
                                    
                                    {isLoadingUTs ? (
                                        <div className="text-sm text-slate-400">Chargement des unités de travail...</div>
                                    ) : availableUTs.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                            {availableUTs.map((ut) => (
                                                <div key={ut.id} className="flex items-start space-x-2">
                                                    <Checkbox 
                                                        id={`ut-${ut.id}`} 
                                                        checked={selectedUTIds.includes(ut.id)}
                                                        onCheckedChange={(checked) => handleUTToggle(ut.id, checked as boolean)}
                                                    />
                                                    <div className="grid gap-1.5 leading-none">
                                                        <label 
                                                            htmlFor={`ut-${ut.id}`} 
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                        >
                                                            {ut.nom}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-amber-600">Aucune unité de travail configurée pour ce métier.</div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="effectif">Effectif (nombre de salariés)</Label>
                                <Input
                                    id="effectif"
                                    name="effectif"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    defaultValue="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Formule d&apos;abonnement</Label>
                                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une formule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans.map(p => (
                                            <SelectItem key={p.code} value={p.code}>
                                                {p.nom} - {p.prix}€/mois
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coordonnées */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                Coordonnées
                            </CardTitle>
                            <CardDescription>
                                Adresse et moyens de contact
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="adresse">Adresse *</Label>
                                <Input
                                    id="adresse"
                                    name="adresse"
                                    placeholder="Numéro et nom de rue"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="codePostal">Code postal *</Label>
                                    <Input
                                        id="codePostal"
                                        name="codePostal"
                                        placeholder="75001"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ville">Ville *</Label>
                                    <Input
                                        id="ville"
                                        name="ville"
                                        placeholder="Paris"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="telephone"
                                        name="telephone"
                                        type="tel"
                                        placeholder="01 23 45 67 89"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email professionnel</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="contact@entreprise.fr"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact principal */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-blue-600" />
                                Contact principal (optionnel)
                            </CardTitle>
                            <CardDescription>
                                Personne référente au sein de l&apos;entreprise
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="contactNom">Nom complet</Label>
                                    <Input
                                        id="contactNom"
                                        name="contactNom"
                                        placeholder="Jean Dupont"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactFonction">Fonction</Label>
                                    <Input
                                        id="contactFonction"
                                        name="contactFonction"
                                        placeholder="Gérant, Directeur, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Email du contact</Label>
                                    <Input
                                        id="contactEmail"
                                        name="contactEmail"
                                        type="email"
                                        placeholder="jean.dupont@entreprise.fr"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Link href="/admin/entreprises">
                        <Button type="button" variant="outline">
                            Annuler
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Création en cours..." : "Créer le client"}
                    </Button>
                </div>
            </form>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Client TPE créé avec succès</span>
                </div>
            )}
        </div>
    )
}
