import { TrendingUp } from "lucide-react"
import Image from "next/image"
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
            image: "/assets/images/entreprises accompagnés icon.png",
            color: "bg-blue-50 text-blue-700",
            iconBg: "bg-blue-100",
        },
        {
            title: "Abonnements actifs",
            value: stats.activeSubscriptions,
            trend: "+12% vs mois dernier",
            image: "/assets/images/abonnements actifs icon.png",
            color: "bg-green-50 text-green-700",
            iconBg: "bg-green-100",
        },
        {
            title: "Audits réalisés",
            value: stats.completedAudits,
            trend: "+12% vs mois dernier",
            image: "/assets/images/audits réalisés icon.png",
            color: "bg-white border text-slate-700",
            iconBg: "bg-slate-100",
        },
        {
            title: "DUERP en cours/validés",
            value: stats.duerpCount,
            trend: "+12% vs mois dernier",
            image: "/assets/images/DUERP en coursvalidés icon.png",
            color: "bg-indigo-50 text-indigo-700",
            iconBg: "bg-indigo-100",
        },
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                return (
                    <Card key={index} className={cn("border-none shadow-sm", card.color)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium opacity-80">
                                {card.title}
                            </CardTitle>
                            <div className="relative h-5 w-5 shrink-0">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-contain"
                                />
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
