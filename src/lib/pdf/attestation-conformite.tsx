import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer"

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: {
        backgroundColor: "#FFFFFF",
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1e293b",
    },
    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
        paddingBottom: 18,
        borderBottomWidth: 2,
        borderBottomColor: "#2048BF",
    },
    headerLeft: { flex: 1 },
    headerRight: {
        backgroundColor: "#EFF4FF",
        borderRadius: 6,
        padding: 10,
        minWidth: 160,
        alignItems: "center",
    },
    brandName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#2048BF", letterSpacing: 1 },
    brandSub: { fontSize: 7, color: "#64748b", marginTop: 2, letterSpacing: 0.5 },
    badgeText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#2048BF", textAlign: "center" },
    badgeDate: { fontSize: 9, color: "#1e293b", marginTop: 4, fontFamily: "Helvetica-Bold", textAlign: "center" },

    // Title
    titleBlock: { alignItems: "center", marginBottom: 24 },
    titleLine: { backgroundColor: "#2048BF", height: 3, width: 60, marginBottom: 10 },
    title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#2048BF", textAlign: "center", letterSpacing: 0.5 },
    subtitle: { fontSize: 10, color: "#64748b", marginTop: 4, textAlign: "center" },

    // Company box
    companyBox: {
        backgroundColor: "#F8FAFF",
        borderWidth: 1,
        borderColor: "#c7d7f5",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
    },
    companyTitle: { fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
    row: { flexDirection: "row", marginBottom: 5 },
    label: { fontSize: 9, color: "#64748b", width: 140 },
    value: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e293b", flex: 1 },

    // Attestation text
    attestBlock: {
        backgroundColor: "#F0F7FF",
        borderLeftWidth: 3,
        borderLeftColor: "#2048BF",
        padding: 14,
        marginBottom: 20,
        borderRadius: 4,
    },
    attestText: { fontSize: 10, lineHeight: 1.7, color: "#1e293b" },
    attestBold: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#2048BF" },

    // Points de conformité
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#2048BF", marginBottom: 10, marginTop: 4 },
    checkItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 7 },
    checkIcon: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#16a34a",
        marginRight: 8,
        marginTop: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    checkIconText: { color: "#FFFFFF", fontSize: 8, fontFamily: "Helvetica-Bold" },
    checkText: { fontSize: 9, color: "#1e293b", flex: 1, lineHeight: 1.5 },

    // Signature block
    sigBlock: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
        marginBottom: 16,
        backgroundColor: "#FAFAFA",
    },
    sigTitle: { fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
    sigRow: { flexDirection: "row", gap: 16 },
    sigItem: { flex: 1 },
    sigLabel: { fontSize: 8, color: "#94a3b8", marginBottom: 3 },
    sigValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e293b" },
    sigLine: { borderBottomWidth: 1, borderBottomColor: "#cbd5e1", marginTop: 6, paddingTop: 6 },

    // Footer
    footer: {
        position: "absolute",
        bottom: 24,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        paddingTop: 8,
    },
    footerText: { fontSize: 7, color: "#94a3b8" },

    // Ref badge
    refBadge: {
        backgroundColor: "#2048BF",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
        marginBottom: 16,
    },
    refText: { fontSize: 7, color: "#FFFFFF", fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
})

// ─── Types ────────────────────────────────────────────────────────────────────
interface AttestationConformiteProps {
    company: {
        name: string
        siret?: string | null
        address?: string | null
        postalCode?: string | null
        city?: string | null
        metier?: string | null
        employeeCount?: number
    }
    duerp: {
        id: string
        version: number
        signedAt: string | Date
        nextReviewDate?: string | Date | null
    }
    signer: {
        name: string
        role: string
    }
    generatedAt?: Date
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AttestationConformitePDF({
    company,
    duerp,
    signer,
    generatedAt = new Date(),
}: AttestationConformiteProps) {
    const formatDate = (d: string | Date) =>
        new Date(d).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })

    const refNum = `ATT-CONF-${company.siret?.slice(-6) || "ICPP"}-v${duerp.version}-${new Date(duerp.signedAt).getFullYear()}`

    return (
        <Document title={`Attestation de Conformité - ${company.name}`}>
            <Page size="A4" style={s.page}>
                {/* Header */}
                <View style={s.header}>
                    <View style={s.headerLeft}>
                        <Text style={s.brandName}>ICPP</Text>
                        <Text style={s.brandSub}>Institut de Conformité et de Prévention Professionnelle</Text>
                    </View>
                    <View style={s.headerRight}>
                        <Text style={s.badgeText}>DATE D&apos;ÉMISSION</Text>
                        <Text style={s.badgeDate}>{formatDate(generatedAt)}</Text>
                    </View>
                </View>

                {/* Référence */}
                <View style={s.refBadge}>
                    <Text style={s.refText}>Réf. : {refNum}</Text>
                </View>

                {/* Titre */}
                <View style={s.titleBlock}>
                    <View style={s.titleLine} />
                    <Text style={s.title}>ATTESTATION DE CONFORMITÉ</Text>
                    <Text style={s.subtitle}>Document Unique d&apos;Évaluation des Risques Professionnels</Text>
                </View>

                {/* Entreprise */}
                <View style={s.companyBox}>
                    <Text style={s.companyTitle}>Entreprise concernée</Text>
                    <View style={s.row}>
                        <Text style={s.label}>Raison sociale :</Text>
                        <Text style={s.value}>{company.name}</Text>
                    </View>
                    {company.siret && (
                        <View style={s.row}>
                            <Text style={s.label}>SIRET :</Text>
                            <Text style={s.value}>{company.siret}</Text>
                        </View>
                    )}
                    {(company.address || company.city) && (
                        <View style={s.row}>
                            <Text style={s.label}>Adresse :</Text>
                            <Text style={s.value}>
                                {[company.address, company.postalCode, company.city].filter(Boolean).join(", ")}
                            </Text>
                        </View>
                    )}
                    {company.metier && (
                        <View style={s.row}>
                            <Text style={s.label}>Activité / Métier :</Text>
                            <Text style={s.value}>{company.metier}</Text>
                        </View>
                    )}
                    {company.employeeCount !== undefined && (
                        <View style={s.row}>
                            <Text style={s.label}>Effectif :</Text>
                            <Text style={s.value}>{company.employeeCount} salarié{company.employeeCount > 1 ? "s" : ""}</Text>
                        </View>
                    )}
                </View>

                {/* Texte d'attestation */}
                <View style={s.attestBlock}>
                    <Text style={s.attestText}>
                        L&apos;Institut de Conformité et de Prévention Professionnelle (<Text style={s.attestBold}>ICPP</Text>) atteste par la présente que l&apos;entreprise{" "}
                        <Text style={s.attestBold}>{company.name}</Text> dispose d&apos;un{" "}
                        <Text style={s.attestBold}>Document Unique d&apos;Évaluation des Risques Professionnels (DUERP) version {duerp.version}</Text>,
                        établi conformément aux articles <Text style={s.attestBold}>L.4121-1 à L.4121-3</Text> et{" "}
                        <Text style={s.attestBold}>R.4121-1 à R.4121-4</Text> du Code du Travail.{"\n\n"}
                        Ce document a été signé électroniquement le{" "}
                        <Text style={s.attestBold}>{formatDate(duerp.signedAt)}</Text> et est valide jusqu&apos;au{" "}
                        <Text style={s.attestBold}>
                            {duerp.nextReviewDate ? formatDate(duerp.nextReviewDate) : "Non définie"}
                        </Text>.
                    </Text>
                </View>

                {/* Points de conformité */}
                <Text style={s.sectionTitle}>Points de conformité vérifiés</Text>

                {[
                    "Document Unique d'Évaluation des Risques Professionnels (DUERP) créé et signé",
                    `DUERP version ${duerp.version} — conforme au décret n°2001-1016 du 5 novembre 2001`,
                    "Évaluation des risques par Unité de Travail réalisée",
                    "Plan d'actions préventives intégré au document",
                    "Prochaine révision planifiée conformément à l'obligation annuelle",
                ].map((item, i) => (
                    <View key={i} style={s.checkItem}>
                        <View style={s.checkIcon}>
                            <Text style={s.checkIconText}>✓</Text>
                        </View>
                        <Text style={s.checkText}>{item}</Text>
                    </View>
                ))}

                {/* Signature ICPP */}
                <View style={s.sigBlock}>
                    <Text style={s.sigTitle}>Validation et Signature ICPP</Text>
                    <View style={s.sigRow}>
                        <View style={s.sigItem}>
                            <Text style={s.sigLabel}>Signé par</Text>
                            <Text style={s.sigValue}>{signer.name}</Text>
                            <View style={s.sigLine} />
                            <Text style={s.sigLabel}>{signer.role}</Text>
                        </View>
                        <View style={s.sigItem}>
                            <Text style={s.sigLabel}>Date de signature DUERP</Text>
                            <Text style={s.sigValue}>{formatDate(duerp.signedAt)}</Text>
                            <View style={s.sigLine} />
                            <Text style={s.sigLabel}>Référence document</Text>
                            <Text style={s.sigValue}>{refNum}</Text>
                        </View>
                        <View style={s.sigItem}>
                            <Text style={s.sigLabel}>Prochaine révision</Text>
                            <Text style={s.sigValue}>
                                {duerp.nextReviewDate ? formatDate(duerp.nextReviewDate) : "Non définie"}
                            </Text>
                            <View style={s.sigLine} />
                            <Text style={s.sigLabel}>Version DUERP</Text>
                            <Text style={s.sigValue}>v{duerp.version}.0</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <Text style={s.footerText}>ICPP – Institut de Conformité et de Prévention Professionnelle</Text>
                    <Text style={s.footerText}>Document confidentiel — Usage interne et légal uniquement</Text>
                    <Text style={s.footerText}>Réf. {refNum}</Text>
                </View>
            </Page>
        </Document>
    )
}
