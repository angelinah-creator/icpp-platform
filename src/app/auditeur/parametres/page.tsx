import { requireRole } from "@/lib/auth-helpers"
import { ParametresClient } from "./parametres-client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ParametresPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true
        }
    })

    if (!user) return null

    // Split name into first/last (rough approximation)
    const nameParts = (user.name || "").split(" ")
    const prenom = nameParts[0] || ""
    const nom = nameParts.slice(1).join(" ") || ""

    return <ParametresClient user={{
        prenom,
        nom,
        email: user.email || "",
        telephone: user.phone || "",
        role: user.role,
        image: user.image
    }} />
}
