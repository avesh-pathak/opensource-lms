import { NextResponse } from 'next/server'
import { getTopicTheory } from '@/lib/theory'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  const user = session?.user

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { slug } = await params
  const theory = await getTopicTheory(slug)

  if (!theory) {
    return NextResponse.json({ error: 'Theory not found' }, { status: 404 })
  }

  return NextResponse.json(theory)
}
