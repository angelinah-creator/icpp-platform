"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, FileText, Users,
    Edit, Save, X, Check, ClipboardList, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateCompanyAsAuditeur } from "@/server/actions/client"
import { InternalNotesPanel, InternalNote } from "@/components/admin/internal-notes-panel"

interface CompanyDetail {
    id: string
    name: string
    siret: string | null
    email: string | null
    phone: string | null
    address: string
    postalCode: string | null
    city: string
    metier: string
    metierCode: string | null
    employeeCount: number
    subscription: string
    subscriptionCode: string | null
    subscriptionStatus: string | undefined
    internalNotes?: InternalNote[]
    duerps: Array<{
        id: string
        status: string
        createdAt: Date
        signedAt: Date | null
    }>
    audits: Array<{
        id: string
        type: string
        status: string
        dateAudit: Date
    }>
    contacts: Array<{
        id: string
        name: string | null
        email: string | null | undefined
        role: string
    }>
}

interface EntrepriseDetailClientProps {
    company: CompanyDetail
    metiers: { code: string; nom: string }[]
    plans: { code: string; nom: string; prixMensuel: number }[]
    currentUserId: string
    currentUserRole: string
}

function getStatusBadge(status: string) {
    switch (status) {
        case "COMPLETED":
        case "SIGNED":
            return <Badge className="bg-green-100 text-green-700">Terminé</Badge>
        case "EN_COURS":
        case "DRAFT":
            return <Badge className="bg-orange-100 text-orange-700">En cours</Badge>
        case "PLANIFIE":
            return <Badge className="bg-blue-100 text-blue-700">Planifié</Badge>
        default:
            return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>
    }
}

export function EntrepriseDetailClient({ company, metiers, plans, currentUserId, currentUserRole }: EntrepriseDetailClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [selectedMetier, setSelectedMetier] = useState(company.metierCode || "")
    const [selectedPlan, setSelectedPlan] = useState(company.subscriptionCode || "")
    const [selectedStatus, setSelectedStatus] = useState(company.subscriptionStatus || "ACTIVE")

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        try {
            const result = await updateCompanyAsAuditeur(company.id, {
                name: formData.get("name") as string,
                siret: formData.get("siret") as string || undefined,
                email: formData.get("email") as string || undefined,
                phone: formData.get("phone") as string || undefined,
                address: formData.get("address") as string,
                postalCode: formData.get("postalCode") as string || undefined,
                city: formData.get("city") as string,
                employeeCount: parseInt(formData.get("employeeCount") as string) || 1,
                metierCode: selectedMetier,
                planCode: selectedPlan,
                status: selectedStatus
            })

            if ('success' in result) {
                setIsEditing(false)
                setShowSuccessToast(true)
                setTimeout(() => setShowSuccessToast(false), 4000)
                router.refresh()
            }
        } catch {
            // Handle error
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/auditeur/entreprises">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{company.name}</h1>
                        <p className="text-sm text-slate-500 mt-1">Fiche client TPE</p>
                    </div>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                )}
            </div>

            <form onSubmit={handleSave}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Informations entreprise
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-slate-500">Nom</Label>
                                    {isEditing ? (
                                        <Input name="name" defaultValue={company.name} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500">SIRET</Label>
                                    {isEditing ? (
                                        <Input name="siret" defaultValue={company.siret || ""} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.siret || "-"}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-slate-500">Métier</Label>
                                    {isEditing ? (
                                        <Select value={selectedMetier} onValueChange={setSelectedMetier}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Sélectionner un métier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {metiers.map((m) => (
                                                    <SelectItem key={m.code} value={m.code}>{m.nom}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="font-medium">
                                            <Badge className="bg-purple-100 text-purple-700">{company.metier}</Badge>
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500">Effectif</Label>
                                    {isEditing ? (
                                        <Input name="employeeCount" type="number" min="1" defaultValue={company.employeeCount} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.employeeCount} salarié{company.employeeCount > 1 ? "s" : ""}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-slate-500">Abonnement</Label>
                                {isEditing ? (
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {plans.map((p) => (
                                                    <SelectItem key={p.code} value={p.code}>{p.nom}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Actif</SelectItem>
                                                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                                                <SelectItem value="CANCELED">Résilié</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-blue-100 text-blue-700">{company.subscription}</Badge>
                                        {company.subscriptionStatus && (
                                            <Badge variant="outline" className={
                                                company.subscriptionStatus === "ACTIVE" ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
                                            }>
                                                {company.subscriptionStatus === "ACTIVE" ? "Actif" : "Inactif"}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coordonnées */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                Coordonnées
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-slate-500">Adresse</Label>
                                {isEditing ? (
                                    <Input name="address" defaultValue={company.address} className="mt-1" />
                                ) : (
                                    <p className="font-medium">{company.address}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-slate-500">Code postal</Label>
                                    {isEditing ? (
                                        <Input name="postalCode" defaultValue={company.postalCode || ""} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.postalCode || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500">Ville</Label>
                                    {isEditing ? (
                                        <Input name="city" defaultValue={company.city} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.city}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-slate-500 flex items-center gap-1">
                                        <Mail className="h-3 w-3" /> Email
                                    </Label>
                                    {isEditing ? (
                                        <Input name="email" type="email" defaultValue={company.email || ""} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.email || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-slate-500 flex items-center gap-1">
                                        <Phone className="h-3 w-3" /> Téléphone
                                    </Label>
                                    {isEditing ? (
                                        <Input name="phone" defaultValue={company.phone || ""} className="mt-1" />
                                    ) : (
                                        <p className="font-medium">{company.phone || "-"}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Historique DUERP */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                                Documents DUERP
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {company.duerps.length === 0 ? (
                                <div className="text-center py-6 text-slate-500">
                                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                                    <p>Aucun DUERP généré</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {company.duerps.map(duerp => (
                                        <div key={duerp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-4 w-4 text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {new Date(duerp.createdAt).toLocaleDateString("fr-FR")}
                                                    </p>
                                                    {duerp.signedAt && (
                                                        <p className="text-xs text-slate-500">
                                                            Signé le {new Date(duerp.signedAt).toLocaleDateString("fr-FR")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {getStatusBadge(duerp.status)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Historique Audits */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ClipboardList className="h-5 w-5 text-blue-600" />
                                Audits réalisés
                            </CardTitle>
                            <Link href={`/auditeur/audits/nouveau?entreprise=${company.id}`}>
                                <Button size="sm" variant="outline">
                                    Planifier un audit
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {company.audits.length === 0 ? (
                                <div className="text-center py-6 text-slate-500">
                                    <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                    <p>Aucun audit réalisé</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {company.audits.map(audit => (
                                        <div key={audit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <ClipboardList className="h-4 w-4 text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium">{audit.type}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(audit.dateAudit).toLocaleDateString("fr-FR")}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(audit.status)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contacts */}
                    {company.contacts.length > 0 && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Contacts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {company.contacts.map(contact => (
                                        <div key={contact.id} className="p-4 bg-slate-50 rounded-lg">
                                            <p className="font-medium">{contact.name || "Sans nom"}</p>
                                            <p className="text-sm text-slate-500">{contact.email}</p>
                                            <Badge className="mt-2 bg-slate-200 text-slate-600">{contact.role}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {!isEditing && (
                    <div className="mt-8">
                        <InternalNotesPanel
                            companyId={company.id}
                            initialNotes={company.internalNotes || []}
                            currentUserId={currentUserId}
                            currentUserRole={currentUserRole}
                        />
                    </div>
                )}

                {/* Actions when editing */}
                {isEditing && (
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#2048BF] to-[#679CFF]">
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                )}
            </form>

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Fiche mise à jour avec succès</span>
                </div>
            )}
        </div>
    )
}
