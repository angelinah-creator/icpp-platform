"use client"

import { LayoutDashboard, FileText, FileSignature, Settings, Layers, PanelLeftClose, PanelLeft, Building2, Users, ClipboardCheck, FileBarChart, MonitorPlay, AlertCircle, CreditCard, Briefcase, Scale, BookOpen, Menu, X, FolderOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/server/actions/auth"
import { useState } from "react"

const navigation = [
    { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
    { name: "Entreprises", href: "/admin/entreprises", icon: Building2 },
    { name: "Auditeurs", href: "/admin/auditeurs", icon: Users },
    { name: "Paiements", href: "/admin/paiements", icon: CreditCard },
    { name: "Contrats", href: "/admin/contrats", icon: FileSignature },
    { name: "Audits", href: "/admin/audits", icon: ClipboardCheck },
    { name: "DUERP", href: "/admin/duerp", icon: FileBarChart },
    { name: "Affichages", href: "/admin/affichages", icon: MonitorPlay },
    { name: "Classeur", href: "/admin/classeur", icon: FolderOpen },
    { name: "Signalements", href: "/admin/signalements", icon: AlertCircle },
    { name: "Rapports", href: "/admin/rapports", icon: BookOpen },
    { name: "Abonnements", href: "/admin/abonnements", icon: CreditCard },
    { name: "Métiers", href: "/admin/metiers", icon: Briefcase },
    { name: "Unités de Travail", href: "/admin/unites-travail", icon: Layers },
    { name: "Réglementations", href: "/admin/reglementations", icon: Scale },
    { name: "Paramètres", href: "/admin/parametres", icon: Settings },
]


function AdminBrand({ compact = false }: { compact?: boolean }) {
    return (
        <div className={cn("flex items-center", compact ? "justify-center" : "gap-3")}>
            <Image
                src="/logo.png"
                alt="ICPP Admin"
                width={compact ? 28 : 32}
                height={compact ? 28 : 32}
                className={compact ? "h-7 w-auto object-contain" : "h-8 w-auto object-contain"}
                priority
            />
            {!compact && (
                <div className="min-w-0">
                    <p className="text-xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Admin</span></p>
                </div>
            )}
        </div>
    )
}
interface AdminSidebarProps {
    user?: {
        name: string
        email: string
        role: string
        image?: string
    }
}

function NavItem({ item, collapsed, onClick }: { item: (typeof navigation)[0]; collapsed?: boolean; onClick?: () => void }) {
    const pathname = usePathname()
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

    return (
        <Link
            href={item.href}
            onClick={onClick}
            title={collapsed ? item.name : undefined}
            className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors hover:bg-white/5 hover:text-white",
                isActive
                    ? "bg-gradient-to-r from-[#2048BF] to-[#679CFF] text-white"
                    : "text-white/70",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
            )}
        >
            {item.icon && (
                <div className="relative h-5 w-5 flex-shrink-0 flex items-center justify-center">
                    <item.icon className="h-4 w-4" />
                </div>
            )}
            {!collapsed && <span>{item.name}</span>}
        </Link>
    )
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    async function handleLogout() {
        setIsLoggingOut(true)
        try {
            await logoutAction()
        } catch (error) {
            console.error("Logout error:", error)
            setIsLoggingOut(false)
        }
    }

    const UserSection = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={cn("border-t border-white/10 p-4", isMobile || !collapsed ? "" : "")}>
            {!isMobile && collapsed ? (
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                            {user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        title="Déconnexion"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.image} alt={user?.name} />
                            <AvatarFallback className="bg-blue-600 text-white">
                                {user?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                            <p className="text-xs text-white/40 truncate">{user?.role || "Administrateur"}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full justify-start gap-2 text-red-400 hover:bg-red-950/50 hover:text-red-300"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                    </Button>
                </>
            )}
        </div>
    )

    return (
        <>
            {/* ─── Mobile overlay backdrop ─── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ─── Mobile top bar ─── */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between bg-[#030B23] px-4 py-3 border-b border-white/10">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <AdminBrand compact />
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                </Avatar>
            </header>

            {/* ─── Mobile drawer ─── */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-[#030B23] text-white flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <AdminBrand />
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto no-scrollbar">
                    {navigation.map((item) => (
                        <NavItem key={item.href} item={item} onClick={() => setMobileOpen(false)} />
                    ))}
                </nav>
                <UserSection isMobile />
            </aside>

            {/* ─── Desktop Sidebar ─── */}
            <div
                className={cn(
                    "hidden lg:flex h-screen sticky top-0 flex-col bg-[#030B23] text-white transition-all duration-300 ease-in-out flex-shrink-0",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                {/* Logo + Toggle */}
                <div className={cn("flex items-center border-b border-white/10", collapsed ? "justify-center px-2 py-4" : "justify-between px-6 py-4")}>
                    <AdminBrand compact={collapsed} />
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        title={collapsed ? "Déployer le menu" : "Réduire le menu"}
                    >
                        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto no-scrollbar">
                    {navigation.map((item) => (
                        <NavItem key={item.href} item={item} collapsed={collapsed} />
                    ))}
                </nav>

                <UserSection />
            </div>
        </>
    )
}
