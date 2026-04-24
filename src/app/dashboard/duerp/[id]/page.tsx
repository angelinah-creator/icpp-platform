import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { DuerpDetailClient } from "./duerp-detail-client"

async function getDuerpData(id: string) {
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
                orderBy: { niveauRisque: "desc" },
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
    const duerp = await getDuerpData(id)

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
        risques: duerp.evaluations.map(ev => {
            // Action recommandée = mesures suggérées issues de la base ICPP (données réelles)
            let mesuresSuggerees: string[] = []
            try {
                mesuresSuggerees = JSON.parse(ev.risque.mesuresSuggerees || "[]")
            } catch {
                mesuresSuggerees = ev.risque.mesuresSuggerees ? [ev.risque.mesuresSuggerees] : []
            }

            const evAny = ev as typeof ev & { actionCorrective?: string; delai?: string; responsable?: string }

            return {
                id: ev.id,
                risqueNom: ev.risque.nom,
                risqueDescription: ev.risque.description,
                categorieCode: ev.risque.categorie?.code || "AUTRE",
                categorieNom: ev.risque.categorie?.nom || "Non classé",
                uniteTravail: ev.uniteTravail,
                frequence: ev.frequence,
                gravite: ev.gravite,
                niveauRisque: ev.niveauRisque,
                actionRecommandee: mesuresSuggerees.join(", ") || null,
                actionCorrective: evAny.actionCorrective || null,
                delai: evAny.delai || null,
                responsable: evAny.responsable || null,
                observations: ev.observations,
            }
        })
    }

    return <DuerpDetailClient duerp={serialized} />
}
