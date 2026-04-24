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
    cardBdr: "#C7D7F5",
}

const s = StyleSheet.create({
    page: {
        backgroundColor: C.white,
        fontFamily: "Helvetica",
        padding: 30,
        paddingBottom: 50,
    },
    headerBand: { height: 10, backgroundColor: C.blue },
    logoBlock: { marginBottom: 14, marginTop: 10 },
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

    card: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.cardBdr,
        backgroundColor: C.cardBg,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
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
    cardTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: C.navy,
        marginBottom: 4,
        marginLeft: 6,
    },
    cardRef: { fontSize: 7.5, color: C.muted, marginBottom: 8, marginLeft: 6 },

    sectionHeader: {
        backgroundColor: C.navy,
        padding: 10,
        marginBottom: 10,
        marginTop: 14,
        borderRadius: 4,
    },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.white },
    sectionRef: { fontSize: 7, color: "#93C5FD", marginTop: 2 },

    articleTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.body, marginBottom: 4, marginTop: 10 },
    bodyText: { fontSize: 8.5, color: C.text, lineHeight: 1.5, marginBottom: 4 },
    bulletItem: { fontSize: 8.5, color: C.text, lineHeight: 1.5, marginBottom: 2, paddingLeft: 10 },

    penalBox: {
        backgroundColor: C.redBg,
        borderWidth: 1,
        borderColor: C.redBdr,
        borderRadius: 3,
        padding: 8,
        marginTop: 6,
        marginBottom: 6,
    },
    penalTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.darkRed, marginBottom: 3 },
    penalText: { fontSize: 8, color: C.darkRed, lineHeight: 1.4 },

    divider: { borderBottomWidth: 1, borderBottomColor: C.border, marginVertical: 8 },

    versionBadge: { fontSize: 7, color: C.muted, textAlign: "right", marginBottom: 6 },

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

function IcppLogo({ subtitle }: { subtitle: string }) {
    return (
        <View style={s.logoBlock}>
            <View style={s.logoBadge}>
                <Text style={s.logoIcpp}>▶ ICPP</Text>
                <Text style={s.logoSub}>CONFORMITÉ{"\n"}INSTITUT DE CONFORMITÉ ET DE{"\n"}PRÉVENTION DES PROFESSIONNELS</Text>
            </View>
            <View style={s.logoLine} />
            <Text style={s.bigTitle}>Affichage obligatoire</Text>
            <Text style={s.bigSub}>{subtitle}</Text>
        </View>
    )
}

interface Fiche2Props {
    company: { name: string }
    version?: number
}

export function Fiche2DroitsObligations({ company, version = 1 }: Fiche2Props) {
    return (
        <Document>
            {/* PAGE 1 : Harcèlement sexuel + Harcèlement moral */}
            <Page size="A4" style={s.page}>
                <View style={{ height: 10, backgroundColor: C.blue }} />
                <View style={{ padding: 30, paddingBottom: 50 }}>
                    <IcppLogo subtitle={`Droits & Obligations — ${company.name}`} />
                    <Text style={s.versionBadge}>Version ICPP v{version} — Document non modifiable</Text>

                    {/* HARCÈLEMENT SEXUEL */}
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>LUTTE CONTRE LE HARCÈLEMENT SEXUEL</Text>
                        <Text style={s.sectionRef}>Articles L1153-1 à L1153-6 du Code du travail</Text>
                    </View>

                    <Text style={s.articleTitle}>Article L1153-1 — Définition légale</Text>
                    <Text style={s.bodyText}>Aucun salarié ne doit subir des faits :</Text>
                    <Text style={s.bulletItem}>
                        1° Soit de harcèlement sexuel, constitué par des propos ou comportements à connotation sexuelle ou sexiste répétés qui portent atteinte à sa dignité en raison de leur caractère dégradant ou humiliant, ou créent à son encontre une situation intimidante, hostile ou offensante ;
                    </Text>
                    <Text style={s.bulletItem}>
                        2° Soit assimilés au harcèlement sexuel, consistant en toute forme de pression grave, même non répétée, exercée dans le but réel ou apparent d'obtenir un acte de nature sexuelle.
                    </Text>

                    <Text style={s.articleTitle}>Article L1153-2 — Protection du salarié</Text>
                    <Text style={s.bodyText}>
                        Aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi ou refusé de subir des faits de harcèlement sexuel.
                    </Text>

                    <View style={s.penalBox}>
                        <Text style={s.penalTitle}>Sanctions pénales — Article 222-33 du Code pénal</Text>
                        <Text style={s.penalText}>Le harcèlement sexuel est puni de 2 ans d'emprisonnement et 30 000 € d'amende.</Text>
                        <Text style={s.penalText}>Peines aggravées : 3 ans d'emprisonnement et 45 000 € d'amende (notamment en cas d'abus d'autorité).</Text>
                    </View>

                    <View style={s.divider} />

                    {/* HARCÈLEMENT MORAL */}
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>LUTTE CONTRE LE HARCÈLEMENT MORAL</Text>
                        <Text style={s.sectionRef}>Articles L1152-1 à L1152-6 du Code du travail</Text>
                    </View>

                    <Text style={s.articleTitle}>Article L1152-1</Text>
                    <Text style={s.bodyText}>
                        Aucun salarié ne doit subir des agissements répétés de harcèlement moral ayant pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale, ou de compromettre son avenir professionnel.
                    </Text>

                    <Text style={s.articleTitle}>Article L1152-2 — Protection du salarié</Text>
                    <Text style={s.bodyText}>
                        Aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi ou refusé de subir des agissements répétés de harcèlement moral.
                    </Text>

                    <View style={s.penalBox}>
                        <Text style={s.penalTitle}>Sanctions pénales — Article 222-33-2-2 du Code pénal</Text>
                        <Text style={s.penalText}>Le harcèlement moral est puni de 2 ans d'emprisonnement et 30 000 € d'amende.</Text>
                    </View>
                </View>
                <Text style={s.footer}>
                    Document ICPP v{version} — Affichage obligatoire — Texte juridique verrouillé — Page 1/2
                </Text>
            </Page>

            {/* PAGE 2 : Discrimination + Égalité professionnelle */}
            <Page size="A4" style={s.page}>
                <View style={{ height: 10, backgroundColor: C.blue }} />
                <View style={{ padding: 30, paddingBottom: 50 }}>
                    <IcppLogo subtitle={`Droits & Obligations — ${company.name} (suite)`} />

                    {/* DISCRIMINATION */}
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>LUTTE CONTRE LES DISCRIMINATIONS</Text>
                        <Text style={s.sectionRef}>Articles L1132-1 et suivants du Code du travail</Text>
                    </View>

                    <Text style={s.articleTitle}>Article L1132-1</Text>
                    <Text style={s.bodyText}>
                        Aucune personne ne peut être écartée d'une procédure de recrutement, sanctionnée, licenciée ou faire l'objet d'une mesure discriminatoire en raison notamment de :
                    </Text>
                    <Text style={s.bulletItem}>• son origine, son sexe, ses mœurs, son orientation sexuelle, son identité de genre</Text>
                    <Text style={s.bulletItem}>• son âge, sa situation de famille, sa grossesse</Text>
                    <Text style={s.bulletItem}>• ses caractéristiques génétiques</Text>
                    <Text style={s.bulletItem}>• son appartenance ou non-appartenance à une ethnie, une nation ou une prétendue race</Text>
                    <Text style={s.bulletItem}>• ses opinions politiques, ses activités syndicales ou mutualistes</Text>
                    <Text style={s.bulletItem}>• ses convictions religieuses</Text>
                    <Text style={s.bulletItem}>• son apparence physique, son nom de famille</Text>
                    <Text style={s.bulletItem}>• son état de santé, son handicap</Text>
                    <Text style={s.bulletItem}>• sa domiciliation bancaire</Text>

                    <View style={s.penalBox}>
                        <Text style={s.penalTitle}>Sanctions pénales — Articles 225-1 à 225-4 du Code pénal</Text>
                        <Text style={s.penalText}>La discrimination est punie de 3 ans d'emprisonnement et 45 000 € d'amende.</Text>
                    </View>

                    <View style={s.divider} />

                    {/* ÉGALITÉ F/H */}
                    <View style={s.sectionHeader}>
                        <Text style={s.sectionTitle}>ÉGALITÉ PROFESSIONNELLE FEMMES / HOMMES</Text>
                        <Text style={s.sectionRef}>Article L3221-2 du Code du travail</Text>
                    </View>

                    <Text style={s.articleTitle}>Article L3221-2 — Égalité de rémunération</Text>
                    <Text style={s.bodyText}>
                        Tout employeur assure, pour un même travail ou pour un travail de valeur égale, l'égalité de rémunération entre les femmes et les hommes.
                    </Text>

                    <Text style={s.articleTitle}>Article L1142-1</Text>
                    <Text style={s.bodyText}>
                        Aucune personne ne peut être écartée d'une procédure de recrutement ou sanctionnée en raison de son sexe.
                    </Text>

                    <View style={s.divider} />

                    <Text style={{ fontSize: 7, color: "#CBD5E1", textAlign: "center", marginTop: 4 }}>
                        Texte juridique versionné — Non modifiable par l'entreprise — Préparé par ICPP Conformité réglementaire
                    </Text>
                </View>
                <Text style={s.footer}>
                    Document ICPP v{version} — Affichage obligatoire — Texte juridique verrouillé — Page 2/2
                </Text>
            </Page>
        </Document>
    )
}
