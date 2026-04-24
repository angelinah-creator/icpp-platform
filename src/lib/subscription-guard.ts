import { prisma } from "./prisma"

export async function getSubscriptionStatus(companyId: string) {
    const subscription = await prisma.subscription.findUnique({
        where: { companyId },
        include: { plan: true }
    })

    if (!subscription) {
        return {
            isActive: false,
            plan: null,
            status: "NONE"
        }
    }

    const isActive = subscription.status === "ACTIVE"

    return {
        isActive,
        plan: subscription.plan,
        status: subscription.status
    }
}

export async function hasFeature(companyId: string, featureName: string) {
    const { isActive, plan } = await getSubscriptionStatus(companyId)

    if (!isActive || !plan) return false

    const features = (plan.fonctionnalites as unknown as string[]) || []
    return features.includes(featureName)
}
