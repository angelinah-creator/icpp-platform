"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, Plus, AlertCircle, Building2, FileText, ClipboardList, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AuditeurStatCard } from "@/components/auditeur/auditeur-stat-card"


interface DashboardData {
    user: {
        name: string | null | undefined
        email: string | null | undefined
    }
    stats: {
        clientsAssignes: number
        auditsEnCours: number
        duerpAValider: number
    }
    clients: Array<{
        id: string
        name: string
        metier: string
        employeeCount: number | null
        subscription: string
        duerpStatus: string
    }>
    recentActivity: Array<{
        id: string
        action: string
        entity: string
        createdAt: Date
    }>
}

interface Tache {
    id: string
    companyName: string
    task: string
    date: string
    status: string
    statusColor: string
}

interface Signalement {
    id: string
    companyName: string
    type: string
    date: string
    status: string
    statusColor: string
}

interface AuditeurDashboardClientProps {
    data: DashboardData
    taches: Tache[]
    signalements: Signalement[]
}

export function AuditeurDashboardClient({ data, taches, signalements }: AuditeurDashboardClientProps) {
    const [notificationsOpen, setNotificationsOpen] = useState(false)

    // Mock notifications for display (matching mockup 2)
    const notifications = [
        { id: 1, title: "Nouveau client inscrit", message: "Salon Marie Coiffure", time: "Il y a 2h", unread: true },
        { id: 2, title: "Paiement reçu", message: "Restaurant le Gourmet", time: "Il y a 5h", unread: true },
        { id: 3, title: "DUERP signé", message: "Boulangerie Dupont", time: "Hier", unread: false },
        { id: 4, title: "Paiement reçu", message: "Pharmacie du Centre", time: "Hier", unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    const stats = data?.stats || { clientsAssignes: 5, auditsEnCours: 1, duerpAValider: 4 }
    const userName = data?.user?.name || "John Doe"

    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord – ICPP Conformité</h1>
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

                        {/* Notifications */}
                        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5 text-slate-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end">
                                <div className="border-b p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">Notifications</h3>
                                        <button className="text-xs text-blue-600 hover:underline">
                                            Tout marquer lu
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border-b p-4 hover:bg-slate-50 cursor-pointer transition-colors ${notification.unread ? "bg-blue-50/50" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {notification.unread && (
                                                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-slate-600">{notification.message}</p>
                                                    <p className="mt-1 text-xs text-slate-400">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                {/* Stats Cards - Matching 1-3Card.png */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <AuditeurStatCard
                        title="Entreprises assignées"
                        value={stats.clientsAssignes}
                        change="+2% vs mois dernier"
                        icon={<Building2 className="h-5 w-5 text-blue-600" />}
                        highlighted
                    />
                    <AuditeurStatCard
                        title="Audits en cours"
                        value={stats.auditsEnCours}
                        change="+2% vs mois dernier"
                        icon={<ClipboardList className="h-5 w-5 text-slate-400" />}
                    />
                    <AuditeurStatCard
                        title="Audits réalisés"
                        value={1}
                        change="+2% vs mois dernier"
                        icon={<Check className="h-5 w-5 text-slate-400" />}
                    />
                    <AuditeurStatCard
                        title="DUERP en cours/validés"
                        value={stats.duerpAValider}
                        change="+2% vs mois dernier"
                        icon={<FileText className="h-5 w-5 text-slate-400" />}
                    />
                </div>

                {/* Action Buttons - Frame 22 & Frame 48 */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <Link href="/auditeur/audits/nouveau">
                        <Button className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white px-6 py-2 rounded-lg font-medium">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau audit
                        </Button>
                    </Link>
                    <Link href="/auditeur/taches">
                        <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 px-6 py-2 rounded-lg font-medium">
                            <FileText className="h-4 w-4 mr-2 text-slate-600" />
                            Mes rapports
                        </Button>
                    </Link>
                    <Link href="/auditeur/signalements">
                        <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 px-6 py-2 rounded-lg font-medium">
                            <AlertCircle className="h-4 w-4 mr-2 text-slate-600" />
                            Voir les signalements (1)
                        </Button>
                    </Link>
                </div>


                {/* Tâches prioritaires - Frame 47 */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 hover:shadow-lg transition-all duration-500">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-slate-900">Tâches prioritaires</h2>
                        <Link href="/auditeur/taches" className="text-sm text-slate-600 hover:text-slate-800">Voir tous</Link>
                    </div>
                    <div className="space-y-0 divide-y divide-slate-100">
                        {taches.length > 0 ? taches.map((tache) => (
                            <div key={tache.id} className="flex items-center justify-between py-4 first:pt-0 group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${tache.status === "URGENT" ? "bg-red-50" : "bg-orange-50"
                                        }`}>
                                        <Building2 className={`h-5 w-5 ${tache.status === "URGENT" ? "text-red-500" : "text-orange-500"
                                            }`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{tache.companyName}</p>
                                        <p className="text-xs text-slate-500">{tache.task}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400">{tache.date}</span>
                                    <Badge variant="secondary" className={`${tache.statusColor} border-0 font-medium px-3 py-1`}>
                                        {tache.status}
                                    </Badge>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 py-4">Aucune tâche prioritaire</p>
                        )}
                    </div>
                </div>

                {/* Signalements récents - Frame 49 */}
                <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-all duration-500">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-slate-900">Signalements récents des clients</h2>
                        <Link href="/auditeur/signalements" className="text-sm text-slate-600 hover:text-slate-800">Voir tous</Link>
                    </div>
                    <div className="space-y-0 divide-y divide-slate-100">
                        {signalements.length > 0 ? signalements.map((signalement) => (
                            <div key={signalement.id} className="flex items-center justify-between py-4 first:pt-0 group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{signalement.companyName}</p>
                                        <p className="text-xs text-slate-500">{signalement.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400">{signalement.date}</span>
                                    <Badge variant="secondary" className={`${signalement.statusColor} border-0 font-medium px-3 py-1`}>
                                        {signalement.status}
                                    </Badge>
                                    <Link href="/auditeur/signalements" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                        Traiter
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-500 py-4">Aucun signalement récent</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
