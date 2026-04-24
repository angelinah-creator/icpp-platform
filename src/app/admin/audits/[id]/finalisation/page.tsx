import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { getOnsiteAuditFinalization } from "@/server/actions/contracts"
import { AuditOnsiteFinalization } from "@/components/contracts/audit-onsite-finalization"

export default async function AdminAuditFinalisationPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole(["ADMIN"])
    const { id } = await params

    const data = await getOnsiteAuditFinalization(id)
    if (!data) {
        redirect("/admin/audits")
    }

    return (
        <div className="space-y-6">
            <AuditOnsiteFinalization data={data} returnPath={`/admin/audits/${id}/finalisation`} />
        </div>
    )
}
