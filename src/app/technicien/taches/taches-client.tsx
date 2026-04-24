"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Clock, CheckCircle, AlertCircle, Circle, Building2, Calendar, Play, FileText, Send, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { TacheData, updateTacheStatus, saveRapportTache } from "@/server/actions/taches"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

// Helper for priority colors
const getPriorityConfig = (priority: string) => {
    switch (priority) {
        case "URGENTE":
            return { color: "bg-red-100 text-red-700", border: "border-l-red-500" }
        case "HAUTE":
            return { color: "bg-orange-100 text-orange-700", border: "border-l-orange-500" }
        case "MOYENNE":
            return { color: "bg-yellow-100 text-yellow-700", border: "border-l-yellow-500" }
        default:
            return { color: "bg-blue-100 text-blue-700", border: "border-l-blue-500" }
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case "A_FAIRE": return "À faire"
        case "EN_COURS": return "En cours"
        case "TERMINEE": return "Terminée"
        default: return status
    }
}

interface TacheWithRapport extends TacheData {
    rapport?: string | null
    rapportStatut?: string | null
}

interface TachesClientProps {
    initialTasks: TacheWithRapport[]
}

export function TachesClient({ initialTasks = [] }: TachesClientProps) {
    const searchParams = useSearchParams()
    const view = searchParams.get("view")
    const isRapportView = view === "rapports"

    const [searchQuery, setSearchQuery] = useState("")
    const [tasks, setTasks] = useState<TacheWithRapport[]>(initialTasks || [])

    // Rapport modal state
    const [rapportModal, setRapportModal] = useState<{ open: boolean; tache: TacheWithRapport | null }>({ open: false, tache: null })
    const [rapportText, setRapportText] = useState("")
    const [isSavingRapport, setIsSavingRapport] = useState(false)

    // Handler to start a task (A_FAIRE -> EN_COURS)
    const handleDemarrer = async (task: TacheData) => {
        setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: "EN_COURS" } : t
        ))

        const result = await updateTacheStatus(task.id, "EN_COURS")
        if (result.success) {
            toast.success("Tâche démarrée")
        } else {
            toast.error("Erreur lors du démarrage de la tâche")
        }
    }

    // Handler to complete a task (EN_COURS -> TERMINEE)
    const handleTerminer = async (task: TacheWithRapport) => {
        setTasks(prev => prev.map(t =>
            t.id === task.id ? { ...t, status: "TERMINEE" } : t
        ))

        const result = await updateTacheStatus(task.id, "TERMINEE")
        if (result.success) {
            toast.success("Tâche terminée")
        } else {
            toast.error("Erreur lors de la clôture de la tâche")
        }
    }

    // Open rapport modal
    const handleOpenRapport = (tache: TacheWithRapport) => {
        setRapportText(tache.rapport || "")
        setRapportModal({ open: true, tache })
    }

    // Save rapport as draft
    const handleSaveDraft = async () => {
        if (!rapportModal.tache) return
        setIsSavingRapport(true)
        try {
            const result = await saveRapportTache(rapportModal.tache.id, rapportText, false)
            if (result.success) {
                setTasks(prev => prev.map(t => t.id === rapportModal.tache!.id ? { ...t, rapport: rapportText, rapportStatut: "REDIGE" } : t))
                toast.success("Brouillon enregistré")
                setRapportModal({ open: false, tache: null })
            } else {
                toast.error(result.error || "Erreur")
            }
        } finally {
            setIsSavingRapport(false)
        }
    }

    // Send rapport to admin
    const handleSendRapport = async () => {
        if (!rapportModal.tache || !rapportText.trim()) {
            toast.error("Veuillez rédiger un rapport avant d'envoyer")
            return
        }
        setIsSavingRapport(true)
        try {
            const result = await saveRapportTache(rapportModal.tache.id, rapportText, true)
            if (result.success) {
                setTasks(prev => prev.map(t => t.id === rapportModal.tache!.id ? { ...t, rapport: rapportText, rapportStatut: "ENVOYE" } : t))
                toast.success("Rapport envoyé à l'administrateur")
                setRapportModal({ open: false, tache: null })
            } else {
                toast.error(result.error || "Erreur")
            }
        } finally {
            setIsSavingRapport(false)
        }
    }

    // Calculate stats
    const stats = {
        aFaire: tasks.filter(t => t.status === "A_FAIRE").length,
        enCours: tasks.filter(t => t.status === "EN_COURS").length,
        terminees: tasks.filter(t => t.status === "TERMINEE").length,
        urgentes: tasks.filter(t => t.priorite === "URGENTE" && t.status !== "TERMINEE").length
    }

    const filteredTasks = tasks.filter(t =>
        t.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.entreprise.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const displayTasks = isRapportView
        ? filteredTasks.filter(t => t.status === "TERMINEE" || t.rapportStatut)
        : filteredTasks

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            {isRapportView ? "Mes rapports" : "Mes tâches"}
                        </h1>
                        <p className="text-sm text-slate-500 hidden sm:block">Gérez vos tâches et priorités</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-64 bg-slate-50 pl-10 border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    {displayTasks.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-200">
                            {isRapportView ? "Aucun rapport trouvé." : "Aucune tâche assignée pour le moment."}
                        </div>
                    ) : (
                        displayTasks.filter(t => isRapportView || t.status !== "TERMINEE").map((tache) => {
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
                                            <h3 className="font-semibold text-slate-900 mb-1">{tache.titre}</h3>

                                            {/* Description */}
                                            {tache.description && (
                                                <p className="text-sm text-slate-500 mb-2">{tache.description}</p>
                                            )}

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
                                        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
                                            {/* Rapport badge */}
                                            {tache.rapportStatut === "ENVOYE" && (
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium">
                                                    <Send className="h-3 w-3 mr-1" />Envoyé
                                                </Badge>
                                            )}
                                            {tache.rapportStatut === "REDIGE" && (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium">
                                                    <FileText className="h-3 w-3 mr-1" />Brouillon
                                                </Badge>
                                            )}
                                            {tache.status !== "A_FAIRE" && tache.rapportStatut !== "ENVOYE" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-300 text-slate-600"
                                                    onClick={(e) => { e.stopPropagation(); handleOpenRapport(tache) }}
                                                >
                                                    {tache.rapport ? <Pencil className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                                                    Rapport
                                                </Button>
                                            )}
                                            {tache.status === "A_FAIRE" && (
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
                                            {tache.status === "EN_COURS" && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                                                    En cours
                                                </Badge>
                                            )}
                                            {tache.status !== "TERMINEE" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                                    onClick={() => handleTerminer(tache)}
                                                >
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Terminer
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* ── Modal Rapport ── */}
            <Dialog open={rapportModal.open} onOpenChange={(open) => !open && setRapportModal({ open: false, tache: null })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            Rapport de tâche
                        </DialogTitle>
                        <DialogDescription>
                            {rapportModal.tache?.titre} — {rapportModal.tache?.entreprise}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {rapportModal.tache?.rapportStatut === "ENVOYE" ? (
                            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                                <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                                    <Send className="h-4 w-4" /> Rapport envoyé à l&apos;administration
                                </p>
                                <p className="text-sm text-green-700 whitespace-pre-wrap">{rapportModal.tache.rapport}</p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                                        Contenu du rapport
                                    </label>
                                    <Textarea
                                        value={rapportText}
                                        onChange={(e) => setRapportText(e.target.value)}
                                        placeholder="Décrivez les actions effectuées, les observations, les recommandations..."
                                        className="min-h-[200px] resize-y"
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleSaveDraft}
                                        disabled={isSavingRapport || !rapportText.trim()}
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Enregistrer brouillon
                                    </Button>
                                    <Button
                                        onClick={handleSendRapport}
                                        disabled={isSavingRapport || !rapportText.trim()}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Envoyer à l&apos;admin
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
