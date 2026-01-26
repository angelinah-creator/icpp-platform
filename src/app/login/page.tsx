"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginAction } from "@/server/actions/auth"

type UserRole = "client" | "auditeur" | "administrateur"

const roleContent = {
    client: {
        title: "Simplifiez votre conformité",
        subtitle:
            "Gérez votre DUERP et vos obligations légales en toute simplicité. Plus de stress, plus d'oubli.",
        features: [
            "DUERP élaboré avec l'accompagnement ICPP",
            "Rappels de mise à jour",
            "Support dédié",
        ],
    },
    auditeur: {
        title: "Simplifiez votre conformité",
        subtitle:
            "Gérez votre DUERP et vos obligations légales en toute simplicité. Plus de stress, plus d'oubli.",
        features: [
            "Accompagnement DUERP par des auditeurs ICPP",
            "Rappels de mise à jour",
            "Support dédié",
        ],
    },
    administrateur: {
        title: "Gérez et supervisez la conformité ICPP",
        subtitle:
            "L'interface administrative dédiée au pilotage des dossiers clients, au suivi des abonnements et à la conformité réglementaire. Assurez la qualité des DUERP, le contrôle des auditeurs et la protection juridique d'ICPP.",
        features: [
            "Gestion des dossiers clients",
            "Contrôle qualité des DUERP",
            "Suivi des attestations ICPP",
            "Gestion des abonnements",
            "Signalements & mises à jour",
        ],
    },
}

export default function LoginPage() {
    const [activeRole, setActiveRole] = useState<UserRole>("client")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const result = await loginAction({ email, password })
            if (result?.error) {
                setError(result.error)
            }
            // Redirection will happen in the server action
        } catch (err) {
            setError("Une erreur est survenue lors de la connexion")
        } finally {
            setIsLoading(false)
        }
    }

    const content = roleContent[activeRole]

    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Login Form */}
            <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo & Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10">
                                <Image
                                    src="/logo-icpp.png"
                                    alt="ICPP Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-blue-600">
                                    ICPP Conformité
                                </h1>
                                <p className="text-xs text-gray-600">
                                    Institut de Conformité et de Prévention Professionnelle
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Bienvenue sur la plateforme ICPP
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Connectez-vous à votre espace
                            </p>
                        </div>
                    </div>

                    {/* Role Tabs */}
                    <Tabs
                        value={activeRole}
                        onValueChange={(value) => setActiveRole(value as UserRole)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                            <TabsTrigger
                                value="client"
                                className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                            >
                                Espace Client
                            </TabsTrigger>
                            <TabsTrigger
                                value="auditeur"
                                className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                            >
                                Auditeur
                            </TabsTrigger>
                            <TabsTrigger
                                value="administrateur"
                                className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900"
                            >
                                Administrateur
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="vous@exemple.fr"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Mot de passe
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••••"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? (
                                "Connexion..."
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-600">
                            Pas encore de compte ?{" "}
                            <Link href="/register" className="font-medium text-blue-600 hover:underline">
                                Créer un compte
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Panel - Dynamic Content */}
            <div className="hidden w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 lg:flex lg:items-center lg:justify-center lg:px-16">
                <div className="max-w-lg space-y-8 text-white">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">
                            {content.title}
                        </h2>
                        <p className="text-lg text-blue-100">{content.subtitle}</p>
                    </div>

                    <ul className="space-y-4">
                        {content.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-blue-200" />
                                <span className="text-base">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
