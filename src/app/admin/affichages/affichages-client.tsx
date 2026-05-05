"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, MoreHorizontal, FileText, Check, Download, Trash2, Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddAffichageModal } from "@/components/admin/add-affichage-modal"
import { deleteAffichage } from "@/server/actions/admin"
import { AdminHeader } from "@/components/admin/admin-header"

interface Affichage {
    id: string
    type: string
    category: string
    title: string
    description: string
    companyName: string
    companyId: string
    fileUrl: string | null
    dynamicData: string | null
    version: number
    isLocked: boolean
    downloaded: boolean
    printed: boolean
    generatedAt: string | null
    createdAt: string
}

interface AffichagesClientProps {
    initialAffichages: Affichage[]
    companies: Array<{ id: string; name: string }>
}

export function AffichagesClient({ initialAffichages, companies }: AffichagesClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const filteredAffichages = initialAffichages.filter(a => {
        return a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    })

    function handleSuccess(message: string) {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    async function handleDelete() {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const result = await deleteAffichage(deleteId)
            if ('error' in result) {
                alert(result.error)
            } else {
                handleSuccess("Affichage supprimé avec succès")
                router.refresh()
            }
        } catch {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Affichages Obligatoires"
                subtitle={`${initialAffichages.length} affichage${initialAffichages.length > 1 ? "s" : ""} enregistré${initialAffichages.length > 1 ? "s" : ""}`}
            />

            <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise..."
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Générer un affichage
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Type</TableHead>
                            <TableHead>Entreprise</TableHead>
                            <TableHead className="text-center">Version</TableHead>
                            <TableHead className="text-center">Statut</TableHead>
                            <TableHead className="text-center">Généré le</TableHead>
                            <TableHead className="text-center">Téléchargé</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAffichages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                    {searchQuery
                                        ? "Aucun affichage trouvé pour cette recherche"
                                        : "Aucun affichage enregistré. Générez-en un pour commencer."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAffichages.map((affichage) => {
                                return (
                                    <TableRow key={affichage.id} className="hover:bg-slate-50 border-b">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium text-slate-900">{affichage.title}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-sm pl-6">
                                                A4 Paysage (Coordonnées, Secours, Harcèlement...)
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-slate-700">{affichage.companyName}</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">v{affichage.version}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {affichage.generatedAt ? (
                                                <Badge className="bg-green-100 text-green-700 border-none">Généré</Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-700 border-none">En attente</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-xs text-slate-500">
                                                {affichage.generatedAt
                                                    ? new Date(affichage.generatedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
                                                    : "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {affichage.downloaded ? (
                                                <Badge className="bg-blue-100 text-blue-700 border-none">Oui</Badge>
                                            ) : (
                                                <span className="text-xs text-slate-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <a
                                                    href={`/api/affichages/${affichage.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <a
                                                                href={`/api/affichages/${affichage.id}/pdf`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Télécharger (A4 Paysage)
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => setDeleteId(affichage.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <AddAffichageModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                companies={companies}
                onSuccess={() => handleSuccess("Affichage créé avec succès")}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet affichage ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
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
