import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

// Rate limiting map (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const record = rateLimit.get(ip)

    if (!record || now > record.resetAt) {
        rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
        return true
    }

    if (record.count >= RATE_LIMIT) {
        return false
    }

    record.count++
    return true
}

export async function GET(req: Request) {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        )
    }

    const url = new URL(req.url)
    const query = url.searchParams.get("q")?.toLowerCase().trim()

    // Minimum query length to prevent enumeration
    if (!query || query.length < 3) {
        return NextResponse.json({
            error: "Search query must be at least 3 characters",
            results: []
        })
    }

    // Sanitize query for regex (prevent ReDoS)
    const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    try {
        const client = await clientPromise
        const db = client.db()

        // Search only public profiles
        const users = await db.collection("users").find(
            {
                isProfilePublic: true,
                $or: [
                    { username: { $regex: sanitizedQuery, $options: "i" } },
                    { name: { $regex: sanitizedQuery, $options: "i" } }
                ]
            },
            {
                projection: {
                    username: 1,
                    name: 1,
                    image: 1,
                    solvedProblems: 1
                },
                limit: 10
            }
        ).toArray()

        const results = users.map(u => ({
            username: u.username,
            name: u.name,
            image: u.image,
            totalSolved: u.solvedProblems?.length || 0
        }))

        return NextResponse.json({ results })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json({ error: "Internal error", results: [] }, { status: 500 })
    }
}
