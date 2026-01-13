import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Main navigation bar
 * Adapts based on user authentication status
 */
export function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-md bg-primary" />
                    <span className="text-xl font-bold">INCP</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center space-x-6 md:flex">
                    <Link href="/features" className="text-sm font-medium hover:text-primary">
                        Fonctionnalités
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium hover:text-primary">
                        Tarifs
                    </Link>
                    <Link href="/contact" className="text-sm font-medium hover:text-primary">
                        Contact
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost">Connexion</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Essai gratuit</Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
