import { getDuerps } from "@/server/actions/admin"
import { DuerpClient } from "./duerp-client"

export default async function DuerpPage() {
    const duerps = await getDuerps()
    return <DuerpClient initialDuerps={duerps} />
}
