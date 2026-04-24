
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    console.log("🚀 Insertion des données de test pour les rapports...")

    // 1. Récupérer les utilisateurs
    const admin = await prisma.user.findUnique({ where: { email: "admin@icpp.re" } })
    const auditeur = await prisma.user.findUnique({ where: { email: "auditeur1@icpp.re" } })
    const technicien = await prisma.user.findUnique({ where: { email: "technicien@icpp.re" } })
    const company = await prisma.company.findFirst()

    if (!auditeur || !technicien || !company) {
        console.error("❌ Utilisateurs ou entreprise non trouvés. Assurez-vous que le seed-demo a été exécuté.")
        return
    }

    // 2. Créer des tâches avec rapports

    // Rapport Auditeur - ENVOYE (À valider par l'admin)
    await prisma.tache.create({
        data: {
            titre: "Audit de conformité annuel - Test",
            description: "Audit complet de la structure et des équipements.",
            type: "AUDIT",
            status: "TERMINEE",
            priorite: "HAUTE",
            assigneId: auditeur.id,
            companyId: company.id,
            rapport: "L'audit a révélé quelques points de non-conformité mineurs sur l'affichage obligatoire. Le DUERP est à jour.",
            rapportStatut: "ENVOYE",
            rapportAt: new Date()
        }
    })

    // Rapport Technicien - REDIGE (Brouillon pour le technicien)
    await prisma.tache.create({
        data: {
            titre: "Vérification des extincteurs - Brouillon",
            description: "Contrôle annuel de tous les points d'extinction.",
            type: "SIGNALEMENT",
            status: "EN_COURS",
            priorite: "MOYENNE",
            assigneId: technicien.id,
            companyId: company.id,
            rapport: "Début de vérification. 3 extincteurs sur 10 contrôlés.",
            rapportStatut: "REDIGE",
            rapportAt: new Date()
        }
    })

    // Rapport Technicien - ENVOYE (À valider par l'admin)
    await prisma.tache.create({
        data: {
            titre: "Réparation électrique cuisine",
            description: "Intervention sur les prises défectueuses signalées.",
            type: "SIGNALEMENT",
            status: "TERMINEE",
            priorite: "URGENTE",
            assigneId: technicien.id,
            companyId: company.id,
            rapport: "Les prises de la cuisine ont été remplacées. Tout est fonctionnel et sécurisé.",
            rapportStatut: "ENVOYE",
            rapportAt: new Date()
        }
    })

    // 3. Créer une notification pour l'admin car le seed-demo ne le fait pas automatiquement pour ces nouveaux rapports
    if (admin) {
        await prisma.notification.create({
            data: {
                type: "SIGNALEMENT_RECU",
                title: "Nouveau rapport : Réparation électrique",
                message: `Karim Ould a envoyé un rapport pour la tâche "Réparation électrique cuisine".`,
                userId: admin.id,
                read: false,
                actionUrl: "/admin/rapports"
            }
        })
    }

    console.log("✅ Données de test insérées avec succès !")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
