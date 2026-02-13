"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Bell, Building2, Filter, Check, CheckCircle2, Clock, Archive, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { updateSignalementStatus, deleteSignalement } from "@/server/actions/admin"

interface Signalement {
    id: string
    entreprise: string
    type: string
    date: string
    statut: string
}

interface SignalementsClientProps {
    initialSignalements: Signalement[]
}

function getStatutBadge(statut: string) {
    switch (statut) {
        case "Traité":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">Traité</Badge>
        case "Nouveau":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">Nouveau</Badge>
        case "En cours":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal border-0">En cours</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

export function SignalementsClient({ initialSignalements }: SignalementsClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [detailModal, setDetailModal] = useState<Signalement | null>(null)

    function toast(message: string) {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    async function handleStatusChange(id: string, status: string, label: string) {
        setLoading(true)
        try {
            await updateSignalementStatus(id, status)
            toast(`Signalement marqué comme "${label}"`)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!deleteConfirm) return
        setLoading(true)
        try {
            await deleteSignalement(deleteConfirm)
            setDeleteConfirm(null)
            toast("Signalement supprimé")
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    const filteredSignalements = initialSignalements.filter(s =>
        s.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Signalements clients</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gérez les demandes de mise à jour des clients
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Rechercher ..." className="pl-10 w-48 bg-white" />
                    </div>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600" />
                        {initialSignalements.filter(s => s.statut === "Nouveau").length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                {initialSignalements.filter(s => s.statut === "Nouveau").length}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Search Bar and Filter */}
            <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-1 rounded-lg">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise ou type..."
                        className="pl-10 w-full bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Button variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                        <Filter className="h-4 w-4" />
                        Tous les statuts
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                            <TableHead className="py-4 font-semibold text-slate-900">Entreprise</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Type</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Date</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Statut</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSignalements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                    {searchQuery ? "Aucun signalement trouvé" : "Aucun signalement"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSignalements.map((signalement, index) => (
                                <TableRow key={`${signalement.id}-${index}`} className="hover:bg-slate-50/50 border-b">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">{signalement.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-slate-900 font-medium">{signalement.type}</TableCell>
                                    <TableCell className="py-4 text-slate-900 font-medium">{signalement.date}</TableCell>
                                    <TableCell className="py-4">{getStatutBadge(signalement.statut)}</TableCell>
                                    <TableCell className="py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => setDetailModal(signalement)}
                                                    className="cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir détails
                                                </DropdownMenuItem>
                                                {signalement.statut === "Nouveau" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(signalement.id, "EN_COURS", "En cours")}
                                                        className="cursor-pointer"
                                                    >
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        Prendre en charge
                                                    </DropdownMenuItem>
                                                )}
                                                {(signalement.statut === "Nouveau" || signalement.statut === "En cours") && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(signalement.id, "TRAITE", "Traité")}
                                                        className="cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Marquer traité
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteConfirm(signalement.id)}
                                                    className="text-red-600 cursor-pointer focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
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

            {/* Detail Modal */}
            <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Détails du signalement</DialogTitle>
                    </DialogHeader>
                    {detailModal && (
                        <div className="space-y-3 py-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Entreprise</span>
                                <span className="font-medium text-slate-900">{detailModal.entreprise}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Type</span>
                                <span className="font-medium text-slate-900">{detailModal.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-900">{detailModal.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Statut</span>
                                {getStatutBadge(detailModal.statut)}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailModal(null)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Voulez-vous vraiment supprimer ce signalement ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                        <Button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                            {loading ? "..." : "Supprimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Toast */}
            {showToast && (
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
