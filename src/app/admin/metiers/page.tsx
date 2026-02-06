import { getMetiers } from "@/server/actions/admin"
import { MetiersClient } from "./metiers-client"

export default async function MetiersPage() {
    const metiers = await getMetiers()
    return <MetiersClient initialMetiers={metiers} />
}
