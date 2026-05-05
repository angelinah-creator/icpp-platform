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
        marginBottom: 40,
        letterSpacing: 0.5,
    },

    // Contrat Specific
    sectionTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: "#031F5C",
        textTransform: "uppercase",
        marginBottom: 10,
    },
    legalBlock: {
        marginBottom: 20,
    },
    legalText: {
        fontSize: 11,
        color: "#475569",
        lineHeight: 1.5,
    },
    legalBold: {
        fontFamily: "Helvetica-Bold",
    },

    // Signature Block
    signatureContainer: {
        position: "absolute",
        bottom: 100, // Adjusted to place it above footer
        left: 95,    // Shifted to the right as requested
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
interface ContratProps {
    company: {
        name: string
        metier?: string | null
    }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ContratPDF({ company }: ContratProps) {
    return (
        <Document title={`Contrat d'Abonnement - ${company.name}`}>
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

                    {/* Titre Principal */}
                    <Text style={s.title}>Contrat d&apos;Abonnement</Text>

                    {/* Contenu du contrat */}
                    <Text style={s.sectionTitle}>ENTRE LES SOUSSIGNÉS</Text>

                    <View style={s.legalBlock}>
                        <Text style={[s.legalText, s.legalBold]}>ICPP – Institut de Conformité et de Prévention Professionnelle</Text>
                        <Text style={s.legalText}>[Forme juridique] – [Capital social]</Text>
                        <Text style={s.legalText}>Siège social : [Adresse ICPP]</Text>
                        <Text style={s.legalText}>SIRET : [SIRET ICPP]</Text>
                        <Text style={s.legalText}>Représentée par : [Nom / Prénom du représentant]</Text>
                        <Text style={s.legalText}>Ci-après dénommée « ICPP » ou « le Prestataire »,</Text>
                    </View>
                </View>

                {/* Signature - Absolute positioning towards the bottom */}
                <View style={s.signatureContainer}>
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
