/**
 * Composant partagé — Tableaux de risques par catégorie + Plan d'action priorisé
 * Utilisé par les vues DUERP (client, auditeur, admin)
 * Nouveau modèle : risque_brut = F×G | pondération P | risque_résiduel = F×G×P
 */

import { Shield, Calendar, MapPin, Pen } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getScoreStyleNew, getPrioriteStyle } from "@/lib/duerp-calcul"

export interface EvaluationItem {
    id: string
    risqueNom: string
    risqueDescription: string
    categorieCode: string
    categorieNom: string
    uniteTravail: string
    frequence: number
    gravite: number
    niveauRisque: number        // risque brut = F × G
    niveauMaitrise?: string     // Aucune, Partielle, Organisationnelle, Protection collective, Maîtrise optimale
    ponderation?: number        // coefficient P
    risqueResiduel?: number | null  // F × G × P
    prioriteAction?: string | null  // Critique, Élevé, Modéré, Faible
    actionRecommandee: string | null
    actionCorrective: string | null
    delai: string | null
    responsable: string | null
    observations: string | null
}

// ─── Badge score circulaire (sur risque résiduel) ────────────────────────────
function ScoreBadge({ score, label }: { score: number; label?: string }) {
    const { bg, text } = getScoreStyleNew(score)
    return (
        <span
            title={label}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0 ${bg} ${text}`}
        >
            {score}
        </span>
    )
}

// ─── Badge priorité texte ─────────────────────────────────────────────────────
function PrioriteBadge({ priorite }: { priorite: string }) {
    const style = getPrioriteStyle(priorite)
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
            {style.label}
        </span>
    )
}

// Ordre d'affichage standard des catégories
const CATEGORIE_ORDER = [
    "PHYSIQUE", "CHIMIQUE", "BIOLOGIQUE",
    "PSYCHOSOCIAL", "RPS",
    "ORGANISATIONNEL", "INCENDIE", "ELECTRIQUE",
]

function getCategorieOrder(code: string): number {
    const idx = CATEGORIE_ORDER.indexOf(code.toUpperCase())
    return idx === -1 ? 99 : idx
}

// ─── Tableaux de risques par catégorie ────────────────────────────────────────
export function DuerpRisquesParCategorie({ evaluations }: { evaluations: EvaluationItem[] }) {
    const groupedByCategorie: Record<string, { nom: string; risques: EvaluationItem[] }> = {}
    for (const r of evaluations) {
        const key = r.categorieCode
        if (!groupedByCategorie[key]) {
            groupedByCategorie[key] = { nom: r.categorieNom, risques: [] }
        }
        groupedByCategorie[key].risques.push(r)
    }

    const sortedCategories = Object.entries(groupedByCategorie).sort(
        ([a], [b]) => getCategorieOrder(a) - getCategorieOrder(b)
    )

    if (sortedCategories.length === 0) return null

    return (
        <>
            {sortedCategories.map(([code, { nom, risques }]) => (
                <div key={code} className="bg-white rounded-xl border overflow-hidden">
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-slate-900">Risques {nom}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#1e2d40] text-white">
                                    <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider w-[180px]">Risque</th>
                                    <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Description</th>
                                    <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-10">F</th>
                                    <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-10">G</th>
                                    <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-14">Brut</th>
                                    <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wider w-[160px]">Maîtrise</th>
                                    <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-14">Résiduel</th>
                                    <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-[90px]">Priorité</th>
                                    <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Action Recommandée</th>
                                </tr>
                            </thead>
                            <tbody>
                                {risques.map((r, idx) => {
                                    const residuel = r.risqueResiduel ?? r.niveauRisque
                                    const priorite = r.prioriteAction ?? "Modéré"
                                    const maitrise = r.niveauMaitrise ?? "Aucune"
                                    return (
                                        <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                            <td className="px-5 py-3 font-semibold text-slate-900 align-top">{r.risqueNom}</td>
                                            <td className="px-5 py-3 text-slate-400 align-top">{r.risqueDescription || "—"}</td>
                                            <td className="px-3 py-3 text-center font-medium text-slate-700 align-top">{r.frequence}</td>
                                            <td className="px-3 py-3 text-center font-medium text-slate-700 align-top">{r.gravite}</td>
                                            <td className="px-3 py-3 text-center align-top">
                                                <div className="flex justify-center">
                                                    <ScoreBadge score={r.niveauRisque} label="Risque brut = F×G" />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <span className="text-xs text-slate-500">{maitrise}</span>
                                            </td>
                                            <td className="px-3 py-3 text-center align-top">
                                                <div className="flex justify-center">
                                                    <ScoreBadge score={Math.round(residuel)} label="Risque résiduel = F×G×P" />
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 text-center align-top">
                                                <PrioriteBadge priorite={priorite} />
                                            </td>
                                            <td className="px-5 py-3 text-slate-400 align-top">
                                                {r.actionRecommandee || "—"}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </>
    )
}

// ─── Plan d'action priorisé (trié par risque résiduel) ───────────────────────
export function DuerpPlanAction({ evaluations }: { evaluations: EvaluationItem[] }) {
    // Tri par risque résiduel décroissant
    const planAction = [...evaluations].sort(
        (a, b) => (b.risqueResiduel ?? b.niveauRisque) - (a.risqueResiduel ?? a.niveauRisque)
    )

    if (planAction.length === 0) return null

    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-6 py-4">
                <h2 className="text-xl font-bold text-slate-900">Plan d&apos;action priorisé</h2>
                <p className="text-xs text-slate-400 mt-1">Trié par risque résiduel décroissant (F × G × P)</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#1e2d40] text-white">
                            <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Risque</th>
                            <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-10">F</th>
                            <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-10">G</th>
                            <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-14">Brut</th>
                            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wider w-[140px]">Maîtrise</th>
                            <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-14">Résiduel</th>
                            <th className="text-center px-3 py-3 font-semibold uppercase text-xs tracking-wider w-[90px]">Priorité</th>
                            <th className="text-left px-5 py-3 font-semibold uppercase text-xs tracking-wider">Action Corrective</th>
                            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wider w-28">Délai</th>
                            <th className="text-left px-4 py-3 font-semibold uppercase text-xs tracking-wider w-32">Responsable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planAction.map((r, idx) => {
                            const residuel = r.risqueResiduel ?? r.niveauRisque
                            const priorite = r.prioriteAction ?? "Modéré"
                            const maitrise = r.niveauMaitrise ?? "Aucune"
                            return (
                                <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                                    <td className="px-5 py-3 font-semibold text-slate-900 align-top">{r.risqueNom}</td>
                                    <td className="px-3 py-3 text-center font-medium text-slate-700 align-top">{r.frequence}</td>
                                    <td className="px-3 py-3 text-center font-medium text-slate-700 align-top">{r.gravite}</td>
                                    <td className="px-3 py-3 text-center align-top">
                                        <div className="flex justify-center">
                                            <ScoreBadge score={r.niveauRisque} label="Risque brut" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <span className="text-xs text-slate-500">{maitrise}</span>
                                    </td>
                                    <td className="px-3 py-3 text-center align-top">
                                        <div className="flex justify-center">
                                            <ScoreBadge score={Math.round(residuel)} label="Risque résiduel" />
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 text-center align-top">
                                        <PrioriteBadge priorite={priorite} />
                                    </td>
                                    <td className="px-5 py-3 text-slate-400 align-top">
                                        {r.actionCorrective || r.actionRecommandee || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 align-top">{r.delai || "—"}</td>
                                    <td className="px-4 py-3 text-slate-500 align-top">{r.responsable || "—"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ─── Bloc de signatures ───────────────────────────────────────────────────────
interface SignatureBlockProps {
    signedAt: string | null
    signerName: string | null
    companyCity: string
}

export function DuerpSignatureFooter({ signedAt, signerName, companyCity }: SignatureBlockProps) {
    return (
        <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-slate-900 uppercase tracking-wide mb-5">Signatures</h2>
            <div className="grid grid-cols-2 gap-8">
                {/* Signature employeur */}
                <div>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <Pen className="h-4 w-4" />
                        <span className="text-sm font-medium">Signature employeur</span>
                    </div>
                    <div className="h-24 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center">
                        {signedAt ? (
                            <div className="text-center">
                                <Shield className="h-5 w-5 text-green-500 mx-auto mb-1" />
                                <p className="text-xs text-green-600 font-medium">Signé électroniquement</p>
                                <p className="text-xs text-slate-400">{format(new Date(signedAt), "dd/MM/yyyy", { locale: fr })}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">En attente de signature</p>
                        )}
                    </div>
                </div>

                {/* Signature auditeur ICPP */}
                <div>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <Pen className="h-4 w-4" />
                        <span className="text-sm font-medium">Signature auditeur ICPP</span>
                    </div>
                    <div className="h-24 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center">
                        {signedAt && signerName ? (
                            <div className="text-center">
                                <Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                                <p className="text-xs text-blue-600 font-medium">{signerName}</p>
                                <p className="text-xs text-slate-400">Auditeur ICPP certifié</p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 italic">En attente de signature</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Date & Lieu */}
            <div className="mt-5 flex items-center gap-10 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date : </span>
                    <span className="font-medium text-slate-700">
                        {signedAt ? format(new Date(signedAt), "dd/MM/yyyy", { locale: fr }) : "___________"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Lieu : </span>
                    <span className="font-medium text-slate-700">{companyCity || "___________"}</span>
                </div>
            </div>

            {/* Mention légale */}
            <p className="mt-5 text-xs text-slate-400 italic border-t pt-4">
                &laquo; Le DUERP doit être mis à jour annuellement ou en cas de changement majeur dans l&apos;organisation de l&apos;entreprise. &raquo;
            </p>
        </div>
    )
}
