import { ObjectId } from 'mongodb'

export interface Ticket {
  _id?: ObjectId
  userId: ObjectId
  userName: string
  userEmail: string
  type: 'BUG' | 'FEATURE' | 'CONTENT_ISSUE' | 'OTHER'
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}
