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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/server/actions/auth"

interface NavItem {
    href: string
    label: string
    iconPath: string
}

interface DashboardLayoutShellProps {
    userName: string
    userPlan: string
    planPrice: number
    navItems: NavItem[]
    children: ReactNode
}

export function DashboardLayoutShell({ userName, userPlan, planPrice, navItems, children }: DashboardLayoutShellProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard"
        return pathname?.startsWith(href)
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={cn(
                    "flex h-screen flex-col bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-300 ease-in-out",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Logo + Toggle */}
                <div className={cn("flex items-center border-b border-slate-200", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                    {!collapsed && (
                        <Image
                            src="/assets/maquettes client/logo_icpp_client.png"
                            alt="ICPP Client"
                            width={120}
                            height={32}
                            className="h-8 w-auto"
                        />
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
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center rounded-lg text-sm font-medium transition-colors",
                                isActive(item.href)
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-700 hover:bg-slate-100",
                                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
                            )}
                        >
                            <Image
                                src={item.iconPath}
                                alt={item.label}
                                width={20}
                                height={20}
                                className="h-5 w-5 flex-shrink-0"
                            />
                            {!collapsed && item.label}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-slate-200 p-4">
                    {/* Plan Badge */}
                    {!collapsed ? (
                        <div
                            className="mb-3 rounded-2xl p-4 border border-blue-200 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: 'url(/assets/maquettes%20client/fond%20plan%20premium.png)' }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: '#244DC338' }}>
                                    <Image
                                        src="/assets/maquettes client/icon plan premium.png"
                                        alt="Plan Premium"
                                        width={24}
                                        height={24}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-slate-900">Plan premium</p>
                                    <p className="text-sm text-slate-600">{Math.round(planPrice / 100)}€/mois</p>
                                </div>
                            </div>
                            <button
                                className="w-full text-white font-medium rounded-xl py-2.5 text-sm transition-opacity hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #244DC3 0%, #4B8EF2 100%)' }}
                            >
                                Voir mon abonnement
                            </button>
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
            <main className="flex-1 overflow-y-auto bg-slate-50">
                {children}
            </main>
        </div>
    )
}
