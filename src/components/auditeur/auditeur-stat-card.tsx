"use client"

interface StatCardProps {
    title: string
    value: number
    change: string
    icon: React.ReactNode
    highlighted?: boolean
}

export function AuditeurStatCard({ title, value, change, icon, highlighted = false }: StatCardProps) {
    return (
        <div className={`rounded-lg border p-5 ${highlighted
                ? "bg-[#F0F6E8] border-[#E5F0D8]"
                : "bg-white border-slate-200"
            }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
            </div>
            <p className={`text-xs ${highlighted ? "text-green-600 font-medium" : "text-green-600"}`}>
                {change}
            </p>
        </div>
    )
}
