"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    FileText,
    Building2,
    AlertCircle,
    ClipboardCheck,
    ListTodo,
    Settings,
} from "lucide-react"

const navItems = [
    { href: "/auditeur", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/auditeur/audits", label: "Mes audits", icon: ClipboardCheck },
    { href: "/auditeur/duerp", label: "DUERP", icon: FileText },
    { href: "/auditeur/entreprises", label: "Entreprises", icon: Building2 },
    { href: "/auditeur/signalements", label: "Signalements", icon: AlertCircle },
    { href: "/auditeur/taches", label: "Taches", icon: ListTodo },
    { href: "/auditeur/parametres", label: "Paramètres", icon: Settings },
]

export function AuditeurSidebar() {
    const pathname = usePathname()

    return (
        <nav className="flex-1 px-3 pt-6 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== "/auditeur" && pathname?.startsWith(item.href))
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? "bg-[#4A7FFF] text-white"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

