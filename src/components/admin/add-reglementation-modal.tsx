"use client"

import { useState } from "react"
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
import { createReglementation } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface AddReglementationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddReglementationModal({ open, onOpenChange, onSuccess }: AddReglementationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isImpactDuerp, setIsImpactDuerp] = useState(true)
    const [isActif, setIsActif] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [type, setType] = useState("DUERP")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createReglementation({
                titre: formData.get("titre") as string,
                description: formData.get("description") as string || undefined,
                type: type,
                dateVigueur: new Date(formData.get("date") as string),
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
                        Ajouter une obligation
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
                        <Label htmlFor="titre" className="text-sm font-medium text-slate-700">Titre de l&apos;obligation</Label>
                        <Input
                            id="titre"
                            name="titre"
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
                            placeholder="Description de l'obligation..."
                            className="bg-white min-h-[80px]"
                        />
                    </div>

                    {/* Type et Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium text-slate-700">Type d&apos;obligation</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DUERP">DUERP</SelectItem>
                                    <SelectItem value="CODE_TRAVAIL">Code du travail</SelectItem>
                                    <SelectItem value="CONVENTION">Convention collective</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium text-slate-700">Date d&apos;entrée en vigueur</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                className="bg-white"
                            />
                        </div>
                    </div>

                    {/* Impact DUERP switch */}
                    <div className="flex items-center justify-between py-2 border-t mt-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="impact-duerp" className="text-sm font-medium text-slate-900">Impact DUERP</Label>
                            <p className="text-xs text-slate-500">Cette obligation impacte-t-elle le DUERP ?</p>
                        </div>
                        <Switch
                            id="impact-duerp"
                            checked={isImpactDuerp}
                            onCheckedChange={setIsImpactDuerp}
                        />
                    </div>

                    {/* Obligation active switch */}
                    <div className="flex items-center justify-between py-2 border-t">
                        <Label htmlFor="obligation-active" className="text-sm font-medium text-slate-900">Obligation active</Label>
                        <Switch
                            id="obligation-active"
                            checked={isActif}
                            onCheckedChange={setIsActif}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90 mt-4"
                    >
                        {isSubmitting ? "Ajout en cours..." : "Ajouter l'obligation"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
