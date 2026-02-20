import { ReactNode } from "react"
import { requireRole } from "@/lib/auth-helpers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayoutShell } from "@/components/client/dashboard-layout-shell"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    await requireRole(["CLIENT"])

    const session = await auth()
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" },
        include: {
            company: {
                include: {
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            }
        }
    })

    const userName = user?.company?.name || user?.name || "Client"
    const userPlan = user?.company?.subscription?.plan?.nom || "Essentiel"
    const planPrice = user?.company?.subscription?.plan?.prixMensuel || 0

    const navItems = [
        { href: "/dashboard", label: "Tableau de bord", iconName: "LayoutDashboard" },
        { href: "/dashboard/duerp", label: "Mon DUERP", iconName: "FileText" },
        { href: "/dashboard/documents", label: "Documents", iconName: "FolderOpen" },
        { href: "/dashboard/affichages", label: "Affichages", iconName: "MonitorPlay" },
        { href: "/dashboard/salaries", label: "Mes salariés", iconName: "Users" },
        { href: "/dashboard/signalements", label: "Signalements", iconName: "AlertCircle" },
        { href: "/dashboard/factures", label: "Factures", iconName: "Receipt" },
        { href: "/dashboard/parametres", label: "Paramètres", iconName: "Settings" },
    ]

    return (
        <DashboardLayoutShell
            userName={userName}
            userPlan={userPlan}
            planPrice={planPrice}
            navItems={navItems}
        >
            {children}
        </DashboardLayoutShell>
    )
}
