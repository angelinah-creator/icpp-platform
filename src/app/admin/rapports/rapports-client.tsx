"use client"

import { useState } from "react"
import { FileText, Send, Eye, Clock, Building2, User, Filter, Search, CheckCircle } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { markRapportLu } from "@/server/actions/taches"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

export interface RapportData {
    id: string
    titre: string
    type: string
    rapport: string | null
    rapportAt: Date | null
    rapportStatut: string | null
    assigne: {
        id: string
        name: string | null
        role: string
    }
    company: { name: string } | null
    signalement: { type: string; titre: string } | null
}

interface AdminRapportsClientProps {
    initialRapports: RapportData[]
}

function getRoleBadge(role: string) {
    if (role === "AUDITOR") return <Badge className="bg-blue-100 text-blue-700 border-0">Auditeur</Badge>
    if (role === "COMMERCIAL") return <Badge className="bg-purple-100 text-purple-700 border-0">Commercial</Badge>
    if (role === "TECHNICIEN") return <Badge className="bg-orange-100 text-orange-700 border-0">Technicien</Badge>
    return <Badge className="bg-slate-100 text-slate-700 border-0">{role}</Badge>
}

function getStatutBadge(statut: string | null) {
    if (statut === "ENVOYE") return <Badge className="bg-amber-100 text-amber-700 border-0"><Send className="h-3 w-3 mr-1" />Non lu</Badge>
    if (statut === "LU") return <Badge className="bg-green-100 text-green-700 border-0"><CheckCircle className="h-3 w-3 mr-1" />Lu</Badge>
    return null
}

export function AdminRapportsClient({
    initialRapports,
}: AdminRapportsClientProps) {
    const [rapports, setRapports] = useState<RapportData[]>(initialRapports)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeRapport, setActiveRapport] = useState<RapportData | null>(null)
    const [filterUnread, setFilterUnread] = useState(false)

    const filtered = rapports.filter(r => {
        const matchSearch =
            r.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.assigne.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.company?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
        const matchUnread = !filterUnread || r.rapportStatut === "ENVOYE"
        return matchSearch && matchUnread
    })

    const unreadCount = rapports.filter(r => r.rapportStatut === "ENVOYE").length

    const handleViewRapport = async (rapport: RapportData) => {
        setActiveRapport(rapport)
        if (rapport.rapportStatut === "ENVOYE") {
            const result = await markRapportLu(rapport.id)
            if (result.success) {
                setRapports(prev => prev.map(r =>
                    r.id === rapport.id ? { ...r, rapportStatut: "LU" } : r
                ))
            }
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminHeader
                title="Rapports des intervenants"
                subtitle={`${rapports.length} rapport${rapports.length > 1 ? "s" : ""} reçu${rapports.length > 1 ? "s" : ""}`}
            />

            <div className="p-4 sm:p-6 lg:p-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg"><FileText className="h-5 w-5 text-indigo-600" /></div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{rapports.length}</p>
                                <p className="text-sm text-slate-500">Total rapports</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg"><Send className="h-5 w-5 text-amber-600" /></div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
                                <p className="text-sm text-slate-500">Non lus</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /></div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{rapports.length - unreadCount}</p>
                                <p className="text-sm text-slate-500">Lus</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="pl-10 bg-white border-slate-200"
                        />
                    </div>
                    <Button
                        variant={filterUnread ? "default" : "outline"}
                        size="sm"
                        className={filterUnread ? "bg-amber-500 hover:bg-amber-600 text-white" : "border-slate-300"}
                        onClick={() => setFilterUnread(!filterUnread)}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Non lus {unreadCount > 0 && `(${unreadCount})`}
                    </Button>
                </div>

                {/* Rapport List */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Aucun rapport reçu</p>
                        <p className="text-slate-400 text-sm mt-1">Les rapports soumis par les auditeurs et techniciens apparaîtront ici.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((rapport) => {
                            const auteurNom = rapport.assigne.name || "Intervenant"
                            const isUnread = rapport.rapportStatut === "ENVOYE"

                            return (
                                <div
                                    key={rapport.id}
                                    className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm cursor-pointer ${isUnread ? "border-indigo-200 border-l-4 border-l-indigo-500" : "border-slate-200"
                                        }`}
                                    onClick={() => handleViewRapport(rapport)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${isUnread ? "bg-indigo-50" : "bg-slate-50"}`}>
                                                <FileText className={`h-5 w-5 ${isUnread ? "text-indigo-600" : "text-slate-400"}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {isUnread && <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                                                    <h3 className={`font-semibold truncate ${isUnread ? "text-slate-900" : "text-slate-600"}`}>
                                                        {rapport.titre}
                                                    </h3>
                                                    {getStatutBadge(rapport.rapportStatut)}
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {auteurNom}
                                                    </span>
                                                    {rapport.company && (
                                                        <span className="flex items-center gap-1">
                                                            <Building2 className="h-3 w-3" />
                                                            {rapport.company.name}
                                                        </span>
                                                    )}
                                                    {rapport.rapportAt && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {format(new Date(rapport.rapportAt), "dd MMM yyyy à HH:mm", { locale: fr })}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Preview */}
                                                {rapport.rapport && (
                                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                                        {rapport.rapport}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                            {getRoleBadge(rapport.assigne.role)}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-300"
                                                onClick={(e) => { e.stopPropagation(); handleViewRapport(rapport) }}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Voir
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Dialog open={!!activeRapport} onOpenChange={(open) => !open && setActiveRapport(null)}>
                {activeRapport && (
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" />
                                {activeRapport.titre}
                            </DialogTitle>
                            <DialogDescription>
                                {activeRapport.company?.name} • {activeRapport.type}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Author info */}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm">
                            <div className="grid grid-cols-2 gap-2 text-slate-600">
                                <div>
                                    <span className="font-medium">Intervenant :</span>{" "}
                                    {activeRapport.assigne.name || "Inconnu"}
                                </div>
                                <div>
                                    <span className="font-medium">Rôle :</span>{" "}
                                    {getRoleBadge(activeRapport.assigne.role)}
                                </div>
                                <div>
                                    <span className="font-medium">Entreprise :</span>{" "}
                                    {activeRapport.company?.name || "N/A"}
                                </div>
                                {activeRapport.rapportAt && (
                                    <div>
                                        <span className="font-medium">Soumis le :</span>{" "}
                                        {format(new Date(activeRapport.rapportAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rapport content */}
                        <div className="prose prose-sm max-w-none">
                            <div className="bg-white rounded-lg border border-slate-200 p-4 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed min-h-[180px]">
                                {activeRapport.rapport || "Aucun contenu de rapport."}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button variant="outline" onClick={() => setActiveRapport(null)}>
                                Fermer
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
