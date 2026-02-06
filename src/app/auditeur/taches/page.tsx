import { requireRole } from "@/lib/auth-helpers"
import { TachesClient } from "./taches-client"

export default async function TachesPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    return <TachesClient />
}
