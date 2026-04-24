import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const companyName = "Salon Belle Allure";
    
    // Find the company
    const company = await prisma.company.findFirst({
        where: { name: { contains: companyName, mode: 'insensitive' } },
        include: { subscription: true }
    });

    if (!company) {
        console.error(`Company '${companyName}' not found.`);
        return;
    }

    console.log(`Found company: ${company.name} (ID: ${company.id})`);

    const now = new Date();
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(now.getFullYear() + 2);

    const subscriptionData = {
        status: "ACTIVE",
        planCode: company.subscription?.planCode || "PREMIUM",
        currentPeriodStart: now,
        currentPeriodEnd: twoYearsFromNow,
        setupFeePaid: true,
        setupFeePaidAt: now,
    };

    if (company.subscription) {
        const updated = await prisma.subscription.update({
            where: { id: company.subscription.id },
            data: subscriptionData
        });
        console.log(`Updated existing subscription to end on ${updated.currentPeriodEnd}`);
    } else {
        const created = await prisma.subscription.create({
            data: {
                companyId: company.id,
                ...subscriptionData
            }
        });
        console.log(`Created new subscription ending on ${created.currentPeriodEnd}`);
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
