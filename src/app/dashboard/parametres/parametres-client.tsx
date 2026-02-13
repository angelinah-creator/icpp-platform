"use client"

import { useState, useEffect } from "react"
import { Lock, CreditCard, Bell, User, Save, Check } from "lucide-react"
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
        <div className="min-h-screen bg-slate-50">
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
    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Mon abonnement</h2>

            <div className="bg-blue-50 rounded-lg p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-900">
                        {profile.planName || "Plan Standard"}
                    </h3>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {profile.planStatus === "ACTIVE" ? "Actif" : profile.planStatus || "Actif"}
                    </Badge>
                </div>
                <p className="text-sm text-slate-600">
                    Pour toute question concernant votre abonnement, contactez votre référent ICPP.
                </p>
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
