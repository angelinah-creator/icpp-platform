import { getSubscriptions, getSubscriptionStats } from "@/server/actions/admin"
import { AbonnementsClient } from "./abonnements-client"

export default async function AbonnementsPage() {
    const [subscriptions, stats] = await Promise.all([
        getSubscriptions(),
        getSubscriptionStats()
    ])

    return <AbonnementsClient initialSubscriptions={subscriptions} stats={stats} />
}
