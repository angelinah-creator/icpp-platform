"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { redirect } from "next/navigation"

// Validation schemas
const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

const registerSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
    siret: z.string().optional(),
    metierCode: z.string().optional(),
})

export async function loginAction(credentials: { email: string; password: string }) {
    const { email, password } = credentials

    const validation = loginSchema.safeParse({ email, password })

    if (!validation.success) {
        return {
            error: validation.error.issues[0].message,
        }
    }

    try {
        // Sign in without automatic redirect
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            return { error: "Email ou mot de passe incorrect" }
        }

        // Get user from database to determine role
        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true },
        })

        // Redirect based on role - 3 separate spaces
        if (user?.role === "ADMIN") {
            redirect("/admin")
        } else if (user?.role === "AUDITOR" || user?.role === "COMMERCIAL") {
            redirect("/auditeur")
        } else {
            redirect("/dashboard")
        }
    } catch (error) {
        // Check if this is a redirect (Next.js throws NEXT_REDIRECT as an error)
        if (error && typeof error === 'object' && 'digest' in error) {
            throw error // Re-throw redirect errors
        }

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email ou mot de passe incorrect" }
                default:
                    return { error: "Une erreur est survenue" }
            }
        }
        throw error
    }
}

export async function registerAction(formData: FormData) {
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        companyName: formData.get("companyName") as string,
        siret: formData.get("siret") as string | undefined,
        metierCode: formData.get("metierCode") as string | undefined,
    }

    const validation = registerSchema.safeParse(data)

    if (!validation.success) {
        return {
            error: validation.error.issues[0].message,
        }
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existingUser) {
            return { error: "Un compte existe déjà avec cet email" }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10)

        // Create company and user in transaction
        const result = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: data.companyName,
                    siret: data.siret,
                    metierCode: data.metierCode,
                    address: "", // Will be filled in onboarding
                    city: "",
                    employeeCount: 1,
                },
            })

            const user = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: "CLIENT",
                    companyId: company.id,
                    emailVerified: new Date(), // Auto-verify for now
                },
            })

            return { company, user }
        })

        // Auto-generate 4 affichages obligatoires (outside transaction for non-critical)
        const { seedAffichagesForCompany } = await import("@/lib/seed-affichages")
        await seedAffichagesForCompany(result.company.id)

        // Auto sign in after registration
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirectTo: "/onboarding",
        })

        return { success: true }
    } catch (error) {
        console.error("Registration error:", error)
        return { error: "Une erreur est survenue lors de l'inscription" }
    }
}

// Password reset actions
export async function requestPasswordResetAction(email: string) {
    try {
        // Validate email
        const emailSchema = z.string().email()
        const validation = emailSchema.safeParse(email)

        if (!validation.success) {
            return { error: "Email invalide" }
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // For security, always return success even if user doesn't exist
        // to prevent email enumeration
        if (!user) {
            return { success: true }
        }

        // Generate reset token
        const token = crypto.randomUUID()
        const expires = new Date(Date.now() + 3600000) // 1 hour from now

        // Delete any existing tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { identifier: email },
        })

        // Create new token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        })

        // Send password reset email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

        // Import dynamically to avoid issues if RESEND_API_KEY is not set
        const { sendPasswordResetEmail } = await import("@/lib/email")
        const emailResult = await sendPasswordResetEmail({
            to: email,
            resetUrl,
            userName: user.name,
        })

        if (!emailResult.success) {
            console.error("Failed to send password reset email:", emailResult.error)
            // Still return success to prevent email enumeration
        }

        return { success: true }

    } catch (error) {
        console.error("Password reset request error:", error)
        return { error: "Une erreur est survenue" }
    }
}

export async function resetPasswordAction(token: string, newPassword: string) {
    try {
        // Validate inputs
        const passwordSchema = z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
        const validation = passwordSchema.safeParse(newPassword)

        if (!validation.success) {
            return { error: validation.error.issues[0].message }
        }

        // Find valid token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        })

        if (!verificationToken) {
            return { error: "Lien de réinitialisation invalide ou expiré" }
        }

        // Check if token is expired
        if (verificationToken.expires < new Date()) {
            // Delete expired token
            await prisma.verificationToken.delete({
                where: { token },
            })
            return { error: "Le lien de réinitialisation a expiré" }
        }

        // Find user by email (identifier)
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier },
        })

        if (!user) {
            return { error: "Utilisateur introuvable" }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update user password and delete token
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            }),
            prisma.verificationToken.delete({
                where: { token },
            }),
        ])

        return { success: true }
    } catch (error) {
        console.error("Password reset error:", error)
        return { error: "Une erreur est survenue" }
    }
}

export async function logoutAction() {
    await signOut({ redirectTo: "/login" })
}
