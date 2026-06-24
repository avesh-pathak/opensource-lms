import { ObjectId } from 'mongodb'

export interface Notification {
  _id?: ObjectId
  userId: ObjectId // Receiver
  type:
    | 'INFO'
    | 'SUCCESS'
    | 'WARNING'
    | 'ERROR'
    | 'ANNOUNCEMENT'
    | 'MEETING'
    | 'SUBMISSION'
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: Date
}

export interface Announcement {
  _id?: ObjectId
  title: string
  content: string
  priority: 'NORMAL' | 'HIGH'
  createdBy: ObjectId
  createdAt: Date
}

export interface AdminNote {
  _id?: ObjectId
  adminId: ObjectId
  content: string
  createdAt: Date
  updatedAt: Date
}
