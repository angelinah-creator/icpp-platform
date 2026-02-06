import { getMetiers, getPlans } from "@/server/actions/admin"
import NouveauClientForm from "./nouveau-client-form"

export default async function NouveauClientPage() {
    const [metiers, plans] = await Promise.all([
        getMetiers(),
        getPlans()
    ])

    return (
        <NouveauClientForm
            metiers={metiers.map(m => ({ code: m.code, nom: m.nom }))}
            plans={plans}
        />
    )
}
