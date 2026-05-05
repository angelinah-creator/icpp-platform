import React from "react"
import {
    Document,
    Page,
    Text,
    Image,
    StyleSheet,
} from "@react-pdf/renderer"

const s = StyleSheet.create({
    page: {
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica",
        position: "relative",
    },
})

import * as fs from "fs"
import * as path from "path"

const imgCache: Record<string, string> = {}

function img(relPath: string): string {
    if (imgCache[relPath]) return imgCache[relPath]

    const fullPath = path.join(process.cwd(), "public", relPath)
    try {
        if (fs.existsSync(fullPath)) {
            const buf = fs.readFileSync(fullPath)
            const ext = path.extname(fullPath).toLowerCase()
            const mime = ext === ".png" ? "image/png" : "image/jpeg"
            const b64 = buf.toString("base64")
            const dataUri = `data:${mime};base64,${b64}`
            imgCache[relPath] = dataUri
            return dataUri
        }
    } catch (e) {
        console.error("Erreur chargement image", relPath, e)
    }
    return "" // Fallback
}

export const AffichageConsignesA4 = ({ company }: { company: { name: string, siret?: string } }) => {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={s.page}>
                <Image src={img("/assets/affichages/consignes/Header.png")} style={{ position: "absolute", top: 0, left: 0, width: "100%" }} />
                <Image src={img("/assets/affichages/consignes/Template_content.png")} style={{ position: "absolute", top: 50, left: 0, width: "100%", height: 490, objectFit: "contain" }} />
                <Image src={img("/assets/affichages/consignes/Footer.png")} style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} />
                
                {/* Footer overlays */}
                <Text style={{ position: "absolute", bottom: 15, left: 100, fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold" }}>
                    {company.name}
                </Text>
                <Text style={{ position: "absolute", bottom: 15, left: 350, fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold" }}>
                    {company.siret || "N/A"}
                </Text>
            </Page>
        </Document>
    )
}
