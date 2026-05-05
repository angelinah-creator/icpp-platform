import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const companyName = "Salon Belle Allure";
    
    // Find the company
    const company = await prisma.company.findFirst({
        where: { name: { contains: companyName, mode: 'insensitive' } }
    });

    if (!company) {
        console.error(`Company '${companyName}' not found.`);
        return;
    }

    console.log(`Creating affichages for: ${company.name} (ID: ${company.id})`);

    const dynamicData = JSON.stringify({
        inspectionNom: "Mme. Sophie Durand",
        inspectionAdresse: "12 rue de la Paix, 75002 Paris",
        inspectionTelephone: "01 40 00 00 00",
        medecineNom: "SPST Centre Ile-de-France",
        medecineAdresse: "50 avenue des Champs-Élysées, 75008 Paris",
        medecineTelephone: "01 53 00 00 00",
        medecinMedecin: "Dr. Jean Dupont",
        horairesLundi: "09:00 - 18:00",
        horairesMardi: "09:00 - 18:00",
        horairesMercredi: "09:00 - 18:00",
        horairesJeudi: "09:00 - 18:00",
        horairesVendredi: "09:00 - 18:00",
        horairesSamedi: "Fermé",
        urgenceSamu: "15",
        urgencePolice: "17",
        urgencePompiers: "18",
        conventionIntitule: "Convention collective nationale de la coiffure",
        conventionIdcc: "2596"
    });

    const fiches = [
        {
            category: "FICHE_1",
            type: "COORDONNEES",
            title: "Fiche 1 — Coordonnées",
            description: "Coordonnées de l'inspection du travail, du service de santé au travail et des services d'urgence.",
            dynamicData,
            isLocked: false
        },
        {
            category: "FICHE_2",
            type: "DROITS_OBLIGATIONS",
            title: "Fiche 2 — Droits & Obligations",
            description: "Textes officiels sur l'égalité professionnelle, le harcèlement et la lutte contre les discriminations.",
            isLocked: true
        },
        {
            category: "FICHE_3",
            type: "INTERDICTION_FUMER",
            title: "Fiche 3 — Interdiction de fumer",
            description: "Rappel de la législation en vigueur concernant l'interdiction de fumer et de vapoter dans les lieux publics.",
            isLocked: true
        },
        {
            category: "FICHE_4",
            type: "SECURITE_INCENDIE",
            title: "Fiche 4 — Consignes de sécurité",
            description: "Consignes à suivre en cas d'incendie et numéros d'urgence.",
            isLocked: true
        }
    ];

    for (const fiche of fiches) {
        const existing = await prisma.affichage.findFirst({
            where: { companyId: company.id, category: fiche.category }
        });

        if (existing) {
            await prisma.affichage.update({
                where: { id: existing.id },
                data: fiche
            });
            console.log(`Updated ${fiche.title}`);
        } else {
            await prisma.affichage.create({
                data: {
                    ...fiche,
                    companyId: company.id
                }
            });
            console.log(`Created ${fiche.title}`);
        }
    }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
