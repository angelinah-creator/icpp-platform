import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer"
import fs from "fs"
import path from "path"

// ─── Image Loader ─────────────────────────────────────────────────────────────
const imgCache: Record<string, string> = {}
function img(relPath: string): string {
    if (imgCache[relPath]) return imgCache[relPath]
    const bases = [process.cwd(), "/app", "/opt/icpp-platform"]
    for (const base of bases) {
        const fullPath = path.join(base, "public/assets/attestation", relPath)
        try {
            if (fs.existsSync(fullPath)) {
                const buf = fs.readFileSync(fullPath)
                const ext = path.extname(fullPath).toLowerCase()
                const mime = ext === ".png" ? "image/png" : "image/jpeg"
                imgCache[relPath] = `data:${mime};base64,${buf.toString("base64")}`
                return imgCache[relPath]
            }
        } catch { /* ignore */ }
    }
    return ""
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const NAVY = "#031F5C"
const BLUE = "#2048BF"
const LIGHT_BLUE = "#EEF3FF"
const BORDER = "#CBD5E1"
const GRAY = "#64748B"
const DARK = "#0F172A"

const s = StyleSheet.create({
    page: { backgroundColor: "#FFFFFF", fontFamily: "Helvetica", padding: 0, position: "relative" },
    topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 8, backgroundColor: BLUE },
    container: { paddingTop: 36, paddingHorizontal: 40, paddingBottom: 60 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
    logo: { width: 180, height: 36, objectFit: "contain" },
    headerRight: { alignItems: "flex-end" },
    headerCompany: { fontSize: 11, fontFamily: "Helvetica-Bold", color: DARK },
    headerDate: { fontSize: 9, color: GRAY, marginTop: 2 },
    // Title block
    titleBlock: { backgroundColor: NAVY, borderRadius: 6, padding: 14, marginBottom: 20 },
    titleText: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#FFFFFF", letterSpacing: 0.5 },
    titleSub: { fontSize: 9, color: "#AAC4FF", marginTop: 4 },
    // Company info bar
    infoBar: { backgroundColor: LIGHT_BLUE, borderRadius: 6, padding: 10, marginBottom: 20, flexDirection: "row", gap: 20 },
    infoItem: { flexDirection: "row", gap: 5 },
    infoLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: BLUE },
    infoValue: { fontSize: 8.5, color: DARK },
    // Stats row
    statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    statBox: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 6, padding: 10, borderWidth: 1, borderColor: BORDER, alignItems: "center" },
    statNum: { fontSize: 18, fontFamily: "Helvetica-Bold", color: NAVY },
    statLabel: { fontSize: 8, color: GRAY, textAlign: "center", marginTop: 2 },
    // Table
    tableHeader: { flexDirection: "row", backgroundColor: NAVY, borderRadius: 4, paddingVertical: 7, paddingHorizontal: 6, marginBottom: 2 },
    tableHeaderCell: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#FFFFFF", textTransform: "uppercase", letterSpacing: 0.3 },
    tableRow: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: BORDER },
    tableRowAlt: { backgroundColor: LIGHT_BLUE },
    tableCell: { fontSize: 8.5, color: DARK },
    tableCellGray: { fontSize: 8, color: GRAY },
    badge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, alignSelf: "flex-start" },
    badgeCDI: { backgroundColor: "#DCFCE7" },
    badgeCDD: { backgroundColor: "#FEF3C7" },
    badgeOther: { backgroundColor: "#F1F5F9" },
    badgeText: { fontSize: 7.5, fontFamily: "Helvetica-Bold" },
    badgeTextCDI: { color: "#166534" },
    badgeTextCDD: { color: "#92400E" },
    badgeTextOther: { color: "#475569" },
    // Signature block
    sigBlock: { marginTop: 30, flexDirection: "row", justifyContent: "space-between" },
    sigBox: { width: 220 },
    sigLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: GRAY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
    sigLine: { borderBottomWidth: 1, borderBottomColor: BORDER, marginBottom: 4 },
    sigSub: { fontSize: 8, color: GRAY },
    // Footer
    footer: { position: "absolute", bottom: 28, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 6 },
    footerText: { fontSize: 7.5, color: GRAY },
    footerBold: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: NAVY },
    // Legal mention
    legal: { backgroundColor: "#FFFBEB", borderLeftWidth: 3, borderLeftColor: "#F59E0B", padding: 10, marginTop: 16, borderRadius: 3 },
    legalText: { fontSize: 8.5, color: "#78350F", lineHeight: 1.5 },
})

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SalarieRecord {
    id: string
    nom: string
    prenom: string
    poste: string
    uniteTravail: string
    dateEntree: string | Date
    dateSortie?: string | Date | null
    typeContrat: string
    tempsTravail: string
    isActive: boolean
}

export interface RegistrePersonnelProps {
    company: {
        name: string
        siret?: string | null
        address?: string | null
        postalCode?: string | null
        city?: string | null
        metier?: string | null
        employeeCount?: number
    }
    salaries: SalarieRecord[]
    generatedAt?: Date
}

const CONTRACT_LABELS: Record<string, string> = {
    CDI: "CDI",
    CDD: "CDD",
    APPRENTISSAGE: "Apprentissage",
    STAGE: "Stage",
    INTERIM: "Intérim",
    TEMPS_PARTIEL: "Temps partiel",
}

const TEMPS_LABELS: Record<string, string> = {
    COMPLET: "Temps plein",
    PARTIEL: "Temps partiel",
    SAISONNIER: "Saisonnier",
}

function fmt(d: string | Date | null | undefined): string {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function ContratBadge({ type }: { type: string }) {
    const label = CONTRACT_LABELS[type] || type
    const isCDI = type === "CDI"
    const isCDD = type === "CDD"
    return (
        <View style={[s.badge, isCDI ? s.badgeCDI : isCDD ? s.badgeCDD : s.badgeOther]}>
            <Text style={[s.badgeText, isCDI ? s.badgeTextCDI : isCDD ? s.badgeTextCDD : s.badgeTextOther]}>
                {label}
            </Text>
        </View>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RegistrePersonnelPDF({ company, salaries, generatedAt = new Date() }: RegistrePersonnelProps) {
    const actifs = salaries.filter(s => s.isActive)
    const sortis = salaries.filter(s => !s.isActive)
    const today = generatedAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    const cityLine = [company.postalCode, company.city].filter(Boolean).join(" ")

    // Colonnes widths
    const W = { nom: "18%", poste: "16%", ut: "14%", contrat: "10%", temps: "12%", entree: "11%", sortie: "11%", statut: "8%" }

    return (
        <Document title={`Registre du Personnel — ${company.name}`}>
            <Page size="A4" orientation="landscape" style={s.page}>
                <View style={s.topBar} />
                <View style={s.container}>
                    {/* Header */}
                    <View style={s.headerRow}>
                        <Image src={img("Header.png")} style={s.logo} />
                        <View style={s.headerRight}>
                            <Text style={s.headerCompany}>{company.name}</Text>
                            {company.siret && <Text style={s.headerDate}>SIRET : {company.siret}</Text>}
                            <Text style={s.headerDate}>Généré le {today}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <View style={s.titleBlock}>
                        <Text style={s.titleText}>Registre du Personnel</Text>
                        <Text style={s.titleSub}>
                            Document obligatoire — Art. L1221-13 Code du travail | Conservation : 5 ans après départ du salarié
                        </Text>
                    </View>

                    {/* Company info */}
                    <View style={s.infoBar}>
                        <View style={s.infoItem}>
                            <Text style={s.infoLabel}>Entreprise :</Text>
                            <Text style={s.infoValue}>{company.name}</Text>
                        </View>
                        {company.metier && (
                            <View style={s.infoItem}>
                                <Text style={s.infoLabel}>Activité :</Text>
                                <Text style={s.infoValue}>{company.metier}</Text>
                            </View>
                        )}
                        {(company.address || cityLine) && (
                            <View style={s.infoItem}>
                                <Text style={s.infoLabel}>Adresse :</Text>
                                <Text style={s.infoValue}>{[company.address, cityLine].filter(Boolean).join(", ")}</Text>
                            </View>
                        )}
                    </View>

                    {/* Stats */}
                    <View style={s.statsRow}>
                        <View style={s.statBox}>
                            <Text style={s.statNum}>{salaries.length}</Text>
                            <Text style={s.statLabel}>Total inscrits</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={s.statNum}>{actifs.length}</Text>
                            <Text style={s.statLabel}>Salariés actifs</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={s.statNum}>{actifs.filter(s => s.typeContrat === "CDI").length}</Text>
                            <Text style={s.statLabel}>CDI</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={s.statNum}>{actifs.filter(s => s.typeContrat === "CDD").length}</Text>
                            <Text style={s.statLabel}>CDD</Text>
                        </View>
                        <View style={s.statBox}>
                            <Text style={s.statNum}>{sortis.length}</Text>
                            <Text style={s.statLabel}>Sortis</Text>
                        </View>
                    </View>

                    {/* Table Header */}
                    <View style={s.tableHeader}>
                        <Text style={[s.tableHeaderCell, { width: W.nom }]}>Nom / Prénom</Text>
                        <Text style={[s.tableHeaderCell, { width: W.poste }]}>Poste</Text>
                        <Text style={[s.tableHeaderCell, { width: W.ut }]}>Unité de Travail</Text>
                        <Text style={[s.tableHeaderCell, { width: W.contrat }]}>Contrat</Text>
                        <Text style={[s.tableHeaderCell, { width: W.temps }]}>Temps</Text>
                        <Text style={[s.tableHeaderCell, { width: W.entree }]}>Date entrée</Text>
                        <Text style={[s.tableHeaderCell, { width: W.sortie }]}>Date sortie</Text>
                        <Text style={[s.tableHeaderCell, { width: W.statut }]}>Statut</Text>
                    </View>

                    {/* Table Rows */}
                    {salaries.map((sal, idx) => (
                        <View key={sal.id} style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]} wrap={false}>
                            <View style={{ width: W.nom }}>
                                <Text style={[s.tableCell, { fontFamily: "Helvetica-Bold" }]}>
                                    {sal.nom.toUpperCase()} {sal.prenom}
                                </Text>
                            </View>
                            <Text style={[s.tableCell, { width: W.poste }]}>{sal.poste}</Text>
                            <Text style={[s.tableCellGray, { width: W.ut }]}>{sal.uniteTravail}</Text>
                            <View style={{ width: W.contrat }}>
                                <ContratBadge type={sal.typeContrat} />
                            </View>
                            <Text style={[s.tableCellGray, { width: W.temps }]}>{TEMPS_LABELS[sal.tempsTravail] || sal.tempsTravail}</Text>
                            <Text style={[s.tableCell, { width: W.entree }]}>{fmt(sal.dateEntree)}</Text>
                            <Text style={[s.tableCellGray, { width: W.sortie }]}>{fmt(sal.dateSortie)}</Text>
                            <View style={{ width: W.statut }}>
                                <View style={[s.badge, sal.isActive ? s.badgeCDI : s.badgeOther]}>
                                    <Text style={[s.badgeText, sal.isActive ? s.badgeTextCDI : s.badgeTextOther]}>
                                        {sal.isActive ? "Actif" : "Sorti"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {salaries.length === 0 && (
                        <View style={{ paddingVertical: 20, alignItems: "center" }}>
                            <Text style={{ fontSize: 10, color: GRAY }}>Aucun salarié enregistré</Text>
                        </View>
                    )}

                    {/* Legal */}
                    <View style={s.legal}>
                        <Text style={s.legalText}>
                            Ce registre est tenu à la disposition de l'Inspecteur du travail et du médecin du travail. Il doit mentionner toute personne employée dans l'établissement, dans l'ordre chronologique des embauches (Art. L1221-13 et D1221-23 et s. du Code du travail). Conservation obligatoire : 5 ans après la date à laquelle le salarié a quitté l'établissement.
                        </Text>
                    </View>

                    {/* Signature */}
                    <View style={s.sigBlock}>
                        <View style={s.sigBox}>
                            <Text style={s.sigLabel}>Responsable de l&apos;établissement</Text>
                            <View style={[s.sigLine, { height: 40 }]} />
                            <Text style={s.sigSub}>Nom, qualité et signature</Text>
                        </View>
                        <View style={s.sigBox}>
                            <Text style={s.sigLabel}>Auditeur ICPP Conformité</Text>
                            <Image src={img("Signature.png")} style={{ width: 70, height: 44, objectFit: "contain", marginBottom: 4 }} />
                            <Image src={img("Titulaire signature.png")} style={{ width: 130, height: 26, objectFit: "contain" }} />
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <Text style={s.footerBold}>ICPP Conformité — Registre du Personnel</Text>
                    <Text style={s.footerText}>{company.name} | {today}</Text>
                    <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
                </View>
            </Page>
        </Document>
    )
}
