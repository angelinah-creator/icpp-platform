"use client"

import Image from "next/image"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ComplianceGaugeProps {
    score: number // 0-100
    label?: string
    companyName: string
    planName: string
    startDate: string | null
    endDate: string | null
    isSuspended?: boolean
}

function formatDate(value: string | null) {
    if (!value) return "--/--/----"
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return "--/--/----"
    return format(parsed, "dd/MM/yyyy", { locale: fr })
}

export function ComplianceGauge({
    score,
    label = "Conforme",
    companyName,
    planName,
    startDate,
    endDate,
    isSuspended = false,
}: ComplianceGaugeProps) {
    const fromLabel = formatDate(startDate)
    const toLabel = formatDate(endDate)

    return (
        <div className="relative w-full max-w-[340px] rounded-[26px] border border-blue-100 bg-gradient-to-br from-[#f4f8ff] via-white to-[#edf4ff] p-4 shadow-[0_18px_42px_rgba(32,72,191,0.15)] overflow-hidden">
            <div className="absolute -top-10 -right-8 h-24 w-24 rounded-full bg-[#5b8cff]/20 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-[#2048BF]/15 blur-2xl" />

            <div className="relative mb-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-[#2048BF] px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase">
                    ICPP Certificat
                </span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${isSuspended ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {isSuspended ? "Suspendu" : "Actif"}
                </span>
            </div>

            <div className="relative mx-auto w-[236px]">
                <div className="relative h-[236px] w-[236px] rounded-full bg-[conic-gradient(from_220deg,_#dce8ff_0deg,_#2f5dd5_150deg,_#173c9f_285deg,_#dce8ff_360deg)] p-[11px] shadow-[0_14px_30px_rgba(20,55,140,0.34)]">
                    <div className="relative h-full w-full rounded-full border border-[#dbe6ff] bg-white">
                        <p className="pt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Identite entreprise
                        </p>

                        <div className="mt-2 flex justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d7e3ff] bg-[#f3f7ff] shadow-sm">
                                <Image
                                    src="/logo.png"
                                    alt="Logo ICPP"
                                    width={32}
                                    height={32}
                                    className="h-8 w-auto object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="mt-3 text-center">
                            <p className="text-4xl font-extrabold leading-none text-[#12327f]">{score}%</p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
                        </div>

                        <div className="mx-5 mt-4 rounded-full border border-[#d7e3ff] bg-[#f5f8ff] px-3 py-2 text-center">
                            <p className="truncate text-xs font-semibold tracking-[0.08em] text-[#12327f] uppercase">{companyName}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-blue-100 bg-white/95 px-2 py-2 text-center shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Plan</p>
                    <p className="truncate text-xs font-semibold text-slate-800">{planName}</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white/95 px-2 py-2 text-center shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Debut</p>
                    <p className="text-xs font-semibold text-slate-800">{fromLabel}</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white/95 px-2 py-2 text-center shadow-sm">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Validite</p>
                    <p className="text-xs font-semibold text-slate-800">{toLabel}</p>
                </div>
            </div>
        </div>
    )
}
