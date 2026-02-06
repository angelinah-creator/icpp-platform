import { getCompanies, getPlans, getMetiers } from "@/server/actions/admin"
import { EntreprisesClient } from "./entreprises-client"

export default async function EntreprisesPage() {
    // Fetch real data from database
    const [companies, plans, metiers] = await Promise.all([
        getCompanies(),
        getPlans(),
        getMetiers()
    ])

    return (
        <EntreprisesClient
            initialCompanies={companies}
            plans={plans}
            metiers={metiers}
        />
    )
}
