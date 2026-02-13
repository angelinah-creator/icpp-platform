import { getDuerpDetail } from "@/server/actions/duerp"
import { redirect } from "next/navigation"
import { DuerpDetailClient } from "./duerp-detail-client"

export default async function DuerpDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const result = await getDuerpDetail(id)

    if ("error" in result) {
        redirect("/auditeur/duerp")
    }

    return <DuerpDetailClient duerp={result} />
}
