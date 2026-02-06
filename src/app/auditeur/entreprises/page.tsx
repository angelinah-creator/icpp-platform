import { getAuditeurClients, getMetiersForAuditeur } from "@/server/actions/client"
import { EntreprisesClient } from "./entreprises-client"

export default async function EntreprisesPage() {
    const [clients, metiers] = await Promise.all([
        getAuditeurClients(),
        getMetiersForAuditeur()
    ])

    return (
        <EntreprisesClient
            initialClients={clients}
            metiers={metiers}
        />
    )
}
