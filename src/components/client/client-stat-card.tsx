import { LucideIcon } from "lucide-react"

interface ClientStatCardProps {
    title: string
    value: string | number
    subtitle: string
    icon: LucideIcon
    variant: "green" | "blue" | "purple" | "cyan"
}

export function ClientStatCard({ title, value, subtitle, icon: Icon, variant }: ClientStatCardProps) {
    const variantStyles = {
        green: "bg-green-50 border-green-200 text-green-700",
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        purple: "bg-purple-50 border-purple-200 text-purple-700",
        cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
    }

    const iconStyles = {
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        cyan: "bg-cyan-100 text-cyan-600",
    }

    return (
        <div className={`rounded-xl border-2 p-6 ${variantStyles[variant]}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold mb-1">{value}</p>
                    <p className="text-sm font-medium">{subtitle}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    )
}
