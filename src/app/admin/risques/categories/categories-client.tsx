"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Shield, Check, ChevronUp, ChevronDown, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    createRisqueCategorie,
    updateRisqueCategorie,
    deleteRisqueCategorie,
    moveRisqueCategorie
} from "@/server/actions/admin"
import { AdminHeader } from "@/components/admin/admin-header"

interface Categorie {
    id: string
    code: string
    nom: string
    description: string
    ordre: number
    risquesCount: number
}

interface CategoriesClientProps {
    initialCategories: Categorie[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const filteredCategories = initialCategories.filter(c =>
        c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function handleSuccess(message: string) {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function handleEdit(categorie: Categorie) {
        setSelectedCategorie(categorie)
        setIsEditModalOpen(true)
    }

    async function handleDelete() {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const result = await deleteRisqueCategorie(deleteId)
            if ('error' in result) {
                alert(result.error)
            } else {
                handleSuccess("Catégorie supprimée")
                router.refresh()
            }
        } catch {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    async function handleMove(id: string, direction: "up" | "down") {
        const result = await moveRisqueCategorie(id, direction)
        if ('error' in result) {
            alert(result.error)
        } else {
            router.refresh()
        }
    }

    async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        try {
            const result = await createRisqueCategorie({
                code: formData.get("code") as string,
                nom: formData.get("nom") as string,
                description: formData.get("description") as string || undefined
            })
            if ('error' in result) {
                setError(result.error as string)
            } else {
                setIsAddModalOpen(false)
                handleSuccess("Catégorie créée")
                router.refresh()
            }
        } catch {
            setError("Erreur lors de la création")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedCategorie) return
        setIsSubmitting(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        try {
            const result = await updateRisqueCategorie(selectedCategorie.id, {
                code: formData.get("code") as string,
                nom: formData.get("nom") as string,
                description: formData.get("description") as string || undefined
            })
            if ('error' in result) {
                setError(result.error as string)
            } else {
                setIsEditModalOpen(false)
                handleSuccess("Catégorie modifiée")
                router.refresh()
            }
        } catch {
            setError("Erreur lors de la modification")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Catégories de Risques"
                subtitle={`${initialCategories.length} catégorie${initialCategories.length > 1 ? "s" : ""}`}
            />

            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-10 w-64 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle catégorie
                </Button>
            </div>

            {filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    {searchQuery ? "Aucune catégorie trouvée" : "Aucune catégorie enregistrée"}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredCategories.map((categorie, index) => (
                        <Card key={categorie.id} className="bg-white border shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleMove(categorie.id, "up")}
                                                disabled={index === 0}
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleMove(categorie.id, "down")}
                                                disabled={index === filteredCategories.length - 1}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">{categorie.nom}</h3>
                                                <Badge className="bg-slate-100 text-slate-700">{categorie.code}</Badge>
                                                <Badge className="bg-blue-100 text-blue-700">
                                                    {categorie.risquesCount} risque{categorie.risquesCount > 1 ? "s" : ""}
                                                </Badge>
                                            </div>
                                            {categorie.description && (
                                                <p className="text-sm text-slate-500 mt-1">{categorie.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(categorie)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => setDeleteId(categorie.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nouvelle catégorie</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="code">Code (unique)</Label>
                            <Input id="code" name="code" placeholder="PHYSIQUE" required className="uppercase" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom</Label>
                            <Input id="nom" name="nom" placeholder="Risques physiques" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optionnel)</Label>
                            <Textarea id="description" name="description" rows={2} />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#2048BF] to-[#679CFF]">
                                {isSubmitting ? "Création..." : "Créer"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifier la catégorie</DialogTitle>
                    </DialogHeader>
                    {selectedCategorie && (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="edit-code">Code</Label>
                                <Input id="edit-code" name="code" defaultValue={selectedCategorie.code} required className="uppercase" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-nom">Nom</Label>
                                <Input id="edit-nom" name="nom" defaultValue={selectedCategorie.nom} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea id="edit-description" name="description" defaultValue={selectedCategorie.description} rows={2} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#2048BF] to-[#679CFF]">
                                    {isSubmitting ? "Modification..." : "Modifier"}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
