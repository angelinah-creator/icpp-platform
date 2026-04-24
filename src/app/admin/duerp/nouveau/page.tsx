import { requireRole } from "@/lib/auth-helpers"
import { getCompaniesSimple, getMetiers } from "@/server/actions/admin"
import { NouveauDuerpAdminClient } from "./nouveau-duerp-admin-client"

export default async function AdminNouveauDuerpPage() {
    await requireRole(["ADMIN"])

    const [companies, metiers] = await Promise.all([
        getCompaniesSimple(),
        getMetiers(),
    ])

    return <NouveauDuerpAdminClient companies={companies} metiers={metiers} />
}
