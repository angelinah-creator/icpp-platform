/**
 * Prisma Seed Script
 * Seeds the database with initial data for the ICPP platform
 * Note: For complete seed including UTs and Risques, use: npx prisma db execute --file .\prisma\seed-complete.sql
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Starting database seed...")

    // ============================================
    // 1. METIERS ICPP
    // ============================================

    console.log("🏢 Creating Métiers ICPP...")

    const metiers = await Promise.all([
        prisma.metierICPP.upsert({
            where: { code: "COIFFURE" },
            update: {},
            create: { code: "COIFFURE", nom: "Salon de Coiffure", description: "Coiffure, barbier" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "ESTHETIQUE" },
            update: {},
            create: { code: "ESTHETIQUE", nom: "Institut de Beauté", description: "Esthétique, onglerie, bien-être" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "RESTAURATION" },
            update: {},
            create: { code: "RESTAURATION", nom: "Restauration", description: "Restaurant, snack, restauration rapide" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "BOULANGERIE" },
            update: {},
            create: { code: "BOULANGERIE", nom: "Boulangerie-Pâtisserie", description: "Fabrication et vente de pain" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "COMMERCE" },
            update: {},
            create: { code: "COMMERCE", nom: "Commerce de Détail", description: "Boutique, prêt-à-porter" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "GARAGE" },
            update: {},
            create: { code: "GARAGE", nom: "Garage Automobile", description: "Mécanique, carrosserie" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "NETTOYAGE" },
            update: {},
            create: { code: "NETTOYAGE", nom: "Services de Nettoyage", description: "Nettoyage, entretien" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "BUREAU" },
            update: {},
            create: { code: "BUREAU", nom: "Activités de Bureau", description: "Bureaux, administratif" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "BATIMENT" },
            update: {},
            create: { code: "BATIMENT", nom: "Bâtiment et Travaux Publics", description: "Construction, rénovation" }
        }),
        prisma.metierICPP.upsert({
            where: { code: "HOTELLERIE" },
            update: {},
            create: { code: "HOTELLERIE", nom: "Hôtellerie", description: "Hébergement, réception" }
        })
    ])

    console.log(`✅ Created/updated ${metiers.length} métiers`)

    // ============================================
    // 2. CATÉGORIES DE RISQUES
    // ============================================

    console.log("📋 Creating Catégories de Risques...")

    const categories = await Promise.all([
        prisma.risqueCategorie.upsert({
            where: { code: "PHYSIQUE" },
            update: {},
            create: { code: "PHYSIQUE", nom: "Risques physiques", description: "Chutes, TMS, bruit, température", ordre: 1 }
        }),
        prisma.risqueCategorie.upsert({
            where: { code: "CHIMIQUE" },
            update: {},
            create: { code: "CHIMIQUE", nom: "Risques chimiques", description: "Exposition aux produits chimiques", ordre: 2 }
        }),
        prisma.risqueCategorie.upsert({
            where: { code: "BIOLOGIQUE" },
            update: {},
            create: { code: "BIOLOGIQUE", nom: "Risques biologiques", description: "Virus, bactéries", ordre: 3 }
        }),
        prisma.risqueCategorie.upsert({
            where: { code: "PSYCHOSOCIAUX" },
            update: {},
            create: { code: "PSYCHOSOCIAUX", nom: "Risques psychosociaux", description: "Stress, harcèlement", ordre: 4 }
        }),
        prisma.risqueCategorie.upsert({
            where: { code: "ELECTRIQUE" },
            update: {},
            create: { code: "ELECTRIQUE", nom: "Risques électriques", description: "Contact électrique", ordre: 5 }
        }),
        prisma.risqueCategorie.upsert({
            where: { code: "INCENDIE" },
            update: {},
            create: { code: "INCENDIE", nom: "Risques incendie-explosion", description: "Feu, explosion", ordre: 6 }
        }),
        prisma.risqueCategorie.upsert({
            where: { code: "ERGONOMIQUE" },
            update: {},
            create: { code: "ERGONOMIQUE", nom: "Risques ergonomiques", description: "Postures, gestes répétitifs", ordre: 7 }
        })
    ])

    console.log(`✅ Created/updated ${categories.length} catégories`)

    // ============================================
    // 3. PLANS TARIFAIRES
    // ============================================

    console.log("💰 Creating Plans Tarifaires...")

    const plans = await Promise.all([
        prisma.planTarifaire.upsert({
            where: { code: "ESSENTIEL" },
            update: {},
            create: {
                code: "ESSENTIEL",
                nom: "Essentiel",
                description: "Pour démarrer en toute conformité",
                prixMensuel: 1900,
                fraisSetup: 4900,
                fonctionnalites: JSON.stringify(["DUERP digital", "Affichages obligatoires", "Mises à jour réglementaires"]),
                ordre: 1
            }
        }),
        prisma.planTarifaire.upsert({
            where: { code: "PRO" },
            update: {},
            create: {
                code: "PRO",
                nom: "Pro",
                description: "Pour une gestion complète",
                prixMensuel: 3900,
                fraisSetup: 4900,
                fonctionnalites: JSON.stringify(["Tout Essentiel +", "Gestion multi-sites", "Rapports personnalisés"]),
                ordre: 2
            }
        }),
        prisma.planTarifaire.upsert({
            where: { code: "PREMIUM" },
            update: {},
            create: {
                code: "PREMIUM",
                nom: "Premium",
                description: "Solution complète entreprise",
                prixMensuel: 7900,
                fraisSetup: 9900,
                fonctionnalites: JSON.stringify(["Tout Pro +", "Support dédié", "Formation incluse", "API access"]),
                ordre: 3
            }
        })
    ])

    console.log(`✅ Created/updated ${plans.length} plans tarifaires`)

    // ============================================
    // 4. ADMIN USER
    // ============================================

    console.log("👤 Creating Admin User...")

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@icpp.re" },
        update: {},
        create: {
            name: "Administrateur ICPP",
            email: "admin@icpp.re",
            password: "$2b$10$J7vLvJoHX9xOz0L7V2uu9O0T5r.CqRYBT9F5Fy7B6Q0VJh0rB5x/K", // Hashed "Admin123!"
            role: "ADMIN",
            emailVerified: new Date()
        }
    })

    console.log(`✅ Admin user created: ${adminUser.email}`)

    // ============================================
    // 5. SAMPLE COMPANIES
    // ============================================

    console.log("🏪 Creating Sample Companies...")

    const company1 = await prisma.company.upsert({
        where: { siret: "12345678901234" },
        update: {},
        create: {
            name: "Salon Belle Allure",
            siret: "12345678901234",
            metierCode: "COIFFURE",
            employeeCount: 3,
            address: "15 Rue de la République",
            postalCode: "97400",
            city: "Saint-Denis",
            phone: "+262 262 12 34 56",
            email: "contact@belle-allure.re"
        }
    })

    const company2 = await prisma.company.upsert({
        where: { siret: "98765432109876" },
        update: {},
        create: {
            name: "Restaurant Le Créole",
            siret: "98765432109876",
            metierCode: "RESTAURATION",
            employeeCount: 8,
            address: "25 Boulevard Sud",
            postalCode: "97410",
            city: "Saint-Pierre",
            phone: "+262 262 98 76 54",
            email: "contact@lecreole.re"
        }
    })

    console.log(`✅ Created sample companies: ${company1.name}, ${company2.name}`)

    // ============================================
    // Note: UTs and Risques are seeded via SQL
    // Run: npx prisma db execute --file .\prisma\seed-complete.sql
    // ============================================

    console.log("\n✅ Seed completed successfully!")
    console.log("💡 For complete seed with UTs and Risques, run:")
    console.log("   npx prisma db execute --file .\\prisma\\seed-complete.sql")
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
