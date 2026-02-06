/**
 * Script pour créer les utilisateurs de test
 * Exécuter avec: npx ts-node prisma/create-test-users.ts
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🔑 Création des utilisateurs de test...")

    const password = await bcrypt.hash("password123", 10)

    // 1. Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@icpp-platform.fr" },
        update: { password },
        create: {
            email: "admin@icpp-platform.fr",
            name: "Admin ICPP",
            password,
            role: "ADMIN",
            emailVerified: new Date()
        }
    })
    console.log(`✅ Admin créé: ${admin.email}`)

    // 2. Auditeur
    const auditeur = await prisma.user.upsert({
        where: { email: "auditeur@icpp-platform.fr" },
        update: { password },
        create: {
            email: "auditeur@icpp-platform.fr",
            name: "Auditeur ICPP",
            password,
            role: "AUDITOR",
            emailVerified: new Date()
        }
    })
    console.log(`✅ Auditeur créé: ${auditeur.email}`)

    // 3. Client - D'abord créer l'entreprise si elle n'existe pas
    let company = await prisma.company.findFirst({
        where: { name: "Belle Allure" }
    })

    if (!company) {
        company = await prisma.company.create({
            data: {
                name: "Belle Allure",
                siret: "12345678900001",
                email: "contact@belleallure.re",
                phone: "0262 12 34 56",
                address: "10 rue du Commerce",
                postalCode: "97400",
                city: "Saint-Denis",
                metierCode: "ESTHETIQUE",
                employeeCount: 5
            }
        })
        console.log(`✅ Entreprise créée: ${company.name}`)
    }

    const client = await prisma.user.upsert({
        where: { email: "marie@belleallure.re" },
        update: { password, companyId: company.id },
        create: {
            email: "marie@belleallure.re",
            name: "Marie Dupont",
            password,
            role: "CLIENT",
            emailVerified: new Date(),
            companyId: company.id
        }
    })
    console.log(`✅ Client créé: ${client.email}`)

    console.log("\n📋 Récapitulatif des comptes créés:")
    console.log("=" .repeat(50))
    console.log("Admin:    admin@icpp-platform.fr / password123")
    console.log("Auditeur: auditeur@icpp-platform.fr / password123")
    console.log("Client:   marie@belleallure.re / password123")
    console.log("=" .repeat(50))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
