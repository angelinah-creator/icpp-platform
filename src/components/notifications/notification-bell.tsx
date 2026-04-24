"use client"

import { useState, useEffect, useTransition } from "react"
import { Bell, Check, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    getMyNotifications,
    getMyUnreadCount,
    markMyNotificationRead,
    markAllMyNotificationsRead,
    type NotificationItem,
} from "@/server/actions/notifications"
import { useRouter } from "next/navigation"

interface NotificationBellProps {
    /** Optionnel : initialiser avec des notifications déjà chargées (SSR) */
    initialNotifications?: NotificationItem[]
    initialUnreadCount?: number
}

function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `Il y a ${days} jour${days > 1 ? "s" : ""}`
    if (hours > 0) return `Il y a ${hours}h`
    if (minutes > 0) return `Il y a ${minutes} min`
    return "À l'instant"
}

const typeColors: Record<string, string> = {
    SIGNALEMENT_RECU: "bg-red-100 text-red-600",
    NOUVEAU_SIGNALEMENT: "bg-red-100 text-red-600",
    TACHE_ASSIGNEE: "bg-blue-100 text-blue-600",
    AUDIT_RAPPEL: "bg-orange-100 text-orange-600",
    AUDIT_PLANIFIE: "bg-orange-100 text-orange-600",
    AUDIT_COMPLETE: "bg-green-100 text-green-600",
    DUERP_SIGNE: "bg-green-100 text-green-600",
    DUERP_DISPONIBLE: "bg-green-100 text-green-600",
    DUERP_EN_COURS: "bg-blue-100 text-blue-600",
    CASH_PAYMENT_REQUESTED: "bg-amber-100 text-amber-600",
    CASH_PAYMENT_CONFIRMED: "bg-green-100 text-green-600",
    CASH_PAYMENT_REJECTED: "bg-rose-100 text-rose-600",
    STRIPE_PAYMENT_CONFIRMED: "bg-blue-100 text-blue-600",
    PAYMENT_ADMIN_ALERT: "bg-indigo-100 text-indigo-600",
    RAPPEL_ACTION: "bg-amber-100 text-amber-600",
    NOUVEAU_CLIENT: "bg-purple-100 text-purple-600",
    BIENVENUE: "bg-indigo-100 text-indigo-600",
}

export function NotificationBell({
    initialNotifications,
    initialUnreadCount,
}: NotificationBellProps) {
    const router = useRouter()
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications ?? [])
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount ?? 0)
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        // Charger les notifications depuis le serveur
        startTransition(async () => {
            const [data, count] = await Promise.all([
                getMyNotifications(),
                getMyUnreadCount(),
            ])
            setNotifications(data)
            setUnreadCount(count)
        })
    }, [])

    async function handleMarkAsRead(id: string) {
        await markMyNotificationRead(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    async function handleMarkAllAsRead() {
        await markAllMyNotificationsRead()
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }

    function handleNotificationClick(notification: NotificationItem) {
        if (!notification.read) {
            handleMarkAsRead(notification.id)
        }
        if (notification.actionUrl) {
            setOpen(false)
            router.push(notification.actionUrl)
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <p className="text-xs text-slate-500 mt-0.5">
                                {unreadCount} non {unreadCount === 1 ? "lue" : "lues"}
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2"
                            onClick={handleMarkAllAsRead}
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Tout lire
                        </Button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {isPending && notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-400">
                            Chargement...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-6 text-center">
                            <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Aucune notification</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50/40" : ""}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Dot indicator */}
                                    <div className="mt-1 flex-shrink-0">
                                        {!notification.read ? (
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-transparent" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                            <p className={`text-sm font-medium text-slate-900 leading-tight ${!notification.read ? "font-semibold" : ""}`}>
                                                {notification.title}
                                            </p>
                                            {notification.actionUrl && (
                                                <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[notification.type] ?? "bg-slate-100 text-slate-600"}`}>
                                                {notification.type.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {formatRelativeTime(notification.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
