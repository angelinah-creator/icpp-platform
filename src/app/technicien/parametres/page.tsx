import { requireRole } from "@/lib/auth-helpers"
import { ParametresClient } from "./parametres-client"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function TechnicienParametresPage() {
    // Require Technicien role
    await requireRole(["TECHNICIEN"])

    const session = await auth()
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" }
    })

    if (!user) {
        return <div>Utilisateur non trouvé</div>
    }

    return <ParametresClient user={user} />
}
