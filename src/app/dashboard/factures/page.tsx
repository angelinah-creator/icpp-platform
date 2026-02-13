import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Shield, CheckCircle2, FileText, CreditCard, Download, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Invoice {
    id: string
    date: string
    type: string
    amount: number
    status: "paid" | "pending"
}

async function getFacturesData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            company: {
                include: {
                    subscription: {
                        include: {
                            plan: true
                        }
                    }
                }
            }
        }
    })

    if (!user?.company) return null

    const subscription = user.company.subscription

    // Mock invoice data
    const invoices: Invoice[] = [
        {
            id: "1",
            date: "01/01/2026",
            type: "Abonnement mensuel",
            amount: 49,
            status: "paid"
        }
    ]

    const stats = {
        successfulPayments: invoices.filter(i => i.status === "paid").length,
        totalInvoices: invoices.length,
        totalPaid: invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
    }

    return {
        subscription: {
            plan: subscription?.plan?.nom || "Premium",
            price: subscription?.plan?.prixMensuel || 4900,
            nextBilling: "N/A",
            status: subscription?.status || "ACTIVE"
        },
        invoices,
        stats
    }
}

function StatCard({ icon: Icon, value, label, color }: { icon: React.ElementType, value: string | number, label: string, color: "green" | "blue" | "orange" }) {
    const colors = {
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        orange: "bg-orange-50 text-orange-600"
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-2xl font-semibold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </div>
    )
}

export default async function FacturesPage() {
    const data = await getFacturesData()
    if (!data) redirect("/login")

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <h1 className="text-2xl font-semibold text-slate-900">Factures & Abonnement</h1>
                <p className="text-slate-500 text-sm mt-0.5">Gérez votre abonnement et consultez vos factures</p>
            </div>

            <div className="p-6">
                {/* Subscription Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-lg font-semibold text-slate-900">Abonnement {data.subscription.plan}</h2>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                    Actif
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                                {Math.round(data.subscription.price / 100)}€/mois • Prochaine facturation le {data.subscription.nextBilling}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            Changer de plan
                        </Button>
                        <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Mettre à jour la carte
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard
                        icon={CheckCircle2}
                        value={data.stats.successfulPayments}
                        label="Paiements réussis"
                        color="green"
                    />
                    <StatCard
                        icon={FileText}
                        value={data.stats.totalInvoices}
                        label="Factures totales"
                        color="blue"
                    />
                    <StatCard
                        icon={CreditCard}
                        value={`${data.stats.totalPaid}€`}
                        label="Total payé"
                        color="orange"
                    />
                </div>

                {/* Invoices Table */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Historique des factures</h2>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Montant</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {data.invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-slate-900">{invoice.date}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-600">{invoice.type}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-900">{invoice.amount}€</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span className="text-green-600 font-medium">Payé</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Télécharger
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">Besoin d'aide ?</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Pour toute question concernant votre facturation ou votre abonnement, contactez notre équipe support à{" "}
                                <a href="mailto:support@icpp.fr" className="text-blue-600 hover:underline">
                                    support@icpp.fr
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
