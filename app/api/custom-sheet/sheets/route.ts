import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CustomSheet from '@/models/CustomSheet'
import CustomSheetPattern from '@/models/CustomSheetPattern'
import CustomSheetProblem from '@/models/CustomSheetProblem'
import { handleApiError } from '@/lib/api-utils'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const userId = session.user.id

    // REMOVED: Migration logic. GET routes must be read-only.

    const sheets = await CustomSheet.find({ userId })
      .select('_id name isDefault')
      .sort({ createdAt: 1 })
      .lean()

    const defaultSheetId =
      sheets.find((s: any) => s.isDefault)?._id || sheets[0]?._id

    return NextResponse.json({
      sheets,
      defaultSheetId,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  let session
  let name

  try {
    session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    name = body.name
    const isDefault = body.isDefault

    if (!name) {
      return NextResponse.json(
        { error: 'Sheet name is required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const userId = session.user.id

    // IDEMPOTENCY CHECK
    const existingSheet = await CustomSheet.findOne({ userId, name })
    if (existingSheet) {
      return NextResponse.json({
        success: true,
        sheetId: existingSheet._id,
        data: existingSheet,
        meta: { message: 'Sheet already exists' },
      })
    }

    // Check if this is the user's first sheet
    const count = await CustomSheet.countDocuments({ userId })
    const shouldBeDefault = count === 0 || isDefault === true

    // If this sheet should be default, unset all others
    if (shouldBeDefault) {
      await CustomSheet.updateMany({ userId }, { $set: { isDefault: false } })
    }

    const sheet = await CustomSheet.create({
      userId,
      name,
      isDefault: shouldBeDefault,
    })

    return NextResponse.json({
      success: true,
      sheetId: sheet._id,
      data: sheet,
    })
  } catch (error: any) {
    // No need for duplicate key check anymore due to idempotency check above, but safely fallback
    if (error.code === 11000) {
      // Race condition fallback
      if (session?.user?.id && name) {
        const existingSheet = await CustomSheet.findOne({
          userId: session.user.id,
          name,
        })
        if (existingSheet) {
          return NextResponse.json({
            success: true,
            sheetId: existingSheet._id,
            data: existingSheet,
          })
        }
      }
      return NextResponse.json(
        { error: 'A sheet with this name already exists' },
        { status: 400 }
      )
    }
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { sheetId, name } = body

    if (!sheetId || !name || !name.trim()) {
      return NextResponse.json(
        { error: 'Sheet ID and valid name are required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const userId = session.user.id

    // Check if name exists for another sheet of the same user
    const existing = await CustomSheet.findOne({
      userId,
      name: name.trim(),
      _id: { $ne: sheetId },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A sheet with this name already exists' },
        { status: 400 }
      )
    }

    const updatedSheet = await CustomSheet.findOneAndUpdate(
      { _id: sheetId, userId },
      { $set: { name: name.trim(), updatedAt: new Date() } },
      { new: true }
    )

    if (!updatedSheet) {
      return NextResponse.json({ error: 'Sheet not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedSheet,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sheetId = searchParams.get('sheetId')

    if (!sheetId) {
      return NextResponse.json(
        { error: 'Sheet ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()
    const userId = session.user.id

    // 1. Delete the Sheet and all its contents
    const deleted = await CustomSheet.deleteOne({ _id: sheetId, userId })

    if (deleted.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Sheet not found or already deleted' },
        { status: 404 }
      )
    }

    await CustomSheetPattern.deleteMany({ sheetId, userId })
    await CustomSheetProblem.deleteMany({ sheetId, userId })

    // 2. Check if user has any sheets left
    const remainingSheets = await CustomSheet.find({ userId }).sort({
      createdAt: 1,
    })

    let nextSheetId = null

    if (remainingSheets.length > 0) {
      // 4. Ensure one default exists among remaining
      const hasDefault = remainingSheets.some((s) => s.isDefault)
      if (!hasDefault) {
        // Promote the first remaining sheet to default
        const firstSheet = remainingSheets[0]
        await CustomSheet.updateOne(
          { _id: firstSheet._id },
          { isDefault: true }
        )
        nextSheetId = firstSheet._id
      } else {
        // Return the existing default or just the first one
        const defaultSheet = remainingSheets.find((s) => s.isDefault)
        nextSheetId = defaultSheet?._id || remainingSheets[0]._id
      }
    }

    // nextSheetId is null if 0 sheets remain -> Client redirects to onboarding

    return NextResponse.json({
      success: true,
      nextSheetId,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
