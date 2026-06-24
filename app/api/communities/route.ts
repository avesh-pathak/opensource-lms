import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Community from '@/models/Community'
import { auth } from '@/lib/auth'

const DEFAULT_COMMUNITIES = [
  {
    name: 'The Roast',
    slug: 'the-roast',
    description:
      'Submit your resume or code to the Fire Pit for elite, no-sugar-coat feedback.',
    icon: 'Flame',
    color: 'text-orange-500 bg-orange-500/10',
    order: 1,
  },
  {
    name: 'Study Sprints',
    slug: 'study-sprints',
    description:
      'Join real-time, 48-hour intensive groups to master specific engineering topics.',
    icon: 'BookOpen',
    color: 'text-blue-500 bg-blue-500/10',
    order: 2,
  },
  {
    name: 'Tech Debates',
    slug: 'tech-debates',
    description:
      'Expert-level threads on high-stakes architecture decisions and patterns.',
    icon: 'MessageSquare',
    color: 'text-purple-500 bg-purple-500/10',
    order: 3,
  },
  {
    name: 'Engineering Logs',
    slug: 'engineering-logs',
    description:
      'A feed of daily technical insights from the community. Pure engineering, zero fluff.',
    icon: 'Newspaper',
    color: 'text-emerald-500 bg-emerald-500/10',
    order: 4,
  },
]

// Admin auth check helper
const isAdmin = async () => {
  const session = await auth()
  return session?.user?.role === 'admin'
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    // Auto-seed if empty
    const count = await Community.countDocuments()
    if (count === 0) {
      console.log('Seeding default communities...')
      await Community.insertMany(
        DEFAULT_COMMUNITIES.map((c) => ({
          name: c.name,
          slug: c.slug,
          description: c.description,
          icon: c.icon,
          themeColor: c.color,
          status: 'active',
        }))
      )
    }

    // Build query
    const query: any = {}
    if (slug) {
      query.slug = slug
    } else {
      query.status = 'active'
    }

    const communities = await Community.find(query).sort({ createdAt: 1 })
    return NextResponse.json(communities)
  } catch (error) {
    console.error('Error fetching communities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      )
    }

    await dbConnect()
    const body = await req.json()

    const community = await Community.create({
      ...body,
      status: body.status || 'active',
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error: any) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Community with this slug already exists' },
        { status: 409 }
      )
    }
    console.error('Error creating community:', error)
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500 }
    )
  }
}
