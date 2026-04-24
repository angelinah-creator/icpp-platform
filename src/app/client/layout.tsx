import { ReactNode } from "react"
import { requireActiveClientSubscription } from "@/lib/auth-helpers"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ClientLayout({ children }: { children: ReactNode }) {
    await requireActiveClientSubscription()

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
        <div className="flex min-h-screen">
            {/* ClientSidebar renders: desktop sidebar + mobile drawer + mobile top bar */}
            <ClientSidebar userName={userName} userPlan={userPlan} />
            <main className="flex-1 min-w-0 pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    )
}
