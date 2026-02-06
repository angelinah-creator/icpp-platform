import { requireRole } from "@/lib/auth-helpers"
import Link from "next/link"
import { logoutAction } from "@/server/actions/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Require Client role
    const user = await requireRole(["CLIENT"])

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-bold text-blue-600">ICPP</h1>
                        <nav className="flex gap-6">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                Accueil
                            </Link>
                            <Link
                                href="/dashboard/duerp"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                Mon DUERP
                            </Link>
                            <Link
                                href="/dashboard/documents"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                Documents
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                Paramètres
                            </Link>
                        </nav>
                    </div>

                    <form action={logoutAction}>
                        <Button variant="outline" size="sm">
                            Déconnexion
                        </Button>
                    </form>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50">
                <div className="container mx-auto p-8">{children}</div>
            </main>
        </div>
    )
}
