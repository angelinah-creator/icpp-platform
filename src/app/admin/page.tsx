import { getCurrentUser } from "@/lib/auth-helpers"

export default async function AdminDashboard() {
    const user = await getCurrentUser()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
                <p className="text-gray-600">
                    Bienvenue, {user?.name || "Administrateur"}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm font-medium text-gray-600">Total TPE</div>
                    <div className="mt-2 text-3xl font-bold">0</div>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm font-medium text-gray-600">DUERP Actifs</div>
                    <div className="mt-2 text-3xl font-bold">0</div>
                </div>
                <div className="rounded-lg border bg-white p-6">
                    <div className="text-sm font-medium text-gray-600">
                        Audits en cours
                    </div>
                    <div className="mt-2 text-3xl font-bold">0</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-white p-6">
                <h2 className="text-xl font-semibold">Activité récente</h2>
                <p className="mt-4 text-center text-gray-500">
                    Aucune activité récente
                </p>
            </div>
        </div>
    )
}
