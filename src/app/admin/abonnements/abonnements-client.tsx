"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Bell, FileText } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Subscription {
    id: string
    entreprise: string
    plan: string
    prix: string
    statut: string
}

interface Stats {
    revenuMensuel: number
    abonnementsActifs: number
    tauxRenouvellement: number
}

interface AbonnementsClientProps {
    initialSubscriptions: Subscription[]
    stats: Stats
}

function getPlanBadge(plan: string) {
    switch (plan) {
        case "Premium": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 font-normal border-0">Premium</Badge>
        case "Essentiel": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal border-0">Essentiel</Badge>
        case "Pro": return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 font-normal border-0">Pro</Badge>
        default: return <Badge variant="secondary">{plan}</Badge>
    }
}

function getStatutBadge(statut: string) {
    switch (statut) {
        case "Actif": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">Actif</Badge>
        case "En attente": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-normal border-0">En attente</Badge>
        default: return <Badge variant="secondary">{statut}</Badge>
    }
}

export function AbonnementsClient({ initialSubscriptions, stats }: AbonnementsClientProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredSubscriptions = initialSubscriptions.filter(s =>
        s.entreprise.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Gestion des abonnements</h1>
                    <p className="text-sm text-slate-500 mt-1">Suivez les abonnements et les revenus</p>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Revenu mensuel</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.revenuMensuel}€</p>
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
                                <p className="text-sm text-slate-500">Abonnements actifs</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.abonnementsActifs}</p>
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
                                <p className="text-sm text-slate-500">Taux renouvellement</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{(stats.tauxRenouvellement * 100).toFixed(0)}%</p>
                                <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
                            </div>
                            <FileText className="h-5 w-5 text-slate-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une entreprise..."
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
                            <TableHead className="font-medium text-slate-600">Plan</TableHead>
                            <TableHead className="font-medium text-slate-600">Prix mensuel</TableHead>
                            <TableHead className="font-medium text-slate-600">Statut</TableHead>
                            <TableHead className="font-medium text-slate-600 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    {searchQuery ? "Aucun abonnement trouvé" : "Aucun abonnement"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubscriptions.map((sub, index) => (
                                <TableRow key={`${sub.id}-${index}`} className="hover:bg-slate-50 border-b">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Image src="/assets/images/community-line.png" alt="" width={16} height={16} className="object-contain" />
                                            </div>
                                            <span className="font-medium text-slate-900">{sub.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                                    <TableCell className="text-slate-600">{sub.prix}</TableCell>
                                    <TableCell>{getStatutBadge(sub.statut)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Voir détails</DropdownMenuItem>
                                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">Résilier</DropdownMenuItem>
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
