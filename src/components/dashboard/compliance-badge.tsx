import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

type ComplianceStatus = "conforme" | "partiel" | "non-conforme"

interface ComplianceBadgeProps {
    status: ComplianceStatus
}

/**
 * Badge showing compliance status
 * Figma: Dashboard/ComplianceBadge
 */
export function ComplianceBadge({ status }: ComplianceBadgeProps) {
    const config = {
        conforme: {
            label: "Conforme",
            icon: CheckCircle2,
            variant: "default" as const,
            className: "bg-green-100 text-green-800 hover:bg-green-100",
        },
        partiel: {
            label: "Partiellement conforme",
            icon: AlertCircle,
            variant: "secondary" as const,
            className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        },
        "non-conforme": {
            label: "Non conforme",
            icon: XCircle,
            variant: "destructive" as const,
            className: "bg-red-100 text-red-800 hover:bg-red-100",
        },
    }

    const { label, icon: Icon, variant, className } = config[status]

    return (
        <Badge variant={variant} className={className}>
            <Icon className="mr-1 h-3 w-3" />
            {label}
        </Badge>
    )
}
