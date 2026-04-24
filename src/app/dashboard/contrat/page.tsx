import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-helpers"
import { getClientContractForSigning } from "@/server/actions/contracts"
import { ContratSignatureClient } from "./contrat-signature-client"

export default async function ContratPage() {
    await requireRole(["CLIENT"])

    const contract = await getClientContractForSigning()
    if (!contract) {
        redirect("/dashboard")
    }

    return (
        <div className="p-4 sm:p-6">
            <ContratSignatureClient contract={contract} />
        </div>
    )
}
