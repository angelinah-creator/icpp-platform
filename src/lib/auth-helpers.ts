import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasSubscriptionAccess } from "@/lib/subscription-access"
import { redirect } from "next/navigation"

/**
 * Get the current authenticated user session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
    const session = await auth()
    return session?.user ?? null
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    return user
}

/**
 * Require specific role - redirects to appropriate dashboard if role doesn't match
 * IMPORTANT: Does NOT redirect to /dashboard to avoid infinite loops
 */
export async function requireRole(allowedRoles: string[]) {
    const user = await requireAuth()

    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user's actual role
        if (user.role === "ADMIN") {
            redirect("/admin")
        } else if (user.role === "AUDITOR" || user.role === "COMMERCIAL") {
            redirect("/auditeur")
        } else if (user.role === "TECHNICIEN") {
            redirect("/technicien")
        } else if (user.role === "CLIENT") {
            // Only redirect to dashboard if we are NOT already checking for CLIENT role
            // This prevents infinite loop on /dashboard since /dashboard calls requireRole(["CLIENT"])
            if (!allowedRoles.includes("CLIENT")) {
                redirect("/dashboard")
            }
        } else {
            // Unknown role - redirect to login
            redirect("/login")
        }
    }

    return user
}

/**
 * Require an authenticated client with an active subscription.
 * If the user has no active access, always redirect to onboarding/payment page.
 */
export async function requireActiveClientSubscription() {
    const user = await requireRole(["CLIENT"])

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            company: {
                select: {
                    subscription: {
                        select: {
                            status: true,
                        },
                    },
                },
            },
        },
    })

    if (!hasSubscriptionAccess(dbUser?.company?.subscription?.status)) {
        redirect("/abonnement")
    }

    return user
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.role === "ADMIN"
}

/**
 * Check if user is client
 */
export async function isClient() {
    const user = await getCurrentUser()
    return user?.role === "CLIENT"
}

/**
 * Check if user is auditor
 */
export async function isAuditor() {
    const user = await getCurrentUser()
    return user?.role === "AUDITOR" || user?.role === "COMMERCIAL"
}
