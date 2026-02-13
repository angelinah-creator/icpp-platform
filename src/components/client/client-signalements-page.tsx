"use client"

import { useState } from "react"
import { AlertCircle, Info, Plus, Wrench, UserMinus, Package, Briefcase, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateSignalementModal } from "@/components/client/create-signalement-modal"

interface Signalement {
    id: string
    type: string
    titre: string
    description: string
    createdAt: Date
    status: string
}

interface ClientSignalementsPageProps {
    signalements: Signalement[]
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case "EQUIPEMENT":
            return Wrench
        case "DEPART_SALARIE":
            return UserMinus
        case "NOUVEL_EMBAUCHE":
            return UserPlus
        case "CHANGEMENT_ACTIVITE":
            return Briefcase
        case "INCIDENT":
            return AlertCircle
        default:
            return Package
    }
}

const getTypeLabel = (type: string) => {
    switch (type) {
        case "EQUIPEMENT":
            return "Nouvel équipement"
        case "DEPART_SALARIE":
            return "Départ salarié"
        case "NOUVEL_EMBAUCHE":
            return "Nouvelle embauche"
        case "CHANGEMENT_ACTIVITE":
            return "Changement d'activité"
        case "INCIDENT":
            return "Incident"
        default:
            return "Autre"
    }
}

export function ClientSignalementsPage({ signalements }: ClientSignalementsPageProps) {
    const [showModal, setShowModal] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1)
        // Force page reload to get fresh data
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Déclarer un changement dans mon entreprise</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Signaler tout changement susceptible d'impacter votre conformité</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau signalement
                </Button>
            </div>

            <div className="p-6">
                {/* Info Box */}
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Info className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Pourquoi signaler un changement ?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Ces informations permettent à ICPP de mettre à jour votre DUERP et de maintenir votre conformité réglementaire. Un changement non signalé peut impacter votre statut de conformité.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Historique des signalements */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Historique des signalements</h2>

                    {signalements.length > 0 ? (
                        <div className="space-y-3">
                            {signalements.map((signalement) => {
                                const Icon = getTypeIcon(signalement.type)
                                return (
                                    <div key={signalement.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-slate-900">{signalement.titre}</h3>
                                                    <span className="text-xs text-slate-400">({getTypeLabel(signalement.type)})</span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-1">{signalement.description}</p>
                                                <p className="text-xs text-slate-400">
                                                    Déclaré le {new Date(signalement.createdAt).toLocaleDateString("fr-FR")}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                signalement.status === "TRAITE"
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                    : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                            }
                                        >
                                            {signalement.status === "TRAITE" ? "Traité" : "En cours"}
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Aucun signalement</h3>
                            <p className="text-sm text-slate-500 mb-4">Vous n'avez pas encore déclaré de changement</p>
                            <Button
                                onClick={() => setShowModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau signalement
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <CreateSignalementModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}
