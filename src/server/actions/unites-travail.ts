"use server"

/**
 * Server Actions pour la gestion des Unités de Travail (UT)
 * Ces actions permettent le CRUD complet des UTs et leurs risques associés
 */

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ============================================
// LECTURE
// ============================================

/**
 * Récupère toutes les UTs d'un métier donné
 */
export async function getUnitesTravailByMetier(metierCode: string) {
    try {
        const uts = await prisma.uniteTravail.findMany({
            where: { metierCode },
            include: {
                _count: {
                    select: { risques: true }
                }
            },
            orderBy: { ordre: "asc" }
        })

        return uts.map(ut => ({
            id: ut.id,
            nom: ut.nom,
            description: ut.description,
            ordre: ut.ordre,
            metierCode: ut.metierCode,
            risquesCount: ut._count.risques,
            createdAt: ut.createdAt,
            updatedAt: ut.updatedAt
        }))
    } catch (error) {
        console.error("Error fetching UTs:", error)
        return []
    }
}

/**
 * Récupère une UT par son ID avec tous ses risques
 */
export async function getUniteTravailById(id: string) {
    try {
        const ut = await prisma.uniteTravail.findUnique({
            where: { id },
            include: {
                metier: true,
                risques: {
                    include: {
                        categorie: true
                    },
                    orderBy: { categorie: { ordre: "asc" } }
                }
            }
        })

        if (!ut) return null

        return {
            ...ut,
            risques: ut.risques.map(r => ({
                id: r.id,
                nom: r.nom,
                description: r.description,
                categorie: r.categorie.nom,
                categorieCode: r.categorieCode,
                gravite: r.gravite,
                frequence: r.frequence,
                priorite: typeof r.gravite === 'number' && typeof r.frequence === 'number'
                    ? r.gravite * r.frequence
                    : null,
                mesuresSuggerees: r.mesuresSuggerees,
                isActive: r.isActive
            }))
        }
    } catch (error) {
        console.error("Error fetching UT:", error)
        return null
    }
}

/**
 * Récupère tous les risques associés à une UT
 */
export async function getRisquesByUniteTravail(uniteTravailId: string) {
    try {
        const risques = await prisma.risqueMetier.findMany({
            where: { uniteTravailId },
            include: {
                categorie: true,
                uniteTravail: true
            },
            orderBy: { categorie: { ordre: "asc" } }
        })

        return risques.map(r => ({
            id: r.id,
            nom: r.nom,
            description: r.description,
            categorie: r.categorie.nom,
            categorieCode: r.categorieCode,
            gravite: r.gravite,
            frequence: r.frequence,
            priorite: typeof r.gravite === 'number' && typeof r.frequence === 'number'
                ? r.gravite * r.frequence
                : null,
            mesuresSuggerees: r.mesuresSuggerees,
            isActive: r.isActive,
            uniteTravailNom: r.uniteTravail?.nom
        }))
    } catch (error) {
        console.error("Error fetching risques by UT:", error)
        return []
    }
}

/**
 * Récupère tous les métiers avec leurs UTs
 */
export async function getMetiersWithUTs() {
    try {
        const metiers = await prisma.metierICPP.findMany({
            where: { isActive: true },
            include: {
                unitesTravail: {
                    orderBy: { ordre: "asc" },
                    include: {
                        _count: {
                            select: { risques: true }
                        }
                    }
                },
                _count: {
                    select: { companies: true }
                }
            },
            orderBy: { nom: "asc" }
        })

        return metiers.map(m => ({
            id: m.id,
            code: m.code,
            nom: m.nom,
            description: m.description,
            companiesCount: m._count.companies,
            unitesTravail: m.unitesTravail.map(ut => ({
                id: ut.id,
                nom: ut.nom,
                description: ut.description,
                ordre: ut.ordre,
                risquesCount: ut._count.risques
            }))
        }))
    } catch (error) {
        console.error("Error fetching métiers with UTs:", error)
        return []
    }
}

// ============================================
// CRÉATION
// ============================================

/**
 * Crée une nouvelle Unité de Travail
 */
export async function createUniteTravail(data: {
    metierCode: string
    nom: string
    description?: string
    ordre?: number
}) {
    try {
        // Vérifier que le métier existe
        const metier = await prisma.metierICPP.findUnique({
            where: { code: data.metierCode }
        })

        if (!metier) {
            return { error: "Métier non trouvé" }
        }

        // Déterminer l'ordre si non fourni
        let ordre = data.ordre
        if (!ordre) {
            const maxOrdre = await prisma.uniteTravail.aggregate({
                where: { metierCode: data.metierCode },
                _max: { ordre: true }
            })
            ordre = (maxOrdre._max.ordre || 0) + 1
        }

        const ut = await prisma.uniteTravail.create({
            data: {
                metierCode: data.metierCode,
                nom: data.nom,
                description: data.description,
                ordre
            }
        })

        revalidatePath("/admin/unites-travail")
        revalidatePath(`/admin/metiers/${data.metierCode}`)

        return { success: true, data: ut }
    } catch (error) {
        console.error("Error creating UT:", error)
        return { error: "Erreur lors de la création de l'Unité de Travail" }
    }
}

// ============================================
// MODIFICATION
// ============================================

/**
 * Met à jour une Unité de Travail
 */
export async function updateUniteTravail(id: string, data: {
    nom?: string
    description?: string
    ordre?: number
}) {
    try {
        const ut = await prisma.uniteTravail.update({
            where: { id },
            data: {
                nom: data.nom,
                description: data.description,
                ordre: data.ordre
            }
        })

        revalidatePath("/admin/unites-travail")
        revalidatePath(`/admin/metiers/${ut.metierCode}`)

        return { success: true, data: ut }
    } catch (error) {
        console.error("Error updating UT:", error)
        return { error: "Erreur lors de la mise à jour de l'Unité de Travail" }
    }
}

/**
 * Réorganise les ordres des UTs d'un métier
 */
export async function reorderUnitesTravail(metierCode: string, orderedIds: string[]) {
    try {
        const updates = orderedIds.map((id, index) =>
            prisma.uniteTravail.update({
                where: { id },
                data: { ordre: index + 1 }
            })
        )

        await prisma.$transaction(updates)

        revalidatePath("/admin/unites-travail")
        revalidatePath(`/admin/metiers/${metierCode}`)

        return { success: true }
    } catch (error) {
        console.error("Error reordering UTs:", error)
        return { error: "Erreur lors de la réorganisation" }
    }
}

// ============================================
// SUPPRESSION
// ============================================

/**
 * Supprime une Unité de Travail
 * Note: Les risques associés seront déconnectés (uniteTravailId -> null)
 */
export async function deleteUniteTravail(id: string) {
    try {
        // D'abord, déconnecter les risques associés
        await prisma.risqueMetier.updateMany({
            where: { uniteTravailId: id },
            data: { uniteTravailId: null }
        })

        // Puis supprimer l'UT
        const ut = await prisma.uniteTravail.delete({
            where: { id }
        })

        revalidatePath("/admin/unites-travail")
        revalidatePath(`/admin/metiers/${ut.metierCode}`)

        return { success: true }
    } catch (error) {
        console.error("Error deleting UT:", error)
        return { error: "Erreur lors de la suppression de l'Unité de Travail" }
    }
}

// ============================================
// ASSOCIATION RISQUES <-> UT
// ============================================

/**
 * Associe un risque à une Unité de Travail
 */
export async function associateRisqueToUT(risqueId: string, uniteTravailId: string) {
    try {
        const risque = await prisma.risqueMetier.update({
            where: { id: risqueId },
            data: { uniteTravailId }
        })

        revalidatePath("/admin/risques")
        revalidatePath("/admin/unites-travail")

        return { success: true, data: risque }
    } catch (error) {
        console.error("Error associating risque to UT:", error)
        return { error: "Erreur lors de l'association du risque" }
    }
}

/**
 * Dissocie un risque de son Unité de Travail
 */
export async function dissociateRisqueFromUT(risqueId: string) {
    try {
        const risque = await prisma.risqueMetier.update({
            where: { id: risqueId },
            data: { uniteTravailId: null }
        })

        revalidatePath("/admin/risques")
        revalidatePath("/admin/unites-travail")

        return { success: true, data: risque }
    } catch (error) {
        console.error("Error dissociating risque from UT:", error)
        return { error: "Erreur lors de la dissociation du risque" }
    }
}

/**
 * Associe plusieurs risques à une UT en une seule opération
 */
export async function bulkAssociateRisquesToUT(risqueIds: string[], uniteTravailId: string) {
    try {
        await prisma.risqueMetier.updateMany({
            where: { id: { in: risqueIds } },
            data: { uniteTravailId }
        })

        revalidatePath("/admin/risques")
        revalidatePath("/admin/unites-travail")

        return { success: true, count: risqueIds.length }
    } catch (error) {
        console.error("Error bulk associating risques:", error)
        return { error: "Erreur lors de l'association des risques" }
    }
}

// ============================================
// STATISTIQUES
// ============================================

/**
 * Récupère les statistiques des UTs pour un métier
 */
export async function getUTStats(metierCode: string) {
    try {
        const stats = await prisma.uniteTravail.findMany({
            where: { metierCode },
            include: {
                _count: {
                    select: { risques: true }
                },
                risques: {
                    select: {
                        gravite: true,
                        frequence: true
                    }
                }
            }
        })

        return stats.map(ut => {
            const risques = ut.risques
            const totalRisques = risques.length

            // Calculer le score moyen de priorité
            let avgPriorite = 0
            if (totalRisques > 0) {
                const somme = risques.reduce((acc, r) => {
                    const gravite = typeof r.gravite === 'number' ? r.gravite : 0
                    return acc + (gravite * r.frequence)
                }, 0)
                avgPriorite = Math.round(somme / totalRisques)
            }

            return {
                id: ut.id,
                nom: ut.nom,
                ordre: ut.ordre,
                risquesCount: totalRisques,
                avgPriorite,
                niveauRisque: avgPriorite <= 5 ? "Faible"
                    : avgPriorite <= 12 ? "Moyen"
                        : avgPriorite <= 20 ? "Élevé"
                            : "Critique"
            }
        })
    } catch (error) {
        console.error("Error fetching UT stats:", error)
        return []
    }
}
