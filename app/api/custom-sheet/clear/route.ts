import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import { handleApiError } from '@/lib/api-utils'

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const { searchParams } = new URL(req.url)
  const sheetId = searchParams.get('sheetId')

  if (!sheetId) {
    return NextResponse.json({ error: 'sheetId is required' }, { status: 400 })
  }

  console.log(
    `[CustomSheet][Reset] Initiated by user: ${userId} for sheet: ${sheetId}`
  )

  await dbConnect()

  try {
    // Simple, direct deletes without transactions
    // Scoped to specific sheet
    const deleteProblems = await CustomSheetProblem.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      sheetId: new mongoose.Types.ObjectId(sheetId),
    })

    const deletePatterns = await CustomSheetPattern.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      sheetId: new mongoose.Types.ObjectId(sheetId),
    })

    const result = {
      problems: deleteProblems.deletedCount,
      patterns: deletePatterns.deletedCount,
    }

    console.log(
      `[CustomSheet][Reset] Success for user ${userId}. Removed:`,
      result
    )

    return NextResponse.json({
      success: true,
      sheetId,
      message: 'Sheet cleared successfully',
      meta: {
        problemsDeleted: deleteProblems.deletedCount,
        patternsDeleted: deletePatterns.deletedCount,
      },
    })
  } catch (error) {
    console.error(
      `[CustomSheet][Reset][Error] Failed for user ${userId}:`,
      error
    )
    return handleApiError(error)
  }
}
