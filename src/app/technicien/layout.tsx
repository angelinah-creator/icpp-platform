import { requireRole } from "@/lib/auth-helpers"
import { TechnicienLayoutShell } from "@/components/technicien/technicien-layout-shell"

export default async function TechnicienLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireRole(["TECHNICIEN"])

    return (
        <TechnicienLayoutShell user={{ name: user.name || "Technicien" }}>
            {children}
        </TechnicienLayoutShell>
    )
}
