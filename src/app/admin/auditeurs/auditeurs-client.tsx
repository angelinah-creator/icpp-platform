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
import { AdminHeader } from "@/components/admin/admin-header"

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
            <AdminHeader
                title="Gestion des auditeurs ICPP"
                subtitle={`${initialAuditors.length} auditeur${initialAuditors.length > 1 ? "s" : ""} enregistré${initialAuditors.length > 1 ? "s" : ""}`}
            />

            {/* Search and Filters */}
            <div className="flex items-center justify-between bg-white/50 p-1 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher un auditeur..."
                            className="pl-10 w-[300px] bg-slate-50 border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="bg-white border-slate-200">
                                <Filter className="h-4 w-4 text-slate-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setRoleFilter("all")}>Tous</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("AUDITOR")}>Auditeurs</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRoleFilter("COMMERCIAL")}>Commerciaux</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                    className="bg-[#2563EB] hover:bg-[#1d4ed8]"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel auditeur
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="font-semibold text-slate-900 w-[300px]">Auditeur</TableHead>
                            <TableHead className="font-semibold text-slate-900">Email</TableHead>
                            <TableHead className="font-semibold text-slate-900">Date de création</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuditors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                    {searchQuery
                                        ? "Aucun résultat trouvé"
                                        : "Aucun auditeur enregistré"
                                    }
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAuditors.map((auditeur) => (
                                <TableRow key={auditeur.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${auditeur.role === "COMMERCIAL"
                                                ? "bg-blue-100"
                                                : "bg-blue-100"
                                                }`}>
                                                <UserCog className={`h-4 w-4 ${auditeur.role === "COMMERCIAL"
                                                    ? "text-blue-600"
                                                    : "text-blue-600"
                                                    }`} />
                                            </div>
                                            <span className="font-medium text-slate-900">{auditeur.nom}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{auditeur.email}</TableCell>
                                    <TableCell className="text-slate-900 font-medium">
                                        {new Date(auditeur.dateCreation).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit"
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(auditeur)} className="cursor-pointer">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleStatus(auditeur.id)}
                                                    disabled={togglingId === auditeur.id}
                                                    className={`cursor-pointer ${auditeur.role !== "INACTIVE" ? "text-orange-600" : "text-green-600"}`}
                                                >
                                                    <Power className="h-4 w-4 mr-2" />
                                                    {auditeur.role !== "INACTIVE" ? "Désactiver" : "Activer"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 cursor-pointer"
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
