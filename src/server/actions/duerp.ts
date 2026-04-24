"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { calcIndicateurs, getPonderation } from "@/lib/duerp-calcul"

export async function signDuerp(duerpId: string) {
    const session = await auth()
    if (!session?.user?.email) {
        return { error: "Non autorisé" }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        return { error: "Utilisateur introuvable" }
    }

    if (!["AUDITOR", "COMMERCIAL", "ADMIN"].includes(user.role)) {
        return { error: "Vous n'avez pas les droits pour signer ce document" }
    }

    const duerp = await prisma.duerpDocument.findUnique({
        where: { id: duerpId },
        include: { company: true },
    })

    if (!duerp) {
        return { error: "DUERP introuvable" }
    }

    if (duerp.signedAt) {
        return { error: "Ce document a déjà été signé" }
    }

    const now = new Date()
    const nextReview = new Date(now)
    nextReview.setFullYear(nextReview.getFullYear() + 1)

    const signatureData = JSON.stringify({
        certification: "Je certifie l'exactitude des informations contenues dans ce document",
        signerEmail: user.email,
        signerRole: user.role,
        role: user.role === "AUDITOR" ? "Auditeur ICPP" : user.role === "ADMIN" ? "Administrateur ICPP" : "Commercial ICPP",
        timestamp: now.toISOString(),
        method: "electronic_simple",
    })

    const updatedDuerp = await prisma.duerpDocument.update({
        where: { id: duerpId },
        data: {
            signedAt: now,
            signedBy: user.id,
            signatureData,
            status: "ACTIVE",
            pdfGeneratedAt: now,
            pdfUrl: `/api/duerp/${duerpId}/pdf`,
            nextReviewDate: nextReview,
        },
    })

    revalidatePath("/auditeur/duerp")
    revalidatePath("/admin/duerp")
    revalidatePath("/dashboard/duerp")

    return {
        success: true,
        duerp: {
            id: updatedDuerp.id,
            signedAt: updatedDuerp.signedAt?.toISOString(),
            status: updatedDuerp.status,
            pdfUrl: updatedDuerp.pdfUrl,
        },
    }
}

export async function getDuerpDetail(duerpId: string) {
    const session = await auth()
    if (!session?.user?.email) {
        return { error: "Non autorisé" }
    }

    const duerp = await prisma.duerpDocument.findUnique({
        where: { id: duerpId },
        include: {
            company: {
                include: {
                    metier: true,
                    auditor: true,
                },
            },
            evaluations: {
                include: {
                    risque: {
                        include: {
                            categorie: true,
                        },
                    },
                },
                orderBy: { uniteTravail: "asc" },
            },
            signer: true,
            internalNotes: {
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                        }
                    }
                },
                orderBy: [
                    { isPinned: "desc" },
                    { createdAt: "desc" }
                ]
            }
        },
    })

    if (!duerp) {
        return { error: "DUERP introuvable" }
    }

    const evaluations = duerp.evaluations.map((ev) => {
        // Mesures suggérées par le risque (base de référence ICPP)
        let mesuresSuggerees: string[] = []
        try {
            mesuresSuggerees = JSON.parse(ev.risque.mesuresSuggerees || "[]")
        } catch {
            mesuresSuggerees = ev.risque.mesuresSuggerees ? [ev.risque.mesuresSuggerees] : []
        }

        // Lecture des champs de maîtrise (avec fallback pour compatibilité)
        const niveauMaitrise = (ev as Record<string, unknown>).niveauMaitrise as string ?? "Aucune"
        const ponderation = (ev as Record<string, unknown>).ponderation as number ?? 1
        const risqueResiduel = ((ev as Record<string, unknown>).risqueResiduel as number | null)
            ?? ev.frequence * ev.gravite * getPonderation(niveauMaitrise)
        const prioriteAction = ((ev as Record<string, unknown>).prioriteAction as string | null)
            ?? calcIndicateurs(ev.frequence, ev.gravite, niveauMaitrise).prioriteAction

        return {
            id: ev.id,
            risqueNom: ev.risque.nom,
            risqueDescription: ev.risque.description,
            categorieCode: ev.risque.categorie.code,
            categorieNom: ev.risque.categorie.nom,
            uniteTravail: ev.uniteTravail,
            frequence: ev.frequence,
            gravite: ev.gravite,
            niveauRisque: ev.niveauRisque,      // risque brut = F × G
            niveauMaitrise,
            ponderation,
            risqueResiduel,
            prioriteAction,
            actionRecommandee: mesuresSuggerees.join(", ") || null,
            actionCorrective: (ev as Record<string, unknown>).actionCorrective as string | null ?? null,
            delai: (ev as Record<string, unknown>).delai as string | null ?? null,
            responsable: (ev as Record<string, unknown>).responsable as string | null ?? null,
            observations: ev.observations,
        }
    })

    return {
        id: duerp.id,
        version: duerp.version,
        status: duerp.status,
        createdAt: duerp.createdAt.toISOString(),
        updatedAt: duerp.updatedAt.toISOString(),
        nextReviewDate: duerp.nextReviewDate?.toISOString() || null,
        pdfUrl: duerp.pdfUrl,
        company: {
            id: duerp.company.id,
            name: duerp.company.name,
            siret: duerp.company.siret,
            address: duerp.company.address,
            city: duerp.company.city,
            postalCode: duerp.company.postalCode,
            employeeCount: duerp.company.employeeCount,
            metier: duerp.company.metier?.nom || null,
            contactName: duerp.company.contactName,
            contactRole: duerp.company.contactRole,
            auditorName: duerp.company.auditor?.name || null,
        },
        evaluations,
        internalNotes: duerp.internalNotes,
        signature: duerp.signedAt
            ? {
                signedAt: duerp.signedAt.toISOString(),
                signerName: duerp.signer?.name || "Inconnu",
                signerEmail: duerp.signer?.email || "",
            }
            : null,
    }
}

/**
 * Met à jour le niveau de maîtrise d'une évaluation
 * et recalcule automatiquement pondération, risque résiduel et priorité d'action
 */
export async function updateEvaluationMaitrise(
    evalId: string,
    niveauMaitrise: string
) {
    try {
        const session = await auth()
        if (!session?.user?.email) return { error: "Non autorisé" }

        const ev = await prisma.evaluationRisque.findUnique({
            where: { id: evalId },
            select: { frequence: true, gravite: true },
        })
        if (!ev) return { error: "Évaluation introuvable" }

        const { ponderation, risqueResiduel, prioriteAction } = calcIndicateurs(
            ev.frequence,
            ev.gravite,
            niveauMaitrise
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma.evaluationRisque.update as any)({
            where: { id: evalId },
            data: { niveauMaitrise, ponderation, risqueResiduel, prioriteAction },
        })

        revalidatePath("/auditeur/duerp")
        revalidatePath("/admin/duerp")
        return { success: true, ponderation, risqueResiduel, prioriteAction }
    } catch (error) {
        console.error("Error updating maitrise:", error)
        return { error: "Erreur lors de la mise à jour" }
    }
}
