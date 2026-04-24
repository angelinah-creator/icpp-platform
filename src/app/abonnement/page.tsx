import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { getSubscriptionOnboardingData, confirmStripeSubscriptionPayment } from "@/server/actions/payments"
import { SubscriptionOnboardingClient } from "./subscription-onboarding-client"

interface AbonnementPageProps {
    searchParams: Promise<{
        success?: string
        canceled?: string
        session_id?: string
    }>
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AbonnementPage({ searchParams }: AbonnementPageProps) {
    await requireRole(["CLIENT"])

    const params = await searchParams
    let flashMessage: { type: "success" | "error" | "info"; text: string } | null = null

    if (params.success && params.session_id) {
        const result = await confirmStripeSubscriptionPayment(params.session_id)
        if (result.success) {
            redirect("/dashboard")
        }
        flashMessage = {
            type: "error",
            text: result.error || "Le paiement Stripe n'a pas pu être confirmé automatiquement.",
        }
    }

    if (params.canceled) {
        flashMessage = {
            type: "info",
            text: "Le paiement Stripe a été annulé. Vous pouvez reprendre quand vous le souhaitez.",
        }
    }

    const data = await getSubscriptionOnboardingData()
    if (!data) {
        redirect("/login")
    }

    if (data.hasAccess) {
        redirect("/dashboard")
    }

    return <SubscriptionOnboardingClient data={data} flashMessage={flashMessage} />
}