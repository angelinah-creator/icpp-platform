import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ComplianceCardsProps {
    stats: {
        compliant: number
        partial: number
        nonCompliant: number
    }
}

export function ComplianceCards({ stats }: ComplianceCardsProps) {
    const total = stats.compliant + stats.partial + stats.nonCompliant || 1 // Avoid division by zero

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Conformes */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.compliant}</div>
                            <div className="text-sm text-slate-500">Conformes</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Progress value={(stats.compliant / total) * 100} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                    </div>
                </CardContent>
            </Card>

            {/* Partiellement conformes */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.partial}</div>
                            <div className="text-sm text-slate-500">Partiellement conformes</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Progress value={(stats.partial / total) * 100} className="h-2 bg-orange-100" indicatorClassName="bg-orange-600" />
                    </div>
                </CardContent>
            </Card>

            {/* Non conformes */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.nonCompliant}</div>
                            <div className="text-sm text-slate-500">Non conformes</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Progress value={(stats.nonCompliant / total) * 100} className="h-2 bg-red-100" indicatorClassName="bg-red-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
