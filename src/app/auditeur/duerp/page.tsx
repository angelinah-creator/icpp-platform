import { requireRole } from "@/lib/auth-helpers"
import { getDuerps } from "@/server/actions/admin"
import { DuerpClient } from "./duerp-client"

export default async function DuerpPage() {
    await requireRole(["AUDITOR", "COMMERCIAL"])

    const duerps = await getDuerps()

    return <DuerpClient initialDuerps={duerps} />
}
