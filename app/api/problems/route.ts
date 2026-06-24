import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Problem from '@/models/Problem'

export async function GET(_req: Request) {
  try {
    await dbConnect()

    const problems = await Problem.find({})
      .select({
        title: 1,
        slug: 1,
        difficulty: 1,
        category: 1,
        topic: 1,
        problem_link: 1,
        order: 1,
        videoId: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ order: 1 })
      .lean()

    const transformedProblems = problems.map((p: any) => {
      const raw = (p.problem_link && String(p.problem_link).trim()) || ''
      const isExternal =
        raw !== '' &&
        /^https?:\/\//.test(raw) &&
        !raw.includes('/dashboard/problem')
      return {
        _id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        problem_link: isExternal ? raw : `/dashboard/problem/${p.slug}`,
        topic: p.topic || p.category,
        difficulty: p.difficulty,
        order: p.order,
        videoId: p.videoId,
        status: 'Pending',
        starred: false,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }
    })

    return NextResponse.json(
      { problems: transformedProblems },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error: any) {
    console.error('Problems API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}
