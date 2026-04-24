import React from "react"
import { Document, Page, StyleSheet, Text, View, Svg, Path, Defs, LinearGradient, Stop } from "@react-pdf/renderer"

export interface PaymentReceiptData {
    receiptNumber: string
    companyName: string
    clientName: string
    method: string
    amount: number
    currency: string
    planCode: string | null
    paidAt: Date | null
    createdAt: Date
    collectorName: string | null
    validatorName: string | null
}

const styles = StyleSheet.create({
    page: {
        padding: 36,
        backgroundColor: "#f8fafc",
        color: "#0f172a",
        fontSize: 11,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e1",
    },
    heading: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 6,
    },
    subheading: {
        color: "#475569",
        fontSize: 11,
    },
    badge: {
        marginTop: 10,
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 99,
        fontSize: 10,
        fontWeight: 700,
    },
    section: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 12,
        color: "#1e293b",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -6,
    },
    item: {
        width: "50%",
        paddingHorizontal: 6,
        marginBottom: 10,
    },
    label: {
        color: "#64748b",
        fontSize: 9,
        marginBottom: 3,
        textTransform: "uppercase",
    },
    value: {
        fontSize: 11,
        fontWeight: 600,
        color: "#0f172a",
    },
    amount: {
        fontSize: 28,
        fontWeight: 700,
        color: "#0f172a",
    },
    footer: {
        marginTop: 18,
        color: "#64748b",
        fontSize: 9,
        lineHeight: 1.5,
    },
})

function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
    }).format(amount / 100)
}

function formatDate(date: Date | null) {
    if (!date) return "—"
    return new Date(date).toLocaleString("fr-FR")
}

function IcppMark() {
    return (
        <Svg width="48" height="42" viewBox="0 0 391 348">
            <Defs>
                <LinearGradient id="gradBlue" x1="27" y1="43" x2="283" y2="299">
                    <Stop offset="0" stopColor="#2A64FF" />
                    <Stop offset="1" stopColor="#2A43D8" />
                </LinearGradient>
                <LinearGradient id="gradCyan" x1="295" y1="215" x2="381" y2="311">
                    <Stop offset="0" stopColor="#3DD2FF" />
                    <Stop offset="1" stopColor="#08B5F0" />
                </LinearGradient>
            </Defs>
            <Path d="M47.353 0H354.108C369.77 0 377.647 18.942 366.604 29.985L231.835 164.754C226.16 170.429 227.674 180.009 235.17 183.663L263.598 197.52C273.425 202.311 275.37 215.619 267.386 223.103L118.694 362.487C108.628 371.922 92.4113 371.093 83.3649 360.676L52.6584 325.312C43.9112 315.232 44.9799 299.964 55.0863 291.2L168.917 192.481C177.277 185.234 172.151 171.523 161.088 171.523H20.8201C6.6846 171.523 -0.435124 154.46 9.54349 144.481L141.85 12.1742C147.152 6.87218 154.344 3.89375 161.844 3.89375L47.353 0Z" fill="url(#gradBlue)" />
            <Path d="M311.819 219.644L370.778 278.602C374.43 282.255 376.482 287.208 376.482 292.373V398.453C376.482 409.964 367.153 419.293 355.642 419.293H294.574C283.063 419.293 273.734 409.964 273.734 398.453V239.59C273.734 221.045 298.706 210.095 311.819 219.644Z" transform="translate(0 -71.293)" fill="url(#gradCyan)" />
        </Svg>
    )
}

export function PaymentReceiptDocument({ data }: { data: PaymentReceiptData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.heading}>Ticket d’abonnement payé</Text>
                        <Text style={styles.subheading}>Justificatif ICPP de règlement client</Text>
                        <Text style={styles.badge}>{data.receiptNumber}</Text>
                    </View>
                    <IcppMark />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Montant confirmé</Text>
                    <Text style={styles.amount}>{formatAmount(data.amount, data.currency || "EUR")}</Text>
                    <Text style={styles.subheading}>Paiement validé pour le plan {data.planCode || "ICPP"}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations client</Text>
                    <View style={styles.grid}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Entreprise</Text>
                            <Text style={styles.value}>{data.companyName}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>Contact client</Text>
                            <Text style={styles.value}>{data.clientName}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>Mode de paiement</Text>
                            <Text style={styles.value}>{data.method}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>Date du paiement</Text>
                            <Text style={styles.value}>{formatDate(data.paidAt || data.createdAt)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Traçabilité interne</Text>
                    <View style={styles.grid}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Collecteur</Text>
                            <Text style={styles.value}>{data.collectorName || "Stripe / validation automatique"}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>Validé par</Text>
                            <Text style={styles.value}>{data.validatorName || "Système ICPP"}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>Créé le</Text>
                            <Text style={styles.value}>{formatDate(data.createdAt)}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.label}>Devise</Text>
                            <Text style={styles.value}>{data.currency}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Document généré automatiquement par ICPP. Ce ticket atteste de la confirmation du paiement d’abonnement et peut être conservé comme justificatif interne.
                </Text>
            </Page>
        </Document>
    )
}