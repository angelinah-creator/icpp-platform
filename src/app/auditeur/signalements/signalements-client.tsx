"use client"

import { useState } from "react"
import { Search, Bell, Filter, AlertCircle, Clock, CheckCircle, User, Wrench, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateSignalementStatus } from "@/server/actions/signalements"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

// Helper to map DB types/status to UI styles
const getTypeConfig = (type: string) => {
    const normalizedType = type.toUpperCase()
    switch (normalizedType) {
        case "NOUVEAU SALARIÉ":
        case "NOUVEAU_SALARIE":
            return { icon: User, iconBg: "bg-red-50", iconColor: "text-red-500", borderColor: "border-l-red-400" }
        case "ACCIDENT DU TRAVAIL":
        case "ACCIDENT":
        case "INCIDENT":
            return { icon: AlertCircle, iconBg: "bg-orange-50", iconColor: "text-orange-500", borderColor: "border-l-orange-400" }
        case "NOUVEL ÉQUIPEMENT":
        case "NOUVEL_EQUIPEMENT":
        case "EQUIPEMENT":
            return { icon: Wrench, iconBg: "bg-blue-50", iconColor: "text-blue-500", borderColor: "border-l-blue-400" }
        case "DÉMÉNAGEMENT":
        case "DEMENAGEMENT":
            return { icon: MapPin, iconBg: "bg-yellow-50", iconColor: "text-yellow-500", borderColor: "border-l-yellow-400" }
        default:
            return { icon: AlertCircle, iconBg: "bg-slate-50", iconColor: "text-slate-500", borderColor: "border-l-slate-400" }
    }
}

const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toUpperCase()
    switch (normalizedStatus) {
        case "NOUVEAU":
            return { label: "Nouveau", color: "bg-blue-100 text-blue-700" }
        case "EN_COURS":
        case "EN COURS":
            return { label: "En cours", color: "bg-orange-100 text-orange-700" }
        case "TRAITÉ":
        case "TRAITE":
            return { label: "Traité", color: "bg-green-100 text-green-700" }
        default:
            return { label: status, color: "bg-slate-100 text-slate-700" }
    }
}

interface SignalementsClientProps {
    initialSignalements: any[] // Using any for now to avoid strict Prisma type coupling in client, but ideally should be inferred
}

export function SignalementsClient({ initialSignalements }: SignalementsClientProps) {
    const [searchQuery, setSearchQuery] = useState("")

    // We use the initial data passed from server, but we might want to update local state optimistically
    // For now, allow simple filtering on the prop data. 
    // If we needed optimistic updates, we'd use useOptimistic or a local state initialized with props.
    // Let's use local state to verify the UI updates immediately.
    const [signalements, setSignalements] = useState(initialSignalements)

    // Calculate stats
    const stats = {
        nouveaux: signalements.filter(s => s.status === "NOUVEAU").length,
        enCours: signalements.filter(s => s.status === "EN_COURS").length,
        traites: signalements.filter(s => s.status === "TRAITE").length
    }

    const filteredSignalements = signalements.filter(s =>
        (s.company?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.titre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setSignalements(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))

        const result = await updateSignalementStatus(id, newStatus)
        if (!result.success) {
            // Revert on failure (simplified)
            toast.error("Erreur lors de la mise à jour")
            // In a real app we'd revert the state here
        } else {
            toast.success("Statut mis à jour")
        }
    }

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
                                placeholder="Rechercher ..."
                                className="w-64 bg-slate-50 pl-10 border-slate-200"
                            />
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                {stats.nouveaux}
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
                            placeholder="Rechercher ..."
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
                    {filteredSignalements.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-200">
                            Aucun signalement trouvé.
                        </div>
                    ) : (
                        filteredSignalements.map((s) => {
                            const typeConfig = getTypeConfig(s.type)
                            const statusConfig = getStatusConfig(s.status)
                            const Icon = typeConfig.icon

                            return (
                                <div
                                    key={s.id}
                                    className={`bg-white rounded-lg border border-slate-200 ${typeConfig.borderColor} border-l-4 p-4 flex items-center justify-between`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-lg ${typeConfig.iconBg} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`h-5 w-5 ${typeConfig.iconColor}`} />
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-slate-900">{s.company?.name || "Entreprise inconnue"}</p>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal text-xs">
                                                    {s.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-1">{s.description}</p>
                                            <p className="text-xs text-slate-400">
                                                Déclaré le {format(new Date(s.createdAt), "d MMMM yyyy", { locale: fr })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        {s.status === "NOUVEAU" && (
                                            <>
                                                <Badge variant="secondary" className={statusConfig.color}>
                                                    {statusConfig.label}
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                                    onClick={() => handleUpdateStatus(s.id, "EN_COURS")}
                                                >
                                                    Prendre en charge
                                                </Button>
                                            </>
                                        )}
                                        {s.status === "EN_COURS" && (
                                            <>
                                                <Badge variant="secondary" className={statusConfig.color}>
                                                    {statusConfig.label}
                                                </Badge>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                    onClick={() => handleUpdateStatus(s.id, "TRAITE")}
                                                >
                                                    Valider
                                                </Button>
                                            </>
                                        )}
                                        {(s.status === "TRAITE" || s.status === "TRAITÉ") && (
                                            <Badge variant="secondary" className={statusConfig.color}>
                                                {statusConfig.label}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
