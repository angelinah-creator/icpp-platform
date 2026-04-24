import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params
        if (!code) return NextResponse.json([])

        const uts = await prisma.uniteTravail.findMany({
            where: { metierCode: code.toUpperCase() },
            select: { id: true, nom: true, description: true },
            orderBy: { ordre: "asc" }
        })

        return NextResponse.json(uts)
    } catch (error) {
        console.error("Error fetching UTs:", error)
        return NextResponse.json([], { status: 500 })
    }
}
