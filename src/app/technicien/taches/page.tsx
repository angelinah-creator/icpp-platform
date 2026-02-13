import { requireRole } from "@/lib/auth-helpers"
import { TachesClient } from "./taches-client"
import { getTechnicienTasks } from "@/server/actions/taches"

export default async function TachesPage() {
    // Require Technicien role
    await requireRole(["TECHNICIEN"])

    const tasks = await getTechnicienTasks()

    return <TachesClient initialTasks={tasks} />
}
