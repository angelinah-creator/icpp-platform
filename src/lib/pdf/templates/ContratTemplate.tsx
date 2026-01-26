import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 40,
    },
    header: {
        marginBottom: 30,
        borderBottom: "2px solid #2563EB",
        paddingBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2563EB",
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
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
        lineHeight: 1.5,
        color: "#374151",
    },
    signatureBlock: {
        marginTop: 40,
        borderTop: "1px solid #E5E7EB",
        paddingTop: 20,
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

interface ContratTemplateProps {
    numeroContrat: string
    company: {
        name: string
        siret: string
        address: string
        city: string
    }
    plan: {
        nom: string
        prixMensuel: number
    }
    dateDebut: Date
    cgvVersion: string
}

export const ContratTemplate: React.FC<ContratTemplateProps> = ({
    numeroContrat,
    company,
    plan,
    dateDebut,
    cgvVersion,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Contrat de Prestation de Services</Text>
                <Text style={styles.text}>N° {numeroContrat}</Text>
                <Text style={styles.text}>
                    Date : {dateDebut.toLocaleDateString("fr-FR")}
                </Text>
            </View>

            {/* Parties */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Entre les soussignés :</Text>
                <Text style={styles.text}>
                    D&apos;une part, ICPP (Inspection Conformité Prévention Professionnelle),
                    société spécialisée dans la conformité réglementaire des entreprises.
                </Text>
                <Text style={styles.text}>Ci-après dénommée « Le Prestataire »</Text>
                <Text style={styles.text}>Et d&apos;autre part,</Text>
                <Text style={styles.text}>{company.name}</Text>
                <Text style={styles.text}>SIRET : {company.siret}</Text>
                <Text style={styles.text}>
                    {company.address}, {company.city}
                </Text>
                <Text style={styles.text}>Ci-après dénommée « Le Client »</Text>
            </View>

            {/* Object */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Objet du Contrat</Text>
                <Text style={styles.text}>
                    Le présent contrat a pour objet la fourniture de services de conformité
                    réglementaire via la plateforme ICPP, incluant :
                </Text>
                <Text style={styles.text}>
                    - Abonnement : {plan.nom}
                </Text>
                <Text style={styles.text}>
                    - Tarif mensuel : {(plan.prixMensuel / 100).toFixed(2)} € HT
                </Text>
                <Text style={styles.text}>
                    - Génération et mise à jour du Document Unique (DUERP)
                </Text>
                <Text style={styles.text}>
                    - Accès aux affichages obligatoires
                </Text>
                <Text style={styles.text}>- Support technique</Text>
            </View>

            {/* Duration */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Durée</Text>
                <Text style={styles.text}>
                    Le contrat prend effet à la date de signature et est conclu pour une
                    durée indéterminée, renouvelable tacitement par période mensuelle.
                </Text>
            </View>

            {/* CGV Reference */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Conditions Générales de Vente
                </Text>
                <Text style={styles.text}>
                    Le présent contrat est soumis aux Conditions Générales de Vente (CGV)
                    version {cgvVersion}, acceptées par le Client lors de la souscription.
                </Text>
            </View>

            {/* Signature */}
            <View style={styles.signatureBlock}>
                <Text style={styles.text}>Fait en deux exemplaires,</Text>
                <Text style={styles.text}>
                    Le {dateDebut.toLocaleDateString("fr-FR")}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 30 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.text}>Le Prestataire</Text>
                        <Text style={styles.text}>ICPP</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.text}>Le Client</Text>
                        <Text style={styles.text}>{company.name}</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                ICPP - Document généré automatiquement - Signature électronique valide
            </Text>
        </Page>
    </Document>
)
