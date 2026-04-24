import { getDuerpDetail } from "@/server/actions/duerp"
import { getInternalNotes } from "@/server/actions/admin"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminDuerpDetailClient } from "./admin-duerp-detail-client"

export default async function AdminDuerpDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const [result, session] = await Promise.all([
        getDuerpDetail(id),
        auth()
    ])

    if ("error" in result) {
        redirect("/admin/duerp")
    }

    // Notes scoped to this DUERP (companyId required — extract from DUERP result)
    const companyId = (result as any).company?.id ?? (result as any).companyId ?? ""
    const notes = companyId ? await getInternalNotes(companyId, id) : []

    return (
        <AdminDuerpDetailClient
            duerp={result}
            notes={notes as any}
            currentUserId={session?.user?.id ?? ""}
            currentUserRole={session?.user?.role ?? ""}
        />
    )
}
