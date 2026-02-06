"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, MoreHorizontal, Bell, FileText, Clock, CheckCircle2, Check } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PlanifierAuditModal } from "@/components/admin/planifier-audit-modal"

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
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">Audit initial</Badge>
        case "Suivi annuel":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">Suivi annuel</Badge>
        case "Exceptionnel":
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-normal border-0">Exceptionnel</Badge>
        default:
            return <Badge variant="secondary">{type}</Badge>
    }
}

function getStatutBadge(statut: string) {
    switch (statut) {
        case "Terminée":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">Terminée</Badge>
        case "En attente":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal border-0">En attente</Badge>
        case "En cours":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">En cours</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

export function AuditsClient({ initialAudits, stats, companies, auditors }: AuditsClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showSuccessToast, setShowSuccessToast] = useState(false)

    const filteredAudits = initialAudits.filter(a =>
        a.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.auditeur.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function handleAuditCreated() {
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 4000)
        router.refresh()
    }

    return (
        <div className="space-y-6 relative">
            {/* Page Header with Search and Notifications */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gestion des audits</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Planifiez et suivez les audits terrain
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

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total audits</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                                <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
                            </div>
                            <FileText className="h-5 w-5 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Planifiés</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.planifie}</p>
                                <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
                            </div>
                            <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">En cours</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.enCours}</p>
                                <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
                            </div>
                            <FileText className="h-5 w-5 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Terminés</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.termine}</p>
                                <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar and Filter + Add Button Row */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise ou auditeur..."
                        className="pl-10 w-full bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Button variant="outline" className="gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                        </svg>
                        Tous les statuts
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Planifier un audit
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white border-b">
                            <TableHead className="font-medium text-slate-600">Entreprise</TableHead>
                            <TableHead className="font-medium text-slate-600">Type</TableHead>
                            <TableHead className="font-medium text-slate-600">Date</TableHead>
                            <TableHead className="font-medium text-slate-600">Auditeur</TableHead>
                            <TableHead className="font-medium text-slate-600">Statut</TableHead>
                            <TableHead className="font-medium text-slate-600 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAudits.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    {searchQuery ? "Aucun audit trouvé" : "Aucun audit planifié"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAudits.map((audit, index) => (
                                <TableRow key={`${audit.id}-${index}`} className="hover:bg-slate-50 border-b">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Image
                                                    src="/assets/images/community-line.png"
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="font-medium text-slate-900">{audit.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getTypeBadge(audit.type)}</TableCell>
                                    <TableCell className="text-slate-600">{audit.date}</TableCell>
                                    <TableCell className="text-slate-600">{audit.auditeur}</TableCell>
                                    <TableCell>{getStatutBadge(audit.statut)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => alert(`Voir détails de l'audit ${audit.id}`)}>
                                                    Voir détails
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert(`Modifier l'audit ${audit.id}`)}>
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => alert(`Annuler l'audit ${audit.id}`)}
                                                >
                                                    Annuler
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

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Audit planifié avec succès</span>
                </div>
            )}
        </div>
    )
}
