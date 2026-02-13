import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
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
                        where: { status: "ACTIVE" },
                        take: 1
                    }
                }
            }
        }
    })

    if (!user?.company) return null

    const activeDuerp = user.company.duerps[0]

    const documents: DocumentItem[] = [
        {
            id: "duerp",
            title: "Document Unique d'Évaluation des Risques (DUERP)",
            description: "Évaluation obligatoire des risques professionnels dans votre entreprise",
            status: activeDuerp?.signedAt ? "signed" : "todo",
            signedBy: activeDuerp?.signedAt ? user.name || "Marie Dupont" : undefined,
            signedDate: activeDuerp?.signedAt ? "15/01/2024" : undefined,
            type: "obligatoire"
        },
        {
            id: "reglement",
            title: "Règlement intérieur",
            description: "Règles de discipline et mesures d'hygiène et sécurité",
            status: "pending",
            type: "obligatoire"
        },
        {
            id: "incendie",
            title: "Affichage des consignes de sécurité incendie",
            description: "Plan d'évacuation et consignes en cas d'incendie",
            status: "todo",
            type: "obligatoire"
        },
        {
            id: "accidents",
            title: "Registre des accidents du travail",
            description: "Plan d'évacuation et consignes en cas d'incendie",
            status: "todo",
            type: "recommande"
        }
    ]

    const stats = {
        signed: documents.filter(d => d.status === "signed").length,
        pending: documents.filter(d => d.status === "pending").length,
        todo: documents.filter(d => d.status === "todo").length
    }

    return { documents, stats }
}

function StatCard({ icon: Icon, count, label, color }: { icon: React.ElementType, count: number, label: string, color: "green" | "orange" | "red" }) {
    const colors = {
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-500",
        red: "bg-red-50 text-red-500"
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

function DocumentRow({ doc }: { doc: DocumentItem }) {
    const getStatusBadge = () => {
        switch (doc.status) {
            case "signed":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Signé</Badge>
            case "pending":
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">En cours</Badge>
            case "todo":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">À faire</Badge>
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                        {getStatusBadge()}
                    </div>
                    <p className="text-sm text-slate-500">{doc.description}</p>
                    {doc.signedDate && (
                        <p className="text-xs text-slate-400 mt-1">
                            Signé le {doc.signedDate} par {doc.signedBy}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Lire
                </Button>
                {doc.status === "signed" ? (
                    <Button variant="outline" size="sm" className="text-sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                    </Button>
                ) : (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        <Pen className="h-4 w-4 mr-2" />
                        Signer
                    </Button>
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
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <h1 className="text-2xl font-semibold text-slate-900">Documents de Conformité</h1>
                <p className="text-slate-500 text-sm mt-0.5">Consultez et signez vos documents obligatoires</p>
            </div>

            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
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
            </div>
        </div>
    )
}
