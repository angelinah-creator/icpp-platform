import { getDuerpDetail } from "@/server/actions/duerp"
import { redirect } from "next/navigation"
import { AdminDuerpDetailClient } from "./admin-duerp-detail-client"

export default async function AdminDuerpDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const result = await getDuerpDetail(id)

    if ("error" in result) {
        redirect("/admin/duerp")
    }

    return <AdminDuerpDetailClient duerp={result} />
}
