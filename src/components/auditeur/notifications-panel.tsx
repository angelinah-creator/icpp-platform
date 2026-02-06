"use client"

import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"


interface Notification {
    id: number
    title: string
    message: string
    time: string
    read: boolean
    icon?: React.ReactNode
}

interface NotificationsPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
    const notifications: Notification[] = [
        {
            id: 1,
            title: "Nouveau document DUERP",
            message: "Document DUERP soumis avec succès",
            time: "Il y a 2h",
            read: false
        },
        {
            id: 2,
            title: "Paiement reçu",
            message: "Paiement de 150€ confirmé",
            time: "Il y a 3h",
            read: false
        },
        {
            id: 3,
            title: "DUERP signé",
            message: "Le DUERP a été signé électroniquement...",
            time: "Il y a 5h",
            read: false
        },
        {
            id: 4,
            title: "Paiement reçu",
            message: "Paiement de 300€ confirmé",
            time: "Hier",
            read: true
        },
    ]

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/20 z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                            <Check className="h-3 w-3 mr-1" />
                            Tout marquer lu
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50/50" : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                        {notification.title}
                                    </h3>
                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-600 mb-2">{notification.message}</p>
                                <p className="text-xs text-slate-400">{notification.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
