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
    accent: "#1D4ED8",
    dark: "#111827",
    text: "#374151",
    muted: "#6B7280",
    border: "#D1D5DB",
    bg: "#F9FAFB",
    white: "#FFFFFF",
    red: "#DC2626",
    amber: "#D97706",
}

const styles = StyleSheet.create({
    page: { padding: 35, backgroundColor: colors.white, fontFamily: "Helvetica" },
    header: { backgroundColor: colors.primary, padding: 18, marginBottom: 20, borderRadius: 4 },
    headerTitle: { fontSize: 16, fontWeight: "bold", color: colors.white, textAlign: "center", marginBottom: 4 },
    headerSubtitle: { fontSize: 10, color: "#93C5FD", textAlign: "center" },
    companyBox: { backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 4, padding: 12, marginBottom: 18 },
    companyName: { fontSize: 13, fontWeight: "bold", color: colors.dark, marginBottom: 4 },
    companyDetail: { fontSize: 9, color: colors.muted, marginBottom: 2 },
    sectionTitle: { fontSize: 12, fontWeight: "bold", color: colors.primary, borderBottom: `2px solid ${colors.primaryLight}`, paddingBottom: 6, marginBottom: 12, marginTop: 14 },
    fieldRow: { flexDirection: "row", marginBottom: 8 },
    fieldLabel: { fontSize: 9, fontWeight: "bold", color: colors.dark, width: 120 },
    fieldValue: { fontSize: 9, color: colors.text, flex: 1, borderBottom: `1px solid ${colors.border}`, paddingBottom: 2 },
    emptyField: { fontSize: 9, color: colors.muted, fontStyle: "italic", flex: 1, borderBottom: `1px dotted ${colors.border}`, paddingBottom: 2 },
    legalRef: { fontSize: 7, color: colors.muted, fontStyle: "italic", marginBottom: 8 },
    infoBox: { backgroundColor: "#EFF6FF", border: `1px solid #BFDBFE`, borderRadius: 3, padding: 8, marginBottom: 10 },
    infoText: { fontSize: 8, color: colors.accent },
    footer: { position: "absolute", bottom: 20, left: 35, right: 35, textAlign: "center", fontSize: 7, color: colors.muted, paddingTop: 8, borderTop: `1px solid ${colors.border}` },
    conditionalNote: { fontSize: 8, color: colors.amber, fontStyle: "italic", marginBottom: 8 },
})

export interface Fiche1Data {
    inspectionNom?: string
    inspectionAdresse?: string
    inspectionTelephone?: string
    inspectionHoraires?: string
    medecineNom?: string
    medecineAdresse?: string
    medecineTelephone?: string
    medecinMedecin?: string
    referentNom?: string
    referentTelephone?: string
    horairesCollectifs?: string
    csePresent?: boolean
    cseMembres?: string
    urgencePompiers?: string
    urgenceSamu?: string
    urgencePolice?: string
}

interface Fiche1Props {
    company: { name: string; address: string; city: string; siret?: string; employeeCount?: number }
    data: Fiche1Data
}

function Field({ label, value }: { label: string; value?: string }) {
    return (
        <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label} :</Text>
            {value ? (
                <Text style={styles.fieldValue}>{value}</Text>
            ) : (
                <Text style={styles.emptyField}>Non renseigné</Text>
            )}
        </View>
    )
}

export function Fiche1Coordonnees({ company, data }: Fiche1Props) {
    const showCSE = (company.employeeCount || 0) >= 11

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>COORDONNÉES & INFORMATIONS OBLIGATOIRES</Text>
                    <Text style={styles.headerSubtitle}>Affichage obligatoire — Article D4711-1 du Code du travail</Text>
                </View>

                <View style={styles.companyBox}>
                    <Text style={styles.companyName}>{company.name}</Text>
                    <Text style={styles.companyDetail}>{company.address}, {company.city}</Text>
                    {company.siret && <Text style={styles.companyDetail}>SIRET : {company.siret}</Text>}
                    {company.employeeCount && <Text style={styles.companyDetail}>Effectif : {company.employeeCount} salarié{company.employeeCount > 1 ? "s" : ""}</Text>}
                </View>

                {/* INSPECTION DU TRAVAIL */}
                <Text style={styles.sectionTitle}>1. INSPECTION DU TRAVAIL</Text>
                <Text style={styles.legalRef}>Articles L8113-1 et D4711-1 du Code du travail</Text>
                <Field label="Nom / Service" value={data.inspectionNom} />
                <Field label="Adresse" value={data.inspectionAdresse} />
                <Field label="Téléphone" value={data.inspectionTelephone} />
                <Field label="Horaires" value={data.inspectionHoraires} />
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Les salariés peuvent contacter l'inspection du travail pour toute question relative au droit du travail.
                    </Text>
                </View>

                {/* MÉDECINE DU TRAVAIL */}
                <Text style={styles.sectionTitle}>2. SERVICE DE PRÉVENTION ET DE SANTÉ AU TRAVAIL</Text>
                <Text style={styles.legalRef}>Article D4711-1 du Code du travail</Text>
                <Field label="Nom / Service" value={data.medecineNom} />
                <Field label="Adresse" value={data.medecineAdresse} />
                <Field label="Téléphone" value={data.medecineTelephone} />
                <Field label="Médecin du travail" value={data.medecinMedecin} />
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Chaque salarié peut demander une visite médicale auprès du service de prévention et de santé au travail.
                    </Text>
                </View>

                {/* RÉFÉRENT HARCÈLEMENT */}
                <Text style={styles.sectionTitle}>3. RÉFÉRENT HARCÈLEMENT</Text>
                <Field label="Nom" value={data.referentNom} />
                <Field label="Téléphone" value={data.referentTelephone} />

                {/* HORAIRES COLLECTIFS */}
                <Text style={styles.sectionTitle}>4. HORAIRES COLLECTIFS DE TRAVAIL</Text>
                <Field label="Horaires" value={data.horairesCollectifs} />

                {/* CSE */}
                {showCSE ? (
                    <View>
                        <Text style={styles.sectionTitle}>5. COMITÉ SOCIAL ET ÉCONOMIQUE (CSE)</Text>
                        <Text style={styles.legalRef}>Obligatoire à partir de 11 salariés</Text>
                        <Field label="Membres" value={data.cseMembres} />
                    </View>
                ) : (
                    <View>
                        <Text style={styles.sectionTitle}>5. CSE</Text>
                        <Text style={styles.conditionalNote}>Non applicable (effectif inférieur à 11 salariés)</Text>
                    </View>
                )}

                {/* SERVICES D'URGENCE */}
                <Text style={styles.sectionTitle}>6. SERVICES D'URGENCE</Text>
                <Field label="Pompiers" value={data.urgencePompiers || "18"} />
                <Field label="SAMU" value={data.urgenceSamu || "15"} />
                <Field label="Police / Gendarmerie" value={data.urgencePolice || "17"} />
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Numéro européen :</Text>
                    <Text style={styles.fieldValue}>112</Text>
                </View>

                <Text style={styles.footer}>
                    Document généré par ICPP — Affichage obligatoire — À afficher de manière visible dans l'entreprise
                </Text>
            </Page>
        </Document>
    )
}
