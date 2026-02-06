import { requireRole } from "@/lib/auth-helpers"
import { MesAuditsClient } from "./audits-client"

export default async function AuditsPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    return <MesAuditsClient />
}
