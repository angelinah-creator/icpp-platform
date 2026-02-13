"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Image as ImageIcon,
    Users,
    AlertCircle,
    Receipt,
    Settings,
    CreditCard,
    LogOut,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"

interface ClientSidebarProps {
    userName?: string
    userPlan?: string
}

export function ClientSidebar({ userName = "Client", userPlan = "Premium" }: ClientSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const navItems = [
        { href: "/client", label: "Tableau de bord", icon: LayoutDashboard },
        { href: "/client/duerp", label: "Mon DUERP", icon: FileText },
        { href: "/client/documents", label: "Documents", icon: FolderOpen },
        { href: "/client/affichages", label: "Affichages", icon: ImageIcon },
        { href: "/client/salaries", label: "Mes salariés", icon: Users },
        { href: "/client/signalements", label: "Signalements", icon: AlertCircle },
        { href: "/client/factures", label: "Factures", icon: Receipt },
        { href: "/client/parametres", label: "Paramètres", icon: Settings },
    ]

    const isActive = (href: string) => {
        if (href === "/client") return pathname === "/client"
        return pathname?.startsWith(href)
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <div
            className={cn(
                "flex h-screen flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out flex-shrink-0",
                collapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo + Toggle */}
            <div className={cn("flex items-center border-b border-slate-700", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
                            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold">ICPP Client</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    title={collapsed ? "Déployer le menu" : "Réduire le menu"}
                >
                    {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center rounded-lg text-sm font-medium transition-colors",
                                active
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                            )}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-slate-700 p-4">
                {/* Plan Badge */}
                {!collapsed ? (
                    <div className="mb-3 rounded-lg bg-slate-800 p-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Plan {userPlan}</p>
                                <p className="text-xs text-slate-400">490€/mois</p>
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg py-2 transition-colors">
                            Voir mon abonnement
                        </button>
                    </div>
                ) : (
                    <div className="mb-3 flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600" title={`Plan ${userPlan}`}>
                            <CreditCard className="h-4 w-4" />
                        </div>
                    </div>
                )}

                {/* User Profile */}
                {collapsed ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold" title={userName}>
                            {getInitials(userName)}
                        </div>
                        <form action={logoutAction}>
                            <button type="submit" title="Déconnexion" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors">
                                <LogOut className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
                                {getInitials(userName)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{userName}</p>
                                <p className="text-xs text-slate-400">{userPlan}</p>
                            </div>
                        </div>
                        <form action={logoutAction}>
                            <button type="submit" className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                                <LogOut className="h-4 w-4" />
                                Déconnexion
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
