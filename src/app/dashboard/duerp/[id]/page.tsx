import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { DuerpDetailClient } from "./duerp-detail-client"

async function getDuerpDetail(id: string) {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { companyId: true }
    })

    if (!user?.companyId) return null

    const duerp = await prisma.duerpDocument.findUnique({
        where: { id },
        include: {
            company: true,
            evaluations: {
                include: {
                    risque: {
                        include: {
                            categorie: true
                        }
                    },
                },
                orderBy: { uniteTravail: "asc" },
            },
            signer: {
                select: { name: true }
            },
        }
    })

    if (!duerp || duerp.companyId !== user.companyId) return null

    return duerp
}

export default async function DuerpDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const duerp = await getDuerpDetail(id)

    if (!duerp) notFound()

    const serialized = {
        id: duerp.id,
        version: duerp.version,
        status: duerp.status,
        signedAt: duerp.signedAt?.toISOString() || null,
        signedByName: duerp.signer?.name || null,
        createdAt: duerp.createdAt.toISOString(),
        nextReviewDate: duerp.nextReviewDate?.toISOString() || null,
        companyName: duerp.company.name,
        companyAddress: duerp.company.address,
        companyCity: duerp.company.city,
        risques: duerp.evaluations.map(ev => ({
            id: ev.id,
            risqueNom: ev.risque.nom,
            categoryNom: ev.risque.categorie?.nom || "Non classé",
            uniteTravail: ev.uniteTravail,
            frequence: ev.frequence,
            gravite: ev.gravite,
            niveauRisque: ev.niveauRisque,
            mesuresAppliquees: ev.mesuresAppliquees,
            observations: ev.observations,
        }))
    }

    return <DuerpDetailClient duerp={serialized} />
}
