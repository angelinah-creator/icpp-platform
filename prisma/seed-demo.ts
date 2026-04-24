/**
 * ICPP — Script de données de démonstration
 * Couvre tous les rôles : ADMIN, AUDITOR, COMMERCIAL, CLIENT, TECHNICIEN
 * 
 * Mots de passe (bcrypt de "Demo1234!") :
 *   $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
 * 
 * Usage :
 *   docker compose -f docker-compose.prod.yml exec app npx tsx prisma/seed-demo.ts
 *   ou en local :  npx tsx prisma/seed-demo.ts
 */

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// Mot de passe "Demo1234!" hashé
const DEMO_PASSWORD = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"

// ============================================================
// Helpers
// ============================================================

function dateAgo(days: number) {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d
}

function dateFuture(days: number) {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d
}

// ============================================================
async function main() {
    console.log("\n🌱 ICPP — Seeding données de démonstration...\n")

    // ================================================================
    // 1. UTILISATEURS — tous les rôles
    // ================================================================
    console.log("👤 Création des utilisateurs...")

    // ---- ADMIN (déjà dans le seed principal, on upsert) ----
    const admin = await prisma.user.upsert({
        where: { email: "admin@icpp.re" },
        update: {},
        create: {
            name: "Administrateur ICPP",
            email: "admin@icpp.re",
            password: DEMO_PASSWORD,
            role: "ADMIN",
            emailVerified: new Date(),
            phone: "+262 692 00 00 01"
        }
    })
    console.log(`  ✅ ADMIN        admin@icpp.re / Demo1234!`)

    // ---- AUDITEUR 1 ----
    const auditeur1 = await prisma.user.upsert({
        where: { email: "auditeur1@icpp.re" },
        update: {},
        create: {
            name: "Marc Lefevre",
            email: "auditeur1@icpp.re",
            password: DEMO_PASSWORD,
            role: "AUDITOR",
            emailVerified: new Date(),
            phone: "+262 692 11 11 11"
        }
    })
    console.log(`  ✅ AUDITEUR 1   auditeur1@icpp.re / Demo1234!`)

    // ---- AUDITEUR 2 ----
    const auditeur2 = await prisma.user.upsert({
        where: { email: "auditeur2@icpp.re" },
        update: {},
        create: {
            name: "Sophie Moreau",
            email: "auditeur2@icpp.re",
            password: DEMO_PASSWORD,
            role: "AUDITOR",
            emailVerified: new Date(),
            phone: "+262 692 22 22 22"
        }
    })
    console.log(`  ✅ AUDITEUR 2   auditeur2@icpp.re / Demo1234!`)

    // ---- COMMERCIAL ----
    const commercial = await prisma.user.upsert({
        where: { email: "commercial@icpp.re" },
        update: {},
        create: {
            name: "Julie Bernard",
            email: "commercial@icpp.re",
            password: DEMO_PASSWORD,
            role: "COMMERCIAL",
            emailVerified: new Date(),
            phone: "+262 692 33 33 33"
        }
    })
    console.log(`  ✅ COMMERCIAL   commercial@icpp.re / Demo1234!`)

    // ---- TECHNICIEN ----
    const technicien = await prisma.user.upsert({
        where: { email: "technicien@icpp.re" },
        update: {},
        create: {
            name: "Karim Ould",
            email: "technicien@icpp.re",
            password: DEMO_PASSWORD,
            role: "TECHNICIEN",
            emailVerified: new Date(),
            phone: "+262 692 44 44 44"
        }
    })
    console.log(`  ✅ TECHNICIEN   technicien@icpp.re / Demo1234!`)

    // ================================================================
    // 2. PLANS TARIFAIRES (upsert pour idempotence)
    // ================================================================
    console.log("\n💰 Plans tarifaires...")
    await prisma.planTarifaire.upsert({
        where: { code: "ESSENTIEL" },
        update: {},
        create: { code: "ESSENTIEL", nom: "Essentiel", description: "Pour démarrer en toute conformité", prixMensuel: 1900, fraisSetup: 4900, fonctionnalites: JSON.stringify(["DUERP digital", "Affichages obligatoires", "Mises à jour réglementaires"]), ordre: 1 }
    })
    await prisma.planTarifaire.upsert({
        where: { code: "PRO" },
        update: {},
        create: { code: "PRO", nom: "Pro", description: "Pour une gestion complète", prixMensuel: 3900, fraisSetup: 4900, fonctionnalites: JSON.stringify(["Tout Essentiel +", "Gestion multi-sites", "Rapports personnalisés"]), ordre: 2 }
    })
    await prisma.planTarifaire.upsert({
        where: { code: "PREMIUM" },
        update: {},
        create: { code: "PREMIUM", nom: "Premium", description: "Solution complète entreprise", prixMensuel: 7900, fraisSetup: 9900, fonctionnalites: JSON.stringify(["Tout Pro +", "Support dédié", "Formation incluse"]), ordre: 3 }
    })
    console.log(`  ✅ 3 plans tarifaires`)

    // ================================================================
    // 3. MÉTIERS (upsert)
    // ================================================================
    console.log("\n🏢 Métiers ICPP...")
    for (const m of [
        { code: "COIFFURE", nom: "Salon de Coiffure", description: "Coiffure, barbier" },
        { code: "ESTHETIQUE", nom: "Institut de Beauté", description: "Esthétique, onglerie" },
        { code: "RESTAURATION", nom: "Restauration", description: "Restaurant, snack, restauration rapide" },
        { code: "BOULANGERIE", nom: "Boulangerie-Pâtisserie", description: "Fabrication et vente de pain" },
        { code: "COMMERCE", nom: "Commerce de Détail", description: "Boutique, prêt-à-porter" },
        { code: "GARAGE", nom: "Garage Automobile", description: "Mécanique, carrosserie" },
    ]) {
        await prisma.metierICPP.upsert({ where: { code: m.code }, update: {}, create: m })
    }
    console.log(`  ✅ 6 métiers`)

    // ================================================================
    // 4. ENTREPRISES CLIENTES
    // ================================================================
    console.log("\n🏪 Création des entreprises...")

    // Entreprise 1 : Salon coiffure (auditeur1, commercial, plan PRO)
    const comp1 = await prisma.company.upsert({
        where: { siret: "11111111111111" },
        update: {},
        create: {
            name: "Salon Belle Allure",
            siret: "11111111111111",
            metierCode: "COIFFURE",
            employeeCount: 4,
            address: "15 Rue de la République",
            postalCode: "97400",
            city: "Saint-Denis",
            phone: "+262 262 10 10 10",
            email: "contact@belle-allure.re",
            auditorId: auditeur1.id,
            commercialId: commercial.id,
            contactName: "Amina Hoarau",
            contactRole: "Gérante",
            contactEmail: "amina@belle-allure.re"
        }
    })

    // Entreprise 2 : Restaurant (auditeur1, commercial, plan PRO)
    const comp2 = await prisma.company.upsert({
        where: { siret: "22222222222222" },
        update: {},
        create: {
            name: "Restaurant Le Créole",
            siret: "22222222222222",
            metierCode: "RESTAURATION",
            employeeCount: 10,
            address: "25 Boulevard Sud",
            postalCode: "97410",
            city: "Saint-Pierre",
            phone: "+262 262 20 20 20",
            email: "contact@lecreole.re",
            auditorId: auditeur1.id,
            commercialId: commercial.id,
            contactName: "Jean-Luc Payet",
            contactRole: "Directeur",
            contactEmail: "jl.payet@lecreole.re"
        }
    })

    // Entreprise 3 : Boulangerie (auditeur2, plan ESSENTIEL)
    const comp3 = await prisma.company.upsert({
        where: { siret: "33333333333333" },
        update: {},
        create: {
            name: "Boulangerie du Lagon",
            siret: "33333333333333",
            metierCode: "BOULANGERIE",
            employeeCount: 3,
            address: "8 Allée des Palmiers",
            postalCode: "97460",
            city: "Saint-Paul",
            phone: "+262 262 30 30 30",
            email: "lagon@boulangerie.re",
            auditorId: auditeur2.id,
            commercialId: commercial.id,
            contactName: "Patricia Rivière",
            contactRole: "Propriétaire",
            contactEmail: "patricia@boulangerie.re"
        }
    })

    // Entreprise 4 : Institut beauté (auditeur2, commercial, plan PREMIUM)
    const comp4 = await prisma.company.upsert({
        where: { siret: "44444444444444" },
        update: {},
        create: {
            name: "Institut Beauty Zen",
            siret: "44444444444444",
            metierCode: "ESTHETIQUE",
            employeeCount: 5,
            address: "3 Place de la Mairie",
            postalCode: "97434",
            city: "La Saline",
            phone: "+262 262 40 40 40",
            email: "contact@beautyzen.re",
            auditorId: auditeur2.id,
            commercialId: commercial.id
        }
    })

    // Entreprise 5 : Garage (auditeur1, seulement commercial assigné)
    const comp5 = await prisma.company.upsert({
        where: { siret: "55555555555555" },
        update: {},
        create: {
            name: "Garage Réunion Auto",
            siret: "55555555555555",
            metierCode: "GARAGE",
            employeeCount: 7,
            address: "Zone Artisanale ZAC de la Mare",
            postalCode: "97490",
            city: "Sainte-Clotilde",
            phone: "+262 262 50 50 50",
            email: "contact@reunionauto.re",
            auditorId: auditeur1.id,
            commercialId: commercial.id
        }
    })

    // Entreprise 6 : Commerce (sans auditeur encore)
    const comp6 = await prisma.company.upsert({
        where: { siret: "66666666666666" },
        update: {},
        create: {
            name: "Boutique Mode Tropicale",
            siret: "66666666666666",
            metierCode: "COMMERCE",
            employeeCount: 2,
            address: "12 Rue Roland Garros",
            postalCode: "97400",
            city: "Saint-Denis",
            phone: "+262 262 60 60 60",
            email: "contact@modetropicale.re"
        }
    })

    console.log(`  ✅ 6 entreprises créées`)

    // ================================================================
    // 5. ABONNEMENTS
    // ================================================================
    console.log("\n📋 Abonnements...")

    const subData = [
        { companyId: comp1.id, planCode: "PRO" },
        { companyId: comp2.id, planCode: "PRO" },
        { companyId: comp3.id, planCode: "ESSENTIEL" },
        { companyId: comp4.id, planCode: "PREMIUM" },
        { companyId: comp5.id, planCode: "ESSENTIEL" },
        // comp6 sans abonnement (prospect)
    ]

    for (const sub of subData) {
        await prisma.subscription.upsert({
            where: { companyId: sub.companyId },
            update: {},
            create: {
                companyId: sub.companyId,
                planCode: sub.planCode,
                status: "ACTIVE",
                currentPeriodStart: dateAgo(30),
                currentPeriodEnd: dateFuture(335),
                setupFeePaid: true,
                setupFeePaidAt: dateAgo(30)
            }
        })
    }
    console.log(`  ✅ 5 abonnements actifs`)

    // ================================================================
    // 6. UTILISATEURS CLIENTS (liés à leur entreprise)
    // ================================================================
    console.log("\n👥 Comptes clients...")

    const client1 = await prisma.user.upsert({
        where: { email: "amina@belle-allure.re" },
        update: {},
        create: {
            name: "Amina Hoarau",
            email: "amina@belle-allure.re",
            password: DEMO_PASSWORD,
            role: "CLIENT",
            emailVerified: new Date(),
            companyId: comp1.id
        }
    })
    console.log(`  ✅ CLIENT 1     amina@belle-allure.re / Demo1234! (Salon Belle Allure)`)

    const client2 = await prisma.user.upsert({
        where: { email: "jl.payet@lecreole.re" },
        update: {},
        create: {
            name: "Jean-Luc Payet",
            email: "jl.payet@lecreole.re",
            password: DEMO_PASSWORD,
            role: "CLIENT",
            emailVerified: new Date(),
            companyId: comp2.id
        }
    })
    console.log(`  ✅ CLIENT 2     jl.payet@lecreole.re / Demo1234! (Restaurant Le Créole)`)

    const client3 = await prisma.user.upsert({
        where: { email: "patricia@boulangerie.re" },
        update: {},
        create: {
            name: "Patricia Rivière",
            email: "patricia@boulangerie.re",
            password: DEMO_PASSWORD,
            role: "CLIENT",
            emailVerified: new Date(),
            companyId: comp3.id
        }
    })
    console.log(`  ✅ CLIENT 3     patricia@boulangerie.re / Demo1234! (Boulangerie du Lagon)`)

    const client4 = await prisma.user.upsert({
        where: { email: "zenbeauty@beauty.re" },
        update: {},
        create: {
            name: "Caroline Morel",
            email: "zenbeauty@beauty.re",
            password: DEMO_PASSWORD,
            role: "CLIENT",
            emailVerified: new Date(),
            companyId: comp4.id
        }
    })
    console.log(`  ✅ CLIENT 4     zenbeauty@beauty.re / Demo1234! (Institut Beauty Zen)`)

    const client5 = await prisma.user.upsert({
        where: { email: "garage@reunionauto.re" },
        update: {},
        create: {
            name: "Thierry Grondin",
            email: "garage@reunionauto.re",
            password: DEMO_PASSWORD,
            role: "CLIENT",
            emailVerified: new Date(),
            companyId: comp5.id
        }
    })
    console.log(`  ✅ CLIENT 5     garage@reunionauto.re / Demo1234! (Garage Réunion Auto)`)

    // ================================================================
    // 7. SALARIÉS par entreprise
    // ================================================================
    console.log("\n👷 Salariés...")

    const salariesData = [
        // Salon Belle Allure
        { companyId: comp1.id, nom: "Hoarau", prenom: "Amina", poste: "Gérante / Coiffeuse", uniteTravail: "Accueil + Coupe", dateEntree: dateAgo(730), typeContrat: "CDI" },
        { companyId: comp1.id, nom: "Dijoux", prenom: "Laura", poste: "Coiffeuse", uniteTravail: "Postes de coupe", dateEntree: dateAgo(400), typeContrat: "CDI" },
        { companyId: comp1.id, nom: "Grondet", prenom: "Élodie", poste: "Apprentie coiffeuse", uniteTravail: "Postes de coupe", dateEntree: dateAgo(180), typeContrat: "APPRENTISSAGE" },
        // Restaurant Le Créole
        { companyId: comp2.id, nom: "Payet", prenom: "Jean-Luc", poste: "Directeur", uniteTravail: "Bureau direction", dateEntree: dateAgo(1200), typeContrat: "CDI" },
        { companyId: comp2.id, nom: "Nativel", prenom: "Cédric", poste: "Chef cuisinier", uniteTravail: "Cuisine", dateEntree: dateAgo(600), typeContrat: "CDI" },
        { companyId: comp2.id, nom: "Clain", prenom: "Manon", poste: "Serveur", uniteTravail: "Salle", dateEntree: dateAgo(120), typeContrat: "CDD" },
        { companyId: comp2.id, nom: "Turpin", prenom: "David", poste: "Plongeur", uniteTravail: "Cuisine", dateEntree: dateAgo(90), typeContrat: "INTERIM" },
        // Boulangerie du Lagon
        { companyId: comp3.id, nom: "Rivière", prenom: "Patricia", poste: "Boulangère", uniteTravail: "Fournil", dateEntree: dateAgo(900), typeContrat: "CDI" },
        { companyId: comp3.id, nom: "Morel", prenom: "Axel", poste: "Vendeur", uniteTravail: "Accueil-vente", dateEntree: dateAgo(200), typeContrat: "TEMPS_PARTIEL" },
        // Institut Beauty Zen
        { companyId: comp4.id, nom: "Morel", prenom: "Caroline", poste: "Gérante / Esthéticienne", uniteTravail: "Cabines soins", dateEntree: dateAgo(1100), typeContrat: "CDI" },
        { companyId: comp4.id, nom: "Benard", prenom: "Lucie", poste: "Esthéticienne", uniteTravail: "Cabines soins", dateEntree: dateAgo(300), typeContrat: "CDI" },
        // Garage Réunion Auto
        { companyId: comp5.id, nom: "Grondin", prenom: "Thierry", poste: "Gérant / Mécanicien", uniteTravail: "Atelier", dateEntree: dateAgo(2000), typeContrat: "CDI" },
        { companyId: comp5.id, nom: "Fontaine", prenom: "Rémy", poste: "Mécanicien", uniteTravail: "Atelier", dateEntree: dateAgo(750), typeContrat: "CDI" },
        { companyId: comp5.id, nom: "Solet", prenom: "Alex", poste: "Carrossier", uniteTravail: "Atelier carrosserie", dateEntree: dateAgo(400), typeContrat: "CDI" },
    ]

    for (const s of salariesData) {
        await prisma.salarie.create({ data: { ...s } })
    }
    console.log(`  ✅ ${salariesData.length} salariés créés`)

    // ================================================================
    // 8. DUERP
    // ================================================================
    console.log("\n📄 DUERP Documents...")

    // Comp1 : DUERP signé (conforme)
    const duerp1 = await prisma.duerpDocument.create({
        data: {
            companyId: comp1.id,
            version: 2,
            status: "ACTIVE",
            signedAt: dateAgo(15),
            signedBy: client1.id,
            lastUpdateReason: "Révision annuelle - ouverture d'un nouveau poste de coupe",
            nextReviewDate: dateFuture(350)
        }
    })

    // Comp2 : DUERP brouillon (à finaliser)
    const duerp2 = await prisma.duerpDocument.create({
        data: {
            companyId: comp2.id,
            version: 1,
            status: "DRAFT",
            nextReviewDate: dateFuture(30)
        }
    })

    // Comp3 : DUERP signé mais ancien (> 1 an – a_mettre_a_jour)
    const duerp3 = await prisma.duerpDocument.create({
        data: {
            companyId: comp3.id,
            version: 1,
            status: "ACTIVE",
            signedAt: dateAgo(400),
            signedBy: client3.id,
            nextReviewDate: dateAgo(35)
        }
    })

    // Comp4 : DUERP en attente de signature
    const duerp4 = await prisma.duerpDocument.create({
        data: {
            companyId: comp4.id,
            version: 1,
            status: "PENDING_SIGNATURE",
            nextReviewDate: dateFuture(60)
        }
    })

    // Comp5 : pas de DUERP (non conforme)
    console.log(`  ✅ 4 DUERP créés (1 signé, 1 brouillon, 1 expiré, 1 en attente)`)

    // ================================================================
    // 9. AUDITS TERRAIN
    // ================================================================
    console.log("\n🔍 Audits terrain...")

    // Audit 1 : terminé (score 82%)
    await prisma.audit.create({
        data: {
            companyId: comp1.id,
            auditorId: auditeur1.id,
            type: "INITIAL",
            status: "TERMINE",
            dateAudit: dateAgo(60),
            dateRealisation: dateAgo(60),
            scoreConformite: 82,
            observations: JSON.stringify({
                score: 82,
                documents: { duerp: true, affichages: true, extincteurs: true, registre: true, personnel: false, formations: true },
                risks: [
                    { categorie: "PHYSIQUE", nom: "Chutes de plain-pied", gravite: 2, frequence: 3, priorite: 6 },
                    { categorie: "CHIMIQUE", nom: "Produits capillaires irritants", gravite: 2, frequence: 4, priorite: 8 }
                ],
                commentaire: "Globalement conforme. Registre unique du personnel à mettre à jour."
            })
        }
    })

    // Audit 2 : terminé (score 55%) — restaurant
    await prisma.audit.create({
        data: {
            companyId: comp2.id,
            auditorId: auditeur1.id,
            type: "INITIAL",
            status: "TERMINE",
            dateAudit: dateAgo(45),
            dateRealisation: dateAgo(45),
            scoreConformite: 55,
            observations: JSON.stringify({
                score: 55,
                documents: { duerp: false, affichages: true, extincteurs: true, registre: false, personnel: true, formations: false },
                risks: [
                    { categorie: "PHYSIQUE", nom: "Brûlures cuisine", gravite: 3, frequence: 4, priorite: 12 },
                    { categorie: "PHYSIQUE", nom: "Glissades sols mouillés", gravite: 3, frequence: 3, priorite: 9 },
                    { categorie: "CHIMIQUE", nom: "Produits nettoyage cuisine", gravite: 2, frequence: 4, priorite: 8 }
                ],
                commentaire: "DUERP absent — à mettre en place en urgence. Formations sécurité à planifier."
            })
        }
    })

    // Audit 3 : planifié (futur — comp3)
    await prisma.audit.create({
        data: {
            companyId: comp3.id,
            auditorId: auditeur2.id,
            type: "ANNUEL",
            status: "PLANIFIE",
            dateAudit: dateFuture(14)
        }
    })

    // Audit 4 : en cours (comp4)
    await prisma.audit.create({
        data: {
            companyId: comp4.id,
            auditorId: auditeur2.id,
            type: "INITIAL",
            status: "EN_COURS",
            dateAudit: new Date()
        }
    })

    // Audit 5 : terminé par admin (comp5)
    await prisma.audit.create({
        data: {
            companyId: comp5.id,
            auditorId: auditeur1.id,
            type: "INITIAL",
            status: "TERMINE",
            dateAudit: dateAgo(90),
            dateRealisation: dateAgo(90),
            scoreConformite: 40,
            observations: JSON.stringify({
                score: 40,
                documents: { duerp: false, affichages: false, extincteurs: true, registre: false, personnel: true, formations: false },
                risks: [
                    { categorie: "CHIMIQUE", nom: "Huiles et lubrifiants", gravite: 3, frequence: 4, priorite: 12 },
                    { categorie: "PHYSIQUE", nom: "Manutention de charges lourdes", gravite: 3, frequence: 4, priorite: 12 },
                    { categorie: "ELECTRIQUE", nom: "Installations électriques vétustes", gravite: 4, frequence: 3, priorite: 12 },
                    { categorie: "INCENDIE", nom: "Stockage produits inflammables", gravite: 5, frequence: 3, priorite: 15 }
                ],
                commentaire: "Non conforme sur plusieurs points critiques. Plan d'action corrective urgent requis."
            })
        }
    })

    console.log(`  ✅ 5 audits créés (2 terminés, 1 planifié, 1 en cours, 1 terminé admin)`)

    // ================================================================
    // 10. SIGNALEMENTS
    // ================================================================
    console.log("\n⚠️ Signalements...")

    const sig1 = await prisma.signalement.create({
        data: {
            companyId: comp1.id,
            userId: client1.id,
            type: "INCIDENT",
            titre: "Glissade dans la zone lavabo",
            description: "Une employée a glissé ce matin dans la zone shampoing suite à une fuite. Pas de blessure grave mais choc à l'épaule.",
            status: "NOUVEAU"
        }
    })

    const sig2 = await prisma.signalement.create({
        data: {
            companyId: comp2.id,
            userId: client2.id,
            type: "DANGER",
            titre: "Prises électriques défectueuses en cuisine",
            description: "Deux prises présentent des brûlures et des étincelles lors de la connexion d'équipements. Risque d'incendie.",
            status: "EN_COURS",
            reponse: "Intervention d'un électricien planifiée pour vendredi."
        }
    })

    const sig3 = await prisma.signalement.create({
        data: {
            companyId: comp3.id,
            userId: client3.id,
            type: "AMELIORATION",
            titre: "Demande de tapis anti-fatigue pour le fournil",
            description: "Le personnel du fournil travaille debout 8h par jour. Des tapis anti-fatigue réduiraient les TMS.",
            status: "TRAITE",
            reponse: "Commande de 2 tapis approuvée et effectuée. Livraison prévue semaine 8.",
            traiteAt: dateAgo(5)
        }
    })

    const sig4 = await prisma.signalement.create({
        data: {
            companyId: comp5.id,
            userId: client5.id,
            type: "DANGER",
            titre: "Fût d'huile mal stocké — risque de chute",
            description: "Un fût de 200L est posé à même le sol dans l'atelier sans stabilisation. Il risque de tomber sur un technicien.",
            status: "NOUVEAU"
        }
    })

    const sig5 = await prisma.signalement.create({
        data: {
            companyId: comp4.id,
            userId: client4.id,
            type: "INCIDENT",
            titre: "Brûlure chimique lors d'une épilation à la cire",
            description: "L'esthéticienne s'est brûlée légèrement lors de la manipulation de cire trop chaude. Plaie superficielle traitée sur place.",
            status: "EN_COURS"
        }
    })

    console.log(`  ✅ 5 signalements créés`)

    // ================================================================
    // 11. TÂCHES (pour auditeurs + technicien)
    // ================================================================
    console.log("\n✅ Tâches assignées...")

    await prisma.tache.create({
        data: {
            titre: "Mettre à jour le registre unique du personnel",
            description: "Le registre unique du personnel du Salon Belle Allure n'est pas à jour. Action corrective suite à l'audit du " + dateAgo(60).toLocaleDateString("fr-FR"),
            type: "AUDIT",
            priorite: "HAUTE",
            status: "A_FAIRE",
            echeance: dateFuture(14),
            assigneId: auditeur1.id,
            companyId: comp1.id,
            signalementId: null
        }
    })

    await prisma.tache.create({
        data: {
            titre: "Créer le DUERP — Restaurant Le Créole",
            description: "DUERP totalement absent constaté lors de l'audit initial. Document obligatoire — à rédiger en priorité.",
            type: "DUERP",
            priorite: "URGENTE",
            status: "EN_COURS",
            echeance: dateFuture(7),
            assigneId: auditeur1.id,
            companyId: comp2.id
        }
    })

    await prisma.tache.create({
        data: {
            titre: "Vérifier l'installation électrique — Garage Réunion Auto",
            description: "L'audit a mis en évidence des installations électriques vétustes. Inspection d'un électricien agréé requise.",
            type: "SIGNALEMENT",
            priorite: "URGENTE",
            status: "A_FAIRE",
            echeance: dateFuture(3),
            assigneId: technicien.id,
            companyId: comp5.id,
            signalementId: null
        }
    })

    await prisma.tache.create({
        data: {
            titre: "Faire signer le DUERP — Institut Beauty Zen",
            description: "Le DUERP version 1 est en attente de signature par la cliente Caroline Morel.",
            type: "DUERP",
            priorite: "MOYENNE",
            status: "A_FAIRE",
            echeance: dateFuture(21),
            assigneId: auditeur2.id,
            companyId: comp4.id
        }
    })

    await prisma.tache.create({
        data: {
            titre: "Traiter signalement — prises électriques restaurant",
            description: "Signalement de prises défectueuses en cuisine. Intervention électricien à coordonner.",
            type: "SIGNALEMENT",
            priorite: "URGENTE",
            status: "EN_COURS",
            echeance: dateFuture(2),
            assigneId: technicien.id,
            companyId: comp2.id,
            signalementId: sig2.id
        }
    })

    await prisma.tache.create({
        data: {
            titre: "Planifier audit annuel — Boulangerie du Lagon",
            description: "DUERP expiré (> 12 mois). Audit de suivi à planifier et réaliser.",
            type: "AUDIT",
            priorite: "HAUTE",
            status: "A_FAIRE",
            echeance: dateFuture(10),
            assigneId: auditeur2.id,
            companyId: comp3.id
        }
    })

    console.log(`  ✅ 6 tâches créées`)

    // ================================================================
    // 12. AFFICHAGES OBLIGATOIRES
    // ================================================================
    console.log("\n📌 Affichages obligatoires (Fiche 1 par entreprise)...")

    const companiesWithAff = [comp1, comp2, comp3, comp4, comp5]
    for (const c of companiesWithAff) {
        // Vérifie qu'on ne duplique pas
        const existing = await prisma.affichage.count({ where: { companyId: c.id } })
        if (existing === 0) {
            await prisma.affichage.createMany({
                data: [
                    {
                        companyId: c.id,
                        type: "INSPECTION_TRAVAIL",
                        category: "FICHE_1",
                        title: "Inspection du travail",
                        description: "Coordonnées de l'inspecteur du travail compétent",
                        dynamicData: JSON.stringify({ telephone: "+262 262 20 20 20", adresse: "DIECCTE Réunion, 5 rue Marcel Hoarau, 97404 Saint-Denis" })
                    },
                    {
                        companyId: c.id,
                        type: "MEDECINE_TRAVAIL",
                        category: "FICHE_1",
                        title: "Service de Santé au Travail",
                        description: "Centre de médecine du travail",
                        dynamicData: JSON.stringify({ telephone: "+262 262 21 00 00", adresse: "SSTI Réunion, 20 allée des Lataniers, 97400 Saint-Denis" })
                    },
                    {
                        companyId: c.id,
                        type: "REFERENT_HARCELEMENT",
                        category: "FICHE_1",
                        title: "Référent harcèlement sexuel",
                        description: "Personne désignée pour lutter contre le harcèlement",
                        dynamicData: JSON.stringify({ nom: "À désigner", email: "" })
                    },
                    {
                        companyId: c.id,
                        type: "URGENCES",
                        category: "FICHE_1",
                        title: "Numéros d'urgence",
                        description: "Pompiers, SAMU, Police",
                        isLocked: true,
                        dynamicData: JSON.stringify({ samu: "15", pompiers: "18", police: "17", urgences: "112" })
                    }
                ]
            })
        }
    }
    console.log(`  ✅ Affichages Fiche 1 créés pour 5 entreprises`)

    // ================================================================
    // RÉCAPITULATIF
    // ================================================================
    console.log("\n" + "=".repeat(60))
    console.log("🎉 SEED DE DÉMONSTRATION TERMINÉ AVEC SUCCÈS !")
    console.log("=".repeat(60))
    console.log("\n📋 COMPTES DE CONNEXION (mot de passe : Demo1234!)")
    console.log("\n  🔑 ADMIN")
    console.log("     admin@icpp.re")
    console.log("\n  🔍 AUDITEURS")
    console.log("     auditeur1@icpp.re  → Marc Lefevre  (3 clients assignés)")
    console.log("     auditeur2@icpp.re  → Sophie Moreau (2 clients assignés)")
    console.log("\n  💼 COMMERCIAL")
    console.log("     commercial@icpp.re → Julie Bernard  (5 clients)")
    console.log("\n  🔧 TECHNICIEN")
    console.log("     technicien@icpp.re → Karim Ould    (2 tâches assignées)")
    console.log("\n  🏪 CLIENTS")
    console.log("     amina@belle-allure.re    → Salon Belle Allure  (DUERP signé, plan PRO)")
    console.log("     jl.payet@lecreole.re     → Restaurant Le Créole (DUERP brouillon, plan PRO)")
    console.log("     patricia@boulangerie.re  → Boulangerie du Lagon (DUERP expiré, plan ESSENTIEL)")
    console.log("     zenbeauty@beauty.re      → Institut Beauty Zen  (DUERP en attente, plan PREMIUM)")
    console.log("     garage@reunionauto.re    → Garage Réunion Auto  (Pas de DUERP, plan ESSENTIEL)")
    console.log("\n" + "=".repeat(60) + "\n")
}

main()
    .catch(e => { console.error("❌ Seed échoué:", e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })
