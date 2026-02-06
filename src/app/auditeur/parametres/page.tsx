import { requireRole } from "@/lib/auth-helpers"
import { ParametresClient } from "./parametres-client"

export default async function ParametresPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    return <ParametresClient />
}
