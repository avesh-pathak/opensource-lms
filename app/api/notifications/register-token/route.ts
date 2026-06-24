import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import DeviceToken from '@/models/DeviceToken'
import { z } from 'zod'

const registerTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  platform: z.enum(['web', 'android', 'ios']).default('web'),
  userAgent: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = registerTokenSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const { token, platform, userAgent } = validation.data
    const userId = session.user.id

    await dbConnect()

    // Upsert token (update lastActive if exists, insert if new)
    await DeviceToken.findOneAndUpdate(
      { token },
      {
        $set: {
          userId,
          token,
          platform,
          userAgent: userAgent || request.headers.get('user-agent') || '',
          lastActive: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Token registered successfully',
    })
  } catch (error: any) {
    console.error('[Register Token] Error:', error)
    return NextResponse.json(
      { error: 'Failed to register token' },
      { status: 500 }
    )
  }
}
