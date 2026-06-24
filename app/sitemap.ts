import { MetadataRoute } from 'next'
import dbConnect from '@/lib/dbConnect'
import Community from '@/models/Community'
import Problem from '@/models/Problem'
import Hackathon from '@/models/Hackathon'
import Project from '@/models/Project'
import User from '@/models/User'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aveshpathaklms.vercel.app'

  // 1. Static Routes
  const routes = ['', '/auth/login', '/auth/signup', '/pricing'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    })
  )

  try {
    // 2. Dynamic Content (Fetch from DB)
    await dbConnect()

    const communities = await Community.find({}).select('slug updatedAt').lean()
    const problems = await Problem.find({}).select('slug updatedAt').lean()
    const hackathons = await Hackathon.find({ status: 'PUBLISHED' })
      .select('_id updatedAt')
      .lean()
    const projects = await Project.find({
      isOfficial: true,
      status: 'Published',
    })
      .select('_id updatedAt')
      .lean()

    const communityUrls = communities.map((c: any) => ({
      url: `${baseUrl}/community/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const problemUrls = problems.map((p: any) => ({
      url: `${baseUrl}/problems/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const hackathonUrls = hackathons.map((h: any) => ({
      url: `${baseUrl}/hackathons/${h._id}`,
      lastModified: h.updatedAt ? new Date(h.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    const projectUrls = projects.map((p: any) => ({
      url: `${baseUrl}/projects/${p._id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const users = await User.find({ isProfilePublic: true })
      .select('username updatedAt')
      .lean()
    const userUrls = users.map((u: any) => ({
      url: `${baseUrl}/u/${u.username}`,
      lastModified: u.updatedAt ? new Date(u.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [
      ...routes,
      ...communityUrls,
      ...problemUrls,
      ...hackathonUrls,
      ...projectUrls,
      ...userUrls,
    ]
  } catch (error) {
    console.error('Sitemap generation failed:', error)
    return routes
  }
}
