import { z } from 'zod'

export const bookingSchema = z.object({
  mentorId: z.string().min(1, 'Mentor ID is required'),
  sessionType: z
    .enum(['1-1', 'sos', 'roast', 'consult'])
    .optional()
    .default('1-1'),
  price: z.number().min(0, 'Price must be positive'),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  date: z.string().optional(), // ISO date string
  dateString: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
    .optional(),
  startTime: z.string().min(1, 'Start time is required').optional(),
})

export const problemDataSchema = z.object({
  _id: z.string(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  starred: z.boolean().optional(),
  timeSpent: z.number().optional(),
  notes: z.string().optional(),
  solution: z.string().optional(),
  approach: z.string().optional(),
  tags: z.array(z.string()).optional(),
  completedAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const syncSchema = z.object({
  progress: z.record(z.string(), problemDataSchema).optional(),
  mentorshipSessions: z.array(z.any()).optional(), // Loose validaton for now
  userGoal: z.number().optional(),
})

// Notification validation schemas
export const markReadSchema = z.object({
  announcementId: z.string().min(1, 'Announcement ID is required'),
})

export const markAllReadSchema = z.object({
  type: z.literal('all'),
})

export const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
})

// Hackathon Schema
export const hackathonSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().or(z.date()), // Allow string ISO or Date object
  endDate: z.string().or(z.date()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  eventStatus: z.enum(['UPCOMING', 'ACTIVE', 'COMPLETED']).default('UPCOMING'),
  participants: z.number().default(0),
  prize: z.string().min(1, 'Prize is required'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'LEGENDARY']),
  image: z.string().url().optional(),
  registrationUrl: z.string().url().optional(),
  rules: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  progress: z.number().optional(),
  pattern: z.string().optional(),
})

// Mentor Schema
export const timeSlotSchema = z.object({
  id: z.string(),
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  isBooked: z.boolean().default(false),
})

export const mentorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  title: z.string().min(2, 'Title is required'),
  company: z.string().min(2, 'Company is required'),
  image: z.string().url(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  expertise: z.array(z.string()).min(1, 'At least one expertise is required'),
  hourlyRate: z.number().min(0),
  rating: z.number().min(0).max(5).default(5.0),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  education: z.string().min(2, 'Education is required'),
  experience: z.array(z.string()).min(1, 'Experience is required'),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  availability: z.array(timeSlotSchema).optional(),
  isActive: z.boolean().default(true),
})

// Squad Schema
export const squadSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z.string().min(3, 'Slug is required'),
  mentorId: z.string(), // ID reference
  mentorName: z.string(),
  mentorImage: z.string().optional(),
  mentorTitle: z.string(),
  mentorCompany: z.string(),
  category: z.enum(['System Design', 'DSA', 'Frontend', 'Backend', 'AI/ML']),
  description: z.string().min(10, 'Description is required'),
  manifesto: z.array(z.string()).optional(),
  monthlyPrice: z.number().min(0),
  memberCount: z.number().default(0),
  maxMembers: z.number().default(20),
  weeklySchedule: z.array(z.string()).optional(),
  nextSession: z.string().optional(),
  status: z
    .enum(['active', 'starting-soon', 'full', 'inactive'])
    .default('active'),
  members: z.array(z.string()).optional(),
})

// Community Post Schema
export const postSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  category: z.string().default('General'),
  communityId: z.string(),
  type: z.enum(['standard', 'resume']).default('standard'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  isPinned: z.boolean().default(false),
  isLocked: z.boolean().default(false),
  resumeUrl: z.string().optional(),
  resumePublicId: z.string().optional(),
  fileName: z.string().optional(),
})

// Comment Schema
export const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1, 'Comment cannot be empty'),
  parentId: z.string().optional(), // For threaded comments
})

// Notification Schema
export const notificationSchema = z.object({
  userId: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  link: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  isRead: z.boolean().default(false),
})
