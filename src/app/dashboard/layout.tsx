import { ReactNode } from "react"
import { requireRole } from "@/lib/auth-helpers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardLayoutShell } from "@/components/client/dashboard-layout-shell"
import { redirect } from "next/navigation"

// Always fetch fresh data — subscription status must never be cached
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const status = user?.company?.subscription?.status || null
    const setupFeePaid = !!user?.company?.subscription?.setupFeePaid
    const currentPeriodEnd = user?.company?.subscription?.currentPeriodEnd

    const hasActiveSubscription =
        status === "ACTIVE" &&
        !!currentPeriodEnd &&
        new Date(currentPeriodEnd).getTime() > Date.now()

    // First-time clients must activate their first subscription before entering dashboard.
    if (!hasActiveSubscription && !setupFeePaid) {
        redirect("/abonnement")
    }
    const fullNavItems = [
        { href: "/dashboard", label: "Tableau de bord", iconName: "LayoutDashboard" },
        { href: "/dashboard/contrat", label: "Mon contrat", iconName: "FileText" },
        { href: "/dashboard/duerp", label: "Mon DUERP", iconName: "FileText" },
        { href: "/dashboard/documents", label: "Documents", iconName: "FolderOpen" },
        { href: "/dashboard/affichages", label: "Affichages", iconName: "MonitorPlay" },
        { href: "/dashboard/salaries", label: "Mes salariés", iconName: "Users" },
        { href: "/dashboard/signalements", label: "Signalements", iconName: "AlertCircle" },
        { href: "/dashboard/factures", label: "Factures", iconName: "Receipt" },
        { href: "/dashboard/parametres", label: "Paramètres", iconName: "Settings" },
    ].map(item => {
        // fonctionnalites is Prisma Json, must cast via unknown first
        const features = (user?.company?.subscription?.plan?.fonctionnalites as unknown as string[]) || []
        // Can be used to restrict nav items based on subscription plan
        return item
    })

    // Expired/suspended but already-subscribed clients can enter dashboard in read-only locked mode.
    const isSuspended = !hasActiveSubscription && setupFeePaid

    // Routes accessible in read-only mode when subscription is suspended.
    // These give the client access to their document history without any
    // write-capable features.
    const suspendedNavItems = [
        { href: "/dashboard",           label: "Tableau de bord", iconName: "LayoutDashboard" },
        { href: "/dashboard/factures",  label: "Mes factures",    iconName: "Receipt"         },
        { href: "/dashboard/documents", label: "Documents",       iconName: "FolderOpen"      },
        { href: "/dashboard/contrat",   label: "Mon contrat",     iconName: "FileText"        },
        { href: "/abonnement",          label: "Réabonnement",    iconName: "CreditCard"      },
    ]

    const navItems = isSuspended ? suspendedNavItems : fullNavItems

    return (
        <DashboardLayoutShell
            userName={userName}
            userPlan={userPlan}
            planPrice={planPrice}
            navItems={navItems}
            isSuspended={isSuspended}
        >
            {children}
        </DashboardLayoutShell>
    )
}
