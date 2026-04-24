import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { getOnsiteAuditFinalization } from "@/server/actions/contracts"
import { AuditOnsiteFinalization } from "@/components/contracts/audit-onsite-finalization"

export default async function AuditeurAuditFinalisationPage({ params }: { params: Promise<{ id: string }> }) {
    await requireRole(["AUDITOR", "COMMERCIAL"])
    const { id } = await params

    const data = await getOnsiteAuditFinalization(id)
    if (!data) {
        redirect("/auditeur/audits")
    }

    return (
        <div className="p-4 sm:p-6">
            <AuditOnsiteFinalization data={data} returnPath={`/auditeur/audits/${id}/finalisation`} />
        </div>
    )
}
