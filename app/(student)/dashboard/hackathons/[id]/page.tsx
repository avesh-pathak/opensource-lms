import React from 'react'
import { HackathonEvent } from '@/components/hackathon/hackathon-event'
import { notFound } from 'next/navigation'

const _hackathonsData = [
  {
    id: '1',
    title: 'The Sliding Window Sprint',
    description:
      'Build a high-performance analytics dashboard that processes streaming data using the Sliding Window pattern.',
    status: 'active' as const,
    participants: 142,
    startDate: 'Oct 24',
    endDate: 'Oct 26',
    prize: '$500 + Babua Pro',
    pattern: 'Sliding Window',
    difficulty: 'Intermediate' as const,
    rules: [
      'Implementation must use the Sliding Window pattern effectively.',
      'Submissions must be open-source and hosted on GitHub.',
      'Must include a live demo link (Vercel, Netlify, etc.).',
      'Project must handle real-time or simulated data streams.',
    ],
    requirements: [
      'GitHub Repository URL',
      'Functional Live Demo',
      'Technical Breakdown / README',
      'Loom Video (Optional but recommended)',
    ],
  },
  {
    id: '2',
    title: 'System Design: Scalable Cache',
    description:
      'Design and implement a distributed caching layer with LRU eviction and Write-through policies.',
    status: 'active' as const,
    participants: 89,
    startDate: 'Oct 25',
    endDate: 'Oct 27',
    prize: 'Interview with Top VC',
    pattern: 'Caching',
    difficulty: 'Advanced' as const,
    rules: [
      'Must implement LRU and LFU eviction policies.',
      'Must demonstrate thread-safety and distributed consistency.',
      'Complexity must be handled gracefully.',
    ],
    requirements: [
      'High-Level Design Diagram',
      'Implementation Codebase',
      'Benchmark Results',
    ],
  },
]

export default async function HackathonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Use the new centralized data fetching logic
  const { getPublicHackathon } = await import('@/lib/hackathons')
  const hackathon = await getPublicHackathon(id)

  if (!hackathon) {
    notFound()
  }

  // Map to HackathonEventProps
  // The database model properties might need mapping if they don't match exactly
  // HackathonEvent expects: status: 'active' | 'upcoming' | 'ended'
  // DB has eventStatus: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
  // DB has status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  const eventProps: any = {
    id: hackathon._id,
    title: hackathon.title,
    description: hackathon.description,
    status: (hackathon.eventStatus || 'UPCOMING').toLowerCase(),
    participants: hackathon.participants || 0,
    startDate: new Date(hackathon.startDate).toLocaleDateString(),
    endDate: new Date(hackathon.endDate).toLocaleDateString(),
    prize: hackathon.prize,
    pattern: hackathon.pattern || 'General', // TODO: Add pattern to model
    difficulty: hackathon.difficulty || 'Beginner',
    rules: hackathon.rules || [],
    requirements: hackathon.requirements || [],
  }

  return (
    <div className="p-4 md:p-8">
      <HackathonEvent {...eventProps} />
    </div>
  )
}
