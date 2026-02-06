"use client"

import { useState } from "react"
import { Search, Bell, Filter, Clock, CheckCircle, AlertCircle, Circle, Building2, Calendar, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Tache {
    id: number
    titre: string
    type: string
    priorite: string
    prioriteColor: string
    borderColor: string
    entreprise: string
    echeance: string
    statut: "a_faire" | "en_cours" | "terminee"
}

export function TachesClient() {
    const [searchQuery, setSearchQuery] = useState("")

    // Tâches data with local state for status management
    const [tachesData, setTachesData] = useState<Tache[]>([
        {
            id: 1,
            titre: "Contrôle suite accident du travail",
            type: "Contrôle post-accident",
            priorite: "Urgente",
            prioriteColor: "bg-red-100 text-red-700",
            borderColor: "border-l-red-500",
            entreprise: "Boulangerie Dupont",
            echeance: "Échéance: 02/01/2026",
            statut: "a_faire"
        },
        {
            id: 2,
            titre: "Nouvel audit suite signalement",
            type: "Nouvel audit",
            priorite: "Haute",
            prioriteColor: "bg-orange-100 text-orange-700",
            borderColor: "border-l-orange-500",
            entreprise: "Restaurant Le Gourmet",
            echeance: "Échéance: 20/01/2026",
            statut: "en_cours"
        },
        {
            id: 3,
            titre: "Premier audit - nouvelle entreprise",
            type: "Nouvel audit",
            priorite: "Haute",
            prioriteColor: "bg-orange-100 text-orange-700",
            borderColor: "border-l-orange-500",
            entreprise: "Institut Beauté Zen",
            echeance: "Échéance: 26/01/2026",
            statut: "a_faire"
        },
        {
            id: 4,
            titre: "Mise à jour annuelle DUERP",
            type: "Mise à jour DUERP",
            priorite: "Moyenne",
            prioriteColor: "bg-yellow-100 text-yellow-700",
            borderColor: "border-l-yellow-500",
            entreprise: "Salon Marie Coiffure",
            echeance: "Échéance: 30/01/2026",
            statut: "a_faire"
        },
    ])

    // Handler to start a task (a_faire -> en_cours)
    const handleDemarrer = (id: number) => {
        setTachesData(prev => prev.map(t =>
            t.id === id ? { ...t, statut: "en_cours" as const } : t
        ))
    }

    // Handler to complete a task (en_cours -> terminee or a_faire -> terminee)
    const handleTerminer = (id: number) => {
        setTachesData(prev => prev.map(t =>
            t.id === id ? { ...t, statut: "terminee" as const } : t
        ))
    }

    // Calculate stats from current data
    const stats = {
        aFaire: tachesData.filter(t => t.statut === "a_faire").length,
        enCours: tachesData.filter(t => t.statut === "en_cours").length,
        terminees: tachesData.filter(t => t.statut === "terminee").length,
        urgentes: tachesData.filter(t => t.priorite === "Urgente" && t.statut !== "terminee").length
    }

    const filteredTaches = tachesData.filter(t =>
        t.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.entreprise.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Mes tâches</h1>
                        <p className="text-sm text-slate-500">Gérez vos tâches et priorités</p>
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
                    {/* À faire */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Circle className="h-5 w-5 text-slate-400" />
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats.aFaire}</p>
                                <p className="text-sm text-slate-500">À faire</p>
                            </div>
                        </div>
                    </div>

                    {/* En cours */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats.enCours}</p>
                                <p className="text-sm text-slate-500">En cours</p>
                            </div>
                        </div>
                    </div>

                    {/* Terminées */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats.terminees}</p>
                                <p className="text-sm text-slate-500">Terminées</p>
                            </div>
                        </div>
                    </div>

                    {/* Urgentes */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-3xl font-bold text-slate-900">{stats.urgentes}</p>
                                <p className="text-sm text-slate-500">Urgentes</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white border-slate-200"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="border-slate-300 bg-white">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {/* Tâches List */}
                <div className="space-y-4">
                    {filteredTaches.filter(t => t.statut !== "terminee").map((tache) => (
                        <div
                            key={tache.id}
                            className={`bg-white rounded-lg border border-slate-200 border-l-4 ${tache.borderColor} p-4`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    {/* Badges */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary" className={`${tache.prioriteColor} border-0 font-medium text-xs`}>
                                            {tache.priorite}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal text-xs">
                                            {tache.type}
                                        </Badge>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-slate-900 mb-2">{tache.titre}</h3>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="h-3 w-3" />
                                            {tache.entreprise}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {tache.echeance}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {tache.statut === "a_faire" && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-300"
                                            onClick={() => handleDemarrer(tache.id)}
                                        >
                                            <Play className="h-3 w-3 mr-1" />
                                            Démarrer
                                        </Button>
                                    )}
                                    {tache.statut === "en_cours" && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                                            En cours
                                        </Badge>
                                    )}
                                    <Button
                                        size="sm"
                                        className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                        onClick={() => handleTerminer(tache.id)}
                                    >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Terminer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
