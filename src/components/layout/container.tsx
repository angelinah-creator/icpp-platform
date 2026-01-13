import { cn } from "@/lib/utils"

interface ContainerProps {
    children: React.ReactNode
    className?: string
}

/**
 * Responsive container with max-width
 * Usage: <Container>content</Container>
 */
export function Container({ children, className }: ContainerProps) {
    return (
        <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}>
            {children}
        </div>
    )
}
