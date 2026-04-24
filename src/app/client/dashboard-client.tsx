"use client"

import { Shield, FileText, Users, CreditCard, Bell, Download, Calendar, Phone } from "lucide-react"
import { ClientStatCard } from "@/components/client/client-stat-card"
import { ComplianceGauge } from "@/components/client/compliance-gauge"
import { ComplianceChecklist } from "@/components/client/compliance-checklist"
import { QuickActionCard } from "@/components/client/quick-action-card"
import { Button } from "@/components/ui/button"
import { ClientDashboardData } from "@/server/actions/client-dashboard"
import Link from "next/link"

interface DashboardClientProps {
    data: ClientDashboardData
}

export function DashboardClient({ data }: DashboardClientProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-6">
                <h1 className="text-3xl font-bold text-slate-900">
                    Bienvenue, {data.companyName}
                </h1>
                <p className="text-slate-500 mt-1">Gérez votre conformité en toute sérénité</p>
            </header>

            <div className="p-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ClientStatCard
                        title="Score de conformité"
                        value={`${data.complianceScore}%`}
                        subtitle={data.complianceLevel}
                        icon={Shield}
                        variant="green"
                    />
                    <ClientStatCard
                        title="DUERP"
                        value={data.duerp.status}
                        subtitle={data.duerp.version}
                        icon={FileText}
                        variant="blue"
                    />
                    <ClientStatCard
                        title="Salariés"
                        value={data.employeeCount}
                        subtitle="Déclarés"
                        icon={Users}
                        variant="purple"
                    />
                    <ClientStatCard
                        title="Abonnement"
                        value={data.subscription.plan}
                        subtitle={data.subscription.status === "ACTIVE" ? "Actif" : "Inactif"}
                        icon={CreditCard}
                        variant="cyan"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Statut de conformité */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Statut de conformité</h2>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Gauge */}
                            <div className="flex-shrink-0 w-full lg:w-auto">
                                <ComplianceGauge
                                    score={data.complianceScore}
                                    label={data.complianceLevel}
                                    companyName={data.companyName}
                                    planName={data.subscription.plan}
                                    startDate={data.subscription.startDate}
                                    endDate={data.subscription.endDate}
                                    isSuspended={data.subscription.status !== "ACTIVE" && data.subscription.status !== "TRIALING"}
                                />
                            </div>

                            {/* Checklist */}
                            <div className="flex-1">
                                <ComplianceChecklist items={data.complianceChecklist} />
                                <Link
                                    href="/client/documents"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 inline-flex items-center"
                                >
                                    Voir tous les documents →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Contact Profile Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold">
                                    {data.companyName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{data.companyName}</p>
                                    <p className="text-sm text-slate-500">Salon de coiffure</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                                    <p className="text-xs font-medium text-green-700">✓ Accompagné par ICPP</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                Voir mon profil
                            </Button>
                        </div>

                        {/* Prochains rappels */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Prochains rappels</h3>
                            <div className="space-y-3">
                                {data.reminders.map((reminder, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${reminder.type === "duerp" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                                            }`}>
                                            {reminder.type === "duerp" ? <Calendar className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{reminder.title}</p>
                                            <p className="text-xs text-slate-500">{reminder.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/client/parametres"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-3 inline-flex items-center"
                            >
                                Tous les rappels →
                            </Link>
                        </div>

                        {/* Mon équipe */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Mon équipe</h3>
                            <p className="text-sm text-slate-500 mb-3">{data.employeeCount} salarié{data.employeeCount > 1 ? 's' : ''} déclaré{data.employeeCount > 1 ? 's' : ''}</p>
                            <div className="flex -space-x-2 mb-4">
                                {Array.from({ length: Math.min(data.employeeCount, 3) }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm font-semibold border-2 border-white"
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/client/salaries">Gérer mes salariés</Link>
                            </Button>
                        </div>

                        {/* Affichages */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-2">Affichages</h3>
                            <p className="text-sm text-slate-500 mb-4">{data.affichagesCount} documents disponibles</p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/client/affichages">
                                    <Download className="h-4 w-4 mr-2" />
                                    Télécharger
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Actions rapides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <QuickActionCard
                            title="Mon DUERP"
                            description="Consulter et télécharger votre document"
                            icon={FileText}
                            href="/client/duerp"
                        />
                        <QuickActionCard
                            title="Signaler un changement"
                            description="Consulter et télécharger votre document"
                            icon={Bell}
                            href="/client/signalements"
                        />
                        <QuickActionCard
                            title="Mes salariés"
                            description="Gérer les informations de votre équipe"
                            icon={Users}
                            href="/client/salaries"
                        />
                        <QuickActionCard
                            title="Affichages obligatoires"
                            description="Télécharger les affiches légales"
                            icon={Download}
                            href="/client/affichages"
                        />
                    </div>
                </div>

                {/* Support ICPP */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                            <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Support ICPP</h3>
                            <p className="text-sm text-slate-500">
                                Notre équipe est à votre disposition pour vous accompagner dans votre conformité réglementaire.
                            </p>
                        </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Support
                    </Button>
                </div>
            </div>
        </div>
    )
}
