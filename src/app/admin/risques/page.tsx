import Link from "next/link"
import { ArrowRight, Shield, AlertTriangle } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRisqueCategories, getRisquesMetier } from "@/server/actions/admin"

export default async function RisquesPage() {
    const [categories, risques] = await Promise.all([
        getRisqueCategories(),
        getRisquesMetier()
    ])

    const risquesActifs = risques.filter(r => r.isActive).length

    return (
        <div className="space-y-6">
            <AdminHeader
                title="Gestion des Risques"
                subtitle="Référentiel des risques professionnels par métier"
            />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/risques/categories">
                    <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Catégories de Risques</CardTitle>
                                    <CardDescription>Gérer les types de risques</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-slate-900">{categories.length}</div>
                                <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform">
                                    <span className="text-sm font-medium">Gérer</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                Physique, Chimique, Biologique, etc.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/risques/metiers">
                    <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Risques par Métier</CardTitle>
                                    <CardDescription>Base de connaissances risques</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-slate-900">{risques.length}</div>
                                <div className="flex items-center gap-2 text-orange-600 group-hover:translate-x-1 transition-transform">
                                    <span className="text-sm font-medium">Gérer</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                {risquesActifs} actif{risquesActifs > 1 ? "s" : ""} / {risques.length - risquesActifs} inactif{risques.length - risquesActifs > 1 ? "s" : ""}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Intégration Mini-Audit</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Les risques actifs sont automatiquement chargés dans le mini-audit selon le métier de l'entreprise.
                                Seuls les risques marqués comme "actifs" apparaîtront dans l'évaluation.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
