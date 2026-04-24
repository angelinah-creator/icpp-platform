import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getInternalNotes } from "@/server/actions/admin"
import { EntrepriseDetailClient } from "./entreprise-detail-client"

export default async function EntrepriseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    const currentUser = session?.user

    const [company, plans, metiers, notes] = await Promise.all([
        prisma.company.findUnique({
            where: { id },
            include: {
                metier: true,
                subscription: {
                    include: { plan: true }
                },
                duerps: {
                    orderBy: { createdAt: "desc" as const },
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
        }),
        prisma.planTarifaire.findMany({
            where: { isActive: true },
            orderBy: { prixMensuel: "asc" as const }
        }),
        prisma.metierICPP.findMany({
            where: { isActive: true },
            orderBy: { nom: "asc" as const }
        }),
        getInternalNotes(id)
    ])

    if (!company) {
        notFound()
    }

    const plansData = plans.map((p: { code: string; nom: string; prixMensuel: number }) => ({
        code: p.code,
        nom: p.nom,
        prix: p.prixMensuel / 100
    }))

    const metiersData = metiers.map((m: { code: string; nom: string }) => ({
        code: m.code,
        nom: m.nom
    }))

    return (
        <EntrepriseDetailClient
            company={company}
            plans={plansData}
            metiers={metiersData}
            notes={notes as any}
            currentUserId={currentUser?.id ?? ""}
            currentUserRole={currentUser?.role ?? ""}
        />
    )
}
