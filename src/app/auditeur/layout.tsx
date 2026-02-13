import { requireRole } from "@/lib/auth-helpers"
import { AuditeurLayoutShell } from "@/components/auditeur/auditeur-layout-shell"

export default async function AuditeurLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireRole(["AUDITOR", "COMMERCIAL"])

    return (
        <AuditeurLayoutShell user={{ name: user.name || "Auditeur" }}>
            {children}
        </AuditeurLayoutShell>
    )
}
