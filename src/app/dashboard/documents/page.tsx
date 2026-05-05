import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, CheckCircle2, Clock, AlertCircle, Eye, Download, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DocumentItem {
    id: string
    title: string
    description: string
    status: "signed" | "pending" | "todo"
    signedBy?: string
    signedDate?: string
    type: "obligatoire" | "recommande"
    realId?: string
}

async function getDocumentsData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            company: {
                include: {
                    duerps: {
                        orderBy: { version: "desc" },
                        include: { signer: true }
                    },
                    affichages: {
                        orderBy: { createdAt: "desc" }
                    }
                }
            }
        }
    })

    if (!user?.company) return null

    const allDuerps = user.company.duerps
    const activeDuerp = allDuerps.find(d => d.status === "ACTIVE")
    const archivedDuerps = allDuerps.filter(d => d.status === "ARCHIVED")

    const documents: DocumentItem[] = [
        {
            id: "duerp",
            title: "Document Unique d'Évaluation des Risques (DUERP)",
            description: activeDuerp
                ? `Version ${activeDuerp.version}.0 — ${activeDuerp.signedAt ? "Signé" : "En attente de signature"}`
                : "Aucun DUERP créé",
            status: activeDuerp?.signedAt ? "signed" : activeDuerp ? "pending" : "todo",
            signedBy: activeDuerp?.signedAt && activeDuerp.signer ? activeDuerp.signer.name : undefined,
            signedDate: activeDuerp?.signedAt ? new Date(activeDuerp.signedAt).toLocaleDateString("fr-FR") : undefined,
            type: "obligatoire",
            realId: activeDuerp?.id
        },
        // Attestation de conformité — disponible si DUERP signé
        ...(activeDuerp?.signedAt ? [{
            id: "attestation",
            title: "Attestation de Conformité DUERP",
            description: `Générée après signature du DUERP v${activeDuerp.version}.0`,
            status: "signed" as const,
            signedDate: new Date(activeDuerp.signedAt).toLocaleDateString("fr-FR"),
            type: "obligatoire" as const,
            realId: activeDuerp.id
        }] : []),
        // Affichages obligatoires depuis la DB
        ...(user.company.affichages.length > 0 ? user.company.affichages.map(a => ({
            id: `affichage-${a.id}`,
            title: (a as any).titre || "Affichage obligatoire",
            description: (a as any).description || "Document d'affichage légal obligatoire",
            status: "signed" as const,
            signedDate: new Date(a.createdAt).toLocaleDateString("fr-FR"),
            type: "obligatoire" as const,
            realId: a.id
        })) : [{
            id: "affichages-pending",
            title: "Affichages obligatoires (4 fiches)",
            description: "Fiche 1 (Coordonnées), Fiche 2 (Droits), Fiche 3 (Tabac), Fiche 4 (Incendie)",
            status: "todo" as const,
            type: "obligatoire" as const,
        }]),
        // DUERP archivés
        ...archivedDuerps.map(d => ({
            id: `duerp-archived-${d.id}`,
            title: `DUERP v${d.version}.0 (archivé)`,
            description: `Version archivée lors de la création de la version ${d.version + 1}`,
            status: "signed" as const,
            signedDate: d.signedAt ? new Date(d.signedAt).toLocaleDateString("fr-FR") : undefined,
            type: "recommande" as const,
            realId: d.id
        })),
        {
            id: "accidents",
            title: "Registre des accidents du travail",
            description: "Suivi et déclaration des accidents survenus dans l'entreprise",
            status: "todo",
            type: "recommande"
        }
    ]

    // ── Historique attestations ────────────────────────────────────────────
    // Dérivé des données DUERP existantes (sans table supplémentaire)
    const attestationHistory: Array<{
        id: string
        type: "conformite" | "retrait"
        label: string
        duerp: { id: string; version: number }
        date: string
    }> = []

    for (const d of allDuerps) {
        if (d.signedAt) {
            attestationHistory.push({
                id: `attest-conf-${d.id}`,
                type: "conformite",
                label: `Attestation de conformité — DUERP v${d.version}.0`,
                duerp: { id: d.id, version: d.version },
                date: new Date(d.signedAt).toLocaleDateString("fr-FR"),
            })
        }
        if (d.status === "ARCHIVED") {
            attestationHistory.push({
                id: `attest-ret-${d.id}`,
                type: "retrait",
                label: `Attestation de retrait — DUERP v${d.version}.0 archivé`,
                duerp: { id: d.id, version: d.version },
                date: new Date(d.updatedAt ?? d.createdAt).toLocaleDateString("fr-FR"),
            })
        }
    }

    // Trier par date décroissante
    attestationHistory.sort((a, b) => {
        const da = new Date(a.date.split("/").reverse().join("-")).getTime()
        const db = new Date(b.date.split("/").reverse().join("-")).getTime()
        return db - da
    })

    const stats = {
        signed: documents.filter(d => d.status === "signed").length,
        pending: documents.filter(d => d.status === "pending").length,
        todo: documents.filter(d => d.status === "todo").length
    }

    return { documents, stats, attestationHistory }
}



function StatCard({ icon: Icon, count, label, color }: { icon: React.ElementType, count: number, label: string, color: "green" | "orange" | "red" }) {
    const colors = {
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-500",
        red: "bg-red-50 text-red-500"
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-2xl font-semibold text-slate-900">{count}</p>
                <p className="text-sm text-slate-500">{label}</p>
            </div>
        </div>
    )
}

function DocumentRow({ doc }: { doc: DocumentItem }) {
    const getStatusBadge = () => {
        switch (doc.status) {
            case "signed":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Disponible</Badge>
            case "pending":
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">En cours</Badge>
            case "todo":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">À faire</Badge>
        }
    }

    const isArchived = doc.id.startsWith("duerp-archived-")
    const isAttestation = doc.id === "attestation"
    const isAffichage = doc.id.startsWith("affichage-")

    const getDownloadHref = () => {
        if (isAttestation && doc.realId) return `/api/duerp/${doc.realId}/attestation`
        if ((doc.id === "duerp" || isArchived) && doc.realId) return `/api/duerp/${doc.realId}/pdf`
        if (isAffichage && doc.realId) return `/api/affichages/${doc.realId}/pdf`
        return null
    }

    const downloadHref = getDownloadHref()

    return (
        <div className={`bg-white rounded-xl border p-5 flex items-center justify-between hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 group ${isArchived ? "border-slate-100 opacity-75" : "border-slate-200 hover:border-blue-200"}`}>
            <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 ${isAttestation ? "bg-green-50 group-hover:bg-green-100" : isArchived ? "bg-slate-50" : "bg-blue-50 group-hover:bg-blue-100"}`}>
                    <FileText className={`h-5 w-5 ${isAttestation ? "text-green-600" : isArchived ? "text-slate-400" : "text-blue-600"}`} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                        {getStatusBadge()}
                    </div>
                    <p className="text-sm text-slate-500">{doc.description}</p>
                    {doc.signedDate && (
                        <p className="text-xs text-slate-400 mt-1">
                            {isArchived ? "Archivé le" : "Généré le"} {doc.signedDate}{doc.signedBy ? ` par ${doc.signedBy}` : ""}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {doc.id === "duerp" && doc.realId ? (
                    <>
                        <Link href="/dashboard/duerp" className="inline-flex">
                            <Button variant="outline" size="sm" className="text-sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Consulter
                            </Button>
                        </Link>
                        {downloadHref && (
                            <a href={downloadHref} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="text-sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    PDF
                                </Button>
                            </a>
                        )}
                    </>
                ) : downloadHref ? (
                    <a href={downloadHref} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="text-sm border-green-200 text-green-700 hover:bg-green-50">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                        </Button>
                    </a>
                ) : (
                    <>
                        <Button variant="outline" size="sm" className="text-sm" disabled>
                            <Eye className="h-4 w-4 mr-2" />
                            Lire
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm opacity-50 cursor-not-allowed">
                            <Pen className="h-4 w-4 mr-2" />
                            Signer
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}


export default async function DocumentsPage() {
    const data = await getDocumentsData()
    if (!data) redirect("/login")

    const obligatoires = data.documents.filter(d => d.type === "obligatoire")
    const recommandes = data.documents.filter(d => d.type === "recommande")

    return (
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <h1 className="text-2xl font-semibold text-slate-900">Documents de Conformité</h1>
                <p className="text-slate-500 text-sm mt-0.5">Consultez et signez vos documents obligatoires</p>
            </div>

            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard icon={CheckCircle2} count={data.stats.signed} label="Signés" color="green" />
                    <StatCard icon={Clock} count={data.stats.pending} label="En cours" color="orange" />
                    <StatCard icon={AlertCircle} count={data.stats.todo} label="À signer" color="red" />
                </div>

                {/* Documents obligatoires */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Documents obligatoires</h2>
                    <div className="space-y-3">
                        {obligatoires.map((doc) => (
                            <DocumentRow key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>

                {/* Documents recommandés */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Documents recommandés</h2>
                    <div className="space-y-3">
                        {recommandes.map((doc) => (
                            <DocumentRow key={doc.id} doc={doc} />
                        ))}
                    </div>
                </div>

                {/* ── Historique des attestations ── */}
                {data.attestationHistory.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Historique des attestations</h2>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {data.attestationHistory.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                item.type === "conformite" ? "bg-emerald-50" : "bg-amber-50"
                                            }`}>
                                                {item.type === "conformite"
                                                    ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                    : <AlertCircle className="h-5 w-5 text-amber-600" />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {item.type === "conformite" ? "Générée le" : "Archivé le"} {item.date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                item.type === "conformite"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}>
                                                {item.type === "conformite" ? "Conformité" : "Retrait"}
                                            </span>
                                            <a
                                                href={item.type === "conformite"
                                                    ? `/api/duerp/${item.duerp.id}/attestation`
                                                    : `/api/duerp/${item.duerp.id}/attestation-retrait?motif=MISE_A_JOUR`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Télécharger l'attestation"
                                            >
                                                <Download className="h-4 w-4 text-slate-400 hover:text-blue-600 transition-colors" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
