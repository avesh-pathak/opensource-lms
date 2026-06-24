import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Hackathon from '@/models/Hackathon'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const idError = validateObjectId(id, 'Hackathon ID')
    if (idError) return idError

    await dbConnect()

    const hackathon = await Hackathon.findOne({
      _id: id,
      status: 'PUBLISHED',
    }).lean()

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hackathon)
  } catch (error) {
    return handleApiError(error)
  }
}
