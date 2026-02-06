"use client"

import { useState } from "react"
import { Search, Bell, Filter, AlertCircle, Clock, CheckCircle, User, Wrench, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Signalement {
    id: number
    entreprise: string
    type: string
    description: string
    date: string
    statut: "Nouveau" | "En cours" | "Traité"
    statutColor: string
    iconBg: string
    iconColor: string
    borderColor: string
    icon: React.ComponentType<{ className?: string }>
}

export function SignalementsClient() {
    const [searchQuery, setSearchQuery] = useState("")

    // Signalements data with local state for status management
    const [signalementsData, setSignalementsData] = useState<Signalement[]>([
        {
            id: 1,
            entreprise: "Restaurant le Gourmet",
            type: "Nouveau salarié",
            description: "Embauche d'un nouveau cuisinier à partir du 15 janvier",
            date: "Déclaré le 2025-01-05",
            statut: "Nouveau",
            statutColor: "bg-blue-100 text-blue-700",
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
            borderColor: "border-l-red-400",
            icon: User
        },
        {
            id: 2,
            entreprise: "Boulangerie Dupont",
            type: "Accident du travail",
            description: "Brûlure légère au four, arrêt de 3 jours",
            date: "Déclaré le 2025-01-04",
            statut: "En cours",
            statutColor: "bg-orange-100 text-orange-700",
            iconBg: "bg-orange-50",
            iconColor: "text-orange-500",
            borderColor: "border-l-orange-400",
            icon: AlertCircle
        },
        {
            id: 3,
            entreprise: "Salon Marie Coiffure",
            type: "Nouvel équipement",
            description: "Installation d'un nouveau bac de lavage avec pompe",
            date: "Déclaré le 2025-01-05",
            statut: "Traité",
            statutColor: "bg-green-100 text-green-700",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            borderColor: "border-l-blue-400",
            icon: Wrench
        },
        {
            id: 4,
            entreprise: "Institut Beauté Zen",
            type: "Déménagement",
            description: "Déménagement prévu au 20 rue du Commerce, même ville",
            date: "Déclaré le 2025-01-03",
            statut: "Nouveau",
            statutColor: "bg-blue-100 text-blue-700",
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-500",
            borderColor: "border-l-yellow-400",
            icon: MapPin
        },
    ])

    // Handler to take charge of a signalement (Nouveau -> En cours)
    const handlePrendreEnCharge = (id: number) => {
        setSignalementsData(prev => prev.map(s =>
            s.id === id
                ? { ...s, statut: "En cours" as const, statutColor: "bg-orange-100 text-orange-700" }
                : s
        ))
    }

    // Handler to validate a signalement (En cours -> Traité)
    const handleValider = (id: number) => {
        setSignalementsData(prev => prev.map(s =>
            s.id === id
                ? { ...s, statut: "Traité" as const, statutColor: "bg-green-100 text-green-700" }
                : s
        ))
    }

    // Calculate stats from current data
    const stats = {
        nouveaux: signalementsData.filter(s => s.statut === "Nouveau").length,
        enCours: signalementsData.filter(s => s.statut === "En cours").length,
        traites: signalementsData.filter(s => s.statut === "Traité").length
    }

    const filteredSignalements = signalementsData.filter(s =>
        s.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Signalements client</h1>
                        <p className="text-sm text-slate-500">Gérez les déclarations de changement des entreprises</p>
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
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Nouveaux signalements */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="text-3xl font-bold text-red-600">{stats.nouveaux}</p>
                                <p className="text-sm text-red-600">Nouveaux signalements</p>
                            </div>
                        </div>
                    </div>

                    {/* En cours de traitement */}
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-3xl font-bold text-orange-600">{stats.enCours}</p>
                                <p className="text-sm text-orange-600">En cours de traitement</p>
                            </div>
                        </div>
                    </div>

                    {/* Traité ce mois */}
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-3xl font-bold text-green-600">{stats.traites}</p>
                                <p className="text-sm text-green-600">Traité ce mois</p>
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

                {/* Signalements List */}
                <div className="space-y-4">
                    {filteredSignalements.map((signalement) => {
                        const Icon = signalement.icon
                        return (
                            <div
                                key={signalement.id}
                                className={`bg-white rounded-lg border border-slate-200 border-l-4 ${signalement.borderColor} p-4 flex items-center justify-between`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-lg ${signalement.iconBg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`h-5 w-5 ${signalement.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-slate-900">{signalement.entreprise}</p>
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal text-xs">
                                                {signalement.type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-1">{signalement.description}</p>
                                        <p className="text-xs text-slate-400">{signalement.date}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    {signalement.statut === "Nouveau" && (
                                        <>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                                                Nouveau
                                            </Badge>
                                            <Button
                                                size="sm"
                                                className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                                onClick={() => handlePrendreEnCharge(signalement.id)}
                                            >
                                                Prendre en charge
                                            </Button>
                                        </>
                                    )}
                                    {signalement.statut === "En cours" && (
                                        <>
                                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-medium">
                                                En cours
                                            </Badge>
                                            <Button
                                                size="sm"
                                                className="bg-green-500 hover:bg-green-600 text-white"
                                                onClick={() => handleValider(signalement.id)}
                                            >
                                                Valider
                                            </Button>
                                        </>
                                    )}
                                    {signalement.statut === "Traité" && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium">
                                            Traité
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
