"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, Filter, Plus, MoreHorizontal, TrendingUp, Trash2, Eye, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuditeurStatCard } from "@/components/auditeur/auditeur-stat-card"
import { NotificationBell } from "@/components/notifications/notification-bell"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { deleteAudit } from "@/server/actions/client"

interface Audit {
    id: string
    companyName: string
    companyActivity: string | null
    date: string
    score: number | null
    status: string
    statusColor: string
}

interface MesAuditsClientProps {
    audits: Audit[]
}

export function MesAuditsClient({ audits }: MesAuditsClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [auditToDelete, setAuditToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Calculer les stats à partir des audits réels
    const stats = {
        total: audits.length,
        planifies: audits.filter(a => a.status === "PLANIFIÉ").length,
        enCours: audits.filter(a => a.status === "EN_COURS").length,
        termines: audits.filter(a => a.status === "TERMINÉ").length
    }

    // Filtrer les audits
    const filteredAudits = audits.filter(audit => {
        const matchesSearch =
            (audit.companyName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (audit.companyActivity?.toLowerCase() || "").includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || audit.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleDeleteClick = (auditId: string) => {
        setAuditToDelete(auditId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!auditToDelete) return

        setIsDeleting(true)
        console.log("🗑️ Suppression de l'audit:", auditToDelete)

        try {
            const result = await deleteAudit(auditToDelete)
            console.log("✅ Résultat de la suppression:", result)

            if (result.success) {
                setDeleteDialogOpen(false)
                setAuditToDelete(null)
                console.log("🔄 Rafraîchissement de la page...")
                router.refresh() // Rafraîchir la liste des audits
            } else {
                console.error("❌ Erreur:", result.error)
                alert(result.error || "Erreur lors de la suppression")
            }
        } catch (error) {
            console.error("❌ Exception lors de la suppression:", error)
            alert("Une erreur est survenue lors de la suppression")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">Mes audits</h1>
                        <p className="text-sm text-slate-500 hidden sm:block">Planifiez et suivez les audits terrain</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        {/* Search - hidden on very small screens */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-56 bg-slate-50 pl-10 border-slate-200"
                            />
                        </div>
                        <NotificationBell />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <AuditeurStatCard
                        title="Total audits"
                        value={stats.total}
                        change="+20% vs mois dernier"
                        icon={<TrendingUp className="h-5 w-5 text-slate-400" />}
                    />
                    <AuditeurStatCard
                        title="Planifiés"
                        value={stats.planifies}
                        change="+20% vs mois dernier"
                        icon={<TrendingUp className="h-5 w-5 text-slate-400" />}
                    />
                    <AuditeurStatCard
                        title="En cours"
                        value={stats.enCours}
                        change="+20% vs mois dernier"
                        icon={<TrendingUp className="h-5 w-5 text-slate-400" />}
                    />
                    <AuditeurStatCard
                        title="Terminés"
                        value={stats.termines}
                        change="+20% vs mois dernier"
                        icon={<TrendingUp className="h-5 w-5 text-slate-400" />}
                    />
                </div>

                {/* Search and Actions Bar */}
                <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher une entreprise..."
                                className="pl-10 bg-white border-slate-200 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="flex-1 sm:w-44">
                                    <SelectValue placeholder="Tous les statuts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="PLANIFIÉ">Planifiés</SelectItem>
                                    <SelectItem value="EN_COURS">En cours</SelectItem>
                                    <SelectItem value="TERMINÉ">Terminés</SelectItem>
                                </SelectContent>
                            </Select>
                            <Link href="/auditeur/audits/nouveau">
                                <Button className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white whitespace-nowrap">
                                    <Plus className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Nouvel audit</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Audits Table */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead className="font-semibold text-slate-900">Entreprise</TableHead>
                                    <TableHead className="font-semibold text-slate-900 hidden md:table-cell">Activité</TableHead>
                                    <TableHead className="font-semibold text-slate-900 hidden sm:table-cell">Date</TableHead>
                                    <TableHead className="font-semibold text-slate-900 hidden lg:table-cell">Score</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                                    <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAudits.length > 0 ? filteredAudits.map((audit) => (
                                    <TableRow key={audit.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-blue-600">
                                                        {audit.companyName.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-slate-900">{audit.companyName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600 hidden md:table-cell">{audit.companyActivity || "Non défini"}</TableCell>
                                        <TableCell className="text-slate-600 hidden sm:table-cell">{audit.date}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {audit.score !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[80px]">
                                                        <div
                                                            className={`h-full rounded-full ${audit.score >= 80 ? "bg-green-500" : "bg-orange-500"}`}
                                                            style={{ width: `${audit.score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">{audit.score}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={`${audit.statusColor} border-0 font-medium`}>
                                                {audit.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/auditeur/audits/${audit.id}`} className="flex items-center">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Voir détails
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/auditeur/audits/${audit.id}/edit`} className="flex items-center">
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Modifier
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            handleDeleteClick(audit.id)
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                            Aucun audit pour le moment.
                                            <Link href="/auditeur/audits/nouveau" className="text-blue-600 hover:underline ml-2">
                                                Créer votre premier audit
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet audit ? Cette action est irréversible et supprimera également tous les documents et risques associés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeleteConfirm()
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
