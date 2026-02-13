import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Trouver l'auditeur
    const auditeur = await prisma.user.findFirst({
        where: { email: 'auditeur@icpp-platform.fr' }
    })

    if (!auditeur) {
        console.error('❌ Auditeur non trouvé')
        return
    }

    console.log(`✅ Auditeur trouvé: ${auditeur.name} (${auditeur.id})`)

    // Trouver l'entreprise Belle Allure
    const company = await prisma.company.findFirst({
        where: { name: { contains: 'Belle Allure' } }
    })

    if (!company) {
        console.error('❌ Entreprise Belle Allure non trouvée')
        return
    }

    console.log(`✅ Entreprise trouvée: ${company.name} (${company.id})`)

    // Assigner l'entreprise à l'auditeur
    const updated = await prisma.company.update({
        where: { id: company.id },
        data: { auditorId: auditeur.id }
    })

    console.log(`✅ Entreprise ${updated.name} assignée à l'auditeur ${auditeur.name}`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
