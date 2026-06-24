import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Announcement from '@/models/Announcement'
import { handleApiError } from '@/lib/api-utils'

// GET: Fetch published announcements for students
export async function GET() {
  try {
    await dbConnect()
    const announcements = await Announcement.find({ status: 'PUBLISHED' })
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(announcements)
  } catch (error) {
    return handleApiError(error)
  }
}
