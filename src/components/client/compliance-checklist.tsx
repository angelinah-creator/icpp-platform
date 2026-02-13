import { CheckCircle2, AlertCircle, Clock } from "lucide-react"

export interface ComplianceItem {
    label: string
    status: "completed" | "warning" | "pending"
    date?: string
    daysRemaining?: number
}

interface ComplianceChecklistProps {
    items: ComplianceItem[]
}

export function ComplianceChecklist({ items }: ComplianceChecklistProps) {
    const getIcon = (status: ComplianceItem["status"]) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />
            case "warning":
                return <AlertCircle className="h-5 w-5 text-orange-500" />
            case "pending":
                return <Clock className="h-5 w-5 text-slate-400" />
        }
    }

    const getStatusText = (item: ComplianceItem) => {
        if (item.status === "completed" && item.date) {
            return item.date
        }
        if (item.status === "warning" && item.daysRemaining) {
            return `Dans ${item.daysRemaining}j`
        }
        return ""
    }

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                    <div className="flex items-center gap-3">
                        {getIcon(item.status)}
                        <span className="text-sm font-medium text-slate-900">{item.label}</span>
                    </div>
                    {getStatusText(item) && (
                        <span className="text-sm text-slate-500">{getStatusText(item)}</span>
                    )}
                </div>
            ))}
        </div>
    )
}
