import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { name, phone, companyName, companySiret, companyAddress, companyCity } = await request.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, companyId: true },
        })

        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: name || undefined,
                phone: phone || null,
            },
        })

        if (user.companyId) {
            await prisma.company.update({
                where: { id: user.companyId },
                data: {
                    name: companyName || undefined,
                    siret: companySiret || null,
                    address: companyAddress || "",
                    city: companyCity || "",
                },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
