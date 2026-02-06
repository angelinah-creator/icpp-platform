"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, Filter, MoreHorizontal, Download, Send, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export function DuerpClient() {
    const [searchQuery, setSearchQuery] = useState("")

    // Mock data matching the mockup
    const duerps = [
        {
            id: 1,
            entreprise: "Salon Marie Coiffure",
            creation: "2023-03-15",
            expiration: "2024-03-15",
            risques: 4,
            statut: "Signé",
            statutColor: "bg-green-100 text-green-700"
        },
        {
            id: 2,
            entreprise: "Restaurant Le Gourmet",
            creation: "2023-06-01",
            expiration: "2024-06-01",
            risques: 5,
            statut: "En attente",
            statutColor: "bg-orange-100 text-orange-700"
        },
        {
            id: 3,
            entreprise: "Boulangerie Dupont",
            creation: "2023-06-01",
            expiration: "2024-06-01",
            risques: 4,
            statut: "En cours",
            statutColor: "bg-blue-100 text-blue-700"
        },
        {
            id: 4,
            entreprise: "Salon Marie Coiffure",
            creation: "2023-03-15",
            expiration: "2024-03-15",
            risques: 3,
            statut: "Signé",
            statutColor: "bg-green-100 text-green-700"
        },
        {
            id: 5,
            entreprise: "Restaurant Le Gourmet",
            creation: "2023-06-01",
            expiration: "2024-06-01",
            risques: 3,
            statut: "En attente",
            statutColor: "bg-orange-100 text-orange-700"
        },
        {
            id: 6,
            entreprise: "Boulangerie Dupont",
            creation: "2023-06-01",
            expiration: "2024-06-01",
            risques: 5,
            statut: "En cours",
            statutColor: "bg-blue-100 text-blue-700"
        },
        {
            id: 7,
            entreprise: "Salon Marie Coiffure",
            creation: "2023-03-15",
            expiration: "2024-03-15",
            risques: 4,
            statut: "Signé",
            statutColor: "bg-green-100 text-green-700"
        },
        {
            id: 8,
            entreprise: "Restaurant Le Gourmet",
            creation: "2023-06-01",
            expiration: "2024-06-01",
            risques: 4,
            statut: "En attente",
            statutColor: "bg-orange-100 text-orange-700"
        },
    ]

    const filteredDuerps = duerps.filter(duerp =>
        duerp.entreprise.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Liste des DUERP</h1>
                        <p className="text-sm text-slate-500">Consultez et téléchargez les Documents Uniques</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-64 bg-slate-50 pl-10 border-slate-200"
                            />
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                2
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher par entreprise ou commercial..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white border-slate-200"
                            />
                        </div>
                        <Button variant="outline" className="border-slate-300">
                            <Filter className="h-4 w-4 mr-2" />
                            Tous les statuts
                        </Button>
                    </div>
                </div>

                {/* DUERP Table */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="font-semibold text-slate-900">Entreprise</TableHead>
                                <TableHead className="font-semibold text-slate-900">Création</TableHead>
                                <TableHead className="font-semibold text-slate-900">Expiration</TableHead>
                                <TableHead className="font-semibold text-slate-900">Risques identifiés</TableHead>
                                <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                                <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDuerps.map((duerp) => (
                                <TableRow key={duerp.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <span className="text-xs font-medium text-blue-600">
                                                    {duerp.entreprise.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-900">{duerp.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{duerp.creation}</TableCell>
                                    <TableCell className="text-slate-600">{duerp.expiration}</TableCell>
                                    <TableCell className="text-slate-600">{duerp.risques} risques</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`${duerp.statutColor} border-0 font-medium`}>
                                            {duerp.statut}
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
                                                    <Link href={`/auditeur/duerp/${duerp.id}`}>
                                                        Voir détails
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert('Téléchargement du PDF en cours...')}>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Télécharger PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => alert('Email de signature envoyé !')}>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Envoyer pour signature
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => alert('Suppression annulée - fonctionnalité à implémenter')}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
