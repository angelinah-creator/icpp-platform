import { getClientSalaries } from "@/server/actions/salaries"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SalariesClientDashboard } from "./salaries-client"

export default async function SalariesPage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const salaries = await getClientSalaries()

    const serialized = salaries.map(s => ({
        id: s.id,
        nom: s.nom,
        prenom: s.prenom,
        poste: s.poste,
        uniteTravail: s.uniteTravail,
        dateEntree: s.dateEntree.toISOString(),
        typeContrat: s.typeContrat,
        isActive: s.isActive,
        email: s.email,
        telephone: s.telephone,
    }))

    return <SalariesClientDashboard salaries={serialized} />
}
