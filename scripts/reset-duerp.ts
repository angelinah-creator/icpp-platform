/**
 * scripts/reset-duerp.ts
 * ============================================================
 * Supprime TOUS les DuerpDocument existants (cascade sur les
 * EvaluationRisque) et recrée un DUERP DRAFT v1 pour chaque
 * entreprise qui possède au moins un risque défini dans son métier.
 *
 * Usage :
 *   npx ts-node --project tsconfig.scripts.json scripts/reset-duerp.ts
 *   ou (si tsx est disponible) :
 *   npx tsx scripts/reset-duerp.ts
 * ============================================================
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// -------------------------------------------------------
// Calcul priorité d'action identique à duerp-calcul.ts
// -------------------------------------------------------
function getPonderation(niveau: string): number {
    switch (niveau) {
        case "Maîtrise optimale":       return 0.2
        case "Protection collective":   return 0.35
        case "Organisationnelle":       return 0.5
        case "Partielle":               return 0.7
        default:                        return 1     // Aucune
    }
}

function getPrioriteAction(brut: number, ponderation: number): string {
    const residuel = brut * ponderation
    if (residuel >= 50) return "Critique"
    if (residuel >= 25) return "Élevé"
    if (residuel >= 10) return "Modéré"
    return "Faible"
}

// -------------------------------------------------------
// MAIN
// -------------------------------------------------------
async function main() {
    console.log("\n╔══════════════════════════════════════════════════╗")
    console.log("║   RÉINITIALISATION COMPLÈTE DES DUERPs ICPP      ║")
    console.log("╚══════════════════════════════════════════════════╝\n")

    // 1. Compter ce qui existe
    const countBefore  = await prisma.duerpDocument.count()
    const countEvalBefore = await prisma.evaluationRisque.count()
    console.log(`📊  Avant : ${countBefore} DUERP(s), ${countEvalBefore} évaluation(s) en base\n`)

    // 2. Supprimer toutes les évaluations d'abord (contrainte FK)
    console.log("🗑️   Suppression des évaluations de risques...")
    const delEvals = await prisma.evaluationRisque.deleteMany({})
    console.log(`    ✓ ${delEvals.count} évaluation(s) supprimée(s)`)

    // 3. Supprimer toutes les notifications liées aux DUERPs
    console.log("🔔  Suppression des notifications DUERP...")
    const delNotifs = await prisma.notification.deleteMany({
        where: { type: "DUERP_DISPONIBLE" }
    })
    console.log(`    ✓ ${delNotifs.count} notification(s) supprimée(s)`)

    // 4. Supprimer tous les documents DUERP
    console.log("📄  Suppression des documents DUERP...")
    const delDuerps = await prisma.duerpDocument.deleteMany({})
    console.log(`    ✓ ${delDuerps.count} document(s) DUERP supprimé(s)\n`)

    // 5. Récupérer toutes les entreprises avec leurs risques
    console.log("🏢  Chargement des entreprises et risques métiers...\n")
    const companies = await prisma.company.findMany({
        include: {
            metier: {
                include: {
                    risques: {
                        include: { categorie: true },
                    },
                    unitesTravail: {
                        orderBy: { ordre: "asc" },
                    },
                },
            },
            users: { select: { id: true } },
        },
        orderBy: { name: "asc" },
    })

    let created = 0
    let skipped = 0

    for (const company of companies) {
        const risques = company.metier?.risques ?? []
        const unites  = company.metier?.unitesTravail ?? []

        if (risques.length === 0) {
            console.log(`  ⚠️  ${company.name} — aucun risque défini → ignorée`)
            skipped++
            continue
        }

        // Unités de travail : si vide, on utilise "Ensemble de l'établissement"
        const utList = unites.length > 0
            ? unites.map(u => u.nom)
            : ["Ensemble de l'établissement"]

        // Construire les évaluations : 1 ligne par (risque × UT)
        const evaluations: {
            risqueId: string
            uniteTravail: string
            frequence: number
            gravite: number
            niveauRisque: number
            niveauMaitrise: string
            ponderation: number
            risqueResiduel: number
            prioriteAction: string
            actionCorrective: string | null
            delai: string | null
            responsable: string | null
            observations: string | null
            mesuresAppliquees: string
        }[] = []

        for (const risque of risques) {
            for (const ut of utList) {
                // Valeurs par défaut prudentes (F=2, G=2 → brut=4 = Faible)
                const freq  = 2
                const grav  = 2
                const brut  = freq * grav
                const pond  = getPonderation("Aucune")
                const resid = brut * pond

                evaluations.push({
                    risqueId:         risque.id,
                    uniteTravail:     ut,
                    frequence:        freq,
                    gravite:          grav,
                    niveauRisque:     brut,
                    niveauMaitrise:   "Aucune",
                    ponderation:      pond,
                    risqueResiduel:   resid,
                    prioriteAction:   getPrioriteAction(brut, pond),
                    actionCorrective: null,
                    delai:            null,
                    responsable:      "Direction",
                    observations:     null,
                    mesuresAppliquees: "[]",
                })
            }
        }

        // Date de révision par défaut = +1 an
        const nextReviewDate = new Date()
        nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1)

        // Créer le DUERP
        const duerp = await prisma.duerpDocument.create({
            data: {
                companyId:    company.id,
                version:      1,
                status:       "DRAFT",
                nextReviewDate,
                lastUpdateReason: "Recréation complète — Nouveau modèle ICPP 2026",
                pdfUrl:       null,  // généré à la demande via /api/duerp/[id]/pdf
                metadata:     { accidentHistory: [] },
                evaluations: {
                    create: evaluations,
                },
            },
        })

        // Notification aux utilisateurs de l'entreprise
        if (company.users.length > 0) {
            await prisma.notification.createMany({
                data: company.users.map(u => ({
                    userId:    u.id,
                    type:      "DUERP_DISPONIBLE",
                    title:     "Votre DUERP 2026 est disponible",
                    message:   `Le Document Unique d'Évaluation des Risques Professionnels v1 a été recréé avec le nouveau design ICPP 2026. Rendez-vous dans votre espace pour le consulter.`,
                    actionUrl: `/dashboard/duerp`,
                })),
            })
        }

        console.log(
            `  ✅  ${company.name.padEnd(40)} → DUERP id:${duerp.id.slice(-8)} | ${evaluations.length} évaluation(s)`
        )
        created++
    }

    console.log("\n╔══════════════════════════════════════════════════╗")
    console.log(`║  ✅ TERMINÉ : ${created} DUERP(s) créé(s)`.padEnd(51) + "║")
    console.log(`║  ⚠️  Ignoré  : ${skipped} entreprise(s) sans risques`.padEnd(51) + "║")
    console.log("╚══════════════════════════════════════════════════╝\n")
    console.log("💡  Les PDFs seront générés à la demande via /api/duerp/[id]/pdf")
    console.log("    en utilisant automatiquement le nouveau design ICPP 2026.\n")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
