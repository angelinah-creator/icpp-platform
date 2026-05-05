import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Shield, FileText, Users, CreditCard, Bell, Download, Calendar, CheckCircle2, AlertCircle, Clock, Phone, ChevronRight, Eye, CalendarClock } from "lucide-react"
import { differenceInDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Always fetch fresh data so subscription status is never stale
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const signedDuerpAt = activeDuerp?.signedAt ?? null
    const hasSignedDuerp = Boolean(signedDuerpAt)

    const complianceChecks: ComplianceItem[] = []
    let score = 0

    // ── 1. DUERP ─────────────────────────────────────────────────────────────
    if (signedDuerpAt) {
        const daysSinceSigned = differenceInDays(new Date(), new Date(signedDuerpAt))
        const isNearExpiry = daysSinceSigned >= 335 // 30j avant l'expiration annuelle
        const isExpired = daysSinceSigned >= 365

        if (isExpired) {
            score += 20
            complianceChecks.push({ label: "DUERP signé (expiré — à renouveler)", status: "warning" })
        } else if (isNearExpiry) {
            score += 40
            complianceChecks.push({
                label: "DUERP signé (renouvellement à prévoir)",
                status: "warning",
                daysRemaining: 365 - daysSinceSigned
            })
        } else {
            score += 55
            complianceChecks.push({
                label: "DUERP signé",
                status: "completed",
                date: format(new Date(signedDuerpAt), "dd/MM/yyyy", { locale: fr })
            })
        }
    } else {
        complianceChecks.push({ label: "DUERP signé", status: "pending" })
    }

    // ── 2. Affichages obligatoires ───────────────────────────────────────────
    const hasAffichages = company.affichages.length >= 1
    if (hasAffichages) {
        score += 25
        complianceChecks.push({ label: "Affichages obligatoires", status: "completed" })
    } else {
        complianceChecks.push({ label: "Affichages obligatoires", status: "pending" })
    }

    // ── 3. Registre du personnel ─────────────────────────────────────────────
    const hasPersonnelRegister = company.employeeCount >= 1
    if (hasPersonnelRegister) {
        score += 10
        complianceChecks.push({ label: "Registre du personnel", status: "completed" })
    } else {
        complianceChecks.push({ label: "Registre du personnel", status: "pending" })
    }

    // ── 4. Abonnement actif ──────────────────────────────────────────────────
    const isSubscriptionActive = ["ACTIVE", "TRIALING"].includes(company.subscription?.status || "")
    if (isSubscriptionActive) {
        score += 10
        complianceChecks.push({ label: "Abonnement ICPP actif", status: "completed" })
    } else {
        complianceChecks.push({ label: "Abonnement ICPP actif", status: "pending" })
    }

    // ── 5. Vérification extincteurs (déclarative) ────────────────────────────
    complianceChecks.push({ label: "Vérification extincteurs", status: "warning", daysRemaining: 45 })

    const hasCoreCompliance = hasSignedDuerp && hasAffichages && hasPersonnelRegister
    if (hasCoreCompliance && score < 85) {
        score = 85
    }

    return {
        companyName: company.name,
        complianceScore: score,
        complianceLevel: score >= 85 ? "Excellent" : score >= 70 ? "Bon" : "À améliorer",
        hasCoreCompliance,
        duerp: {
            status: hasSignedDuerp ? "À jour" : activeDuerp ? "En cours" : "Non créé",
            version: activeDuerp ? `Version ${activeDuerp.version}.0` : "N/A"
        },
        employeeCount: company.employeeCount,
        subscription: {
            plan: company.subscription?.plan?.nom || "Essentiel",
            status: company.subscription?.status || "INACTIVE"
        },
        subscriptionStart: company.subscription?.currentPeriodStart || null,
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

    const isSuspended =
        data.subscription.status !== "ACTIVE" &&
        data.subscription.status !== "TRIALING"

    const getIcon = (status: ComplianceItem["status"]) => {
        if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-green-500" />
        if (status === "warning") return <Clock className="h-5 w-5 text-slate-400" />
        return <AlertCircle className="h-5 w-5 text-slate-400" />
    }

    const subscriptionStartLabel = data.subscriptionStart
        ? format(new Date(data.subscriptionStart), "dd/MM/yyyy")
        : "--/--/----"
    const subscriptionEndLabel = data.subscriptionEnd
        ? format(new Date(data.subscriptionEnd), "dd/MM/yyyy")
        : "--/--/----"

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Suspension Banner */}
            {isSuspended && (
                <div className="bg-red-600 text-white px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Votre abonnement est suspendu</p>
                            <p className="text-sm text-red-100">L'accès à la plateforme est restreint. Veuillez contacter votre administrateur ICPP pour régulariser votre situation.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content — grisé si suspendu */}
            <div className={isSuspended ? "pointer-events-none opacity-50 select-none grayscale" : "animate-in fade-in slide-in-from-bottom-5 duration-700"}>
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5">
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Bienvenue, {data.companyName}</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Gérez votre conformité en toute sérénité</p>
                </div>

                <div className="p-4 sm:p-6">
                    {/* LIGNE 1: Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Score de conformité - Fond vert */}
                        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-5 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-100">Score de conformité</p>
                                    <p className="text-3xl font-bold mt-1">{data.complianceScore}%</p>
                                    <p className="text-sm text-green-100 mt-1">{data.complianceLevel}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* DUERP */}
                        <div className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">DUERP</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">{data.duerp.status}</p>
                                    <p className="text-sm text-slate-400 mt-1">{data.duerp.version}</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Salariés */}
                        <div className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Salariés</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-1">{data.employeeCount}</p>
                                    <p className="text-sm text-slate-400 mt-1">Déclarés</p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        {/* Abonnement - Fond bleu cyan - Cliquable → factures */}
                        <Link href="/dashboard/factures" className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-5 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-500">Abonnement</p>
                                    <p className="text-2xl font-bold text-cyan-600 mt-1 truncate">{data.subscription.plan}</p>
                                    <p className={`text-sm mt-1 font-medium ${isSuspended ? "text-red-500" : "text-cyan-500"}`}>
                                        {isSuspended ? "Suspendu" : "Actif"}
                                    </p>
                                    {data.subscriptionEnd && (
                                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Fin : {format(new Date(data.subscriptionEnd), "dd/MM/yy", { locale: fr })}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-cyan-500 mt-2 flex items-center gap-1 group-hover:underline">
                                        Voir mes factures &rarr;
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                    <CreditCard className="h-5 w-5 text-cyan-600" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* LIGNE 2: Layout principal en 2 colonnes */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                        {/* Colonne Gauche (3/5) */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Statut de conformité */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-500">
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                    {/* Sticker conformité premium circulaire */}
                                    <div className="relative min-w-full md:min-w-[320px] lg:min-w-[340px] rounded-[28px] border border-blue-100 bg-gradient-to-br from-[#f4f8ff] via-white to-[#edf4ff] p-5 shadow-[0_20px_45px_rgba(32,72,191,0.12)] overflow-hidden">
                                        <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#679CFF]/20 blur-2xl" />
                                        <div className="absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-[#2048BF]/15 blur-2xl" />

                                        <div className="relative">
                                            <div className="mb-4 flex items-center justify-end">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                    isSuspended ? "bg-rose-100 text-rose-700" :
                                                    !data.hasCoreCompliance ? "bg-amber-100 text-amber-700" :
                                                    "bg-emerald-100 text-emerald-700"
                                                }`}>
                                                    {isSuspended ? "Suspendu" : !data.hasCoreCompliance ? "À mettre à jour" : "Conforme"}
                                                </span>
                                            </div>

                                            <div className="mx-auto w-full max-w-[320px] [font-family:'Nohemi',sans-serif]">
                                                <div className="relative mx-auto h-[252px] w-[252px] rounded-full bg-[conic-gradient(from_210deg,_#dbe7ff_0deg,_#2f5dd5_140deg,_#173c9f_260deg,_#dbe7ff_360deg)] p-[12px] shadow-[0_16px_35px_rgba(23,60,159,0.35)]">
                                                    <div className="relative h-full w-full overflow-hidden rounded-full border border-[#dce8ff] bg-white px-6 pt-5 pb-8 text-center">
                                                        <svg
                                                            className="absolute inset-x-0 -top-1 mx-auto"
                                                            width="228"
                                                            height="92"
                                                            viewBox="0 0 228 92"
                                                            fill="none"
                                                            aria-hidden="true"
                                                        >
                                                            <path id="icpp-arc-title" d="M 24 68 Q 114 -6 204 68" fill="none" />
                                                            <text
                                                                fill="#12327f"
                                                                fontSize="15"
                                                                fontWeight="700"
                                                                letterSpacing="2.3"
                                                                style={{ textTransform: "uppercase" }}
                                                            >
                                                                <textPath href="#icpp-arc-title" startOffset="50%" textAnchor="middle">
                                                                    ICPP CONFORMITE
                                                                </textPath>
                                                            </text>
                                                        </svg>

                                                        <div className="mt-8 mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-[#f3f7ff] shadow-[inset_0_0_0_1px_rgba(141,170,238,0.35)]">
                                                            <Image
                                                                src="/logo.png"
                                                                alt="Logo ICPP"
                                                                width={38}
                                                                height={38}
                                                                className="h-9 w-auto object-contain"
                                                                priority
                                                            />
                                                        </div>

                                                        <div className="mt-3">
                                                            <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Plan</p>
                                                            <p className="text-[24px] leading-none font-bold text-[#12327f]">{data.subscription.plan}</p>
                                                        </div>

                                                        <div className="absolute left-1/2 bottom-11 flex w-[174px] -translate-x-1/2 items-center justify-between text-center">
                                                            <div className="w-[78px]">
                                                                <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Debut</p>
                                                                <p className="text-[14px] font-semibold leading-none text-[#12327f]">{subscriptionStartLabel}</p>
                                                            </div>
                                                            <div className="h-6 w-px bg-gradient-to-b from-transparent via-[#c9d9ff] to-transparent" />
                                                            <div className="w-[78px]">
                                                                <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">Validite</p>
                                                                <p className="text-[14px] font-semibold leading-none text-[#12327f]">{subscriptionEndLabel}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checklist à droite */}
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-slate-900 mb-4 text-center md:text-left">Statut de conformité</h2>
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
                                        <Link href="/dashboard/documents" className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                            Voir tous les documents <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Actions rapides */}
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                                    <Link href="/dashboard/duerp" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group lg:space-x-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900">Mon DUERP</p>
                                                <p className="text-sm text-slate-500 truncate">Consulter et télécharger votre document</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                    </Link>

                                    <Link href="/dashboard/signalements" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Bell className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900">Signaler un changement</p>
                                                <p className="text-sm text-slate-500 truncate">Indiquer une nouvelle embauche, départ...</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                    </Link>

                                    <Link href="/dashboard/salaries" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Users className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900">Mes salariés</p>
                                                <p className="text-sm text-slate-500 truncate">Gérer les informations de votre équipe</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                    </Link>

                                    <Link href="/dashboard/affichages" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                <Download className="h-5 w-5 text-slate-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900">Affichages obligatoires</p>
                                                <p className="text-sm text-slate-500 truncate">Télécharger les affiches légales</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Colonne Droite (2/5) */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Profil Contact */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-center mb-3">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                                        {data.companyName.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <p className="font-semibold text-slate-900">{data.companyName}</p>
                                <p className="text-sm text-slate-500">Profil Entreprise</p>
                                <div className="flex justify-center mt-3">
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-200">
                                        Accompagné par ICPP
                                    </span>
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full mt-4 text-sm flex justify-center">
                                    <Link href="/dashboard/parametres">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Voir mon profil
                                    </Link>
                                </Button>
                            </div>

                            {/* Prochains rappels */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <h3 className="font-semibold text-slate-900">Prochains rappels</h3>
                                <p className="text-xs text-slate-400 mb-3">Échéances à venir</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                                            <Calendar className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">Mise à jour DUERP</p>
                                            <p className="text-xs text-slate-500">Décembre 2026</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">Vérification extincteurs</p>
                                            <p className="text-xs text-slate-500">Dans 45 jours</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/dashboard/signalements" className="mt-3 text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                                    Tous les rappels <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Mon équipe */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <h3 className="font-semibold text-slate-900">Mon équipe</h3>
                                <p className="text-xs text-slate-400 mb-3">{data.employeeCount} salariés déclarés</p>
                                <div className="flex -space-x-2 mb-3">
                                    {["SF", "JC", "M"].map((l, i) => (
                                        <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                                            {l}
                                        </div>
                                    ))}
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full text-sm flex justify-center">
                                    <Link href="/dashboard/salaries">
                                        Gérer mes salariés
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* LIGNE 3: Support ICPP */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Phone className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Support ICPP</h3>
                                <p className="text-sm text-slate-500">Notre équipe est à votre disposition pour vous accompagner.</p>
                            </div>
                        </div>
                        <Button variant="outline" className="text-sm w-full sm:w-auto">
                            <Phone className="h-4 w-4 mr-2" />
                            Support
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
