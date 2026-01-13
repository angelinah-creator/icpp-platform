import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
    id: number
    title: string
    description: string
}

interface WizardStepsProps {
    steps: Step[]
    currentStep: number
}

/**
 * Wizard step indicator
 * Figma: DUERP/WizardSteps
 */
export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
    return (
        <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isComplete = index < currentStep
                    const isCurrent = index === currentStep
                    const isUpcoming = index > currentStep

                    return (
                        <li key={step.id} className="relative flex-1">
                            {/* Line */}
                            {index !== 0 && (
                                <div
                                    className={cn(
                                        "absolute left-0 top-4 -ml-px h-0.5 w-full",
                                        isComplete ? "bg-primary" : "bg-gray-200"
                                    )}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Step */}
                            <div className="group relative flex flex-col items-center">
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                                        isComplete &&
                                        "border-primary bg-primary text-white",
                                        isCurrent &&
                                        "border-primary bg-white text-primary",
                                        isUpcoming && "border-gray-300 bg-white text-gray-500"
                                    )}
                                >
                                    {isComplete ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step.id}</span>
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium",
                                        isCurrent ? "text-primary" : "text-gray-500"
                                    )}
                                >
                                    {step.title}
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
