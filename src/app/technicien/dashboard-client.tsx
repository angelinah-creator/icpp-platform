"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, ListTodo, CheckCircle, Clock, FileText, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardData {
    user: {
        name: string | null | undefined
        email: string | null | undefined
    }
    stats: {
        tachesEnCours: number
        tachesAFaire: number
        tachesTerminees: number
    }
}

interface Tache {
    id: string
    companyName: string
    task: string
    date: string
    status: string
    statusColor: string
}

interface TechnicienDashboardClientProps {
    data: DashboardData
    taches: Tache[]
}

export function TechnicienDashboardClient({ data, taches }: TechnicienDashboardClientProps) {
    const stats = data?.stats || { tachesEnCours: 0, tachesAFaire: 0, tachesTerminees: 0 }
    const userName = data?.user?.name || "Technicien"

    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Espace Technicien – ICPP</h1>
                        <p className="text-sm text-slate-500">Bienvenue {userName}</p>
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
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-200 transition-all duration-300">
                                <ListTodo className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Tâches à faire</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.tachesAFaire}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
                                <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">En cours</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.tachesEnCours}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Terminées</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.tachesTerminees}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Link href="/technicien/taches">
                        <Button className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white px-6 py-2 rounded-lg font-medium">
                            <FileText className="h-4 w-4 mr-2" />
                            Mes rapports
                        </Button>
                    </Link>
                    <Link href="/technicien/taches">
                        <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 px-6 py-2 rounded-lg font-medium">
                            <Plus className="h-4 w-4 mr-2 text-slate-600" />
                            Nouvelle intervention
                        </Button>
                    </Link>
                </div>

                {/* Recent Tasks */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-500">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Mes dernières tâches</h2>
                        <Link href="/technicien/taches">
                            <Button variant="outline" size="sm">Voir tout</Button>
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-200">
                        {taches.slice(0, 5).map((tache) => (
                            <div key={tache.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{tache.task}</p>
                                        <p className="text-sm text-slate-600">{tache.companyName}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-slate-500">{tache.date}</span>
                                        <Badge
                                            variant={tache.statusColor === "orange" ? "secondary" : "default"}
                                            className="ml-2"
                                        >
                                            {tache.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
