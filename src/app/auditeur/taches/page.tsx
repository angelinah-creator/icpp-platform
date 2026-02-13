import { requireRole } from "@/lib/auth-helpers"
import { TachesClient } from "./taches-client"
import { getAuditeurTasks } from "@/server/actions/taches"

export default async function TachesPage() {
    // Require Auditor or Commercial role
    await requireRole(["AUDITOR", "COMMERCIAL"])

    const tasks = await getAuditeurTasks()

    return <TachesClient initialTasks={tasks} />
}
