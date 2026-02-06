"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Eye, Edit, Building2, Check, Mail, Phone, MapPin, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { createCompanyAsAuditeur } from "@/server/actions/client"

interface Client {
    id: string
    name: string
    email: string | null
    metier: string
    employeeCount: number
    subscription: string
    duerpStatus: string
    lastUpdate?: Date
}

interface EntreprisesClientProps {
    initialClients: Client[]
    metiers: Array<{ code: string; nom: string }>
}

function getDuerpBadge(status: string) {
    switch (status) {
        case "Signé":
        case "À jour":
            return <Badge className="bg-green-100 text-green-700">{status}</Badge>
        case "Brouillon":
        case "En cours":
            return <Badge className="bg-orange-100 text-orange-700">{status}</Badge>
        default:
            return <Badge className="bg-red-100 text-red-700">{status || "À faire"}</Badge>
    }
}

export function EntreprisesClient({ initialClients, metiers }: EntreprisesClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedMetier, setSelectedMetier] = useState("")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    const filteredClients = initialClients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.metier.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function showToast(message: string) {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createCompanyAsAuditeur({
                name: formData.get("name") as string,
                siret: formData.get("siret") as string || undefined,
                email: formData.get("email") as string || undefined,
                phone: formData.get("phone") as string || undefined,
                address: formData.get("address") as string,
                postalCode: formData.get("postalCode") as string || undefined,
                city: formData.get("city") as string,
                metierCode: selectedMetier || undefined,
                employeeCount: parseInt(formData.get("employeeCount") as string) || 1
            })

            if ('error' in result) {
                setError(result.error as string)
            } else {
                setIsCreateModalOpen(false)
                showToast("Client TPE créé avec succès")
                router.refresh()
            }
        } catch {
            setError("Une erreur est survenue")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Mes clients TPE</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {initialClients.length} entreprise{initialClients.length > 1 ? "s" : ""} accompagnée{initialClients.length > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher un client..."
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau client
                </Button>
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Entreprise</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Métier</TableHead>
                            <TableHead>Abonnement</TableHead>
                            <TableHead>DUERP</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                    {searchQuery ? "Aucun client trouvé" : "Aucun client TPE enregistré"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{client.name}</div>
                                                <div className="text-xs text-slate-500">{client.employeeCount} salarié{client.employeeCount > 1 ? "s" : ""}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{client.email || "-"}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-purple-100 text-purple-700">{client.metier}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-blue-100 text-blue-700">{client.subscription}</Badge>
                                    </TableCell>
                                    <TableCell>{getDuerpBadge(client.duerpStatus)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/auditeur/entreprises/${client.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Voir la fiche
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/auditeur/entreprises/${client.id}?edit=true`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Modifier
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Nouveau client TPE
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nom de l&apos;entreprise *</Label>
                                <Input name="name" placeholder="Boulangerie Martin" required />
                            </div>
                            <div className="space-y-2">
                                <Label>SIRET</Label>
                                <Input name="siret" placeholder="XXX XXX XXX XXXXX" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Métier *</Label>
                                <Select value={selectedMetier} onValueChange={setSelectedMetier} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {metiers.map(m => (
                                            <SelectItem key={m.code} value={m.code}>{m.nom}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Effectif</Label>
                                <Input name="employeeCount" type="number" min="1" defaultValue="1" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Adresse *</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input name="address" placeholder="10 rue du Commerce" className="pl-10" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Code postal</Label>
                                <Input name="postalCode" placeholder="75001" />
                            </div>
                            <div className="space-y-2">
                                <Label>Ville *</Label>
                                <Input name="city" placeholder="Paris" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input name="email" type="email" placeholder="contact@entreprise.fr" className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input name="phone" type="tel" placeholder="01 23 45 67 89" className="pl-10" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                                <X className="h-4 w-4 mr-2" />
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#2048BF] to-[#679CFF]">
                                <Save className="h-4 w-4 mr-2" />
                                {isSubmitting ? "Création..." : "Créer le client"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
