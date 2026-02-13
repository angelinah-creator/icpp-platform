import { redirect } from "next/navigation"
import { getTechnicienDashboardData, getTechnicienTaches } from "@/server/actions/technicien"
import { TechnicienDashboardClient } from "./dashboard-client"

export default async function TechnicienDashboard() {
    const data = await getTechnicienDashboardData()

    if (!data) {
        redirect("/login")
    }

    // Récupérer les tâches
    const taches = await getTechnicienTaches()

    return <TechnicienDashboardClient data={data} taches={taches} />
}
