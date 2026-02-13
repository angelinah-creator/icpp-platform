import { requireRole } from "@/lib/auth-helpers"
import { getAuditeurAudits } from "@/server/actions/client"
import { MesAuditsClient } from "./audits-client"

export default async function AuditsPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    // Récupérer les audits de l'auditeur
    const audits = await getAuditeurAudits()

    return <MesAuditsClient audits={audits} />
}
