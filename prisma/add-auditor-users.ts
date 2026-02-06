import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function addAuditorAccounts() {
    console.log("🔑 Creating Auditor/Commercial test accounts...\n")

    const hashedPassword = await bcrypt.hash("password123", 10)

    try {
        // Auditeur
        const auditor = await prisma.user.upsert({
            where: { email: "auditeur@icpp-platform.fr" },
            update: {},
            create: {
                email: "auditeur@icpp-platform.fr",
                name: "Jean Auditeur",
                password: hashedPassword,
                role: "AUDITOR",
                emailVerified: new Date()
            }
        })
        console.log("✅ AUDITOR account created/updated")

        // Commercial
        const commercial = await prisma.user.upsert({
            where: { email: "commercial@icpp-platform.fr" },
            update: {},
            create: {
                email: "commercial@icpp-platform.fr",
                name: "Sophie Commercial",
                password: hashedPassword,
                role: "COMMERCIAL",
                emailVerified: new Date()
            }
        })
        console.log("✅ COMMERCIAL account created/updated")

        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        console.log("👤 TOUS LES COMPTES DE TEST")
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
        console.log("ADMIN:      admin@icpp-platform.fr / password123")
        console.log("            → Redirige vers /admin\n")
        console.log("CLIENT:     marie@belleallure.re / password123")
        console.log("            → Redirige vers /dashboard\n")
        console.log("AUDITEUR:   auditeur@icpp-platform.fr / password123")
        console.log("            → Redirige vers /auditeur\n")
        console.log("COMMERCIAL: commercial@icpp-platform.fr / password123")
        console.log("            → Redirige vers /auditeur\n")
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

    } catch (error) {
        console.error("❌ Error:", error)
        throw error
    }
}

addAuditorAccounts()
    .finally(async () => {
        await prisma.$disconnect()
    })
