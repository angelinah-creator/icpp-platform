import { prisma } from "@/lib/prisma"

const STATIC_FICHES = [
    {
        category: "FICHE_2",
        type: "DROITS_OBLIGATIONS",
        title: "Droits & Obligations — Textes juridiques",
        description: "Harcèlement sexuel/moral, discrimination, égalité F/H (texte verrouillé ICPP)",
        isLocked: true,
    },
    {
        category: "FICHE_3",
        type: "INTERDICTION_FUMER",
        title: "Interdiction de fumer et de vapoter",
        description: "Affiche avec pictogrammes obligatoires",
        isLocked: true,
    },
    {
        category: "FICHE_4",
        type: "CONSIGNES_INCENDIE",
        title: "Consignes de sécurité incendie",
        description: "Plan d'évacuation, numéros d'urgence, consignes",
        isLocked: true,
    },
]

const FICHE_1_DEFAULT = {
    category: "FICHE_1",
    type: "COORDONNEES",
    title: "Coordonnées & Informations obligatoires",
    description: "Inspection du travail, médecine du travail, référent harcèlement, horaires, CSE, urgences",
    isLocked: false,
}

export async function seedAffichagesForCompany(companyId: string) {
    const existing = await prisma.affichage.findFirst({
        where: { companyId },
    })

    if (existing) return

    await prisma.affichage.createMany({
        data: [
            { ...FICHE_1_DEFAULT, companyId },
            ...STATIC_FICHES.map(f => ({ ...f, companyId })),
        ],
    })
}

export async function seedAffichagesForAllCompanies() {
    const companies = await prisma.company.findMany({
        select: { id: true },
    })

    let count = 0
    for (const company of companies) {
        const existing = await prisma.affichage.findFirst({
            where: { companyId: company.id },
        })
        if (!existing) {
            await prisma.affichage.createMany({
                data: [
                    { ...FICHE_1_DEFAULT, companyId: company.id },
                    ...STATIC_FICHES.map(f => ({ ...f, companyId: company.id })),
                ],
            })
            count++
        }
    }
    return count
}
