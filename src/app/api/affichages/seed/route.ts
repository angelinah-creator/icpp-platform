import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { seedAffichagesForAllCompanies } from "@/lib/seed-affichages"

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        })

        if (user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 })
        }

        const count = await seedAffichagesForAllCompanies()

        return NextResponse.json({
            success: true,
            message: `${count} entreprise(s) mise(s) à jour avec les affichages obligatoires`,
            companiesSeeded: count,
        })
    } catch (error) {
        console.error("Erreur seed affichages:", error)
        return NextResponse.json({ error: "Erreur lors du seeding" }, { status: 500 })
    }
}
