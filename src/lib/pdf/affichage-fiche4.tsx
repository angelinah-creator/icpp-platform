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
    orange: "#EA580C",
    darkOrn: "#9A3412",
    red: "#DC2626",
    white: "#FFFFFF",
    muted: "#6B7280",
    border: "#D1D5DB",
    body: "#1A202C",
    text: "#374151",
    ornBg: "#FFF7ED",
    ornBdr: "#FED7AA",
    redBg: "#FEF2F2",
    redBdr: "#FECACA",
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

    alertBox: {
        backgroundColor: C.ornBg,
        borderWidth: 2,
        borderColor: C.orange,
        borderRadius: 6,
        padding: 14,
        marginBottom: 14,
        alignItems: "center",
    },
    alertTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", color: C.darkOrn, textAlign: "center", marginBottom: 6 },
    alertText: { fontSize: 9, color: C.body, textAlign: "center", lineHeight: 1.5 },

    sectionHeader: {
        borderBottomWidth: 2,
        borderBottomColor: C.orange,
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 14,
    },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.orange },

    stepRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-start" },
    stepCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: C.orange,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    stepNum: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.white },
    stepTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.body, marginBottom: 2 },
    stepText: { fontSize: 8.5, color: C.text, lineHeight: 1.4 },

    urgencyBox: {
        backgroundColor: C.redBg,
        borderWidth: 2,
        borderColor: C.red,
        borderRadius: 6,
        padding: 14,
        marginTop: 14,
    },
    urgencyTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: C.red,
        textAlign: "center",
        marginBottom: 10,
    },
    urgencyGrid: { flexDirection: "row", flexWrap: "wrap" },
    urgencyBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 4,
        flex: 1,
        minWidth: "40%",
    },
    urgencyLabel: { fontSize: 8, color: C.white, fontFamily: "Helvetica-Bold", flex: 1 },
    urgencyNumber: { fontSize: 14, color: C.white, fontFamily: "Helvetica-Bold" },

    legalRef: { fontSize: 7, color: C.muted, fontStyle: "italic", marginTop: 10, marginBottom: 4 },

    infoBox: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 4,
        padding: 10,
        marginTop: 10,
    },
    infoText: { fontSize: 8, color: C.text, lineHeight: 1.4, marginBottom: 2 },

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

interface Fiche4Props {
    company: { name: string }
}

export function Fiche4ConsignesIncendie({ company }: Fiche4Props) {
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
                        <Text style={s.bigSub}>Consignes de sécurité incendie — {company.name}</Text>
                    </View>

                    {/* EN CAS D'INCENDIE */}
                    <View style={s.alertBox}>
                        <Text style={s.alertTitle}>🔥 EN CAS D&apos;INCENDIE</Text>
                        <Text style={s.alertText}>Restez calme — Suivez les consignes ci-dessous</Text>
                    </View>

                    {/* CONDUITE À TENIR */}
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>CONDUITE À TENIR</Text>
                    </View>

                    {[
                        {
                            n: "1", title: "DONNEZ L'ALERTE",
                            text: "Appelez les pompiers (18 ou 112) et prévenez un responsable. Déclenchez l'alarme incendie si disponible.",
                        },
                        {
                            n: "2", title: "ÉVACUEZ LES LOCAUX",
                            text: "Empruntez les sorties de secours balisées. N'utilisez jamais les ascenseurs. Aidez les personnes à mobilité réduite.",
                        },
                        {
                            n: "3", title: "FERMEZ LES PORTES",
                            text: "Fermez les portes et fenêtres derrière vous sans les verrouiller, pour limiter la propagation du feu.",
                        },
                        {
                            n: "4", title: "REJOIGNEZ LE POINT DE RASSEMBLEMENT",
                            text: "Rendez-vous au point de rassemblement prévu. Signalez-vous au responsable d'évacuation. Ne revenez pas dans les locaux.",
                        },
                        {
                            n: "5", title: "EN CAS DE FUMÉE",
                            text: "Baissez-vous près du sol (l'air pur est en bas). Couvrez-vous le nez et la bouche avec un tissu humide si possible.",
                        },
                    ].map((step) => (
                        <View style={s.stepRow} key={step.n}>
                            <View style={s.stepCircle}>
                                <Text style={s.stepNum}>{step.n}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={s.stepTitle}>{step.title}</Text>
                                <Text style={s.stepText}>{step.text}</Text>
                            </View>
                        </View>
                    ))}

                    {/* NUMÉROS D'URGENCE */}
                    <View style={s.urgencyBox}>
                        <Text style={s.urgencyTitle}>NUMÉROS D&apos;URGENCE</Text>
                        <View style={s.urgencyGrid}>
                            <View style={[s.urgencyBadge, { backgroundColor: "#EF4444" }]}>
                                <Text style={s.urgencyLabel}>Pompiers</Text>
                                <Text style={s.urgencyNumber}>18</Text>
                            </View>
                            <View style={[s.urgencyBadge, { backgroundColor: "#3B82F6" }]}>
                                <Text style={s.urgencyLabel}>SAMU</Text>
                                <Text style={s.urgencyNumber}>15</Text>
                            </View>
                            <View style={[s.urgencyBadge, { backgroundColor: "#1D4ED8" }]}>
                                <Text style={s.urgencyLabel}>Police</Text>
                                <Text style={s.urgencyNumber}>17</Text>
                            </View>
                            <View style={[s.urgencyBadge, { backgroundColor: "#7C3AED" }]}>
                                <Text style={s.urgencyLabel}>Européen</Text>
                                <Text style={s.urgencyNumber}>112</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={s.legalRef}>
                        Articles R4227-34 à R4227-41 du Code du travail — Obligation de l&apos;employeur d&apos;afficher les consignes de sécurité incendie
                    </Text>

                    <View style={s.infoBox}>
                        <Text style={s.infoText}>🗺 Localisation des extincteurs et issues de secours : voir plan d'évacuation affiché</Text>
                        <Text style={s.infoText}>📋 Un exercice d'évacuation est organisé au moins une fois tous les 6 mois (art. R4227-39)</Text>
                    </View>
                </View>

                <Text style={s.footer}>
                    Affichage obligatoire — Code du travail · ICPP Conformité réglementaire — À afficher dans tous les bâtiments
                </Text>
            </Page>
        </Document>
    )
}
