"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, MoreHorizontal, Bell, Building2, Filter, Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Euro, Loader2 } from "lucide-react"

import { updateSubscriptionStatus, updateSubscriptionPrice } from "@/server/actions/admin"

interface Subscription {
    id: string
    companyId: string
    entreprise: string
    plan: string
    planCode: string
    prix: string
    statut: string
    customPrice?: number | null
}

interface Stats {
    revenuMensuel: number
    abonnementsActifs: number
    tauxRenouvellement: number
}

interface AbonnementsClientProps {
    initialSubscriptions: Subscription[]
    stats: Stats
}

function getPlanBadge(plan: string) {
    if (plan.toLowerCase().includes("premium")) {
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 font-medium border-0 px-3 py-1">{plan}</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium border-0 px-3 py-1">{plan}</Badge>
}

function getStatutBadge(statut: string) {
    if (statut === "Actif") {
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal border-0">Actif</Badge>
    }
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal border-0">{statut}</Badge>
}

export function AbonnementsClient({ initialSubscriptions, stats }: AbonnementsClientProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredSubscriptions = initialSubscriptions.filter(sub =>
        sub.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.plan.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const [isUpdating, setIsUpdating] = useState<string | null>(null)
    const [priceModalOpen, setPriceModalOpen] = useState(false)
    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
    const [newPrice, setNewPrice] = useState<string>("")
    const [isUpdatingPrice, setIsUpdatingPrice] = useState(false)

    async function handleStatusToggle(id: string, currentStatus: string) {
        setIsUpdating(id)
        const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
        try {
            await updateSubscriptionStatus(id, newStatus)
            router.refresh()
        } catch (error) {
            alert("Erreur lors de la mise à jour du statut")
        } finally {
            setIsUpdating(null)
        }
    }

    function openPriceModal(sub: Subscription) {
        setSelectedSub(sub)
        setNewPrice(sub.customPrice ? (sub.customPrice / 100).toString() : "")
        setPriceModalOpen(true)
    }

    async function handlePriceUpdate() {
        if (!selectedSub) return
        setIsUpdatingPrice(true)
        try {
            const price = newPrice === "" ? null : parseFloat(newPrice)
            await updateSubscriptionPrice(selectedSub.id, price)
            setPriceModalOpen(false)
            router.refresh()
        } catch (error) {
            alert("Erreur lors de la mise à jour du prix")
        } finally {
            setIsUpdatingPrice(false)
        }
    }

    return (
        <div className="space-y-6 relative">
            <AdminHeader
                title="Gestion des abonnements"
                subtitle="Suivez les abonnements et la facturation"
            />


            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border shadow-sm">
                    <CardContent className="p-5">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Revenu mensuel</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.revenuMensuel}€</p>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-5">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Abonnements actifs</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.abonnementsActifs}</p>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-5">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Taux de renouvellement</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{stats.tauxRenouvellement}%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar and Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-1 rounded-lg">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une entreprise..."
                        className="pl-10 w-full bg-slate-50 border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Button variant="outline" className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                        <Filter className="h-4 w-4" />
                        Tous les statuts
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                            <TableHead className="py-4 font-semibold text-slate-900">Entreprise</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Plan</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Prix mensuel</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900">Statut</TableHead>
                            <TableHead className="py-4 font-semibold text-slate-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                    {searchQuery ? "Aucun abonnement trouvé" : "Aucun abonnement"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubscriptions.map((sub, index) => (
                                <TableRow key={`${sub.id}-${index}`} className="hover:bg-slate-50/50 border-b">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                                                <Building2 className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">{sub.entreprise}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">{getPlanBadge(sub.plan)}</TableCell>
                                    <TableCell className="py-4 text-slate-900 font-medium">{sub.prix}</TableCell>
                                    <TableCell className="py-4">{getStatutBadge(sub.statut)}</TableCell>
                                    <TableCell className="py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/entreprises`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Voir l'entreprise
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => openPriceModal(sub)}
                                                >
                                                    <Euro className="h-4 w-4 mr-2" />
                                                    Modifier le prix
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusToggle(sub.id, sub.statut)}
                                                    disabled={isUpdating === sub.id}
                                                    className={sub.statut === "ACTIVE" ? "text-red-600" : "text-green-600"}
                                                >
                                                    {sub.statut === "ACTIVE" ? "Suspendre l'abonnement" : "Activer l'abonnement"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Price Modal */}
            <Dialog open={priceModalOpen} onOpenChange={setPriceModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Personnaliser le tarif</DialogTitle>
                        <DialogDescription>
                            Définissez un montant mensuel spécifique pour {selectedSub?.entreprise}.
                            Laissez vide pour repasser au tarif par défaut du plan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Montant mensuel (€)</Label>
                            <div className="relative">
                                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 49.90"
                                    className="pl-10"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 italic">
                                Note: Le prix par défaut du plan {selectedSub?.plan} est de {selectedSub?.prix.split('/')[0]}.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPriceModalOpen(false)}>Annuler</Button>
                        <Button
                            onClick={handlePriceUpdate}
                            disabled={isUpdatingPrice}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isUpdatingPrice ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Mise à jour...</>
                            ) : (
                                "Appliquer le prix"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}
