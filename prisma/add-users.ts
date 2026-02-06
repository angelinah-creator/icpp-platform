import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function addMissingUsers() {
    console.log("🔑 Adding missing test users...")

    const hashedPassword = await bcrypt.hash("password123", 10)

    // Check if auditor exists
    const existingAuditor = await prisma.user.findUnique({
        where: { email: "auditeur@icpp-platform.fr" }
    })

    if (!existingAuditor) {
        await prisma.user.create({
            data: {
                email: "auditeur@icpp-platform.fr",
                name: "Jean Auditeur",
                password: hashedPassword,
                role: "AUDITOR",
                emailVerified: new Date()
            }
        })
        console.log("✅ Created AUDITOR account")
    } else {
        console.log("⏭️  AUDITOR account already exists")
    }

    // Check if commercial exists
    const existingCommercial = await prisma.user.findUnique({
        where: { email: "commercial@icpp-platform.fr" }
    })

    if (!existingCommercial) {
        await prisma.user.create({
            data: {
                email: "commercial@icpp-platform.fr",
                name: "Sophie Commercial",
                password: hashedPassword,
                role: "COMMERCIAL",
                emailVerified: new Date()
            }
        })
        console.log("✅ Created COMMERCIAL account")
    } else {
        console.log("⏭️  COMMERCIAL account already exists")
    }

    console.log("\n👤 All test accounts:")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("ADMIN:      admin@icpp-platform.fr / password123")
    console.log("CLIENT:     marie@belleallure.re / password123")
    console.log("AUDITEUR:   auditeur@icpp-platform.fr / password123")
    console.log("COMMERCIAL: commercial@icpp-platform.fr / password123")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
}

addMissingUsers()
    .catch((e) => {
        console.error("❌ Error:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
