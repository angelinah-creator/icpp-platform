"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Bell, Building2, Filter, Check, CheckCircle2, Clock, Trash2, Eye, UserPlus, AlertCircle } from "lucide-react"
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
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSignalementStatus, deleteSignalement, assignSignalementAsTache, getUsersByRole } from "@/server/actions/admin"

interface AssignedTask {
    id: string
    userName: string
    userRole: string
    status: string
    priorite: string
}

interface Signalement {
    id: string
    entreprise: string
    companyId: string | null
    type: string
    titre: string
    description: string
    date: string
    statut: string
    rawStatus: string
    assignedTo: AssignedTask[] | null
}

interface AssignableUser {
    id: string
    name: string
    email: string
    role: string
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

function getRoleBadge(role: string) {
    switch (role) {
        case "AUDITOR":
            return <Badge className="bg-purple-100 text-purple-700 border-0 font-normal text-xs">Auditeur</Badge>
        case "TECHNICIEN":
            return <Badge className="bg-orange-100 text-orange-700 border-0 font-normal text-xs">Technicien</Badge>
        case "COMMERCIAL":
            return <Badge className="bg-cyan-100 text-cyan-700 border-0 font-normal text-xs">Commercial</Badge>
        default:
            return <Badge variant="secondary" className="text-xs">{role}</Badge>
    }
}

function getRoleLabel(role: string) {
    switch (role) {
        case "AUDITOR": return "Auditeur"
        case "TECHNICIEN": return "Technicien"
        case "COMMERCIAL": return "Commercial"
        default: return role
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

    // Assignment modal state
    const [assignModal, setAssignModal] = useState<Signalement | null>(null)
    const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([])
    const [selectedUserId, setSelectedUserId] = useState("")
    const [selectedPriorite, setSelectedPriorite] = useState("MOYENNE")
    const [assignComment, setAssignComment] = useState("")
    const [loadingUsers, setLoadingUsers] = useState(false)

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

    async function openAssignModal(signalement: Signalement) {
        setAssignModal(signalement)
        setSelectedUserId("")
        setSelectedPriorite("MOYENNE")
        setAssignComment("")
        setLoadingUsers(true)
        try {
            const users = await getUsersByRole(["AUDITOR", "TECHNICIEN", "COMMERCIAL"])
            setAssignableUsers(users)
        } catch (error) {
            console.error("Error loading users:", error)
        } finally {
            setLoadingUsers(false)
        }
    }

    async function handleAssign() {
        if (!assignModal || !selectedUserId) return
        setLoading(true)
        try {
            const result = await assignSignalementAsTache({
                signalementId: assignModal.id,
                assigneId: selectedUserId,
                priorite: selectedPriorite,
                commentaire: assignComment || undefined
            })

            if (result.error) {
                toast(`Erreur: ${result.error}`)
            } else {
                toast("Signalement assigné comme tâche avec succès !")
                setAssignModal(null)
                router.refresh()
            }
        } finally {
            setLoading(false)
        }
    }

    const filteredSignalements = initialSignalements.filter(s =>
        s.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.titre || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        nouveaux: initialSignalements.filter(s => s.statut === "Nouveau").length,
        enCours: initialSignalements.filter(s => s.statut === "En cours").length,
        traites: initialSignalements.filter(s => s.statut === "Traité").length,
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Signalements clients</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gérez et assignez les signalements comme tâches aux collaborateurs
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600" />
                        {stats.nouveaux > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                {stats.nouveaux}
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-3xl font-bold text-blue-600">{stats.nouveaux}</p>
                            <p className="text-sm text-blue-600">À traiter</p>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <div>
                            <p className="text-3xl font-bold text-yellow-600">{stats.enCours}</p>
                            <p className="text-sm text-yellow-600">Assignés</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="text-3xl font-bold text-green-600">{stats.traites}</p>
                            <p className="text-sm text-green-600">Traités</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-1 rounded-lg">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise, type ou titre..."
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
                            <TableHead className="py-4 font-semibold text-slate-900">Titre</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Date</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Statut</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Assigné à</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSignalements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
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
                                    <TableCell className="py-4 text-slate-700 text-sm max-w-[200px] truncate">{signalement.titre}</TableCell>
                                    <TableCell className="py-4 text-slate-900 font-medium">{signalement.date}</TableCell>
                                    <TableCell className="py-4">{getStatutBadge(signalement.statut)}</TableCell>
                                    <TableCell className="py-4">
                                        {signalement.assignedTo && signalement.assignedTo.length > 0 ? (
                                            <div className="space-y-1">
                                                {signalement.assignedTo.map((t) => (
                                                    <div key={t.id} className="flex items-center gap-1">
                                                        <span className="text-sm text-slate-700">{t.userName}</span>
                                                        {getRoleBadge(t.userRole)}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">Non assigné</span>
                                        )}
                                    </TableCell>
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
                                                {/* Assign button - always available for non-traité */}
                                                {signalement.statut !== "Traité" && (
                                                    <DropdownMenuItem
                                                        onClick={() => openAssignModal(signalement)}
                                                        className="cursor-pointer text-blue-600 focus:text-blue-600"
                                                    >
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Assigner comme tâche
                                                    </DropdownMenuItem>
                                                )}
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

            {/* ========== ASSIGNMENT MODAL ========== */}
            <Dialog open={!!assignModal} onOpenChange={() => setAssignModal(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Assigner comme tâche</DialogTitle>
                        <DialogDescription>
                            Assignez ce signalement à un collaborateur pour traitement
                        </DialogDescription>
                    </DialogHeader>
                    {assignModal && (
                        <div className="space-y-4 py-2">
                            {/* Signalement info */}
                            <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Entreprise</span>
                                    <span className="font-medium text-slate-900">{assignModal.entreprise}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Type</span>
                                    <span className="font-medium text-slate-900">{assignModal.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Titre</span>
                                    <span className="font-medium text-slate-900">{assignModal.titre}</span>
                                </div>
                            </div>

                            {/* Assignee Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="assignee">Assigner à *</Label>
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger id="assignee">
                                        <SelectValue placeholder={loadingUsers ? "Chargement..." : "Sélectionner un collaborateur"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignableUsers.map(user => (
                                            <SelectItem key={user.id} value={user.id}>
                                                <div className="flex items-center gap-2">
                                                    <span>{user.name}</span>
                                                    <span className="text-xs text-slate-400">({getRoleLabel(user.role)})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Priority Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priorité</Label>
                                <Select value={selectedPriorite} onValueChange={setSelectedPriorite}>
                                    <SelectTrigger id="priority">
                                        <SelectValue placeholder="Sélectionner la priorité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="URGENTE"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-2 align-middle"></span>Urgente</SelectItem>
                                        <SelectItem value="HAUTE"><span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 mr-2 align-middle"></span>Haute</SelectItem>
                                        <SelectItem value="MOYENNE"><span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2 align-middle"></span>Moyenne</SelectItem>
                                        <SelectItem value="BASSE"><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-2 align-middle"></span>Basse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Comment */}
                            <div className="space-y-2">
                                <Label htmlFor="comment">Instructions (optionnel)</Label>
                                <Textarea
                                    id="comment"
                                    placeholder="Instructions ou commentaires pour le collaborateur..."
                                    value={assignComment}
                                    onChange={(e) => setAssignComment(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignModal(null)}>Annuler</Button>
                        <Button
                            onClick={handleAssign}
                            disabled={loading || !selectedUserId}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? "Assignation..." : "Assigner"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                <span className="text-slate-500">Titre</span>
                                <span className="font-medium text-slate-900">{detailModal.titre}</span>
                            </div>
                            {detailModal.description && (
                                <div>
                                    <span className="text-slate-500 block mb-1">Description</span>
                                    <p className="font-medium text-slate-900 bg-slate-50 rounded p-2">{detailModal.description}</p>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-900">{detailModal.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Statut</span>
                                {getStatutBadge(detailModal.statut)}
                            </div>
                            {detailModal.assignedTo && detailModal.assignedTo.length > 0 && (
                                <div>
                                    <span className="text-slate-500 block mb-1">Assigné à</span>
                                    {detailModal.assignedTo.map(t => (
                                        <div key={t.id} className="flex items-center gap-2 py-1">
                                            <span className="font-medium text-slate-900">{t.userName}</span>
                                            {getRoleBadge(t.userRole)}
                                            <Badge variant="secondary" className="text-xs">{t.priorite}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
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
