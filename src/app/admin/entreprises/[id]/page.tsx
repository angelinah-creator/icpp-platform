import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EntrepriseDetailClient } from "./entreprise-detail-client"

export default async function EntrepriseDetailPage({ params }: { params: { id: string } }) {
    const company = await prisma.company.findUnique({
        where: { id: params.id },
        include: {
            metier: true,
            subscription: {
                include: { plan: true }
            },
            duerps: {
                orderBy: { createdAt: "desc" },
                take: 5
            },
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            _count: {
                select: {
                    duerps: true
                }
            }
        }
    })

    if (!company) {
        notFound()
    }

    return <EntrepriseDetailClient company={company} />
}
