import { getSignalements } from "@/server/actions/admin"
import { SignalementsClient } from "./signalements-client"

export default async function SignalementsPage() {
    const signalements = await getSignalements()
    return <SignalementsClient initialSignalements={signalements} />
}
