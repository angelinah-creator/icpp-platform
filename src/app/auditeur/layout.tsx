import { requireRole } from "@/lib/auth-helpers"
import Image from "next/image"
import { logoutAction } from "@/server/actions/auth"
import { LogOut } from "lucide-react"
import { AuditeurSidebar } from "@/components/auditeur/auditeur-sidebar"

export default async function AuditeurLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Require Auditor or Commercial role
    const user = await requireRole(["AUDITOR", "COMMERCIAL"])


    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar - Dark Blue Navy */}
            <aside className="w-[200px] bg-[#030B23] flex flex-col fixed h-full">
                {/* Logo */}
                <div className="p-4 pt-6">
                    <Image
                        src="/assets/maquettes auditeur png/1-2Logo auditeur.png"
                        alt="ICPP Auditeur"
                        width={150}
                        height={40}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Navigation */}
                <AuditeurSidebar />


                {/* User Profile & Logout */}
                <div className="border-t border-white/10 p-3">
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-white">
                                {user.name?.charAt(0).toUpperCase() || "J"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                                {user.name || "John Doe"}
                            </p>
                        </div>
                    </div>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[200px]">
                {children}
            </main>
        </div>
    )
}
