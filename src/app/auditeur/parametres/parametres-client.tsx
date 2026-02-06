"use client"

import { useState } from "react"
import { Search, Bell, User, BellRing, Lock, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type Tab = "profil" | "notifications" | "securite"

interface UserProfile {
    prenom: string
    nom: string
    telephone: string
    email: string
}

export function ParametresClient() {
    const [activeTab, setActiveTab] = useState<Tab>("profil")

    // Profil state
    const [profile, setProfile] = useState<UserProfile>({
        prenom: "Pierre",
        nom: "Durand",
        telephone: "01 23 45 67 89",
        email: "pierre.durand@icpp.fr"
    })

    // Notifications state
    const [notifications, setNotifications] = useState({
        nouveauxSignalements: true,
        nouvellesTaches: false,
        rappelsEcheances: true,
        notificationsPush: true
    })

    // Sécurité state
    const [passwords, setPasswords] = useState({
        actuel: "",
        nouveau: "",
        confirmer: ""
    })

    const tabs = [
        { id: "profil" as Tab, label: "Profil", icon: User },
        { id: "notifications" as Tab, label: "Notifications", icon: BellRing },
        { id: "securite" as Tab, label: "Sécurité", icon: Lock },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                        <p className="text-sm text-slate-500">Gérez votre profil et vos préférences</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-64 bg-slate-50 pl-10 border-slate-200"
                            />
                        </div>

                        {/* Notifications */}
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                2
                            </span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg border border-slate-200 p-1 inline-flex gap-1 mb-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    {/* Profil Tab */}
                    {activeTab === "profil" && (
                        <div>
                            {/* User Avatar */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <span className="text-lg font-semibold text-slate-600">
                                        {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{profile.prenom} {profile.nom}</p>
                                    <p className="text-sm text-slate-500">Auditeur ICPP</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Prénom</Label>
                                    <Input
                                        value={profile.prenom}
                                        onChange={(e) => setProfile({ ...profile, prenom: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Nom</Label>
                                    <Input
                                        value={profile.nom}
                                        onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Téléphone</Label>
                                    <Input
                                        value={profile.telephone}
                                        onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Email</Label>
                                    <Input
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>

                            <Button
                                className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                onClick={() => alert('Profil mis à jour avec succès !')}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer les modifications
                            </Button>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Préférences de notification</h2>

                            <div className="space-y-4 mb-6">
                                {/* Nouveaux signalements */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <p className="font-medium text-slate-900">Nouveaux signalements</p>
                                        <p className="text-sm text-slate-500">Recevoir un email lors d&apos;un nouveau signalement client</p>
                                    </div>
                                    <Switch
                                        checked={notifications.nouveauxSignalements}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, nouveauxSignalements: checked })}
                                    />
                                </div>

                                {/* Nouvelles tâches */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <p className="font-medium text-slate-900">Nouvelles tâches</p>
                                        <p className="text-sm text-slate-500">Recevoir un email pour chaque nouvelle tâche assignée</p>
                                    </div>
                                    <Switch
                                        checked={notifications.nouvellesTaches}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, nouvellesTaches: checked })}
                                    />
                                </div>

                                {/* Rappels échéances */}
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div>
                                        <p className="font-medium text-slate-900">Rappels échéances</p>
                                        <p className="text-sm text-slate-500">Recevoir des rappels pour les échéances proches</p>
                                    </div>
                                    <Switch
                                        checked={notifications.rappelsEcheances}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, rappelsEcheances: checked })}
                                    />
                                </div>

                                {/* Notifications push */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-slate-900">Notifications push</p>
                                        <p className="text-sm text-slate-500">Recevoir les notifications dans le navigateur</p>
                                    </div>
                                    <Switch
                                        checked={notifications.notificationsPush}
                                        onCheckedChange={(checked) => setNotifications({ ...notifications, notificationsPush: checked })}
                                    />
                                </div>
                            </div>

                            <Button
                                className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                onClick={() => alert('Préférences de notification mises à jour !')}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer les modifications
                            </Button>
                        </div>
                    )}

                    {/* Sécurité Tab */}
                    {activeTab === "securite" && (
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Changer le mot de passe</h2>

                            <div className="max-w-md space-y-4 mb-6">
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Mot de passe actuel</Label>
                                    <Input
                                        type="password"
                                        value={passwords.actuel}
                                        onChange={(e) => setPasswords({ ...passwords, actuel: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Nouveau mot de passe</Label>
                                    <Input
                                        type="password"
                                        value={passwords.nouveau}
                                        onChange={(e) => setPasswords({ ...passwords, nouveau: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-slate-700 mb-2 block">Confirmer le mot de passe</Label>
                                    <Input
                                        type="password"
                                        value={passwords.confirmer}
                                        onChange={(e) => setPasswords({ ...passwords, confirmer: e.target.value })}
                                        className="bg-slate-50 border-slate-200"
                                    />
                                </div>
                            </div>

                            <Button
                                className="bg-[#4A7FFF] hover:bg-[#3968E6] text-white"
                                onClick={() => {
                                    if (passwords.nouveau !== passwords.confirmer) {
                                        alert('Les mots de passe ne correspondent pas !');
                                        return;
                                    }
                                    if (!passwords.actuel || !passwords.nouveau) {
                                        alert('Veuillez remplir tous les champs');
                                        return;
                                    }
                                    alert('Mot de passe modifié avec succès !');
                                    setPasswords({ actuel: '', nouveau: '', confirmer: '' });
                                }}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Enregistrer les modifications
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
