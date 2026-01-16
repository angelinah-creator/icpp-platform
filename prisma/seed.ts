import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Starting ICPP Platform seed...")

    // Clean database (development only)
    console.log("🧹 Cleaning database...")
    await prisma.auditLog.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.affichage.deleteMany()
    await prisma.cGVAcceptation.deleteMany()
    await prisma.evaluationRisque.deleteMany()
    await prisma.duerpDocument.deleteMany()
    await prisma.contrat.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    await prisma.company.deleteMany()
    await prisma.risqueMetier.deleteMany()
    await prisma.risqueCategorie.deleteMany()
    await prisma.metierICPP.deleteMany()
    await prisma.planTarifaire.deleteMany()
    await prisma.cGVVersion.deleteMany()

    console.log("✅ Database cleaned")

    // ============================================
    // 1. MÉTIERS ICPP
    // ============================================

    console.log("📋 Creating Métiers ICPP...")

    const metiers = await Promise.all([
        prisma.metierICPP.create({
            data: {
                code: "COIFFURE",
                nom: "Salon de Coiffure",
                description: "Activités de coiffure, soins capillaires et esthétique"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "RESTAURATION",
                nom: "Restauration",
                description: "Services de restauration rapide ou traditionnelle"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "BOULANGERIE",
                nom: "Boulangerie-Pâtisserie",
                description: "Fabrication et vente de produits de boulangerie"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "COMMERCE",
                nom: "Commerce de Détail",
                description: "Vente au détail de marchandises diverses"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "ESTHETIQUE",
                nom: "Institut de Beauté",
                description: "Soins esthétiques et bien-être"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "GARAGE",
                nom: "Garage Automobile",
                description: "Réparation et entretien de véhicules"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "BATIMENT",
                nom: "Bâtiment et Travaux Publics",
                description: "Construction, rénovation et travaux publics"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "NETTOYAGE",
                nom: "Services de Nettoyage",
                description: "Nettoyage de locaux professionnels et particuliers"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "HOTELLERIE",
                nom: "Hôtellerie",
                description: "Hébergement et services hôteliers"
            }
        }),
        prisma.metierICPP.create({
            data: {
                code: "BUREAU",
                nom: "Activités de Bureau",
                description: "Travail administratif et tertiaire"
            }
        })
    ])

    console.log(`✅ Created ${metiers.length} métiers`)

    // ============================================
    // 2. CATÉGORIES DE RISQUES
    // ============================================

    console.log("📊 Creating Catégories de Risques...")

    const categories = await Promise.all([
        prisma.risqueCategorie.create({
            data: {
                code: "PHYSIQUE",
                nom: "Risques Physiques",
                description: "Chutes, coupures, brûlures, etc.",
                ordre: 1
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "CHIMIQUE",
                nom: "Risques Chimiques",
                description: "Exposition à des produits chimiques",
                ordre: 2
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "BIOLOGIQUE",
                nom: "Risques Biologiques",
                description: "Exposition à des agents biologiques",
                ordre: 3
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "ERGONOMIQUE",
                nom: "Risques Ergonomiques (TMS)",
                description: "Troubles musculo-squelettiques",
                ordre: 4
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "PSYCHOSOCIAL",
                nom: "Risques Psychosociaux",
                description: "Stress, charge mentale, harcèlement",
                ordre: 5
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "MECANIQUE",
                nom: "Risques Mécaniques",
                description: "Machines, outils, équipements",
                ordre: 6
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "ELECTRIQUE",
                nom: "Risques Électriques",
                description: "Installations et équipements électriques",
                ordre: 7
            }
        }),
        prisma.risqueCategorie.create({
            data: {
                code: "INCENDIE",
                nom: "Risques d'Incendie",
                description: "Risques liés au feu et aux matériaux inflammables",
                ordre: 8
            }
        })
    ])

    console.log(`✅ Created ${categories.length} catégories`)

    // ============================================
    // 3. RISQUES PAR MÉTIER (Échantillon)
    // ============================================

    console.log("⚠️  Creating Risques Métier...")

    // COIFFURE
    const risquesCoiffure = await Promise.all([
        prisma.risqueMetier.create({
            data: {
                categorieCode: "CHIMIQUE",
                metierCode: "COIFFURE",
                nom: "Produits chimiques (colorations, permanentes)",
                description: "Exposition aux produits capillaires contenant des substances chimiques (ammoniaque, peroxyde, etc.)",
                gravite: "ELEVE",
                frequence: 4,
                mesuresSuggerees: JSON.stringify([
                    "Port de gants adaptés",
                    "Ventilation du local",
                    "Formation aux produits chimiques",
                    "Stockage sécurisé des produits"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "ERGONOMIQUE",
                metierCode: "COIFFURE",
                nom: "Troubles musculo-squelettiques (TMS)",
                description: "Station debout prolongée, gestes répétitifs, postures contraignantes",
                gravite: "MOYEN",
                frequence: 5,
                mesuresSuggerees: JSON.stringify([
                    "Pauses régulières",
                    "Tapis anti-fatigue",
                    "Formation gestes et postures",
                    "Sièges réglables pour clients"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "PHYSIQUE",
                metierCode: "COIFFURE",
                nom: "Chutes (sol mouillé)",
                description: "Risque de glissade sur sol humide après shampooing",
                gravite: "MOYEN",
                frequence: 3,
                mesuresSuggerees: JSON.stringify([
                    "Tapis antidérapants",
                    "Nettoyage immédiat des éclaboussures",
                    "Signalétique 'Sol mouillé'",
                    "Chaussures antidérapantes"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "PHYSIQUE",
                metierCode: "COIFFURE",
                nom: "Coupures (ciseaux, rasoirs)",
                description: "Coupures avec outils tranchants lors de la coupe",
                gravite: "FAIBLE",
                frequence: 2,
                mesuresSuggerees: JSON.stringify([
                    "Formation utilisation des outils",
                    "Rangement sécurisé",
                    "Trousse de premiers secours",
                    "Désinfection des plaies"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "PSYCHOSOCIAL",
                metierCode: "COIFFURE",
                nom: "Stress et charge de travail",
                description: "Rythme intense, horaires décalés, relation client exigeante",
                gravite: "MOYEN",
                frequence: 4,
                mesuresSuggerees: JSON.stringify([
                    "Planning équilibré",
                    "Pauses régulières",
                    "Communication en équipe",
                    "Formation gestion du stress"
                ])
            }
        })
    ])

    // RESTAURATION
    const risquesRestau = await Promise.all([
        prisma.risqueMetier.create({
            data: {
                categorieCode: "PHYSIQUE",
                metierCode: "RESTAURATION",
                nom: "Brûlures (four, plaques chauffantes)",
                description: "Contact avec surfaces chaudes, projections d'huile",
                gravite: "ELEVE",
                frequence: 4,
                mesuresSuggerees: JSON.stringify([
                    "Gants anti-chaleur",
                    "Formation sécurité cuisine",
                    "Signalétique zones chaudes",
                    "Écrans de protection friteuse"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "PHYSIQUE",
                metierCode: "RESTAURATION",
                nom: "Coupures (couteaux, trancheurs)",
                description: "Manipulation d'outils tranchants en cuisine",
                gravite: "MOYEN",
                frequence: 4,
                mesuresSuggerees: JSON.stringify([
                    "Couteaux bien affûtés",
                    "Formation découpe",
                    "Gants anti-coupure",
                    "Rangement sécurisé"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "ERGONOMIQUE",
                metierCode: "RESTAURATION",
                nom: "Port de charges lourdes",
                description: "Manipulation de cartons, stocks, matériel lourd",
                gravite: "MOYEN",
                frequence: 3,
                mesuresSuggerees: JSON.stringify([
                    "Formation manutention",
                    "Aide mécanique (diable, chariot)",
                    "Organisation des stocks",
                    "Travail en équipe"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "PSYCHOSOCIAL",
                metierCode: "RESTAURATION",
                nom: "Stress et horaires décalés",
                description: "Rythme intense, service en continu, horaires atypiques",
                gravite: "MOYEN",
                frequence: 5,
                mesuresSuggerees: JSON.stringify([
                    "Planning équilibré",
                    "Pauses obligatoires",
                    "Communication équipe",
                    "Respect temps de repos"
                ])
            }
        }),
        prisma.risqueMetier.create({
            data: {
                categorieCode: "INCENDIE",
                metierCode: "RESTAURATION",
                nom: "Risque incendie (cuisine)",
                description: "Présence de flammes, huiles chaudes, matériaux inflammables",
                gravite: "ELEVE",
                frequence: 2,
                mesuresSuggerees: JSON.stringify([
                    "Extincteurs adaptés (classe F)",
                    "Couverture anti-feu",
                    "Formation incendie",
                    "Entretien hottes et filtres"
                ])
            }
        })
    ])

    console.log(`✅ Created ${risquesCoiffure.length + risquesRestau.length} risques métier`)

    // ============================================
    // 4. PLANS TARIFAIRES
    // ============================================

    console.log("💰 Creating Plans Tarifaires...")

    const plans = await Promise.all([
        prisma.planTarifaire.create({
            data: {
                code: "ESSENTIEL",
                nom: "Essentiel",
                description: "Pour démarrer en toute conformité",
                prixMensuel: 1900, // 19€
                fraisSetup: 4900, // 49€
                fonctionnalites: JSON.stringify([
                    "DUERP digital",
                    "Affichages obligatoires",
                    "Mises à jour réglementaires",
                    "Support email"
                ]),
                ordre: 1
            }
        }),
        prisma.planTarifaire.create({
            data: {
                code: "PRO",
                nom: "Pro",
                description: "Pour une gestion complète",
                prixMensuel: 3900, // 39€
                fraisSetup: 4900,
                fonctionnalites: JSON.stringify([
                    "Tout Essentiel +",
                    "Gestion multi-sites",
                    "Rapports personnalisés",
                    "Support prioritaire",
                    "Audit annuel"
                ]),
                ordre: 2
            }
        }),
        prisma.planTarifaire.create({
            data: {
                code: "PREMIUM",
                nom: "Premium",
                description: "Accompagnement sur-mesure",
                prixMensuel: 7900, // 79€
                fraisSetup: 4900,
                fonctionnalites: JSON.stringify([
                    "Tout Pro +",
                    "Accompagnement dédié",
                    "Formation en présentiel",
                    "Audit trimestriel",
                    "Assistance juridique"
                ]),
                ordre: 3
            }
        })
    ])

    console.log(`✅ Created ${plans.length} plans tarifaires`)

    // ============================================
    // 5. CGV
    // ============================================

    console.log("📄 Creating CGV...")

    const cgv = await prisma.cGVVersion.create({
        data: {
            version: "1.0",
            contenu: "Conditions Générales de Vente ICPP Platform - Version 1.0",
            datePublication: new Date("2026-01-01"),
            isActive: true
        }
    })

    console.log("✅ Created CGV version 1.0")

    // ============================================
    // 6. DONNÉES DE TEST
    // ============================================

    console.log("🧪 Creating test data...")

    const hashedPassword = await bcrypt.hash("password123", 10)

    // Admin
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@icpp-platform.fr",
            name: "Admin ICPP",
            password: hashedPassword,
            role: "ADMIN",
            emailVerified: new Date()
        }
    })

    // Company 1 - Coiffure
    const company1 = await prisma.company.create({
        data: {
            name: "Salon Belle Allure",
            siret: "12345678901234",
            metierCode: "COIFFURE",
            employeeCount: 3,
            address: "15 Rue de la République",
            postalCode: "97400",
            city: "Saint-Denis",
            phone: "+262 262 12 34 56",
            email: "contact@belleallure.re"
        }
    })

    const user1 = await prisma.user.create({
        data: {
            email: "marie@belleallure.re",
            name: "Marie Dupont",
            password: hashedPassword,
            role: "CLIENT",
            companyId: company1.id,
            emailVerified: new Date()
        }
    })

    // Subscription
    await prisma.subscription.create({
        data: {
            companyId: company1.id,
            planCode: "PRO",
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            setupFeePaid: true,
            setupFeePaidAt: new Date()
        }
    })

    // Contrat
    await prisma.contrat.create({
        data: {
            numeroContrat: "ICPP-2026-001",
            companyId: company1.id,
            cgvVersion: "1.0",
            dateDebut: new Date(),
            signedAt: new Date(),
            signatureData: JSON.stringify({
                ip: "192.168.1.1",
                timestamp: new Date().toISOString()
            }),
            status: "ACTIF"
        }
    })

    console.log("✅ Created test company and user")

    console.log("\n🎉 Seed completed successfully!\n")
    console.log("📊 Summary:")
    console.log(`- ${metiers.length} métiers ICPP`)
    console.log(`- ${categories.length} catégories de risques`)
    console.log(`- ${risquesCoiffure.length + risquesRestau.length} risques métier`)
    console.log(`- ${plans.length} plans tarifaires`)
    console.log("- 1 version CGV")
    console.log("- 1 company de test")
    console.log("- 2 users (admin + client)")
    console.log("\n👤 Test accounts:")
    console.log("Admin: admin@icpp-platform.fr / password123")
    console.log("Client: marie@belleallure.re / password123")
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:")
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

