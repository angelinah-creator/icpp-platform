import React from "react"
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import fs from "fs"
import path from "path"

const imgCache: Record<string, string> = {}
function img(rel: string): string {
  if (imgCache[rel]) return imgCache[rel]
  for (const base of [process.cwd(), "/app", "/opt/icpp-platform"]) {
    const p = path.join(base, "maquettes_duerp", rel)
    try {
      if (fs.existsSync(p)) {
        const ext = path.extname(p).toLowerCase()
        const mime = ext === ".png" ? "image/png" : "image/jpeg"
        imgCache[rel] = `data:${mime};base64,${fs.readFileSync(p).toString("base64")}`
        return imgCache[rel]
      }
    } catch {}
  }
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}

const NAVY="#0F1D3D", CYAN="#22D3EE", BLUE="#1D4ED8", TEAL="#0D9488"
const WHITE="#FFFFFF", LGRAY="#F3F4F6", DGRAY="#374151", LBLUE="#EFF6FF"

function fDate(d?: Date|string) {
  if (!d) return "—"
  return (typeof d==="string"?new Date(d):d).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})
}
function fYear(d?: Date|string) {
  if (!d) return "—"
  return String((typeof d==="string"?new Date(d):d).getFullYear())
}
function groupByUT(evs: DuerpEvaluation[]) {
  const m: Record<string,DuerpEvaluation[]>={}
  for(const e of evs){if(!m[e.uniteTravail])m[e.uniteTravail]=[];m[e.uniteTravail].push(e)}
  return m
}
function groupByCat(evs: DuerpEvaluation[]) {
  const m: Record<string,DuerpEvaluation[]>={}
  for(const e of evs){const k=e.categorieNom||"Autres";if(!m[k])m[k]=[];m[k].push(e)}
  return m
}
function maitrise(nm?: string): {label:string;bg:string;color:string} {
  const v=(nm||"").toLowerCase()
  if(v.includes("optimale")||v.includes("optimal"))return{label:"Optimale",bg:CYAN,color:NAVY}
  if(v.includes("collective"))return{label:"Protection\nCollective",bg:TEAL,color:WHITE}
  if(v.includes("organisat"))return{label:"Organisat-\nionnelle",bg:BLUE,color:WHITE}
  if(v.includes("partielle"))return{label:"Partielle",bg:"#F59E0B",color:WHITE}
  return{label:"Aucune",bg:LGRAY,color:DGRAY}
}
function netRisk(priority?: string, residuel?: number): {label:string;bg:string} {
  const v=(priority||"").toLowerCase(), r=residuel||0
  if(v.includes("critique")||v.includes("elevé")||v.includes("haute")||r>=8)return{label:"Élevée",bg:"#EF4444"}
  if(v.includes("modéré")||v.includes("moyen")||r>=4)return{label:"Modéré",bg:TEAL}
  return{label:"Faible",bg:"#F59E0B"}
}

// ── PAPRIPPACT helpers ────────────────────────────────────────────────────────
const TECH_KW=["gant","masque","tapis","chaussure","extracteur","ventilation","extincteur","siège","fauteuil","installation","achat","EPI","équipement","pince","protection","appareil","dispositif","outil","sécurité","matériel","signali"]
const ORG_KW=["formation","rotation","procédure","planning","réunion","règlement","audit","suivi","fiche","protocole","mise à jour","sensibilisation","organisation","renfort","script"]

function isTechnique(ev: DuerpEvaluation): boolean {
  const txt=((ev.actionCorrective||"")+" "+(ev.mesuresAppliquees||[]).join(" ")).toLowerCase()
  const tScore=TECH_KW.filter(k=>txt.includes(k.toLowerCase())).length
  const oScore=ORG_KW.filter(k=>txt.includes(k.toLowerCase())).length
  if(tScore===0&&oScore===0){
    // fallback: physique/chimique/incendie → technique ; psychosociaux/organisationnels → org
    const cat=(ev.categorieNom||"").toLowerCase()
    return cat.includes("physique")||cat.includes("chimique")||cat.includes("incendie")||cat.includes("biologique")
  }
  return tScore>=oScore
}

function estimateBudget(ev: DuerpEvaluation): string {
  const txt=((ev.actionCorrective||"")+" "+(ev.mesuresAppliquees||[]).join(" ")).toLowerCase()
  if(txt.includes("extracteur")||txt.includes("ventilation"))return"800 – 2 000 €"
  if(txt.includes("fauteuil")||txt.includes("siège"))return"300 – 600 €"
  if(txt.includes("extincteur"))return"100 – 200 €"
  if(txt.includes("tapis"))return"50 – 150 €"
  if(txt.includes("chaussure"))return"80 – 150 €"
  if(txt.includes("masque"))return"30 – 60 €"
  if(txt.includes("gant"))return"20 – 50 €"
  if(txt.includes("pince"))return"30 – 80 €"
  if(txt.includes("signali"))return"20 – 50 €"
  return"À définir"
}

function estimateEcheance(delai?: string, ref?: Date): string {
  const base=ref||new Date()
  const d=new Date(base)
  const v=(delai||"").toLowerCase()
  if(v.includes("15"))d.setDate(d.getDate()+15)
  else if(v.includes("1 ms")||v.includes("1ms")||v.includes("1 mois"))d.setMonth(d.getMonth()+1)
  else if(v.includes("2 ms")||v.includes("2ms")||v.includes("2 mois"))d.setMonth(d.getMonth()+2)
  else if(v.includes("3"))d.setMonth(d.getMonth()+3)
  else if(v.includes("6"))d.setMonth(d.getMonth()+6)
  else d.setMonth(d.getMonth()+3)
  return d.toLocaleDateString("fr-FR",{month:"long",year:"numeric"})
}

function estimateEtat(ev: DuerpEvaluation): {label:string;bg:string;color:string} {
  const r=ev.risqueResiduel??((ev.frequence*ev.gravite)*(ev.ponderation??1))
  if(r<2)return{label:"Réalisé",bg:TEAL,color:WHITE}
  if(r<4)return{label:"Devis reçu",bg:BLUE,color:WHITE}
  return{label:"En attente",bg:LGRAY,color:DGRAY}
}

function estimateObjectif(ev: DuerpEvaluation): string {
  const cat=(ev.categorieNom||"").toLowerCase()
  if(cat.includes("psycho")||cat.includes("social"))return"Améliorer le bien-être au travail"
  if(cat.includes("incendie"))return"Prévention Incendie"
  if(cat.includes("chimique"))return"Réduction exposition chimique"
  if(cat.includes("biologique"))return"Prévention infections"
  const nm=(ev.risqueNom||"").toLowerCase()
  if(nm.includes("tms")||nm.includes("geste")||nm.includes("musculaire")||nm.includes("dos"))return"Réduire les TMS"
  if(nm.includes("chute")||nm.includes("glissade"))return"Prévention des chutes"
  if(nm.includes("brûlure")||nm.includes("brulure")||nm.includes("chaleur"))return"Prévention des brûlures"
  if(nm.includes("coupure"))return"Prévention des coupures"
  if(nm.includes("conflit"))return"Améliorer la cohésion d'équipe"
  return"Réduction du risque identifié"
}

function estimateFrequence(ev: DuerpEvaluation): string {
  const cat=(ev.categorieNom||"").toLowerCase()
  const act=((ev.actionCorrective||"")+" "+(ev.responsable||"")).toLowerCase()
  if(act.includes("quotidien")||act.includes("chaque")||cat.includes("physique"))return"Quotidien"
  if(cat.includes("incendie"))return"Trimestriel"
  if(cat.includes("chimique"))return"Annuel"
  if(cat.includes("psycho"))return"Mensuel"
  return"Mensuel"
}

function PapPage({data,addr}:{data:DuerpPdfData;addr:string}) {
  const yr=fYear(data.createdAt)
  // All evaluations with an action defined
  const withAction=data.evaluations.filter(e=>e.applicable!==false&&e.actionCorrective)
  const techEvs=withAction.filter(isTechnique)
  const orgEvs=withAction.filter(e=>!isTechnique(e))

  const PAP_TH={backgroundColor:BLUE,padding:"8 10",flex:1}
  const PAP_TH_TXT={fontSize:8.5,fontFamily:"Helvetica-Bold",color:WHITE}
  const PAP_TD={padding:"8 10",flex:1,borderBottomWidth:1,borderBottomColor:"#E5E7EB"}
  const PAP_TD_TXT={fontSize:8,fontFamily:"Helvetica",color:DGRAY}

  function TechTable() {
    if(techEvs.length===0)return(
      <View style={{padding:8,backgroundColor:LGRAY,borderRadius:4,marginBottom:12}}>
        <Text style={{fontSize:8,fontFamily:"Helvetica-Oblique",color:DGRAY}}>Aucun investissement technique planifié.</Text>
      </View>
    )
    return(
      <View style={{borderRadius:6,overflow:"hidden",borderWidth:1,borderColor:"#E5E7EB",marginBottom:20}}>
        <View style={{flexDirection:"row"}}>
          <View style={[PAP_TH,{flex:2.5}]}><Text style={PAP_TH_TXT}>Action</Text></View>
          <View style={PAP_TH}><Text style={PAP_TH_TXT}>UT concernée</Text></View>
          <View style={PAP_TH}><Text style={PAP_TH_TXT}>Budget estimé</Text></View>
          <View style={PAP_TH}><Text style={PAP_TH_TXT}>Échéance</Text></View>
          <View style={[PAP_TH,{flex:0.9}]}><Text style={PAP_TH_TXT}>État</Text></View>
        </View>
        {techEvs.map((ev,i)=>{
          const etat=estimateEtat(ev)
          const even=i%2===1
          const bg=even?"#F9FAFB":WHITE
          return(
            <View key={i} style={{flexDirection:"row",backgroundColor:bg}}>
              <View style={[PAP_TD,{flex:2.5}]}>
                <Text style={PAP_TD_TXT}>{ev.actionCorrective}</Text>
              </View>
              <View style={PAP_TD}>
                <Text style={[PAP_TD_TXT,{fontFamily:"Helvetica-Bold",color:NAVY}]}>{ev.uniteTravail.split("—")[0].trim().replace("UT","UT ").trim()}</Text>
              </View>
              <View style={PAP_TD}>
                <Text style={PAP_TD_TXT}>{estimateBudget(ev)}</Text>
              </View>
              <View style={PAP_TD}>
                <Text style={PAP_TD_TXT}>{estimateEcheance(ev.delai,data.createdAt instanceof Date?data.createdAt:new Date(data.createdAt))}</Text>
              </View>
              <View style={[PAP_TD,{flex:0.9,justifyContent:"center",alignItems:"center"}]}>
                <View style={{backgroundColor:etat.bg,borderRadius:10,paddingHorizontal:6,paddingVertical:2}}>
                  <Text style={{fontSize:7,fontFamily:"Helvetica-Bold",color:etat.color}}>{etat.label}</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  function OrgTable() {
    if(orgEvs.length===0)return(
      <View style={{padding:8,backgroundColor:LGRAY,borderRadius:4}}>
        <Text style={{fontSize:8,fontFamily:"Helvetica-Oblique",color:DGRAY}}>Aucune action organisationnelle planifiée.</Text>
      </View>
    )
    return(
      <View style={{borderRadius:6,overflow:"hidden",borderWidth:1,borderColor:"#E5E7EB"}}>
        <View style={{flexDirection:"row"}}>
          <View style={[PAP_TH,{flex:2.5}]}><Text style={PAP_TH_TXT}>Action</Text></View>
          <View style={[PAP_TH,{flex:1.8}]}><Text style={PAP_TH_TXT}>Objectif</Text></View>
          <View style={PAP_TH}><Text style={PAP_TH_TXT}>Responsable</Text></View>
          <View style={PAP_TH}><Text style={PAP_TH_TXT}>Fréquence</Text></View>
        </View>
        {orgEvs.map((ev,i)=>{
          const even=i%2===1
          const bg=even?"#F9FAFB":WHITE
          return(
            <View key={i} style={{flexDirection:"row",backgroundColor:bg}}>
              <View style={[PAP_TD,{flex:2.5}]}>
                <Text style={PAP_TD_TXT}>{ev.actionCorrective}</Text>
              </View>
              <View style={[PAP_TD,{flex:1.8}]}>
                <Text style={PAP_TD_TXT}>{estimateObjectif(ev)}</Text>
              </View>
              <View style={PAP_TD}>
                <Text style={PAP_TD_TXT}>{ev.responsable||"Gérant"}</Text>
              </View>
              <View style={PAP_TD}>
                <Text style={PAP_TD_TXT}>{estimateFrequence(ev)}</Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  return(
    <Page size="A4" style={{backgroundColor:WHITE,paddingBottom:50}}>
      {/* Top decorative bar */}
      <Image src={img("Page10/contenu2.png")} style={{width:"100%",height:5,objectFit:"cover"}}/>

      {/* Page number sidebar */}
      <Image src={img("Page10/contenu1.png")} style={{position:"absolute",left:0,top:40,width:18,height:80}}/>

      {/* Main content */}
      <View style={{padding:"28 32 28 38"}}>
        {/* Title block */}
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <View style={{flex:1}}>
            <Text style={{fontSize:26,fontFamily:"Helvetica-Bold",color:NAVY,lineHeight:1.2}}>Annexe: Plan d\'action{"\n"}(PAPRIPPACT)</Text>
          </View>
          <Image src={img("logo.png")} style={{width:90,height:36,objectFit:"contain",marginTop:4}}/>
        </View>

        {/* Period badge */}
        <View style={{flexDirection:"row",alignItems:"center",marginBottom:14}}>
          <View style={{backgroundColor:BLUE,borderRadius:20,paddingHorizontal:12,paddingVertical:5,flexDirection:"row",alignItems:"center"}}>
            <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:WHITE}}>Période : {yr}</Text>
          </View>
        </View>

        {/* Legal text */}
        <Text style={{fontSize:9,fontFamily:"Helvetica-Oblique",color:DGRAY,lineHeight:1.5,marginBottom:20}}>
          Conformément à l\'article L4121-3-1 du Code du travail, ce programme liste les{"\n"}mesures détaillées pour l\'année à venir :
        </Text>

        {/* Section 1 */}
        <Text style={{fontSize:11,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:10}}>INVESTISSEMENTS TECHNIQUES (Matériel)</Text>
        <TechTable/>

        {/* Section 2 */}
        <Text style={{fontSize:11,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:10,marginTop:4}}>ACTIONS ORGANISATIONNELLES (Procédures)</Text>
        <OrgTable/>
      </View>

      {/* Footer */}
      <Ft siret={data.siret} addr={addr}/>
    </Page>
  )
}

export interface DuerpEvaluation {
  risqueNom:string; risqueDescription?:string; categorieNom:string; categorieCode?:string
  uniteTravail:string; frequence:number; gravite:number; niveauRisque:number
  ponderation?:number; risqueResiduel?:number; applicable?:boolean
  descriptionExposition?:string; mesuresAppliquees:string[]
  actionCorrective?:string; delai?:string; responsable?:string
  observations?:string; commentaires?:string; prioriteAction?:string; niveauMaitrise?:string
}
export interface DuerpPdfData {
  companyName:string; siret:string; address:string; city:string; postalCode:string
  activitySector:string; employeeCount:number
  contactName?:string; contactRole?:string; contactEmail?:string
  dirigeant?:string; serviceSante?:string; accesDocument?:string
  version:number; status:string; createdAt:Date; updatedAt?:Date; nextReviewDate?:Date
  evaluations:DuerpEvaluation[]
  accidentHistory?:Array<{date:Date|string;salarie?:string;nature:string;causes?:string;mesures?:string}>
  unitesTravail?:Array<{nom:string;description?:string}>
  signature?:{signedAt:Date;signerName:string;signerRole?:string;certificationText:string}
  auditorName?:string
}

const s = StyleSheet.create({
  bg:{position:"absolute",top:0,left:0,width:"100%",height:"100%"},
  hdr:{backgroundColor:NAVY,padding:22,paddingBottom:18},
  hdrTitle:{fontSize:24,fontFamily:"Helvetica-Bold",color:WHITE,marginBottom:2},
  hdrSub:{fontSize:24,fontFamily:"Helvetica-Bold",color:CYAN},
  ftTxt:{fontSize:7,fontFamily:"Helvetica",color:DGRAY,textAlign:"center"},
  ft:{position:"absolute",bottom:0,left:0,right:0,borderTopWidth:1,borderTopColor:"#D1D5DB",padding:"5 20"},
  body:{padding:"18 24 50 24"},
  secLbl:{fontSize:10,fontFamily:"Helvetica-Bold",color:NAVY,marginTop:14,marginBottom:6},
  tbl:{borderWidth:1,borderColor:"#E5E7EB",borderRadius:5,overflow:"hidden",marginBottom:10},
  tblRow:{flexDirection:"row",borderBottomWidth:1,borderBottomColor:"#E5E7EB"},
  tblRowLast:{flexDirection:"row"},
  tblLbl:{width:"38%",padding:"5 8",fontSize:8,fontFamily:"Helvetica-Bold",color:NAVY,backgroundColor:LGRAY},
  tblVal:{flex:1,padding:"5 8",fontSize:8,fontFamily:"Helvetica",color:DGRAY},
})

function Hdr({t1,t2}:{t1:string;t2:string}) {
  return(
    <View style={s.hdr}>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start"}}>
        <View><Text style={s.hdrTitle}>{t1}</Text><Text style={s.hdrSub}>{t2}</Text></View>
        <Image src={img("logo.png")} style={{width:88,height:35,objectFit:"contain"}}/>
      </View>
    </View>
  )
}
function Ft({siret,addr}:{siret?:string;addr?:string}) {
  return(
    <View style={s.ft}>
      <Text style={s.ftTxt}>
        ICPP Conformité  Siret : [{siret||"Numéro"}]  APE/NAF : [code]  [{addr||"Adresse du siège"}]{"\n"}
        www.icpp-conformite.fr - contact@icpp-conformite.fr
      </Text>
    </View>
  )
}
function IR({lbl,val,last}:{lbl:string;val:string;last?:boolean}) {
  return(
    <View style={last?s.tblRowLast:s.tblRow}>
      <Text style={s.tblLbl}>{lbl}</Text>
      <Text style={s.tblVal}>{val||"—"}</Text>
    </View>
  )
}

// Synthesis table column config
const COLS=[
  {k:"facteur",  lbl:"Facteur\nde risques",          f:7.5, c:false},
  {k:"desc",     lbl:"Description\ndes risques",      f:10.5,c:false},
  {k:"freq",     lbl:"Fréquence\nF",                  f:4,   c:true},
  {k:"grav",     lbl:"Gravité\nG",                    f:4,   c:true},
  {k:"brut",     lbl:"Risque Brute\nF * G",           f:5,   c:true},
  {k:"mes",      lbl:"Mesures de\nprévention",        f:10,  c:false},
  {k:"niv",      lbl:"Niveau\nmaîtrise",              f:6.5, c:true},
  {k:"pond",     lbl:"Prévention\np",                 f:4,   c:true},
  {k:"res",      lbl:"Risque\nrésiduel",              f:5,   c:true},
  {k:"net",      lbl:"Risque\nnet",                   f:5.5, c:true},
  {k:"act",      lbl:"Action à\nmettre en oeuvre",    f:13,  c:false},
  {k:"pers",     lbl:"Personne\nchargée",             f:7.5, c:false},
  {k:"delai",    lbl:"Délai de\nmise en oeuvre",      f:7.5, c:true},
  {k:"real",     lbl:"Réalisé\nle",                   f:5.5, c:true},
]
const TOTAL_F=COLS.reduce((a,c)=>a+c.f,0)

const ts=StyleSheet.create({
  thCell:{fontSize:5,fontFamily:"Helvetica-Bold",color:WHITE,backgroundColor:NAVY,padding:"3 2",textAlign:"center"},
  tdCell:{fontSize:5,fontFamily:"Helvetica",color:DGRAY,padding:"3 2",textAlign:"center",borderRightWidth:0.5,borderRightColor:"#E5E7EB",borderBottomWidth:0.5,borderBottomColor:"#E5E7EB"},
  utHdr:{flexDirection:"row",backgroundColor:NAVY,padding:"4 8"},
  utTxt:{fontSize:6.5,fontFamily:"Helvetica-Bold",color:CYAN},
  catHdr:{flexDirection:"row",backgroundColor:"#F9FAFB",padding:"3 8",borderBottomWidth:0.5,borderBottomColor:"#E5E7EB"},
  catTxt:{fontSize:6,fontFamily:"Helvetica-Bold",color:NAVY},
})

function ThRow() {
  return(
    <View style={{flexDirection:"row"}}>
      {COLS.map(col=>(
        <View key={col.k} style={{flex:col.f/TOTAL_F*100,backgroundColor:NAVY,padding:"3 2",borderRightWidth:0.5,borderRightColor:"rgba(255,255,255,0.2)"}}>
          <Text style={{fontSize:5,fontFamily:"Helvetica-Bold",color:WHITE,textAlign:"center"}}>{col.lbl}</Text>
        </View>
      ))}
    </View>
  )
}

function EvalRow({ev,even}:{ev:DuerpEvaluation;even:boolean}) {
  const brut=ev.frequence*ev.gravite
  const pond=ev.ponderation??1
  const res=ev.risqueResiduel??brut*pond
  const m=maitrise(ev.niveauMaitrise)
  const nr=netRisk(ev.prioriteAction,res)
  const bg=even?"#FAFAFA":WHITE
  function Cell({f,children,bgs}:{f:number;children:React.ReactNode;bgs?:string}) {
    return(
      <View style={{flex:f/TOTAL_F*100,backgroundColor:bgs||bg,borderRightWidth:0.5,borderRightColor:"#E5E7EB",borderBottomWidth:0.5,borderBottomColor:"#E5E7EB",padding:"2 2",justifyContent:"center"}}>
        {children}
      </View>
    )
  }
  return(
    <View style={{flexDirection:"row",minHeight:20}}>
      <Cell f={7.5} bgs={even?"#F0F4FF":LBLUE}>
        <Text style={{fontSize:5.5,fontFamily:"Helvetica-Bold",color:NAVY,textAlign:"center"}}>{ev.risqueNom}</Text>
      </Cell>
      <Cell f={10.5}>
        <Text style={{fontSize:5,fontFamily:"Helvetica",color:DGRAY}}>{ev.descriptionExposition||ev.observations||"—"}</Text>
      </Cell>
      <Cell f={4} bgs={even?"#F0F9FF":LBLUE}>
        <Text style={{fontSize:6,fontFamily:"Helvetica-Bold",color:NAVY,textAlign:"center"}}>{ev.frequence}</Text>
      </Cell>
      <Cell f={4} bgs={even?"#F0F9FF":LBLUE}>
        <Text style={{fontSize:6,fontFamily:"Helvetica-Bold",color:NAVY,textAlign:"center"}}>{ev.gravite}</Text>
      </Cell>
      <Cell f={5}>
        <Text style={{fontSize:6,fontFamily:"Helvetica-Bold",color:NAVY,textAlign:"center"}}>{brut}</Text>
      </Cell>
      <Cell f={10}>
        <Text style={{fontSize:5,fontFamily:"Helvetica",color:DGRAY}}>{(ev.mesuresAppliquees||[]).join(" • ")||"Aucune"}</Text>
      </Cell>
      <Cell f={6.5} bgs={m.bg}>
        <Text style={{fontSize:5,fontFamily:"Helvetica-Bold",color:m.color,textAlign:"center"}}>{m.label}</Text>
      </Cell>
      <Cell f={4}>
        <Text style={{fontSize:6,fontFamily:"Helvetica",color:DGRAY,textAlign:"center"}}>{pond}</Text>
      </Cell>
      <Cell f={5}>
        <Text style={{fontSize:6,fontFamily:"Helvetica",color:DGRAY,textAlign:"center"}}>{res.toFixed(2)}</Text>
      </Cell>
      <Cell f={5.5} bgs={nr.bg}>
        <Text style={{fontSize:5.5,fontFamily:"Helvetica-Bold",color:WHITE,textAlign:"center"}}>{nr.label}</Text>
      </Cell>
      <Cell f={13}>
        <Text style={{fontSize:5,fontFamily:"Helvetica",color:DGRAY}}>{ev.actionCorrective||"—"}</Text>
      </Cell>
      <Cell f={7.5}>
        <Text style={{fontSize:5,fontFamily:"Helvetica",color:DGRAY}}>{ev.responsable||"—"}</Text>
      </Cell>
      <Cell f={7.5}>
        <Text style={{fontSize:5,fontFamily:"Helvetica",color:DGRAY,textAlign:"center"}}>{ev.delai||"—"}</Text>
      </Cell>
      <Cell f={5.5} bgs={LGRAY}>
        <Text style={{fontSize:5,color:DGRAY,textAlign:"center"}}></Text>
      </Cell>
    </View>
  )
}


// ── Shared chrome helpers ────────────────────────────────────────────────────
function Circles() {
  return (
    <View style={{position:"absolute",top:0,right:0,width:160,height:160}}>
      <View style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:75,backgroundColor:"#DBEAFE",opacity:0.5}}/>
      <View style={{position:"absolute",top:10,right:10,width:80,height:80,borderRadius:40,backgroundColor:"#BFDBFE",opacity:0.6}}/>
      <View style={{position:"absolute",top:30,right:30,width:40,height:40,borderRadius:20,backgroundColor:"#93C5FD",opacity:0.5}}/>
    </View>
  )
}
function PgNum({n,siret,addr}:{n:string;siret?:string;addr?:string}) {
  return (
    <View style={{position:"absolute",left:18,bottom:52}}>
      <Text style={{fontSize:9,fontFamily:"Helvetica",color:"#9CA3AF",marginBottom:3}}>{n}</Text>
      <View style={{width:2,height:28,backgroundColor:BLUE}}/>
    </View>
  )
}
function SPage({n,siret,addr,children}:{n:string;siret?:string;addr?:string;children:React.ReactNode}) {
  return (
    <Page size="A4" style={{backgroundColor:WHITE,paddingBottom:50}}>
      <Circles/>
      {children}
      <PgNum n={n} siret={siret} addr={addr}/>
      <Ft siret={siret} addr={addr}/>
    </Page>
  )
}

// ── Préambule Page 1 ─────────────────────────────────────────────────────────
function PreambulePage1({data,addr}:{data:DuerpPdfData;addr:string}) {
  return (
    <SPage n="01" siret={data.siret} addr={addr}>
      <View style={{padding:"30 36 20 36"}}>
        <Text style={{fontSize:26,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:22}}>{"Préambule et cadre légal"}</Text>
        <View style={{borderLeftWidth:4,borderLeftColor:BLUE,backgroundColor:"#EFF6FF",padding:"12 16",marginBottom:22,borderRadius:4}}>
          <Text style={{fontSize:8.5,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:6}}>{"Le Document Unique d'Évaluation des Risques Professionnels (DUERP)"}</Text>
          <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{"est bien plus qu'une simple contrainte réglementaire : c'est la transcription écrite et structurée de la stratégie de sécurité de votre entreprise."}</Text>
          <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5,marginTop:8}}>{"Outil fondamental de la démarche de prévention, il permet d'identifier les dangers spécifiques à chaque unité de travail pour garantir la protection de la santé physique et mentale de vos collaborateurs. Un DUERP rigoureux est le premier rempart contre les accidents du travail et les maladies professionnelles, mais aussi une protection juridique indispensable pour le dirigeant."}</Text>
        </View>
        <Text style={{fontSize:12,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:8}}>{"Rappels Juridiques & Obligations"}</Text>
        <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5,marginBottom:14}}>{"Le cadre légal s'articule autour de trois piliers majeurs du Code du Travail :"}</Text>
        {[
          {art:"Article L4121-1",txt:"L'employeur est tenu à une obligation de sécurité. Il doit prendre toutes les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs."},
          {art:"Article R4121-1",txt:"L'employeur a l'obligation de transcrire et de mettre à jour les résultats de l'évaluation des risques dans ce document unique."},
        ].map((a,i)=>(
          <View key={i} style={{flexDirection:"row",marginBottom:12}}>
            <View style={{width:22,height:22,borderRadius:11,backgroundColor:"#EFF6FF",justifyContent:"center",alignItems:"center",marginRight:10,marginTop:2}}>
              <Text style={{fontSize:7,fontFamily:"Helvetica-Bold",color:BLUE}}>Loi</Text>
            </View>
            <View style={{flex:1,borderLeftWidth:2,borderLeftColor:BLUE,paddingLeft:10}}>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica-Bold",color:BLUE,marginBottom:2}}>{a.art} : </Text>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{a.txt}</Text>
            </View>
          </View>
        ))}
        <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>
          <Text style={{fontFamily:"Helvetica-Bold",color:NAVY}}>{"Dialogue Social & Vigilance"}</Text>
          {" : Ce document doit être tenu à la disposition des salariés, du CSE, et communiqué systématiquement au Service de Prévention et de Santé au Travail (SPST) ainsi qu'aux agents de l'inspection du travail."}
        </Text>
      </View>
    </SPage>
  )
}

// ── Préambule Page 2 ─────────────────────────────────────────────────────────
function PreambulePage2({data,addr}:{data:DuerpPdfData;addr:string}) {
  return (
    <SPage n="02" siret={data.siret} addr={addr}>
      <View style={{padding:"30 36 20 36"}}>
        <Text style={{fontSize:26,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:18}}>{"Préambule et cadre légal"}</Text>
        <View style={{borderRadius:8,borderWidth:1,borderColor:"#FCD34D",backgroundColor:"#FFFBEB",padding:"14 16",marginBottom:22}}>
          <View style={{flexDirection:"row",alignItems:"center",marginBottom:10}}>
            <View style={{width:24,height:24,borderRadius:12,backgroundColor:"#F59E0B",justifyContent:"center",alignItems:"center",marginRight:10}}>
              <Text style={{fontSize:11,color:WHITE,fontFamily:"Helvetica-Bold"}}>C</Text>
            </View>
          </View>
          <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:8}}>{"NOTE IMPORTANTE : CONFORMITÉ & TRAÇABILITÉ (RÉFORME 2026) (DUERP)"}</Text>
          <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5,marginBottom:10}}>{"Conformément à la Loi Santé d'août 2021 (pleinement effective en 2026), le DUERP change de dimension :"}</Text>
          {[
            {t:"Conservation 40 ans",d:"Le DUERP et toutes ses versions successives doivent désormais être conservés pendant une durée minimale de 40 ans."},
            {t:"Dépôt Dématérialisé",d:"L'absence de dépôt du document sur le portail numérique national est désormais un indicateur de non-conformité visible par l'administration, augmentant le risque de contrôle sur site."},
            {t:"Traçabilité",d:"Ce dispositif garantit la traçabilité des expositions professionnelles tout au long de la carrière du salarié."},
          ].map((item,i)=>(
            <View key={i} style={{marginBottom:8}}>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica-Bold",color:"#B45309",marginBottom:2}}>{item.t}</Text>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{item.d}</Text>
            </View>
          ))}
        </View>
        <Text style={{fontSize:12,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:8}}>{"Les Risques Modernes & Technologiques"}</Text>
        <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5,marginBottom:12}}>{"En 2026, l'évaluation ne se limite plus aux risques physiques (chutes, manutention). Elle intègre désormais les nouvelles réalités du travail :"}</Text>
        {[
          {t:"Organisation du travail",d:" : Management, charge mentale et enjeux liés au télétravail."},
          {t:"Intelligence Artificielle & Automatisation",d:" : Analyse des impacts des nouveaux outils numériques sur la santé cognitive."},
          {t:"Risques Psychosociaux (RPS) & Sanitaires",d:" : Prévention du burn-out et anticipation des risques épidémiques ou climatiques."},
        ].map((item,i)=>(
          <View key={i} style={{flexDirection:"row",marginBottom:8,alignItems:"flex-start"}}>
            <View style={{width:8,height:8,borderRadius:4,backgroundColor:BLUE,marginTop:3,marginRight:8}}/>
            <Text style={{flex:1,fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>
              <Text style={{fontFamily:"Helvetica-Bold",color:NAVY}}>{item.t}</Text>{item.d}
            </Text>
          </View>
        ))}
      </View>
    </SPage>
  )
}

// ── Préambule Page 3 ─────────────────────────────────────────────────────────
function PreambulePage3({data,addr}:{data:DuerpPdfData;addr:string}) {
  const cards=[
    {n:"1",t:"Aménagement important",d:"Changement de matériel, de produits chimiques, de locaux ou de procédés."},
    {n:"2",t:"Mouvements de personnel",d:"Lors d'une nouvelle embauche ou du départ d'un employé (pour garantir la traçabilité)."},
    {n:"3",t:"Survenance d'un accident",d:"Tout accident du travail ou maladie professionnelle impose une révision immédiate."},
    {n:"4",t:"Information nouvelle",d:"Dès qu'une donnée supplémentaire sur un risque (étude scientifique, alerte SPST) est portée à votre connaissance."},
  ]
  return (
    <SPage n="03" siret={data.siret} addr={addr}>
      <View style={{padding:"30 36 20 36"}}>
        <Text style={{fontSize:26,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:18}}>{"Préambule et cadre légal"}</Text>
        <Text style={{fontSize:12,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:8}}>{"Quand mettre à jour ce document ?"}</Text>
        <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5,marginBottom:16}}>{"Pour les entreprises de moins de 11 salariés, la mise à jour systématique annuelle n'est plus obligatoire, mais le document doit être impérativement révisé dans les cas suivants :"}</Text>
        <View style={{flexDirection:"row",marginBottom:10}}>
          {cards.slice(0,2).map((c,i)=>(
            <View key={i} style={{flex:1,marginRight:i===0?8:0,padding:"10 12",backgroundColor:"#F9FAFB",borderRadius:6,borderLeftWidth:3,borderLeftColor:BLUE}}>
              <View style={{flexDirection:"row",alignItems:"center",marginBottom:6}}>
                <View style={{width:22,height:22,borderRadius:11,backgroundColor:BLUE,justifyContent:"center",alignItems:"center",marginRight:8}}>
                  <Text style={{fontSize:10,fontFamily:"Helvetica-Bold",color:WHITE}}>{c.n}</Text>
                </View>
                <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,flex:1}}>{c.t}</Text>
              </View>
              <Text style={{fontSize:8,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{c.d}</Text>
            </View>
          ))}
        </View>
        <View style={{flexDirection:"row",marginBottom:20}}>
          {cards.slice(2,4).map((c,i)=>(
            <View key={i} style={{flex:1,marginRight:i===0?8:0,padding:"10 12",backgroundColor:"#F9FAFB",borderRadius:6,borderLeftWidth:3,borderLeftColor:BLUE}}>
              <View style={{flexDirection:"row",alignItems:"center",marginBottom:6}}>
                <View style={{width:22,height:22,borderRadius:11,backgroundColor:BLUE,justifyContent:"center",alignItems:"center",marginRight:8}}>
                  <Text style={{fontSize:10,fontFamily:"Helvetica-Bold",color:WHITE}}>{c.n}</Text>
                </View>
                <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,flex:1}}>{c.t}</Text>
              </View>
              <Text style={{fontSize:8,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{c.d}</Text>
            </View>
          ))}
        </View>
        <View style={{borderRadius:8,borderWidth:1,borderColor:"#BFDBFE",backgroundColor:"#EFF6FF",padding:"14 16"}}>
          <View style={{flexDirection:"row",alignItems:"center",marginBottom:8}}>
            <View style={{width:24,height:24,borderRadius:12,backgroundColor:BLUE,justifyContent:"center",alignItems:"center",marginRight:10}}>
              <Text style={{fontSize:12,color:WHITE,fontFamily:"Helvetica-Bold"}}>!</Text>
            </View>
            <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY}}>Sanctions encourues</Text>
          </View>
          <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{"Le défaut de transcription ou de mise à jour du DUERP est sanctionné par une amende de 1 500 € par unité de travail, portée à 3 000 € en cas de récidive. Au-delà de l'amende, l'absence de DUERP valide peut entraîner la reconnaissance d'une faute inexcusable de l'employeur, engageant son patrimoine personnel en cas d'accident grave."}</Text>
        </View>
      </View>
    </SPage>
  )
}

// ── Méthodologie Page 1 ──────────────────────────────────────────────────────
function MethodoPage1({data,addr}:{data:DuerpPdfData;addr:string}) {
  const rows=[
    {lv:"Aucune",        p:"1",   bg:"#EF4444", ex:"Pas de protection, risque total."},
    {lv:"Partielle",     p:"0.7", bg:"#F59E0B", ex:"Port d'EPI (gants, masque), rappels de sécurité simples."},
    {lv:"Organisationnelle",p:"0.5",bg:"#6366F1",ex:"Procédures écrites, planning de rotation, formation spécifique."},
    {lv:"Protection Collective",p:"0.3",bg:TEAL,ex:"Hotte aspirante, sol antidérapant, capotage machine."},
    {lv:"Maitrise Optimale",p:"0.2",bg:"#10B981",ex:"Risque éliminé à la source ou protection totale certifiée."},
  ]
  return (
    <SPage n="05" siret={data.siret} addr={addr}>
      <View style={{padding:"30 36 20 36"}}>
        <Text style={{fontSize:26,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:18}}>{"Méthodologie d'évaluation"}</Text>
        <Text style={{fontSize:12,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:6}}>Informations générales</Text>
        <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5,marginBottom:14}}>{"Pour réaliser cet audit, ICPP Conformité utilise une méthode de calcul scientifique dite \"résiduelle\" :"}</Text>
        {[
          {n:"1.",t:"Identification du Risque Brut :",d:"Nous mesurons la Fréquence (F) et la Gravité (G) du danger sans aucune protection.",pill:"RisqueBrut=F×G"},
          {n:"2.",t:"Analyse de la Maîtrise (P) :",d:"Nous appliquons un coefficient de pondération selon les mesures déjà en place (EPI, formation, matériel aux normes). Le coefficient P vient réduire le risque brut selon le niveau de sécurité constaté lors de l'audit.",pill:null},
        ].map((step,i)=>(
          <View key={i} style={{flexDirection:"row",marginBottom:12,alignItems:"flex-start"}}>
            <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginRight:6,width:14}}>{step.n}</Text>
            <View style={{flex:1}}>
              <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:3}}>{step.t}</Text>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{step.d}</Text>
              {step.pill&&<View style={{alignItems:"center",marginTop:8}}>
                <View style={{backgroundColor:BLUE,borderRadius:16,paddingHorizontal:14,paddingVertical:5}}>
                  <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:WHITE}}>{step.pill}</Text>
                </View>
              </View>}
            </View>
          </View>
        ))}
        <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:10}}>3.</Text>
        <View style={{borderRadius:8,overflow:"hidden",borderWidth:1,borderColor:"#E5E7EB"}}>
          <View style={{flexDirection:"row",backgroundColor:NAVY,padding:"8 12"}}>
            <Text style={{flex:1.5,fontSize:8.5,fontFamily:"Helvetica-Bold",color:WHITE}}>Niveau de maitrise</Text>
            <Text style={{flex:0.7,fontSize:8.5,fontFamily:"Helvetica-Bold",color:WHITE,textAlign:"center"}}>Valeur P</Text>
            <Text style={{flex:2,fontSize:8.5,fontFamily:"Helvetica-Bold",color:WHITE}}>Exemple de mesures</Text>
          </View>
          {rows.map((r,i)=>(
            <View key={i} style={{flexDirection:"row",padding:"7 12",backgroundColor:i%2===1?"#F9FAFB":WHITE,borderTopWidth:0.5,borderTopColor:"#E5E7EB"}}>
              <Text style={{flex:1.5,fontSize:8,fontFamily:"Helvetica",color:DGRAY}}>{r.lv}</Text>
              <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                <View style={{width:26,height:26,borderRadius:13,backgroundColor:r.bg,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{fontSize:7.5,fontFamily:"Helvetica-Bold",color:WHITE}}>{r.p}</Text>
                </View>
              </View>
              <Text style={{flex:2,fontSize:8,fontFamily:"Helvetica",color:DGRAY}}>{r.ex}</Text>
            </View>
          ))}
        </View>
      </View>
    </SPage>
  )
}

// ── Méthodologie Page 2 ──────────────────────────────────────────────────────
function MethodoPage2({data,addr}:{data:DuerpPdfData;addr:string}) {
  const bars=[
    {score:"< 4",  lbl:"Risque Faible",    sub:"Maintenir les mesures",        bg:"#22C55E",h:60},
    {score:"4 à 7",lbl:"Risque Modéré",    sub:"Amélioration souhaitable",     bg:"#F59E0B",h:100},
    {score:"8 à 11",lbl:"Risque Élevé",    sub:"Action prioritaire",           bg:"#F97316",h:145},
    {score:"≥12",  lbl:"Risque Critique",  sub:"Action immédiate obligatoire", bg:"#EF4444",h:190},
  ]
  return (
    <SPage n="06" siret={data.siret} addr={addr}>
      <View style={{padding:"30 36 20 36"}}>
        <Text style={{fontSize:26,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:18}}>{"Méthodologie d'évaluation"}</Text>
        <View style={{flexDirection:"row",marginBottom:10,alignItems:"flex-start"}}>
          <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginRight:6,width:14}}>4.</Text>
          <View style={{flex:1}}>
            <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:3}}>{"Calcul du risque résiduel:"}</Text>
            <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>{"C'est le score final qui définit la dangerosité réelle actuelle."}</Text>
            <View style={{alignItems:"center",marginTop:10}}>
              <View style={{backgroundColor:BLUE,borderRadius:16,paddingHorizontal:14,paddingVertical:5}}>
                <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:WHITE}}>{"Risque Résiduel=F×G×P"}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={{fontSize:9,fontFamily:"Helvetica-Bold",color:NAVY,marginBottom:16,marginTop:8}}>{"5. Seuils de priorité :"}</Text>
        {/* Scale labels top */}
        <View style={{flexDirection:"row",alignItems:"flex-end",height:200,marginBottom:0}}>
          {bars.map((b,i)=>(
            <View key={i} style={{flex:1,alignItems:"center",marginHorizontal:6}}>
              <Text style={{fontSize:9,fontFamily:"Helvetica",color:DGRAY,marginBottom:2}}>Score</Text>
              <Text style={{fontSize:13,fontFamily:"Helvetica-Bold",color:DGRAY,marginBottom:6}}>{b.score}</Text>
              <View style={{flex:1,width:"80%",justifyContent:"flex-end"}}>
                <View style={{height:b.h,backgroundColor:b.bg,borderRadius:4}}/>
              </View>
            </View>
          ))}
        </View>
        <View style={{flexDirection:"row",borderTopWidth:1,borderTopColor:"#E5E7EB",paddingTop:10,marginTop:4}}>
          {bars.map((b,i)=>(
            <View key={i} style={{flex:1,alignItems:"center",marginHorizontal:6}}>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica-Bold",color:b.bg,textAlign:"center"}}>{b.lbl}</Text>
              <Text style={{fontSize:7.5,fontFamily:"Helvetica",color:DGRAY,textAlign:"center",marginTop:2}}>{b.sub}</Text>
            </View>
          ))}
        </View>
      </View>
    </SPage>
  )
}

export const DuerpPdfDocument=({data}:{data:DuerpPdfData})=>{
  const byUT=groupByUT(data.evaluations.filter(e=>e.applicable!==false))
  const yr=fYear(data.createdAt)
  const yrNext=data.nextReviewDate?fYear(data.nextReviewDate):String(parseInt(yr)+1)
  const addr=`${data.address}, ${data.postalCode} ${data.city}`

  return(
    <Document>
      {/* PAGE 1 — COVER */}
      <Page size="A4" style={{position:"relative"}}>
        {/* Couverture complète avec tout le design intégré */}
        <Image src={img("Page1/DUERP_Page_01.jpg")} style={s.bg}/>
        {/* Seuls les 4 champs dynamiques sont superposés */}
        <Text style={{position:"absolute",top:466,left:278,fontSize:10,fontFamily:"Helvetica-Bold",color:WHITE}}>{data.companyName}</Text>
        <Text style={{position:"absolute",top:491,left:278,fontSize:9.5,fontFamily:"Helvetica",color:WHITE}}>{fDate(data.createdAt)}</Text>
        <Text style={{position:"absolute",top:516,left:278,fontSize:9.5,fontFamily:"Helvetica",color:WHITE}}>{yr} – {yrNext}</Text>
        <Text style={{position:"absolute",top:541,left:278,fontSize:9.5,fontFamily:"Helvetica",color:WHITE}}>{fDate(data.updatedAt||data.createdAt)}</Text>
      </Page>

      {/* PAGES 2-4 — PRÉAMBULE LÉGAL */}
      <Page size="A4" style={{position:"relative"}}><Image src={img("Page2/DUERP_Page_2.jpg")} style={s.bg}/></Page>
      <Page size="A4" style={{position:"relative"}}><Image src={img("Page3/DUERP_Page_3.jpg")} style={s.bg}/></Page>
      <Page size="A4" style={{position:"relative"}}><Image src={img("Page4/DUERP_Page_04.jpg")} style={s.bg}/></Page>

      {/* PAGE 5 — PRESENTATION ENTREPRISE */}
      <Page size="A4" style={{backgroundColor:WHITE}}>
        <Hdr t1="PRÉSENTATION" t2="DE L'ENTREPRISE"/>
        <View style={s.body}>
          <Text style={s.secLbl}>Informations générales</Text>
          <View style={s.tbl}>
            <IR lbl="Nom de la société :" val={data.companyName}/>
            <IR lbl="Activité précise :" val={data.activitySector}/>
            <IR lbl="Numéro SIRET :" val={data.siret}/>
            <IR lbl="Adresse :" val={addr}/>
            <IR lbl="Dirigeant :" val={data.dirigeant||data.contactName||"Non renseigné"} last/>
          </View>
          <Text style={s.secLbl}>Effectifs et Intervenants</Text>
          <View style={s.tbl}>
            <IR lbl="Nombre de salariés :" val={String(data.employeeCount)}/>
            <IR lbl="Service de Santé au Travail :" val={data.serviceSante||"Non renseigné"}/>
            <IR lbl="Auditeur conseil :" val={data.auditorName?`${data.auditorName} – Expert ICPP Conformité`:"ICPP Conformité"} last/>
          </View>
          <Text style={[s.secLbl,{marginTop:16}]}>ACCÈS AU DOCUMENT :</Text>
          <Text style={{fontSize:8.5,fontFamily:"Helvetica",color:DGRAY,lineHeight:1.5}}>
            Le présent DUERP est tenu à la disposition des salariés, du médecin du travail et de l'inspection du travail.{"\n"}
            Lieu de consultation : {data.accesDocument||"Bureau Gérant / Classeur salle de pause"}
          </Text>
        </View>
        <Ft siret={data.siret} addr={addr}/>
      </Page>

      {/* PAGES 6-8 — MÉTHODOLOGIE */}
      <Page size="A4" style={{position:"relative"}}><Image src={img("Page6/DUERP_Page_06.jpg")} style={s.bg}/></Page>
      <Page size="A4" style={{position:"relative"}}><Image src={img("Page7/DUERP_Page_07.jpg")} style={s.bg}/></Page>
      <Page size="A4" style={{position:"relative"}}><Image src={img("Page8/DUERP_Page_08.jpg")} style={s.bg}/></Page>

      {/* PAGE 9 — HISTORIQUE & UNITES DE TRAVAIL */}
      <Page size="A4" style={{backgroundColor:WHITE}}>
        <Hdr t1="HISTORIQUE DES ACCIDENTS" t2="ET UNITÉS DE TRAVAIL"/>
        <View style={s.body}>
          <Text style={s.secLbl}>5.1 Suivi des accidents du travail (12 derniers mois)</Text>
          <Text style={{fontSize:8,fontFamily:"Helvetica",color:DGRAY,marginBottom:8}}>
            Ce tableau permet de transformer un incident passé en une action de prévention pour l'avenir.
          </Text>
          {(data.accidentHistory?.length||0)>0?(
            <View style={s.tbl}>
              <View style={[s.tblRow,{backgroundColor:NAVY}]}>
                {["Date","Salarié concerné","Nature de l'accident","Causes identifiées","Mesures prises"].map((h,i,arr)=>(
                  <Text key={h} style={{flex:1,padding:"5 6",fontSize:7.5,fontFamily:"Helvetica-Bold",color:WHITE,borderRightWidth:i<arr.length-1?0.5:0,borderRightColor:"rgba(255,255,255,0.3)"}}>{h}</Text>
                ))}
              </View>
              {data.accidentHistory!.map((a,i)=>(
                <View key={i} style={i<data.accidentHistory!.length-1?s.tblRow:s.tblRowLast}>
                  <Text style={{flex:1,padding:"4 6",fontSize:7.5,fontFamily:"Helvetica",color:DGRAY}}>{fDate(a.date)}</Text>
                  <Text style={{flex:1,padding:"4 6",fontSize:7.5,fontFamily:"Helvetica",color:DGRAY}}>{a.salarie||"—"}</Text>
                  <Text style={{flex:1,padding:"4 6",fontSize:7.5,fontFamily:"Helvetica",color:DGRAY}}>{a.nature}</Text>
                  <Text style={{flex:1,padding:"4 6",fontSize:7.5,fontFamily:"Helvetica",color:DGRAY}}>{a.causes||"—"}</Text>
                  <Text style={{flex:1,padding:"4 6",fontSize:7.5,fontFamily:"Helvetica",color:DGRAY}}>{a.mesures||"—"}</Text>
                </View>
              ))}
            </View>
          ):(
            <View style={{padding:10,backgroundColor:LGRAY,borderRadius:4,marginBottom:10}}>
              <Text style={{fontSize:8,fontFamily:"Helvetica-Oblique",color:DGRAY}}>Aucun accident du travail enregistré sur les 12 derniers mois.</Text>
            </View>
          )}
          <Text style={s.secLbl}>5.2 Définition des Unités de Travail (UT)</Text>
          <Text style={{fontSize:8,fontFamily:"Helvetica",color:DGRAY,marginBottom:8}}>
            Pour simplifier l'analyse, le poste de travail a été découpé en zones de risques distinctes :
          </Text>
          {(data.unitesTravail||[]).map((ut,i)=>(
            <View key={i} style={{flexDirection:"row",marginBottom:4}}>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica-Bold",color:BLUE,width:50}}>UT {String(i+1).padStart(2,"0")}</Text>
              <Text style={{fontSize:8.5,fontFamily:"Helvetica-Bold",color:NAVY}}>- {ut.nom}</Text>
              {ut.description?<Text style={{fontSize:8,fontFamily:"Helvetica",color:DGRAY,flex:1}}> : {ut.description}</Text>:null}
            </View>
          ))}
        </View>
        <Ft siret={data.siret} addr={addr}/>
      </Page>

      {/* PAGE 10 — TABLEAU DE SYNTHESE (LANDSCAPE) */}
      <Page size="A4" orientation="landscape" style={{backgroundColor:WHITE,padding:"18 20 30 20"}} wrap>
        {/* Title + cotation legend */}
        <View style={{flexDirection:"row",marginBottom:10,alignItems:"flex-start"}}>
          <View style={{flex:"0 0 38%",marginRight:12}}>
            <Image src={img("Page9/contenu1.png")} style={{width:"100%",objectFit:"contain"}}/>
          </View>
          <View style={{flex:1}}>
            <Image src={img("Page9/contenu2.png")} style={{width:"100%",objectFit:"contain"}}/>
          </View>
        </View>

        {/* Company context */}
        <View style={{flexDirection:"row",marginBottom:8}}>
          <Text style={{fontSize:8,fontFamily:"Helvetica-Bold",color:BLUE,flex:1}}>
            Étude : {data.companyName} — {data.activitySector}
          </Text>
          <Text style={{fontSize:8,fontFamily:"Helvetica",color:DGRAY}}>
            Nombre de salariés concernés : {data.employeeCount}
          </Text>
        </View>

        {/* Table */}
        {Object.keys(byUT).length===0?(
          <Text style={{fontSize:9,fontFamily:"Helvetica-Oblique",color:DGRAY}}>Aucune évaluation de risque renseignée.</Text>
        ):(
          <View style={{border:"1 solid #E5E7EB",borderRadius:3,overflow:"hidden"}}>
            <ThRow/>
            {Object.entries(byUT).map(([utNom,evals])=>(
              <View key={utNom}>
                <View style={ts.utHdr}>
                  <Text style={ts.utTxt}>{utNom}</Text>
                </View>
                {Object.entries(groupByCat(evals)).map(([catNom,catEvs])=>(
                  <View key={catNom}>
                    <View style={ts.catHdr}>
                      <Text style={ts.catTxt}>{catNom}</Text>
                    </View>
                    {catEvs.map((ev,i)=><EvalRow key={i} ev={ev} even={i%2===1}/>)}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Footer signatures */}
        <View style={{position:"absolute",bottom:8,left:20,right:20,flexDirection:"row",justifyContent:"space-between",borderTopWidth:0.5,borderTopColor:BLUE,paddingTop:5}}>
          <Text style={{fontSize:7,fontFamily:"Helvetica",color:NAVY}}>Fait à : [Ville]  Le : {fDate(new Date())}</Text>
          <Text style={{fontSize:7,fontFamily:"Helvetica-Bold",color:NAVY}}>Signature du Responsable ICPP :</Text>
          <Text style={{fontSize:7,fontFamily:"Helvetica-Bold",color:NAVY}}>Signature du Gérant :</Text>
        </View>
        <Text style={{position:"absolute",bottom:2,right:20,fontSize:6,fontFamily:"Helvetica",color:DGRAY}}
          render={({pageNumber,totalPages})=>`${pageNumber} / ${totalPages}`} fixed/>
      </Page>

      {/* PAGE 11 — PAPRIPPACT DYNAMIQUE */}
      <PapPage data={data} addr={addr}/>

      {/* PAGE 12 — SIGNATURES */}
      <Page size="A4" style={{position:"relative"}}>
        <Image src={img("Page11/DUERP_Page_11.jpg")} style={s.bg}/>
        {data.signature?(
          <View style={{position:"absolute",top:"45%",left:"10%",width:"35%"}}>
            <Text style={{fontSize:9.5,fontFamily:"Helvetica",color:NAVY,marginBottom:4}}>Signé par {data.signature.signerName}</Text>
            <Text style={{fontSize:9.5,fontFamily:"Helvetica",color:NAVY,marginBottom:4}}>Date : {fDate(data.signature.signedAt)}</Text>
            <View style={{backgroundColor:"#D1FAE5",padding:6,borderRadius:4,marginTop:6,borderLeftWidth:2,borderLeftColor:"#059669"}}>
              <Text style={{fontSize:8,fontFamily:"Helvetica-Bold",color:"#059669"}}>✓ APPROUVÉ</Text>
            </View>
          </View>
        ):(
          <Text style={{position:"absolute",top:"45%",left:"10%",fontSize:9.5,fontFamily:"Helvetica-Oblique",color:DGRAY}}>
            En attente de signature...
          </Text>
        )}
        <View style={{position:"absolute",top:"45%",left:"55%",width:"35%"}}>
          <Text style={{fontSize:9.5,fontFamily:"Helvetica",color:NAVY,marginBottom:4}}>Cabinet ICPP Conseil</Text>
          <Text style={{fontSize:9.5,fontFamily:"Helvetica",color:NAVY,marginBottom:4}}>Auditeur : {data.auditorName||"—"}</Text>
          <Text style={{fontSize:9.5,fontFamily:"Helvetica",color:NAVY}}>Date : {fDate(data.createdAt)}</Text>
        </View>
      </Page>
    </Document>
  )
}
