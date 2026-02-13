"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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
        },
    })

    if (!duerp) {
        return { error: "DUERP introuvable" }
    }

    const evaluations = duerp.evaluations.map((ev) => {
        let mesures: string[] = []
        try {
            mesures = JSON.parse(ev.mesuresAppliquees || "[]")
        } catch {
            mesures = ev.mesuresAppliquees ? [ev.mesuresAppliquees] : []
        }

        return {
            id: ev.id,
            risqueNom: ev.risque.nom,
            categorieNom: ev.risque.categorie.nom,
            uniteTravail: ev.uniteTravail,
            frequence: ev.frequence,
            gravite: ev.gravite,
            niveauRisque: ev.niveauRisque,
            mesuresAppliquees: mesures,
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
        signature: duerp.signedAt
            ? {
                signedAt: duerp.signedAt.toISOString(),
                signerName: duerp.signer?.name || "Inconnu",
                signerEmail: duerp.signer?.email || "",
            }
            : null,
    }
}
