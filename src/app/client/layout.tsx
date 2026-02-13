import { ReactNode } from "react"
import { requireRole } from "@/lib/auth-helpers"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ClientLayout({ children }: { children: ReactNode }) {
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

    return (
        <div className="flex h-screen overflow-hidden">
            <ClientSidebar userName={userName} userPlan={userPlan} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
