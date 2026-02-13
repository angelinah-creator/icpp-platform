import { requireRole } from "@/lib/auth-helpers"
import { NouvelAuditClient } from "./nouveau-audit-client"
import { getAuditeurClients } from "@/server/actions/client"

export default async function NouvelAuditPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    // Récupérer les clients de l'auditeur
    const clients = await getAuditeurClients()

    return <NouvelAuditClient clients={clients} />
}
