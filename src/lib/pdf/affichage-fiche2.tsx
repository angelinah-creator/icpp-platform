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
    dark: "#111827",
    text: "#374151",
    muted: "#6B7280",
    border: "#D1D5DB",
    white: "#FFFFFF",
    sectionBg: "#F0F4FF",
    penalBg: "#FEF2F2",
    penalBorder: "#FECACA",
    penalText: "#991B1B",
}

const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: colors.white, fontFamily: "Helvetica" },
    header: { backgroundColor: colors.primary, padding: 16, marginBottom: 16, borderRadius: 4 },
    headerTitle: { fontSize: 14, fontWeight: "bold", color: colors.white, textAlign: "center", marginBottom: 3 },
    headerSubtitle: { fontSize: 9, color: "#93C5FD", textAlign: "center" },
    sectionHeader: { backgroundColor: colors.sectionBg, padding: 10, marginBottom: 10, marginTop: 12, borderRadius: 3, borderLeft: `3px solid ${colors.primary}` },
    sectionTitle: { fontSize: 11, fontWeight: "bold", color: colors.primary },
    sectionRef: { fontSize: 7, color: colors.muted, marginTop: 2 },
    articleTitle: { fontSize: 9, fontWeight: "bold", color: colors.dark, marginBottom: 4, marginTop: 8 },
    bodyText: { fontSize: 8.5, color: colors.text, lineHeight: 1.5, marginBottom: 4 },
    bulletItem: { fontSize: 8.5, color: colors.text, lineHeight: 1.5, marginBottom: 2, paddingLeft: 10 },
    penalBox: { backgroundColor: colors.penalBg, border: `1px solid ${colors.penalBorder}`, borderRadius: 3, padding: 8, marginTop: 6, marginBottom: 6 },
    penalTitle: { fontSize: 8, fontWeight: "bold", color: colors.penalText, marginBottom: 3 },
    penalText: { fontSize: 8, color: colors.penalText, lineHeight: 1.4 },
    divider: { borderBottom: `1px solid ${colors.border}`, marginVertical: 8 },
    footer: { position: "absolute", bottom: 18, left: 30, right: 30, textAlign: "center", fontSize: 7, color: colors.muted, paddingTop: 6, borderTop: `1px solid ${colors.border}` },
    versionBadge: { fontSize: 7, color: colors.muted, textAlign: "right", marginBottom: 6 },
    watermark: { fontSize: 7, color: "#CBD5E1", textAlign: "center", marginTop: 4 },
})

interface Fiche2Props {
    company: { name: string }
    version?: number
}

export function Fiche2DroitsObligations({ company, version = 1 }: Fiche2Props) {
    return (
        <Document>
            {/* PAGE 1 : Harcèlement sexuel + Harcèlement moral */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>AFFICHAGE LÉGAL — DROITS & OBLIGATIONS</Text>
                    <Text style={styles.headerSubtitle}>Textes juridiques obligatoires — {company.name}</Text>
                </View>
                <Text style={styles.versionBadge}>Version ICPP v{version} — Document non modifiable</Text>

                {/* HARCÈLEMENT SEXUEL */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>LUTTE CONTRE LE HARCÈLEMENT SEXUEL</Text>
                    <Text style={styles.sectionRef}>Articles L1153-1 à L1153-6 du Code du travail</Text>
                </View>

                <Text style={styles.articleTitle}>Article L1153-1 — Définition légale</Text>
                <Text style={styles.bodyText}>
                    Aucun salarié ne doit subir des faits :
                </Text>
                <Text style={styles.bulletItem}>
                    1° Soit de harcèlement sexuel, constitué par des propos ou comportements à connotation sexuelle ou sexiste répétés qui portent atteinte à sa dignité en raison de leur caractère dégradant ou humiliant, ou créent à son encontre une situation intimidante, hostile ou offensante ;
                </Text>
                <Text style={styles.bulletItem}>
                    2° Soit assimilés au harcèlement sexuel, consistant en toute forme de pression grave, même non répétée, exercée dans le but réel ou apparent d'obtenir un acte de nature sexuelle.
                </Text>

                <Text style={styles.articleTitle}>Article L1153-2 — Protection du salarié</Text>
                <Text style={styles.bodyText}>
                    Aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi ou refusé de subir des faits de harcèlement sexuel.
                </Text>

                <View style={styles.penalBox}>
                    <Text style={styles.penalTitle}>Sanctions pénales — Article 222-33 du Code pénal</Text>
                    <Text style={styles.penalText}>Le harcèlement sexuel est puni de 2 ans d'emprisonnement et 30 000 € d'amende.</Text>
                    <Text style={styles.penalText}>Peines aggravées : 3 ans d'emprisonnement et 45 000 € d'amende (notamment en cas d'abus d'autorité).</Text>
                </View>

                <View style={styles.divider} />

                {/* HARCÈLEMENT MORAL */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>LUTTE CONTRE LE HARCÈLEMENT MORAL</Text>
                    <Text style={styles.sectionRef}>Articles L1152-1 à L1152-6 du Code du travail</Text>
                </View>

                <Text style={styles.articleTitle}>Article L1152-1</Text>
                <Text style={styles.bodyText}>
                    Aucun salarié ne doit subir des agissements répétés de harcèlement moral ayant pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale, ou de compromettre son avenir professionnel.
                </Text>

                <Text style={styles.articleTitle}>Article L1152-2 — Protection du salarié</Text>
                <Text style={styles.bodyText}>
                    Aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi ou refusé de subir des agissements répétés de harcèlement moral.
                </Text>

                <View style={styles.penalBox}>
                    <Text style={styles.penalTitle}>Sanctions pénales — Article 222-33-2-2 du Code pénal</Text>
                    <Text style={styles.penalText}>Le harcèlement moral est puni de 2 ans d'emprisonnement et 30 000 € d'amende.</Text>
                </View>

                <Text style={styles.footer}>
                    Document ICPP v{version} — Affichage obligatoire — Texte juridique verrouillé — Page 1/2
                </Text>
            </Page>

            {/* PAGE 2 : Discrimination + Égalité professionnelle */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>AFFICHAGE LÉGAL — DROITS & OBLIGATIONS</Text>
                    <Text style={styles.headerSubtitle}>{company.name} — Suite</Text>
                </View>

                {/* DISCRIMINATION */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>LUTTE CONTRE LES DISCRIMINATIONS</Text>
                    <Text style={styles.sectionRef}>Articles L1132-1 et suivants du Code du travail</Text>
                </View>

                <Text style={styles.articleTitle}>Article L1132-1</Text>
                <Text style={styles.bodyText}>
                    Aucune personne ne peut être écartée d'une procédure de recrutement, sanctionnée, licenciée ou faire l'objet d'une mesure discriminatoire en raison notamment de :
                </Text>
                <Text style={styles.bulletItem}>• son origine, son sexe, ses moeurs, son orientation sexuelle, son identité de genre</Text>
                <Text style={styles.bulletItem}>• son âge, sa situation de famille, sa grossesse</Text>
                <Text style={styles.bulletItem}>• ses caractéristiques génétiques</Text>
                <Text style={styles.bulletItem}>• son appartenance ou non-appartenance à une ethnie, une nation ou une prétendue race</Text>
                <Text style={styles.bulletItem}>• ses opinions politiques, ses activités syndicales ou mutualistes</Text>
                <Text style={styles.bulletItem}>• ses convictions religieuses</Text>
                <Text style={styles.bulletItem}>• son apparence physique, son nom de famille</Text>
                <Text style={styles.bulletItem}>• son état de santé, son handicap</Text>
                <Text style={styles.bulletItem}>• sa domiciliation bancaire</Text>

                <View style={styles.penalBox}>
                    <Text style={styles.penalTitle}>Sanctions pénales — Articles 225-1 à 225-4 du Code pénal</Text>
                    <Text style={styles.penalText}>La discrimination est punie de 3 ans d'emprisonnement et 45 000 € d'amende.</Text>
                </View>

                <View style={styles.divider} />

                {/* ÉGALITÉ F/H */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>ÉGALITÉ PROFESSIONNELLE FEMMES / HOMMES</Text>
                    <Text style={styles.sectionRef}>Article L3221-2 du Code du travail</Text>
                </View>

                <Text style={styles.articleTitle}>Article L3221-2 — Égalité de rémunération</Text>
                <Text style={styles.bodyText}>
                    Tout employeur assure, pour un même travail ou pour un travail de valeur égale, l'égalité de rémunération entre les femmes et les hommes.
                </Text>

                <Text style={styles.articleTitle}>Article L1142-1</Text>
                <Text style={styles.bodyText}>
                    Aucune personne ne peut être écartée d'une procédure de recrutement ou sanctionnée en raison de son sexe.
                </Text>

                <View style={styles.divider} />

                <Text style={styles.watermark}>
                    Texte juridique versionné — Non modifiable par l'entreprise — Préparé par ICPP Conformité réglementaire
                </Text>

                <Text style={styles.footer}>
                    Document ICPP v{version} — Affichage obligatoire — Texte juridique verrouillé — Page 2/2
                </Text>
            </Page>
        </Document>
    )
}
