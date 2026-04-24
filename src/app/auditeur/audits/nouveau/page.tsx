import { requireRole } from "@/lib/auth-helpers"
import { NouvelAuditClient } from "./nouveau-audit-client"
import { getAuditeurClients, getMetiersForAuditeur } from "@/server/actions/client"
import { getPlans } from "@/server/actions/admin"

export default async function NouvelAuditPage() {
    await requireRole(["AUDITOR", "COMMERCIAL"])

    const [clients, metiers, plans] = await Promise.all([
        getAuditeurClients(),
        getMetiersForAuditeur(),
        getPlans()
    ])

    return <NouvelAuditClient clients={clients} metiers={metiers} plans={plans} />
}
