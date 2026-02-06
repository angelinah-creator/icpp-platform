import { getCurrentUser, requireRole } from "@/lib/auth-helpers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Require Admin role only
    const user = await requireRole(["ADMIN"])

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar
                user={{
                    name: user.name || "Admin",
                    email: user.email || "",
                    role: user.role === "ADMIN" ? "Administrateur" : user.role,
                    image: user.image || undefined,
                }}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
