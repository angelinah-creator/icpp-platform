import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const companyName = "Salon Belle Allure";
    
    // Find the company
    const company = await prisma.company.findFirst({
        where: { name: { contains: companyName, mode: 'insensitive' } },
    });

    if (!company) {
        console.error(`Company '${companyName}' not found.`);
        return;
    }

    const auditor = await prisma.user.findFirst({
        where: { role: 'AUDITOR' }
    });

    if (!auditor) {
        console.error(`No auditor found to sign the DUERP.`);
        return;
    }

    const duerp = await prisma.duerpDocument.create({
        data: {
            companyId: company.id,
            version: 1,
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
            signedAt: new Date(),
            signedBy: auditor.id,
        }
    });

    console.log(`Successfully created a signed DUERP (ID: ${duerp.id}) for ${company.name}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
