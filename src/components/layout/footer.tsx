import Link from "next/link"

/**
 * Footer with links
 */
export function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Company */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">ICPP Platform</h3>
                        <p className="text-sm text-gray-600">
                            Conformité DUERP simplifiée pour les TPE
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Produit</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/features" className="text-gray-600 hover:text-gray-900">
                                    Fonctionnalités
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                                    Tarifs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Légal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/legal/cgu" className="text-gray-600 hover:text-gray-900">
                                    CGU
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/cgv" className="text-gray-600 hover:text-gray-900">
                                    CGV
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="text-gray-600 hover:text-gray-900">
                                    Confidentialité
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>contact@icpp-platform.fr</li>
                            <li>+33 1 23 45 67 89</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} ICPP Platform. Tous droits réservés.
                </div>
            </div>
        </footer>
    )
}
