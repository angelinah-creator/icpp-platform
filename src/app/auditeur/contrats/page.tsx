import { requireRole } from "@/lib/auth-helpers"
import { getAuditeurContracts } from "@/server/actions/contracts"

export default async function AuditeurContractsPage() {
    await requireRole(["AUDITOR", "COMMERCIAL"])
    const contracts = await getAuditeurContracts()

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Contrats clients</h1>
                <p className="text-sm text-slate-500">Contrats des entreprises suivies.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Contrat</th>
                            <th className="px-4 py-3">Entreprise</th>
                            <th className="px-4 py-3">Statut</th>
                            <th className="px-4 py-3">Date signature</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map((contract) => (
                            <tr key={contract.id} className="border-t border-slate-100">
                                <td className="px-4 py-3 font-medium text-slate-900">{contract.numeroContrat}</td>
                                <td className="px-4 py-3 text-slate-700">{contract.companyName}</td>
                                <td className="px-4 py-3">
                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${contract.signedAt ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                        {contract.signedAt ? "Signe" : "A signer"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{contract.signedAt ? new Date(contract.signedAt).toLocaleDateString("fr-FR") : "-"}</td>
                                <td className="px-4 py-3">
                                    <a href={`/api/contracts/${contract.id}/download`} className="text-[#2048BF] hover:underline">
                                        Telecharger
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {contracts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Aucun contrat disponible.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
