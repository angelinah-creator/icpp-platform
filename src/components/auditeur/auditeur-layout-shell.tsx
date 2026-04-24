"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    LayoutDashboard,
    FileText,
    FileSignature,
    Building2,
    AlertCircle,
    ClipboardCheck,
    ListTodo,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    Menu,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"

const navItems = [
    { href: "/auditeur", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/auditeur/audits", label: "Mes audits", icon: ClipboardCheck },
    { href: "/auditeur/contrats", label: "Contrats", icon: FileSignature },
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

function NavLink({ item, collapsed, onClick }: { item: typeof navItems[0]; collapsed?: boolean; onClick?: () => void }) {
    const pathname = usePathname()
    const Icon = item.icon
    const isActive = pathname === item.href || (item.href !== "/auditeur" && pathname?.startsWith(item.href))

    return (
        <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                isActive
                    ? "bg-gradient-to-r from-[#2048BF] to-[#679CFF] text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
        </Link>
    )
}

export function AuditeurLayoutShell({ user, children }: AuditeurLayoutShellProps) {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">

            {/* ─── Mobile overlay backdrop ─── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Mobile Drawer ─── */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-[#030B23] flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ICPP Auditeur" width={28} height={28} className="h-7 w-auto object-contain" priority />
                        <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Auditeur</span></span>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 px-3 pt-5 space-y-1 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => (
                        <NavLink key={item.href} item={item} onClick={() => setMobileOpen(false)} />
                    ))}
                </nav>

                {/* Mobile User */}
                <div className="border-t border-white/10 p-3">
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
                </div>
            </aside>

            {/* ─── Desktop Sidebar ─── */}
            <aside
                className={cn(
                    "hidden lg:flex bg-[#030B23] flex-col fixed h-full transition-all duration-300 ease-in-out z-30",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Logo + Toggle */}
                <div className={cn("flex items-center border-b border-white/10", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                    {!collapsed ? (
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="ICPP Auditeur" width={32} height={32} className="h-8 w-auto object-contain" priority />
                            <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Auditeur</span></span>
                        </div>
                    ) : (
                        <Image src="/logo.png" alt="ICPP Auditeur" width={28} height={28} className="h-7 w-auto object-contain" priority />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        title={collapsed ? "Déployer le menu" : "Réduire le menu"}
                    >
                        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => (
                        <NavLink key={item.href} item={item} collapsed={collapsed} />
                    ))}
                </nav>

                {/* Desktop User Profile & Logout */}
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

            {/* ─── Main Content ─── */}
            <div className={cn(
                "flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out",
                "lg:" + (collapsed ? "ml-[72px]" : "ml-64")
            )}>
                {/* Mobile Top Bar */}
                <header className="lg:hidden flex items-center justify-between bg-[#030B23] px-4 py-3 sticky top-0 z-30">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ICPP Auditeur" width={28} height={28} className="h-7 w-auto object-contain" priority />
                        <span className="text-lg font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Auditeur</span></span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                            {user.name?.charAt(0).toUpperCase() || "A"}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
