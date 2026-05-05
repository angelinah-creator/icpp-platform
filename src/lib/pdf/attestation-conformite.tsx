import fs from "fs"
import path from "path"
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer"

// ─── Font Registration ────────────────────────────────────────────────────────
// React-PDF natively supports Helvetica and Helvetica-Bold.
// We don't need to load external fonts unless requested.

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
        marginBottom: 50,
        letterSpacing: 0.5,
    },

    // Introduction block
    introText: {
        fontSize: 11,
        color: "#475569",
        marginBottom: 8,
    },
    introCompany: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        marginBottom: 30,
    },
    paragraph: {
        fontSize: 11,
        color: "#475569",
        lineHeight: 1.6,
        marginBottom: 20,
    },
    boldDark: {
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
    },

    // Accompagnement
    listTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#475569",
        marginBottom: 10,
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 6,
        paddingLeft: 10,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#475569",
        marginTop: 5,
        marginRight: 8,
    },
    listText: {
        fontSize: 11,
        color: "#475569",
        lineHeight: 1.4,
        flex: 1,
    },

    // Dates
    datesBlock: {
        marginTop: 35,
        marginBottom: 35,
    },
    dateLine: {
        fontSize: 11,
        color: "#475569",
        marginBottom: 4,
    },

    // Fait pour servir
    faitPourServir: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: "#475569",
        marginBottom: 20,
    },

    // Signature Block
    signatureContainer: {
        marginTop: 10,
        marginLeft: 40,
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
interface AttestationConformiteProps {
    company: {
        name: string
        siret?: string | null
        address?: string | null
        postalCode?: string | null
        city?: string | null
        metier?: string | null
        employeeCount?: number
    }
    duerp: {
        id: string
        version: number
        signedAt: string | Date
        nextReviewDate?: string | Date | null
    }
    signer: {
        name: string
        role: string
    }
    generatedAt?: Date
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AttestationConformitePDF({
    company,
    duerp,
}: AttestationConformiteProps) {
    const formatDate = (d: string | Date) =>
        new Date(d).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })

    const startDate = formatDate(duerp.signedAt)

    return (
        <Document title={`Attestation d'accompagnement - ${company.name}`}>
            <Page size="A4" style={s.page}>
                {/* Bandeau haut (Style_header) */}
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

                    {/* Titre Principal */}
                    <Text style={s.title}>Attestation d&apos;accompagnement</Text>

                    {/* Introduction */}
                    <Text style={s.introText}>Nous attestons que l&apos;entreprise</Text>
                    <Text style={s.introCompany}>{company.name}</Text>

                    <Text style={s.paragraph}>
                        est <Text style={s.boldDark}>accompagnée par ICPP Conformité</Text> dans le cadre de{" "}
                        <Text style={s.boldDark}>ses obligations réglementaires en matière de santé, sécurité et prévention des risques professionnels</Text>, 
                        conformément aux dispositions du Code du travail.
                    </Text>

                    {/* Liste d'accompagnement */}
                    <Text style={s.listTitle}>Cet accompagnement comprend notamment :</Text>
                    
                    <View style={s.listItem}>
                        <View style={s.bullet} />
                        <Text style={s.listText}>la réalisation et la mise à jour du Document Unique d&apos;Évaluation des Risques Professionnels (DUERP),</Text>
                    </View>
                    <View style={s.listItem}>
                        <View style={s.bullet} />
                        <Text style={s.listText}>le suivi annuel de conformité,</Text>
                    </View>
                    <View style={s.listItem}>
                        <View style={s.bullet} />
                        <Text style={s.listText}>l&apos;assistance en cas de modification de situation,</Text>
                    </View>
                    <View style={s.listItem}>
                        <View style={s.bullet} />
                        <Text style={s.listText}>la mise à disposition des affichages obligatoires réglementaires,</Text>
                    </View>
                    <View style={s.listItem}>
                        <View style={s.bullet} />
                        <Text style={s.listText}>un accompagnement continu en prévention.</Text>
                    </View>

                    {/* Section Dates */}
                    <View style={s.datesBlock}>
                        <Text style={s.dateLine}><Text style={s.boldDark}>Date de début d&apos;accompagnement :</Text> {startDate}</Text>
                        <Text style={s.dateLine}><Text style={s.boldDark}>Validité :</Text> Tant que l&apos;abonnement ICPP Conformité est actif</Text>
                    </View>

                    {/* Phrase légale */}
                    <Text style={s.faitPourServir}>Fait pour servir et valoir ce que de droit.</Text>

                    {/* Signature */}
                    <View style={s.signatureContainer}>
                        <Image src={img("Signature.png")} style={s.signatureImage} />
                        <Image src={img("Titulaire signature.png")} style={s.titulaireImage} />
                    </View>
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
