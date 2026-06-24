export interface DebateComment {
  id: string
  userName: string
  avatar: string
  content: string
  likes: number
  createdAt: string
  stance: string
}

export interface RoastSubmission {
  id: string
  userName: string
  resumeLink: string
  status: string
  feedback?: string
  createdAt: string
}

export interface Log {
  id: string
  title: string
  author: string
  likes: number
  category: string
  time: string
  preview: string
  content: string
  liked: boolean
}

export interface Debate {
  id: string
  title: string
  description: string
  category: string
  participants: number
  status: string
  timeLeft: string
  comments: DebateComment[]
}

export interface Sprint {
  id: string
  title: string
  description: string
  category: string
  participants: number
  status: string
  timeLeft: string
  comments: any[]
  level?: string
  startTime?: string
  active?: boolean
  joined?: boolean
}

export const MOCK_DEBATES: Debate[] = []
export const MOCK_ROASTS = []
export const MOCK_PROJECTS = []
export const MOCK_LOGS = []
export const MOCK_SPRINTS: Sprint[] = []
