"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreHorizontal, Building2, Filter, Download, Eye, FileText, ShieldCheck, MessageSquare } from "lucide-react"
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
import { AdminHeader } from "@/components/admin/admin-header"

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
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0 gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Signé
                </Badge>
            )
        case "En attente":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal border-0">En attente</Badge>
        case "En cours":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">En cours</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

export function DuerpClient({ initialDuerps }: { initialDuerps: Duerp[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const filteredDuerps = initialDuerps.filter((d) => {
        const matchesSearch = d.entreprise
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        const matchesStatus =
            statusFilter === "all" ||
            d.statut.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const signedCount = initialDuerps.filter((d) => d.statut === "Signé").length

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <AdminHeader
                    title="Gestion des DUERP"
                    subtitle={`${initialDuerps.length} document${initialDuerps.length > 1 ? "s" : ""} — ${signedCount} signé${signedCount > 1 ? "s" : ""}`}
                />
                <Link href="/admin/duerp/nouveau">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Nouveau DUERP
                    </Button>
                </Link>
            </div>

            <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-1 rounded-lg">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise..."
                        className="pl-10 w-full bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                            <Filter className="h-4 w-4" />
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

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                            <TableHead className="py-4 font-semibold text-slate-900">Entreprise</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Création</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Prochaine révision</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Risques</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Statut</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDuerps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500">
                                        {searchQuery || statusFilter !== "all"
                                            ? "Aucun DUERP trouvé avec ces critères"
                                            : "Aucun DUERP enregistré"}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDuerps.map((duerp) => (
                                <TableRow key={duerp.id} className="hover:bg-slate-50/50 border-b">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">{duerp.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-slate-600">
                                        {new Date(duerp.creation).toLocaleDateString("fr-FR")}
                                    </TableCell>
                                    <TableCell className="py-4 text-slate-600">
                                        {duerp.expiration !== "Non défini"
                                            ? new Date(duerp.expiration).toLocaleDateString("fr-FR")
                                            : "Non défini"}
                                    </TableCell>
                                    <TableCell className="py-4 text-slate-600">{duerp.risques}</TableCell>
                                    <TableCell className="py-4">{getStatutBadge(duerp.statut)}</TableCell>
                                    <TableCell className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Bouton télécharger PDF direct */}
                                            <a
                                                href={`/api/duerp/${duerp.id}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Télécharger le PDF"
                                            >
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                                                    <Download className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            </a>
                                            {/* Menu actions */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild className="cursor-pointer">
                                                        <Link href={`/admin/duerp/${duerp.id}`}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Voir détails
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="cursor-pointer text-amber-600 focus:text-amber-600">
                                                        <Link href={`/admin/duerp/${duerp.id}#notes-internes`}>
                                                            <MessageSquare className="h-4 w-4 mr-2" />
                                                            Notes internes
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="cursor-pointer">
                                                        <a
                                                            href={`/api/duerp/${duerp.id}/pdf`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Télécharger PDF
                                                            {duerp.statut === "Signé" && (
                                                                <span className="ml-auto text-xs text-green-600">signé</span>
                                                            )}
                                                        </a>
                                                    </DropdownMenuItem>
                                                    {duerp.statut === "Signé" && (
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <a
                                                                href={`/api/duerp/${duerp.id}/attestation`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ShieldCheck className="h-4 w-4 mr-2" />
                                                                Attestation de conformité
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem asChild className="cursor-pointer text-orange-600 focus:text-orange-600">
                                                        <a
                                                            href={`/api/duerp/${duerp.id}/attestation-retrait?motif=MISE_A_JOUR`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            Attestation de retrait / MAJ
                                                        </a>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
