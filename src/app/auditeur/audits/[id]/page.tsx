import { redirect } from "next/navigation"
import { getAuditDetails } from "@/server/actions/client"
import { AuditDetailClient } from "./audit-detail-client"

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const audit = await getAuditDetails(id)

    if (!audit) {
        redirect("/auditeur/audits")
    }

    return <AuditDetailClient audit={audit} />
}
