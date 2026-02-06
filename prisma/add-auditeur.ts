import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🔧 Adding Auditeur user...")

    const hashedPassword = await bcrypt.hash("password123", 10)

    // Check if auditeur already exists
    const existingAuditeur = await prisma.user.findUnique({
        where: { email: "auditeur@icpp-platform.fr" }
    })

    if (existingAuditeur) {
        console.log("✅ Auditeur already exists!")
        console.log("\n👤 Auditeur credentials:")
        console.log("Email: auditeur@icpp-platform.fr")
        console.log("Password: password123")
        return
    }

    // Create auditeur user
    const auditeur = await prisma.user.create({
        data: {
            email: "auditeur@icpp-platform.fr",
            name: "John Doe",
            password: hashedPassword,
            role: "AUDITOR",
            emailVerified: new Date()
        }
    })

    console.log("✅ Auditeur created successfully!")
    console.log(`   ID: ${auditeur.id}`)
    console.log(`   Name: ${auditeur.name}`)
    console.log(`   Email: ${auditeur.email}`)
    console.log(`   Role: ${auditeur.role}`)
    console.log("\n👤 Login credentials:")
    console.log("Email: auditeur@icpp-platform.fr")
    console.log("Password: password123")
}

main()
    .catch((e) => {
        console.error("❌ Failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
