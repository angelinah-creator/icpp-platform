import { requireRole } from "@/lib/auth-helpers"
import { SignalementsClient } from "./signalements-client"

export default async function SignalementsPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    return <SignalementsClient />
}
