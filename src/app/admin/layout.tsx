import { getCurrentUser, requireRole } from "@/lib/auth-helpers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Require Admin role only - automatically blocks TECHNICIEN, AUDITOR, CLIENT
    const user = await requireRole(["ADMIN"])

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar (renders desktop sidebar + mobile drawer + mobile top bar) */}
            <AdminSidebar
                user={{
                    name: user.name || "Admin",
                    email: user.email || "",
                    role: user.role === "ADMIN" ? "Administrateur" : user.role,
                    image: user.image || undefined,
                }}
            />

            {/* Main Content */}
            <main className="flex-1 min-w-0 h-screen overflow-y-auto pt-14 lg:pt-0">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
