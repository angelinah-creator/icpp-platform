import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

const C = {
    navy: "#0A1F5C",
    blue: "#2B5ED4",
    white: "#FFFFFF",
    muted: "#6B7280",
    border: "#D1D5DB",
    body: "#1A202C",
    text: "#374151",
    red: "#DC2626",
    darkRed: "#991B1B",
    redBg: "#FEF2F2",
    redBdr: "#FECACA",
    cardBg: "#F0F4FF",
}

const s = StyleSheet.create({
    page: {
        backgroundColor: C.white,
        fontFamily: "Helvetica",
        paddingBottom: 50,
    },
    blueBand: { height: 10, backgroundColor: C.blue },
    body: { padding: 30 },
    logoBlock: { marginBottom: 14 },
    logoBadge: {
        backgroundColor: C.navy,
        borderRadius: 4,
        padding: 6,
        width: 70,
        alignItems: "center",
        marginBottom: 6,
    },
    logoIcpp: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.white },
    logoSub: { fontSize: 4.5, color: "#A0AEC0", textAlign: "center", lineHeight: 1.3 },
    logoLine: { width: 30, height: 2, backgroundColor: C.blue, marginBottom: 8 },
    bigTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: C.body, marginBottom: 2 },
    bigSub: { fontSize: 9, color: C.muted, marginBottom: 14 },

    // Pictogramme interdit
    prohibitCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 6,
        borderColor: C.red,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
    },
    prohibitInnerBar: {
        width: 55,
        height: 8,
        backgroundColor: C.red,
        transform: "rotate(-45deg)",
    },
    prohibitText: {
        fontSize: 24,
        fontFamily: "Helvetica-Bold",
        color: C.red,
        textAlign: "center",
        marginBottom: 6,
    },
    prohibitSub: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
        color: C.darkRed,
        textAlign: "center",
        marginBottom: 20,
    },

    legalCard: {
        backgroundColor: C.redBg,
        borderWidth: 1,
        borderColor: C.redBdr,
        borderRadius: 6,
        padding: 14,
        marginBottom: 12,
    },
    legalTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.darkRed, marginBottom: 6 },
    legalText: { fontSize: 8.5, color: C.body, lineHeight: 1.5, marginBottom: 4 },

    penalBox: {
        backgroundColor: "#FEE2E2",
        borderWidth: 1,
        borderColor: C.redBdr,
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
    },
    penalText: { fontSize: 8, color: C.darkRed, lineHeight: 1.4, marginBottom: 2 },

    infoBox: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 4,
        padding: 12,
        marginTop: 12,
    },
    infoTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.body, marginBottom: 6 },
    infoText: { fontSize: 8.5, color: C.text, lineHeight: 1.4, marginBottom: 3 },

    footer: {
        position: "absolute",
        bottom: 14,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 7,
        color: C.muted,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 6,
    },
})

interface Fiche3Props {
    company: { name: string }
}

export function Fiche3InterdictionFumer({ company }: Fiche3Props) {
    return (
        <Document>
            <Page size="A4" style={s.page}>
                <View style={s.blueBand} />
                <View style={s.body}>
                    {/* Logo header */}
                    <View style={s.logoBlock}>
                        <View style={s.logoBadge}>
                            <Text style={s.logoIcpp}>▶ ICPP</Text>
                            <Text style={s.logoSub}>CONFORMITÉ{"\n"}INSTITUT DE CONFORMITÉ ET DE{"\n"}PRÉVENTION DES PROFESSIONNELS</Text>
                        </View>
                        <View style={s.logoLine} />
                        <Text style={s.bigTitle}>Affichage obligatoire</Text>
                        <Text style={s.bigSub}>Interdiction de fumer & vapoter — {company.name}</Text>
                    </View>

                    {/* Pictogramme */}
                    <View style={s.prohibitCircle}>
                        <View style={s.prohibitInnerBar} />
                    </View>
                    <Text style={s.prohibitText}>INTERDICTION DE FUMER</Text>
                    <Text style={s.prohibitSub}>ET DE VAPOTER</Text>

                    {/* Références légales */}
                    <View style={s.legalCard}>
                        <Text style={s.legalTitle}>Références légales</Text>
                        <Text style={s.legalText}>
                            Article R3512-2 du Code de la santé publique : « Il est interdit de fumer dans les lieux affectés à un usage collectif, notamment les lieux fermés et couverts qui constituent des lieux de travail. »
                        </Text>
                        <Text style={s.legalText}>
                            Article L3513-6 du Code de la santé publique : « Il est interdit de vapoter dans les lieux de travail fermés et couverts à usage collectif. »
                        </Text>
                        <Text style={s.legalText}>
                            Décret n° 2017-633 du 25 avril 2017 relatif aux conditions d'application de l'interdiction de vapoter.
                        </Text>
                    </View>

                    {/* Sanctions */}
                    <View style={s.penalBox}>
                        <Text style={s.penalText}>
                            Sanctions : amende forfaitaire de 68 € pour le fumeur/vapoteur en infraction (article R3512-1).
                        </Text>
                        <Text style={s.penalText}>
                            L'employeur qui ne met pas en place la signalisation s'expose à une amende de 450 € (article R3515-7).
                        </Text>
                    </View>

                    {/* Rappel */}
                    <View style={s.infoBox}>
                        <Text style={s.infoTitle}>Rappel aux salariés</Text>
                        <Text style={s.infoText}>
                            Cette interdiction s'applique dans l'ensemble des locaux de l'entreprise, y compris les bureaux individuels.
                        </Text>
                        <Text style={s.infoText}>
                            Des espaces fumeurs peuvent être aménagés à l'extérieur des bâtiments, conformément à la réglementation.
                        </Text>
                        <Text style={s.infoText}>
                            Pour toute aide au sevrage tabagique : Tabac Info Service — 3989 (appel non surtaxé).
                        </Text>
                    </View>
                </View>

                <Text style={s.footer}>
                    Affichage obligatoire — Code du travail · ICPP Conformité réglementaire — À afficher de manière visible
                </Text>
            </Page>
        </Document>
    )
}
