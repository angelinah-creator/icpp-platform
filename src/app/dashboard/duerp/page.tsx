import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { DuerpClientDashboard } from "./duerp-client-dashboard"

async function getDuerpData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            company: {
                include: {
                    duerps: {
                        orderBy: { createdAt: "desc" },
                        include: {
                            evaluations: true,
                        }
                    }
                }
            }
        }
    })

    if (!user?.company) return null

    return {
        companyName: user.company.name,
        duerps: user.company.duerps.map(d => ({
            id: d.id,
            version: d.version,
            status: d.status,
            signedAt: d.signedAt?.toISOString() || null,
            createdAt: d.createdAt.toISOString(),
            nextReviewDate: d.nextReviewDate?.toISOString() || null,
            risqueCount: d.evaluations.length,
        }))
    }
}

export default async function MonDuerpPage() {
    const data = await getDuerpData()
    if (!data) redirect("/login")

    return <DuerpClientDashboard companyName={data.companyName} duerps={data.duerps} />
}
