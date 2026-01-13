import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
}

/**
 * Empty state placeholder
 * Figma: Common/EmptyState
 */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            {Icon && <Icon className="mb-4 h-12 w-12 text-gray-400" />}
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="mb-6 max-w-sm text-sm text-gray-600">{description}</p>
            {action && <Button onClick={action.onClick}>{action.label}</Button>}
        </div>
    )
}
