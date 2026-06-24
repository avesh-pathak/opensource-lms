import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/dbConnect'

// Define which topics belong to which domain
const CORE_ENGINEERING_TOPICS = [
  'api design',
  'computer networks',
  'dbms',
  'design patterns',
  'distributed systems',
  'operating systems',
  'creational patterns',
  'structural patterns',
  'behavioral patterns',
  'system design',
  'load balancing',
  'caching',
  'message queues',
  'microservices',
  'scalability',
  'os fundamentals',
  'tcp',
  'http',
  'sql',
  'nosql',
  'ood patterns',
]

const AI_ML_TOPICS = [
  'neural networks',
  'supervised learning',
  'unsupervised learning',
  'deep learning',
  'machine learning',
  'nlp',
  'genai',
  'reinforcement learning',
  'computer vision',
]

// Determine domain based on topic name
function getDomainForTopic(topicName: string): string {
  const normalized = topicName.toLowerCase().trim()

  // Check Core Engineering topics
  for (const t of CORE_ENGINEERING_TOPICS) {
    if (normalized.includes(t) || t.includes(normalized)) {
      return 'Core Engineering'
    }
  }

  // Check AI/ML topics
  for (const t of AI_ML_TOPICS) {
    if (normalized.includes(t) || t.includes(normalized)) {
      return 'AI/ML'
    }
  }

  // Default to DSA for algorithm/data structure topics
  return 'DSA'
}

/**
 * GET /api/topics
 * Returns topics dynamically aggregated from problems collection
 * Groups by normalized `topic` field and calculates solved/total counts
 * Filter by domain with ?domain=DSA query param
 */
export async function GET(request: Request) {
  try {
    await dbConnect()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { error: 'Database not connected' },
        { status: 500 }
      )
    }

    // Get domain filter from query params
    const { searchParams } = new URL(request.url)
    const domainFilter = searchParams.get('domain')

    const problemsCollection = db.collection('problems')

    // Aggregate problems by topic
    const topicsAggregation = await problemsCollection
      .aggregate([
        {
          $match: {
            $and: [
              { topic: { $exists: true } },
              { topic: { $ne: null } },
              { topic: { $ne: '' } },
            ],
          },
        },
        {
          $group: {
            _id: {
              // Normalize topic: trim whitespace, proper case preserved
              $trim: { input: '$topic' },
            },
            total: { $sum: 1 },
            solved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0],
              },
            },
            inProgress: {
              $sum: {
                $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0],
              },
            },
            problems: {
              $push: {
                _id: { $toString: '$_id' },
                title: '$title',
                slug: '$slug',
                problem_link: '$problem_link',
                difficulty: '$difficulty',
                status: '$status',
                starred: '$starred',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            id: {
              $replaceAll: {
                input: { $toLower: '$_id' },
                find: ' ',
                replacement: '-',
              },
            },
            total: 1,
            solved: 1,
            inProgress: 1,
            problems: 1,
          },
        },
        {
          $sort: { name: 1 },
        },
      ])
      .toArray()

    // Add domain classification to each topic
    const topicsWithDomain = topicsAggregation.map((topic) => ({
      ...topic,
      domain: getDomainForTopic(topic.name),
    }))

    // Filter by domain if specified
    const filteredTopics = domainFilter
      ? topicsWithDomain.filter((t) => t.domain === domainFilter)
      : topicsWithDomain

    return NextResponse.json(filteredTopics, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error: any) {
    console.error('Topics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}
