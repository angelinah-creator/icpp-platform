"use client"

import { useState, useEffect } from "react"
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
import { updateReglementation } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface Reglementation {
    id: string
    titre: string
    description: string
    type: string
    isActive: boolean
    enVigueur: string
    metiers: string[]
}

interface EditReglementationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    reglementation: Reglementation | null
}

export function EditReglementationModal({ open, onOpenChange, onSuccess, reglementation }: EditReglementationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isImpactDuerp, setIsImpactDuerp] = useState(true)
    const [isActif, setIsActif] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [type, setType] = useState("DUERP")
    const router = useRouter()

    useEffect(() => {
        if (reglementation && open) {
            setType(reglementation.type)
            setIsActif(reglementation.isActive)
        }
    }, [reglementation, open])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!reglementation) return

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await updateReglementation(reglementation.id, {
                titre: formData.get("titre") as string,
                description: formData.get("description") as string || undefined,
                type: type,
                dateVigueur: formData.get("date") ? new Date(formData.get("date") as string) : undefined,
                impactDuerp: isImpactDuerp,
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
            setError("Une erreur est survenue lors de la modification")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!reglementation) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-semibold">
                        Modifier l'obligation
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Titre de l'obligation */}
                    <div className="space-y-2">
                        <Label htmlFor="titre" className="text-sm font-medium text-slate-700">Titre de l'obligation</Label>
                        <Input
                            id="titre"
                            name="titre"
                            defaultValue={reglementation.titre}
                            placeholder="Ex: DUERP obligatoire"
                            required
                            className="bg-white"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={reglementation.description}
                            placeholder="Description de l'obligation légale"
                            rows={3}
                            className="bg-white resize-none"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium text-slate-700">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DUERP">DUERP</SelectItem>
                                <SelectItem value="CODE_TRAVAIL">Code du travail</SelectItem>
                                <SelectItem value="CONVENTION">Convention collective</SelectItem>
                                <SelectItem value="AUTRE">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date d'entrée en vigueur */}
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-medium text-slate-700">Date d'entrée en vigueur</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={reglementation.enVigueur}
                            className="bg-white"
                        />
                    </div>

                    {/* Impact DUERP */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-slate-700">Impact DUERP</Label>
                            <p className="text-xs text-slate-500">Cette obligation impacte-t-elle le document unique</p>
                        </div>
                        <Switch
                            checked={isImpactDuerp}
                            onCheckedChange={setIsImpactDuerp}
                        />
                    </div>

                    {/* Statut */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-slate-700">Statut actif</Label>
                            <p className="text-xs text-slate-500">Désactiver pour archiver</p>
                        </div>
                        <Switch
                            checked={isActif}
                            onCheckedChange={setIsActif}
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
                            {isSubmitting ? "Modification..." : "Modifier"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
