import React from "react"
import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer"

export interface ContractPdfData {
    numeroContrat: string
    companyName: string
    cgvVersion: string
    dateDebut: Date
    signedAt: Date | null
    cgvContenu: string
    signatureDataUrl: string | null
}

const styles = StyleSheet.create({
    page: {
        padding: 36,
        fontSize: 11,
        color: "#0f172a",
    },
    title: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 12,
        color: "#475569",
        marginBottom: 18,
    },
    section: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
    },
    label: {
        fontSize: 9,
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        color: "#0f172a",
        marginBottom: 8,
    },
    cgvText: {
        fontSize: 10,
        lineHeight: 1.5,
        color: "#0f172a",
        marginBottom: 2,
    },
    signatureBox: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 6,
        minHeight: 120,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    signatureImage: {
        width: 240,
        height: 80,
        objectFit: "contain",
    },
    muted: {
        color: "#64748b",
        fontSize: 10,
    },
})

export function ContractPdfDocument({ data }: { data: ContractPdfData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Contrat client ICPP</Text>
                <Text style={styles.subtitle}>Contrat {data.numeroContrat}</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Entreprise</Text>
                    <Text style={styles.value}>{data.companyName}</Text>

                    <Text style={styles.label}>Version CGV</Text>
                    <Text style={styles.value}>{data.cgvVersion}</Text>

                    <Text style={styles.label}>Date de debut</Text>
                    <Text style={styles.value}>{new Date(data.dateDebut).toLocaleDateString("fr-FR")}</Text>

                    <Text style={styles.label}>Date de signature</Text>
                    <Text style={styles.value}>{data.signedAt ? new Date(data.signedAt).toLocaleDateString("fr-FR") : "Non signee"}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Conditions generales</Text>
                    {data.cgvContenu.split("\n").map((line, idx) => (
                        <Text key={`${idx}-${line}`} style={styles.cgvText}>{line || " "}</Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Signature numerique client</Text>
                    <View style={styles.signatureBox}>
                        {data.signatureDataUrl ? (
                            <Image src={data.signatureDataUrl} style={styles.signatureImage} />
                        ) : (
                            <Text style={styles.muted}>Signature non disponible</Text>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    )
}
