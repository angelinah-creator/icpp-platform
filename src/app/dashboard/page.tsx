import { getCurrentUser } from "@/lib/auth-helpers"
import { Badge } from "@/components/ui/badge"

export default async function ClientDashboard() {
    const user = await getCurrentUser()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Tableau de Bord</h1>
                <p className="text-gray-600">
                    Bienvenue, {user?.name || "Client"}
                </p>
            </div>

            {/* Compliance Status Card */}
            <div className="rounded-lg border bg-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Statut de Conformité</h2>
                        <p className="text-gray-600">Votre entreprise</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                        En attente
                    </Badge>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-whit p-6">
                    <h3 className="font-semibold">DUERP</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Aucun document généré
                    </p>
                    <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
                        Créer mon DUERP →
                    </button>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <h3 className="font-semibold">Affichages Obligatoires</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        0 affichages téléchargés
                    </p>
                    <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
                        Voir les affichages →
                    </button>
                </div>
            </div>
        </div>
    )
}
