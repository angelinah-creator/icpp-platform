import fs from "fs"
import path from "path"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer"

// ─── Image Loader Cache ───────────────────────────────────────────────────────
const imgCache: Record<string, string> = {}

function img(relPath: string): string {
    if (imgCache[relPath]) return imgCache[relPath]

    const bases = [process.cwd(), "/app", "/opt/icpp-platform"]
    for (const base of bases) {
        const fullPath = path.join(base, "public/assets/attestation", relPath)
        try {
            if (fs.existsSync(fullPath)) {
                const buf = fs.readFileSync(fullPath)
                const ext = path.extname(fullPath).toLowerCase()
                const mime = ext === ".png" ? "image/png" : "image/jpeg"
                const b64 = buf.toString("base64")
                const dataUrl = `data:${mime};base64,${b64}`
                imgCache[relPath] = dataUrl
                return dataUrl
            }
        } catch (e) {
            // ignore
        }
    }
    return ""
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    page: {
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
        color: "#1e293b",
        padding: 0,
        position: "relative",
    },
    // Top Bar (Style_header)
    styleHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 12,
        width: "100%",
        objectFit: "cover",
    },
    // Content wrapper
    container: {
        paddingTop: 50,
        paddingHorizontal: 55,
        paddingBottom: 60,
        flex: 1,
    },
    // Header section
    headerFlex: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 60,
    },
    logo: {
        width: 200,
        height: 40,
        objectFit: "contain",
    },
    headerRight: {
        alignItems: "flex-start",
        maxWidth: 200,
    },
    headerCompany: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 3,
    },
    headerActivity: {
        fontSize: 10,
        color: "#475569",
    },

    // Title
    title: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        color: "#031F5C", // Deep dark blue
        textAlign: "center",
        marginBottom: 20,
        letterSpacing: 0.5,
    },

    // Bill to
    billToLabel: {
        fontSize: 10,
        color: "#64748b",
        marginBottom: 4,
    },
    billToName: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: "#031F5C",
        marginBottom: 30,
    },

    // Meta Block (Dates & Ref)
    metaContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    metaBoxLeft: {
        flex: 1,
        backgroundColor: "#EFF4FF",
        borderTopLeftRadius: 8,
        flexDirection: "row",
        padding: 16,
    },
    metaBoxRight: {
        flex: 1,
        flexDirection: "row",
        padding: 16,
    },
    metaColumn: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 9,
        color: "#64748b",
        marginBottom: 4,
    },
    metaValue: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },

    // Table
    table: {
        width: "100%",
        marginBottom: 0,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: "#F8FAFF",
        paddingHorizontal: 16,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    colDesc: { flex: 4 },
    colQty: { flex: 1, textAlign: "left" },
    colPrice: { flex: 1.5, textAlign: "right" },
    colTotal: { flex: 1.5, textAlign: "right" },
    
    thText: {
        fontSize: 9,
        color: "#64748b",
        fontFamily: "Helvetica-Bold",
    },
    tdText: {
        fontSize: 9,
        color: "#0f172a",
        fontFamily: "Helvetica-Bold",
    },

    // Subtotals
    subtotalsBox: {
        backgroundColor: "#F8FAFF",
        padding: 16,
        marginLeft: "auto",
        width: "50%", // Takes right half
    },
    subRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    subLabel: {
        fontSize: 9,
        color: "#0f172a",
        fontFamily: "Helvetica-Bold",
    },
    subValue: {
        fontSize: 9,
        color: "#0f172a",
        fontFamily: "Helvetica-Bold",
    },

    // Total Due Banner
    totalBanner: {
        backgroundColor: "#0EA5E9",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    totalLabel: {
        fontSize: 12,
        color: "#FFFFFF",
        fontFamily: "Helvetica-Bold",
    },
    totalAmount: {
        fontSize: 12,
        color: "#FFFFFF",
        fontFamily: "Helvetica-Bold",
    },

    // Text in words
    amountInWords: {
        fontSize: 10,
        color: "#64748b",
        textAlign: "right",
        marginTop: 8,
        paddingRight: 16,
    },

    // Signature Block
    signatureContainer: {
        position: "absolute",
        bottom: 100, // Above footer
        left: 55, // Or 95 to shift right, I'll use 55 here to match the design left alignment
        width: 180,
    },
    signatureImage: {
        width: 80,
        height: 50,
        objectFit: "contain",
        marginBottom: 10,
    },
    titulaireImage: {
        width: 140,
        height: 30,
        objectFit: "contain",
    },

    // Footer
    footerBlock: {
        position: "absolute",
        bottom: 40,
        left: 55,
        right: 55,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    footerColumn: {
        flexDirection: "row",
        marginBottom: 4,
    },
    footerLabel: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        width: 60,
    },
    footerValue: {
        fontSize: 8,
        color: "#475569",
        width: 140,
    },
})

// ─── Types ────────────────────────────────────────────────────────────────────
interface FactureProps {
    company: {
        name: string
        metier?: string | null
    }
    facture: {
        numero: string
        reference: string
        dateFacture: string
        dateEcheance: string
        items: Array<{
            description: string
            qte: number
            tarif: number
            montant: number
        }>
        subtotal: number
        tax: number
        total: number
        totalInWords: string
    }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FacturePDF({ company, facture }: FactureProps) {
    return (
        <Document title={`Facture - ${facture.numero} - ${company.name}`}>
            <Page size="A4" style={s.page}>
                {/* Bandeau haut */}
                <Image src={img("Style_header.png")} style={s.styleHeader} />

                <View style={s.container}>
                    {/* En-tête (Logo + Raison sociale) */}
                    <View style={s.headerFlex}>
                        <Image src={img("Header.png")} style={s.logo} />
                        <View style={s.headerRight}>
                            <Text style={s.headerCompany}>{company.name}</Text>
                            {company.metier && <Text style={s.headerActivity}>{company.metier}</Text>}
                        </View>
                    </View>

                    {/* Titre */}
                    <Text style={s.title}>Facture</Text>

                    {/* Facturé au nom de */}
                    <Text style={s.billToLabel}>Facturé au nom de</Text>
                    <Text style={s.billToName}>{company.name}</Text>

                    {/* Meta Dates & Ref */}
                    <View style={s.metaContainer}>
                        <View style={s.metaBoxLeft}>
                            <View style={s.metaColumn}>
                                <Text style={s.metaLabel}>Date d&apos;échéance</Text>
                                <Text style={s.metaValue}>{facture.dateEcheance}</Text>
                            </View>
                            <View style={s.metaColumn}>
                                <Text style={s.metaLabel}>Date de la facture</Text>
                                <Text style={s.metaValue}>{facture.dateFacture}</Text>
                            </View>
                        </View>
                        <View style={s.metaBoxRight}>
                            <View style={s.metaColumn}>
                                <Text style={s.metaLabel}>Numéro de facture</Text>
                                <Text style={s.metaValue}>{facture.numero}</Text>
                            </View>
                            <View style={s.metaColumn}>
                                <Text style={s.metaLabel}>Référence</Text>
                                <Text style={s.metaValue}>{facture.reference}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Table */}
                    <View style={s.table}>
                        <View style={s.tableHeader}>
                            <View style={s.colDesc}><Text style={s.thText}>Description</Text></View>
                            <View style={s.colQty}><Text style={s.thText}>Qté</Text></View>
                            <View style={s.colPrice}><Text style={s.thText}>Tarif</Text></View>
                            <View style={s.colTotal}><Text style={s.thText}>Montant</Text></View>
                        </View>
                        
                        {facture.items.map((item, idx) => (
                            <View key={idx} style={s.tableRow}>
                                <View style={s.colDesc}><Text style={s.tdText}>{item.description}</Text></View>
                                <View style={s.colQty}><Text style={s.tdText}>{item.qte}</Text></View>
                                <View style={s.colPrice}><Text style={s.tdText}>{item.tarif} €</Text></View>
                                <View style={s.colTotal}><Text style={s.tdText}>{item.montant} €</Text></View>
                            </View>
                        ))}
                    </View>

                    {/* Subtotals */}
                    <View style={s.subtotalsBox}>
                        <View style={s.subRow}>
                            <Text style={s.subLabel}>Subtotal</Text>
                            <Text style={s.subValue}>{facture.subtotal} €</Text>
                        </View>
                        <View style={s.subRow}>
                            <Text style={s.subLabel}>Tax (0%)</Text>
                            <Text style={s.subValue}>{facture.tax} €</Text>
                        </View>
                        <View style={s.subRow}>
                            <Text style={s.subLabel}>Total</Text>
                            <Text style={s.subValue}>{facture.total} €</Text>
                        </View>
                    </View>

                    {/* Total Banner */}
                    <View style={s.totalBanner}>
                        <Text style={s.totalLabel}>Total due</Text>
                        <Text style={s.totalAmount}>EUR {facture.total} €</Text>
                    </View>
                    
                    {/* Amount in words */}
                    <Text style={s.amountInWords}>{facture.totalInWords}</Text>
                </View>

                {/* Signature - Alignment matches the left side */}
                <View style={[s.signatureContainer, { marginLeft: 40 }]}>
                    <Image src={img("Signature.png")} style={s.signatureImage} />
                    <Image src={img("Titulaire signature.png")} style={s.titulaireImage} />
                </View>

                {/* Footer Fixe */}
                <View style={s.footerBlock} fixed>
                    <View style={{ flex: 1 }}>
                        <View style={s.footerColumn}>
                            <Text style={s.footerLabel}>Téléphone</Text>
                            <Text style={s.footerValue}>+262 692 45 19 13</Text>
                        </View>
                        <View style={s.footerColumn}>
                            <Text style={s.footerLabel}>E-mail</Text>
                            <Text style={s.footerValue}>emmanuellekaisse@gmail.com</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={s.footerColumn}>
                            <Text style={s.footerLabel}>Site web</Text>
                            <Text style={s.footerValue}>www.icpp-conformite.fr</Text>
                        </View>
                        <View style={s.footerColumn}>
                            <Text style={s.footerLabel}>Adresse</Text>
                            <Text style={s.footerValue}>25 rue de Ponthieu, 75008 Paris</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
}
