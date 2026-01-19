"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

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

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validation = loginSchema.safeParse({ email, password })

    if (!validation.success) {
        return {
            error: validation.error.issues[0].message,
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        })

        return { success: true }
    } catch (error) {
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

export async function logoutAction() {
    await signOut({ redirectTo: "/" })
}
