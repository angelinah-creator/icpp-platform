"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    LogOut,
    PanelLeftClose,
    PanelLeft,
    CreditCard,
    LayoutDashboard,
    FileText,
    FolderOpen,
    MonitorPlay,
    Users,
    AlertCircle,
    Receipt,
    Settings,
    Menu,
    X,
    type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"
import { NotificationBell } from "@/components/notifications/notification-bell"

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    FileText,
    FolderOpen,
    MonitorPlay,
    Users,
    AlertCircle,
    Receipt,
    Settings,
    CreditCard,
}

interface NavItem {
    href: string
    label: string
    iconName: string
}

interface DashboardLayoutShellProps {
    userName: string
    userPlan: string
    planPrice: number
    navItems: NavItem[]
    children: ReactNode
    isSuspended?: boolean
}

export function DashboardLayoutShell({ userName, userPlan, planPrice, navItems, children, isSuspended }: DashboardLayoutShellProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    // Routes that suspended clients may still access in read-only mode.
    const HISTORY_ROUTES = ["/dashboard/factures", "/dashboard/documents", "/dashboard/contrat"]
    const isHistoryRoute = HISTORY_ROUTES.some(r => pathname?.startsWith(r))
    const [mobileOpen, setMobileOpen] = useState(false)

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard"
        return pathname?.startsWith(href)
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* ── Mobile backdrop ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="ICPP Client" width={28} height={28} className="h-7 w-auto object-contain" priority />
                    <span className="text-lg font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Client</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationBell />
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                        {getInitials(userName)}
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer ── */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="ICPP Client" width={28} height={28} className="h-7 w-auto object-contain" priority />
                        <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Client</span></span>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const Icon = iconMap[item.iconName] || LayoutDashboard
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive(item.href) ? "bg-gradient-to-r from-[#2048BF] to-[#679CFF] text-white" : "text-slate-700 hover:bg-slate-100"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="border-t border-slate-200 p-4">
                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white flex-shrink-0">
                            {getInitials(userName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                            <p className="text-xs text-slate-500">{userPlan}</p>
                        </div>
                    </div>
                    <form action={logoutAction}>
                        <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                            <LogOut className="h-4 w-4" />
                            Déconnexion
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Desktop Sidebar ── */}
            <div
                className={cn(
                    "hidden lg:flex h-screen sticky top-0 flex-col bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 ease-in-out",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Logo + Toggle */}
                <div className={cn("flex items-center border-b border-slate-200", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                    {!collapsed ? (
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="ICPP Client" width={32} height={32} className="h-8 w-auto object-contain" priority />
                            <span className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Client</span></span>
                        </div>
                    ) : (
                        <Image src="/logo.png" alt="ICPP Client" width={28} height={28} className="h-7 w-auto object-contain" priority />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title={collapsed ? "Déployer le menu" : "Réduire le menu"}
                    >
                        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const Icon = iconMap[item.iconName] || LayoutDashboard
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={cn(
                                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-gradient-to-r from-[#2048BF] to-[#679CFF] text-white"
                                        : "text-slate-700 hover:bg-slate-100",
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
                <div className="border-t border-slate-200 p-4">
                    {/* Plan Badge */}
                    {!collapsed ? (
                        <div
                            className={cn(
                                "mb-3 rounded-2xl p-4 border bg-cover bg-center bg-no-repeat transition-all",
                                isSuspended
                                    ? "border-red-200 bg-red-50 grayscale"
                                    : "border-blue-200"
                            )}
                            style={!isSuspended ? { backgroundImage: 'url(/assets/maquettes%20client/fond%20plan%20premium.png)' } : {}}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm",
                                    isSuspended ? "bg-red-100" : "bg-blue-100"
                                )} style={!isSuspended ? { backgroundColor: '#244DC338' } : {}}>
                                    <CreditCard className={cn("h-6 w-6", isSuspended ? "text-red-600" : "text-blue-600")} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-base font-semibold text-slate-900 truncate">{userPlan}</p>
                                    <p className="text-sm text-slate-600">{Math.round(planPrice / 100)}€/mois</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/factures"
                                className={cn(
                                    "block w-full text-center text-white font-medium rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90",
                                    isSuspended ? "bg-red-600" : ""
                                )}
                                style={!isSuspended ? { background: 'linear-gradient(135deg, #244DC3 0%, #4B8EF2 100%)' } : {}}
                            >
                                {isSuspended ? "Abonnement suspendu" : "Voir mon abonnement"}
                            </Link>
                        </div>
                    ) : (
                        <div className="mb-3 flex justify-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50" title={`Plan ${userPlan}`}>
                                <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    )}

                    {/* User Profile */}
                    {collapsed ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex justify-center w-full mb-2">
                                <NotificationBell />
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white" title={userName}>
                                {getInitials(userName)}
                            </div>
                            <form action={logoutAction}>
                                <button type="submit" title="Déconnexion" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 mb-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                    {getInitials(userName)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                                    <p className="text-xs text-slate-500">{userPlan}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <NotificationBell />
                                </div>
                            </div>
                            <form action={logoutAction}>
                                <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    Déconnexion
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="relative flex-1 min-w-0 h-screen overflow-y-auto bg-slate-50 pt-14 lg:pt-0">
                {isSuspended && (
                    <div className={cn(
                        "border-b p-4 sticky top-0 z-50",
                        isHistoryRoute
                            ? "bg-amber-50 border-amber-200"
                            : "bg-red-50 border-red-200"
                    )}>
                        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                    "p-2 rounded-full flex-shrink-0",
                                    isHistoryRoute ? "bg-amber-100" : "bg-red-100"
                                )}>
                                    <span className={cn(
                                        "font-bold text-sm",
                                        isHistoryRoute ? "text-amber-600" : "text-red-600"
                                    )}>!</span>
                                </div>
                                <div className="min-w-0">
                                    {isHistoryRoute ? (
                                        <>
                                            <h3 className="text-amber-800 font-semibold text-sm">Mode Lecture Seule</h3>
                                            <p className="text-amber-700 text-xs">Vous consultez vos documents archivés. Régularisez votre abonnement pour accéder à toutes les fonctionnalités.</p>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-red-800 font-semibold text-sm">Votre abonnement est suspendu</h3>
                                            <p className="text-red-600 text-xs">Veuillez régulariser votre situation pour retrouver un accès complet.</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Link
                                href="/abonnement"
                                className={cn(
                                    "flex-shrink-0 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md shadow-sm text-white transition-colors",
                                    isHistoryRoute
                                        ? "bg-amber-600 hover:bg-amber-700"
                                        : "bg-red-600 hover:bg-red-700"
                                )}
                            >
                                Se réabonner
                            </Link>
                        </div>
                    </div>
                )}
                <div className={cn(
                    "min-h-full",
                    // Lock interactions only on non-history pages when suspended
                    isSuspended && !isHistoryRoute
                        ? "pointer-events-none opacity-50 contrast-50 grayscale select-none"
                        : ""
                )}>
                    {children}
                </div>
            </main>
        </div>
    )
}
