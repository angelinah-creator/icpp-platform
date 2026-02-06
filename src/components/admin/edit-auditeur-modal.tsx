"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { updateAuditor } from "@/server/actions/admin"

interface Auditor {
    id: string
    nom: string
    email: string
}

interface EditAuditeurModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    auditor: Auditor | null
    onSuccess?: () => void
}

export function EditAuditeurModal({
    open,
    onOpenChange,
    auditor,
    onSuccess
}: EditAuditeurModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: ""
    })

    useEffect(() => {
        if (auditor) {
            // Split full name into first and last name
            const nameParts = auditor.nom.split(" ")
            const prenom = nameParts[0] || ""
            const nom = nameParts.slice(1).join(" ") || ""

            setFormData({
                nom: nom,
                prenom: prenom,
                email: auditor.email || ""
            })
        }
    }, [auditor])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!auditor) return

        setIsSubmitting(true)
        setError(null)

        try {
            const result = await updateAuditor(auditor.id, {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <UserCog className="h-5 w-5 text-purple-600" />
                        Modifier l'auditeur
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom *</Label>
                            <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                placeholder="Dupont"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prenom">Prénom *</Label>
                            <Input
                                id="prenom"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                placeholder="Jean"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@icpp.fr"
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                        >
                            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
