import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"

interface QuickActionCardProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
}

export function QuickActionCard({ title, description, icon: Icon, href }: QuickActionCardProps) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-xl bg-white border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </Link>
    )
}
