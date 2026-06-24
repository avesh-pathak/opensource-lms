import { auth } from '@/lib/auth'
import { generateUniqueUsername } from '@/lib/utils/username-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const username = await generateUniqueUsername(
      session.user.name || session.user.email || 'user'
    )
    return NextResponse.json({ username })
  } catch (error) {
    console.error('Generator error:', error)
    return NextResponse.json(
      { error: 'Failed to generate username' },
      { status: 500 }
    )
  }
}
