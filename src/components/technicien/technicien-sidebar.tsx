"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    LayoutDashboard,
    ListTodo,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { logoutAction } from "@/server/actions/auth"

const navItems = [
    { href: "/technicien", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/technicien/taches", label: "Mes tâches", icon: ListTodo },
    { href: "/technicien/parametres", label: "Paramètres", icon: Settings },
]

interface TechnicienSidebarProps {
    user?: {
        name: string
        role: string
    }
}

export function TechnicienSidebar({ user }: TechnicienSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "bg-[#030B23] flex flex-col fixed h-full transition-all duration-300 ease-in-out z-30",
                collapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo + Toggle */}
            <div className={cn("flex items-center border-b border-white/10", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                {!collapsed ? (
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ICPP Technicien" width={32} height={32} className="h-8 w-auto object-contain" priority />
                        <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Technicien</span></span>
                    </div>
                ) : (
                    <Image src="/logo.png" alt="ICPP Technicien" width={28} height={28} className="h-7 w-auto object-contain" priority />
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
            <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== "/technicien" && pathname?.startsWith(item.href))
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
                                {user?.name?.charAt(0).toUpperCase() || "T"}
                            </span>
                        </div>
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                title="Déconnexion"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-white">
                                    {user?.name?.charAt(0).toUpperCase() || "T"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">
                                    {user?.name || "Technicien"}
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
                    </>
                )}
            </div>
        </aside>
    )
}
