import { redirect } from "next/navigation"
import { getAuditForEdit } from "@/server/actions/client"
import { EditAuditClient } from "./edit-audit-client"

export default async function EditAuditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const audit = await getAuditForEdit(id)
    
    if (!audit) {
        redirect("/auditeur/audits")
    }

    return <EditAuditClient audit={audit} />
}
