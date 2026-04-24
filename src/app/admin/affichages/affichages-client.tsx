"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, MoreHorizontal, FileText, Check, Download, Trash2,
    Shield, Ban, Flame, Lock, Filter
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
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
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

const CATEGORY_LABELS: Record<string, { label: string; icon: typeof FileText; color: string }> = {
    FICHE_1: { label: "Fiche 1 — Coordonnées", icon: FileText, color: "bg-blue-100 text-blue-700" },
    FICHE_2: { label: "Fiche 2 — Droits & Obligations", icon: Shield, color: "bg-purple-100 text-purple-700" },
    FICHE_3: { label: "Fiche 3 — Interdiction fumer", icon: Ban, color: "bg-red-100 text-red-700" },
    FICHE_4: { label: "Fiche 4 — Sécurité incendie", icon: Flame, color: "bg-orange-100 text-orange-700" },
}

function getCatInfo(cat: string) {
    return CATEGORY_LABELS[cat] || { label: cat, icon: FileText, color: "bg-slate-100 text-slate-700" }
}

export function AffichagesClient({ initialAffichages, companies }: AffichagesClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("ALL")
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const filteredAffichages = initialAffichages.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchCategory = categoryFilter === "ALL" || a.category === categoryFilter
        return matchSearch && matchCategory
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

    const ficheCount = (cat: string) => initialAffichages.filter(a => a.category === cat).length

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Affichages Obligatoires"
                subtitle={`${initialAffichages.length} affichage${initialAffichages.length > 1 ? "s" : ""} — Fiche 1: ${ficheCount("FICHE_1")}, Fiche 2: ${ficheCount("FICHE_2")}, Fiche 3: ${ficheCount("FICHE_3")}, Fiche 4: ${ficheCount("FICHE_4")}`}
            />

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher un affichage..."
                            className="pl-10 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-56 bg-white">
                            <Filter className="h-4 w-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Toutes les fiches</SelectItem>
                            <SelectItem value="FICHE_1">Fiche 1 — Coordonnées</SelectItem>
                            <SelectItem value="FICHE_2">Fiche 2 — Droits & Obligations</SelectItem>
                            <SelectItem value="FICHE_3">Fiche 3 — Interdiction fumer</SelectItem>
                            <SelectItem value="FICHE_4">Fiche 4 — Sécurité incendie</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Entreprise</TableHead>
                            <TableHead className="text-center">Version</TableHead>
                            <TableHead className="text-center">Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAffichages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                    {searchQuery || categoryFilter !== "ALL"
                                        ? "Aucun affichage trouvé"
                                        : "Aucun affichage enregistré"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAffichages.map((affichage) => {
                                const catInfo = getCatInfo(affichage.category)
                                return (
                                    <TableRow key={affichage.id} className="hover:bg-slate-50 border-b">
                                        <TableCell>
                                            <Badge className={catInfo.color}>{catInfo.label}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{affichage.title}</span>
                                                {affichage.isLocked && (
                                                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                                                )}
                                            </div>
                                            {affichage.description && (
                                                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                                                    {affichage.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{affichage.companyName}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">v{affichage.version}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {affichage.generatedAt ? (
                                                <Badge className="bg-green-100 text-green-700">Généré</Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-700">En attente</Badge>
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
                                                                Télécharger PDF
                                                            </a>
                                                        </DropdownMenuItem>
                                                        {!affichage.isLocked && (
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => setDeleteId(affichage.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        )}
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
