import { getClientSalaries } from "@/server/actions/salaries"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { SalariesClientDashboard } from "./salaries-client"

export default async function SalariesPage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const salaries = await getClientSalaries()

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { companyId: true }
    })

    const serialized = salaries.map(s => ({
        id: s.id,
        nom: s.nom,
        prenom: s.prenom,
        poste: s.poste,
        uniteTravail: s.uniteTravail,
        dateEntree: s.dateEntree.toISOString(),
        dateSortie: s.dateSortie ? s.dateSortie.toISOString() : null,
        typeContrat: s.typeContrat,
        isActive: s.isActive,
        email: s.email,
        telephone: s.telephone,
    }))

    return <SalariesClientDashboard salaries={serialized} companyId={user?.companyId ?? null} />
}

