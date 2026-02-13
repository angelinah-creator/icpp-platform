"use client"

interface ComplianceGaugeProps {
    score: number // 0-100
    label?: string
}

export function ComplianceGauge({ score, label = "Conforme" }: ComplianceGaugeProps) {
    const radius = 70
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    const getColor = (score: number) => {
        if (score >= 80) return "#22c55e" // green
        if (score >= 60) return "#f59e0b" // orange
        return "#ef4444" // red
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        stroke={getColor(score)}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900">{score}%</span>
                    <span className="text-sm text-slate-500 mt-1">{label}</span>
                </div>
            </div>
        </div>
    )
}
