"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, Filter, Plus, MoreHorizontal, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuditeurStatCard } from "@/components/auditeur/auditeur-stat-card"
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

export function MesAuditsClient() {
    // Mock data
    const stats = {
        total: 3,
        planifies: 1,
        enCours: 1,
        termines: 1
    }

    const audits = [
        {
            id: 1,
            entreprise: "Salon Marie Coiffure",
            activite: "Coiffure",
            date: "2024-03-15",
            score: 85,
            statut: "Terminé",
            statutColor: "bg-green-100 text-green-700"
        },
        {
            id: 2,
            entreprise: "Restaurant le Gourmet",
            activite: "Restauration",
            date: "2024-03-15",
            score: 65,
            statut: "En cours",
            statutColor: "bg-orange-100 text-orange-700"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Mes audits</h1>
                        <p className="text-sm text-slate-500">Planifiez et suivez les audits terrain</p>
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
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
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
                <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher une entreprise ou commercial..."
                                    className="pl-10 bg-white border-slate-200"
                                />
                            </div>
                            <Button variant="outline" className="border-slate-300">
                                <Filter className="h-4 w-4 mr-2" />
                                Tous les statuts
                            </Button>
                        </div>
                        <Link href="/auditeur/audits/nouveau">
                            <Button className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvel audit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Audits Table */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead className="font-semibold text-slate-900">Entreprise</TableHead>
                                <TableHead className="font-semibold text-slate-900">Activité</TableHead>
                                <TableHead className="font-semibold text-slate-900">Date</TableHead>
                                <TableHead className="font-semibold text-slate-900">Score conformité</TableHead>
                                <TableHead className="font-semibold text-slate-900">Statut</TableHead>
                                <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {audits.map((audit) => (
                                <TableRow key={audit.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <span className="text-xs font-medium text-blue-600">
                                                    {audit.entreprise.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-slate-900">{audit.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{audit.activite}</TableCell>
                                    <TableCell className="text-slate-600">{audit.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px]">
                                                <div
                                                    className={`h-full rounded-full ${audit.score >= 80 ? "bg-green-500" : "bg-orange-500"
                                                        }`}
                                                    style={{ width: `${audit.score}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-slate-900">{audit.score}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={`${audit.statutColor} border-0 font-medium`}>
                                            {audit.statut}
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
                                                    <Link href={`/auditeur/audits/${audit.id}`}>
                                                        Voir détails
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/auditeur/audits/${audit.id}/edit`}>
                                                        Modifier
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => alert('Suppression annulée - fonctionnalité à implémenter')}>
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
