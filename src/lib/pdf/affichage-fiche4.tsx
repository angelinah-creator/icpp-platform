import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

const colors = {
    orange: "#EA580C",
    darkOrange: "#9A3412",
    red: "#DC2626",
    dark: "#111827",
    text: "#374151",
    muted: "#6B7280",
    border: "#D1D5DB",
    white: "#FFFFFF",
    alertBg: "#FFF7ED",
    alertBorder: "#FED7AA",
}

const styles = StyleSheet.create({
    page: { padding: 35, backgroundColor: colors.white, fontFamily: "Helvetica" },
    header: { backgroundColor: colors.orange, padding: 18, marginBottom: 20, borderRadius: 4 },
    headerTitle: { fontSize: 16, fontWeight: "bold", color: colors.white, textAlign: "center", marginBottom: 4 },
    headerSubtitle: { fontSize: 10, color: "#FED7AA", textAlign: "center" },
    alertBox: { backgroundColor: colors.alertBg, border: `2px solid ${colors.orange}`, borderRadius: 6, padding: 15, marginBottom: 15 },
    alertTitle: { fontSize: 12, fontWeight: "bold", color: colors.darkOrange, textAlign: "center", marginBottom: 8 },
    alertText: { fontSize: 9, color: colors.dark, textAlign: "center", lineHeight: 1.5 },
    sectionTitle: { fontSize: 11, fontWeight: "bold", color: colors.orange, borderBottom: `2px solid ${colors.orange}`, paddingBottom: 5, marginBottom: 10, marginTop: 14 },
    stepRow: { flexDirection: "row", marginBottom: 8, alignItems: "flex-start" },
    stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center", marginRight: 10 },
    stepNumText: { fontSize: 11, fontWeight: "bold", color: colors.white },
    stepContent: { flex: 1 },
    stepTitle: { fontSize: 10, fontWeight: "bold", color: colors.dark, marginBottom: 2 },
    stepText: { fontSize: 9, color: colors.text, lineHeight: 1.4 },
    emergencyBox: { backgroundColor: "#FEF2F2", border: `2px solid ${colors.red}`, borderRadius: 6, padding: 15, marginTop: 14 },
    emergencyTitle: { fontSize: 12, fontWeight: "bold", color: colors.red, textAlign: "center", marginBottom: 10 },
    emergencyRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    emergencyLabel: { fontSize: 10, color: colors.dark },
    emergencyNumber: { fontSize: 14, fontWeight: "bold", color: colors.red },
    legalRef: { fontSize: 7, color: colors.muted, fontStyle: "italic", marginTop: 12, marginBottom: 4 },
    infoBox: { backgroundColor: "#F9FAFB", border: `1px solid ${colors.border}`, borderRadius: 4, padding: 10, marginTop: 10 },
    infoText: { fontSize: 8, color: colors.text, lineHeight: 1.4, marginBottom: 2 },
    footer: { position: "absolute", bottom: 20, left: 35, right: 35, textAlign: "center", fontSize: 7, color: colors.muted, paddingTop: 8, borderTop: `1px solid ${colors.border}` },
})

interface Fiche4Props {
    company: { name: string }
}

export function Fiche4ConsignesIncendie({ company }: Fiche4Props) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>CONSIGNES DE SÉCURITÉ INCENDIE</Text>
                    <Text style={styles.headerSubtitle}>Affichage obligatoire — {company.name}</Text>
                </View>

                <View style={styles.alertBox}>
                    <Text style={styles.alertTitle}>EN CAS D'INCENDIE</Text>
                    <Text style={styles.alertText}>
                        Restez calme — Suivez les consignes ci-dessous
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>CONDUITE À TENIR</Text>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}><Text style={styles.stepNumText}>1</Text></View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>DONNEZ L'ALERTE</Text>
                        <Text style={styles.stepText}>Appelez les pompiers (18 ou 112) et prévenez un responsable. Déclenchez l'alarme incendie si disponible.</Text>
                    </View>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}><Text style={styles.stepNumText}>2</Text></View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>ÉVACUEZ LES LOCAUX</Text>
                        <Text style={styles.stepText}>Empruntez les sorties de secours balisées. N'utilisez jamais les ascenseurs. Aidez les personnes à mobilité réduite.</Text>
                    </View>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}><Text style={styles.stepNumText}>3</Text></View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>FERMEZ LES PORTES</Text>
                        <Text style={styles.stepText}>Fermez les portes et fenêtres derrière vous sans les verrouiller, pour limiter la propagation du feu.</Text>
                    </View>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}><Text style={styles.stepNumText}>4</Text></View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>REJOIGNEZ LE POINT DE RASSEMBLEMENT</Text>
                        <Text style={styles.stepText}>Rendez-vous au point de rassemblement prévu. Signalez-vous au responsable d'évacuation. Ne revenez pas dans les locaux.</Text>
                    </View>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}><Text style={styles.stepNumText}>5</Text></View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>EN CAS DE FUMÉE</Text>
                        <Text style={styles.stepText}>Baissez-vous près du sol (l'air pur est en bas). Couvrez-vous le nez et la bouche avec un tissu humide si possible.</Text>
                    </View>
                </View>

                <View style={styles.emergencyBox}>
                    <Text style={styles.emergencyTitle}>NUMÉROS D'URGENCE</Text>
                    <View style={styles.emergencyRow}>
                        <Text style={styles.emergencyLabel}>Pompiers</Text>
                        <Text style={styles.emergencyNumber}>18</Text>
                    </View>
                    <View style={styles.emergencyRow}>
                        <Text style={styles.emergencyLabel}>SAMU</Text>
                        <Text style={styles.emergencyNumber}>15</Text>
                    </View>
                    <View style={styles.emergencyRow}>
                        <Text style={styles.emergencyLabel}>Police / Gendarmerie</Text>
                        <Text style={styles.emergencyNumber}>17</Text>
                    </View>
                    <View style={styles.emergencyRow}>
                        <Text style={styles.emergencyLabel}>Numéro européen</Text>
                        <Text style={styles.emergencyNumber}>112</Text>
                    </View>
                </View>

                <Text style={styles.legalRef}>
                    Articles R4227-34 à R4227-41 du Code du travail — Obligation de l'employeur d'afficher les consignes de sécurité incendie
                </Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Localisation des extincteurs et issues de secours : voir plan d'évacuation affiché</Text>
                    <Text style={styles.infoText}>Un exercice d'évacuation est organisé au moins une fois tous les 6 mois (art. R4227-39)</Text>
                </View>

                <Text style={styles.footer}>
                    Document ICPP — Affichage obligatoire — À afficher de manière visible dans tous les bâtiments de l'entreprise
                </Text>
            </Page>
        </Document>
    )
}
