"use client"

import { useState, useEffect, useTransition, ReactNode, useCallback } from "react"
import { Search, Bell, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getAdminNotifications, markNotificationRead } from "@/server/actions/admin"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
    title: string
    subtitle?: string
    children?: ReactNode
}

interface Notification {
    id: string
    title: string
    message: string
    type: string
    read: boolean
    actionUrl: string | null
    createdAt: Date
}

export function AdminHeader({ title, subtitle, children }: AdminHeaderProps) {
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isPending, startTransition] = useTransition()

    const loadNotifications = useCallback(() => {
        startTransition(async () => {
            const data = await getAdminNotifications()
            setNotifications(data)
        })
    }, [])

    useEffect(() => {
        // Charger las notifications au montage
        loadNotifications()
        // Rafraichissement toutes les 60 secondes
        const interval = setInterval(loadNotifications, 60_000)
        return () => clearInterval(interval)
    }, [loadNotifications])

    const unreadCount = notifications.filter(n => !n.read).length

    async function handleMarkAsRead(id: string, actionUrl?: string | null) {
        await markNotificationRead(id)
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
        if (actionUrl) {
            router.push(actionUrl)
        }
    }

    async function handleMarkAllAsRead() {
        for (const n of notifications.filter(n => !n.read)) {
            await markNotificationRead(n.id)
        }
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    function formatTime(date: Date) {
        const now = new Date()
        const diff = now.getTime() - new Date(date).getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (days > 0) return `Il y a ${days} jour${days > 1 ? "s" : ""}`
        if (hours > 0) return `Il y a ${hours}h`
        return "À l'instant"
    }

    return (
        <div className="border-b border-slate-300 bg-white px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-3">
                {/* Title Section */}
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{title}</h1>
                    {subtitle && (
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 hidden sm:block">{subtitle}</p>
                    )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    {/* Search - Hidden on small screens */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-56 bg-slate-50 pl-10 border-slate-200"
                        />
                    </div>

                    {children}

                    {/* Notifications */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-5 w-5 text-slate-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end">
                            <div className="border-b p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Notifications</h3>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <span className="text-xs text-slate-500">
                                                {unreadCount} non {unreadCount === 1 ? "lue" : "lues"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-slate-500">
                                        Aucune notification
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleMarkAsRead(notification.id, notification.actionUrl)}
                                            className={cn(
                                                "border-b p-4 hover:bg-slate-50 cursor-pointer transition-colors",
                                                !notification.read && "bg-blue-50/50"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                {!notification.read && (
                                                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-1">
                                                        <p className={cn("text-sm font-medium text-slate-900", !notification.read && "font-semibold")}>
                                                            {notification.title}
                                                        </p>
                                                        {notification.actionUrl && (
                                                            <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <div className="border-t p-2">
                                    <Button
                                        variant="ghost"
                                        className="w-full text-sm text-blue-600 hover:text-blue-700"
                                        onClick={handleMarkAllAsRead}
                                    >
                                        Tout marquer comme lu
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ")
}
