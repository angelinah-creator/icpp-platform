"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"

interface SignaturePadProps {
    value: string | null
    onChange: (dataUrl: string | null) => void
    height?: number
}

export function SignaturePad({ value, onChange, height = 220 }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [drawing, setDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        const rect = canvas.getBoundingClientRect()
        canvas.width = Math.floor(rect.width * ratio)
        canvas.height = Math.floor(rect.height * ratio)
        context.scale(ratio, ratio)
        context.lineCap = "round"
        context.lineJoin = "round"
        context.lineWidth = 2
        context.strokeStyle = "#0f172a"

        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, rect.width, rect.height)

        if (value) {
            const image = new Image()
            image.onload = () => {
                context.drawImage(image, 0, 0, rect.width, rect.height)
            }
            image.src = value
        }
    }, [value])

    function getPosition(event: PointerEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current
        if (!canvas) return null
        const rect = canvas.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
    }

    function start(event: PointerEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")
        const point = getPosition(event)
        if (!canvas || !context || !point) return

        setDrawing(true)
        context.beginPath()
        context.moveTo(point.x, point.y)
    }

    function move(event: PointerEvent<HTMLCanvasElement>) {
        if (!drawing) return
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")
        const point = getPosition(event)
        if (!canvas || !context || !point) return

        context.lineTo(point.x, point.y)
        context.stroke()
    }

    function end() {
        const canvas = canvasRef.current
        if (!canvas) return
        setDrawing(false)
        onChange(canvas.toDataURL("image/png"))
    }

    function clear() {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d")
        if (!canvas || !context) return

        const rect = canvas.getBoundingClientRect()
        context.clearRect(0, 0, rect.width, rect.height)
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, rect.width, rect.height)
        onChange(null)
    }

    return (
        <div className="space-y-3">
            <canvas
                ref={canvasRef}
                style={{ height, touchAction: "none" }}
                className="w-full rounded-xl border border-slate-300 bg-white"
                onPointerDown={start}
                onPointerMove={move}
                onPointerUp={end}
                onPointerLeave={end}
            />
            <button
                type="button"
                onClick={clear}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
                Effacer la signature
            </button>
        </div>
    )
}
