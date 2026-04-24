import { requireRole } from "@/lib/auth-helpers"
import { getCompaniesSimple, getAuditors, getMetiers, getPlans } from "@/server/actions/admin"
import { NouvelAuditAdminClient } from "./nouveau-audit-admin-client"

export default async function AdminNouvelAuditPage() {
    await requireRole(["ADMIN"])

    const [companies, auditors, metiers, plans] = await Promise.all([
        getCompaniesSimple(),
        getAuditors(),
        getMetiers(),
        getPlans()
    ])

    return (
        <NouvelAuditAdminClient
            companies={companies}
            auditors={auditors}
            metiers={metiers}
            plans={plans}
        />
    )
}
