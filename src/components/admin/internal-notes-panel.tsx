"use client"

import { useState, useTransition } from "react"
import { MessageSquare, Plus, Trash2, Pencil, Pin, PinOff, X, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    createInternalNote,
    updateInternalNote,
    deleteInternalNote,
    pinInternalNote,
} from "@/server/actions/admin"

// ─── Types ────────────────────────────────────────────────────────────────────

interface NoteAuthor {
    id: string
    name: string
    role: string
}

export interface InternalNote {
    id: string
    content: string
    category: string
    isPinned: boolean
    createdAt: Date | string
    updatedAt: Date | string
    authorId: string
    duerpId: string | null
    author: NoteAuthor
}

interface InternalNotesPanelProps {
    companyId: string
    duerpId?: string | null
    initialNotes: InternalNote[]
    currentUserId: string
    currentUserRole: string
    /** If true, only show notes linked to the given duerpId */
    duerpContext?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
    GENERAL: "Général",
    PAIEMENT: "Paiement",
    JURIDIQUE: "Juridique",
    TECHNIQUE: "Technique",
}

const CATEGORY_COLORS: Record<string, string> = {
    GENERAL: "bg-slate-100 text-slate-700",
    PAIEMENT: "bg-green-100 text-green-700",
    JURIDIQUE: "bg-purple-100 text-purple-700",
    TECHNIQUE: "bg-blue-100 text-blue-700",
}

function formatDate(d: Date | string) {
    return new Date(d).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InternalNotesPanel({
    companyId,
    duerpId,
    initialNotes,
    currentUserId,
    currentUserRole,
    duerpContext = false,
}: InternalNotesPanelProps) {
    const [notes, setNotes] = useState<InternalNote[]>(initialNotes)
    const [isPending, startTransition] = useTransition()

    // Form state
    const [showForm, setShowForm] = useState(false)
    const [newContent, setNewContent] = useState("")
    const [newCategory, setNewCategory] = useState("GENERAL")
    const [formError, setFormError] = useState("")

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState("")

    const isAdmin = currentUserRole === "ADMIN"

    // ── Add note ────────────────────────────────────────────────────────────
    function handleAdd() {
        if (!newContent.trim()) {
            setFormError("Le contenu ne peut pas être vide")
            return
        }
        setFormError("")
        startTransition(async () => {
            const res = await createInternalNote({
                companyId,
                duerpId: duerpId ?? null,
                content: newContent,
                category: newCategory,
            })
            if ("error" in res) {
                setFormError(res.error ?? "Erreur inconnue")
            } else if (res.note) {
                setNotes(prev => [res.note as InternalNote, ...prev])
                setNewContent("")
                setNewCategory("GENERAL")
                setShowForm(false)
            }
        })
    }

    // ── Save edit ───────────────────────────────────────────────────────────
    function handleSaveEdit(id: string) {
        if (!editContent.trim()) return
        startTransition(async () => {
            const res = await updateInternalNote(id, editContent)
            if (!("error" in res)) {
                setNotes(prev =>
                    prev.map(n => n.id === id ? { ...n, content: editContent, updatedAt: new Date() } : n)
                )
            }
            setEditingId(null)
        })
    }

    // ── Delete ──────────────────────────────────────────────────────────────
    function handleDelete(id: string) {
        if (!confirm("Supprimer cette note ?")) return
        startTransition(async () => {
            const res = await deleteInternalNote(id)
            if (!("error" in res)) {
                setNotes(prev => prev.filter(n => n.id !== id))
            }
        })
    }

    // ── Pin toggle ──────────────────────────────────────────────────────────
    function handlePin(id: string, current: boolean) {
        startTransition(async () => {
            const res = await pinInternalNote(id, !current)
            if (!("error" in res)) {
                setNotes(prev =>
                    [...prev.map(n => n.id === id ? { ...n, isPinned: !current } : n)]
                        .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
                )
            }
        })
    }

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <Card id="notes-internes">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="h-5 w-5 text-amber-500" />
                        Notes internes
                        {notes.length > 0 && (
                            <span className="ml-1 text-xs font-normal text-slate-400">({notes.length})</span>
                        )}
                    </CardTitle>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowForm(v => !v)}
                        disabled={isPending}
                    >
                        {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                        {showForm ? "Annuler" : "Ajouter"}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* ── New note form ── */}
                {showForm && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                        <textarea
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                            rows={3}
                            placeholder="Rédigez votre note interne..."
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                            autoFocus
                        />
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select
                                    className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                    value={newCategory}
                                    onChange={e => setNewCategory(e.target.value)}
                                >
                                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                            </div>
                            {formError && <p className="text-xs text-red-500 flex-1">{formError}</p>}
                            <Button
                                size="sm"
                                className="ml-auto bg-amber-500 hover:bg-amber-600 text-white"
                                onClick={handleAdd}
                                disabled={isPending}
                            >
                                {isPending ? "Envoi..." : "Ajouter la note"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Notes list ── */}
                {notes.length === 0 && !showForm && (
                    <p className="text-center text-sm text-slate-400 py-6">
                        Aucune note interne pour l'instant
                    </p>
                )}

                <div className="space-y-3">
                    {notes.map(note => {
                        const canEdit = note.authorId === currentUserId || isAdmin
                        const isEditing = editingId === note.id

                        return (
                            <div
                                key={note.id}
                                className={`rounded-xl border p-4 text-sm transition-colors ${note.isPinned
                                    ? "border-amber-200 bg-amber-50"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                                    }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* Avatar */}
                                        <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600 flex-shrink-0">
                                            {getInitials(note.author.name)}
                                        </div>
                                        <span className="font-medium text-slate-800">{note.author.name}</span>
                                        <span className="text-slate-400 text-xs">{formatDate(note.createdAt)}</span>
                                        {note.updatedAt !== note.createdAt && (
                                            <span className="text-slate-300 text-xs italic">(modifié)</span>
                                        )}
                                        <Badge className={`text-[10px] px-2 py-0 ${CATEGORY_COLORS[note.category] ?? CATEGORY_COLORS.GENERAL}`}>
                                            {CATEGORY_LABELS[note.category] ?? note.category}
                                        </Badge>
                                        {note.isPinned && (
                                            <Badge className="text-[10px] px-2 py-0 bg-amber-100 text-amber-700">
                                                📌 Épinglée
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {canEdit && (
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handlePin(note.id, note.isPinned)}
                                                    className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors"
                                                    title={note.isPinned ? "Désépingler" : "Épingler"}
                                                    disabled={isPending}
                                                >
                                                    {note.isPinned
                                                        ? <PinOff className="h-3.5 w-3.5" />
                                                        : <Pin className="h-3.5 w-3.5" />}
                                                </button>
                                            )}
                                            {!isEditing && (
                                                <button
                                                    onClick={() => { setEditingId(note.id); setEditContent(note.content) }}
                                                    className="p-1 rounded text-slate-400 hover:text-blue-500 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                                                title="Supprimer"
                                                disabled={isPending}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Body */}
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <textarea
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                                            rows={3}
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                <X className="h-3.5 w-3.5 mr-1" /> Annuler
                                            </Button>
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => handleSaveEdit(note.id)} disabled={isPending}>
                                                <Check className="h-3.5 w-3.5 mr-1" /> Enregistrer
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
