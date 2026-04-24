"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
    Menu,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"

interface ClientSidebarProps {
    userName?: string
    userPlan?: string
}

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

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function ClientSidebar({ userName = "Client", userPlan = "Premium" }: ClientSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === "/client") return pathname === "/client"
        return pathname?.startsWith(href)
    }

    const NavLinks = ({ onClose }: { onClose?: () => void }) => (
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        title={!onClose && collapsed ? item.label : undefined}
                        className={cn(
                            "flex items-center rounded-lg text-sm font-medium transition-colors",
                            active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            !onClose && collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                        )}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {(onClose || !collapsed) && item.label}
                    </Link>
                )
            })}
        </nav>
    )

    const BottomSection = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="border-t border-slate-700 p-4">
            {/* Plan badge */}
            {(!collapsed || isMobile) ? (
                <div className="mb-3 rounded-lg bg-slate-800 p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                            <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Plan {userPlan}</p>
                            <p className="text-xs text-slate-400">Mon abonnement</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-3 flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600" title={`Plan ${userPlan}`}>
                        <CreditCard className="h-4 w-4" />
                    </div>
                </div>
            )}
            {/* User + Logout */}
            {collapsed && !isMobile ? (
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold flex-shrink-0">
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
    )

    return (
        <>
            {/* ── Mobile backdrop ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-700">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="ICPP Client" width={24} height={24} className="h-6 w-auto object-contain" priority />
                    <span className="text-base font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Client</span></span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {getInitials(userName)}
                </div>
            </header>

            {/* ── Mobile drawer ── */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ICPP Client" width={28} height={28} className="h-7 w-auto object-contain" priority />
                        <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Client</span></span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <NavLinks onClose={() => setMobileOpen(false)} />
                <BottomSection isMobile />
            </div>

            {/* ── Desktop sidebar ── */}
            <div
                className={cn(
                    "hidden lg:flex h-screen flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out flex-shrink-0",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Logo + Toggle */}
                <div className={cn("flex items-center border-b border-slate-700", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                    {!collapsed ? (
                        <div className="flex items-center gap-2">
                            <Image src="/logo.png" alt="ICPP Client" width={32} height={32} className="h-8 w-auto object-contain" priority />
                            <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Client</span></span>
                        </div>
                    ) : (
                        <Image src="/logo.png" alt="ICPP Client" width={24} height={24} className="h-6 w-auto object-contain" priority />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        title={collapsed ? "Déployer le menu" : "Réduire le menu"}
                    >
                        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>
                <NavLinks />
                <BottomSection />
            </div>
        </>
    )
}
