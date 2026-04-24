"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth-helpers"

// ============================================================
// NOTIFICATIONS — Server Actions (Auditeur + Client)
// ============================================================

export interface NotificationItem {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    actionUrl: string | null
    createdAt: Date
}

/**
 * Récupère les notifications pour l'utilisateur connecté.
 * Pour admin (userId = null) → voir admin.ts
 * Pour auditeur/client → filtré par userId
 */
export async function getMyNotifications(take = 20): Promise<NotificationItem[]> {
    const user = await getCurrentUser()
    if (!user) return []

    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take
    })

    return notifications
}

/**
 * Compte les notifications non lues pour l'utilisateur connecté.
 */
export async function getMyUnreadCount(): Promise<number> {
    const user = await getCurrentUser()
    if (!user) return 0

    return prisma.notification.count({
        where: { userId: user.id, read: false }
    })
}

/**
 * Marque une notification comme lue.
 */
export async function markMyNotificationRead(id: string): Promise<void> {
    await prisma.notification.update({
        where: { id },
        data: { read: true, readAt: new Date() }
    })
    revalidatePath("/auditeur")
    revalidatePath("/dashboard")
}

/**
 * Marque toutes les notifications de l'utilisateur comme lues.
 */
export async function markAllMyNotificationsRead(): Promise<void> {
    const user = await getCurrentUser()
    if (!user) return

    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true, readAt: new Date() }
    })

    revalidatePath("/auditeur")
    revalidatePath("/dashboard")
}

/**
 * Crée une notification pour un utilisateur spécifique.
 */
export async function createNotification(params: {
    userId: string | null
    type: string
    title: string
    message: string
    actionUrl?: string
}): Promise<void> {
    await prisma.notification.create({
        data: {
            type: params.type,
            title: params.title,
            message: params.message,
            userId: params.userId,
            actionUrl: params.actionUrl ?? null,
        }
    })
}
