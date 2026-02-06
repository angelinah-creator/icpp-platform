import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("Creating test client user...")

    const hashedPassword = await bcrypt.hash("devopsct", 10)

    // Create company first
    const company = await prisma.company.upsert({
        where: { siret: "12345678901234" },
        update: {},
        create: {
            name: "Code Talent Dev",
            siret: "12345678901234",
            address: "123 Rue du Dev",
            city: "Paris",
            employeeCount: 5,
            metierCode: "COIFFURE",
        },
    })

    // Create test user
    const user = await prisma.user.upsert({
        where: { email: "dev@code-talent.fr" },
        update: {
            password: hashedPassword,
        },
        create: {
            name: "Dev Test Client",
            email: "dev@code-talent.fr",
            password: hashedPassword,
            role: "CLIENT",
            companyId: company.id,
            emailVerified: new Date(),
        },
    })

    console.log("✅ Test client user created:")
    console.log(`   Email: dev@code-talent.fr`)
    console.log(`   Password: devopsct`)
    console.log(`   Role: CLIENT`)
    console.log(`   Company: ${company.name}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
