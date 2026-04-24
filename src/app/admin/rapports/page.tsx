import { getAdminRapports } from "@/server/actions/taches"
import { AdminRapportsClient } from "./rapports-client"
import { requireRole } from "@/lib/auth-helpers"

export const dynamic = "force-dynamic"

export default async function AdminRapportsPage() {
    await requireRole(["ADMIN"])

    const rapports = await getAdminRapports()

    return (
        <AdminRapportsClient
            initialRapports={rapports as unknown as import("./rapports-client").RapportData[]}
        />
    )
}
