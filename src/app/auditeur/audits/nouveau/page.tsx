import { requireRole } from "@/lib/auth-helpers"
import { NouvelAuditClient } from "./nouveau-audit-client"

export default async function NouvelAuditPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    return <NouvelAuditClient />
}
