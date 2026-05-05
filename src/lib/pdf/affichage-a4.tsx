import React from "react"
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer"
import fs from "fs"
import path from "path"

function loadBase64(relativePath: string): string {
  try {
    const full = path.join(process.cwd(), "public", relativePath)
    const buf = fs.readFileSync(full)
    const ext = path.extname(relativePath).slice(1)
    return `data:image/${ext};base64,${buf.toString("base64")}`
  } catch {
    return ""
  }
}

const HEADER_IMG = loadBase64("assets/affichages/a4/Header.png")
const FOOTER_IMG = loadBase64("assets/affichages/a4/Footer.png")

// ── colors ──────────────────────────────────────────────
const NAVY   = "#0F1B4C"
const TEAL   = "#00B4C8"
const GREEN  = "#2E7D32"
const LGRAY  = "#F1F5F9"
const DGRAY  = "#334155"
const WHITE  = "#FFFFFF"
const PINK_BG = "#FEE2E2"
const YELLOW_BG = "#FEF9C3"
const LBLUE_BG = "#EFF6FF"

// A4 landscape = 841.89 × 595.28 pt
// header=48pt, footer=36pt (absolute) → body must fit in 595-48=547pt (footer overlaps last 36pt)
// Setting body height explicitly to 507pt leaves a safe 4pt gap above footer
const PAGE_H   = 595
const HEADER_H = 48
const FOOTER_H = 36
const BODY_H   = PAGE_H - HEADER_H - FOOTER_H - 4   // 507

const s = StyleSheet.create({
  page:  { flexDirection:"column", backgroundColor:WHITE, margin:0, padding:0 },
  header:{ width:"100%", height:HEADER_H },
  footer:{ width:"100%", height:FOOTER_H, position:"absolute", bottom:0, left:0 },
  footerNom:    { position:"absolute", bottom:14, left:80, fontSize:7, color:WHITE, fontFamily:"Helvetica-Bold" },
  footerSiret:  { position:"absolute", bottom:14, left:390, fontSize:7, color:WHITE, fontFamily:"Helvetica" },

  // body fixed height — prevents overflow to page 2
  body: { flexDirection:"row", height:BODY_H, overflow:"hidden", padding:0 },

  // columns — overflow hidden clips any content that would spill
  col1: { width:"27%", paddingRight:3, paddingLeft:5, paddingTop:3, overflow:"hidden" },
  col2: { width:"36%", paddingHorizontal:3, paddingTop:3, borderLeftWidth:1, borderColor:"#E2E8F0", overflow:"hidden" },
  col3: { width:"37%", paddingLeft:3, paddingRight:5, paddingTop:3, borderLeftWidth:1, borderColor:"#E2E8F0", overflow:"hidden" },

  // section header row (navy bg)
  sHead:    { flexDirection:"row", alignItems:"center", backgroundColor:NAVY, paddingHorizontal:4, paddingVertical:2, marginBottom:1 },
  sHeadTxt: { color:WHITE, fontSize:6.5, fontFamily:"Helvetica-Bold" },
  sHeadSub: { color:"#94A3B8", fontSize:5, fontFamily:"Helvetica", marginTop:0.5 },
  sIcon:    { width:9, height:9, borderRadius:4.5, backgroundColor:TEAL, marginRight:3, alignItems:"center", justifyContent:"center" },

  // section body
  sBody: { paddingHorizontal:4, paddingVertical:2, marginBottom:2 },
  row:   { flexDirection:"row", marginBottom:1 },
  lbl:   { fontSize:6, fontFamily:"Helvetica-Bold", color:DGRAY, width:50 },
  val:   { fontSize:6, fontFamily:"Helvetica", color:"#1E293B", flex:1 },
  italic:{ fontSize:5.5, fontFamily:"Helvetica-Oblique", color:"#64748B", marginBottom:1.5 },

  // urgences
  urgRow:  { flexDirection:"row", alignItems:"center", marginBottom:1.5 },
  urgLbl:  { fontSize:6, fontFamily:"Helvetica", color:DGRAY, flex:1 },
  badge:   { width:15, height:9, borderRadius:2.5, alignItems:"center", justifyContent:"center", marginRight:3 },
  badgeTxt:{ fontSize:5.5, fontFamily:"Helvetica-Bold", color:WHITE },

  // big section headers
  bigHead:  { flexDirection:"column", padding:4, marginBottom:2 },
  bigTitle: { fontSize:6.5, fontFamily:"Helvetica-Bold", color:WHITE, marginBottom:1 },
  bigSub:   { fontSize:5, fontFamily:"Helvetica", color:"#CBD5E1" },
  bigBody:  { paddingHorizontal:4, paddingBottom:2 },
  para:     { fontSize:5.5, fontFamily:"Helvetica", color:DGRAY, lineHeight:1.3, marginBottom:2.5, textAlign:"justify" },

  // penalty box
  penaltyBox:       { borderRadius:3, padding:4, marginVertical:2, marginHorizontal:4 },
  penaltyMain:      { fontSize:8, fontFamily:"Helvetica-Bold", color:"#991B1B", marginBottom:1 },
  penaltyMainGreen: { fontSize:8, fontFamily:"Helvetica-Bold", color:GREEN, marginBottom:1 },
  penaltyDesc:      { fontSize:5.5, fontFamily:"Helvetica", color:"#7F1D1D", lineHeight:1.25 },
  penaltyDescGreen: { fontSize:5.5, fontFamily:"Helvetica", color:"#166534", lineHeight:1.25 },
  refs:    { paddingHorizontal:4, marginBottom:2 },
  refTxt:  { fontSize:5, fontFamily:"Helvetica-Oblique", color:"#94A3B8" },

  // organisation table
  orgTable:   { marginHorizontal:4, marginBottom:2 },
  orgHead:    { flexDirection:"row", backgroundColor:NAVY, paddingVertical:1.5 },
  orgHeadTxt: { flex:1, fontSize:5.5, fontFamily:"Helvetica-Bold", color:WHITE, textAlign:"center" },
  orgRow:     { flexDirection:"row", paddingVertical:1, borderBottomWidth:0.5, borderColor:"#E2E8F0" },
  orgDay:     { width:38, fontSize:5.5, fontFamily:"Helvetica-Bold", color:NAVY },
  orgVal:     { flex:1, fontSize:5.5, fontFamily:"Helvetica", color:DGRAY, textAlign:"center" },

  // interdiction fumer
  fumeurBox: { marginHorizontal:4, padding:3, borderWidth:0.5, borderColor:"#FCA5A5", borderRadius:3, backgroundColor:"#FFF7F7" },
  fumeurLbl: { fontSize:5.5, fontFamily:"Helvetica", color:DGRAY, lineHeight:1.25, marginBottom:1 },
  fumeurRef: { fontSize:5, fontFamily:"Helvetica-Bold", color:DGRAY },

  // coordonnées autorités
  authBox:   { margin:4, borderWidth:0.5, borderColor:"#CBD5E1", borderRadius:3, padding:4 },
  authTitle: { fontSize:6, fontFamily:"Helvetica-Bold", color:NAVY, marginBottom:2.5 },
  authRow:   { flexDirection:"row", alignItems:"center", marginBottom:1.5 },
  authLbl:   { fontSize:5.5, fontFamily:"Helvetica", color:DGRAY, flex:1 },
  authTel:   { fontSize:5.5, fontFamily:"Helvetica", color:DGRAY, width:48 },

  divider: { borderBottomWidth:0.5, borderColor:"#E2E8F0", marginVertical:1.5 },
})

// ── helpers ──────────────────────────────────────────────
function SectionHeader({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <View style={s.sHead}>
      <View style={s.sIcon}><Text style={{ fontSize:6, color:WHITE }}>{icon}</Text></View>
      <View>
        <Text style={s.sHeadTxt}>{title}</Text>
        {sub && <Text style={s.sHeadSub}>{sub}</Text>}
      </View>
    </View>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.lbl}>{label}</Text>
      <Text style={s.val}>{value || "—"}</Text>
    </View>
  )
}

function UrgBadge({ num, color }: { num: string; color: string }) {
  return (
    <View style={[s.badge, { backgroundColor: color }]}>
      <Text style={s.badgeTxt}>{num}</Text>
    </View>
  )
}

function BigSection({ bg, title, sub, children }: { bg?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <View style={[s.bigHead, { backgroundColor: bg || NAVY }]}>
        <Text style={s.bigTitle}>{title}</Text>
        {sub && <Text style={s.bigSub}>{sub}</Text>}
      </View>
      {children}
    </View>
  )
}

// ── data type ────────────────────────────────────────────
export interface AffichageA4Data {
  company: { name: string; address: string; city: string; siret?: string; employeeCount?: number }
  inspection: { inspecteur: string; adresse: string; telephone: string; horaires?: string }
  medecine:   { service: string; adresse: string; telephone: string; medecinReferent: string }
  referent?:  { nom: string; telephone: string }
  convention?: { intitule: string; idcc: string; lieuConsultation: string }
  organisation?: Record<string, { matin: string; apresMidi: string }>
  horaires?: { tempsPause: string; matin: string; apresMidi: string }
  conges?: { consultableAupresDe: string }
  urgences?: { samu?: string; police?: string; pompiers?: string }
  duerp?: { lieuConsultation: string; acces: string }
  horairesCollectifs?: string
}

// ── document ─────────────────────────────────────────────
export function AffichageObligatoireA4({ data }: { data: AffichageA4Data }) {
  const DAYS = ["LUNDI","MARDI","MERCREDI","JEUDI","VENDREDI","SAMEDI","DIMANCHE"]
  const org = data.organisation || {}
  const urgences = data.urgences || {}
  const horaires = data.horaires || { tempsPause:"", matin:"", apresMidi:"" }
  const conv = data.convention || { intitule:"", idcc:"", lieuConsultation:"Sur demande" }
  const duerp = data.duerp || { lieuConsultation:"Direction", acces:"Sur demande" }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        {/* HEADER */}
        {HEADER_IMG && <Image src={HEADER_IMG} style={s.header} />}

        <View style={s.body}>
          {/* ═══ COLUMN 1 ═══ */}
          <View style={s.col1}>

            {/* Inspection du Travail */}
            <SectionHeader icon="⚖" title="Inspection du Travail" sub="Art L. 4711-1 du Code du travail." />
            <View style={s.sBody}>
              <InfoRow label="Inspecteur :" value={data.inspection.inspecteur} />
              <InfoRow label="Adresse :" value={data.inspection.adresse} />
              <InfoRow label="Téléphone :" value={data.inspection.telephone} />
            </View>

            {/* Médecine du Travail */}
            <SectionHeader icon="+" title="Médecine du Travail (SPST)" sub="Art D. 4711-1 du Code du travail" />
            <View style={s.sBody}>
              <InfoRow label="Service :" value={data.medecine.service} />
              <InfoRow label="Adresse :" value={data.medecine.adresse} />
              <InfoRow label="Téléphone :" value={data.medecine.telephone} />
              <View style={s.row}>
                <Text style={[s.lbl, { color: TEAL }]}>Médecin référent :</Text>
                <Text style={[s.val, { color: TEAL }]}>{data.medecine.medecinReferent || "—"}</Text>
              </View>
            </View>

            {/* Convention collective */}
            <SectionHeader icon="©" title="Convention collective applicable" sub="Art R. 2262-1 à R. 2262-5 du Code du travail." />
            <View style={s.sBody}>
              <InfoRow label="Intitulé :" value={conv.intitule} />
              <InfoRow label="N° IDCC :" value={conv.idcc} />
              <InfoRow label="Lieu de consultation :" value={conv.lieuConsultation} />
            </View>

            {/* Organisation du Travail */}
            <SectionHeader icon="≡" title="Organisation du Travail" />
            <View style={s.orgTable}>
              <View style={s.orgHead}>
                <Text style={[s.orgHeadTxt, { width:40, textAlign:"left" }]}> </Text>
                <Text style={s.orgHeadTxt}>MATIN</Text>
                <Text style={s.orgHeadTxt}>APRÈS-MIDI</Text>
              </View>
              {DAYS.map(day => (
                <View key={day} style={s.orgRow}>
                  <Text style={s.orgDay}>{day}</Text>
                  <Text style={s.orgVal}>{org[day]?.matin || ""}</Text>
                  <Text style={s.orgVal}>{org[day]?.apresMidi || ""}</Text>
                </View>
              ))}
            </View>

            {/* Horaires de travail */}
            <SectionHeader icon="⏰" title="Horaires de travail" sub="Art L. 3171-1 et R. 3172-1 du Code du travail." />
            <View style={s.sBody}>
              <InfoRow label="Temps de pause :" value={horaires.tempsPause} />
              <InfoRow label="Matin :" value={horaires.matin} />
              <InfoRow label="Après-midi :" value={horaires.apresMidi} />
            </View>

            {/* Repos hebdomadaire */}
            <SectionHeader icon="☽" title="Repos hebdomadaire" />
            <View style={s.sBody}>
              <Text style={s.italic}>Art R. 3172-1 à R. 3172-9 du Code du travail</Text>
            </View>

            {/* Congés Payés */}
            <SectionHeader icon="✈" title="Congés Payés" />
            <View style={s.sBody}>
              <Text style={s.italic}>Ordre des départs en congé</Text>
              <Text style={s.italic}>ArtD. 3141-6 du Code du travail.</Text>
              <InfoRow label="Consultable auprès de" value={data.conges?.consultableAupresDe || "Direction / RH"} />
            </View>

            {/* Interdiction de fumer */}
            <SectionHeader icon="⊘" title="Interdiction de fumer" />
            <View style={s.fumeurBox}>
              <Text style={s.fumeurLbl}>Interdiction de fumer et de vapoter</Text>
              <Text style={[s.fumeurRef, { marginBottom:1 }]}>Réf. légale : Art. R.3512-2 Code santé publique</Text>
              <Text style={s.fumeurRef}>Sanction : Amende forfaitaire de 135 € ou poursuites judiciaires (jusqu'à 750 €)</Text>
              <Text style={[s.fumeurRef, { marginTop:1 }]}>Aide à l'arrêt : tabac-info-service.fr</Text>
              <View style={{ backgroundColor:NAVY, borderRadius:2, padding:3, marginTop:3, alignItems:"center" }}>
                <Text style={{ fontSize:6, color:WHITE, fontFamily:"Helvetica-Bold" }}>☎ Tabac Info Service  39 89</Text>
              </View>
              <Text style={[s.italic, { marginTop:2, textAlign:"center" }]}>Conforme à l'annexe 1 - Arrêté du 21 juillet 2025</Text>
            </View>
          </View>

          {/* ═══ COLUMN 2 ═══ */}
          <View style={s.col2}>

            {/* Services d'Urgence */}
            <SectionHeader icon="⚠" title="Services d'Urgence" sub="Art D. 4711-1 du Code du travail." />
            <View style={[s.sBody, { paddingBottom:1 }]}>
              <Text style={[s.italic, { marginBottom:3 }]}>Art D. 4711-1 du Code du travail.</Text>
              {[
                { lbl:"SAMU :", num: urgences.samu || "15", color:"#16A34A" },
                { lbl:"Police / Gendarmerie :", num: urgences.police || "17", color:"#EA580C" },
                { lbl:"Sapeurs Pompiers :", num: urgences.pompiers || "18", color:"#DC2626" },
                { lbl:"Urgence Européenne :", num:"112", color:"#1D4ED8" },
                { lbl:"Sourds & Malentendants :", num:"114", color:"#0284C7" },
              ].map(u => (
                <View key={u.num} style={s.urgRow}>
                  <Text style={[s.urgLbl, { flex:1 }]}>{u.lbl}</Text>
                  <UrgBadge num={u.num} color={u.color} />
                  <Text style={{ fontSize:6, color:DGRAY }}>Ou</Text>
                </View>
              ))}
              <InfoRow label="Centre Anti-poison :" value="" />
              <InfoRow label="SOS Mains :" value="" />
              <View style={{ backgroundColor:LGRAY, borderRadius:2, padding:4, marginTop:2 }}>
                <Text style={{ fontSize:7, fontFamily:"Helvetica-Bold", color:NAVY }}>Défenseur des droits : 09.69.39.00.00</Text>
                <Text style={{ fontSize:5.5, color:DGRAY, fontFamily:"Helvetica" }}>(appel non surtaxe, discrimination & harcèlement, lundi au vendredi 9h-18h)</Text>
              </View>
            </View>

            {/* Accès au Droit */}
            <SectionHeader icon="⚖" title="Accès au Droit" />
            <View style={s.sBody}>
              <Text style={{ fontSize:6.5, fontFamily:"Helvetica-Bold", color:DGRAY, marginBottom:1 }}>Document Unique (DUERP)</Text>
              <Text style={s.italic}>Art L4121-3 et R4121-1 à R4121-4 du Code du Travail</Text>
              <InfoRow label="Lieu de consultation :" value={duerp.lieuConsultation} />
              <InfoRow label="Accès :" value={duerp.acces} />
            </View>

            {/* Harcèlement moral */}
            <BigSection
              title="LUTTE CONTRE LE HARCELEMENT MORAL"
              sub="Article 222-33-2 du Code Penal  |  Articles L.1152-1 a L.1154-1 du Code du Travail"
            >
              <View style={s.bigBody}>
                <Text style={s.para}>
                  Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale ou de compromettre son avenir professionnel.
                </Text>
                <Text style={s.para}>
                  Aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi, refusé de subir ou témoigné de tels agissements.
                </Text>
                <View style={[s.penaltyBox, { backgroundColor: PINK_BG }]}>
                  <Text style={s.penaltyMain}>2 ans · 30 000 €</Text>
                  <Text style={s.penaltyDesc}>d'emprisonnement et d'amende pour tout auteur de harcèlement moral</Text>
                </View>
              </View>
              <View style={s.refs}>
                <Text style={s.refTxt}>Art. 222-33-2 Code Pénal  —  Art. L.1152-1, L.1152-2, L.1152-3, L.1154-1 Code du Travail</Text>
              </View>
            </BigSection>

            {/* Égalité F/H */}
            <BigSection
              bg={GREEN}
              title="ÉGALITÉ PROFESSIONNELLE FEMMES / HOMMES"
              sub="Articles L.3221-2 a L.3221-7  |  Article L.1142-1 du Code du Travail"
            >
              <View style={s.bigBody}>
                <Text style={s.para}>
                  Tout employeur assure, pour un même travail ou un travail de valeur égale, l'Egalite de rémunération entre les femmes et les hommes. Les éléments composant la rémunération sont établis selon des normes identiques pour les deux sexes.
                </Text>
                <Text style={s.para}>
                  Il est interdit de mentionner le sexe d'un candidat dans une offre d'emploi ou de fonder une décision d'embauche, de formation, de promotion ou de licenciement sur le sexe d'une personne.
                </Text>
                <Text style={s.para}>
                  Toute disposition contractuelle ou conventionnelle contraire à ces principes est nulle de plein droit.
                </Text>
                <View style={[s.penaltyBox, { backgroundColor: YELLOW_BG }]}>
                  <Text style={s.penaltyMainGreen}>375 €</Text>
                  <Text style={s.penaltyDescGreen}>amende maximale (contravention 4e classe) défaut de communication de ces dispositions aux salariés et candidats à l'embauche</Text>
                </View>
              </View>
              <View style={s.refs}>
                <Text style={s.refTxt}>Art. L.1142-1, L.1142-6, L.3221-2 a L.3221-7, R.3221-2 Code du Travail</Text>
              </View>
            </BigSection>
          </View>

          {/* ═══ COLUMN 3 ═══ */}
          <View style={s.col3}>

            {/* Harcèlement sexuel */}
            <BigSection
              title="LUTTE CONTRE LE HARCELEMENT SEXUEL ET LES AGISSEMENTS SEXISTES"
              sub="Article 222-33 du Code Penal  |  Articles L.1153-1 a L.1153-6 du Code du Travail"
            >
              <View style={s.bigBody}>
                <Text style={s.para}>
                  Aucun salarié, aucune personne en formation ou en stage ne doit subir des faits de harcèlement sexuel, constitué par des propos ou comportements à connotation sexuelle ou sexiste répétés qui portent atteinte à sa dignité ou créent une situation intimidante, hostile ou offensante.
                </Text>
                <Text style={s.para}>
                  Est également constitutif de harcèlement sexuel le fait d'user, meme de façon non répetée, de toute forme de pression grave dans le but réel ou apparent d'obtenir un acte de nature sexuelle, que celui-ci soit recherché au profit de l'auteur des faits ou au profit d'un tiers.
                </Text>
                <Text style={s.para}>
                  Aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi, refusé de subir ou témoigné de tels faits.
                </Text>
                <View style={{ flexDirection:"row", gap:4 }}>
                  <View style={[s.penaltyBox, { flex:1, backgroundColor: PINK_BG }]}>
                    <Text style={s.penaltyMain}>2 ans · 30 000 €</Text>
                    <Text style={s.penaltyDesc}>Peine de base</Text>
                  </View>
                  <View style={[s.penaltyBox, { flex:1, backgroundColor: "#FEF3C7" }]}>
                    <Text style={[s.penaltyMain, { color:"#92400E" }]}>3 ans · 45 000 €</Text>
                    <Text style={[s.penaltyDesc, { color:"#78350F" }]}>en cas de circonstances aggravantes (abus d'autorité, victime mineure ou vulnérable, pluralité d'auteurs, support numérique...)</Text>
                  </View>
                </View>
              </View>
              <View style={s.refs}>
                <Text style={s.refTxt}>Art. 222-33 Code Pénal  —  Art. L.1153-1, L.1153-2, L.1153-5 Code du Travail</Text>
              </View>
            </BigSection>

            {/* Coordonnées autorités */}
            <View style={s.authBox}>
              <Text style={s.authTitle}>Coordonnées des autorités compétentes (à compléter)</Text>
              <View style={s.authRow}>
                <Text style={s.authLbl}>Médecin du travail :</Text>
                <Text style={s.authTel}>Tél : {data.medecine.telephone || "—"}</Text>
              </View>
              <View style={s.divider} />
              <View style={s.authRow}>
                <Text style={s.authLbl}>Inspection du travail :</Text>
                <Text style={s.authTel}>Tél : {data.inspection.telephone || "—"}</Text>
              </View>
              <View style={s.divider} />
              <Text style={{ fontSize:6.5, fontFamily:"Helvetica-Bold", color:NAVY, marginTop:2 }}>Défenseur des droits : 09.69.39.00.00</Text>
              <Text style={{ fontSize:5.5, color:DGRAY, fontFamily:"Helvetica" }}>(appel non surtaxe, lundi au vendredi 9h-18h)</Text>
            </View>

            {/* Discriminations */}
            <BigSection
              title="LUTTE CONTRE LES DISCRIMINATIONS"
              sub="Articles 225-1 et 225-2 du Code Penal  |  Article L.1132-1 du Code du Travail"
            >
              <View style={s.bigBody}>
                <Text style={s.para}>
                  Constitue une discrimination toute distinction opérée entre les personnes physiques ou morales sur le fondement de leur origine, sexe, situation de famille, grossesse, apparence physique, lieu de résidence, état de santé, perte d'autonomie, handicap, caractéristiques génétiques, moeurs, orientation sexuelle, identité de genre, age, opinions politiques, activités syndicales, qualité de lanceur d'alerte, capacité à s'exprimer dans une langue autre que le Français, appartenance vraie ou supposée à une ethnie, une Nation, une prétendue race ou une religion déterminée.
                </Text>
                <Text style={s.para}>
                  Aucune personne ne peut être écartée d'une procédure de recrutement, sanctionnée ou licenciée, ni faire l'objet d'une mesure défavorable en matière de rémunération, de formation, de promotion ou de reclassement en raison de l'un de ces motifs.
                </Text>
                <View style={{ flexDirection:"row", gap:4 }}>
                  <View style={[s.penaltyBox, { flex:1, backgroundColor: PINK_BG }]}>
                    <Text style={s.penaltyMain}>3 ans · 45 000 €</Text>
                    <Text style={s.penaltyDesc}>refus d'embauche, licenciement, refus de fourniture d'un bien ou service discriminatoire</Text>
                  </View>
                  <View style={[s.penaltyBox, { flex:1, backgroundColor:"#FEF2F2" }]}>
                    <Text style={s.penaltyMain}>5 ans · 75 000 €</Text>
                    <Text style={s.penaltyDesc}>lorsque le refus discriminatoire est commis dans un lieu accueillant du public</Text>
                  </View>
                </View>
              </View>
              <View style={s.refs}>
                <Text style={s.refTxt}>Art. 225-1, 225-2 Code Pénal  —  Art. L.1132-1 Code du Travail</Text>
              </View>
            </BigSection>
          </View>
        </View>

        {/* FOOTER */}
        {FOOTER_IMG && <Image src={FOOTER_IMG} style={s.footer} />}
        <Text style={s.footerNom}>{data.company.name}</Text>
        <Text style={s.footerSiret}>{data.company.siret || ""}</Text>
      </Page>
    </Document>
  )
}
