import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    variant?: "default" | "success" | "warning" | "danger"
}

/**
 * Statistics card for dashboard
 * Figma: Dashboard/StatsCard
 */
export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    variant = "default",
}: StatsCardProps) {
    const variantStyles = {
        default: "bg-white",
        success: "bg-green-50 border-green-200",
        warning: "bg-yellow-50 border-yellow-200",
        danger: "bg-red-50 border-red-200",
    }

    return (
        <Card className={cn(variantStyles[variant])}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
                {trend && (
                    <div className={cn("mt-2 text-xs", trend.isPositive ? "text-green-600" : "text-red-600")}>
                        {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
