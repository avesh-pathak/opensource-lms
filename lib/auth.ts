import { getSession } from './jwt'
import clientPromise from './mongodb'
import { ObjectId } from 'mongodb'

export async function auth() {
  try {
    const session = await getSession()
    if (!session || !session.user || !session.user.id) return null

    const client = await clientPromise
    const db = client.db()
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(session.user.id) })

    if (!user) return null

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        username: user.username,
        college: user.college,
        gender: user.gender,
        role: user.role,
        isDemo: user.isDemo,
        bio: user.bio,
        linkedIn: user.linkedIn,
        leetCode: user.leetCode,
        isProfilePublic: user.isProfilePublic,
        isResumePublic: user.isResumePublic,
      },
    }
  } catch (error) {
    console.error('Auth Error:', error)
    return null
  }
}
