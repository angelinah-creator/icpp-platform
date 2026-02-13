"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    LayoutDashboard,
    FileText,
    Building2,
    AlertCircle,
    ClipboardCheck,
    ListTodo,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"

const navItems = [
    { href: "/auditeur", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/auditeur/audits", label: "Mes audits", icon: ClipboardCheck },
    { href: "/auditeur/duerp", label: "DUERP", icon: FileText },
    { href: "/auditeur/entreprises", label: "Entreprises", icon: Building2 },
    { href: "/auditeur/signalements", label: "Signalements", icon: AlertCircle },
    { href: "/auditeur/taches", label: "Tâches", icon: ListTodo },
    { href: "/auditeur/parametres", label: "Paramètres", icon: Settings },
]

interface AuditeurLayoutShellProps {
    user: { name: string }
    children: ReactNode
}

export function AuditeurLayoutShell({ user, children }: AuditeurLayoutShellProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-[#030B23] flex flex-col fixed h-full transition-all duration-300 ease-in-out z-30",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Logo + Toggle */}
                <div className={cn("flex items-center border-b border-white/10", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                    {!collapsed && (
                        <Image
                            src="/assets/maquettes auditeur png/1-2Logo auditeur.png"
                            alt="ICPP Auditeur"
                            width={150}
                            height={40}
                            className="object-contain"
                            priority
                        />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        title={collapsed ? "Déployer le menu" : "Réduire le menu"}
                    >
                        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || (item.href !== "/auditeur" && pathname?.startsWith(item.href))
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={cn(
                                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-[#4A7FFF] text-white"
                                        : "text-white/70 hover:text-white hover:bg-white/5",
                                    collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="border-t border-white/10 p-3">
                    {collapsed ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                    {user.name?.charAt(0).toUpperCase() || "A"}
                                </span>
                            </div>
                            <form action={logoutAction}>
                                <button type="submit" title="Déconnexion" className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-3 px-2">
                                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-medium text-white">
                                        {user.name?.charAt(0).toUpperCase() || "A"}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">{user.name || "Auditeur"}</p>
                                </div>
                            </div>
                            <form action={logoutAction}>
                                <button type="submit" className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    Déconnexion
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn("flex-1 transition-all duration-300 ease-in-out", collapsed ? "ml-[72px]" : "ml-64")}>
                {children}
            </main>
        </div>
    )
}
