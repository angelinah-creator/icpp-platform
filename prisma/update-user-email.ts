import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Updating test client email...")

    const user = await prisma.user.update({
        where: { email: "dev@code-talent.fr" },
        data: { email: "ainafandresena9@gmail.com" },
    })

    console.log("✅ User email updated:")
    console.log(`   Old email: dev@code-talent.fr`)
    console.log(`   New email: ${user.email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
