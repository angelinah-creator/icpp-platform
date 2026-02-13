import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🚀 Création d'un utilisateur CLIENT de test...")

    // 1. Créer le métier COIFFURE s'il n'existe pas
    let metierCoiffure = await prisma.metierICPP.findUnique({
        where: { code: "COIFFURE" }
    })

    if (!metierCoiffure) {
        metierCoiffure = await prisma.metierICPP.create({
            data: {
                code: "COIFFURE",
                nom: "Coiffure",
                description: "Salons de coiffure et barbiers",
                isActive: true
            }
        })
        console.log("✅ Métier COIFFURE créé")
    }

    // 2. Créer le plan Premium s'il n'existe pas
    let planPremium = await prisma.planTarifaire.findUnique({
        where: { code: "PREMIUM" }
    })

    if (!planPremium) {
        planPremium = await prisma.planTarifaire.create({
            data: {
                code: "PREMIUM",
                nom: "Premium",
                description: "Plan premium avec toutes les fonctionnalités",
                prixMensuel: 49000, // 490€
                fraisSetup: 0,
                fonctionnalites: JSON.stringify([
                    "DUERP illimité",
                    "Affichages obligatoires",
                    "Support prioritaire",
                    "Formations en ligne"
                ]),
                isActive: true,
                ordre: 3
            }
        })
        console.log("✅ Plan Premium créé")
    }

    // 3. Créer l'entreprise
    const company = await prisma.company.create({
        data: {
            name: "Salon Marie Coiffure",
            siret: "12345678901234",
            metierCode: "COIFFURE",
            employeeCount: 3,
            address: "12 Rue de la République",
            postalCode: "75001",
            city: "Paris",
            phone: "01 42 36 78 90",
            email: "contact@mariecoiffure.fr",
            contactName: "Marie Dubois",
            contactRole: "Gérante",
            contactEmail: "marie@mariecoiffure.fr"
        }
    })
    console.log("✅ Entreprise créée:", company.name)

    // 4. Créer l'abonnement Premium
    const subscription = await prisma.subscription.create({
        data: {
            companyId: company.id,
            planCode: "PREMIUM",
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
            setupFeePaid: true,
            setupFeePaidAt: new Date()
        }
    })
    console.log("✅ Abonnement Premium créé")

    // 5. Créer le DUERP signé
    const duerp = await prisma.duerpDocument.create({
        data: {
            companyId: company.id,
            version: 1,
            status: "ACTIVE",
            signedAt: new Date("2026-01-15"),
            signatureData: JSON.stringify({
                ip: "192.168.1.1",
                timestamp: new Date("2026-01-15").toISOString()
            }),
            nextReviewDate: new Date("2027-01-15")
        }
    })
    console.log("✅ DUERP signé créé")

    // 6. Créer les affichages obligatoires
    const affichageTypes = [
        { type: "INSPECTION_TRAVAIL", title: "Inspecteur du travail" },
        { type: "MEDECINE_TRAVAIL", title: "Médecine du travail" },
        { type: "CONSIGNES_SECURITE", title: "Consignes de sécurité" },
        { type: "EGALITE_HOMME_FEMME", title: "Égalité homme-femme" },
        { type: "INTERDICTION_FUMER", title: "Interdiction de fumer" }
    ]

    for (const aff of affichageTypes) {
        await prisma.affichage.create({
            data: {
                companyId: company.id,
                type: aff.type,
                title: aff.title,
                description: `Affichage obligatoire: ${aff.title}`,
                fileUrl: `/affichages/${aff.type.toLowerCase()}.pdf`,
                downloaded: true,
                printed: false
            }
        })
    }
    console.log("✅ 5 affichages obligatoires créés")

    // 7. Créer l'utilisateur CLIENT
    const hashedPassword = await bcrypt.hash("client123", 10)

    const user = await prisma.user.create({
        data: {
            email: "marie@mariecoiffure.fr",
            name: "Marie Dubois",
            password: hashedPassword,
            role: "CLIENT",
            phone: "06 12 34 56 78",
            companyId: company.id
        }
    })
    console.log("✅ Utilisateur CLIENT créé")

    console.log("\n" + "=".repeat(60))
    console.log("🎉 Utilisateur CLIENT de test créé avec succès!")
    console.log("=".repeat(60))
    console.log("\n📧 Email: marie@mariecoiffure.fr")
    console.log("🔑 Mot de passe: client123")
    console.log("\n📊 Données créées:")
    console.log("  - Entreprise: Salon Marie Coiffure")
    console.log("  - Plan: Premium (490€/mois)")
    console.log("  - DUERP: Signé le 15/01/2026")
    console.log("  - Affichages: 5 documents")
    console.log("  - Salariés: 3 déclarés")
    console.log("\n🔗 Accès: http://localhost:3000/client")
    console.log("=".repeat(60) + "\n")
}

main()
    .catch((e) => {
        console.error("❌ Erreur:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
