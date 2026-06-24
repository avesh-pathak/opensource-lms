import dbConnect from '@/lib/dbConnect'
import { ObjectId } from 'mongodb'
import Hackathon from '@/models/Hackathon'

export async function getPublicHackathon(id: string) {
  try {
    await dbConnect()

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return null
    }

    const hackathon = await Hackathon.findOne({
      _id: id,
      status: 'PUBLISHED',
    }).lean()

    if (!hackathon) {
      return null
    }

    return {
      ...hackathon,
      _id: hackathon._id.toString(),
      startDate: hackathon.startDate.toISOString(),
      endDate: hackathon.endDate.toISOString(),
      createdAt: hackathon.createdAt.toISOString(),
      updatedAt: hackathon.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Failed to fetch public hackathon:', error)
    return null
  }
}
