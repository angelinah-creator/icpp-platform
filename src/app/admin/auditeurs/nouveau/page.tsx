"use client"

import { useState } from "react"
import { ArrowLeft, Save, User, Mail, Phone, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function NouvelAuditeurPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)

        // TODO: Implement actual form submission with Server Action
        await new Promise(resolve => setTimeout(resolve, 1000))

        router.push("/admin/auditeurs?success=true")
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/auditeurs">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Nouvel auditeur</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Ajoutez un nouvel auditeur à l&apos;équipe
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informations personnelles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-blue-600" />
                                Informations personnelles
                            </CardTitle>
                            <CardDescription>
                                Coordonnées de l&apos;auditeur
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prenom">Prénom *</Label>
                                    <Input
                                        id="prenom"
                                        name="prenom"
                                        placeholder="Marie"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom *</Label>
                                    <Input
                                        id="nom"
                                        name="nom"
                                        placeholder="Dupont"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email professionnel *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="marie.dupont@icpp.fr"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="telephone"
                                        name="telephone"
                                        type="tel"
                                        placeholder="06 12 34 56 78"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compétences et spécialités */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5 text-blue-600" />
                                Compétences
                            </CardTitle>
                            <CardDescription>
                                Spécialités et domaines d&apos;expertise
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="specialite">Spécialité principale *</Label>
                                <Select name="specialite" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une spécialité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="duerp">DUERP / Risques professionnels</SelectItem>
                                        <SelectItem value="affichage">Affichage obligatoire</SelectItem>
                                        <SelectItem value="conformite">Conformité générale</SelectItem>
                                        <SelectItem value="securite">Sécurité au travail</SelectItem>
                                        <SelectItem value="hygiene">Hygiène et santé</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label>Domaines de compétence</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        "DUERP",
                                        "Affichage obligatoire",
                                        "Sécurité incendie",
                                        "Risques chimiques",
                                        "Ergonomie",
                                        "Restauration",
                                        "Commerce",
                                        "BTP",
                                    ].map((competence) => (
                                        <div key={competence} className="flex items-center space-x-2">
                                            <Checkbox id={competence.toLowerCase().replace(/\s/g, '-')} />
                                            <label
                                                htmlFor={competence.toLowerCase().replace(/\s/g, '-')}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {competence}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes et observations */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Notes additionnelles</CardTitle>
                            <CardDescription>
                                Informations complémentaires sur l&apos;auditeur
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Certifications, expérience, disponibilités..."
                                rows={4}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Link href="/admin/auditeurs">
                        <Button type="button" variant="outline">
                            Annuler
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-[#2048BF] to-[#679CFF] hover:opacity-90"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Enregistrement..." : "Enregistrer l'auditeur"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
