import { prisma } from "@/lib/prisma"

function generateContractNumber() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const random = Math.random().toString(36).slice(2, 7).toUpperCase()
    return `CT-${year}${month}${day}-${random}`
}

async function ensureActiveCgvVersion() {
    const active = await prisma.cGVVersion.findFirst({
        where: { isActive: true },
        orderBy: { datePublication: "desc" },
    })

    if (active) return active

    return prisma.cGVVersion.create({
        data: {
            version: "1.0",
            datePublication: new Date(),
            isActive: true,
            contenu: [
                "Conditions Generales de Vente ICPP",
                "1. L'accompagnement conformite est fourni selon le plan assigne.",
                "2. Le client regle les mensualites selon la periodicite convenue.",
                "3. Le client s'engage a maintenir les informations entreprise a jour.",
                "4. Le contrat prend effet a validation du paiement et signature numerique.",
            ].join("\n"),
        },
    })
}

export async function ensureContractAfterPayment(companyId: string) {
    const existing = await prisma.contrat.findFirst({
        where: {
            companyId,
            status: { in: ["ACTIF", "SUSPENDU"] },
        },
        orderBy: { createdAt: "desc" },
    })

    if (existing) return existing

    const cgv = await ensureActiveCgvVersion()

    return prisma.contrat.create({
        data: {
            numeroContrat: generateContractNumber(),
            companyId,
            cgvVersion: cgv.version,
            dateDebut: new Date(),
            status: "ACTIF",
        },
    })
}
