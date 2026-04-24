"use client"

import { ReactNode, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    LayoutDashboard,
    ListTodo,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    FileBarChart,
    ChevronRight,
    Search,
    PanelLeftClose,
    PanelLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"

const navItems = [
    { href: "/technicien", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/technicien/taches", label: "Mes tâches", icon: ListTodo },
    { href: "/technicien/taches?view=rapports", label: "Mes rapports", icon: FileBarChart },
    { href: "/technicien/parametres", label: "Paramètres", icon: Settings },
]

interface TechnicienLayoutShellProps {
    user: { name: string }
    children: ReactNode
}

function UserBottom({ user, collapsed, isMobile = false }: { user: { name: string }; collapsed?: boolean; isMobile?: boolean }) {
    const showCollapsed = !isMobile && collapsed
    return (
        <div className="border-t border-white/10 p-3">
            {showCollapsed ? (
                <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                            {user.name?.charAt(0).toUpperCase() || "T"}
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
                                {user.name?.charAt(0).toUpperCase() || "T"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{user.name || "Technicien"}</p>
                            <p className="text-xs text-white/40">Technicien</p>
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
    )
}

export function TechnicienLayoutShell({ user, children }: TechnicienLayoutShellProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const view = searchParams.get("view")

    const NavLinks = ({ onClose }: { onClose?: () => void }) => (
        <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
                const Icon = item.icon
                const [itemPath, itemQuery] = item.href.split("?")
                const itemParams = new URLSearchParams(itemQuery)
                const itemView = itemParams.get("view")

                const isActive = pathname === itemPath && view === itemView
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        title={!onClose && collapsed ? item.label : undefined}
                        className={cn(
                            "flex items-center rounded-lg text-sm font-medium transition-colors",
                            isActive ? "bg-gradient-to-r from-[#2048BF] to-[#679CFF] text-white" : "text-white/70 hover:text-white hover:bg-white/5",
                            !onClose && collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                        )}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {(onClose || !collapsed) && <span>{item.label}</span>}
                    </Link>
                )
            })}
        </nav>
    )

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* ── Mobile backdrop ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-[#030B23] px-4 py-3 border-b border-white/10">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="ICPP Technicien" width={28} height={28} className="h-7 w-auto object-contain" priority />
                    <span className="text-lg font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Tech</span></span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{user.name?.charAt(0).toUpperCase() || "T"}</span>
                </div>
            </header>

            {/* ── Mobile drawer ── */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-[#030B23] flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ICPP Technicien" width={28} height={28} className="h-7 w-auto object-contain" priority />
                        <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Technicien</span></span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <NavLinks onClose={() => setMobileOpen(false)} />
                <UserBottom user={user} isMobile />
            </aside>

            {/* ── Desktop sidebar ── */}
            <aside
                className={cn(
                    "hidden lg:flex bg-[#030B23] flex-col fixed h-full transition-all duration-300 ease-in-out z-30",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
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
                <NavLinks />
                <UserBottom user={user} collapsed={collapsed} />
            </aside>

            {/* ── Main Content ── */}
            <main className={cn(
                "flex-1 h-screen overflow-y-auto transition-all duration-300 ease-in-out pt-14 lg:pt-0",
                collapsed ? "lg:ml-[72px]" : "lg:ml-64"
            )}>
                {children}
            </main>
        </div>
    )
}
