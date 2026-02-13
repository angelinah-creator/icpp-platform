"use client"

import { useState } from "react"
import { Search, Bell, Filter, Clock, CheckCircle, AlertCircle, Circle, Building2, Calendar, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuditorTask, updateTaskStatus } from "@/server/actions/taches"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

// Helper for priority colors
const getPriorityConfig = (priority: string) => {
    switch (priority) {
        case "Urgente":
            return { color: "bg-red-100 text-red-700", border: "border-l-red-500" }
        case "Haute":
            return { color: "bg-orange-100 text-orange-700", border: "border-l-orange-500" }
        case "Moyenne":
            return { color: "bg-yellow-100 text-yellow-700", border: "border-l-yellow-500" }
        default:
            return { color: "bg-blue-100 text-blue-700", border: "border-l-blue-500" }
    }
}

interface TachesClientProps {
    initialTasks: AuditorTask[]
}

export function TachesClient({ initialTasks = [] }: TachesClientProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [tasks, setTasks] = useState<AuditorTask[]>(initialTasks || [])

    // Handler to start a task (a_faire -> en_cours)
    const handleDemarrer = async (task: AuditorTask) => {
        // Optimistic update
        const newStatus = "en_cours"
        setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, statut: newStatus } : t
        ))

        const result = await updateTaskStatus(task.sourceId, task.sourceType, newStatus)
        if (result.success) {
            toast.success("Tâche démarrée")
        } else {
            toast.error("Erreur lors du démarrage de la tâche")
            // Revert would go here
        }
    }

    // Handler to complete a task (en_cours -> terminee)
    const handleTerminer = async (task: AuditorTask) => {
        // Optimistic update
        const newStatus = "terminee"
        setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, statut: newStatus } : t
        ))

        const result = await updateTaskStatus(task.sourceId, task.sourceType, newStatus)
        if (result.success) {
            toast.success("Tâche terminée")
        } else {
            toast.error("Erreur lors de la clôture de la tâche")
        }
    }

    // Calculate stats
    const stats = {
        aFaire: tasks.filter(t => t.statut === "a_faire").length,
        enCours: tasks.filter(t => t.statut === "en_cours").length,
        terminees: tasks.filter(t => t.statut === "terminee").length,
        urgentes: tasks.filter(t => t.priorite === "Urgente" && t.statut !== "terminee").length
    }

    const filteredTasks = tasks.filter(t =>
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
                                {stats.aFaire}
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
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-200">
                            Aucune tâche trouvée.
                        </div>
                    ) : (
                        filteredTasks.filter(t => t.statut !== "terminee").map((tache) => {
                            const priorityConfig = getPriorityConfig(tache.priorite)

                            return (
                                <div
                                    key={tache.id}
                                    className={`bg-white rounded-lg border border-slate-200 border-l-4 ${priorityConfig.border} p-4`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {/* Badges */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="secondary" className={`${priorityConfig.color} border-0 font-medium text-xs`}>
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
                                                    Échéance : {tache.echeance ? format(new Date(tache.echeance), "dd/MM/yyyy", { locale: fr }) : "Non définie"}
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
                                                    onClick={() => handleDemarrer(tache)}
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
                                                onClick={() => handleTerminer(tache)}
                                            >
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Terminer
                                            </Button>
                                        </div>
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
