"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock, ArrowRight, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction } from "@/server/actions/auth"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await registerAction(formData)
            if (result?.error) {
                setError(result.error)
                setIsLoading(false)
            }
            // If successful, redirect happens server-side
        } catch (err) {
            if (err && typeof err === "object" && "digest" in err) {
                // Redirect — not an actual error
                return
            }
            setError("Une erreur est survenue lors de l'inscription")
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Register Form */}
            <div className="flex w-full items-start justify-center bg-white px-6 py-8 lg:w-1/2 lg:items-center lg:px-16">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo */}
                    <div className="flex items-center gap-4 w-fit mb-6">
                        <Image
                            src="/logo.png"
                            alt="Logo ICPP"
                            width={48}
                            height={48}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                        <div className="leading-tight">
                            <p className="text-2xl font-black tracking-tight text-blue-600">ICPP <span className="text-sky-400">Conformité</span></p>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Inscrivez votre entreprise sur la plateforme ICPP
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Nom complet</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Jean Dupont"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Company */}
                        <div className="space-y-1.5">
                            <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    placeholder="Ma Société SAS"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* SIRET */}
                        <div className="space-y-1.5">
                            <Label htmlFor="siret">
                                SIRET <span className="text-gray-400 font-normal">(optionnel)</span>
                            </Label>
                            <Input
                                id="siret"
                                name="siret"
                                type="text"
                                placeholder="12345678901234"
                                maxLength={14}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email professionnel</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="vous@societe.fr"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Au moins 6 caractères"
                                    required
                                    minLength={6}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                        >
                            {isLoading ? (
                                "Création du compte..."
                            ) : (
                                <>
                                    Créer mon compte
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Vous avez déjà un compte ?{" "}
                            <Link href="/login" className="font-medium text-blue-600 hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Panel */}
            <div className="hidden w-1/2 bg-gradient-to-br from-[#2048BF] to-[#679CFF] lg:flex lg:items-center lg:justify-center lg:px-16">
                <div className="max-w-lg space-y-6 text-white">
                    <h2 className="text-4xl font-bold leading-tight">
                        Simplifiez votre conformité
                    </h2>
                    <p className="text-lg text-blue-100">
                        Rejoignez les entreprises qui font confiance à ICPP pour gérer leur DUERP et leurs obligations légales.
                    </p>
                    <ul className="space-y-3">
                        {[
                            "DUERP élaboré avec l'accompagnement ICPP",
                            "Gestion simplifiée des obligations réglementaires",
                            "Rappels automatiques de mise à jour",
                            "Support dédié et réactif",
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                                    ✓
                                </span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
