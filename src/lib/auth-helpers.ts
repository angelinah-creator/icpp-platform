import { auth } from "@/lib/auth"
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
 * Require specific role - redirects to unauthorized if role doesn't match
 */
export async function requireRole(allowedRoles: string[]) {
    const user = await requireAuth()

    if (!allowedRoles.includes(user.role)) {
        redirect("/unauthorized")
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
