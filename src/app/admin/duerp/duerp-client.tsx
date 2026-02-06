"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Bell } from "lucide-react"
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

interface Duerp {
    id: string
    entreprise: string
    creation: string
    expiration: string
    risques: string
    statut: string
}

interface DuerpClientProps {
    initialDuerps: Duerp[]
}

function getStatutBadge(statut: string) {
    switch (statut) {
        case "Signé":
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">Signé</Badge>
        case "En attente":
            return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal border-0">En attente</Badge>
        case "En cours":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">En cours</Badge>
        default:
            return <Badge variant="secondary">{statut}</Badge>
    }
}

export function DuerpClient({ initialDuerps }: DuerpClientProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredDuerps = initialDuerps.filter(d =>
        d.entreprise.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gestion des DUERP</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {initialDuerps.length} document{initialDuerps.length > 1 ? "s" : ""} unique{initialDuerps.length > 1 ? "s" : ""}
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

            {/* Search Bar and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par entreprise..."
                        className="pl-10 w-full bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2 flex-shrink-0">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                    </svg>
                    Tous les statuts
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white border-b">
                            <TableHead className="font-medium text-slate-600">Entreprise</TableHead>
                            <TableHead className="font-medium text-slate-600">Création</TableHead>
                            <TableHead className="font-medium text-slate-600">Expiration</TableHead>
                            <TableHead className="font-medium text-slate-600">Risques identifiés</TableHead>
                            <TableHead className="font-medium text-slate-600">Statut</TableHead>
                            <TableHead className="font-medium text-slate-600 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDuerps.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    {searchQuery ? "Aucun DUERP trouvé" : "Aucun DUERP enregistré"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDuerps.map((duerp, index) => (
                                <TableRow key={`${duerp.id}-${index}`} className="hover:bg-slate-50 border-b">
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
                                            <span className="font-medium text-slate-900">{duerp.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{duerp.creation}</TableCell>
                                    <TableCell className="text-slate-600">{duerp.expiration}</TableCell>
                                    <TableCell className="text-slate-600">{duerp.risques}</TableCell>
                                    <TableCell>{getStatutBadge(duerp.statut)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Voir détails</DropdownMenuItem>
                                                <DropdownMenuItem>Télécharger PDF</DropdownMenuItem>
                                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
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
    )
}
