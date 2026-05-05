import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, AlertCircle, FileText, Download, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminHeader } from "@/components/admin/admin-header"

export const dynamic = "force-dynamic"

async function getClasseurData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
    })
    if (!["ADMIN", "AUDITOR", "COMMERCIAL"].includes(user?.role || "")) return null

    const companies = await prisma.company.findMany({
        include: {
            duerps: {
                orderBy: { version: "desc" },
                take: 1
            },
            affichages: true,
            contrats: {
                orderBy: { createdAt: "desc" },
                take: 1
            },
            subscription: true
        },
        orderBy: { name: "asc" }
    })

    return companies.map(c => {
        const activeDuerp = c.duerps[0] ?? null
        const affichagesCount = c.affichages.length
        const contrat = c.contrats?.[0] ?? null
        const isSubscribed = ["ACTIVE", "TRIALING"].includes(c.subscription?.status ?? "")

        // Score de complétude (4 points)
        let score = 0
        if (activeDuerp?.signedAt) score++
        if (affichagesCount >= 1) score++
        if (contrat) score++
        if (isSubscribed) score++

        return {
            id: c.id,
            name: c.name,
            siret: c.siret,
            duerp: activeDuerp
                ? { id: activeDuerp.id, version: activeDuerp.version, signed: !!activeDuerp.signedAt }
                : null,
            affichagesCount,
            hasContrat: !!contrat,
            contratId: contrat?.id ?? null,
            isSubscribed,
            score,
            employeeCount: c.employeeCount,
        }
    })
}

function StatusIcon({ ok, warn }: { ok: boolean; warn?: boolean }) {
    if (ok) return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
    if (warn) return <AlertCircle className="h-5 w-5 text-amber-500" />
    return <XCircle className="h-5 w-5 text-red-400" />
}

function ScoreBadge({ score }: { score: number }) {
    const color =
        score === 4 ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
        score >= 3 ? "bg-blue-100 text-blue-700 border-blue-200" :
        score >= 2 ? "bg-amber-100 text-amber-700 border-amber-200" :
        "bg-red-100 text-red-700 border-red-200"
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${color}`}>
            {score}/4
        </span>
    )
}

export default async function AdminClasseurPage() {
    const data = await getClasseurData()
    if (!data) redirect("/login")

    const total = data.length
    const complets = data.filter(c => c.score === 4).length
    const enCours = data.filter(c => c.score >= 2 && c.score < 4).length
    const insuffisants = data.filter(c => c.score < 2).length

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Classeurs de Conformité"
                subtitle={`${total} entreprise${total > 1 ? "s" : ""} — Vue synthétique des documents obligatoires`}
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{complets}</p>
                        <p className="text-sm text-slate-500">Classeurs complets</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{enCours}</p>
                        <p className="text-sm text-slate-500">En cours</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{insuffisants}</p>
                        <p className="text-sm text-slate-500">Insuffisants (&lt; 2/4)</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-5 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Entreprise</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Salariés</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">DUERP</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Affichages</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Contrat</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Abonnement</th>
                                <th className="text-center px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Complétude</th>
                                <th className="text-right px-4 py-3 font-semibold text-slate-700 uppercase text-xs tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-slate-500">
                                        Aucune entreprise enregistrée
                                    </td>
                                </tr>
                            ) : (
                                data.map((company, idx) => (
                                    <tr key={company.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                        <td className="px-5 py-3">
                                            <p className="font-semibold text-slate-900">{company.name}</p>
                                            {company.siret && (
                                                <p className="text-xs text-slate-400 mt-0.5">SIRET {company.siret}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {company.employeeCount}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <StatusIcon ok={!!company.duerp?.signed} warn={!!(company.duerp && !company.duerp.signed)} />
                                                {company.duerp ? (
                                                    <span className="text-xs text-slate-500">
                                                        v{company.duerp.version} {company.duerp.signed ? "✓ signé" : "non signé"}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-red-400">Manquant</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <StatusIcon ok={company.affichagesCount >= 1} />
                                                <span className="text-xs text-slate-500">
                                                    {company.affichagesCount > 0 ? `${company.affichagesCount} fiche${company.affichagesCount > 1 ? "s" : ""}` : "Aucun"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <StatusIcon ok={company.hasContrat} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <StatusIcon ok={company.isSubscribed} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center">
                                                <ScoreBadge score={company.score} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/entreprises/${company.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" title="Voir l'entreprise">
                                                        <ExternalLink className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </Link>
                                                {company.duerp && (
                                                    <a href={`/api/duerp/${company.duerp.id}/pdf`} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50" title="Télécharger DUERP">
                                                            <Download className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                    </a>
                                                )}
                                                <Link href={`/admin/duerp?company=${company.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100" title="Voir DUERP">
                                                        <FileText className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Légende */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Légende — Documents pris en compte</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { icon: "📄", label: "DUERP", desc: "Signé électroniquement" },
                        { icon: "📋", label: "Affichages", desc: "≥ 1 fiche générée" },
                        { icon: "📝", label: "Contrat", desc: "Contrat d'accompagnement" },
                        { icon: "✅", label: "Abonnement", desc: "Statut ACTIVE ou TRIALING" },
                    ].map(item => (
                        <div key={item.label} className="flex items-start gap-2">
                            <span className="text-base">{item.icon}</span>
                            <div>
                                <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
