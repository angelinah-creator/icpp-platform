/**
 * Common types for INCP Platform
 */

export type ComplianceStatus = "conforme" | "partiel" | "non-conforme"

export type SubscriptionPlan = "starter" | "pro" | "premium"

export type RiskSeverity = "low" | "medium" | "high"

export interface Company {
    id: string
    name: string
    siret?: string
    activity: string
    employeeCount: number
    address: string
    phone?: string
    email?: string
    createdAt: Date
    updatedAt: Date
}

export interface User {
    id: string
    email: string
    name: string
    role: "client" | "admin" | "auditor" | "commercial"
    companyId?: string
    createdAt: Date
    updatedAt: Date
}

export interface Risk {
    id: string
    name: string
    description: string
    severity: RiskSeverity
    category: string
}

export interface DuerpDocument {
    id: string
    companyId: string
    version: number
    status: "draft" | "active" | "archived"
    risks: string[] // Risk IDs
    preventiveMeasures: string[]
    signedAt?: Date
    signedBy?: string
    createdAt: Date
    updatedAt: Date
}

export interface Subscription {
    id: string
    companyId: string
    plan: SubscriptionPlan
    status: "active" | "canceled" | "past_due"
    currentPeriodStart: Date
    currentPeriodEnd: Date
    stripeSubscriptionId?: string
    createdAt: Date
    updatedAt: Date
}
