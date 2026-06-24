import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { handleApiError, validateObjectId } from '@/lib/api-utils'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')

    const client = await clientPromise
    const db = client.db()

    const query: any = {}
    if (dateStr) {
      query.dateString = dateStr
    } else {
      // Default to future slots if no date provided
      query.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }

    const slots = await db
      .collection('mentorship_availability')
      .find(query)
      .sort({ startTime: 1 })
      .toArray()

    return NextResponse.json(slots)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { startTime, endTime, date, dateString, meetingLink } = body

    if (!startTime || !endTime || !dateString || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const newSlot = {
      startTime,
      endTime,
      date: parsedDate,
      dateString,
      meetingLink,
      isBooked: false,
      createdAt: new Date(),
      createdBy: new ObjectId(session.user.id),
    }

    const result = await db
      .collection('mentorship_availability')
      .insertOne(newSlot)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    const idError = validateObjectId(id, 'Slot ID')
    if (idError) return idError

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection('mentorship_availability').deleteOne({
      _id: new ObjectId(id!),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
