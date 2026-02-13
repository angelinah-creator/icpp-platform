import { getClientDashboardData } from "@/server/actions/client-dashboard"
import { DashboardClient } from "./dashboard-client"
import { redirect } from "next/navigation"

export default async function ClientPage() {
    const data = await getClientDashboardData()

    if (!data) {
        redirect("/login")
    }

    return <DashboardClient data={data} />
}
