"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createCustomerPortalSession } from "@/server/actions/stripe"

interface PortalButtonProps {
    variant?: "default" | "outline-white"
    label?: string
    icon?: "card" | "external"
}

export default function PortalButton({
    variant = "default",
    label = "Gérer mon abonnement",
    icon = "external",
}: PortalButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleClick() {
        startTransition(async () => {
            const result = await createCustomerPortalSession()
            if (typeof result === "string") {
                window.location.href = result
            }
        })
    }

    if (variant === "outline-white") {
        return (
            <button
                onClick={handleClick}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 transition-all disabled:opacity-60"
            >
                {icon === "card" ? (
                    <CreditCard className="h-4 w-4" />
                ) : (
                    <ExternalLink className="h-4 w-4" />
                )}
                {isPending ? "Redirection..." : label}
            </button>
        )
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={isPending}
            className="gap-2"
        >
            <ExternalLink className="h-4 w-4" />
            {isPending ? "Redirection..." : label}
        </Button>
    )
}
