import { requireRole } from "@/lib/auth-helpers"
import { getPaymentsForCurrentUser } from "@/server/actions/payments"
import { PaymentManagementBoard } from "@/components/payments/payment-management-board"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPaiementsPage() {
    await requireRole(["ADMIN"])

    const payments = await getPaymentsForCurrentUser()

    return (
        <PaymentManagementBoard
            payments={payments}
            title="Paiements d’abonnement"
            subtitle="Suivi global des paiements Stripe et historique des transactions, validation des tickets clients."
            currentRole="ADMIN"
        />
    )
}