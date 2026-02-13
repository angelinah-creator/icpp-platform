"use client"

import { useState } from "react"
import { Users, UserPlus, Search, MoreHorizontal, Pencil, Trash2, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { createSalarie, updateSalarie, deleteSalarie } from "@/server/actions/salaries"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface SalarieItem {
    id: string
    nom: string
    prenom: string
    poste: string
    uniteTravail: string
    dateEntree: string
    typeContrat: string
    isActive: boolean
    email: string | null
    telephone: string | null
}

const CONTRACT_TYPES = [
    { value: "CDI", label: "CDI" },
    { value: "CDD", label: "CDD" },
    { value: "APPRENTISSAGE", label: "Apprentissage" },
    { value: "STAGE", label: "Stage" },
    { value: "INTERIM", label: "Intérim" },
    { value: "TEMPS_PARTIEL", label: "Temps partiel" },
]

function getContractLabel(type: string) {
    return CONTRACT_TYPES.find(c => c.value === type)?.label || type
}

function StatCard({ icon: Icon, count, label, color }: { icon: React.ElementType, count: number, label: string, color: "blue" | "green" | "orange" }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600"
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-2xl font-semibold text-slate-900">{count}</p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </div>
    )
}

const EMPTY_FORM = {
    nom: "", prenom: "", poste: "", uniteTravail: "", dateEntree: "", typeContrat: "CDI", email: "", telephone: "",
}

export function SalariesClientDashboard({ salaries }: { salaries: SalarieItem[] }) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const filtered = salaries.filter(s => {
        const q = search.toLowerCase()
        return !q || `${s.prenom} ${s.nom}`.toLowerCase().includes(q) ||
            s.poste.toLowerCase().includes(q) ||
            s.uniteTravail.toLowerCase().includes(q)
    })

    const activeSalaries = salaries.filter(s => s.isActive)
    const fullTimeCount = activeSalaries.filter(s => s.typeContrat === "CDI" || s.typeContrat === "CDD").length
    const partTimeCount = activeSalaries.length - fullTimeCount

    function openAdd() {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setShowModal(true)
    }

    function openEdit(s: SalarieItem) {
        setEditingId(s.id)
        setForm({
            nom: s.nom,
            prenom: s.prenom,
            poste: s.poste,
            uniteTravail: s.uniteTravail,
            dateEntree: s.dateEntree.split("T")[0],
            typeContrat: s.typeContrat,
            email: s.email || "",
            telephone: s.telephone || "",
        })
        setShowModal(true)
    }

    async function handleSubmit() {
        if (!form.nom || !form.prenom || !form.poste || !form.uniteTravail || !form.dateEntree) return
        setLoading(true)
        try {
            if (editingId) {
                await updateSalarie(editingId, form)
            } else {
                await createSalarie(form)
            }
            setShowModal(false)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        setLoading(true)
        try {
            await deleteSalarie(id)
            setDeleteConfirm(null)
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Mes salariés</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Gérez la liste de vos salariés</p>
                </div>
                <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter un salarié
                </Button>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard icon={Users} count={activeSalaries.length} label="Salariés actifs" color="blue" />
                    <StatCard icon={Users} count={fullTimeCount} label="CDI / CDD" color="green" />
                    <StatCard icon={Clock} count={partTimeCount} label="Autres contrats" color="orange" />
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Rechercher un salarié..."
                            className="pl-10 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Nom</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Poste</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Unité de travail</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date entrée</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contrat</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filtered.length > 0 ? filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-900">{s.prenom} {s.nom}</p>
                                            {!s.isActive && <Badge variant="outline" className="text-xs text-red-500">Inactif</Badge>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{s.poste}</td>
                                    <td className="px-6 py-4 text-slate-600">{s.uniteTravail}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {format(new Date(s.dateEntree), "dd/MM/yyyy", { locale: fr })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-xs">{getContractLabel(s.typeContrat)}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <MoreHorizontal className="h-5 w-5 text-slate-500" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(s)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteConfirm(s.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        {search ? "Aucun salarié trouvé" : "Aucun salarié enregistré. Ajoutez votre premier salarié."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Modifier le salarié" : "Ajouter un salarié"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Prénom *</Label>
                                <Input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} className="mt-1" />
                            </div>
                            <div>
                                <Label>Nom *</Label>
                                <Input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Poste *</Label>
                                <Input value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} className="mt-1" />
                            </div>
                            <div>
                                <Label>Unité de travail *</Label>
                                <Input value={form.uniteTravail} onChange={e => setForm({ ...form, uniteTravail: e.target.value })} className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date d'entrée *</Label>
                                <Input type="date" value={form.dateEntree} onChange={e => setForm({ ...form, dateEntree: e.target.value })} className="mt-1" />
                            </div>
                            <div>
                                <Label>Type de contrat *</Label>
                                <Select value={form.typeContrat} onValueChange={v => setForm({ ...form, typeContrat: v })}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {CONTRACT_TYPES.map(c => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Email</Label>
                                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1" />
                            </div>
                            <div>
                                <Label>Téléphone</Label>
                                <Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} className="mt-1" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "..." : editingId ? "Enregistrer" : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-slate-600 py-2">
                        Voulez-vous vraiment supprimer ce salarié ? Cette action est irréversible.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                        <Button
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {loading ? "..." : "Supprimer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
