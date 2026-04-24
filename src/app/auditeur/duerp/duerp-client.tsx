"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, MoreHorizontal, Download, Eye, FileText, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
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

interface Duerp {
    id: string
    entreprise: string
    creation: string
    expiration: string
    risques: string
    statut: string
}

function getStatutBadge(statut: string) {
    switch (statut) {
        case "Signé":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">{statut}</Badge>
        case "En cours":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">{statut}</Badge>
        case "En attente":
            return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">{statut}</Badge>
        default:
            return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0">{statut}</Badge>
    }
}

export function DuerpClient({ initialDuerps }: { initialDuerps: Duerp[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const filteredDuerps = initialDuerps.filter((duerp) => {
        const matchesSearch = duerp.entreprise
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesStatus =
            statusFilter === "all" ||
            duerp.statut.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Liste des DUERP</h1>
                        <p className="text-sm text-slate-500">
                            Consultez et signez les Documents Uniques — {initialDuerps.length} document{initialDuerps.length > 1 ? "s" : ""}
                        </p>
                    </div>
                    <div>
                        <NotificationBell />
                    </div>
                </div>
            </header>

            <div className="p-8">
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher par entreprise..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white border-slate-200"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-slate-300">
                                    <Filter className="h-4 w-4 mr-2" />
                                    {statusFilter === "all" ? "Tous les statuts" : statusFilter}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Tous</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("Signé")}>Signé</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("En cours")}>En cours</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("En attente")}>En attente</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="font-semibold text-slate-900">Entreprise</TableHead>
                                <TableHead className="font-semibold text-slate-900">Création</TableHead>
                                <TableHead className="font-semibold text-slate-900">Prochaine révision</TableHead>
                                <TableHead className="font-semibold text-slate-900">Risques</TableHead>
                                <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                                <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDuerps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-slate-500">Aucun DUERP trouvé</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDuerps.map((duerp) => (
                                    <TableRow key={duerp.id} className="hover:bg-slate-50">
                                        <TableCell>
                                            <Link
                                                href={`/auditeur/duerp/${duerp.id}`}
                                                className="flex items-center gap-3 hover:underline"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-blue-600">
                                                        {duerp.entreprise.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-slate-900">
                                                    {duerp.entreprise}
                                                </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {new Date(duerp.creation).toLocaleDateString("fr-FR")}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {duerp.expiration !== "Non défini"
                                                ? new Date(duerp.expiration).toLocaleDateString("fr-FR")
                                                : "Non défini"}
                                        </TableCell>
                                        <TableCell className="text-slate-600">{duerp.risques}</TableCell>
                                        <TableCell>{getStatutBadge(duerp.statut)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/auditeur/duerp/${duerp.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Voir détails / Signer
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="cursor-pointer text-amber-600 focus:text-amber-600">
                                                        <Link href={`/auditeur/duerp/${duerp.id}#notes-internes`} className="flex items-center gap-2">
                                                            <MessageSquare className="h-4 w-4" />
                                                            Notes internes
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={`/api/duerp/${duerp.id}/pdf`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Télécharger PDF
                                                        </a>
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
            </div>
        </div>
    )
}
