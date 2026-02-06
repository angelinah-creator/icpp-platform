"use client"

import { useState } from "react"
import { Calendar, Building2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import { planifierAudit } from "@/server/actions/admin"

interface Company {
    id: string
    nom: string
}

interface Auditor {
    id: string
    nom: string
}

interface PlanifierAuditModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    companies: Company[]
    auditors: Auditor[]
    onSuccess?: () => void
}

export function PlanifierAuditModal({
    open,
    onOpenChange,
    companies,
    auditors,
    onSuccess
}: PlanifierAuditModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        companyId: "",
        auditorId: "",
        type: "",
        dateAudit: ""
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const result = await planifierAudit({
                companyId: formData.companyId,
                auditorId: formData.auditorId,
                type: formData.type,
                dateAudit: new Date(formData.dateAudit)
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                onOpenChange(false)
                setFormData({ companyId: "", auditorId: "", type: "", dateAudit: "" })
                onSuccess?.()
            }
        } catch (err) {
            setError("Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Planifier un audit
                    </DialogTitle>
                    <DialogDescription>
                        Programmez un nouvel audit pour une entreprise cliente
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="company">Entreprise *</Label>
                        <Select
                            value={formData.companyId}
                            onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une entreprise" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                        {company.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="auditor">Auditeur assigné *</Label>
                        <Select
                            value={formData.auditorId}
                            onValueChange={(value) => setFormData({ ...formData, auditorId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un auditeur" />
                            </SelectTrigger>
                            <SelectContent>
                                {auditors.map((auditor) => (
                                    <SelectItem key={auditor.id} value={auditor.id}>
                                        {auditor.nom}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type d'audit *</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INITIAL">Audit initial</SelectItem>
                                <SelectItem value="SUIVI_ANNUEL">Suivi annuel</SelectItem>
                                <SelectItem value="EXCEPTIONNEL">Exceptionnel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date de l'audit *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.dateAudit}
                            onChange={(e) => setFormData({ ...formData, dateAudit: e.target.value })}
                            required
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#2048BF] to-[#679CFF]"
                            disabled={loading || !formData.companyId || !formData.auditorId || !formData.type || !formData.dateAudit}
                        >
                            {loading ? "Planification..." : "Planifier l'audit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
