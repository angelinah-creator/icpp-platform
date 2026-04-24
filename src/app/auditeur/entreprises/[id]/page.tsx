import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-helpers"
import { getCompanyDetailForAuditeur, getMetiersForAuditeur, getPlansForAuditeur } from "@/server/actions/client"
import { EntrepriseDetailClient } from "./entreprise-detail-client"

export default async function EntrepriseDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser()
    if (!user || user.role !== "AUDITEUR") {
        redirect("/login")
    }

    const [company, metiers, plans] = await Promise.all([
        getCompanyDetailForAuditeur(params.id),
        getMetiersForAuditeur(),
        getPlansForAuditeur()
    ])

    if (!company) {
        notFound()
    }

    return <EntrepriseDetailClient 
        company={company} 
        metiers={metiers} 
        plans={plans} 
        currentUserId={user.id}
        currentUserRole={user.role}
    />
}
