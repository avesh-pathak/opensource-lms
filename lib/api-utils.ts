import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { z } from 'zod'

/**
 * Security Utilities for API Routes
 * Centralized helpers for common security patterns
 */

// ============================================
// Standardized Response Helper
// ============================================

/**
 * Standardized API Response Helper
 * Wraps successful data in { data: ... } object.
 */
export function ApiResponse<T>(
  data: T,
  status = 200,
  headers?: HeadersInit
): NextResponse<{ data: T }> {
  return NextResponse.json({ data }, { status, headers })
}

/**
 * Sets public cache control headers for Edge Caching
 * s-maxage=60 (1 min shared cache), stale-while-revalidate=600 (10 min background update)
 */
export function setPublicCache(headers: Headers) {
  headers.set(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=600'
  )
}

// ============================================
// API Error Handling
// ============================================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Centralized error handler for API routes
 * Logs full error server-side, returns safe error to client
 */
import { logger } from '@/lib/logger'

/**
 * Centralized error handler for API routes
 * Logs full error server-side, returns safe error to client
 */
export function handleApiError(error: unknown): NextResponse {
  // Log full error server-side for debugging
  logger.error('API Error', error)

  // Return safe error to client
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Invalid input',
        details: error.errors,
      },
      { status: 400 }
    )
  }

  // Generic 500 for unexpected errors (don't leak details)
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

// ============================================
// ObjectId Validation
// ============================================

/**
 * Validates MongoDB ObjectId
 * Returns NextResponse with 400 if invalid, null if valid
 */
export function validateObjectId(
  id: string | null | undefined,
  fieldName = 'ID'
): NextResponse | null {
  if (!id) {
    return NextResponse.json(
      { error: `${fieldName} is required` },
      { status: 400 }
    )
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: `Invalid ${fieldName}` }, { status: 400 })
  }

  return null
}

/**
 * Validates multiple ObjectIds at once
 */
export function validateObjectIds(
  ids: Record<string, string | null | undefined>
): NextResponse | null {
  for (const [fieldName, id] of Object.entries(ids)) {
    const error = validateObjectId(id, fieldName)
    if (error) return error
  }
  return null
}

// ============================================
// Authorization Helpers
// ============================================

interface ResourceWithUserId {
  userId: mongoose.Types.ObjectId | string
  [key: string]: any
}

interface Session {
  user: {
    id: string
    role?: string
    [key: string]: any
  }
}

/**
 * Validates that a resource belongs to the authenticated user
 * Returns NextResponse with 403 if unauthorized, null if authorized
 */
export function validateOwnership(
  resource: ResourceWithUserId | null,
  session: Session | null,
  resourceName = 'Resource'
): NextResponse | null {
  if (!resource) {
    return NextResponse.json(
      { error: `${resourceName} not found` },
      { status: 404 }
    )
  }

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resourceUserId = resource.userId.toString()
  const sessionUserId = session.user.id

  if (resourceUserId !== sessionUserId) {
    return NextResponse.json(
      { error: "Forbidden - You don't have access to this resource" },
      { status: 403 }
    )
  }

  return null
}

/**
 * Validates admin role
 */
export function validateAdminRole(
  session: Session | null
): NextResponse | null {
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  return null
}

// ============================================
// Zod Validation Helpers
// ============================================

/**
 * Validates request body against Zod schema
 * Returns parsed data or NextResponse with 400
 */
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return {
        error: NextResponse.json(
          {
            error: 'Invalid input',
            details: result.error.errors,
          },
          { status: 400 }
        ),
      }
    }

    return { data: result.data }
  } catch (_error) {
    return {
      error: NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }),
    }
  }
}

// ============================================
// Common Zod Schemas
// ============================================

// ============================================
// Database Transaction Helpers
// ============================================

/**
 * Resilient Transaction Wrapper
 * Attempts to run with MongoDB Transactions (Replica Set/Atlas required)
 * Automatically falls back to sequential execution on standalone servers
 */
export async function runInTransaction<T>(
  callback: (session: mongoose.ClientSession | null) => Promise<T>
): Promise<T> {
  let session: mongoose.ClientSession | null = null

  try {
    session = await mongoose.startSession()
  } catch (_e) {
    // Environment does not support sessions (e.g., Standalone Mongo)
    return callback(null)
  }

  let started = false
  try {
    let result: T | undefined
    await session.withTransaction(async (sess) => {
      started = true
      result = await callback(sess)
    })
    return result!
  } catch (error: any) {
    // If error indicates transactions are not supported by the deployment
    const isUnsupported =
      error.message?.toLowerCase().includes('transaction') ||
      error.message?.toLowerCase().includes('session') ||
      [20, 251, 50851].includes(error.code)

    // Only fallback if the callback hasn't started executing logic yet
    // This prevents duplicate execution if it failed mid-way
    if (isUnsupported && !started) {
      return callback(null)
    }

    throw error
  } finally {
    if (session) await session.endSession()
  }
}

export const commonSchemas = {
  objectId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: 'Invalid ObjectId',
  }),

  difficulty: z.enum(['Easy', 'Medium', 'Hard']),

  status: z.enum(['TODO', 'DONE', 'In Progress', 'Pending', 'Completed']),

  email: z.string().email(),

  url: z.string().url().optional(),

  positiveNumber: z.number().positive(),

  nonEmptyString: z.string().min(1),
}
