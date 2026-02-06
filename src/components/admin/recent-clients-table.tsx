import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Client {
    id: string
    name: string
    email: string
    activity: string
    subscription: "Premium" | "Essentiel" | "Pro" | "Gratuit"
    status: "Conforme" | "Partiellement conforme" | "Non conforme"
    duerpStatus: "A jour" | "En cours" | "A faire"
}

interface RecentClientsTableProps {
    clients: Client[]
}

export function RecentClientsTable({ clients }: RecentClientsTableProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
                <CardTitle className="text-lg font-bold">Clients récents</CardTitle>
                <Link
                    href="/admin/users"
                    className="text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    Voir tous
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="bg-slate-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50">
                                <th className="h-12 px-6 align-middle font-medium text-slate-500">
                                    Entreprises
                                </th>
                                <th className="h-12 px-6 align-middle font-medium text-slate-500">
                                    Activité
                                </th>
                                <th className="h-12 px-6 align-middle font-medium text-slate-500">
                                    Abonnement
                                </th>
                                <th className="h-12 px-6 align-middle font-medium text-slate-500">
                                    Statut
                                </th>
                                <th className="h-12 px-6 align-middle font-medium text-slate-500">
                                    DUERP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {clients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="border-b transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50"
                                >
                                    <td className="p-6 align-middle">
                                        <div className="font-bold text-slate-900">{client.name}</div>
                                        <div className="text-xs text-slate-500">{client.email}</div>
                                    </td>
                                    <td className="p-6 align-middle">{client.activity}</td>
                                    <td className="p-6 align-middle">
                                        <span className="font-semibold">{client.subscription}</span>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <Badge
                                            className={cn(
                                                "rounded-full px-3 py-1 font-medium border-none shadow-none",
                                                client.status === "Conforme" && "bg-green-100 text-green-700 hover:bg-green-100",
                                                client.status === "Partiellement conforme" && "bg-orange-100 text-orange-700 hover:bg-orange-100",
                                                client.status === "Non conforme" && "bg-red-100 text-red-700 hover:bg-red-100"
                                            )}
                                        >
                                            {client.status}
                                        </Badge>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <Badge
                                            className={cn(
                                                "rounded-full px-3 py-1 font-medium border-none shadow-none",
                                                client.duerpStatus === "A jour" && "bg-green-100 text-green-700 hover:bg-green-100",
                                                client.duerpStatus === "En cours" && "bg-orange-100 text-orange-700 hover:bg-orange-100",
                                                client.duerpStatus === "A faire" && "bg-red-100 text-red-700 hover:bg-red-100"
                                            )}
                                        >
                                            {client.duerpStatus}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
