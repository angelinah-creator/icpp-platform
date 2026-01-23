import { getCurrentUser, requireRole } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logoutAction } from "@/server/actions/auth"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Require Admin, Auditor or Commercial role
    const user = await requireRole(["ADMIN", "AUDITOR", "COMMERCIAL"])

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-gray-50">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="border-b p-6">
                        <h1 className="text-xl font-bold text-blue-600">ICPP Admin</h1>
                        <p className="text-sm text-gray-600">{user.role}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">
                        <Link
                            href="/admin"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/companies"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Gestion TPE
                        </Link>
                        {user.role === "ADMIN" && (
                            <Link
                                href="/admin/auditors"
                                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Gestion Auditeurs
                            </Link>
                        )}
                        <Link
                            href="/admin/duerp"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            DUERP
                        </Link>
                    </nav>

                    {/* Logout */}
                    <div className="border-t p-4">
                        <form action={logoutAction}>
                            <Button variant="outline" className="w-full">
                                Déconnexion
                            </Button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-8">{children}</div>
            </main>
        </div>
    )
}
