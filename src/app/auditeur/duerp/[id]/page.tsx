import { getDuerpDetail } from "@/server/actions/duerp"
import { redirect } from "next/navigation"
import { DuerpDetailClient } from "./duerp-detail-client"
import { getCurrentUser } from "@/lib/auth-helpers"

export default async function DuerpDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const user = await getCurrentUser()
    const result = await getDuerpDetail(id)

    if (!user || "error" in result) {
        redirect("/auditeur/duerp")
    }

    return (
        <DuerpDetailClient 
            duerp={result as any} 
            currentUserId={user.id} 
            currentUserRole={user.role} 
        />
    )
}
