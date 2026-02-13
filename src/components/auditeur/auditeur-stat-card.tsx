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
        <div className={`rounded-xl border p-5 ${highlighted
            ? "bg-[#EFF6FF] border-blue-100"
            : "bg-white border-slate-200"
            }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${highlighted ? "text-slate-700" : "text-slate-500"}`}>{title}</p>
                    <p className="text-3xl font-bold text-slate-900">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${highlighted ? "bg-white" : "bg-slate-50"}`}>
                    {icon}
                </div>
            </div>
            <p className={`text-xs font-medium ${highlighted ? "text-blue-600" : "text-green-600"}`}>
                {change}
            </p>
        </div>
    )
}
