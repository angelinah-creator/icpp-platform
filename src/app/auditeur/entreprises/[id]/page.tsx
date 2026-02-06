import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-helpers"
import { getCompanyDetailForAuditeur } from "@/server/actions/client"
import { EntrepriseDetailClient } from "./entreprise-detail-client"

export default async function EntrepriseDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") {
        redirect("/login")
    }

    const company = await getCompanyDetailForAuditeur(params.id)

    if (!company) {
        notFound()
    }

    return <EntrepriseDetailClient company={company} />
}
