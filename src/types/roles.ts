// Role enum for type safety
export type Role = "CLIENT" | "ADMIN" | "AUDITOR" | "COMMERCIAL" | "TECHNICIEN"

export const ROLES: readonly Role[] = ["CLIENT", "ADMIN", "AUDITOR", "COMMERCIAL", "TECHNICIEN"] as const

// Default redirects for each role
export const ROLE_REDIRECTS: Record<Role, string> = {
    CLIENT: "/dashboard",
    ADMIN: "/admin",
    AUDITOR: "/auditeur",
    COMMERCIAL: "/auditeur",
    TECHNICIEN: "/technicien"
}
