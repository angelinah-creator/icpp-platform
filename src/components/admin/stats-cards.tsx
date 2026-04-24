import { TrendingUp, Building2, CreditCard, ClipboardCheck, FileBarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
    stats: {
        totalCompanies: number
        activeSubscriptions: number
        completedAudits: number
        duerpCount: number
    }
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Entreprises accompagnées",
            value: stats.totalCompanies,
            trend: "+12% vs mois dernier",
            icon: Building2,
            color: "bg-blue-50 text-blue-700",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
        },
        {
            title: "Abonnements actifs",
            value: stats.activeSubscriptions,
            trend: "+12% vs mois dernier",
            icon: CreditCard,
            color: "bg-green-50 text-green-700",
            iconColor: "text-green-600",
            iconBg: "bg-green-100",
        },
        {
            title: "Audits réalisés",
            value: stats.completedAudits,
            trend: "+12% vs mois dernier",
            icon: ClipboardCheck,
            color: "bg-white border text-slate-700",
            iconColor: "text-slate-600",
            iconBg: "bg-slate-100",
        },
        {
            title: "DUERP en cours/validés",
            value: stats.duerpCount,
            trend: "+12% vs mois dernier",
            icon: FileBarChart,
            color: "bg-indigo-50 text-indigo-700",
            iconColor: "text-indigo-600",
            iconBg: "bg-indigo-100",
        },
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <Card key={index} className={cn("border-none shadow-sm group hover:-translate-y-1 hover:shadow-md transition-all duration-300", card.color)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-80">
                                {card.title}
                            </CardTitle>
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300", card.iconBg)}>
                                <Icon className={cn("h-4 w-4", card.iconColor)} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{card.value}</div>
                            <div className="mt-2 flex items-center text-xs font-medium text-green-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {card.trend}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
