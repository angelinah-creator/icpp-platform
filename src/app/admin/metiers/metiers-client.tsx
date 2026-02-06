"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Bell, Briefcase, Check, Eye, Power, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import { AddMetierModal } from "@/components/admin/add-metier-modal"
import { updateMetier, toggleMetierStatus, getMetierRisques } from "@/server/actions/admin"

interface Metier {
    id: string
    code: string
    nom: string
    description: string
    isActive: boolean
    companiesCount: number
    unitesTravailCount: number
}

interface Risque {
    id: string
    description: string
    categorie: string
    frequence: number
    gravite: string
    mesuresSuggerees: string
}

interface MetiersClientProps {
    initialMetiers: Metier[]
}

export function MetiersClient({ initialMetiers }: MetiersClientProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingMetier, setEditingMetier] = useState<Metier | null>(null)
    const [editFormData, setEditFormData] = useState({ nom: "", description: "" })
    const [editLoading, setEditLoading] = useState(false)

    // Risques modal state
    const [risquesModalOpen, setRisquesModalOpen] = useState(false)
    const [currentMetierCode, setCurrentMetierCode] = useState("")
    const [currentMetierNom, setCurrentMetierNom] = useState("")
    const [risques, setRisques] = useState<Risque[]>([])
    const [risquesLoading, setRisquesLoading] = useState(false)

    // Toggle status loading
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const filteredMetiers = initialMetiers.filter(m =>
        m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function showToast(message: string) {
        setSuccessMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function handleMetierAdded() {
        showToast("Métier ajouté avec succès")
        router.refresh()
    }

    // Open edit modal
    function openEditModal(metier: Metier) {
        setEditingMetier(metier)
        setEditFormData({ nom: metier.nom, description: metier.description })
        setEditModalOpen(true)
    }

    // Submit edit
    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!editingMetier) return

        setEditLoading(true)
        try {
            const result = await updateMetier(editingMetier.id, editFormData)
            if ('error' in result) {
                alert(result.error)
            } else {
                setEditModalOpen(false)
                showToast("Métier modifié avec succès")
                router.refresh()
            }
        } catch (error) {
            alert("Erreur lors de la modification")
        } finally {
            setEditLoading(false)
        }
    }

    // View risques
    async function openRisquesModal(metierCode: string, metierNom: string) {
        setCurrentMetierCode(metierCode)
        setCurrentMetierNom(metierNom)
        setRisquesModalOpen(true)
        setRisquesLoading(true)

        try {
            const data = await getMetierRisques(metierCode)
            setRisques(data)
        } catch (error) {
            setRisques([])
        } finally {
            setRisquesLoading(false)
        }
    }

    // Toggle status
    async function handleToggleStatus(id: string) {
        setTogglingId(id)
        try {
            const result = await toggleMetierStatus(id)
            if ('error' in result) {
                alert(result.error)
            } else {
                showToast(result.isActive ? "Métier activé" : "Métier désactivé")
                router.refresh()
            }
        } catch (error) {
            alert("Erreur lors de la mise à jour")
        } finally {
            setTogglingId(null)
        }
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gestion des métiers</h1>
                    <p className="text-sm text-slate-500 mt-1">{initialMetiers.length} métier{initialMetiers.length > 1 ? "s" : ""} ICPP</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Rechercher ..." className="pl-10 w-48 bg-white" />
                    </div>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">1</span>
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher un métier..."
                        className="pl-10 w-64 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau métier
                </Button>
            </div>

            {filteredMetiers.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    {searchQuery ? "Aucun métier trouvé" : "Aucun métier enregistré"}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {filteredMetiers.map((metier) => (
                        <Card key={metier.id} className="bg-white border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Briefcase className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={metier.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                            {metier.isActive ? "Actif" : "Inactif"}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditModal(metier)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openRisquesModal(metier.code, metier.nom)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Voir risques
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={metier.isActive ? "text-red-600" : "text-green-600"}
                                                    onClick={() => handleToggleStatus(metier.id)}
                                                    disabled={togglingId === metier.id}
                                                >
                                                    <Power className="h-4 w-4 mr-2" />
                                                    {metier.isActive ? "Désactiver" : "Activer"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-slate-900">{metier.nom}</h3>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{metier.description}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                    <span>{metier.companiesCount} entreprise{metier.companiesCount > 1 ? "s" : ""}</span>
                                    <span>{metier.unitesTravailCount} UT{metier.unitesTravailCount > 1 ? "s" : ""}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Metier Modal */}
            <AddMetierModal open={isModalOpen} onOpenChange={setIsModalOpen} onSuccess={handleMetierAdded} />

            {/* Edit Metier Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Modifier le métier</DialogTitle>
                        <DialogDescription>
                            Modifiez les informations du métier {editingMetier?.code}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom</Label>
                            <Input
                                id="nom"
                                value={editFormData.nom}
                                onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={editLoading}>
                                {editLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Risques Modal */}
            <Dialog open={risquesModalOpen} onOpenChange={setRisquesModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Risques du métier {currentMetierNom}</DialogTitle>
                        <DialogDescription>
                            Liste des risques associés à ce métier ({currentMetierCode})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {risquesLoading ? (
                            <div className="text-center py-8 text-slate-500">Chargement...</div>
                        ) : risques.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">Aucun risque défini pour ce métier</div>
                        ) : (
                            <div className="space-y-3">
                                {risques.map((risque) => (
                                    <div key={risque.id} className="border rounded-lg p-3 bg-slate-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline">{risque.categorie}</Badge>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>Fréq: {risque.frequence}</span>
                                                <span>Grav: {risque.gravite}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700">{risque.description}</p>
                                        {risque.mesuresSuggerees && (
                                            <p className="text-xs text-slate-500 mt-2">
                                                <strong>Mesures suggérées:</strong> {risque.mesuresSuggerees}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRisquesModalOpen(false)}>
                            Fermer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
