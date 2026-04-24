"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Eye, Edit, Building2, Check, Mail, Phone, MapPin, Save, X, MessageSquare } from "lucide-react"
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
import { NotificationBell } from "@/components/notifications/notification-bell"


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

function getConformityBadge(status?: string) {
    // Mock logic or real data if available. For now using random or derived if not present.
    // In a real scenario, this would come from the backend.
    // Mapping typical statuses to the mockup's badges.
    switch (status) {
        case "Conforme":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 font-medium">Conforme</Badge>
        case "Partiellement conforme":
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0 font-medium">Partiellement conforme</Badge>
        case "Non conforme":
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 font-medium">Non conforme</Badge>
        default:
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 font-medium">Conforme</Badge>
    }
}

function getDuerpBadge(status: string) {
    switch (status) {
        case "Signé":
        case "À jour":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 font-medium">A jour</Badge>
        case "Brouillon":
        case "En cours":
        case "En attente":
            return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-0 font-medium">En cours</Badge>
        default:
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 font-medium">{status || "A faire"}</Badge>
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
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Entreprises clientes</h1>
                        <p className="text-slate-500 mt-1">Consultez les fiches entreprises et leur historique</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Rechercher ..." className="pl-10 w-[300px] bg-slate-50 border-slate-200" />
                        </div>
                        {/* Notifications */}
                        <div className="relative">
                            <NotificationBell />
                        </div>

                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                <div className="space-y-6 relative">
                    {/* Search and Filters */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher ..."
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" className="bg-slate-50 border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                        </Button>
                    </div>

                    {/* Clients Table */}
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                    <TableHead className="font-semibold text-slate-900 py-4">Entreprises</TableHead>
                                    <TableHead className="font-semibold text-slate-900 py-4">Activité</TableHead>
                                    <TableHead className="font-semibold text-slate-900 py-4">Effectif</TableHead>
                                    <TableHead className="font-semibold text-slate-900 py-4">Statut conformité</TableHead>
                                    <TableHead className="font-semibold text-slate-900 py-4">DUERP</TableHead>
                                    <TableHead className="font-semibold text-slate-900 py-4 text-right">Actions</TableHead>
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
                                    filteredClients.map((client, index) => (
                                        <TableRow key={client.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{client.name}</span>
                                                    <span className="text-xs text-slate-500">{client.email || "marie@saloncoiffure.fr"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="text-slate-700 font-medium">{client.metier}</span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round opacity-70"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.57-5.27-9.82" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                                    <span className="font-medium">{client.employeeCount}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {/* Mocking conformity status based on index as requested by layout visual matching */}
                                                {getConformityBadge(["Conforme", "Partiellement conforme", "Non conforme", "Conforme", "Partiellement conforme"][index % 5])}
                                            </TableCell>
                                            <TableCell className="py-4">{getDuerpBadge(client.duerpStatus)}</TableCell>
                                            <TableCell className="text-right py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`/auditeur/entreprises/${client.id}`}>
                                                                Voir la fiche
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="cursor-pointer text-amber-600 focus:text-amber-600">
                                                            <Link href={`/auditeur/entreprises/${client.id}#notes-internes`} className="flex items-center gap-2">
                                                                <MessageSquare className="h-4 w-4" />
                                                                Notes internes
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`/auditeur/entreprises/${client.id}?edit=true`}>
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
                                    <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#4A7FFF] hover:bg-[#3968E6]">
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSubmitting ? "Création..." : "Créer le client"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {showSuccessToast && (
                        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{toastMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
