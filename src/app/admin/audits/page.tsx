import { getAudits, getAdminStats, getCompanies, getAuditors } from "@/server/actions/admin"
import { AuditsClient } from "./audits-client"

export default async function AuditsPage() {
    const [audits, stats, companies, auditors] = await Promise.all([
        getAudits(),
        getAdminStats(),
        getCompanies(),
        getAuditors()
    ])

    return (
        <AuditsClient
            initialAudits={audits}
            stats={stats.audits}
            companies={companies}
            auditors={auditors}
        />
    )
}
