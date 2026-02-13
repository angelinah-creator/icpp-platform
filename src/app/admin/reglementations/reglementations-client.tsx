"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Bell, FileText, Check, Calendar, Trash2, Edit, Power, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
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
import { AddReglementationModal } from "@/components/admin/add-reglementation-modal"
import { EditReglementationModal } from "@/components/admin/edit-reglementation-modal"
import { deleteReglementation, toggleReglementationStatus } from "@/server/actions/admin"

interface Reglementation {
    id: string
    titre: string
    description: string
    type: string
    isActive: boolean
    enVigueur: string
    maj: string
    metiers: string[]
}

interface ReglementationsClientProps {
    initialReglementations: Reglementation[]
}

export function ReglementationsClient({ initialReglementations }: ReglementationsClientProps) {
    const router = useRouter()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedReglementation, setSelectedReglementation] = useState<Reglementation | null>(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const filteredReglementations = initialReglementations.filter(r =>
        r.titre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function handleSuccess(message: string) {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function handleEdit(reglementation: Reglementation) {
        setSelectedReglementation(reglementation)
        setIsEditModalOpen(true)
    }

    async function handleDelete() {
        if (!deleteId) return
        setIsDeleting(true)

        try {
            const result = await deleteReglementation(deleteId)
            if ('error' in result) {
                alert(result.error)
            } else {
                handleSuccess("Réglementation supprimée avec succès")
                router.refresh()
            }
        } catch (error) {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    async function handleToggleStatus(id: string) {
        try {
            const result = await toggleReglementationStatus(id)
            if ('error' in result) {
                alert(result.error)
            } else {
                const status = result.isActive ? "activée" : "désactivée"
                handleSuccess(`Réglementation ${status} avec succès`)
                router.refresh()
            }
        } catch (error) {
            alert("Erreur lors du changement de statut")
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Réglementation</h1>
                    <p className="text-slate-500 mt-1">Gérez les obligations légales par métier</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher ..."
                            className="pl-10 w-[300px] bg-slate-50 border-slate-200"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">1</span>
                    </Button>
                </div>
            </div>

            {/* Search and Action Bar */}
            <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-1 rounded-lg">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une obligation..."
                        className="pl-10 w-full bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-[#2048BF] hover:bg-[#2048BF]/90 text-white gap-2"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle obligation
                </Button>
            </div>

            {/* Content (List) */}
            {filteredReglementations.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-dashed">
                    {searchQuery ? "Aucune réglementation trouvée" : "Aucune réglementation enregistrée"}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReglementations.map((reglementation) => (
                        <Card key={reglementation.id} className="bg-white border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 w-full">
                                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                                            <Scale className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="text-lg font-semibold text-slate-900">{reglementation.titre}</h3>
                                                <Badge className={reglementation.isActive ? "bg-green-100 text-green-700 hover:bg-green-200 border-0" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"}>
                                                    {reglementation.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">{reglementation.type}</Badge>
                                            </div>

                                            <p className="text-slate-500 text-sm leading-relaxed max-w-4xl">
                                                {reglementation.description}
                                            </p>

                                            <div className="flex items-center gap-6 pt-3 mt-1 text-xs text-slate-500 border-t border-slate-50">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    En vigueur: <span className="text-slate-700 font-medium">{reglementation.enVigueur}</span>
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <span className="text-slate-400">MAJ:</span>
                                                    <span className="text-slate-700 font-medium">{reglementation.maj}</span>
                                                </span>

                                                {reglementation.metiers && reglementation.metiers.length > 0 && (
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <span className="text-slate-400">Métiers concernés:</span>
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {reglementation.metiers.slice(0, 3).map((metier, idx) => (
                                                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 font-normal">
                                                                    {metier}
                                                                </Badge>
                                                            ))}
                                                            {reglementation.metiers.length > 3 && (
                                                                <span className="text-xs text-slate-400">+{reglementation.metiers.length - 3}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 -mt-1 -mr-2">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(reglementation)} className="cursor-pointer">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleToggleStatus(reglementation.id)}
                                                className={`cursor-pointer ${reglementation.isActive ? "text-orange-600" : "text-green-600"}`}
                                            >
                                                <Power className="h-4 w-4 mr-2" />
                                                {reglementation.isActive ? "Désactiver" : "Activer"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 cursor-pointer"
                                                onClick={() => setDeleteId(reglementation.id)}
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

            <AddReglementationModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSuccess={() => handleSuccess("Obligation ajoutée avec succès")}
            />

            <EditReglementationModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                reglementation={selectedReglementation}
                onSuccess={() => handleSuccess("Obligation modifiée avec succès")}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette réglementation ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
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
