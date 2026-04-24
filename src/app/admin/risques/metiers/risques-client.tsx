"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, AlertTriangle, Check, Trash2, Edit, Power, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    createRisqueMetier,
    updateRisqueMetier,
    deleteRisqueMetier,
    toggleRisqueMetierStatus
} from "@/server/actions/admin"
import { AdminHeader } from "@/components/admin/admin-header"

interface Risque {
    id: string
    nom: string
    description: string
    categorieCode: string
    categorieNom: string
    metierCode: string
    metierNom: string
    gravite: number  // Int 1-5 selon CDC
    frequence: number
    mesuresSuggerees: string[]
    isActive: boolean
}

interface RisquesClientProps {
    initialRisques: Risque[]
    categories: Array<{ code: string; nom: string }>
    metiers: Array<{ code: string; nom: string }>
}

// Couleurs selon la valeur numérique 1-5
function getGraviteColor(gravite: number): string {
    if (gravite <= 2) return "bg-green-100 text-green-700"
    if (gravite <= 3) return "bg-yellow-100 text-yellow-700"
    return "bg-red-100 text-red-700"
}

function getGraviteLabel(gravite: number): string {
    const labels: Record<number, string> = { 1: "Mineur", 2: "Léger", 3: "Sérieux", 4: "Grave", 5: "Critique" }
    return labels[gravite] || String(gravite)
}

export function RisquesClient({ initialRisques, categories, metiers }: RisquesClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [filterMetier, setFilterMetier] = useState<string>("all")
    const [filterCategorie, setFilterCategorie] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedRisque, setSelectedRisque] = useState<Risque | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mesures, setMesures] = useState<string[]>([])

    const filteredRisques = initialRisques.filter(r => {
        const matchSearch = r.nom.toLowerCase().includes(searchQuery.toLowerCase())
        const matchMetier = filterMetier === "all" || r.metierCode === filterMetier
        const matchCategorie = filterCategorie === "all" || r.categorieCode === filterCategorie
        const matchStatus = filterStatus === "all" || (filterStatus === "active" ? r.isActive : !r.isActive)
        return matchSearch && matchMetier && matchCategorie && matchStatus
    })

    function handleSuccess(message: string) {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function handleEdit(risque: Risque) {
        setSelectedRisque(risque)
        setMesures(risque.mesuresSuggerees)
        setIsEditModalOpen(true)
    }

    function openAddModal() {
        setMesures([])
        setIsAddModalOpen(true)
    }

    async function handleDelete() {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const result = await deleteRisqueMetier(deleteId)
            if ('error' in result) alert(result.error)
            else { handleSuccess("Risque supprimé"); router.refresh() }
        } catch { alert("Erreur lors de la suppression") }
        finally { setIsDeleting(false); setDeleteId(null) }
    }

    async function handleToggle(id: string) {
        const result = await toggleRisqueMetierStatus(id)
        if ('error' in result) alert(result.error)
        else { handleSuccess(result.isActive ? "Risque activé" : "Risque désactivé"); router.refresh() }
    }

    async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        try {
            const result = await createRisqueMetier({
                nom: formData.get("nom") as string,
                description: formData.get("description") as string,
                categorieCode: formData.get("categorie") as string,
                metierCode: formData.get("metier") as string,
                gravite: parseInt(formData.get("gravite") as string) || 2,
                frequence: parseInt(formData.get("frequence") as string) || 1,
                mesuresSuggerees: mesures.filter(m => m.trim())
            })
            if ('error' in result) setError(result.error as string)
            else { setIsAddModalOpen(false); handleSuccess("Risque créé"); router.refresh() }
        } catch { setError("Erreur lors de la création") }
        finally { setIsSubmitting(false) }
    }

    async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedRisque) return
        setIsSubmitting(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        try {
            const result = await updateRisqueMetier(selectedRisque.id, {
                nom: formData.get("nom") as string,
                description: formData.get("description") as string,
                categorieCode: formData.get("categorie") as string,
                metierCode: formData.get("metier") as string,
                gravite: parseInt(formData.get("gravite") as string) || 2,
                frequence: parseInt(formData.get("frequence") as string) || 1,
                mesuresSuggerees: mesures.filter(m => m.trim())
            })
            if ('error' in result) setError(result.error as string)
            else { setIsEditModalOpen(false); handleSuccess("Risque modifié"); router.refresh() }
        } catch { setError("Erreur lors de la modification") }
        finally { setIsSubmitting(false) }
    }

    function addMesure() { setMesures([...mesures, ""]) }
    function removeMesure(index: number) { setMesures(mesures.filter((_, i) => i !== index)) }
    function updateMesure(index: number, value: string) {
        const updated = [...mesures]
        updated[index] = value
        setMesures(updated)
    }

    function renderStars(count: number) {
        return Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
        ))
    }

    const RisqueFormContent = ({ isEdit = false }: { isEdit?: boolean }) => (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select name="categorie" defaultValue={isEdit ? selectedRisque?.categorieCode : undefined} required>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c.code} value={c.code}>{c.nom}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Métier</Label>
                    <Select name="metier" defaultValue={isEdit ? selectedRisque?.metierCode : undefined} required>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                            {metiers.map(m => <SelectItem key={m.code} value={m.code}>{m.nom}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Nom du risque</Label>
                <Input name="nom" defaultValue={isEdit ? selectedRisque?.nom : ""} required />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" defaultValue={isEdit ? selectedRisque?.description : ""} rows={2} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Gravité (1-5)</Label>
                    <Select name="gravite" defaultValue={isEdit ? String(selectedRisque?.gravite ?? 2) : "2"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 — Mineur</SelectItem>
                            <SelectItem value="2">2 — Blessure légère</SelectItem>
                            <SelectItem value="3">3 — Blessure sérieuse</SelectItem>
                            <SelectItem value="4">4 — Accident grave</SelectItem>
                            <SelectItem value="5">5 — Décès / Critique</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Fréquence (1-5)</Label>
                    <Select name="frequence" defaultValue={isEdit ? String(selectedRisque?.frequence || 1) : "1"}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Mesures préventives</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMesure}>+ Ajouter</Button>
                </div>
                {mesures.map((m, i) => (
                    <div key={i} className="flex gap-2">
                        <Input value={m} onChange={(e) => updateMesure(i, e.target.value)} placeholder="Mesure préventive" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMesure(i)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Risques par Métier"
                subtitle={`${initialRisques.length} risque${initialRisques.length > 1 ? "s" : ""}`}
            />

            <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Rechercher..." className="pl-10 w-48 bg-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Select value={filterMetier} onValueChange={setFilterMetier}>
                    <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Métier" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous métiers</SelectItem>
                        {metiers.map(m => <SelectItem key={m.code} value={m.code}>{m.nom}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                    <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        {categories.map(c => <SelectItem key={c.code} value={c.code}>{c.nom}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32 bg-white"><SelectValue placeholder="Statut" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex-1" />
                <Button className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90" onClick={openAddModal}>
                    <Plus className="h-4 w-4 mr-2" />Nouveau risque
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Risque</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Métier</TableHead>
                            <TableHead>Gravité</TableHead>
                            <TableHead>Fréquence</TableHead>
                            <TableHead className="text-center">Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRisques.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-500">Aucun risque trouvé</TableCell></TableRow>
                        ) : (
                            filteredRisques.map((risque) => (
                                <TableRow key={risque.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{risque.nom}</div>
                                                <div className="text-xs text-slate-500 max-w-xs truncate">{risque.description}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge className="bg-purple-100 text-purple-700">{risque.categorieNom}</Badge></TableCell>
                                    <TableCell><Badge className="bg-blue-100 text-blue-700">{risque.metierNom}</Badge></TableCell>
                                    <TableCell><Badge className={getGraviteColor(risque.gravite)}>{getGraviteLabel(risque.gravite)} ({risque.gravite})</Badge></TableCell>
                                    <TableCell><div className="flex gap-0.5">{renderStars(risque.frequence)}</div></TableCell>
                                    <TableCell className="text-center">
                                        <Switch checked={risque.isActive} onCheckedChange={() => handleToggle(risque.id)} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(risque)}><Edit className="h-4 w-4 mr-2" />Modifier</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(risque.id)}><Trash2 className="h-4 w-4 mr-2" />Supprimer</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Nouveau risque</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddSubmit}>
                        <RisqueFormContent />
                        <div className="flex gap-3 pt-4 mt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">Annuler</Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#2048BF] to-[#679CFF]">{isSubmitting ? "Création..." : "Créer"}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Modifier le risque</DialogTitle></DialogHeader>
                    {selectedRisque && (
                        <form onSubmit={handleEditSubmit}>
                            <RisqueFormContent isEdit />
                            <div className="flex gap-3 pt-4 mt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">Annuler</Button>
                                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#2048BF] to-[#679CFF]">{isSubmitting ? "Modification..." : "Modifier"}</Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce risque ?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">{isDeleting ? "Suppression..." : "Supprimer"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"><Check className="h-4 w-4 text-green-600" /></div>
                    <span className="text-sm font-medium text-slate-700">{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
