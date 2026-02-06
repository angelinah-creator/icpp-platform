"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Check, Edit, Trash2, Power, UserCog, Briefcase, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AddAuditeurModal } from "@/components/admin/add-auditeur-modal"
import { EditAuditeurModal } from "@/components/admin/edit-auditeur-modal"
import { deleteAuditor, toggleAuditorStatus } from "@/server/actions/admin"

interface Auditor {
    id: string
    nom: string
    email: string
    role: string
    phone?: string | null
    dateCreation: string
    auditsCount: number
}

interface AuditeursClientProps {
    initialAuditors: Auditor[]
}

function getRoleBadge(role: string) {
    switch (role) {
        case "AUDITOR":
        case "AUDITEUR":
            return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 font-normal">Auditeur</Badge>
        case "COMMERCIAL":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal">Commercial</Badge>
        default:
            return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 font-normal">{role}</Badge>
    }
}

function getStatusBadge(role: string) {
    if (role === "INACTIVE") {
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 font-normal">Inactif</Badge>
    }
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">Actif</Badge>
}

export function AuditeursClient({ initialAuditors }: AuditeursClientProps) {
    const router = useRouter()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAuditor, setSelectedAuditor] = useState<Auditor | null>(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [auditorToDelete, setAuditorToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const filteredAuditors = initialAuditors.filter(a => {
        const matchesSearch =
            a.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = roleFilter === "all" ||
            (roleFilter === "AUDITOR" && (a.role === "AUDITOR" || a.role === "AUDITEUR")) ||
            (roleFilter === "COMMERCIAL" && a.role === "COMMERCIAL") ||
            (roleFilter === "INACTIVE" && a.role === "INACTIVE")

        return matchesSearch && matchesRole
    })

    // Stats
    const auditeurCount = initialAuditors.filter(a => a.role === "AUDITOR" || a.role === "AUDITEUR").length
    const commercialCount = initialAuditors.filter(a => a.role === "COMMERCIAL").length
    const inactiveCount = initialAuditors.filter(a => a.role === "INACTIVE").length

    function showToast(message: string) {
        setSuccessMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function handleAuditeurAdded() {
        showToast("Compte créé avec succès")
        router.refresh()
    }

    function handleAuditeurUpdated() {
        showToast("Compte modifié avec succès")
        router.refresh()
    }

    function handleEdit(auditor: Auditor) {
        setSelectedAuditor(auditor)
        setIsEditModalOpen(true)
    }

    function handleDeleteClick(auditorId: string) {
        setAuditorToDelete(auditorId)
        setDeleteDialogOpen(true)
    }

    async function handleDeleteConfirm() {
        if (!auditorToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteAuditor(auditorToDelete)
            if ('error' in result) {
                alert(result.error)
            } else {
                showToast("Compte supprimé avec succès")
                router.refresh()
            }
        } catch {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setAuditorToDelete(null)
        }
    }

    async function handleToggleStatus(id: string) {
        setTogglingId(id)
        try {
            const result = await toggleAuditorStatus(id)
            if ('error' in result) {
                alert(result.error)
            } else {
                showToast(result.isActive ? "Compte activé" : "Compte désactivé")
                router.refresh()
            }
        } catch {
            alert("Erreur lors du changement de statut")
        } finally {
            setTogglingId(null)
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gestion des auditeurs / commerciaux</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {initialAuditors.length} compte{initialAuditors.length > 1 ? "s" : ""} •
                        <span className="text-purple-600 ml-1">{auditeurCount} auditeur{auditeurCount > 1 ? "s" : ""}</span> •
                        <span className="text-blue-600 ml-1">{commercialCount} commercial{commercialCount > 1 ? "s" : ""}</span>
                        {inactiveCount > 0 && <span className="text-gray-500 ml-1"> • {inactiveCount} inactif{inactiveCount > 1 ? "s" : ""}</span>}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <UserCog className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">{auditeurCount}</p>
                        <p className="text-sm text-slate-500">Auditeurs actifs</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">{commercialCount}</p>
                        <p className="text-sm text-slate-500">Commerciaux actifs</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">
                            {initialAuditors.reduce((sum, a) => sum + a.auditsCount, 0)}
                        </p>
                        <p className="text-sm text-slate-500">Audits assignés</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher par nom ou email..."
                            className="pl-10 w-72 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-44 bg-white">
                            <Filter className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Filtrer par rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            <SelectItem value="AUDITOR">Auditeurs</SelectItem>
                            <SelectItem value="COMMERCIAL">Commerciaux</SelectItem>
                            <SelectItem value="INACTIVE">Inactifs</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau compte
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b">
                            <TableHead className="font-medium text-slate-600">Nom</TableHead>
                            <TableHead className="font-medium text-slate-600">Email</TableHead>
                            <TableHead className="font-medium text-slate-600">Rôle</TableHead>
                            <TableHead className="font-medium text-slate-600">Statut</TableHead>
                            <TableHead className="font-medium text-slate-600">Date création</TableHead>
                            <TableHead className="font-medium text-slate-600">Audits</TableHead>
                            <TableHead className="font-medium text-slate-600 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuditors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                                    {searchQuery || roleFilter !== "all"
                                        ? "Aucun résultat trouvé"
                                        : "Aucun auditeur ou commercial enregistré"
                                    }
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAuditors.map((auditeur) => (
                                <TableRow key={auditeur.id} className="hover:bg-slate-50 border-b">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${auditeur.role === "COMMERCIAL"
                                                    ? "bg-blue-100"
                                                    : "bg-purple-100"
                                                }`}>
                                                <span className={`text-sm font-medium ${auditeur.role === "COMMERCIAL"
                                                        ? "text-blue-600"
                                                        : "text-purple-600"
                                                    }`}>
                                                    {auditeur.nom.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-900">{auditeur.nom}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{auditeur.email}</TableCell>
                                    <TableCell>{getRoleBadge(auditeur.role)}</TableCell>
                                    <TableCell>{getStatusBadge(auditeur.role)}</TableCell>
                                    <TableCell className="text-slate-600">{auditeur.dateCreation}</TableCell>
                                    <TableCell>
                                        <span className="font-medium">{auditeur.auditsCount}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(auditeur)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleStatus(auditeur.id)}
                                                    disabled={togglingId === auditeur.id}
                                                    className={auditeur.role !== "INACTIVE" ? "text-orange-600" : "text-green-600"}
                                                >
                                                    <Power className="h-4 w-4 mr-2" />
                                                    {auditeur.role !== "INACTIVE" ? "Désactiver" : "Activer"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteClick(auditeur.id)}
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

            {/* Add Auditeur Modal */}
            <AddAuditeurModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSuccess={handleAuditeurAdded}
            />

            {/* Edit Auditeur Modal */}
            <EditAuditeurModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                auditor={selectedAuditor}
                onSuccess={handleAuditeurUpdated}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible et tous les audits assignés ne seront plus liés à ce compte.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{successMessage}</span>
                </div>
            )}
        </div>
    )
}
