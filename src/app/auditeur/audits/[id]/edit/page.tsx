import { redirect } from "next/navigation"
import { getAuditForEdit } from "@/server/actions/client"
import { getPlans } from "@/server/actions/admin"
import { EditAuditClient } from "./edit-audit-client"

export default async function EditAuditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [audit, plans] = await Promise.all([
        getAuditForEdit(id),
        getPlans()
    ])

    if (!audit) {
        redirect("/auditeur/audits")
    }

    return <EditAuditClient audit={audit} plans={plans} />
}
