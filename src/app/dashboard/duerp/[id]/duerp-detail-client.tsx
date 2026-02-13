"use client"

import Link from "next/link"
import { ArrowLeft, Download, FileText, Shield, Calendar, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface RisqueItem {
    id: string
    risqueNom: string
    categoryNom: string
    uniteTravail: string
    frequence: number
    gravite: number
    niveauRisque: number
    mesuresAppliquees: string
    observations: string | null
}

interface DuerpData {
    id: string
    version: number
    status: string
    signedAt: string | null
    signedByName: string | null
    createdAt: string
    nextReviewDate: string | null
    companyName: string
    companyAddress: string
    companyCity: string
    risques: RisqueItem[]
}

function getNiveauBadge(niveau: number) {
    if (niveau >= 16) return <Badge className="bg-red-100 text-red-700">Critique ({niveau})</Badge>
    if (niveau >= 9) return <Badge className="bg-orange-100 text-orange-700">Élevé ({niveau})</Badge>
    if (niveau >= 4) return <Badge className="bg-amber-100 text-amber-700">Moyen ({niveau})</Badge>
    return <Badge className="bg-green-100 text-green-700">Faible ({niveau})</Badge>
}

function getNiveauLabel(niveau: number) {
    if (niveau >= 16) return "CRITICAL"
    if (niveau >= 9) return "HIGH"
    if (niveau >= 4) return "MEDIUM"
    return "LOW"
}

export function DuerpDetailClient({ duerp }: { duerp: DuerpData }) {
    const groupedByUT: Record<string, RisqueItem[]> = {}
    for (const r of duerp.risques) {
        const key = r.uniteTravail
        if (!groupedByUT[key]) groupedByUT[key] = []
        groupedByUT[key].push(r)
    }

    const criticalCount = duerp.risques.filter(r => getNiveauLabel(r.niveauRisque) === "CRITICAL").length
    const highCount = duerp.risques.filter(r => getNiveauLabel(r.niveauRisque) === "HIGH").length
    const othersCount = duerp.risques.length - criticalCount - highCount

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/duerp">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold text-slate-900">
                                    DUERP v{duerp.version}.0
                                </h1>
                                {duerp.signedAt ? (
                                    <Badge className="bg-green-100 text-green-700">Signé</Badge>
                                ) : (
                                    <Badge className="bg-blue-100 text-blue-700">{duerp.status}</Badge>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm mt-0.5">{duerp.companyName}</p>
                        </div>
                    </div>
                    <a href={`/api/duerp/${duerp.id}/pdf`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger PDF
                        </Button>
                    </a>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Total risques</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{duerp.risques.length}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl border border-red-100 p-4">
                        <p className="text-xs text-red-600 uppercase tracking-wide">Critiques</p>
                        <p className="text-2xl font-bold text-red-700 mt-1">{criticalCount}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl border border-orange-100 p-4">
                        <p className="text-xs text-orange-600 uppercase tracking-wide">Élevés</p>
                        <p className="text-2xl font-bold text-orange-700 mt-1">{highCount}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                        <p className="text-xs text-green-600 uppercase tracking-wide">Faibles / Moyens</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">{othersCount}</p>
                    </div>
                </div>

                {/* Infos */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>Créé le {format(new Date(duerp.createdAt), "dd MMMM yyyy", { locale: fr })}</span>
                        </div>
                        {duerp.nextReviewDate && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span>Prochaine révision : {format(new Date(duerp.nextReviewDate), "dd MMMM yyyy", { locale: fr })}</span>
                            </div>
                        )}
                        {duerp.signedAt && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <Shield className="h-4 w-4 text-green-500" />
                                <span>Signé le {format(new Date(duerp.signedAt), "dd MMMM yyyy", { locale: fr })} {duerp.signedByName ? `par ${duerp.signedByName}` : ""}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{duerp.companyAddress}{duerp.companyCity ? `, ${duerp.companyCity}` : ""}</span>
                        </div>
                    </div>
                </div>

                {/* Risques par UT */}
                {Object.keys(groupedByUT).length > 0 ? (
                    Object.entries(groupedByUT).map(([ut, risques]) => (
                        <div key={ut} className="bg-white rounded-xl border">
                            <div className="px-6 py-4 border-b flex items-center gap-2">
                                <FileText className="h-4 w-4 text-slate-500" />
                                <h3 className="font-semibold text-slate-900">{ut}</h3>
                                <Badge variant="outline" className="ml-auto">
                                    {risques.length} risque{risques.length > 1 ? "s" : ""}
                                </Badge>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Risque</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead className="text-center">F</TableHead>
                                        <TableHead className="text-center">G</TableHead>
                                        <TableHead className="text-center">Niveau</TableHead>
                                        <TableHead>Mesures</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {risques.map(r => {
                                        let mesures: string[] = []
                                        try {
                                            mesures = JSON.parse(r.mesuresAppliquees || "[]")
                                        } catch {
                                            mesures = r.mesuresAppliquees ? [r.mesuresAppliquees] : []
                                        }

                                        return (
                                            <TableRow key={r.id}>
                                                <TableCell className="font-medium">{r.risqueNom}</TableCell>
                                                <TableCell className="text-slate-500 text-sm">{r.categoryNom}</TableCell>
                                                <TableCell className="text-center">{r.frequence}</TableCell>
                                                <TableCell className="text-center">{r.gravite}</TableCell>
                                                <TableCell className="text-center">{getNiveauBadge(r.niveauRisque)}</TableCell>
                                                <TableCell className="text-sm text-slate-600 max-w-xs">
                                                    {mesures.length > 0 ? mesures.join(", ") : "—"}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Aucun risque évalué dans ce DUERP</p>
                    </div>
                )}
            </div>
        </div>
    )
}
