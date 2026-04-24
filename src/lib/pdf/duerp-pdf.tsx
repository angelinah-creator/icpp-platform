import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer"
import fs from "fs"
import path from "path"

// ============================================
// IMG CACHE & LOADER
// ============================================
const imgCache: Record<string, string> = {}

function img(relPath: string): string {
    if (imgCache[relPath]) return imgCache[relPath]

    const bases = [ process.cwd(), "/app", "/opt/icpp-platform" ]
    for (const base of bases) {
        const fullPath = path.join(base, "maquettes_duerp", relPath)
        try {
            if (fs.existsSync(fullPath)) {
                const buf = fs.readFileSync(fullPath)
                const ext = path.extname(fullPath).toLowerCase()
                const mime = ext === ".png" ? "image/png" : "image/jpeg"
                const b64 = buf.toString("base64")
                const uri = `data:${mime};base64,${b64}`
                imgCache[relPath] = uri
                return uri
            }
        } catch { /* try next */ }
    }
    // Transparent 1x1 fallback
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}

// ============================================
// STYLES
// ============================================
const C = {
    navy: "#122646",
    blue: "#1d4ed8",
    blue2: "#4A90D9",
    white: "#FFFFFF",
    offWhite: "#F5F6FA",
    bodyText: "#1C2333",
    grey: "#6B7280",
    riskFaible:"#22C55E",
    riskModere:"#F59E0B",
    riskEleve: "#3B82F6",
    riskCrit:  "#EF4444",
}

const styles = StyleSheet.create({
    page: { position: "relative", backgroundColor: "#fff" },
    bg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
    // Global overlay text size reduced from 11 to 9.5 for better Figma fidelity
    overlayText: { position: "absolute", fontSize: 9.5, color: C.navy },
    bold: { fontWeight: "bold" },
    // Table page
    tablePage: { padding: 36, paddingTop: 50, paddingBottom: 50, backgroundColor: "#fff" },
    th: { backgroundColor: C.navy, color: "#fff", padding: 7, fontSize: 8, fontWeight: "bold" },
    td: { padding: 6, fontSize: 7.5, color: C.bodyText, borderBottomWidth: 1, borderBottomColor: "#eee" },
    tRow: { flexDirection: "row", minHeight: 26, alignItems: "center" }
})

export interface DuerpEvaluation {
    risqueNom: string
    categorieNom: string
    uniteTravail: string
    frequence: number
    gravite: number
    niveauRisque: number
    mesuresAppliquees: string[]
    actionCorrective?: string
    delai?: string
    responsable?: string
    observations?: string
    prioriteAction?: string
    niveauMaitrise?: string
}

export interface DuerpPdfData {
    companyName: string
    siret: string
    address: string
    city: string
    postalCode: string
    activitySector: string
    employeeCount: number
    contactName?: string
    contactRole?: string
    contactEmail?: string
    version: number
    status: string
    createdAt: Date
    updatedAt?: Date
    nextReviewDate?: Date
    evaluations: DuerpEvaluation[]
    signature?: {
        signedAt: Date
        signerName: string
        signerRole?: string
        certificationText: string
    }
    auditorName?: string
}

function fDate(date: Date | string | undefined) {
    if (!date) return "—"
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Group evaluations by Unité de Travail
function groupByUT(evaluations: DuerpEvaluation[]): Record<string, DuerpEvaluation[]> {
    const byUT: Record<string, DuerpEvaluation[]> = {}
    for (const ev of evaluations) {
        if (!byUT[ev.uniteTravail]) byUT[ev.uniteTravail] = []
        byUT[ev.uniteTravail].push(ev)
    }
    return byUT
}

function getRiskColor(niveauRisque: number): { color: string; label: string } {
    if (niveauRisque >= 16) return { color: C.riskCrit, label: "Critique" }
    if (niveauRisque >= 9)  return { color: C.riskEleve, label: "Élevé" }
    if (niveauRisque >= 5)  return { color: C.riskModere, label: "Modéré" }
    return { color: C.riskFaible, label: "Faible" }
}

const PRIORITY_COLORS: Record<string, string> = {
    "Critique": C.riskCrit,
    "Élevé": C.riskEleve,
    "Modéré": C.riskModere,
    "Faible": C.riskFaible,
}

export const DuerpPdfDocument = ({ data }: { data: DuerpPdfData }) => {
    const byUT = groupByUT(data.evaluations)

    return (
        <Document>
            {/* PAGE 1: COVER */}
            <Page size="A4" style={styles.page}>
                <Image src={img("Page1/DUERP_Page_01.jpg")} style={styles.bg} />
                <Text style={{ ...styles.overlayText, top: "52%", left: "10%", fontSize: 22, fontWeight: "bold", width: "80%", textAlign: "center" }}>
                    {data.companyName}
                </Text>
                <Text style={{ ...styles.overlayText, top: "58%", left: "10%", fontSize: 12, width: "80%", textAlign: "center", color: C.grey }}>
                    Version {data.version} — {fDate(data.createdAt)}
                </Text>
            </Page>

            {/* PAGES 2-4: INTRO */}
            <Page size="A4" style={styles.page}><Image src={img("Page2/DUERP_Page_2.jpg")} style={styles.bg} /></Page>
            <Page size="A4" style={styles.page}><Image src={img("Page3/DUERP_Page_3.jpg")} style={styles.bg} /></Page>
            <Page size="A4" style={styles.page}><Image src={img("Page4/DUERP_Page_04.jpg")} style={styles.bg} /></Page>

            {/* PAGE 5: IDENTIFICATION */}
            <Page size="A4" style={styles.page}>
                <Image src={img("Page5/DUERP_Page_05.jpg")} style={styles.bg} />
                <Text style={{ ...styles.overlayText, top: "27.6%", left: "37%" }}>{data.companyName}</Text>
                <Text style={{ ...styles.overlayText, top: "33.5%", left: "37%" }}>{data.address}, {data.postalCode} {data.city}</Text>
                <Text style={{ ...styles.overlayText, top: "39.4%", left: "37%" }}>{data.siret || "Non renseigné"}</Text>
                <Text style={{ ...styles.overlayText, top: "45.2%", left: "37%" }}>{data.activitySector}</Text>
                <Text style={{ ...styles.overlayText, top: "51.1%", left: "37%" }}>{data.employeeCount} salarié(s)</Text>

                <Text style={{ ...styles.overlayText, top: "68.3%", left: "37%" }}>{data.contactName || "Non renseigné"}</Text>
                <Text style={{ ...styles.overlayText, top: "74.2%", left: "37%" }}>{data.contactRole || "Responsable"}</Text>
                <Text style={{ ...styles.overlayText, top: "80.0%", left: "37%" }}>{data.contactEmail || "Non renseigné"}</Text>
            </Page>

            {/* PAGES 6-8: METHODOLOGY */}
            <Page size="A4" style={styles.page}><Image src={img("Page6/DUERP_Page_06.jpg")} style={styles.bg} /></Page>
            <Page size="A4" style={styles.page}><Image src={img("Page7/DUERP_Page_07.jpg")} style={styles.bg} /></Page>
            <Page size="A4" style={styles.page}><Image src={img("Page8/DUERP_Page_08.jpg")} style={styles.bg} /></Page>

            {/* PAGE 9+: TABLEAU DE SYNTHÈSE — grouped by Unité de Travail */}
            <Page size="A4" style={styles.tablePage} wrap>
                {/* Header */}
                <View style={{ marginBottom: 14, borderBottomWidth: 2, borderBottomColor: C.navy, paddingBottom: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold", color: C.navy }}>9. TABLEAU DE SYNTHÈSE DES RISQUES</Text>
                    <Text style={{ fontSize: 8.5, color: C.grey, marginTop: 3 }}>
                        Évaluation des risques professionnels par unité de travail — {fDate(data.createdAt)}
                    </Text>
                </View>

                {data.evaluations.length === 0 ? (
                    <Text style={{ fontSize: 10, color: C.grey, marginTop: 20 }}>
                        Aucune évaluation de risque renseignée pour cet établissement.
                    </Text>
                ) : (
                    <View style={{ width: "100%" }}>
                        {/* Column headers */}
                        <View style={{ flexDirection: "row", backgroundColor: C.navy, borderRadius: 3, marginBottom: 4 }}>
                            <Text style={{ ...styles.th, width: "32%" }}>Risque identifié</Text>
                            <Text style={{ ...styles.th, width: "12%", textAlign: "center" }}>F</Text>
                            <Text style={{ ...styles.th, width: "12%", textAlign: "center" }}>G</Text>
                            <Text style={{ ...styles.th, width: "14%", textAlign: "center" }}>Niveau</Text>
                            <Text style={{ ...styles.th, width: "16%" }}>Maîtrise</Text>
                            <Text style={{ ...styles.th, width: "14%", textAlign: "center" }}>Priorité</Text>
                        </View>

                        {/* Rows grouped by UT */}
                        {Object.entries(byUT).map(([utNom, evals]) => (
                            <View key={utNom} style={{ marginBottom: 8 }}>
                                {/* UT Section Header */}
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "#E8EFFE",
                                    paddingVertical: 5,
                                    paddingHorizontal: 8,
                                    borderLeftWidth: 3,
                                    borderLeftColor: C.blue2,
                                    marginBottom: 1,
                                }}>
                                    <Text style={{ fontSize: 9, fontWeight: "bold", color: C.navy, flex: 1 }}>
                                        {utNom}
                                    </Text>
                                    <Text style={{ fontSize: 7.5, color: C.grey }}>
                                        {evals.length} risque{evals.length > 1 ? "s" : ""}
                                    </Text>
                                </View>

                                {/* Risk rows */}
                                {evals.map((ev, i) => {
                                    const { color: riskColor, label: riskLabel } = getRiskColor(ev.niveauRisque)
                                    const pColor = PRIORITY_COLORS[ev.prioriteAction || ""] || C.grey

                                    return (
                                        <View
                                            key={i}
                                            style={{
                                                flexDirection: "row",
                                                backgroundColor: i % 2 === 0 ? "#F9FAFB" : "#fff",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#E5E7EB",
                                                minHeight: 22,
                                                alignItems: "center",
                                            }}
                                            wrap={false}
                                        >
                                            {/* Risque identifié */}
                                            <View style={{ width: "32%", padding: 5 }}>
                                                <Text style={{ fontSize: 7.5, color: C.bodyText, fontWeight: "bold" }}>{ev.risqueNom}</Text>
                                                <Text style={{ fontSize: 7, color: C.grey, marginTop: 1 }}>{ev.categorieNom}</Text>
                                            </View>
                                            {/* F */}
                                            <Text style={{ width: "12%", fontSize: 8.5, textAlign: "center", color: C.bodyText }}>
                                                {ev.frequence}
                                            </Text>
                                            {/* G */}
                                            <Text style={{ width: "12%", fontSize: 8.5, textAlign: "center", color: C.bodyText }}>
                                                {ev.gravite}
                                            </Text>
                                            {/* Niveau badge */}
                                            <View style={{ width: "14%", alignItems: "center", padding: 3 }}>
                                                <View style={{
                                                    backgroundColor: riskColor,
                                                    paddingVertical: 2,
                                                    paddingHorizontal: 5,
                                                    borderRadius: 4,
                                                    minWidth: 30,
                                                    alignItems: "center",
                                                }}>
                                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 7 }}>{ev.niveauRisque}</Text>
                                                </View>
                                                <Text style={{ fontSize: 6.5, color: riskColor, marginTop: 1, fontWeight: "bold" }}>{riskLabel}</Text>
                                            </View>
                                            {/* Maîtrise */}
                                            <Text style={{ width: "16%", fontSize: 7.5, padding: 5, color: C.bodyText }}>
                                                {ev.niveauMaitrise || "Aucune"}
                                            </Text>
                                            {/* Priorité badge */}
                                            <View style={{ width: "14%", alignItems: "center", padding: 3 }}>
                                                <View style={{
                                                    backgroundColor: pColor,
                                                    paddingVertical: 2,
                                                    paddingHorizontal: 4,
                                                    borderRadius: 4,
                                                    alignItems: "center",
                                                }}>
                                                    <Text style={{ color: "#fff", fontSize: 6.5, fontWeight: "bold" }}>
                                                        {ev.prioriteAction || "—"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        ))}
                    </View>
                )}
            </Page>

            {/* PAGE 10: ACTION PLAN */}
            <Page size="A4" style={styles.page}>
                <Image src={img("Page10/DUERP_Page_10.jpg")} style={styles.bg} />
            </Page>

            {/* PAGE 11: SIGNATURES */}
            <Page size="A4" style={styles.page}>
                <Image src={img("Page11/DUERP_Page_11.jpg")} style={styles.bg} />

                {data.signature ? (
                    <View style={{ position: "absolute", top: "45%", left: "12%", width: "32%" }}>
                        <Text style={{ fontSize: 9.5, color: C.navy, marginBottom: 4 }}>Signé par {data.signature.signerName}</Text>
                        <Text style={{ fontSize: 9.5, color: C.navy, marginBottom: 4 }}>Date : {fDate(data.signature.signedAt)}</Text>
                        <View style={{ backgroundColor: "#D1FAE5", padding: 7, borderRadius: 4, marginTop: 8, borderLeftWidth: 2, borderLeftColor: "#059669" }}>
                            <Text style={{ fontSize: 8, color: "#059669", fontWeight: "bold" }}>✓ APPROUVÉ</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={{ ...styles.overlayText, top: "45%", left: "12%", color: C.grey }}>
                        En attente de signature employeur...
                    </Text>
                )}

                <View style={{ position: "absolute", top: "45%", left: "55%", width: "32%" }}>
                    <Text style={{ fontSize: 9.5, color: C.navy, marginBottom: 4 }}>Cabinet ICPP Conseil</Text>
                    <Text style={{ fontSize: 9.5, color: C.navy, marginBottom: 4 }}>Auditeur : {data.auditorName || "—"}</Text>
                    <Text style={{ fontSize: 9.5, color: C.navy, marginBottom: 4 }}>Date : {fDate(data.createdAt)}</Text>
                </View>
            </Page>
        </Document>
    )
}
