import { auth } from '@/lib/auth'
import mongoose from 'mongoose'
import { ApiError } from '@/lib/api-utils'

export type Session = {
  user: {
    id: string
    role?: string
    [key: string]: any
  }
} | null

/**
 * Ensures a user session exists.
 * Returns the session if valid, otherwise throws an ApiError (401).
 * Usage: const session = await requireAuth()
 */
export async function requireAuth(): Promise<NonNullable<Session>> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new ApiError(401, 'Unauthorized')
  }
  return session
}

/**
 * Ensures the user has the 'admin' role.
 * Returns the session if valid, otherwise throws an ApiError (403).
 */
export async function requireAdmin(): Promise<NonNullable<Session>> {
  const session = await requireAuth()
  if (session.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden - Admin access required')
  }
  return session
}

/**
 * Ensures the user owns the resource or is an admin.
 * @param resourceUserId - The IDs of the user who owns the resource.
 */
export async function requireOwnership(
  resourceUserId: string | mongoose.Types.ObjectId,
  session?: Session
): Promise<NonNullable<Session>> {
  const s = session || (await requireAuth())

  if (s.user.role === 'admin') return s

  const ownerId = resourceUserId.toString()
  if (s.user.id !== ownerId) {
    throw new ApiError(403, 'Forbidden - You do not own this resource')
  }
  return s
}
