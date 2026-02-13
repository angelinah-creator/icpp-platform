import { requireRole } from "@/lib/auth-helpers"
import { SignalementsClient } from "./signalements-client"
import { getAuditeurSignalements } from "@/server/actions/signalements"

export default async function SignalementsPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    const signalements = await getAuditeurSignalements()

    return <SignalementsClient initialSignalements={signalements} />
}
