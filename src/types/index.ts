// Types pour ICPP Platform - Alignés avec le schéma Prisma

// ============================================
// MÉTIERS & ACTIVITÉS
// ============================================

export type MetierCode =
    | "COIFFURE"
    | "RESTAURATION"
    | "BOULANGERIE"
    | "COMMERCE"
    | "ESTHETIQUE"
    | "GARAGE"
    | "BATIMENT"
    | "NETTOYAGE"
    | "HOTELLERIE"
    | "BUREAU"

export interface MetierICPP {
    id: string
    code: MetierCode
    nom: string
    description: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

// ============================================
// RISQUES
// ============================================

export type RiskCategoryCode =
    | "PHYSIQUE"
    | "CHIMIQUE"
    | "BIOLOGIQUE"
    | "ERGONOMIQUE"
    | "PSYCHOSOCIAL"
    | "MECANIQUE"
    | "ELECTRIQUE"
    | "INCENDIE"

export type RiskGravite = "FAIBLE" | "MOYEN" | "ELEVE"

export interface RisqueCategorie {
    id: string
    code: RiskCategoryCode
    nom: string
    description?: string
    ordre: number
    createdAt: Date
    updatedAt: Date
}

export interface RisqueMetier {
    id: string
    categorieCode: RiskCategoryCode
    metierCode: MetierCode
    nom: string
    description: string
    gravite: RiskGravite
    frequence: number // 1-5
    mesuresSuggerees: string[] // Parsed from JSON
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface EvaluationRisque {
    id: string
    duerpId: string
    risqueId: string
    uniteTravail: string
    frequence: number // 1-5
    gravite: number // 1-5
    niveauRisque: number // F x G
    mesuresAppliquees: string[] // Parsed from JSON
    observations?: string
    createdAt: Date
    updatedAt: Date
}

// ============================================
// ENTREPRISE & UTILISATEURS
// ============================================

export type UserRole = "CLIENT" | "ADMIN" | "AUDITOR" | "COMMERCIAL"

export interface User {
    id: string
    email: string
    emailVerified?: Date
    name: string
    role: UserRole
    image?: string
    phone?: string
    companyId?: string
    createdAt: Date
    updatedAt: Date
}

export interface Company {
    id: string
    name: string
    siret?: string
    metierCode?: MetierCode
    employeeCount: number
    address: string
    postalCode?: string
    city: string
    phone?: string
    email?: string
    openingHours?: string // JSON
    createdAt: Date
    updatedAt: Date
}

// ============================================
// DUERP
// ============================================

export type DuerpStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"

export interface DuerpDocument {
    id: string
    version: number
    status: DuerpStatus
    companyId: string
    signedAt?: Date
    signedBy?: string
    signatureData?: string // JSON
    pdfUrl?: string
    pdfGeneratedAt?: Date
    lastUpdateReason?: string
    nextReviewDate?: Date
    createdAt: Date
    updatedAt: Date
}

// ============================================
// ABONNEMENTS & PLANS
// ============================================

export type PlanCode = "ESSENTIEL" | "PRO" | "PREMIUM"
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "SUSPENDED"

export interface PlanTarifaire {
    id: string
    code: PlanCode
    nom: string
    description: string
    prixMensuel: number // En centimes
    fraisSetup: number // En centimes
    fonctionnalites: string[] // Parsed from JSON
    isActive: boolean
    ordre: number
    createdAt: Date
    updatedAt: Date
}

export interface Subscription {
    id: string
    companyId: string
    planCode: PlanCode
    status: SubscriptionStatus
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    stripePriceId?: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    canceledAt?: Date
    trialStart?: Date
    trialEnd?: Date
    promoCode?: string
    setupFeePaid: boolean
    setupFeePaidAt?: Date
    createdAt: Date
    updatedAt: Date
}

// ============================================
// CONTRATS & CGV
// ============================================

export type ContratStatus = "ACTIF" | "RESILIE" | "SUSPENDU"

export interface CGVVersion {
    id: string
    version: string
    contenu: string
    datePublication: Date
    isActive: boolean
    createdAt: Date
}

export interface CGVAcceptation {
    id: string
    userId: string
    cgvVersion: string
    acceptedAt: Date
    ipAddress: string
    userAgent?: string
}

export interface Contrat {
    id: string
    numeroContrat: string
    companyId: string
    cgvVersion: string
    dateDebut: Date
    dateFin?: Date
    signedAt?: Date
    signatureData?: string // JSON
    pdfUrl?: string
    pdfGeneratedAt?: Date
    status: ContratStatus
    createdAt: Date
    updatedAt: Date
}

// ============================================
// AFFICHAGES
// ============================================

export type AffichageType =
    | "INSPECTION_TRAVAIL"
    | "MEDECINE_TRAVAIL"
    | "HARCELEMENT"
    | "EGALITE_PROFESSIONNELLE"
    | "CONSIGNES_INCENDIE"
    | "INTERDICTIONS_FUMER"
    | "OTHER"

export interface Affichage {
    id: string
    type: AffichageType
    title: string
    description?: string
    companyId: string
    fileUrl?: string
    downloaded: boolean
    printed: boolean
    createdAt: Date
    updatedAt: Date
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType =
    | "DUERP_ANNUAL_REMINDER"
    | "DUERP_UPDATE_NEEDED"
    | "SUBSCRIPTION_RENEWAL"
    | "SUBSCRIPTION_FAILED"
    | "DOCUMENT_SIGNED"
    | "OTHER"

export interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string
    userId?: string
    read: boolean
    readAt?: Date
    actionUrl?: string
    createdAt: Date
}

// ============================================
// AUDIT
// ============================================

export type AuditAction =
    | "USER_LOGIN"
    | "USER_LOGOUT"
    | "DUERP_CREATED"
    | "DUERP_UPDATED"
    | "DUERP_SIGNED"
    | "DUERP_DOWNLOADED"
    | "SUBSCRIPTION_CREATED"
    | "SUBSCRIPTION_UPDATED"
    | "SUBSCRIPTION_CANCELED"
    | "COMPANY_UPDATED"
    | "OTHER"

export interface AuditLog {
    id: string
    action: AuditAction
    description?: string
    userId?: string
    metadata?: string // JSON
    ipAddress?: string
    userAgent?: string
    createdAt: Date
}
