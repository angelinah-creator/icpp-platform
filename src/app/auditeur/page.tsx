import { redirect } from "next/navigation"
import { getAuditeurDashboardData } from "@/server/actions/client"
import { AuditeurDashboardClient } from "./dashboard-client"

export default async function AuditeurDashboard() {
    const data = await getAuditeurDashboardData()

    if (!data) {
        redirect("/login")
    }

    return <AuditeurDashboardClient data={data} />
}
