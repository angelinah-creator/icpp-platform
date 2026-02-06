"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Bell, FileText, Check, Download, Trash2, Edit, Printer } from "lucide-react"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddAffichageModal } from "@/components/admin/add-affichage-modal"
import { deleteAffichage } from "@/server/actions/admin"

interface Affichage {
    id: string
    type: string
    title: string
    description: string
    companyName: string
    companyId: string
    fileUrl: string | null
    downloaded: boolean
    printed: boolean
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

    const filteredAffichages = initialAffichages.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
        } catch (error) {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Affichages Obligatoires</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {initialAffichages.length} affichage{initialAffichages.length > 1 ? "s" : ""} obligatoire{initialAffichages.length > 1 ? "s" : ""}
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
                        placeholder="Rechercher un affichage..."
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
                    Nouvel affichage
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Type</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Entreprise</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Téléchargé</TableHead>
                            <TableHead className="text-center">Imprimé</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAffichages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                                    {searchQuery ? "Aucun affichage trouvé" : "Aucun affichage enregistré"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAffichages.map((affichage) => (
                                <TableRow key={affichage.id} className="hover:bg-slate-50 border-b">
                                    <TableCell>
                                        <Badge className="bg-blue-100 text-blue-700">{affichage.type}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{affichage.title}</TableCell>
                                    <TableCell>{affichage.companyName}</TableCell>
                                    <TableCell className="max-w-xs truncate text-slate-500 text-sm">
                                        {affichage.description}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {affichage.downloaded ? (
                                            <Badge className="bg-green-100 text-green-700">Oui</Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-700">Non</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {affichage.printed ? (
                                            <Badge className="bg-green-100 text-green-700">Oui</Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-700">Non</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {affichage.fileUrl && (
                                                    <DropdownMenuItem>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Télécharger PDF
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => setDeleteId(affichage.id)}
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
