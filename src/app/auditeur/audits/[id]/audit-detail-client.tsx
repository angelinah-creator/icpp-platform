"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building2, Calendar, User, FileText, AlertTriangle, Download, Mail, Phone, MapPin, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AuditDetailProps {
    audit: {
        id: string
        status: string
        score: number | null
        commentaire: string | null
        createdAt: Date
        updatedAt: Date
        company: {
            id: string
            name: string
            email: string | null
            phone: string | null
            address: string | null
            city: string | null
            postalCode: string | null
            employeeCount: number
            metier: string | null
        }
        auditor: {
            name: string | null
            email: string | null
        } | null
        documents: Array<{
            type: string
            present: boolean
            conforme: boolean
        }>
        risques: Array<{
            categorie: string
            nom: string
            gravite: number | null
            frequence: number | null
            priorite: number | null
        }>
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case "PLANIFIÉ":
            return <Badge className="bg-blue-100 text-blue-700">Planifié</Badge>
        case "EN_COURS":
            return <Badge className="bg-orange-100 text-orange-700">En cours</Badge>
        case "TERMINÉ":
            return <Badge className="bg-green-100 text-green-700">Terminé</Badge>
        default:
            return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>
    }
}

function formatDocumentType(type: string): string {
    const labels: Record<string, string> = {
        "DUERP": "DUERP existant et accessible",
        "AFFICHAGES": "Affichages obligatoires présents",
        "EXTINCTEURS": "Extincteurs présents et vérifiés",
        "REGISTRE": "Registre de sécurité à jour",
        "PERSONNEL": "Registre unique du personnel",
        "FORMATIONS": "Formations sécurité réalisées"
    }
    return labels[type] || type
}

function getPriorityColor(priorite: number | null): string {
    if (!priorite) return "bg-slate-100 text-slate-700"
    if (priorite >= 15) return "bg-red-100 text-red-700"
    if (priorite >= 9) return "bg-orange-100 text-orange-700"
    return "bg-yellow-100 text-yellow-700"
}

function getPriorityLabel(priorite: number | null): string {
    if (!priorite) return "Non évalué"
    if (priorite >= 15) return "Critique"
    if (priorite >= 9) return "Élevé"
    return "Modéré"
}

export function AuditDetailClient({ audit }: AuditDetailProps) {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    const formattedDate = new Date(audit.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    const documentsConformes = audit.documents.filter(d => d.conforme).length
    const totalDocuments = audit.documents.length
    const documentScore = totalDocuments > 0 ? Math.round((documentsConformes / totalDocuments) * 100) : 0

    async function handleExportPDF() {
        setIsGeneratingPDF(true)
        try {
            const response = await fetch(`/api/audits/${audit.id}/pdf`)
            if (!response.ok) throw new Error("Erreur lors de la génération du PDF")

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `audit-${audit.company.name.replace(/\s+/g, "-")}-${new Date(audit.createdAt).toISOString().split("T")[0]}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error("Error exporting PDF:", error)
            alert("Erreur lors de l'export PDF")
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/auditeur/audits">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Audit - {audit.company.name}
                            </h1>
                            <p className="text-sm text-slate-500">Réalisé le {formattedDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(audit.status)}
                        <Button
                            className="bg-[#4A7FFF] hover:bg-[#3968E6]"
                            onClick={handleExportPDF}
                            disabled={isGeneratingPDF}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {isGeneratingPDF ? "Génération..." : "Exporter PDF"}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="col-span-2 space-y-6">
                        {/* Score Global */}
                        {audit.score !== null && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Score de conformité</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Progress value={audit.score} className="h-3" />
                                        </div>
                                        <div className="text-3xl font-bold text-slate-900">
                                            {audit.score}%
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">
                                        {audit.score >= 80 ? "Excellent niveau de conformité" :
                                            audit.score >= 60 ? "Conformité satisfaisante avec quelques améliorations nécessaires" :
                                                "Plusieurs non-conformités identifiées"}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Vérification documentaire
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {audit.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                                            <span className="text-sm text-slate-700">
                                                {formatDocumentType(doc.type)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {doc.conforme ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                )}
                                                <span className={`text-xs font-medium ${doc.conforme ? "text-green-700" : "text-red-700"
                                                    }`}>
                                                    {doc.conforme ? "Conforme" : "Non conforme"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-slate-700">
                                        <span className="font-semibold">{documentsConformes}/{totalDocuments}</span> documents conformes
                                        <span className="text-slate-500 ml-2">({documentScore}%)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Risques */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    Risques identifiés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {audit.risques.length > 0 ? (
                                    <div className="space-y-3">
                                        {audit.risques.map((risque, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">
                                                            {risque.categorie}
                                                        </div>
                                                        <div className="font-medium text-slate-900">
                                                            {risque.nom}
                                                        </div>
                                                    </div>
                                                    <Badge className={getPriorityColor(risque.priorite)}>
                                                        {getPriorityLabel(risque.priorite)}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-4 mt-3">
                                                    <div className="flex-1">
                                                        <div className="text-xs text-slate-500 mb-1">Gravité</div>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(n => (
                                                                <div
                                                                    key={n}
                                                                    className={`h-2 w-full rounded ${n <= (risque.gravite || 0) ? "bg-red-500" : "bg-slate-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-slate-500 mb-1">Fréquence</div>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(n => (
                                                                <div
                                                                    key={n}
                                                                    className={`h-2 w-full rounded ${n <= (risque.frequence || 0) ? "bg-orange-500" : "bg-slate-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-8">
                                        Aucun risque identifié lors de cet audit
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Commentaire */}
                        {audit.commentaire && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Observations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                        {audit.commentaire}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Entreprise Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    Entreprise
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Nom</div>
                                    <div className="font-medium text-slate-900">{audit.company.name}</div>
                                </div>
                                {audit.company.metier && (
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Métier</div>
                                        <Badge className="bg-purple-100 text-purple-700">{audit.company.metier}</Badge>
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Effectif</div>
                                    <div className="text-sm text-slate-700">
                                        {audit.company.employeeCount} salarié{audit.company.employeeCount > 1 ? "s" : ""}
                                    </div>
                                </div>
                                {audit.company.email && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="h-4 w-4" />
                                        <a href={`mailto:${audit.company.email}`} className="hover:text-blue-600">
                                            {audit.company.email}
                                        </a>
                                    </div>
                                )}
                                {audit.company.phone && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4" />
                                        <a href={`tel:${audit.company.phone}`} className="hover:text-blue-600">
                                            {audit.company.phone}
                                        </a>
                                    </div>
                                )}
                                {audit.company.address && (
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <MapPin className="h-4 w-4 mt-0.5" />
                                        <div>
                                            {audit.company.address}<br />
                                            {audit.company.postalCode} {audit.company.city}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Auditeur Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Auditeur
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Nom</div>
                                    <div className="font-medium text-slate-900">{audit.auditor?.name || "Non assigné"}</div>
                                </div>
                                {audit.auditor?.email && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="h-4 w-4" />
                                        <a href={`mailto:${audit.auditor.email}`} className="hover:text-blue-600">
                                            {audit.auditor.email}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    Informations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Date de création</div>
                                    <div className="text-sm text-slate-700">
                                        {new Date(audit.createdAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Dernière modification</div>
                                    <div className="text-sm text-slate-700">
                                        {new Date(audit.updatedAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
