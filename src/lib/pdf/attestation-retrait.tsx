import fs from "fs"
import path from "path"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer"

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
const s = StyleSheet.create({
    page: { backgroundColor: "#FFFFFF", fontFamily: "Helvetica", color: "#1e293b", padding: 0, position: "relative" },
    styleHeader: { position: "absolute", top: 0, left: 0, right: 0, height: 12, width: "100%", objectFit: "cover" },
    container: { paddingTop: 50, paddingHorizontal: 55, paddingBottom: 60, flex: 1 },
    headerFlex: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 50 },
    logo: { width: 200, height: 40, objectFit: "contain" },
    headerRight: { alignItems: "flex-start", maxWidth: 200 },
    headerCompany: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#0f172a", marginBottom: 3 },
    headerActivity: { fontSize: 10, color: "#475569" },
    // Title
    titleBlock: { marginBottom: 40, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: "#e2e8f0" },
    title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#031F5C", textAlign: "center", letterSpacing: 0.5 },
    subtitle: { fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 6 },
    // Alert band
    alertBand: { backgroundColor: "#fef3c7", borderLeftWidth: 4, borderLeftColor: "#f59e0b", padding: 12, marginBottom: 30, borderRadius: 4 },
    alertText: { fontSize: 11, color: "#92400e", fontFamily: "Helvetica-Bold" },
    alertSub: { fontSize: 10, color: "#78350f", marginTop: 4 },
    // Body
    paragraph: { fontSize: 11, color: "#475569", lineHeight: 1.6, marginBottom: 16 },
    boldDark: { fontFamily: "Helvetica-Bold", color: "#0f172a" },
    // Info table
    infoTable: { marginBottom: 30 },
    infoRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", paddingVertical: 8 },
    infoLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#64748b", width: 180 },
    infoValue: { fontSize: 10, color: "#0f172a", flex: 1 },
    // Motif
    motifBlock: { backgroundColor: "#f8fafc", borderRadius: 6, padding: 14, marginBottom: 28, borderWidth: 1, borderColor: "#e2e8f0" },
    motifTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
    motifText: { fontSize: 11, color: "#334155", lineHeight: 1.5 },
    // Legal
    legalBlock: { backgroundColor: "#eff6ff", borderRadius: 6, padding: 12, marginBottom: 28 },
    legalText: { fontSize: 9.5, color: "#1e40af", lineHeight: 1.5 },
    // Dates
    dateRow: { flexDirection: "row", gap: 20, marginBottom: 30 },
    dateBox: { flex: 1, backgroundColor: "#f8fafc", borderRadius: 6, padding: 12, borderWidth: 1, borderColor: "#e2e8f0" },
    dateLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
    dateValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0f172a" },
    // Signature
    signatureRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    signatureBox: { width: 200 },
    signatureLabel: { fontSize: 9, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
    signatureLine: { borderBottomWidth: 1, borderBottomColor: "#cbd5e1", marginBottom: 4 },
    signatureImage: { width: 80, height: 50, objectFit: "contain", marginBottom: 6 },
    titulaireImage: { width: 140, height: 30, objectFit: "contain" },
    // Footer
    footerBlock: { position: "absolute", bottom: 40, left: 55, right: 55, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    footerColumn: { flexDirection: "row", marginBottom: 4 },
    footerLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#0f172a", width: 60 },
    footerValue: { fontSize: 8, color: "#475569", width: 140 },
})

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AttestationRetraitProps {
    company: {
        name: string
        siret?: string | null
        address?: string | null
        postalCode?: string | null
        city?: string | null
        metier?: string | null
    }
    oldDuerp: {
        id: string
        version: number
        signedAt?: string | Date | null
        createdAt: string | Date
    }
    newDuerp?: {
        id: string
        version: number
        createdAt: string | Date
    } | null
    motif: "MISE_A_JOUR" | "RETRAIT" | "REMPLACEMENT"
    motifDetail?: string
    generatedAt?: Date
}

const MOTIFS: Record<AttestationRetraitProps["motif"], { label: string; description: string }> = {
    MISE_A_JOUR: { label: "Mise à jour annuelle", description: "Le DUERP a été mis à jour conformément à l'obligation annuelle prévue par l'article R4121-2 du Code du travail." },
    REMPLACEMENT: { label: "Remplacement par une nouvelle version", description: "Le DUERP a été remplacé par une nouvelle version suite à des changements dans l'organisation ou les conditions de travail." },
    RETRAIT: { label: "Retrait du document", description: "Le DUERP est retiré de la circulation et archivé. L'entreprise est invitée à procéder à l'élaboration d'un nouveau DUERP." },
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AttestationRetraitPDF({
    company,
    oldDuerp,
    newDuerp,
    motif,
    motifDetail,
    generatedAt = new Date(),
}: AttestationRetraitProps) {
    const fmt = (d: string | Date | null | undefined) =>
        d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "N/A"

    const motifInfo = MOTIFS[motif]
    const today = generatedAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
    const cityLine = [company.postalCode, company.city].filter(Boolean).join(" ")

    return (
        <Document title={`Attestation de retrait DUERP — ${company.name}`}>
            <Page size="A4" style={s.page}>
                {/* Top banner */}
                <Image src={img("Style_header.png")} style={s.styleHeader} />

                <View style={s.container}>
                    {/* Header */}
                    <View style={s.headerFlex}>
                        <Image src={img("Header.png")} style={s.logo} />
                        <View style={s.headerRight}>
                            <Text style={s.headerCompany}>{company.name}</Text>
                            {company.metier && <Text style={s.headerActivity}>{company.metier}</Text>}
                        </View>
                    </View>

                    {/* Title */}
                    <View style={s.titleBlock}>
                        <Text style={s.title}>Attestation de Retrait / Mise à Jour</Text>
                        <Text style={s.subtitle}>Document Unique d&apos;Évaluation des Risques Professionnels</Text>
                    </View>

                    {/* Alert band */}
                    <View style={s.alertBand}>
                        <Text style={s.alertText}>⚠ Motif : {motifInfo.label}</Text>
                        <Text style={s.alertSub}>{motifInfo.description}</Text>
                    </View>

                    {/* Intro */}
                    <Text style={s.paragraph}>
                        Nous, soussignés <Text style={s.boldDark}>ICPP Conformité</Text>, certifions que le Document Unique d&apos;Évaluation des Risques Professionnels (DUERP) ci-dessous référencé a fait l&apos;objet d&apos;un <Text style={s.boldDark}>{motifInfo.label.toLowerCase()}</Text> à la date du <Text style={s.boldDark}>{today}</Text>.
                    </Text>

                    {/* Info table */}
                    <View style={s.infoTable}>
                        <View style={s.infoRow}>
                            <Text style={s.infoLabel}>Entreprise</Text>
                            <Text style={s.infoValue}>{company.name}</Text>
                        </View>
                        {company.siret && (
                            <View style={s.infoRow}>
                                <Text style={s.infoLabel}>SIRET</Text>
                                <Text style={s.infoValue}>{company.siret}</Text>
                            </View>
                        )}
                        {(company.address || cityLine) && (
                            <View style={s.infoRow}>
                                <Text style={s.infoLabel}>Adresse</Text>
                                <Text style={s.infoValue}>{[company.address, cityLine].filter(Boolean).join(", ")}</Text>
                            </View>
                        )}
                        <View style={s.infoRow}>
                            <Text style={s.infoLabel}>DUERP archivé — Version</Text>
                            <Text style={s.infoValue}>v{oldDuerp.version}.0 (créé le {fmt(oldDuerp.createdAt)})</Text>
                        </View>
                        {newDuerp && (
                            <View style={s.infoRow}>
                                <Text style={s.infoLabel}>Nouveau DUERP — Version</Text>
                                <Text style={s.infoValue}>v{newDuerp.version}.0 (créé le {fmt(newDuerp.createdAt)})</Text>
                            </View>
                        )}
                    </View>

                    {/* Motif détaillé */}
                    {motifDetail && (
                        <View style={s.motifBlock}>
                            <Text style={s.motifTitle}>Détail du motif</Text>
                            <Text style={s.motifText}>{motifDetail}</Text>
                        </View>
                    )}

                    {/* Dates */}
                    <View style={s.dateRow}>
                        <View style={s.dateBox}>
                            <Text style={s.dateLabel}>Date de retrait / mise à jour</Text>
                            <Text style={s.dateValue}>{today}</Text>
                        </View>
                        {newDuerp && (
                            <View style={s.dateBox}>
                                <Text style={s.dateLabel}>Nouveau DUERP en vigueur depuis</Text>
                                <Text style={s.dateValue}>{fmt(newDuerp.createdAt)}</Text>
                            </View>
                        )}
                    </View>

                    {/* Legal */}
                    <View style={s.legalBlock}>
                        <Text style={s.legalText}>
                            Conformément à l&apos;article R4121-4 du Code du travail, l&apos;employeur tient le DUERP à la disposition des travailleurs, des membres du CSE et du médecin du travail. Le présent document atteste que la version archivée est conservée et consultable sur demande pendant une durée minimale de 40 ans.
                        </Text>
                    </View>

                    {/* Signature */}
                    <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: "#475569", marginBottom: 16 }}>
                        Fait pour servir et valoir ce que de droit.
                    </Text>
                    <View style={s.signatureRow}>
                        <View style={s.signatureBox}>
                            <Text style={s.signatureLabel}>Signature ICPP Conformité</Text>
                            <View style={s.signatureLine} />
                            <Image src={img("Signature.png")} style={s.signatureImage} />
                            <Image src={img("Titulaire signature.png")} style={s.titulaireImage} />
                        </View>
                        <View style={s.signatureBox}>
                            <Text style={s.signatureLabel}>Signature employeur</Text>
                            <View style={[s.signatureLine, { height: 60 }]} />
                            <Text style={{ fontSize: 9, color: "#94a3b8", marginTop: 4 }}>
                                {company.name}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={s.footerBlock} fixed>
                    <View style={{ flex: 1 }}>
                        <View style={s.footerColumn}><Text style={s.footerLabel}>Téléphone</Text><Text style={s.footerValue}>+262 692 45 19 13</Text></View>
                        <View style={s.footerColumn}><Text style={s.footerLabel}>E-mail</Text><Text style={s.footerValue}>emmanuellekaisse@gmail.com</Text></View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={s.footerColumn}><Text style={s.footerLabel}>Site web</Text><Text style={s.footerValue}>www.icpp-conformite.fr</Text></View>
                        <View style={s.footerColumn}><Text style={s.footerLabel}>Adresse</Text><Text style={s.footerValue}>25 rue de Ponthieu, 75008 Paris</Text></View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
