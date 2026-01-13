import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Risk {
    id: string
    name: string
    description: string
    severity: "low" | "medium" | "high"
}

interface RiskSelectorProps {
    risks: Risk[]
    selectedRisks: string[]
    onToggle: (riskId: string) => void
}

/**
 * Risk selector with checkboxes
 * Figma: DUERP/RiskSelector
 */
export function RiskSelector({ risks, selectedRisks, onToggle }: RiskSelectorProps) {
    const getSeverityColor = (severity: Risk["severity"]) => {
        switch (severity) {
            case "high":
                return "text-red-600"
            case "medium":
                return "text-yellow-600"
            case "low":
                return "text-green-600"
        }
    }

    return (
        <div className="space-y-4">
            {risks.map((risk) => (
                <Card key={risk.id} className="p-4">
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id={risk.id}
                            checked={selectedRisks.includes(risk.id)}
                            onCheckedChange={() => onToggle(risk.id)}
                        />
                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <Label
                                    htmlFor={risk.id}
                                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {risk.name}
                                </Label>
                                <AlertTriangle className={`h-4 w-4 ${getSeverityColor(risk.severity)}`} />
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{risk.description}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
