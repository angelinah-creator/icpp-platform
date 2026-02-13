"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Plus, MoreHorizontal, Bell, Check, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { AddClientModal } from "@/components/admin/add-client-modal"
import { EditCompanyModal } from "@/components/admin/edit-company-modal"
import { deleteCompany } from "@/server/actions/admin"

interface Company {
    id: string
    nom: string
    email: string
    activite: string
    abonnement: string
    statutConformite: string
    duerp: string
    createdAt: Date
}

interface Plan {
    code: string
    nom: string
    prix: number
}

interface Metier {
    id: string
    code: string
    nom: string
}

interface EntreprisesClientProps {
    initialCompanies: Company[]
    plans: Plan[]
    metiers: Metier[]
}

function getStatutConformiteBadge(statut: string) {
    switch (statut) {
        case "Conforme":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">Conforme</Badge>
        case "Partiellement conforme":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal text-xs">Partiellement conforme</Badge>
        case "Non conforme":
            return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 font-normal">Non conforme</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

function getDuerpBadge(statut: string) {
    switch (statut) {
        case "A jour":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">A jour</Badge>
        case "En cours":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal">En cours</Badge>
        case "A faire":
            return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 font-normal">A faire</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

export function EntreprisesClient({ initialCompanies, plans, metiers }: EntreprisesClientProps) {
    const router = useRouter()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [companyToDelete, setCompanyToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const filteredCompanies = initialCompanies.filter(c =>
        c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function showToast(message: string) {
        setSuccessMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
    }

    function handleClientAdded() {
        showToast("Client ajouté avec succès")
        router.refresh()
    }

    function handleClientUpdated() {
        showToast("Client modifié avec succès")
        router.refresh()
    }

    function handleEdit(company: Company) {
        setSelectedCompany(company)
        setIsEditModalOpen(true)
    }

    function handleDeleteClick(companyId: string) {
        setCompanyToDelete(companyId)
        setDeleteDialogOpen(true)
    }

    async function handleDeleteConfirm() {
        if (!companyToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteCompany(companyToDelete)
            if ('error' in result) {
                alert(result.error)
            } else {
                showToast("Entreprise supprimée avec succès")
                router.refresh()
            }
        } catch (error) {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setCompanyToDelete(null)
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Page Header with Search and Notifications */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gestion des entreprises accompagnées</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {initialCompanies.length} entreprise{initialCompanies.length > 1 ? "s" : ""} enregistrée{initialCompanies.length > 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher ..."
                            className="pl-10 w-48 bg-white"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">1</span>
                    </Button>
                </div>
            </div>

            {/* Search Bar and Filter + Add Button Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Rechercher ..."
                            className="pl-10 w-64 bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                        <Image
                            src="/assets/images/filter-line.png"
                            alt="Filter"
                            width={16}
                            height={16}
                            className="h-4 w-4"
                        />
                    </Button>
                </div>
                <Button
                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau client
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[300px] font-semibold text-slate-900">Entreprises</TableHead>
                            <TableHead className="font-semibold text-slate-900">Activité</TableHead>
                            <TableHead className="font-semibold text-slate-900">Abonnement</TableHead>
                            <TableHead className="font-semibold text-slate-900">Statut conformité</TableHead>
                            <TableHead className="font-semibold text-slate-900">DUERP</TableHead>
                            <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCompanies.map((company) => (
                            <TableRow key={company.id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div>
                                        <div className="font-medium text-slate-900">{company.nom}</div>
                                        <div className="text-xs text-slate-500">{company.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">{company.activite}</TableCell>
                                <TableCell>
                                    <span className="font-medium text-slate-900">{company.abonnement}</span>
                                </TableCell>
                                <TableCell>
                                    {getStatutConformiteBadge(company.statutConformite)}
                                </TableCell>
                                <TableCell>
                                    {getDuerpBadge(company.duerp)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/entreprises/${company.id}`} className="flex items-center gap-2 cursor-pointer">
                                                    <Eye className="h-4 w-4" />
                                                    Voir le dossier
                                                </Link>
                                            </DropdownMenuItem>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <EditCompanyModal company={company} plans={plans} metiers={metiers}>
                                                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2 w-full">
                                                        <Edit className="h-4 w-4" />
                                                        Modifier
                                                    </div>
                                                </EditCompanyModal>
                                            </div>
                                            <div onClick={(e) => {
                                                e.stopPropagation()
                                                setCompanyToDelete(company.id)
                                            }}>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2">
                                                    <Trash2 className="h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Client Modal */}
            <AddClientModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSuccess={handleClientAdded}
                metiers={metiers}
                plans={plans}
            />

            {/* Edit Company Modal */}
            <EditCompanyModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                company={selectedCompany}
                metiers={metiers}
                onSuccess={handleClientUpdated}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette entreprise ? Cette action est irréversible et supprimera également tous les audits et DUERP associés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
