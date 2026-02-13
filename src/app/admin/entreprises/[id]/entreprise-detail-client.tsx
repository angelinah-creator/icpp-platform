"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, FileText, Users, Edit, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteCompany } from "@/server/actions/admin"
import { EditCompanyModal } from "@/components/admin/edit-company-modal"

interface Plan {
    code: string
    nom: string
    prix: number
}

interface Metier {
    code: string
    nom: string
}

interface EntrepriseDetailClientProps {
    company: any
    plans: Plan[]
    metiers: Metier[]
}

export function EntrepriseDetailClient({ company, plans, metiers }: EntrepriseDetailClientProps) {
    const router = useRouter()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    function toast(message: string) {
        setToastMessage(message)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    const editCompanyData = {
        id: company.id,
        nom: company.name,
        email: company.email || "",
        activite: company.metier?.code || "",
        abonnement: company.subscription?.plan?.code || "",
        siret: company.siret || "",
        phone: company.phone || "",
        address: company.address || "",
        postalCode: company.postalCode || "",
        city: company.city || "",
        metierCode: company.metier?.code || "",
        employeeCount: company.employeeCount || 1
    }

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteCompany(company.id)
            if ('error' in result) {
                alert(result.error)
            } else {
                router.push("/admin/entreprises")
                router.refresh()
            }
        } catch {
            alert("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
        }
    }

    function handleEditSuccess() {
        toast("Entreprise modifiée avec succès")
        router.refresh()
    }

    return (
        <div className="space-y-6 p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/entreprises">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">{company.name}</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Créée le {new Date(company.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setEditModalOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                    <Button variant="outline" className="text-red-600" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Informations générales */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            Informations générales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Raison sociale</p>
                                <p className="font-medium text-slate-900">{company.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">SIRET</p>
                                <p className="font-medium text-slate-900">{company.siret || "Non renseigné"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium text-slate-900">{company.email || "Non renseigné"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <div>
                                    <p className="text-sm text-slate-500">Téléphone</p>
                                    <p className="font-medium text-slate-900">{company.phone || "Non renseigné"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                            <div>
                                <p className="text-sm text-slate-500">Adresse</p>
                                <p className="font-medium text-slate-900">
                                    {company.address || "Non renseigné"}
                                    {company.postalCode && company.city && (
                                        <><br />{company.postalCode} {company.city}</>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Métier</p>
                                <p className="font-medium text-slate-900">{company.metier?.nom || "Non défini"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Nombre de salariés</p>
                                <p className="font-medium text-slate-900">{company.employeeCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Abonnement */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Abonnement
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {company.subscription ? (
                            <>
                                <div>
                                    <p className="text-sm text-slate-500">Plan actuel</p>
                                    <Badge className="mt-1 bg-blue-100 text-blue-700">
                                        {company.subscription.plan?.nom}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Statut</p>
                                    <Badge className="mt-1 bg-green-100 text-green-700">
                                        {company.subscription.status === "ACTIVE" ? "Actif" : "Inactif"}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Prix mensuel</p>
                                    <p className="font-medium text-slate-900">
                                        {company.subscription.plan?.prixMensuel / 100}€/mois
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-slate-500">Aucun abonnement actif</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* DUERP */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Documents DUERP ({company.duerps.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {company.duerps.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">Aucun DUERP créé</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Date de création</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Signé le</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {company.duerps.map((duerp: any) => (
                                    <TableRow key={duerp.id}>
                                        <TableCell>v{duerp.version}</TableCell>
                                        <TableCell>{new Date(duerp.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                                        <TableCell>
                                            <Badge className={
                                                duerp.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                                                    duerp.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-gray-100 text-gray-700"
                                            }>
                                                {duerp.status === "ACTIVE" ? "Actif" : duerp.status === "DRAFT" ? "Brouillon" : "Archivé"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {duerp.signedAt ? new Date(duerp.signedAt).toLocaleDateString("fr-FR") : "Non signé"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Utilisateurs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Utilisateurs ({company.users.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {company.users.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">Aucun utilisateur</p>
                    ) : (
                        <div className="space-y-3">
                            {company.users.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-900">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                    <Badge variant="outline">{user.role}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <EditCompanyModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                company={editCompanyData}
                plans={plans}
                metiers={metiers}
                onSuccess={handleEditSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette entreprise ? Cette action est irréversible et supprimera également tous les audits, DUERP et utilisateurs associés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
