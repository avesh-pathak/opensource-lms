import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Rate limiting map (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 30 // requests per minute
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

export async function GET(
    req: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        )
    }

    const { username } = await params
    const normalizedUsername = username?.toLowerCase().trim()

    if (!normalizedUsername || !/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
        return NextResponse.json({ error: "Invalid username" }, { status: 400 })
    }

    try {
        const client = await clientPromise
        const db = client.db()

        // Find user by username
        const user = await db.collection("users").findOne(
            { username: normalizedUsername },
            {
                projection: {
                    _id: 1,
                    username: 1,
                    name: 1,
                    image: 1,
                    bio: 1,
                    linkedIn: 1,
                    leetCode: 1,
                    resume: 1,
                    resumePublicId: 1, // Added
                    isProfilePublic: 1,
                    isResumePublic: 1,
                    problemsSolved: 1,
                    points: 1,
                    createdAt: 1,
                    state: 1 // Include state field which contains problems data
                }
            }
        )

        // Return 404 if user not found OR profile is private
        if (!user || !user.isProfilePublic) {
            return NextResponse.json(
                { error: "Profile not found or is private" },
                { status: 404 }
            )
        }

        // Initialize stats
        const stats = {
            totalSolved: user.problemsSolved || 0,
            easy: 0,
            medium: 0,
            hard: 0,
            domains: {} as Record<string, number>
        }

        // Get problems data from user.state.problems (primary source)
        const userProblems = user.state?.problems as Record<string, any> | undefined

        // Calculate stats from user's state.problems if available
        if (userProblems && Object.keys(userProblems).length > 0) {
            const completedEntries = Object.entries(userProblems)
                .filter(([_, p]) => p.status === "Completed")

            stats.totalSolved = completedEntries.length

            // Get problem IDs to fetch difficulty info
            const problemIds = completedEntries.map(([id, _]) => id).filter(Boolean)

            if (problemIds.length > 0) {
                // Fetch problems to get their difficulties
                // Problem IDs in state.problems are slugs
                const problems = await db.collection("problems").find({
                    slug: { $in: problemIds }
                }).toArray()

                // Create a map for quick lookup by slug and _id
                const problemMap = new Map()
                problems.forEach((p: any) => {
                    if (p.slug) problemMap.set(p.slug, p)
                    problemMap.set(p._id?.toString(), p)
                })

                // Count by difficulty
                completedEntries.forEach(([problemId, _]) => {
                    const problem = problemMap.get(problemId) || problemMap.get(problemId?.toString())
                    if (problem) {
                        const diff = problem.difficulty?.toLowerCase()
                        if (diff === "easy") stats.easy++
                        else if (diff === "medium") stats.medium++
                        else if (diff === "hard") stats.hard++

                        // Domain counting
                        const domain = problem.domain || problem.category || problem.topic
                        if (domain) {
                            stats.domains[domain] = (stats.domains[domain] || 0) + 1
                        }
                    }
                })
            }

            // If we couldn't match problems to get difficulties, estimate from total
            if (stats.easy === 0 && stats.medium === 0 && stats.hard === 0 && stats.totalSolved > 0) {
                // Fallback: estimate distribution (30% easy, 50% medium, 20% hard)
                stats.easy = Math.floor(stats.totalSolved * 0.3)
                stats.medium = Math.floor(stats.totalSolved * 0.5)
                stats.hard = stats.totalSolved - stats.easy - stats.medium
            }
        }

        // Generate activity data (last 30 days)
        const activityData: { date: string; count: number }[] = []
        const now = new Date()
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Create date map
        const dateCountMap: Record<string, number> = {}
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            dateCountMap[d.toISOString().split("T")[0]] = 0
        }

        // Count completions per day from state.problems
        if (userProblems) {
            Object.values(userProblems as Record<string, any>).forEach((p: any) => {
                if (p.status === "Completed" && p.completedAt) {
                    const dateStr = new Date(p.completedAt).toISOString().split("T")[0]
                    if (dateCountMap[dateStr] !== undefined) {
                        dateCountMap[dateStr]++
                    }
                }
            })
        }

        // Convert to array
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now)
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split("T")[0]
            activityData.push({
                date: dateStr,
                count: dateCountMap[dateStr] || 0
            })
        }

        // Generate internal proxy URL if resume is public
        const resumeUrl = user.isResumePublic
            ? `/api/user/resume/${user.username}`
            : null;

        // Build whitelisted response
        const publicProfile = {
            username: user.username,
            name: user.name,
            image: user.image,
            bio: user.bio || null,
            linkedIn: user.linkedIn || null,
            leetCode: user.leetCode || null,
            resume: resumeUrl,
            joinedAt: user.createdAt,
            stats,
            activityData
        }

        return NextResponse.json(publicProfile)
    } catch (error) {
        console.error("Public profile fetch error:", error)
        return NextResponse.json({ error: "Internal error" }, { status: 500 })
    }
}
