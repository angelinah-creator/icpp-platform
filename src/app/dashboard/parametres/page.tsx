import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ParametresClient from "./parametres-client"

async function getProfileData() {
    const session = await auth()
    if (!session?.user?.email) return null

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            company: {
                include: {
                    subscription: true,
                    audits: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        select: { proposedPrice: true }
                    }
                }
            }
        }
    })

    if (!user) return null

    return {
        userName: user.name || "",
        userEmail: user.email || "",
        userPhone: user.phone,
        companyName: user.company?.name || "",
        companySiret: user.company?.siret || null,
        companyAddress: user.company?.address || "",
        companyCity: user.company?.city || "",
        planName: user.company?.subscription?.planCode || null,
        planStatus: user.company?.subscription?.status || null,
        customPrice: user.company?.subscription?.customPrice || null,
        proposedPrice: user.company?.audits?.[0]?.proposedPrice || null,
        stripeCustomerId: user.company?.subscription?.stripeCustomerId || null,
    }
}

export default async function ParametresPage() {
    const profile = await getProfileData()
    if (!profile) redirect("/login")

    return <ParametresClient profile={profile} />
}
