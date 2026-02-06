import { requireRole } from "@/lib/auth-helpers"
import { DuerpClient } from "./duerp-client"

export default async function DuerpPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    return <DuerpClient />
}
