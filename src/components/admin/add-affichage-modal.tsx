"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { createAffichage } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface AddAffichageModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    companies: Array<{ id: string; name: string }>
}

export function AddAffichageModal({ open, onOpenChange, onSuccess, companies }: AddAffichageModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [type, setType] = useState("INSPECTION_TRAVAIL")
    const [selectedCompany, setSelectedCompany] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedCompany) {
            setError("Veuillez sélectionner une entreprise")
            return
        }

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createAffichage({
                type: type,
                title: formData.get("title") as string,
                description: formData.get("description") as string || undefined,
                companyId: selectedCompany,
                fileUrl: formData.get("fileUrl") as string || undefined,
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                onOpenChange(false)
                onSuccess?.()
                router.refresh()
                // Reset form
                setSelectedCompany("")
                setType("INSPECTION_TRAVAIL")
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
                        Nouvel affichage obligatoire
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium text-slate-700">Type d'affichage</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INSPECTION_TRAVAIL">Inspection du travail</SelectItem>
                                <SelectItem value="MEDECINE_TRAVAIL">Médecine du travail</SelectItem>
                                <SelectItem value="CONSIGNES_SECURITE">Consignes de sécurité</SelectItem>
                                <SelectItem value="HORAIRES_TRAVAIL">Horaires de travail</SelectItem>
                                <SelectItem value="AUTRE">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Titre */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-slate-700">Titre</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Ex: Inspection du travail - Paris"
                            required
                            className="bg-white"
                        />
                    </div>

                    {/* Entreprise */}
                    <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium text-slate-700">Entreprise</Label>
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Sélectionner une entreprise" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                        {company.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Description de l'affichage"
                            rows={3}
                            className="bg-white resize-none"
                        />
                    </div>

                    {/* URL fichier (optionnel) */}
                    <div className="space-y-2">
                        <Label htmlFor="fileUrl" className="text-sm font-medium text-slate-700">URL du fichier (optionnel)</Label>
                        <Input
                            id="fileUrl"
                            name="fileUrl"
                            type="url"
                            placeholder="https://..."
                            className="bg-white"
                        />
                    </div>

                    {/* Actions */}
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
                            {isSubmitting ? "Création..." : "Créer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
