import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DuerpData {
    companyName: string
    activity: string
    employeeCount: number
    risks: Array<{
        name: string
        severity: "low" | "medium" | "high"
    }>
    createdAt: Date
}

interface PreviewCardProps {
    data: DuerpData
}

/**
 * Preview card for DUERP document
 * Figma: DUERP/PreviewCard
 */
export function PreviewCard({ data }: PreviewCardProps) {
    const getSeverityVariant = (severity: string) => {
        switch (severity) {
            case "high":
                return "destructive"
            case "medium":
                return "secondary"
            case "low":
                return "default"
            default:
                return "default"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Aperçu du DUERP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Company Info */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500">Entreprise</h3>
                    <p className="text-base font-medium">{data.companyName}</p>
                </div>

                <Separator />

                {/* Activity */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500">Activité</h3>
                    <p className="text-base">{data.activity}</p>
                </div>

                <Separator />

                {/* Employee Count */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500">Effectif</h3>
                    <p className="text-base">{data.employeeCount} salarié{data.employeeCount > 1 ? "s" : ""}</p>
                </div>

                <Separator />

                {/* Risks */}
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-500">Risques identifiés</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.risks.map((risk, index) => (
                            <Badge key={index} variant={getSeverityVariant(risk.severity)}>
                                {risk.name}
                            </Badge>
                        ))}
                    </div>
                    {data.risks.length === 0 && (
                        <p className="text-sm text-gray-400">Aucun risque sélectionné</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
