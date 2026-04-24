"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Plus, MoreHorizontal, Bell, FileText, CheckCircle2, Check, Building2, Filter, Eye, Pencil, XCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PlanifierAuditModal } from "@/components/admin/planifier-audit-modal"
import { updateAuditStatus, deleteAdminAudit } from "@/server/actions/admin"
import { requestClientPaymentAfterAudit } from "@/server/actions/contracts"
import { AdminHeader } from "@/components/admin/admin-header"


interface Audit {
    id: string
    entreprise: string
    type: string
    date: string
    auditeur: string
    statut: string
}

interface AuditStats {
    total: number
    planifie: number
    enCours: number
    termine: number
}

interface Company {
    id: string
    nom: string
}

interface Auditor {
    id: string
    nom: string
}

interface AuditsClientProps {
    initialAudits: Audit[]
    stats: AuditStats
    companies: Company[]
    auditors: Auditor[]
}

function getTypeBadge(type: string) {
    switch (type) {
        case "Audit initial":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium border-0 px-3 py-1">{type}</Badge>
        case "Suivi annuel":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-medium border-0 px-3 py-1">{type}</Badge>
        default:
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-medium border-0 px-3 py-1">{type}</Badge>
    }
}

function getStatutBadge(statut: string) {
    switch (statut) {
        case "Terminée":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">{statut}</Badge>
        case "En cours":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal border-0">{statut}</Badge>
        case "En attente":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">{statut}</Badge>
        case "Annulé":
            return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-normal border-0">{statut}</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

export function AuditsClient({ initialAudits, stats, companies, auditors }: AuditsClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    function showToast(message: string) {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 3000)
    }

    function handleAuditCreated() {
        showToast("Audit planifié avec succès")
        router.refresh()
    }

    async function handleStatusChange(id: string, status: string, label: string) {
        setLoading(true)
        try {
            await updateAuditStatus(id, status)
            showToast(`Audit marqué comme "${label}"`)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!deleteConfirm) return
        setLoading(true)
        try {
            await deleteAdminAudit(deleteConfirm)
            setDeleteConfirm(null)
            showToast("Audit supprimé")
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    async function handleRequestPayment(auditId: string) {
        setLoading(true)
        try {
            const result = await requestClientPaymentAfterAudit(auditId)
            if (result.error) {
                showToast(result.error)
                return
            }
            showToast("Notification de paiement envoyee au client")
        } finally {
            setLoading(false)
        }
    }

    const filteredAudits = initialAudits.filter(a =>
        a.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.auditeur.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Gestion des audits"
                subtitle="Planifiez et suivez les audits de conformité"
            />


            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-xs text-slate-500">Total audits</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.planifie}</p>
                            <p className="text-xs text-slate-500">Planifiés</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.enCours}</p>
                            <p className="text-xs text-slate-500">En cours</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.termine}</p>
                            <p className="text-xs text-slate-500">Terminés</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-1 rounded-lg">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise, type ou auditeur..."
                        className="pl-10 w-full bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Button variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                        <Filter className="h-4 w-4" />
                        Tous les statuts
                    </Button>
                    <Link href="/admin/audits/nouveau">
                        <Button className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                            <Plus className="h-4 w-4 mr-2" />
                            Réaliser un audit
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                            <TableHead className="py-4 font-semibold text-slate-900">Entreprise</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Type</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Date</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Auditeur</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Statut</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAudits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                    {searchQuery ? "Aucun audit trouvé" : "Aucun audit planifié"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAudits.map((audit, index) => (
                                <TableRow key={`${audit.id}-${index}`} className="hover:bg-slate-50/50 border-b">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">{audit.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">{getTypeBadge(audit.type)}</TableCell>
                                    <TableCell className="py-4 text-slate-900 font-medium">{audit.date}</TableCell>
                                    <TableCell className="py-4 text-slate-900 font-medium">{audit.auditeur}</TableCell>
                                    <TableCell className="py-4">{getStatutBadge(audit.statut)}</TableCell>
                                    <TableCell className="py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {audit.statut === "En attente" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(audit.id, "EN_COURS", "En cours")}
                                                        className="cursor-pointer"
                                                    >
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        Démarrer l'audit
                                                    </DropdownMenuItem>
                                                )}
                                                {audit.statut === "En cours" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(audit.id, "TERMINE", "Terminé")}
                                                        className="cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Marquer comme terminé
                                                    </DropdownMenuItem>
                                                )}
                                                {(audit.statut === "En attente" || audit.statut === "En cours") && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(audit.id, "ANNULE", "Annulé")}
                                                        className="cursor-pointer text-orange-600 focus:text-orange-600"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Annuler l'audit
                                                    </DropdownMenuItem>
                                                )}
                                                {audit.statut === "Terminée" && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleRequestPayment(audit.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Procéder au paiement
                                                    </DropdownMenuItem>
                                                )}
                                                {audit.statut === "Terminée" && (
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/audits/${audit.id}/finalisation`} className="cursor-pointer">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Finaliser sur place
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteConfirm(audit.id)}
                                                    className="text-red-600 cursor-pointer focus:text-red-600"
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

            {/* Modal */}
            <PlanifierAuditModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                companies={companies}
                auditors={auditors}
                onSuccess={handleAuditCreated}
            />

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-slate-600 py-2">
                        Voulez-vous vraiment supprimer cet audit ? Cette action est irréversible.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                        <Button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
                            {loading ? "..." : "Supprimer"}
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
                    <span className="text-sm font-medium text-slate-700">{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
