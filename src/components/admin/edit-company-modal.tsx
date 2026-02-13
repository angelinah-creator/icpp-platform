"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { updateCompany } from "@/server/actions/admin"

interface Company {
    id: string
    nom: string
    email: string
    activite: string
    abonnement: string
    siret?: string
    phone?: string
    address?: string
    postalCode?: string
    city?: string
    metierCode?: string
    employeeCount?: number
}

interface EditCompanyModalProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    company: Company | null
    plans?: Plan[]
    metiers?: { code: string; nom: string }[]
    onSuccess?: () => void
    children?: React.ReactNode
}

interface Plan {
    code: string
    nom: string
    prix: number
}

export function EditCompanyModal({
    open,
    onOpenChange,
    company,
    plans = [],
    metiers = [],
    onSuccess,
    children
}: EditCompanyModalProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = open !== undefined && onOpenChange !== undefined
    const finalOpen = isControlled ? open : internalOpen
    const finalOnOpenChange = isControlled ? onOpenChange : setInternalOpen
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        siret: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        metierCode: "",
        employeeCount: 1
    })

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.nom || "",
                siret: company.siret || "",
                email: company.email || "",
                phone: company.phone || "",
                address: company.address || "",
                postalCode: company.postalCode || "",
                city: company.city || "",
                metierCode: company.metierCode || company.activite || "",
                employeeCount: company.employeeCount || 1
            })
        }
    }, [company])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!company) return

        setIsSubmitting(true)
        setError(null)

        try {
            const result = await updateCompany(company.id, {
                name: formData.name,
                siret: formData.siret || undefined,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                postalCode: formData.postalCode || undefined,
                city: formData.city || undefined,
                metierCode: formData.metierCode || undefined,
                employeeCount: formData.employeeCount
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                if (finalOnOpenChange) finalOnOpenChange(false)
                if (onSuccess) onSuccess()
                router.refresh()
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la modification")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={finalOpen} onOpenChange={finalOnOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        Modifier l'entreprise
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            INFORMATIONS ENTREPRISE
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Raison sociale *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siret">SIRET</Label>
                                <Input
                                    id="siret"
                                    value={formData.siret}
                                    onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                                    placeholder="123 456 789 00012"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contact@entreprise.fr"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="01 23 45 67 89"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="123 rue Example"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Code postal</Label>
                                <Input
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    placeholder="75001"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="Paris"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="metier">Métier</Label>
                                <Select
                                    value={formData.metierCode}
                                    onValueChange={(value) => setFormData({ ...formData, metierCode: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un métier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {metiers.map((metier) => (
                                            <SelectItem key={metier.code} value={metier.code}>
                                                {metier.nom}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="employeeCount">Nombre de salariés</Label>
                                <Input
                                    id="employeeCount"
                                    type="number"
                                    min="1"
                                    value={formData.employeeCount}
                                    onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => finalOnOpenChange && finalOnOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                        >
                            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
