"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

async function getClientCompanyId() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { companyId: true, role: true }
    })

    if (!user?.companyId) return null
    return user.companyId
}

export async function getClientSalaries() {
    const companyId = await getClientCompanyId()
    if (!companyId) return []

    return prisma.salarie.findMany({
        where: { companyId },
        orderBy: { nom: "asc" }
    })
}

export async function createSalarie(data: {
    nom: string
    prenom: string
    poste: string
    uniteTravail: string
    dateEntree: string
    dateSortie?: string
    typeContrat: string
    email?: string
    telephone?: string
}) {
    const companyId = await getClientCompanyId()
    if (!companyId) return { error: "Non autorisé" }

    const isActive = !data.dateSortie

    await prisma.salarie.create({
        data: {
            companyId,
            nom: data.nom,
            prenom: data.prenom,
            poste: data.poste,
            uniteTravail: data.uniteTravail,
            dateEntree: new Date(data.dateEntree),
            dateSortie: data.dateSortie ? new Date(data.dateSortie) : null,
            typeContrat: data.typeContrat,
            email: data.email || null,
            telephone: data.telephone || null,
            isActive,
        }
    })

    revalidatePath("/dashboard/salaries")
    return { success: true }
}

export async function updateSalarie(id: string, data: {
    nom: string
    prenom: string
    poste: string
    uniteTravail: string
    dateEntree: string
    dateSortie?: string
    typeContrat: string
    email?: string
    telephone?: string
    isActive?: boolean
}) {
    const companyId = await getClientCompanyId()
    if (!companyId) return { error: "Non autorisé" }

    const existing = await prisma.salarie.findUnique({ where: { id } })
    if (!existing || existing.companyId !== companyId) return { error: "Salarié introuvable" }

    const isActive = data.isActive !== undefined ? data.isActive : !data.dateSortie

    await prisma.salarie.update({
        where: { id },
        data: {
            nom: data.nom,
            prenom: data.prenom,
            poste: data.poste,
            uniteTravail: data.uniteTravail,
            dateEntree: new Date(data.dateEntree),
            dateSortie: data.dateSortie ? new Date(data.dateSortie) : null,
            typeContrat: data.typeContrat,
            email: data.email || null,
            telephone: data.telephone || null,
            isActive,
        }
    })

    revalidatePath("/dashboard/salaries")
    return { success: true }
}

export async function deleteSalarie(id: string) {
    const companyId = await getClientCompanyId()
    if (!companyId) return { error: "Non autorisé" }

    const existing = await prisma.salarie.findUnique({ where: { id } })
    if (!existing || existing.companyId !== companyId) return { error: "Salarié introuvable" }

    await prisma.salarie.delete({ where: { id } })

    revalidatePath("/dashboard/salaries")
    return { success: true }
}
