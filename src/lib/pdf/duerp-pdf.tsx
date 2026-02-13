import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

const colors = {
    primary: "#1E3A8A",
    primaryLight: "#3B82F6",
    headerBg: "#1E3A8A",
    headerText: "#FFFFFF",
    sectionBg: "#EFF6FF",
    border: "#D1D5DB",
    borderLight: "#E5E7EB",
    text: "#1F2937",
    textLight: "#6B7280",
    danger: "#DC2626",
    warning: "#D97706",
    success: "#059669",
    white: "#FFFFFF",
}

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: colors.white,
        padding: 35,
        fontFamily: "Helvetica",
    },
    // Page de garde
    coverPage: {
        flexDirection: "column",
        backgroundColor: colors.white,
        padding: 40,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Helvetica",
    },
    coverTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.primary,
        textAlign: "center",
        marginBottom: 8,
    },
    coverSubtitle: {
        fontSize: 14,
        color: colors.textLight,
        textAlign: "center",
        marginBottom: 40,
    },
    coverInfoBox: {
        backgroundColor: colors.sectionBg,
        border: `1px solid ${colors.primaryLight}`,
        borderRadius: 6,
        padding: 20,
        width: "80%",
        marginBottom: 20,
    },
    coverInfoRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    coverInfoLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: colors.primary,
        width: "35%",
    },
    coverInfoValue: {
        fontSize: 10,
        color: colors.text,
        width: "65%",
    },
    // Section
    sectionHeader: {
        backgroundColor: colors.headerBg,
        padding: 8,
        marginBottom: 10,
        marginTop: 15,
    },
    sectionHeaderText: {
        fontSize: 12,
        fontWeight: "bold",
        color: colors.headerText,
    },
    sectionSubHeader: {
        backgroundColor: colors.sectionBg,
        padding: 6,
        marginBottom: 8,
        marginTop: 10,
        borderLeft: `3px solid ${colors.primaryLight}`,
    },
    sectionSubHeaderText: {
        fontSize: 10,
        fontWeight: "bold",
        color: colors.primary,
    },
    // Tableau
    table: {
        marginTop: 5,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: `1px solid ${colors.borderLight}`,
        minHeight: 24,
        alignItems: "center",
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: colors.primary,
        minHeight: 28,
        alignItems: "center",
    },
    tableHeaderCell: {
        fontSize: 8,
        fontWeight: "bold",
        color: colors.headerText,
        padding: 4,
    },
    tableCell: {
        fontSize: 8,
        color: colors.text,
        padding: 4,
    },
    tableCellBold: {
        fontSize: 8,
        fontWeight: "bold",
        color: colors.text,
        padding: 4,
    },
    // Niveaux de risque
    riskHigh: {
        backgroundColor: "#FEE2E2",
        color: colors.danger,
        fontSize: 8,
        fontWeight: "bold",
        padding: 2,
        textAlign: "center",
        borderRadius: 2,
    },
    riskMedium: {
        backgroundColor: "#FEF3C7",
        color: colors.warning,
        fontSize: 8,
        fontWeight: "bold",
        padding: 2,
        textAlign: "center",
        borderRadius: 2,
    },
    riskLow: {
        backgroundColor: "#D1FAE5",
        color: colors.success,
        fontSize: 8,
        fontWeight: "bold",
        padding: 2,
        textAlign: "center",
        borderRadius: 2,
    },
    // Texte
    text: {
        fontSize: 9,
        color: colors.text,
        marginBottom: 4,
        lineHeight: 1.5,
    },
    textSmall: {
        fontSize: 8,
        color: colors.textLight,
        marginBottom: 2,
    },
    // Signature
    signatureBlock: {
        marginTop: 30,
        borderTop: `2px solid ${colors.primary}`,
        paddingTop: 15,
    },
    signatureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    signatureCol: {
        width: "45%",
    },
    signatureLabel: {
        fontSize: 9,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 4,
    },
    signatureValue: {
        fontSize: 9,
        color: colors.text,
        marginBottom: 2,
    },
    signatureLine: {
        borderBottom: `1px solid ${colors.border}`,
        marginTop: 30,
        marginBottom: 5,
    },
    // Footer
    footer: {
        position: "absolute",
        bottom: 20,
        left: 35,
        right: 35,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTop: `1px solid ${colors.borderLight}`,
        paddingTop: 8,
    },
    footerText: {
        fontSize: 7,
        color: colors.textLight,
    },
    // Cadre légal
    legalBox: {
        backgroundColor: "#F9FAFB",
        border: `1px solid ${colors.borderLight}`,
        borderRadius: 4,
        padding: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    legalText: {
        fontSize: 8,
        color: colors.textLight,
        lineHeight: 1.6,
        marginBottom: 3,
    },
})

export interface DuerpEvaluation {
    risqueNom: string
    categorieNom: string
    uniteTravail: string
    frequence: number
    gravite: number
    niveauRisque: number
    mesuresAppliquees: string[]
    observations?: string
}

export interface DuerpPdfData {
    company: {
        name: string
        siret: string
        address: string
        city: string
        postalCode?: string
        employeeCount: number
        metier?: string
        contactName?: string
        contactRole?: string
    }
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

function getRiskStyle(niveau: number) {
    if (niveau >= 16) return styles.riskHigh
    if (niveau >= 8) return styles.riskMedium
    return styles.riskLow
}

function getRiskLabel(niveau: number) {
    if (niveau >= 16) return "Critique"
    if (niveau >= 8) return "Modéré"
    return "Faible"
}

function formatDate(date: Date | string) {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

function groupByUT(evaluations: DuerpEvaluation[]) {
    const groups: Record<string, DuerpEvaluation[]> = {}
    for (const ev of evaluations) {
        const key = ev.uniteTravail || "Non classé"
        if (!groups[key]) groups[key] = []
        groups[key].push(ev)
    }
    return groups
}

function PageFooter({ version }: { version: number }) {
    return (
        <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
                DUERP v{version} — Généré par ICPP Conformité
            </Text>
            <Text style={styles.footerText}>
                Document confidentiel — Ne pas diffuser sans autorisation
            </Text>
            <Text
                style={styles.footerText}
                render={({ pageNumber, totalPages }) =>
                    `Page ${pageNumber} / ${totalPages}`
                }
            />
        </View>
    )
}

export function DuerpPdfDocument({ data }: { data: DuerpPdfData }) {
    const grouped = groupByUT(data.evaluations)
    const totalRisques = data.evaluations.length
    const risquesCritiques = data.evaluations.filter(
        (e) => e.niveauRisque >= 16
    ).length
    const risquesModeres = data.evaluations.filter(
        (e) => e.niveauRisque >= 8 && e.niveauRisque < 16
    ).length

    return (
        <Document>
            {/* PAGE DE GARDE */}
            <Page size="A4" style={styles.coverPage}>
                <Text style={styles.coverTitle}>
                    Document Unique d&apos;Évaluation
                </Text>
                <Text style={styles.coverTitle}>
                    des Risques Professionnels
                </Text>
                <Text style={styles.coverSubtitle}>DUERP</Text>

                <View style={styles.coverInfoBox}>
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>
                            Raison sociale :
                        </Text>
                        <Text style={styles.coverInfoValue}>
                            {data.company.name}
                        </Text>
                    </View>
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>SIRET :</Text>
                        <Text style={styles.coverInfoValue}>
                            {data.company.siret || "Non renseigné"}
                        </Text>
                    </View>
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>Adresse :</Text>
                        <Text style={styles.coverInfoValue}>
                            {data.company.address},{" "}
                            {data.company.postalCode || ""} {data.company.city}
                        </Text>
                    </View>
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>Effectif :</Text>
                        <Text style={styles.coverInfoValue}>
                            {data.company.employeeCount} salarié
                            {data.company.employeeCount > 1 ? "s" : ""}
                        </Text>
                    </View>
                    {data.company.metier && (
                        <View style={styles.coverInfoRow}>
                            <Text style={styles.coverInfoLabel}>
                                Secteur :
                            </Text>
                            <Text style={styles.coverInfoValue}>
                                {data.company.metier}
                            </Text>
                        </View>
                    )}
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>
                            Responsable :
                        </Text>
                        <Text style={styles.coverInfoValue}>
                            {data.company.contactName || "Non renseigné"}
                            {data.company.contactRole
                                ? ` (${data.company.contactRole})`
                                : ""}
                        </Text>
                    </View>
                </View>

                <View style={styles.coverInfoBox}>
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>Version :</Text>
                        <Text style={styles.coverInfoValue}>
                            {data.version}
                        </Text>
                    </View>
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>
                            Date de création :
                        </Text>
                        <Text style={styles.coverInfoValue}>
                            {formatDate(data.createdAt)}
                        </Text>
                    </View>
                    {data.updatedAt && (
                        <View style={styles.coverInfoRow}>
                            <Text style={styles.coverInfoLabel}>
                                Dernière MAJ :
                            </Text>
                            <Text style={styles.coverInfoValue}>
                                {formatDate(data.updatedAt)}
                            </Text>
                        </View>
                    )}
                    {data.nextReviewDate && (
                        <View style={styles.coverInfoRow}>
                            <Text style={styles.coverInfoLabel}>
                                Prochaine révision :
                            </Text>
                            <Text style={styles.coverInfoValue}>
                                {formatDate(data.nextReviewDate)}
                            </Text>
                        </View>
                    )}
                    <View style={styles.coverInfoRow}>
                        <Text style={styles.coverInfoLabel}>Statut :</Text>
                        <Text style={styles.coverInfoValue}>
                            {data.signature ? "Signé" : data.status}
                        </Text>
                    </View>
                    {data.auditorName && (
                        <View style={styles.coverInfoRow}>
                            <Text style={styles.coverInfoLabel}>
                                Auditeur ICPP :
                            </Text>
                            <Text style={styles.coverInfoValue}>
                                {data.auditorName}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.textSmall}>
                    Document élaboré avec l&apos;accompagnement ICPP —
                    Conformité réglementaire
                </Text>
            </Page>

            {/* PAGE CADRE LÉGAL */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        1. CADRE LÉGAL ET RÉGLEMENTAIRE
                    </Text>
                </View>

                <View style={styles.legalBox}>
                    <Text style={styles.legalText}>
                        Le Document Unique d&apos;Évaluation des Risques
                        Professionnels (DUERP) est obligatoire pour toute
                        entreprise dès l&apos;embauche du premier salarié
                        (article R4121-1 du Code du travail).
                    </Text>
                    <Text style={styles.legalText}>
                        Il recense l&apos;ensemble des risques pour la santé et
                        la sécurité des travailleurs, consigne les résultats de
                        l&apos;évaluation des risques et propose un plan
                        d&apos;action de prévention.
                    </Text>
                    <Text style={styles.legalText}>
                        Conformément à l&apos;article L4121-3 du Code du
                        travail, l&apos;employeur doit évaluer les risques pour
                        la santé et la sécurité des travailleurs, y compris dans
                        le choix des procédés de fabrication, des équipements,
                        des substances ou préparations chimiques, et dans
                        l&apos;aménagement des lieux de travail.
                    </Text>
                    <Text style={styles.legalText}>
                        La mise à jour est obligatoire au minimum une fois par
                        an (entreprises de 11 salariés et plus), lors de toute
                        décision d&apos;aménagement important, et lorsqu&apos;une
                        information supplémentaire intéressant l&apos;évaluation
                        d&apos;un risque est recueillie.
                    </Text>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        2. MÉTHODOLOGIE D&apos;ÉVALUATION
                    </Text>
                </View>

                <Text style={styles.text}>
                    L&apos;évaluation repose sur la méthode Fréquence ×
                    Gravité (F × G). Chaque risque est coté selon deux
                    critères :
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: "20%" },
                            ]}
                        >
                            Critère
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: "15%" },
                            ]}
                        >
                            1 - Très faible
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: "15%" },
                            ]}
                        >
                            2 - Faible
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: "15%" },
                            ]}
                        >
                            3 - Moyen
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: "15%" },
                            ]}
                        >
                            4 - Élevé
                        </Text>
                        <Text
                            style={[
                                styles.tableHeaderCell,
                                { width: "20%" },
                            ]}
                        >
                            5 - Très élevé
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[styles.tableCellBold, { width: "20%" }]}
                        >
                            Fréquence (F)
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Très rare
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Rare
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Occasionnel
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Fréquent
                        </Text>
                        <Text style={[styles.tableCell, { width: "20%" }]}>
                            Très fréquent
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[styles.tableCellBold, { width: "20%" }]}
                        >
                            Gravité (G)
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Bénin
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Léger
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Grave
                        </Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Très grave
                        </Text>
                        <Text style={[styles.tableCell, { width: "20%" }]}>
                            Mortel
                        </Text>
                    </View>
                </View>

                <Text style={styles.text}>
                    Niveaux de risque (F × G) : Faible (1-7) / Modéré
                    (8-15) / Critique (16-25)
                </Text>

                {/* Synthèse */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        3. SYNTHÈSE DE L&apos;ÉVALUATION
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginBottom: 10,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.sectionBg,
                            padding: 10,
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: colors.primary,
                            }}
                        >
                            {totalRisques}
                        </Text>
                        <Text style={styles.textSmall}>
                            Risques identifiés
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#FEE2E2",
                            padding: 10,
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: colors.danger,
                            }}
                        >
                            {risquesCritiques}
                        </Text>
                        <Text style={styles.textSmall}>
                            Risques critiques
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#FEF3C7",
                            padding: 10,
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: colors.warning,
                            }}
                        >
                            {risquesModeres}
                        </Text>
                        <Text style={styles.textSmall}>
                            Risques modérés
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#D1FAE5",
                            padding: 10,
                            borderRadius: 4,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: colors.success,
                            }}
                        >
                            {totalRisques - risquesCritiques - risquesModeres}
                        </Text>
                        <Text style={styles.textSmall}>
                            Risques faibles
                        </Text>
                    </View>
                </View>

                <Text style={styles.text}>
                    Unités de travail évaluées :{" "}
                    {Object.keys(grouped).length}
                </Text>

                <PageFooter version={data.version} />
            </Page>

            {/* PAGES ÉVALUATION DES RISQUES PAR UT */}
            <Page size="A4" style={styles.page} orientation="landscape">
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        4. ÉVALUATION DES RISQUES PAR UNITÉ DE TRAVAIL
                    </Text>
                </View>

                {Object.entries(grouped).map(([ut, evals]) => (
                    <View key={ut} wrap={false}>
                        <View style={styles.sectionSubHeader}>
                            <Text style={styles.sectionSubHeaderText}>
                                {ut} — {evals.length} risque
                                {evals.length > 1 ? "s" : ""}
                            </Text>
                        </View>

                        <View style={styles.table}>
                            <View style={styles.tableHeaderRow}>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "12%" },
                                    ]}
                                >
                                    Catégorie
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "18%" },
                                    ]}
                                >
                                    Risque identifié
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "6%" },
                                    ]}
                                >
                                    F
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "6%" },
                                    ]}
                                >
                                    G
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "6%" },
                                    ]}
                                >
                                    F×G
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "10%" },
                                    ]}
                                >
                                    Niveau
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "28%" },
                                    ]}
                                >
                                    Mesures de prévention
                                </Text>
                                <Text
                                    style={[
                                        styles.tableHeaderCell,
                                        { width: "14%" },
                                    ]}
                                >
                                    Observations
                                </Text>
                            </View>

                            {evals.map((ev, idx) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "12%" },
                                        ]}
                                    >
                                        {ev.categorieNom}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCellBold,
                                            { width: "18%" },
                                        ]}
                                    >
                                        {ev.risqueNom}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "6%", textAlign: "center" },
                                        ]}
                                    >
                                        {ev.frequence}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "6%", textAlign: "center" },
                                        ]}
                                    >
                                        {ev.gravite}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "6%", textAlign: "center" },
                                        ]}
                                    >
                                        {ev.niveauRisque}
                                    </Text>
                                    <View
                                        style={{
                                            width: "10%",
                                            padding: 4,
                                        }}
                                    >
                                        <Text
                                            style={getRiskStyle(
                                                ev.niveauRisque
                                            )}
                                        >
                                            {getRiskLabel(ev.niveauRisque)}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "28%" },
                                        ]}
                                    >
                                        {ev.mesuresAppliquees.length > 0
                                            ? ev.mesuresAppliquees.join(", ")
                                            : "Aucune mesure définie"}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            { width: "14%" },
                                        ]}
                                    >
                                        {ev.observations || "—"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {data.evaluations.length === 0 && (
                    <Text style={styles.text}>
                        Aucune évaluation de risque enregistrée.
                    </Text>
                )}

                <PageFooter version={data.version} />
            </Page>

            {/* PAGE SIGNATURE */}
            <Page size="A4" style={styles.page}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeaderText}>
                        5. VALIDATION ET SIGNATURE
                    </Text>
                </View>

                <Text style={styles.text}>
                    Le présent Document Unique d&apos;Évaluation des
                    Risques Professionnels a été élaboré conformément aux
                    articles R4121-1 et suivants du Code du travail, avec
                    l&apos;accompagnement d&apos;ICPP.
                </Text>

                <Text style={styles.text}>
                    Le signataire certifie l&apos;exactitude des
                    informations contenues dans ce document et
                    s&apos;engage à mettre en œuvre les mesures de
                    prévention identifiées.
                </Text>

                <View style={styles.signatureBlock}>
                    <View style={styles.signatureRow}>
                        {/* Colonne employeur */}
                        <View style={styles.signatureCol}>
                            <Text style={styles.signatureLabel}>
                                L&apos;employeur / Responsable
                            </Text>
                            {data.signature ? (
                                <>
                                    <Text style={styles.signatureValue}>
                                        Nom : {data.signature.signerName}
                                    </Text>
                                    {data.signature.signerRole && (
                                        <Text style={styles.signatureValue}>
                                            Fonction :{" "}
                                            {data.signature.signerRole}
                                        </Text>
                                    )}
                                    <Text style={styles.signatureValue}>
                                        Date de signature :{" "}
                                        {formatDate(data.signature.signedAt)}
                                    </Text>
                                    <View
                                        style={{
                                            marginTop: 8,
                                            backgroundColor: "#D1FAE5",
                                            padding: 6,
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 8,
                                                color: colors.success,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            DOCUMENT SIGNÉ ÉLECTRONIQUEMENT
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 7,
                                                color: colors.textLight,
                                            }}
                                        >
                                            {data.signature.certificationText}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.signatureValue}>
                                        Nom : ____________________
                                    </Text>
                                    <Text style={styles.signatureValue}>
                                        Fonction : ____________________
                                    </Text>
                                    <View style={styles.signatureLine} />
                                    <Text style={styles.textSmall}>
                                        Signature
                                    </Text>
                                </>
                            )}
                        </View>

                        {/* Colonne auditeur ICPP */}
                        <View style={styles.signatureCol}>
                            <Text style={styles.signatureLabel}>
                                L&apos;auditeur ICPP
                            </Text>
                            <Text style={styles.signatureValue}>
                                Nom :{" "}
                                {data.auditorName || "____________________"}
                            </Text>
                            <View style={styles.signatureLine} />
                            <Text style={styles.textSmall}>Signature</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.legalBox}>
                    <Text style={styles.legalText}>
                        Ce document est conservé et mis à disposition des
                        travailleurs, du CSE, du médecin du travail, de
                        l&apos;inspection du travail et des agents de la
                        CARSAT/CRAMIF.
                    </Text>
                    <Text style={styles.legalText}>
                        Les versions successives du document unique sont
                        conservées pendant une durée de 40 ans à compter
                        de leur élaboration (loi n°2021-1018 du 2 août
                        2021).
                    </Text>
                </View>

                <PageFooter version={data.version} />
            </Page>
        </Document>
    )
}
