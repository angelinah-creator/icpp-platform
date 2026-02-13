import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

const colors = {
    red: "#DC2626",
    darkRed: "#991B1B",
    dark: "#111827",
    text: "#374151",
    muted: "#6B7280",
    border: "#D1D5DB",
    white: "#FFFFFF",
    bg: "#FEF2F2",
}

const styles = StyleSheet.create({
    page: { padding: 35, backgroundColor: colors.white, fontFamily: "Helvetica" },
    header: { backgroundColor: colors.darkRed, padding: 20, marginBottom: 20, borderRadius: 4 },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: colors.white, textAlign: "center", marginBottom: 4 },
    headerSubtitle: { fontSize: 10, color: "#FCA5A5", textAlign: "center" },
    mainBox: { border: `3px solid ${colors.red}`, borderRadius: 6, padding: 25, marginBottom: 20, alignItems: "center" },
    prohibitIcon: { width: 80, height: 80, borderRadius: 40, border: `4px solid ${colors.red}`, marginBottom: 15, alignItems: "center", justifyContent: "center" },
    crossLine: { width: 60, height: 4, backgroundColor: colors.red, transform: "rotate(-45deg)" },
    prohibitText: { fontSize: 22, fontWeight: "bold", color: colors.red, textAlign: "center", marginBottom: 8 },
    subProhibitText: { fontSize: 14, fontWeight: "bold", color: colors.darkRed, textAlign: "center", marginBottom: 20 },
    legalBox: { backgroundColor: colors.bg, border: `1px solid #FECACA`, borderRadius: 4, padding: 15, marginBottom: 15, width: "100%" },
    legalTitle: { fontSize: 10, fontWeight: "bold", color: colors.darkRed, marginBottom: 6 },
    legalText: { fontSize: 9, color: colors.dark, lineHeight: 1.5, marginBottom: 4 },
    penalBox: { backgroundColor: "#FEE2E2", border: `1px solid #FECACA`, borderRadius: 3, padding: 10, marginBottom: 10, width: "100%" },
    penalText: { fontSize: 8.5, color: colors.darkRed, lineHeight: 1.4 },
    infoSection: { marginTop: 15, padding: 12, backgroundColor: "#F9FAFB", borderRadius: 4, border: `1px solid ${colors.border}` },
    infoTitle: { fontSize: 10, fontWeight: "bold", color: colors.dark, marginBottom: 6 },
    infoText: { fontSize: 8.5, color: colors.text, lineHeight: 1.4, marginBottom: 3 },
    footer: { position: "absolute", bottom: 20, left: 35, right: 35, textAlign: "center", fontSize: 7, color: colors.muted, paddingTop: 8, borderTop: `1px solid ${colors.border}` },
})

interface Fiche3Props {
    company: { name: string }
}

export function Fiche3InterdictionFumer({ company }: Fiche3Props) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>INTERDICTION DE FUMER ET DE VAPOTER</Text>
                    <Text style={styles.headerSubtitle}>Affichage obligatoire — {company.name}</Text>
                </View>

                <View style={styles.mainBox}>
                    {/* Pictogramme simplifié */}
                    <View style={styles.prohibitIcon}>
                        <View style={styles.crossLine} />
                    </View>

                    <Text style={styles.prohibitText}>INTERDICTION DE FUMER</Text>
                    <Text style={styles.subProhibitText}>ET DE VAPOTER</Text>

                    <View style={styles.legalBox}>
                        <Text style={styles.legalTitle}>Références légales</Text>
                        <Text style={styles.legalText}>
                            Article R3512-2 du Code de la santé publique : « Il est interdit de fumer dans les lieux affectés à un usage collectif, notamment les lieux fermés et couverts qui constituent des lieux de travail. »
                        </Text>
                        <Text style={styles.legalText}>
                            Article L3513-6 du Code de la santé publique : « Il est interdit de vapoter dans les lieux de travail fermés et couverts à usage collectif. »
                        </Text>
                        <Text style={styles.legalText}>
                            Décret n° 2017-633 du 25 avril 2017 relatif aux conditions d'application de l'interdiction de vapoter.
                        </Text>
                    </View>

                    <View style={styles.penalBox}>
                        <Text style={styles.penalText}>
                            Sanctions : amende forfaitaire de 68 € pour le fumeur/vapoteur en infraction (article R3512-1).
                        </Text>
                        <Text style={styles.penalText}>
                            L'employeur qui ne met pas en place la signalisation s'expose à une amende de 450 € (article R3515-7).
                        </Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Rappel aux salariés</Text>
                    <Text style={styles.infoText}>
                        Cette interdiction s'applique dans l'ensemble des locaux de l'entreprise, y compris les bureaux individuels.
                    </Text>
                    <Text style={styles.infoText}>
                        Des espaces fumeurs peuvent être aménagés à l'extérieur des bâtiments, conformément à la réglementation.
                    </Text>
                    <Text style={styles.infoText}>
                        Pour toute aide au sevrage tabagique : Tabac Info Service — 3989 (appel non surtaxé).
                    </Text>
                </View>

                <Text style={styles.footer}>
                    Document ICPP — Affichage obligatoire — À afficher de manière visible dans tous les bâtiments de l'entreprise
                </Text>
            </Page>
        </Document>
    )
}
