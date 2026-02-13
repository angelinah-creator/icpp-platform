import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true, password: true },
        })

        if (!user?.password) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
        }

        const isValid = await bcrypt.compare(currentPassword, user.password)
        if (!isValid) {
            return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Password change error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
