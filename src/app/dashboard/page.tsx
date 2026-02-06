import { getClientDashboardData } from "@/server/actions/client"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function ClientDashboard() {
    const data = await getClientDashboardData()

    if (!data) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Chargement...</p>
            </div>
        )
    }

    function getConformiteBadge(status: string) {
        switch (status) {
            case "conforme":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Conforme</Badge>
            case "a_mettre_a_jour":
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">À mettre à jour</Badge>
            default:
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Non conforme</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de Bord</h1>
                <p className="text-gray-600">
                    Bienvenue, {data.user.name || "Client"}
                </p>
            </div>

            {/* Company Info */}
            <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">{data.company.name}</h2>
                        <p className="text-gray-600">{data.company.metier} • {data.company.employeeCount} salarié(s)</p>
                    </div>
                    {getConformiteBadge(data.stats.conformite)}
                </div>
            </div>

            {/* Subscription Status */}
            {data.subscription && (
                <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900">Abonnement {data.subscription.plan}</h3>
                            <p className="text-sm text-blue-700">
                                Statut: {data.subscription.status === "ACTIVE" ? "Actif" : data.subscription.status}
                            </p>
                        </div>
                        <Badge className="bg-blue-600 hover:bg-blue-600">{data.subscription.plan}</Badge>
                    </div>
                </div>
            )}

            {/* DUERP Status */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="font-semibold">DUERP</h3>
                    {data.duerp ? (
                        <>
                            <p className="mt-2 text-sm text-gray-600">
                                Statut: {data.duerp.status}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Dernière mise à jour: {new Date(data.duerp.updatedAt).toLocaleDateString("fr-FR")}
                            </p>
                            <Link
                                href={`/dashboard/duerp/${data.duerp.id}`}
                                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                            >
                                Voir mon DUERP →
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-gray-600">
                                Aucun document généré
                            </p>
                            <Link
                                href="/dashboard/duerp/new"
                                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                            >
                                Créer mon DUERP →
                            </Link>
                        </>
                    )}
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="font-semibold">Affichages Obligatoires</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        {data.stats.documentsCount} document(s) disponible(s)
                    </p>
                    <Link
                        href="/dashboard/affichages"
                        className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                        Voir les affichages →
                    </Link>
                </div>
            </div>

            {/* Notifications */}
            {data.stats.notificationsCount > 0 && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm text-orange-800">
                        Vous avez {data.stats.notificationsCount} notification(s) non lue(s)
                    </p>
                </div>
            )}
        </div>
    )
}
