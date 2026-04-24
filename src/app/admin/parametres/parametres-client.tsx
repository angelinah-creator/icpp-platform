"use client"

import { useState } from "react"
import { Search, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSettings } from "@/server/actions/admin"
import { AdminHeader } from "@/components/admin/admin-header"


interface Settings {
    id: string
    companyName: string
    contactEmail: string
    contactPhone: string
    notifEmail: boolean
    notifSms: boolean
    notifPush: boolean
    duerpReminderDays: number
    auditReminderDays: number
}

interface ParametresClientProps {
    initialSettings: Settings
}

export function ParametresClient({ initialSettings }: ParametresClientProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        try {
            await updateSettings(settings)
            setShowSuccessToast(true)
            setTimeout(() => setShowSuccessToast(false), 4000)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Paramètres"
                subtitle="Configuration de la plateforme ICPP"
            />


            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white border p-1">
                    <TabsTrigger value="general">Général</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <Card className="bg-white border shadow-sm">
                        <CardHeader>
                            <CardTitle>Informations entreprise</CardTitle>
                            <CardDescription>Paramètres de l&apos;entreprise ICPP Conformité</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom de l&apos;entreprise</Label>
                                    <Input
                                        value={settings.companyName}
                                        onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email de contact</Label>
                                    <Input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                                />
                            </div>
                            <div className="pt-4">
                                <Button
                                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6 space-y-6">
                    <Card className="bg-white border shadow-sm">
                        <CardHeader>
                            <CardTitle>Préférences de notification</CardTitle>
                            <CardDescription>Choisissez comment recevoir les notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Notifications par email</p>
                                    <p className="text-sm text-slate-500">Recevoir les alertes par email</p>
                                </div>
                                <Switch
                                    checked={settings.notifEmail}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifEmail: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Notifications SMS</p>
                                    <p className="text-sm text-slate-500">Recevoir les alertes par SMS</p>
                                </div>
                                <Switch
                                    checked={settings.notifSms}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifSms: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Notifications push</p>
                                    <p className="text-sm text-slate-500">Recevoir les notifications push</p>
                                </div>
                                <Switch
                                    checked={settings.notifPush}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifPush: checked }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border shadow-sm">
                        <CardHeader>
                            <CardTitle>Rappels automatiques</CardTitle>
                            <CardDescription>Configurer les délais de rappel</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Rappel DUERP avant expiration</Label>
                                    <Select
                                        value={String(settings.duerpReminderDays)}
                                        onValueChange={(value) => setSettings(prev => ({ ...prev, duerpReminderDays: parseInt(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7">7 jours</SelectItem>
                                            <SelectItem value="15">15 jours</SelectItem>
                                            <SelectItem value="30">30 jours</SelectItem>
                                            <SelectItem value="60">60 jours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Rappel audit à venir</Label>
                                    <Select
                                        value={String(settings.auditReminderDays)}
                                        onValueChange={(value) => setSettings(prev => ({ ...prev, auditReminderDays: parseInt(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 jours</SelectItem>
                                            <SelectItem value="7">7 jours</SelectItem>
                                            <SelectItem value="15">15 jours</SelectItem>
                                            <SelectItem value="30">30 jours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button
                                    className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Paramètres enregistrés avec succès</span>
                </div>
            )}
        </div>
    )
}
