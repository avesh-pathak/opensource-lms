import { NextResponse } from 'next/server'
import { getAllTheory } from '@/lib/theory'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const theory = await getAllTheory()
  return NextResponse.json(theory)
}
