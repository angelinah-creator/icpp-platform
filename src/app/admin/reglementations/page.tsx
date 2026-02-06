import { getReglementations } from "@/server/actions/admin"
import { ReglementationsClient } from "./reglementations-client"

export default async function ReglementationsPage() {
    const reglementations = await getReglementations()
    return <ReglementationsClient initialReglementations={reglementations} />
}
