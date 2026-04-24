"use client"

import { useState, useEffect } from "react"
import { Lock, CreditCard, Bell, User, Save, Check, ExternalLink, Loader2 } from "lucide-react"
import { createCheckoutSession, createCustomerPortalSession } from "@/server/actions/stripe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface ProfileData {
    userName: string
    userEmail: string
    userPhone: string | null
    companyName: string
    companySiret: string | null
    companyAddress: string
    companyCity: string
    planName: string | null
    planStatus: string | null
    customPrice: number | null
    proposedPrice: number | null
    stripeCustomerId: string | null
}

type Tab = "securite" | "abonnement" | "notifications" | "compte"

export default function ParametresClient({ profile }: { profile: ProfileData }) {
    const [activeTab, setActiveTab] = useState<Tab>("securite")

    const tabs = [
        { id: "securite" as Tab, label: "Sécurité", icon: Lock },
        { id: "abonnement" as Tab, label: "Abonnement", icon: CreditCard },
        { id: "notifications" as Tab, label: "Notifications", icon: Bell },
        { id: "compte" as Tab, label: "Compte", icon: User }
    ]

    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
                <p className="text-slate-500 text-sm mt-0.5">Gérez les paramètres de votre compte</p>
            </div>

            <div className="p-6">
                <div className="flex gap-2 mb-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-white border border-slate-200 text-slate-900"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    {activeTab === "securite" && <SecurityTab />}
                    {activeTab === "abonnement" && <AbonnementTab profile={profile} />}
                    {activeTab === "notifications" && <NotificationsTab />}
                    {activeTab === "compte" && <CompteTab profile={profile} />}
                </div>
            </div>
        </div>
    )
}

function SecurityTab() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

    async function handleSubmit() {
        setMessage(null)
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: "error", text: "Veuillez remplir tous les champs" })
            return
        }
        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 6 caractères" })
            return
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" })
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/profile/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json()
            if (data.error) {
                setMessage({ type: "error", text: data.error })
            } else {
                setMessage({ type: "success", text: "Mot de passe modifié avec succès" })
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
        } catch {
            setMessage({ type: "error", text: "Erreur réseau" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Changer le mot de passe</h2>
            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                </div>
            )}
            <div className="space-y-4 max-w-md">
                <div>
                    <Label htmlFor="current-password" className="text-sm font-medium text-slate-900">
                        Mot de passe actuel
                    </Label>
                    <Input
                        id="current-password"
                        type="password"
                        className="mt-1"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="new-password" className="text-sm font-medium text-slate-900">
                        Nouveau mot de passe
                    </Label>
                    <Input
                        id="new-password"
                        type="password"
                        className="mt-1"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-900">
                        Confirmer le mot de passe
                    </Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        className="mt-1"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
            </div>
        </div>
    )
}

function AbonnementTab({ profile }: { profile: ProfileData }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCheckout(planCode: string) {
        setLoading(true)
        try {
            const result = await createCheckoutSession(planCode)
            if (typeof result === 'object') {
                alert(result.error)
                return
            }
            window.location.href = result
        } catch {
            alert("Erreur lors de l'initialisation du paiement")
        } finally {
            setLoading(false)
        }
    }

    async function handlePortal() {
        setLoading(true)
        try {
            const result = await createCustomerPortalSession()
            if (typeof result === 'object') {
                alert(result.error)
                return
            }
            window.location.href = result
        } catch {
            alert("Erreur lors de l'accès au portail de gestion")
        } finally {
            setLoading(false)
        }
    }

    const isSubscribed = profile.planStatus === "ACTIVE" || profile.planStatus === "TRIALING"

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Mon abonnement</h2>
                    <p className="text-sm text-slate-500">Gérez votre offre et vos factures</p>
                </div>
                {isSubscribed && profile.stripeCustomerId && (
                    <Button variant="outline" size="sm" onClick={handlePortal} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                        Gérer sur Stripe
                    </Button>
                )}
            </div>

            <div className={`rounded-xl p-6 border ${isSubscribed ? "bg-blue-50 border-blue-100" : "bg-white border-slate-200"}`}>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <Badge className={`mb-2 ${isSubscribed ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                            PACK ACTUEL
                        </Badge>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {profile.planName || "Aucun abonnementactif"}
                        </h3>
                        <p className="text-slate-600 mt-1">
                            Statut : <span className={`font-medium ${isSubscribed ? "text-green-600" : "text-red-500"}`}>
                                {profile.planStatus === "ACTIVE" ? "Actif" : profile.planStatus === "SUSPENDED" ? "Suspendu" : "Inactif"}
                            </span>
                        </p>
                    </div>
                    {!isSubscribed && (
                        <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">
                                {profile.proposedPrice ? "Offre spéciale" : "À partir de"}
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {profile.proposedPrice ? (profile.proposedPrice / 100).toFixed(2) : "19"}€
                                <span className="text-sm font-normal text-slate-500">/mois</span>
                            </p>
                            {profile.proposedPrice && (
                                <p className="text-xs text-blue-600 font-medium mt-1 italic">
                                    Prix proposé suite à l'audit
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {isSubscribed && profile.customPrice && (
                    <div className="mb-6 p-4 bg-white/50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800 font-medium">Prix personnalisé actif :</p>
                        <p className="text-xl font-bold text-slate-900">
                            {(profile.customPrice / 100).toFixed(2)}€ <span className="text-sm font-normal text-slate-500">/mois</span>
                        </p>
                    </div>
                )}

                {!isSubscribed || (isSubscribed && !profile.stripeCustomerId) ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            {/* Si un plan est déjà assigné (ex: PRO pour test), on ne montre que celui-là */}
                            {profile.planName ? (
                                <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50/30">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{profile.planName}</h4>
                                            <p className="text-sm text-slate-500 italic">Votre pack sélectionné</p>
                                        </div>
                                        <Badge className="bg-blue-600 text-white font-bold">PROPOSÉ</Badge>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-3xl font-extrabold text-slate-900">
                                            {profile.customPrice ? (profile.customPrice / 100).toFixed(2) : profile.planName === "PRO" ? "39" : profile.planName === "PREMIUM" ? "79" : "19"}€
                                            <span className="text-base font-normal text-slate-500 ml-1">/mois</span>
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-md"
                                        onClick={() => handleCheckout(profile.planName!)}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                                        Payer mon abonnement
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                    {["ESSENTIEL", "PRO", "PREMIUM"].map((plan) => (
                                        <div key={plan} className="border border-slate-200 rounded-lg p-4 bg-white hover:border-blue-300 transition-colors">
                                            <h4 className="font-semibold text-slate-900">{plan}</h4>
                                            <p className="text-xs text-slate-500 mb-4">Plan {plan.toLowerCase()}</p>
                                            <Button
                                                className="w-full h-8 text-xs"
                                                variant={plan === "ESSENTIEL" ? "default" : "outline"}
                                                onClick={() => handleCheckout(plan)}
                                                disabled={loading}
                                            >
                                                {profile.proposedPrice ? "Accepter l'offre" : "Souscrire"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 italic">
                            * Le paiement sécurisé est opéré par Stripe. Une fois le paiement validé, vos accès seront automatiquement activés.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100/50 p-3 rounded-lg">
                            <Check className="h-4 w-4" />
                            Votre abonnement est géré automatiquement via Stripe.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function NotificationsTab() {
    const [prefs, setPrefs] = useState({
        emailNotifs: true,
        duerpReminders: true,
        newsletter: false,
    })

    function toggle(key: keyof typeof prefs) {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Préférences de notifications</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                        <p className="font-medium text-slate-900">Notifications par email</p>
                        <p className="text-sm text-slate-500">Recevoir les alertes importantes par email</p>
                    </div>
                    <button
                        onClick={() => toggle("emailNotifs")}
                        className={`w-10 h-6 rounded-full transition-colors ${prefs.emailNotifs ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${prefs.emailNotifs ? "translate-x-4" : ""}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                        <p className="font-medium text-slate-900">Rappels DUERP</p>
                        <p className="text-sm text-slate-500">Recevoir des rappels pour mettre à jour votre DUERP</p>
                    </div>
                    <button
                        onClick={() => toggle("duerpReminders")}
                        className={`w-10 h-6 rounded-full transition-colors ${prefs.duerpReminders ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${prefs.duerpReminders ? "translate-x-4" : ""}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                        <p className="font-medium text-slate-900">Newsletter ICPP</p>
                        <p className="text-sm text-slate-500">Recevoir les actualités et conseils conformité</p>
                    </div>
                    <button
                        onClick={() => toggle("newsletter")}
                        className={`w-10 h-6 rounded-full transition-colors ${prefs.newsletter ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${prefs.newsletter ? "translate-x-4" : ""}`} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function CompteTab({ profile }: { profile: ProfileData }) {
    const router = useRouter()
    const [form, setForm] = useState({
        name: profile.userName,
        email: profile.userEmail,
        phone: profile.userPhone || "",
        companyName: profile.companyName,
        companySiret: profile.companySiret || "",
        companyAddress: profile.companyAddress,
        companyCity: profile.companyCity,
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

    async function handleSubmit() {
        setLoading(true)
        setMessage(null)
        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (data.error) {
                setMessage({ type: "error", text: data.error })
            } else {
                setMessage({ type: "success", text: "Informations mises à jour" })
                router.refresh()
            }
        } catch {
            setMessage({ type: "error", text: "Erreur réseau" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations du compte</h2>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Entreprise</h3>
                <div className="space-y-3">
                    <div>
                        <Label className="text-sm text-slate-600">Nom de l'entreprise</Label>
                        <Input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                        <Label className="text-sm text-slate-600">SIRET</Label>
                        <Input value={form.companySiret} onChange={e => setForm({ ...form, companySiret: e.target.value })} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-slate-600">Adresse</Label>
                            <Input value={form.companyAddress} onChange={e => setForm({ ...form, companyAddress: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                            <Label className="text-sm text-slate-600">Ville</Label>
                            <Input value={form.companyCity} onChange={e => setForm({ ...form, companyCity: e.target.value })} className="mt-1" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Mon profil</h3>
                <div className="space-y-3">
                    <div>
                        <Label className="text-sm text-slate-600">Nom complet</Label>
                        <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                        <Label className="text-sm text-slate-600">Email</Label>
                        <Input value={form.email} disabled className="mt-1 bg-slate-50" type="email" />
                    </div>
                    <div>
                        <Label className="text-sm text-slate-600">Téléphone</Label>
                        <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1" type="tel" />
                    </div>
                </div>
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
        </div>
    )
}
