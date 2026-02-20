import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Shield, FileText, Users, CreditCard, Bell, Download, Calendar, CheckCircle2, AlertCircle, Clock, Phone, ChevronRight, Eye, CalendarClock } from "lucide-react"
import { differenceInDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ComplianceItem {
    label: string
    status: "completed" | "warning" | "pending"
    date?: string
    daysRemaining?: number
}

async function getClientDashboardData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            company: {
                include: {
                    duerps: {
                        where: { status: "ACTIVE" },
                        orderBy: { createdAt: "desc" },
                        take: 1
                    },
                    subscription: {
                        include: {
                            plan: true
                        }
                    },
                    affichages: true,
                    users: {
                        take: 5
                    }
                }
            }
        }
    })

    if (!user?.company) return null

    const company = user.company
    const activeDuerp = company.duerps[0]

    const complianceChecks: ComplianceItem[] = []
    let score = 0

    if (activeDuerp?.signedAt) {
        score += 40
        complianceChecks.push({
            label: "DUERP signé",
            status: "completed",
            date: format(new Date(activeDuerp.signedAt), "dd/MM/yyyy", { locale: fr })
        })
    } else {
        complianceChecks.push({ label: "DUERP signé", status: "pending" })
    }

    const hasAffichages = company.affichages.length >= 5
    if (hasAffichages) {
        score += 30
        complianceChecks.push({ label: "Affichages obligatoires", status: "completed", date: "10/01/2026" })
    } else {
        complianceChecks.push({ label: "Affichages obligatoires", status: "pending" })
    }

    if (company.employeeCount >= 1) {
        score += 15
        complianceChecks.push({ label: "Registre du personnel", status: "completed" })
    } else {
        complianceChecks.push({ label: "Registre du personnel", status: "pending" })
    }

    complianceChecks.push({ label: "Vérification extincteurs", status: "warning", daysRemaining: 45 })

    return {
        companyName: company.name,
        complianceScore: score,
        complianceLevel: score >= 80 ? "Excellent" : score >= 60 ? "Bon" : "À améliorer",
        duerp: {
            status: activeDuerp ? "À jour" : "Non créé",
            version: activeDuerp ? `Version ${activeDuerp.version}.0` : "N/A"
        },
        employeeCount: company.employeeCount,
        subscription: {
            plan: company.subscription?.plan?.nom || "Essentiel",
            status: company.subscription?.status || "ACTIVE"
        },
        subscriptionEnd: company.subscription?.currentPeriodEnd || null,
        complianceChecklist: complianceChecks,
        affichagesCount: company.affichages.length,
        teamMembers: company.users
    }
}

function SubscriptionGauge({ endDate }: { endDate: Date | string | null }) {
    if (!endDate) {
        return (
            <div className="flex flex-col items-center">
                <div className="relative">
                    <svg width="140" height="140" className="transform -rotate-90">
                        <circle cx="70" cy="70" r={55} stroke="#e5e7eb" strokeWidth={8} fill="none" strokeDasharray="8 4" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <CalendarClock className="h-6 w-6 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-500">Non défini</span>
                    </div>
                </div>
            </div>
        )
    }

    const end = new Date(endDate)
    const now = new Date()
    const daysRemaining = differenceInDays(end, now)
    const totalDays = 365
    const progress = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100))

    const radius = 55
    const strokeWidth = 8
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    const strokeColor = daysRemaining > 90 ? "#22c55e" : daysRemaining > 30 ? "#f59e0b" : "#ef4444"
    const textColor = daysRemaining > 90 ? "text-green-500" : daysRemaining > 30 ? "text-amber-500" : "text-red-500"

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <svg width="140" height="140" className="transform -rotate-90">
                    <circle cx="70" cy="70" r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" strokeDasharray="8 4" />
                    <circle
                        cx="70" cy="70" r={radius}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-lg font-bold ${textColor}`}>{format(end, "dd/MM", { locale: fr })}</span>
                    <span className={`text-[10px] font-medium ${textColor}`}>{format(end, "yyyy")}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Expiration</span>
                </div>
            </div>
        </div>
    )
}

export default async function ClientDashboard() {
    const data = await getClientDashboardData()
    if (!data) redirect("/login")

    const getIcon = (status: ComplianceItem["status"]) => {
        if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-green-500" />
        if (status === "warning") return <Clock className="h-5 w-5 text-slate-400" />
        return <AlertCircle className="h-5 w-5 text-slate-400" />
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <h1 className="text-2xl font-semibold text-slate-900">Bienvenue, {data.companyName}</h1>
                <p className="text-slate-500 text-sm mt-0.5">Gérez votre conformité en toute sérénité</p>
            </div>

            <div className="p-6">
                {/* LIGNE 1: Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Score de conformité - Fond vert */}
                    <div className="rounded-2xl bg-green-500 p-5 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-100">Score de conformité</p>
                                <p className="text-3xl font-bold mt-1">{data.complianceScore}%</p>
                                <p className="text-sm text-green-100 mt-1">{data.complianceLevel}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* DUERP */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">DUERP</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{data.duerp.status}</p>
                                <p className="text-sm text-slate-400 mt-1">{data.duerp.version}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Salariés */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Salariés</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">{data.employeeCount}</p>
                                <p className="text-sm text-slate-400 mt-1">Déclarés</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Abonnement - Fond bleu cyan */}
                    <div className="rounded-2xl bg-cyan-50 border border-cyan-100 p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Abonnement</p>
                                <p className="text-2xl font-bold text-cyan-600 mt-1">{data.subscription.plan}</p>
                                <p className="text-sm text-cyan-500 mt-1">Actif</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-cyan-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* LIGNE 2: Layout principal en 2 colonnes */}
                <div className="grid grid-cols-5 gap-6 mb-6">
                    {/* Colonne Gauche (3/5) */}
                    <div className="col-span-3 space-y-6">
                        {/* Statut de conformité */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex gap-8">
                                {/* Jauge à gauche avec fond gris */}
                                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6">
                                    <SubscriptionGauge endDate={data.subscriptionEnd} />
                                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 rounded-full">
                                        Attestation active
                                    </Button>
                                </div>

                                {/* Checklist à droite */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Statut de conformité</h2>
                                    <div className="space-y-0">
                                        {data.complianceChecklist.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    {getIcon(item.status)}
                                                    <span className="text-sm text-slate-700">{item.label}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {item.date || (item.daysRemaining ? `Dans ${item.daysRemaining}j` : "")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        Voir tous les documents <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions rapides */}
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h2>
                            <div className="space-y-3">
                                <Link href="/dashboard/duerp" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Mon DUERP</p>
                                            <p className="text-sm text-slate-500">Consulter et télécharger votre document</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                                </Link>

                                <Link href="/dashboard/signalements" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Bell className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Signaler un changement</p>
                                            <p className="text-sm text-slate-500">Consulter et télécharger votre document</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                                </Link>

                                <Link href="/dashboard/salaries" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Mes salariés</p>
                                            <p className="text-sm text-slate-500">Gérer les informations de votre équipe</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                                </Link>

                                <Link href="/dashboard/affichages" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <Download className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">Affichages obligatoires</p>
                                            <p className="text-sm text-slate-500">Télécharger les affiches légales</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite (2/5) */}
                    <div className="col-span-2 space-y-4">
                        {/* Profil Contact */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
                            <div className="flex justify-center mb-3">
                                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                                    {data.companyName.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                            <p className="font-semibold text-slate-900">{data.companyName}</p>
                            <p className="text-sm text-slate-500">Salon de coiffure</p>
                            <div className="flex justify-center mt-3">
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                                    Accompagné par ICPP
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4 text-sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir mon profil
                            </Button>
                        </div>

                        {/* Prochains rappels */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h3 className="font-semibold text-slate-900">Prochains rappels</h3>
                            <p className="text-xs text-slate-400 mb-3">Échéances à venir</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Mise à jour DUERP</p>
                                        <p className="text-xs text-slate-500">2026-12-01</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Vérification extincteurs</p>
                                        <p className="text-xs text-slate-500">Dans 45 jours</p>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-3 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                                Tous les rappels <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Mon équipe */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <h3 className="font-semibold text-slate-900">Mon équipe</h3>
                            <p className="text-xs text-slate-400 mb-3">{data.employeeCount} salariés déclarés</p>
                            <div className="flex -space-x-2 mb-3">
                                {["SF", "JC", "M"].map((l, i) => (
                                    <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-sm">
                                Gérer mes salariés
                            </Button>
                        </div>

                        {/* Affichages */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Affichages</h3>
                                    <p className="text-xs text-slate-400">{data.affichagesCount} documents disponibles</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                            </Button>
                        </div>
                    </div>
                </div>

                {/* LIGNE 3: Support ICPP */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Support ICPP</h3>
                            <p className="text-sm text-slate-500">Notre équipe est à votre disposition pour vous accompagner dans votre conformité réglementaire.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="text-sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Support
                    </Button>
                </div>
            </div>
        </div>
    )
}
