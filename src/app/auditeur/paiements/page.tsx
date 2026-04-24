import { getCurrentUser } from "@/lib/auth-helpers"
import { getPaymentsForCurrentUser } from "@/server/actions/payments"
import { PaymentManagementBoard } from "@/components/payments/payment-management-board"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AuditeurPaiementsPage() {
    const [user, payments] = await Promise.all([
        getCurrentUser(),
        getPaymentsForCurrentUser(),
    ])

    const currentRole = user?.role === "COMMERCIAL" ? "COMMERCIAL" : "AUDITOR"

    return (
        <PaymentManagementBoard
            payments={payments}
            title="Paiements clients"
            subtitle="Suivez les paiements Stripe confirmés de votre portefeuille client et accédez aux tickets de règlement."
            currentRole={currentRole}
            currentUserId={user?.id}
        />
    )
}