import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from "@react-pdf/renderer"

// Register fonts if needed
// Font.register({ family: 'Roboto', src: '/fonts/Roboto-Regular.ttf' });

// Define styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 40,
    },
    header: {
        marginBottom: 20,
        borderBottom: "2px solid #2563EB",
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2563EB",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: "#666666",
    },
    section: {
        marginTop: 15,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#1F2937",
    },
    text: {
        fontSize: 10,
        marginBottom: 5,
        color: "#374151",
    },
    table: {
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #E5E7EB",
        paddingVertical: 8,
    },
    tableHeader: {
        backgroundColor: "#F3F4F6",
        fontWeight: "bold",
    },
    tableCell: {
        fontSize: 9,
        padding: 5,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#9CA3AF",
        borderTop: "1px solid #E5E7EB",
        paddingTop: 10,
    },
})

interface DuerpTemplateProps {
    company: {
        name: string
        siret: string
        address: string
        city: string
    }
    version: number
    createdAt: Date
    evaluations?: Array<{
        risque: { nom: string; categorie: { nom: string } }
        uniteTravail: string
        frequence: number
        gravite: number
        niveauRisque: number
        mesuresAppliquees: string
    }>
}

export const DuerpTemplate: React.FC<DuerpTemplateProps> = ({
    company,
    version,
    createdAt,
    evaluations = [],
}) => (
    <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    Document Unique d&apos;Évaluation des Risques Professionnels
                </Text>
                <Text style={styles.subtitle}>
                    {company.name} - SIRET: {company.siret}
                </Text>
                <Text style={styles.subtitle}>
                    Version {version} - Créé le {createdAt.toLocaleDateString("fr-FR")}
                </Text>
            </View>

            {/* Company Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informations de l&apos;entreprise</Text>
                <Text style={styles.text}>Raison sociale : {company.name}</Text>
                <Text style={styles.text}>SIRET : {company.siret}</Text>
                <Text style={styles.text}>
                    Adresse : {company.address}, {company.city}
                </Text>
            </View>

            {/* Risk Evaluation Table */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Évaluation des Risques</Text>

                <View style={styles.table}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, { width: "15%" }]}>Catégorie</Text>
                        <Text style={[styles.tableCell, { width: "20%" }]}>Risque</Text>
                        <Text style={[styles.tableCell, { width: "15%" }]}>
                            Unité de travail
                        </Text>
                        <Text style={[styles.tableCell, { width: "8%" }]}>F</Text>
                        <Text style={[styles.tableCell, { width: "8%" }]}>G</Text>
                        <Text style={[styles.tableCell, { width: "8%" }]}>FxG</Text>
                        <Text style={[styles.tableCell, { width: "26%" }]}>
                            Mesures de prévention
                        </Text>
                    </View>

                    {/* Table Rows */}
                    {evaluations.map((evaluation, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { width: "15%" }]}>
                                {evaluation.risque.categorie.nom}
                            </Text>
                            <Text style={[styles.tableCell, { width: "20%" }]}>
                                {evaluation.risque.nom}
                            </Text>
                            <Text style={[styles.tableCell, { width: "15%" }]}>
                                {evaluation.uniteTravail}
                            </Text>
                            <Text style={[styles.tableCell, { width: "8%" }]}>
                                {evaluation.frequence}
                            </Text>
                            <Text style={[styles.tableCell, { width: "8%" }]}>
                                {evaluation.gravite}
                            </Text>
                            <Text style={[styles.tableCell, { width: "8%" }]}>
                                {evaluation.niveauRisque}
                            </Text>
                            <Text style={[styles.tableCell, { width: "26%" }]}>
                                {evaluation.mesuresAppliquees
                                    ? JSON.parse(evaluation.mesuresAppliquees).join(", ")
                                    : "Aucune"}
                            </Text>
                        </View>
                    ))}
                </View>

                {evaluations.length === 0 && (
                    <Text style={styles.text}>Aucune évaluation enregistrée</Text>
                )}
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Document généré par la plateforme ICPP - Ce document est conforme à la
                réglementation en vigueur
            </Text>
        </Page>
    </Document>
)
