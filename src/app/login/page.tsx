"use client"

import { useState } from "react"
import { loginAction } from "@/server/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const result = await loginAction(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Login Form */}
            <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8">
                        <Image
                            src="/logo-icpp.png"
                            alt="ICPP"
                            width={120}
                            height={40}
                            priority
                        />
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Bienvenue</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Connectez-vous à votre espace
                        </p>
                    </div>

                    {/* Tabs removed - can be re-enabled if client validates */}

                    {/* Login Form */}
                    <form action={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nom@entreprise.fr"
                                required
                                className="h-12"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="h-12"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button type="submit" className="h-12 w-full" size="lg" disabled={isLoading}>
                            {isLoading ? "Connexion..." : "Se connecter →"}
                        </Button>
                    </form>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="font-medium text-blue-600 hover:underline">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel - Benefits */}
            <div className="hidden bg-gradient-to-br from-blue-600 to-blue-700 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16 lg:text-white">
                <div className="mx-auto max-w-lg">
                    <h2 className="mb-6 text-4xl font-bold">
                        Simplifiez votre conformité
                    </h2>
                    <p className="mb-8 text-lg text-blue-100">
                        Gérez votre DUERP et vos obligations légales en toute simplicité.
                        Plus de stress, plus d&apos;oubli.
                    </p>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-blue-200" />
                            <span className="text-blue-50">
                                DUERP généré automatiquement
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-blue-200" />
                            <span className="text-blue-50">Rappels de mise à jour</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-blue-200" />
                            <span className="text-blue-50">Support dédié</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
