"use client"

import { LayoutDashboard, FileText, Settings, Layers } from "lucide-react"
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
    { name: "Entreprises", href: "/admin/entreprises", image: "/assets/images/entreprises icon.png" },
    { name: "Auditeurs", href: "/admin/auditeurs", image: "/assets/images/auditeurs icon.png" },
    { name: "Audits", href: "/admin/audits", image: "/assets/images/audits icon.png" },
    { name: "DUERP", href: "/admin/duerp", image: "/assets/images/duerp icon.png" },
    { name: "Signalements", href: "/admin/signalements", image: "/assets/images/signalements icon.png" },
    { name: "Abonnements", href: "/admin/abonnements", image: "/assets/images/abonnements icon.png" },
    { name: "Métiers", href: "/admin/metiers", image: "/assets/images/métiers icon.png" },
    { name: "Unités de Travail", href: "/admin/unites-travail", icon: Layers },
    { name: "Réglementations", href: "/admin/reglementations", image: "/assets/images/réglementations icon.png" },
    { name: "Paramètres", href: "/admin/parametres", image: "/assets/images/paramètres icon.png" },
]

interface AdminSidebarProps {
    user?: {
        name: string
        email: string
        role: string
        image?: string
    }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function handleLogout() {
        setIsLoggingOut(true)
        try {
            await logoutAction()
        } catch (error) {
            console.error("Logout error:", error)
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-950 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 py-4">
                <Image
                    src="/assets/images/logo icpp admin.png"
                    alt="ICPP Admin"
                    width={150}
                    height={32}
                    className="h-8 w-auto object-contain"
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                                isActive
                                    ? "bg-gradient-to-r from-[#2048BF] to-[#679CFF] text-white"
                                    : "text-slate-300"
                            )}
                        >
                            {/* Render either Custom Image or Lucide Icon */}
                            {item.image ? (
                                <div className="relative h-6 w-6 flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className={cn(
                                            "object-contain",
                                            isActive ? "brightness-200" : "opacity-70 group-hover:opacity-100",
                                            // Apply padding specifically to "Abonnements" to reduce its visual weight relative to others
                                            item.name === "Abonnements" ? "p-1" : "p-0"
                                        )}
                                    />
                                </div>
                            ) : (
                                Icon && <Icon className="h-6 w-6 flex-shrink-0" />
                            )}
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                            {user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.role || "Administrateur"}</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full justify-start gap-2 text-red-400 hover:bg-red-950/50 hover:text-red-300"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
                </Button>
            </div>
        </div>
    )
}
