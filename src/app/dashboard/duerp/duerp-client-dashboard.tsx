"use client"

import Link from "next/link"
import { FileText, Eye, Download, MoreHorizontal, Info, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface DuerpItem {
    id: string
    version: number
    status: string
    signedAt: string | null
    createdAt: string
    nextReviewDate: string | null
    risqueCount: number
}

interface Props {
    companyName: string
    duerps: DuerpItem[]
}

function getStatusBadge(status: string, signedAt: string | null) {
    if (signedAt) return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Signé</Badge>
    switch (status) {
        case "ACTIVE":
            return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Actif</Badge>
        case "DRAFT":
            return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">Brouillon</Badge>
        case "IN_PROGRESS":
            return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">En cours</Badge>
        default:
            return <Badge variant="outline" className="text-xs">{status}</Badge>
    }
}

export function DuerpClientDashboard({ companyName, duerps }: Props) {
    const activeDuerp = duerps.find(d => d.status === "ACTIVE")
    const otherDuerps = duerps.filter(d => d.id !== activeDuerp?.id)

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Mes Documents Uniques</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {duerps.length} DUERP{duerps.length > 1 ? "s" : ""} — {companyName}
                    </p>
                </div>
            </div>

            <div className="p-6">
                {/* DUERP Actif */}
                {activeDuerp ? (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-semibold text-slate-900">DUERP Actif</h2>
                                        {getStatusBadge(activeDuerp.status, activeDuerp.signedAt)}
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Version v{activeDuerp.version}.0 — {activeDuerp.risqueCount} risque{activeDuerp.risqueCount > 1 ? "s" : ""} identifié{activeDuerp.risqueCount > 1 ? "s" : ""}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                        <span>Créé le {format(new Date(activeDuerp.createdAt), "dd/MM/yyyy", { locale: fr })}</span>
                                        {activeDuerp.nextReviewDate && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Prochaine révision : {format(new Date(activeDuerp.nextReviewDate), "dd/MM/yyyy", { locale: fr })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/dashboard/duerp/${activeDuerp.id}`}>
                                    <Button variant="outline" size="sm" className="text-sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Consulter
                                    </Button>
                                </Link>
                                <a
                                    href={`/api/duerp/${activeDuerp.id}/pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Télécharger PDF
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 mb-6 text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <h2 className="text-lg font-semibold text-slate-900 mb-1">Aucun DUERP actif</h2>
                        <p className="text-sm text-slate-500">
                            Votre Document Unique sera disponible ici une fois créé par votre auditeur ICPP.
                        </p>
                    </div>
                )}

                {/* Historique */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Historique des DUERP
                    </h2>

                    {duerps.length > 0 ? (
                        <div className="space-y-3">
                            {(otherDuerps.length > 0 ? otherDuerps : duerps).map((duerp) => (
                                <div
                                    key={duerp.id}
                                    className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-slate-900">
                                                    DUERP v{duerp.version}.0
                                                </h3>
                                                {getStatusBadge(duerp.status, duerp.signedAt)}
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Créé le {format(new Date(duerp.createdAt), "dd/MM/yyyy", { locale: fr })} — {duerp.risqueCount} risque{duerp.risqueCount > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreHorizontal className="h-5 w-5 text-slate-500" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/duerp/${duerp.id}`}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Consulter
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a
                                                    href={`/api/duerp/${duerp.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Télécharger PDF
                                                </a>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-sm text-slate-500 text-center py-4">
                                Aucun historique disponible
                            </p>
                        </div>
                    )}
                </div>

                {/* Rappel réglementaire */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <Info className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-2">Rappel réglementaire</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Le Document Unique d'Évaluation des Risques Professionnels (DUERP) est obligatoire pour toutes les entreprises dès le premier salarié. Il doit être mis à jour au minimum une fois par an ou lors de tout changement impactant les conditions de travail.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
