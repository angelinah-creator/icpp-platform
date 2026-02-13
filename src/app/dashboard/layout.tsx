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
        { href: "/dashboard", label: "Tableau de bord", iconPath: "/assets/maquettes client/icon tableau de bord.png" },
        { href: "/dashboard/duerp", label: "Mon DUERP", iconPath: "/assets/maquettes client/icon mon DUERP.png" },
        { href: "/dashboard/documents", label: "Documents", iconPath: "/assets/maquettes client/icon documents.png" },
        { href: "/dashboard/affichages", label: "Affichages", iconPath: "/assets/maquettes client/icon affichage.png" },
        { href: "/dashboard/salaries", label: "Mes salariés", iconPath: "/assets/maquettes client/icon mes salariés.png" },
        { href: "/dashboard/signalements", label: "Signalements", iconPath: "/assets/maquettes client/icon signalements.png" },
        { href: "/dashboard/factures", label: "Factures", iconPath: "/assets/maquettes client/icon factures.png" },
        { href: "/dashboard/parametres", label: "Paramètres", iconPath: "/assets/maquettes client/icon tableau de bord.png" },
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
