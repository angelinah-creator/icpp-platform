import { redirect } from "next/navigation"
import { getAuditeurDashboardData, getAuditeurTaches, getAuditeurSignalements } from "@/server/actions/client"
import { AuditeurDashboardClient } from "./dashboard-client"

export default async function AuditeurDashboard() {
    const data = await getAuditeurDashboardData()

    if (!data) {
        redirect("/login")
    }

    // Récupérer les tâches et signalements
    const [taches, signalements] = await Promise.all([
        getAuditeurTaches(),
        getAuditeurSignalements()
    ])

    return <AuditeurDashboardClient data={data} taches={taches} signalements={signalements} />
}
