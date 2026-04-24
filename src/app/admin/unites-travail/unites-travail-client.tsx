"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, ChevronDown, ChevronRight, MoreHorizontal,
    Layers, AlertTriangle, Edit, Trash2, Building2, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    createUniteTravail,
    updateUniteTravail,
    deleteUniteTravail
} from "@/server/actions/unites-travail"
import { AdminHeader } from "@/components/admin/admin-header"

interface UniteTravail {
    id: string
    nom: string
    description: string | null
    ordre: number
    risquesCount: number
}

interface Metier {
    id: string
    code: string
    nom: string
    description: string
    companiesCount: number
    unitesTravail: UniteTravail[]
}

interface UnitesTravailClientProps {
    initialMetiers: Metier[]
}

export function UnitesTravailClient({ initialMetiers }: UnitesTravailClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedMetiers, setExpandedMetiers] = useState<Set<string>>(new Set())

    // Toast state
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    // Add UT modal
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [addMetierCode, setAddMetierCode] = useState("")
    const [addFormData, setAddFormData] = useState({ nom: "", description: "" })
    const [addLoading, setAddLoading] = useState(false)

    // Edit UT modal
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingUT, setEditingUT] = useState<UniteTravail | null>(null)
    const [editFormData, setEditFormData] = useState({ nom: "", description: "" })
    const [editLoading, setEditLoading] = useState(false)

    // Delete confirmation
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deletingUT, setDeletingUT] = useState<{ id: string; nom: string } | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Filter métiers by search
    const filteredMetiers = initialMetiers.filter(m =>
        m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.unitesTravail.some(ut => ut.nom.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    // Calculate totals
    const totalUTs = initialMetiers.reduce((acc, m) => acc + m.unitesTravail.length, 0)
    const totalRisques = initialMetiers.reduce(
        (acc, m) => acc + m.unitesTravail.reduce((a, ut) => a + ut.risquesCount, 0),
        0
    )

    function showToast(message: string) {
        setSuccessMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function toggleMetier(metierCode: string) {
        const newExpanded = new Set(expandedMetiers)
        if (newExpanded.has(metierCode)) {
            newExpanded.delete(metierCode)
        } else {
            newExpanded.add(metierCode)
        }
        setExpandedMetiers(newExpanded)
    }

    function expandAll() {
        setExpandedMetiers(new Set(initialMetiers.map(m => m.code)))
    }

    function collapseAll() {
        setExpandedMetiers(new Set())
    }

    // Add UT handlers
    function openAddModal(metierCode: string) {
        setAddMetierCode(metierCode)
        setAddFormData({ nom: "", description: "" })
        setAddModalOpen(true)
    }

    async function handleAddSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!addMetierCode || !addFormData.nom.trim()) return

        setAddLoading(true)
        try {
            const result = await createUniteTravail({
                metierCode: addMetierCode,
                nom: addFormData.nom.trim(),
                description: addFormData.description.trim() || undefined
            })

            if (result.error) {
                console.error(result.error)
                return
            }

            setAddModalOpen(false)
            showToast("Unité de travail ajoutée")
            router.refresh()
        } catch (error) {
            console.error("Erreur:", error)
        } finally {
            setAddLoading(false)
        }
    }

    // Edit UT handlers
    function openEditModal(ut: UniteTravail) {
        setEditingUT(ut)
        setEditFormData({
            nom: ut.nom,
            description: ut.description || ""
        })
        setEditModalOpen(true)
    }

    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!editingUT || !editFormData.nom.trim()) return

        setEditLoading(true)
        try {
            const result = await updateUniteTravail(editingUT.id, {
                nom: editFormData.nom.trim(),
                description: editFormData.description.trim() || undefined
            })

            if (result.error) {
                console.error(result.error)
                return
            }

            setEditModalOpen(false)
            showToast("Unité de travail modifiée")
            router.refresh()
        } catch (error) {
            console.error("Erreur:", error)
        } finally {
            setEditLoading(false)
        }
    }

    // Delete UT handlers
    function openDeleteModal(ut: { id: string; nom: string }) {
        setDeletingUT(ut)
        setDeleteModalOpen(true)
    }

    async function handleDeleteConfirm() {
        if (!deletingUT) return

        setDeleteLoading(true)
        try {
            const result = await deleteUniteTravail(deletingUT.id)

            if (result.error) {
                console.error(result.error)
                return
            }

            setDeleteModalOpen(false)
            showToast("Unité de travail supprimée")
            router.refresh()
        } catch (error) {
            console.error("Erreur:", error)
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
                    <Check className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Header */}
            <AdminHeader
                title="Unités de Travail"
                subtitle="Gestion des unités de travail par métier pour le DUERP"
            />

            {/* Stats Cards */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Métiers</p>
                                    <p className="text-2xl font-bold">{initialMetiers.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Layers className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Unités de Travail</p>
                                    <p className="text-2xl font-bold">{totalUTs}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Risques Associés</p>
                                    <p className="text-2xl font-bold">{totalRisques}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher un métier ou une UT..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={expandAll}>
                            Tout déplier
                        </Button>
                        <Button variant="outline" size="sm" onClick={collapseAll}>
                            Tout replier
                        </Button>
                    </div>
                </div>

                {/* Métiers List with UTs */}
                <div className="space-y-4">
                    {filteredMetiers.map((metier) => (
                        <Card key={metier.id} className="overflow-hidden">
                            <Collapsible
                                open={expandedMetiers.has(metier.code)}
                                onOpenChange={() => toggleMetier(metier.code)}
                            >
                                <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {expandedMetiers.has(metier.code) ? (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5 text-gray-500" />
                                                )}
                                                <div>
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        {metier.nom}
                                                        <Badge variant="outline" className="ml-2">
                                                            {metier.code}
                                                        </Badge>
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {metier.unitesTravail.length} unités de travail
                                                        {metier.companiesCount > 0 && (
                                                            <span className="ml-2">
                                                                • {metier.companiesCount} entreprise{metier.companiesCount > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    openAddModal(metier.code)
                                                }}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Ajouter UT
                                            </Button>
                                        </div>
                                    </CardHeader>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        {metier.unitesTravail.length === 0 ? (
                                            <div className="py-8 text-center text-gray-500">
                                                <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p>Aucune unité de travail définie</p>
                                                <Button
                                                    variant="link"
                                                    onClick={() => openAddModal(metier.code)}
                                                >
                                                    Ajouter la première UT
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {metier.unitesTravail
                                                    .sort((a, b) => a.ordre - b.ordre)
                                                    .map((ut, index) => (
                                                        <div
                                                            key={ut.id}
                                                            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                                    {ut.ordre}
                                                                </span>
                                                                <div>
                                                                    <p className="font-medium">{ut.nom}</p>
                                                                    {ut.description && (
                                                                        <p className="text-sm text-gray-500">
                                                                            {ut.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary">
                                                                    {ut.risquesCount} risque{ut.risquesCount !== 1 ? 's' : ''}
                                                                </Badge>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => openEditModal(ut)}>
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            Modifier
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="text-red-600"
                                                                            onClick={() => openDeleteModal({ id: ut.id, nom: ut.nom })}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Supprimer
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    ))}

                    {filteredMetiers.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>Aucun métier trouvé</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add UT Modal */}
            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouvelle Unité de Travail</DialogTitle>
                        <DialogDescription>
                            Ajoutez une unité de travail pour le métier {addMetierCode}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="add-nom">Nom de l'UT *</Label>
                                <Input
                                    id="add-nom"
                                    placeholder="Ex: UT1 : Accueil / Caisse"
                                    value={addFormData.nom}
                                    onChange={(e) => setAddFormData({ ...addFormData, nom: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="add-description">Description</Label>
                                <Textarea
                                    id="add-description"
                                    placeholder="Description optionnelle..."
                                    value={addFormData.description}
                                    onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={addLoading || !addFormData.nom.trim()}>
                                {addLoading ? "Création..." : "Créer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit UT Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier l'Unité de Travail</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="edit-nom">Nom de l'UT *</Label>
                                <Input
                                    id="edit-nom"
                                    value={editFormData.nom}
                                    onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={editLoading || !editFormData.nom.trim()}>
                                {editLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'unité de travail
                            <strong> {deletingUT?.nom}</strong> ?
                            Les risques associés seront dissociés mais pas supprimés.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Suppression..." : "Supprimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
