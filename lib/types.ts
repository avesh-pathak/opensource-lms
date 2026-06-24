// Represents one problem stored in MongoDB
export interface MongoDBProblem {
  _id: string
  id?: string

  title: string
  problem_link: string
  topic: string

  difficulty: 'Easy' | 'Medium' | 'Hard'
  status: 'Pending' | 'In Progress' | 'Completed'

  starred: boolean
  patternId?: string

  // timestamps
  createdAt: string
  updatedAt: string
  completedAt?: string // ✅ REQUIRED for analytics (streaks, weekly activity)

  // optional user data
  domain?: 'DSA' | 'System Design' | 'LLD' | 'Core Engineering' | 'AI/ML'
  timeSpent?: number
  notes?: string
  solution?: string
  approach?: string
  tags?: string[]
  confidence?: number
  reviewDueAt?: string
  isReviewDue?: boolean
}

// Represents a topic summary used in dashboard & analytics
export type Topic = {
  id: string
  name: string
  solved: number
  total: number
  domain?: 'DSA' | 'System Design' | 'LLD' | 'Core Engineering' | 'AI/ML'
  subject?: string
  reviewCount?: number
}
// Represents the local/synced state of a problem (minimal data)
export interface StoredProblemData {
  _id: string
  status?: 'Pending' | 'In Progress' | 'Completed'
  starred?: boolean
  timeSpent?: number
  notes?: string
  solution?: string
  approach?: string
  tags?: string[]
  completedAt?: string
  updatedAt?: string
}

import type { RoastSubmission, Debate, Sprint, Log } from './data/community'

export interface MentorshipSession {
  id: string
  mentorId: string
  mentorName: string
  mentorImage: string
  mentorTitle: string
  mentorCompany: string
  date: string
  time: string
  status: 'upcoming' | 'completed' | 'cancelled'
  sessionType?: '1-1' | 'sos' | 'roast' | 'consult'
  meetingLink?: string
}

export interface SessionData {
  expandedProblems: Record<string, boolean>
  activeTimers: Record<string, { time: number; isRunning: boolean }>
  filters: {
    search: string
    difficulty: string[]
    status: string[]
  }
  lastVisitedTopic: string | null
  view: 'overview' | 'analytics'
  dailyGoal?: number
  learningGoal?: string
  bookedSessions: MentorshipSession[]
  unlockedHubs?: string[]
  dismissedGoalPrompt?: boolean
}

export interface UserData {
  session: SessionData
  problems: Record<string, StoredProblemData>
  points?: number
  problemsSolved?: number
  community?: {
    roasts?: RoastSubmission[]
    debates?: Debate[]
    sprints?: Sprint[]
    logs?: Log[]
  }
}
