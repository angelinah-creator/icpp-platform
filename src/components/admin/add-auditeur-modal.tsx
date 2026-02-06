"use client"

import { useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createAuditor } from "@/server/actions/admin"
import { useRouter } from "next/navigation"
import { UserPlus, Mail, Phone, User } from "lucide-react"

interface AddAuditeurModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function AddAuditeurModal({ open, onOpenChange, onSuccess }: AddAuditeurModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [role, setRole] = useState<string>("AUDITEUR")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createAuditor({
                nom: formData.get("nom") as string,
                prenom: formData.get("prenom") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string || undefined,
                role: role as "AUDITEUR" | "COMMERCIAL"
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                onOpenChange(false)
                setRole("AUDITEUR")
                onSuccess?.()
                router.refresh()
            }
        } catch {
            setError("Une erreur est survenue lors de la création")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) setRole("AUDITEUR")
            onOpenChange(open)
        }}>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Nouvel auditeur / commercial
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Rôle *</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AUDITEUR">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                                        Auditeur ICPP
                                    </div>
                                </SelectItem>
                                <SelectItem value="COMMERCIAL">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        Commercial
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="prenom" className="text-sm font-medium text-slate-700">Prénom *</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="prenom"
                                    name="prenom"
                                    placeholder="Jean"
                                    required
                                    className="pl-10 bg-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nom" className="text-sm font-medium text-slate-700">Nom *</Label>
                            <Input
                                id="nom"
                                name="nom"
                                placeholder="Dupont"
                                required
                                className="bg-white"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@icpp.fr"
                                required
                                className="pl-10 bg-white"
                            />
                        </div>
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Téléphone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="06 00 00 00 00"
                                className="pl-10 bg-white"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">
                        Un email sera envoyé avec les identifiants de connexion temporaires.
                    </p>

                    <DialogFooter className="pt-2">
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
                            {isSubmitting ? "Création..." : "Créer le compte"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
