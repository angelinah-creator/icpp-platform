"use client"

import { useState } from "react"
import { Plus, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createMetier } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface AddMetierModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddMetierModal({ open, onOpenChange, onSuccess }: AddMetierModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isActif, setIsActif] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const nom = formData.get("nom") as string

        try {
            const result = await createMetier({
                code: nom.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, ""),
                nom: nom,
                description: (formData.get("description") as string) || "",
                isActive: isActif,
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
            <DialogContent className="max-w-lg">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-semibold">
                        Ajouter un métier
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Nom du métier et Statut réglementaire */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-sm font-medium text-slate-700">Nom du métier</Label>
                            <Input
                                id="nom"
                                name="nom"
                                placeholder="Ex: Coiffure/Barbier"
                                required
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="statut" className="text-sm font-medium text-slate-700">Statut réglementaire</Label>
                            <Select defaultValue="actif">
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="actif">Actif</SelectItem>
                                    <SelectItem value="inactif">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Description du métier..."
                            className="bg-white min-h-[80px]"
                        />
                    </div>

                    {/* Risques standards */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Circle className="h-3 w-3 fill-orange-500 text-orange-500" />
                            <Label className="text-sm font-medium text-slate-700">Risques standards</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Description du métier..."
                                className="bg-white flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Mesures de prévention */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                            <Label className="text-sm font-medium text-slate-700">Mesures de prévention</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Ajouter une mesure..."
                                className="bg-white flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Obligations légales */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
                            <Label className="text-sm font-medium text-slate-700">Obligations légales</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Ajouter une obligation..."
                                className="bg-white flex-1"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Métier actif switch */}
                    <div className="flex items-center justify-between py-2">
                        <Label htmlFor="metier-actif" className="text-sm font-medium text-slate-700">Métier actif</Label>
                        <Switch
                            id="metier-actif"
                            checked={isActif}
                            onCheckedChange={setIsActif}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    >
                        {isSubmitting ? "Ajout en cours..." : "Ajouter le métier"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
