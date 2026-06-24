import { NextResponse } from 'next/server'

/**
 * Checks if a session belongs to a Demo Admin and returns a 403 response
 * if an attempt is made to perform a write operation (POST, PUT, PATCH, DELETE).
 *
 * @param session The current user session
 * @param method The HTTP method of the request
 * @returns NextResponse | null
 */
export function validateDemoAccess(session: any, method: string) {
  if (
    session?.user?.isDemo &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
  ) {
    return NextResponse.json(
      {
        error:
          'Common Babua 😄 This is a demo account. You can explore everything, but changes are disabled.',
        code: 'DEMO_RESTRICTED',
      },
      { status: 403 }
    )
  }
  return null
}
