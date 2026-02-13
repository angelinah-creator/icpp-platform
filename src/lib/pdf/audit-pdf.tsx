import ReactPDF, { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"

// Styles pour le PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1e293b"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        paddingBottom: 15,
        borderBottom: "2 solid #e2e8f0"
    },
    logo: {
        width: 120,
        height: 40
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0f172a",
        marginBottom: 5
    },
    subtitle: {
        fontSize: 12,
        color: "#64748b",
        marginBottom: 20
    },
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#334155",
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: "1 solid #e2e8f0"
    },
    scoreContainer: {
        backgroundColor: "#f8fafc",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15
    },
    scoreText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#0f172a",
        textAlign: "center"
    },
    scoreLabel: {
        fontSize: 11,
        color: "#64748b",
        textAlign: "center",
        marginTop: 5
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15
    },
    infoItem: {
        width: "45%",
        marginBottom: 10
    },
    infoLabel: {
        fontSize: 9,
        color: "#64748b",
        marginBottom: 3
    },
    infoValue: {
        fontSize: 11,
        color: "#1e293b",
        fontWeight: "bold"
    },
    table: {
        width: "100%",
        marginTop: 10
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1 solid #e2e8f0",
        paddingVertical: 8
    },
    tableHeader: {
        backgroundColor: "#f1f5f9",
        fontWeight: "bold",
        paddingVertical: 10
    },
    tableCol: {
        flex: 1,
        paddingHorizontal: 8
    },
    riskCard: {
        backgroundColor: "#f8fafc",
        padding: 12,
        borderRadius: 6,
        marginBottom: 10,
        border: "1 solid #e2e8f0"
    },
    riskHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8
    },
    riskCategory: {
        fontSize: 8,
        color: "#64748b",
        textTransform: "uppercase" as const,
        marginBottom: 3
    },
    riskName: {
        fontSize: 11,
        color: "#0f172a",
        fontWeight: "bold"
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: "bold"
    },
    riskMetrics: {
        flexDirection: "row",
        gap: 15,
        marginTop: 8
    },
    metric: {
        flex: 1
    },
    metricLabel: {
        fontSize: 8,
        color: "#64748b",
        marginBottom: 4
    },
    metricBar: {
        flexDirection: "row",
        gap: 2,
        height: 6
    },
    metricSegment: {
        flex: 1,
        borderRadius: 1
    },
    footer: {
        position: "absolute" as const,
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center" as const,
        fontSize: 8,
        color: "#94a3b8",
        borderTop: "1 solid #e2e8f0",
        paddingTop: 10
    }
})

interface AuditData {
    id: string
    status: string
    score: number | null
    commentaire: string | null
    createdAt: Date
    company: {
        name: string
        email: string | null
        phone: string | null
        address: string | null
        city: string | null
        postalCode: string | null
        employeeCount: number
        metier: string | null
    }
    auditor: {
        name: string | null
        email: string | null
    } | null
    documents: Array<{
        type: string
        present: boolean
        conforme: boolean
    }>
    risques: Array<{
        categorie: string
        nom: string
        gravite: number | null
        frequence: number | null
        priorite: number | null
    }>
}

function formatDocumentType(type: string): string {
    const labels: Record<string, string> = {
        "DUERP": "DUERP existant et accessible",
        "AFFICHAGES": "Affichages obligatoires présents",
        "EXTINCTEURS": "Extincteurs présents et vérifiés",
        "REGISTRE": "Registre de sécurité à jour",
        "PERSONNEL": "Registre unique du personnel",
        "FORMATIONS": "Formations sécurité réalisées"
    }
    return labels[type] || type
}

function getPriorityLabel(priorite: number | null): string {
    if (!priorite) return "Non évalué"
    if (priorite >= 15) return "Critique"
    if (priorite >= 9) return "Élevé"
    return "Modéré"
}

function getPriorityColor(priorite: number | null): { backgroundColor: string; color: string } {
    if (!priorite) return { backgroundColor: "#f1f5f9", color: "#64748b" }
    if (priorite >= 15) return { backgroundColor: "#fee2e2", color: "#991b1b" }
    if (priorite >= 9) return { backgroundColor: "#fed7aa", color: "#9a3412" }
    return { backgroundColor: "#fef3c7", color: "#854d0e" }
}

const AuditPDFDocument = ({ audit }: { audit: AuditData }) => {
    const formattedDate = new Date(audit.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Rapport d'audit</Text>
                        <Text style={styles.subtitle}>{audit.company.name}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 10, color: "#64748b" }}>Date: {formattedDate}</Text>
                        <Text style={{ fontSize: 10, color: "#64748b" }}>Auditeur: {audit.auditor?.name || "Non assigné"}</Text>
                    </View>
                </View>

                {/* Score */}
                {audit.score !== null && (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreText}>{audit.score}%</Text>
                        <Text style={styles.scoreLabel}>Score de conformité global</Text>
                    </View>
                )}

                {/* Informations entreprise */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations entreprise</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Nom</Text>
                            <Text style={styles.infoValue}>{audit.company.name}</Text>
                        </View>
                        {audit.company.metier && (
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Métier</Text>
                                <Text style={styles.infoValue}>{audit.company.metier}</Text>
                            </View>
                        )}
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Effectif</Text>
                            <Text style={styles.infoValue}>
                                {audit.company.employeeCount} salarié{audit.company.employeeCount > 1 ? "s" : ""}
                            </Text>
                        </View>
                        {audit.company.email && (
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{audit.company.email}</Text>
                            </View>
                        )}
                        {audit.company.phone && (
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Téléphone</Text>
                                <Text style={styles.infoValue}>{audit.company.phone}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Documents */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vérification documentaire</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <View style={styles.tableCol}>
                                <Text>Document</Text>
                            </View>
                            <View style={[styles.tableCol, { flex: 0.3, textAlign: "center" }]}>
                                <Text>Statut</Text>
                            </View>
                        </View>
                        {audit.documents.map((doc, index) => (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text>{formatDocumentType(doc.type)}</Text>
                                </View>
                                <View style={[styles.tableCol, { flex: 0.3, textAlign: "center" }]}>
                                    <Text style={{ color: doc.conforme ? "#16a34a" : "#dc2626" }}>
                                        {doc.conforme ? "✓ Conforme" : "✗ Non conforme"}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Risques - Nouvelle page si nécessaire */}
                {audit.risques.length > 0 && (
                    <View style={styles.section} break={audit.risques.length > 5}>
                        <Text style={styles.sectionTitle}>Risques identifiés ({audit.risques.length})</Text>
                        {audit.risques.map((risque, index) => {
                            const priorityStyle = getPriorityColor(risque.priorite)
                            return (
                                <View key={index} style={styles.riskCard}>
                                    <View style={styles.riskHeader}>
                                        <View>
                                            <Text style={styles.riskCategory}>{risque.categorie}</Text>
                                            <Text style={styles.riskName}>{risque.nom}</Text>
                                        </View>
                                        <View style={[styles.riskBadge, priorityStyle]}>
                                            <Text>{getPriorityLabel(risque.priorite)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.riskMetrics}>
                                        <View style={styles.metric}>
                                            <Text style={styles.metricLabel}>Gravité</Text>
                                            <View style={styles.metricBar}>
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <View
                                                        key={n}
                                                        style={[
                                                            styles.metricSegment,
                                                            { backgroundColor: n <= (risque.gravite || 0) ? "#ef4444" : "#e5e7eb" }
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                        <View style={styles.metric}>
                                            <Text style={styles.metricLabel}>Fréquence</Text>
                                            <View style={styles.metricBar}>
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <View
                                                        key={n}
                                                        style={[
                                                            styles.metricSegment,
                                                            { backgroundColor: n <= (risque.frequence || 0) ? "#fb923c" : "#e5e7eb" }
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                )}

                {/* Observations */}
                {audit.commentaire && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Observations</Text>
                        <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{audit.commentaire}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        ICPP Platform - Rapport d'audit généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                        Document confidentiel - Réservé à l'usage exclusif de {audit.company.name}
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export async function generateAuditPDF(audit: AuditData): Promise<Uint8Array> {
    const pdfStream = await ReactPDF.renderToStream(<AuditPDFDocument audit={audit} />)

    const chunks: Uint8Array[] = []
    return new Promise((resolve, reject) => {
        pdfStream.on('data', (chunk) => chunks.push(chunk))
        pdfStream.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))))
        pdfStream.on('error', reject)
    })
}
