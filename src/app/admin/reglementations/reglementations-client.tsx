"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Bell, FileText, Check, Calendar, Trash2, Edit, Power } from "lucide-react"
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Réglementations</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {initialReglementations.length} obligation{initialReglementations.length > 1 ? "s" : ""} légale{initialReglementations.length > 1 ? "s" : ""}
                    </p>
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
                        placeholder="Rechercher une obligation..."
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
                    Nouvelle obligation
                </Button>
            </div>

            {filteredReglementations.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    {searchQuery ? "Aucune réglementation trouvée" : "Aucune réglementation enregistrée"}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReglementations.map((reglementation) => (
                        <Card key={reglementation.id} className="bg-white border shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-900">{reglementation.titre}</h3>
                                                <Badge className={reglementation.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                                                    {reglementation.isActive ? "Actif" : "Inactif"}
                                                </Badge>
                                                <Badge className="bg-purple-100 text-purple-700">{reglementation.type}</Badge>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-3">{reglementation.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    En vigueur: {reglementation.enVigueur}
                                                </span>
                                                <span>Mise à jour: {reglementation.maj}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(reglementation)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleToggleStatus(reglementation.id)}
                                                className={reglementation.isActive ? "text-orange-600" : "text-green-600"}
                                            >
                                                <Power className="h-4 w-4 mr-2" />
                                                {reglementation.isActive ? "Désactiver" : "Activer"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
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
