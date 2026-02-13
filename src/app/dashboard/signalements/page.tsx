import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getClientSignalements } from "@/server/actions/signalements"
import { ClientSignalementsPage } from "@/components/client/client-signalements-page"

export default async function SignalementsPage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const signalements = await getClientSignalements()

    return <ClientSignalementsPage signalements={signalements || []} />
}
