'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export interface UserProfileData {
    prenom: string
    nom: string
    telephone: string
}

export async function updateUserProfile(data: UserProfileData) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Non autorisé" }
        }

        // Combine prenom + nom for the 'name' field
        const fullName = `${data.prenom} ${data.nom}`.trim()

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: fullName,
                phone: data.telephone
            }
        })

        revalidatePath("/auditeur/parametres")
        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { error: "Erreur lors de la mise à jour du profil" }
    }
}
