import React from "react"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer"

// ============================================
// COULEURS — fidèles à la maquette
// ============================================
const C = {
    navy: "#0A1F5C",
    blue: "#2B5ED4",
    blueLight: "#3B82F6",
    blueBg: "#EFF6FF",
    white: "#FFFFFF",
    body: "#1A202C",
    muted: "#6B7280",
    border: "#CBD5E1",
    dotColor: "#94A3B8",
    cardBg: "#F0F4FF",
    cardBorder: "#C7D7F5",
    samu: "#3B82F6",
    pompiers: "#EF4444",
    police: "#1D4ED8",
    european: "#7C3AED",
}

const s = StyleSheet.create({
    page: {
        backgroundColor: C.white,
        fontFamily: "Helvetica",
        padding: 30,
        paddingBottom: 50,
    },
    // ---- Header (logo + titre) ----
    logoBlock: {
        marginBottom: 16,
    },
    logoBadge: {
        backgroundColor: C.navy,
        borderRadius: 4,
        padding: 6,
        width: 70,
        alignItems: "center",
        marginBottom: 8,
    },
    logoIcpp: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: C.white,
    },
    logoSub: {
        fontSize: 4.5,
        color: "#A0AEC0",
        textAlign: "center",
        lineHeight: 1.3,
    },
    logoLine: {
        width: 30,
        height: 2,
        backgroundColor: C.blueLight,
        marginBottom: 8,
    },
    bigTitle: {
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        color: C.body,
        marginBottom: 2,
    },
    bigSub: {
        fontSize: 9,
        color: C.muted,
        marginBottom: 16,
    },
    // ---- Grille 2 colonnes ----
    grid: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 10,
    },
    col: {
        flex: 1,
    },
    // ---- Carte section ----
    card: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.cardBorder,
        backgroundColor: C.cardBg,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 10,
        position: "relative",
    },
    cardLeftBar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: C.blue,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    cardHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        marginLeft: 6,
    },
    cardIcon: {
        fontSize: 12,
        marginRight: 6,
        color: C.navy,
    },
    cardTitle: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: C.navy,
        letterSpacing: 0.3,
    },
    cardLegal: {
        fontSize: 7,
        color: C.muted,
        marginBottom: 7,
        marginLeft: 6,
    },
    cardNote: {
        fontSize: 7.5,
        color: "#374151",
        lineHeight: 1.5,
        marginTop: 5,
        marginLeft: 6,
    },
    // ---- Champ pointillé ----
    dotField: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 5,
        marginLeft: 6,
    },
    dotLabel: {
        fontSize: 8,
        color: C.body,
        width: 90,
    },
    dotLine: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: C.dotColor,
        borderBottomStyle: "dotted",
        height: 13,
    },
    dotValue: {
        fontSize: 7.5,
        color: C.muted,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: C.dotColor,
        borderBottomStyle: "dotted",
        paddingBottom: 1,
    },
    // ---- Horaires collectifs ----
    horaireRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        marginLeft: 6,
    },
    horaireDay: {
        fontSize: 8,
        color: C.body,
        width: 55,
    },
    horaireDash: {
        fontSize: 8,
        color: C.muted,
        marginHorizontal: 3,
    },
    horaireDot: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: C.dotColor,
        borderBottomStyle: "dotted",
        height: 11,
        marginHorizontal: 2,
    },
    // ---- CSE ----
    cseBadge: {
        fontSize: 7.5,
        color: C.blue,
        backgroundColor: C.blueBg,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginBottom: 6,
        marginLeft: 6,
        alignSelf: "flex-start",
    },
    // ---- Numéros d'urgence ----
    urgenceBadgesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
        marginLeft: 6,
    },
    urgenceBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flex: 1,
    },
    urgenceLabel: {
        fontSize: 8,
        color: C.white,
        fontFamily: "Helvetica-Bold",
        flex: 1,
    },
    urgenceNumber: {
        fontSize: 12,
        color: C.white,
        fontFamily: "Helvetica-Bold",
    },
    // ---- Footer ----
    footer: {
        position: "absolute",
        bottom: 16,
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

// ============================================
// TYPES
// ============================================
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
    referentAdresse?: string
    referentTelephone?: string
    referentMedecin?: string
    horairesLundi?: string
    horairesMardi?: string
    horairesJeudi?: string
    horairesMercredi?: string
    horairesMercrediEnd?: string
    horairesVendredi?: string
    horairesSamedi?: string
    horairesCollectifs?: string
    csePresent?: boolean
    cseTitulaires?: string
    cseSuppleants?: string
    cseLocal?: string
    urgencePompiers?: string
    urgenceSamu?: string
    urgencePolice?: string
}

interface Fiche1Props {
    company: { name: string; address: string; city: string; siret?: string; employeeCount?: number }
    data: Fiche1Data
}

// ---- Composants utilitaires ----
function DotField({ label, value }: { label: string; value?: string }) {
    return (
        <View style={s.dotField}>
            <Text style={s.dotLabel}>{label}</Text>
            {value ? (
                <Text style={s.dotValue}>{value}</Text>
            ) : (
                <View style={s.dotLine} />
            )}
        </View>
    )
}

function HoraireRow({ day, value }: { day: string; value?: string }) {
    return (
        <View style={s.horaireRow}>
            <Text style={s.horaireDay}>{day}</Text>
            <View style={s.horaireDot} />
            <Text style={s.horaireDash}>à</Text>
            <View style={s.horaireDot} />
        </View>
    )
}

function SectionCard({
    icon,
    title,
    legal,
    children,
}: {
    icon: string
    title: string
    legal?: string
    children: React.ReactNode
}) {
    return (
        <View style={s.card}>
            <View style={s.cardLeftBar} />
            <View style={s.cardHeaderRow}>
                <Text style={s.cardIcon}>{icon}</Text>
                <Text style={s.cardTitle}>{title}</Text>
            </View>
            {legal && <Text style={s.cardLegal}>{legal}</Text>}
            {children}
        </View>
    )
}

// ============================================
// DOCUMENT PRINCIPAL
// ============================================
export function Fiche1Coordonnees({ company, data }: Fiche1Props) {
    const showCSE = (company.employeeCount || 0) >= 11

    return (
        <Document>
            <Page size="A4" style={s.page}>

                {/* ---- HEADER ---- */}
                <View style={s.logoBlock}>
                    <View style={s.logoBadge}>
                        <Text style={s.logoIcpp}>▶ ICPP</Text>
                        <Text style={s.logoSub}>CONFORMITÉ{"\n"}INSTITUT DE CONFORMITÉ ET DE{"\n"}PRÉVENTION DES PROFESSIONNELS</Text>
                    </View>
                    <View style={s.logoLine} />
                    <Text style={s.bigTitle}>Affichage obligatoire</Text>
                    <Text style={s.bigSub}>Code du travail · Version 2025</Text>
                </View>

                {/* ---- GRILLE 2 COLONNES ---- */}
                <View style={s.grid}>

                    {/* ---- COLONNE GAUCHE ---- */}
                    <View style={s.col}>

                        {/* 1 — INSPECTION DU TRAVAIL */}
                        <SectionCard
                            icon="🏛"
                            title="INSPECTION DE TRAVAIL"
                            legal="Art. L8113-1 & D4711-1 du Code du travail"
                        >
                            <DotField label="Inspecteur compétent" value={data.inspectionNom} />
                            <DotField label="Adresse" value={data.inspectionAdresse} />
                            <DotField label="Telephone" value={data.inspectionTelephone} />
                            <DotField label="Horaires" value={data.inspectionHoraires} />
                            <Text style={s.cardNote}>
                                Les salariés peuvent contacter l&apos;inspection du travail pour toute question relative à l&apos;application du droit du travail.
                            </Text>
                        </SectionCard>

                        {/* 2 — SANTÉ AU TRAVAIL */}
                        <SectionCard
                            icon="⚕"
                            title="SANTE AU TRAVAIL"
                            legal="Art. D4711-1 du Code du travail"
                        >
                            <DotField label="Service de santé" value={data.medecineNom} />
                            <DotField label="Adresse" value={data.medecineAdresse} />
                            <DotField label="Telephone" value={data.medecineTelephone} />
                            <DotField label="Medecin de travail" value={data.medecinMedecin} />
                            <Text style={s.cardNote}>
                                Chaque salarié peut demander une visite médicale auprès du service de prévention et de santé au travail.
                            </Text>
                        </SectionCard>

                        {/* 3 — CSE */}
                        <SectionCard
                            icon="👥"
                            title="COMITE SOCIAL ET ECONOMIQUE"
                        >
                            <Text style={s.cseBadge}>
                                À partir de 11 salariés · Art. L2311-2
                            </Text>
                            {showCSE ? (
                                <>
                                    <DotField label="Membres titulaires" value={data.cseTitulaires} />
                                    <DotField label="Membres suppléants" value={data.cseSuppleants} />
                                    <DotField label="Local du CSE" value={data.cseLocal} />
                                </>
                            ) : (
                                <Text style={[s.cardNote, { color: C.muted, fontFamily: "Helvetica-Oblique" }]}>
                                    Non applicable (effectif inférieur à 11 salariés)
                                </Text>
                            )}
                        </SectionCard>

                    </View>

                    {/* ---- COLONNE DROITE ---- */}
                    <View style={s.col}>

                        {/* 4 — HORAIRES COLLECTIFS */}
                        <SectionCard
                            icon="🕐"
                            title="HORAIRES COLLECTIFS"
                            legal="Art. L3171-1 du Code du travail"
                        >
                            <HoraireRow day="Lundi" value={data.horairesLundi} />
                            <HoraireRow day="Mardi" value={data.horairesMardi} />
                            <HoraireRow day="Mercredi" value={data.horairesMercredi} />
                            <HoraireRow day="Jeudi" value={data.horairesJeudi} />
                            <HoraireRow day="Vendredi" value={data.horairesVendredi} />
                            <HoraireRow day="Samedi" value={data.horairesSamedi} />
                        </SectionCard>

                        {/* 5 — RÉFÉRENT HARCÈLEMENT */}
                        <SectionCard
                            icon="🛡"
                            title="REFERENT HARCELEMENT"
                            legal="Art. D4711-1 du Code du travail"
                        >
                            <DotField label="Service de santé" value={data.referentNom} />
                            <DotField label="Adresse" value={data.referentAdresse} />
                            <DotField label="Telephone" value={data.referentTelephone} />
                            <DotField label="Medecin de travail" value={data.referentMedecin} />
                            <Text style={s.cardNote}>
                                Chaque salarié peut demander une visite médicale auprès du service de prévention et de santé au travail.
                            </Text>
                        </SectionCard>

                        {/* 6 — NUMÉROS D'URGENCE */}
                        <SectionCard
                            icon="🚨"
                            title="NUMEROS D'URGENCE"
                        >
                            <View style={s.urgenceBadgesRow}>
                                <View style={[s.urgenceBadge, { backgroundColor: C.samu }]}>
                                    <Text style={s.urgenceLabel}>SAMU</Text>
                                    <Text style={s.urgenceNumber}>{data.urgenceSamu || "15"}</Text>
                                </View>
                                <View style={[s.urgenceBadge, { backgroundColor: C.pompiers }]}>
                                    <Text style={s.urgenceLabel}>Pompiers</Text>
                                    <Text style={s.urgenceNumber}>{data.urgencePompiers || "18"}</Text>
                                </View>
                            </View>
                            <View style={s.urgenceBadgesRow}>
                                <View style={[s.urgenceBadge, { backgroundColor: C.police }]}>
                                    <Text style={s.urgenceLabel}>Police</Text>
                                    <Text style={s.urgenceNumber}>{data.urgencePolice || "17"}</Text>
                                </View>
                                <View style={[s.urgenceBadge, { backgroundColor: C.european }]}>
                                    <Text style={s.urgenceLabel}>Européen</Text>
                                    <Text style={s.urgenceNumber}>112</Text>
                                </View>
                            </View>
                        </SectionCard>

                    </View>
                </View>

                {/* ---- FOOTER ---- */}
                <Text style={s.footer}>
                    Affichage obligatoire — Code du travail · ICPP Conformité réglementaire
                </Text>

            </Page>
        </Document>
    )
}
