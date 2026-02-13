import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AffichagesClientDashboard } from "./affichages-dashboard-client"

async function getAffichagesData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            company: {
                include: {
                    affichages: {
                        orderBy: { createdAt: "asc" }
                    }
                }
            }
        }
    })

    if (!user?.company) return null

    return {
        companyName: user.company.name,
        affichages: user.company.affichages.map(a => ({
            id: a.id,
            category: a.category,
            type: a.type,
            title: a.title,
            description: a.description || "",
            downloaded: a.downloaded,
            isLocked: a.isLocked,
            generatedAt: a.generatedAt?.toISOString() || null,
        }))
    }
}

export default async function AffichagesPage() {
    const data = await getAffichagesData()
    if (!data) redirect("/login")

    return <AffichagesClientDashboard companyName={data.companyName} affichages={data.affichages} />
}
