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
        padding: 30,
    },
    header: {
        backgroundColor: "#2563EB",
        padding: 15,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#1F2937",
    },
    text: {
        fontSize: 10,
        marginBottom: 8,
        lineHeight: 1.6,
        color: "#374151",
    },
    section: {
        marginBottom: 15,
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 8,
        color: "#9CA3AF",
        paddingTop: 10,
        borderTop: "1px solid #E5E7EB",
    },
})

interface AffichageTemplateProps {
    type: "INSPECTION_TRAVAIL" | "MEDECINE_TRAVAIL" | "CONSIGNES_SECURITE"
    company: {
        name: string
        address: string
        city: string
    }
}

const getContent = (type: string, company: any) => {
    switch (type) {
        case "INSPECTION_TRAVAIL":
            return {
                title: "Inspection du Travail",
                content: [
                    "En application de l'article R. 4711-1 du Code du travail, les coordonnées de l'inspection du travail doivent être affichées dans l'entreprise.",
                    "",
                    "Direction régionale de l'économie, de l'emploi, du travail et des solidarités (DREETS)",
                    "",
                    "Pour toute question relative au droit du travail, vous pouvez contacter l'inspection du travail dont dépend votre établissement.",
                    "",
                    "Consultez le site du ministère du Travail pour localiser votre inspection du travail : travail-emploi.gouv.fr",
                ],
            }
        case "MEDECINE_TRAVAIL":
            return {
                title: "Médecine du Travail",
                content: [
                    "Service de Santé au Travail",
                    "",
                    "Tout salarié bénéficie d'un suivi individuel de son état de santé assuré par le service de santé au travail.",
                    "",
                    "Les coordonnées du service de santé au travail sont disponibles auprès de votre employeur.",
                    "",
                    "Pour prendre rendez-vous ou en cas de question, contactez directement votre service de santé au travail.",
                ],
            }
        case "CONSIGNES_SECURITE":
            return {
                title: "Consignes de Sécurité",
                content: [
                    "EN CAS D'URGENCE",
                    "",
                    "Pompiers : 18",
                    "SAMU : 15",
                    "Numéro d'urgence européen : 112",
                    "",
                    "CONSIGNES EN CAS D'INCENDIE",
                    "1. Donnez l'alerte",
                    "2. Évacuez les locaux",
                    "3. N'utilisez pas les ascenseurs",
                    "4. Rejoignez le point de rassemblement",
                    "",
                    "Localisation des extincteurs et issues de secours : voir plan affiché",
                ],
            }
        default:
            return {
                title: "Affichage Obligatoire",
                content: ["Contenu de l'affichage"],
            }
    }
}

export const AffichageTemplate: React.FC<AffichageTemplateProps> = ({
    type,
    company,
}) => {
    const { title, content } = getContent(type, company)

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>{title}</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{company.name}</Text>
                    {content.map((line, index) => (
                        <Text key={index} style={styles.text}>
                            {line}
                        </Text>
                    ))}
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Document généré par ICPP - À afficher de manière visible dans
                    l&apos;entreprise
                </Text>
            </Page>
        </Document>
    )
}
