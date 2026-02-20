"use client"

import { useState } from "react"
import { createSignalement, type CreateSignalementInput } from "@/server/actions/signalements"
import { Button } from "@/components/ui/button"
import { X, Lightbulb } from "lucide-react"

const TYPES_SIGNALEMENT = [
    { value: "EQUIPEMENT", label: "Nouvel équipement" },
    { value: "DEPART_SALARIE", label: "Départ d'un salarié" },
    { value: "NOUVEL_EMBAUCHE", label: "Nouvelle embauche" },
    { value: "CHANGEMENT_ACTIVITE", label: "Changement d'activité" },
    { value: "INCIDENT", label: "Incident / Accident" },
    { value: "AUTRE", label: "Autre" },
]

interface CreateSignalementModalProps {
    onClose: () => void
    onSuccess: () => void
}

export function CreateSignalementModal({ onClose, onSuccess }: CreateSignalementModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState<CreateSignalementInput>({
        type: "EQUIPEMENT",
        title: "",
        description: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!formData.title || !formData.description) {
            setError("Veuillez remplir tous les champs")
            return
        }

        setLoading(true)

        const result = await createSignalement(formData)

        if (result.success) {
            onSuccess()
            onClose()
        } else {
            setError(result.error || "Une erreur est survenue")
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Nouveau signalement</h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Type de changement <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {TYPES_SIGNALEMENT.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Titre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Installation d'un nouveau bac de lavage"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Décrivez le changement en détail..."
                            rows={4}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            required
                        />
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">
                            <Lightbulb className="inline h-4 w-4 mr-1 align-text-bottom" /><strong>Bon à savoir :</strong> Ces informations permettront à ICPP de mettre à jour votre DUERP et de maintenir votre conformité réglementaire.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? "Envoi en cours..." : "Envoyer le signalement"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
