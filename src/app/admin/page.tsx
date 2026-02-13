import { AdminHeader } from "@/components/admin/admin-header"
import { StatsCards } from "@/components/admin/stats-cards"
import { ComplianceCards } from "@/components/admin/compliance-cards"
import { RecentClientsTable } from "@/components/admin/recent-clients-table"
import { getAdminStats, getCompanies } from "@/server/actions/admin"

export default async function AdminDashboard() {
    // Fetch real data from database
    const statsData = await getAdminStats()
    const companiesData = await getCompanies()

    const stats = {
        totalCompanies: statsData.companies,
        activeSubscriptions: statsData.subscriptions,
        completedAudits: statsData.audits.termine,
        duerpCount: statsData.duerps,
    }

    // Calculate compliance stats from real companies
    const complianceStats = {
        compliant: companiesData.filter(c => c.statutConformite === "Conforme").length,
        partial: companiesData.filter(c => c.statutConformite === "Partiellement conforme").length,
        nonCompliant: companiesData.filter(c => c.statutConformite === "Non conforme").length,
    }

    // Transform companies for table display
    const recentClients = companiesData.slice(0, 5).map(company => ({
        id: company.id,
        name: company.nom,
        email: company.email,
        activity: company.activite,
        subscription: company.abonnement as "Essentiel" | "Pro" | "Premium",
        status: company.statutConformite as "Conforme" | "Partiellement conforme" | "Non conforme",
        duerpStatus: company.duerp as "A jour" | "En cours" | "A faire",
    }))

    return (
        <div className="bg-blue-50/10 min-h-full pb-10">
            {/* Header */}
            <AdminHeader
                title="Tableau de bord – ICPP Conformité"
                subtitle="Vue d'ensemble de l'activité et de la conformité clients"
            />

            <div className="px-8 py-8 space-y-8">
                {/* Section Cards KPIs */}
                <StatsCards stats={stats} />

                {/* Section Conformité */}
                <ComplianceCards stats={complianceStats} />

                {/* Section Tableau */}
                <RecentClientsTable clients={recentClients} />
            </div>
        </div>
    )
}
