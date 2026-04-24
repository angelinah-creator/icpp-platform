"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Clock, CheckCircle, AlertCircle, Circle, Building2, Calendar, Play, FileText, Send, Pencil } from "lucide-react"
import { NotificationBell } from "@/components/notifications/notification-bell"
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
    const handleDemarrer = async (task: TacheWithRapport) => {
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
        const result = await saveRapportTache(rapportModal.tache.id, rapportText, false)
        setIsSavingRapport(false)
        if (result.success) {
            setTasks(prev => prev.map(t =>
                t.id === rapportModal.tache!.id ? { ...t, rapport: rapportText, rapportStatut: "REDIGE" } : t
            ))
            toast.success("Brouillon enregistré")
        } else {
            toast.error(result.error || "Erreur")
        }
    }

    // Send rapport to admin
    const handleEnvoyer = async () => {
        if (!rapportModal.tache || !rapportText.trim()) {
            toast.error("Le rapport ne peut pas être vide")
            return
        }
        setIsSavingRapport(true)
        const result = await saveRapportTache(rapportModal.tache.id, rapportText, true)
        setIsSavingRapport(false)
        if (result.success) {
            setTasks(prev => prev.map(t =>
                t.id === rapportModal.tache!.id ? { ...t, rapport: rapportText, rapportStatut: "ENVOYE" } : t
            ))
            setRapportModal({ open: false, tache: null })
            toast.success("Rapport envoyé à l'administrateur ✓")
        } else {
            toast.error(result.error || "Erreur lors de l'envoi")
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

    const activeTasks = displayTasks.filter(t => isRapportView || t.status !== "TERMINEE")
    const doneTasks = displayTasks.filter(t => !isRapportView && t.status === "TERMINEE")

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isRapportView ? "Mes rapports" : "Mes tâches"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {isRapportView ? "Consultez et rédigez vos rapports d'intervention" : "Gérez vos tâches, priorités et rédigez vos rapports"}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 bg-slate-50 pl-10 border-slate-200"
                            />
                        </div>

                        {/* Notifications */}
                        <NotificationBell />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* À faire */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">À faire</span>
                            <Circle className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{stats.aFaire}</p>
                        <p className="text-xs text-slate-500 mt-1">tâches en attente</p>
                    </div>
                    {/* En cours */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">En cours</span>
                            <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{stats.enCours}</p>
                        <p className="text-xs text-slate-500 mt-1">tâches démarrées</p>
                    </div>
                    {/* Terminées */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">Terminées</span>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">{stats.terminees}</p>
                        <p className="text-xs text-slate-500 mt-1">tâches clôturées</p>
                    </div>
                    {/* Urgentes */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">Urgentes</span>
                            <AlertCircle className="h-4 w-4 text-red-400" />
                        </div>
                        <p className="text-2xl font-bold text-red-600">{stats.urgentes}</p>
                        <p className="text-xs text-slate-500 mt-1">priorité urgente</p>
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

                {/* Active Tasks */}
                <div className="space-y-4 mb-8">
                    {activeTasks.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-200">
                            {isRapportView ? "Aucun rapport trouvé." : "Aucune tâche active pour le moment."}
                        </div>
                    ) : (
                        activeTasks.map((tache) => {
                            const priorityConfig = getPriorityConfig(tache.priorite)
                            return (
                                <div
                                    key={tache.id}
                                    className={`bg-white rounded-lg border border-slate-200 border-l-4 ${priorityConfig.border} p-4`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Badges */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="secondary" className={`${priorityConfig.color} border-0 font-medium text-xs`}>
                                                    {tache.priorite}
                                                </Badge>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal text-xs">
                                                    {tache.type}
                                                </Badge>
                                                {tache.rapportStatut === "REDIGE" && tache.rapport && (
                                                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border border-yellow-200 font-normal text-xs">
                                                        <Pencil className="h-3 w-3 mr-1" />Brouillon
                                                    </Badge>
                                                )}
                                                {tache.rapportStatut === "ENVOYE" && (
                                                    <Badge variant="secondary" className="bg-green-50 text-green-700 border border-green-200 font-normal text-xs">
                                                        <Send className="h-3 w-3 mr-1" />Rapport envoyé
                                                    </Badge>
                                                )}
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
                                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
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
                                            {/* Rapport button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                                onClick={() => handleOpenRapport(tache)}
                                            >
                                                <FileText className="h-3 w-3 mr-1" />
                                                {tache.rapport ? "Modifier rapport" : "Rédiger rapport"}
                                            </Button>
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

                {/* Completed Tasks */}
                {doneTasks.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Tâches terminées</h2>
                        <div className="space-y-3">
                            {doneTasks.map((tache) => (
                                <div key={tache.id} className="bg-white rounded-lg border border-slate-200 border-l-4 border-l-green-400 p-4 opacity-75">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-slate-600 line-through">{tache.titre}</h3>
                                            <p className="text-xs text-slate-400">{tache.entreprise}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {tache.rapportStatut === "ENVOYE" || tache.rapportStatut === "LU" ? (
                                                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                                    <Send className="h-3 w-3 mr-1" />Rapport envoyé
                                                </Badge>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs"
                                                    onClick={() => handleOpenRapport(tache)}
                                                >
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    {tache.rapport ? "Voir rapport" : "Rédiger rapport"}
                                                </Button>
                                            )}
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Rapport Modal */}
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

                    <div className="space-y-4 py-2">
                        {/* Context info */}
                        <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600 border border-slate-200">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="font-medium">Type :</span> {rapportModal.tache?.type}
                                </div>
                                <div>
                                    <span className="font-medium">Priorité :</span> {rapportModal.tache?.priorite}
                                </div>
                                <div>
                                    <span className="font-medium">Statut :</span> {getStatusLabel(rapportModal.tache?.status || "")}
                                </div>
                                <div>
                                    <span className="font-medium">Entreprise :</span> {rapportModal.tache?.entreprise}
                                </div>
                            </div>
                            {rapportModal.tache?.description && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                    <span className="font-medium">Description :</span> {rapportModal.tache.description}
                                </div>
                            )}
                        </div>

                        {/* Rapport textarea */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Contenu du rapport
                                <span className="text-slate-400 font-normal ml-1">— décrivez les actions réalisées, observations, conclusions</span>
                            </label>
                            <Textarea
                                value={rapportText}
                                onChange={(e) => setRapportText(e.target.value)}
                                placeholder="Décrivez les actions effectuées, les constats observés sur le terrain, les recommandations éventuelles..."
                                className="min-h-[200px] resize-y border-slate-300 focus:border-indigo-400 focus:ring-indigo-400"
                                disabled={rapportModal.tache?.rapportStatut === "ENVOYE" || rapportModal.tache?.rapportStatut === "LU"}
                            />
                            <p className="text-xs text-slate-400 mt-1">{rapportText.length} caractères</p>
                        </div>

                        {/* Status indicator */}
                        {(rapportModal.tache?.rapportStatut === "ENVOYE" || rapportModal.tache?.rapportStatut === "LU") && (
                            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                                <Send className="h-4 w-4" />
                                Rapport déjà envoyé à l&apos;administrateur. Vous ne pouvez plus le modifier.
                            </div>
                        )}
                    </div>

                    {/* Footer actions */}
                    {rapportModal.tache?.rapportStatut !== "ENVOYE" && rapportModal.tache?.rapportStatut !== "LU" && (
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={handleSaveDraft}
                                disabled={isSavingRapport || !rapportText.trim()}
                                className="border-slate-300"
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Enregistrer brouillon
                            </Button>
                            <Button
                                onClick={handleEnvoyer}
                                disabled={isSavingRapport || !rapportText.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Send className="h-4 w-4 mr-2" />
                                {isSavingRapport ? "Envoi..." : "Envoyer à l'admin"}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
