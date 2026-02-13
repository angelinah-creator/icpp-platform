"use client"

import { useState } from "react"
import { Search, Bell, User, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface User {
    id: string
    name: string | null
    email: string
    phone: string | null
    role: string
}

interface ParametresClientProps {
    user: User
}

export function ParametresClient({ user }: ParametresClientProps) {
    const [isUpdating, setIsUpdating] = useState(false)

    // Form states
    const [name, setName] = useState(user.name || "")
    const [phone, setPhone] = useState(user.phone || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsUpdating(true)

        try {
            const response = await fetch("/api/user/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone })
            })

            if (response.ok) {
                toast.success("Profil mis à jour avec succès")
            } else {
                toast.error("Erreur lors de la mise à jour du profil")
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du profil")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Le mot de passe doit contenir au moins 8 caractères")
            return
        }

        setIsUpdating(true)

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            })

            if (response.ok) {
                toast.success("Mot de passe modifié avec succès")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                const data = await response.json()
                toast.error(data.error || "Erreur lors du changement de mot de passe")
            }
        } catch (error) {
            toast.error("Erreur lors du changement de mot de passe")
        } finally {
            setIsUpdating(false)
        }
    }

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
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8">
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="bg-white border border-slate-200">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="h-4 w-4" />
                            Profil
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <Shield className="h-4 w-4" />
                            Sécurité
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations personnelles</CardTitle>
                                <CardDescription>
                                    Mettez à jour vos informations de profil
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom complet</Label>
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={user.email}
                                                disabled
                                                className="bg-slate-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+33 6 12 34 56 78"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Rôle</Label>
                                            <Input
                                                id="role"
                                                value="Technicien"
                                                disabled
                                                className="bg-slate-50"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isUpdating}>
                                            {isUpdating ? "Mise à jour..." : "Enregistrer les modifications"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Changer le mot de passe</CardTitle>
                                <CardDescription>
                                    Modifiez votre mot de passe pour sécuriser votre compte
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                        <p className="text-xs text-slate-500">
                                            Le mot de passe doit contenir au moins 8 caractères
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isUpdating}>
                                            {isUpdating ? "Modification..." : "Changer le mot de passe"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
