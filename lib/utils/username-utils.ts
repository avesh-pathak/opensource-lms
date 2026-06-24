import clientPromise from '../mongodb'

/**
 * Generates a unique username based on a name or email.
 * Format: name_suffix (e.g., avesh_k2j1)
 */
export async function generateUniqueUsername(base: string): Promise<string> {
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')

  // Clean the base string (lowercase, remove special chars, max 15 chars)
  let cleanBase = base
    .split('@')[0] // handle email
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15)

  if (cleanBase.length < 3) cleanBase = 'user' + cleanBase

  let isUnique = false
  let finalUsername = ''
  let attempts = 0

  while (!isUnique && attempts < 10) {
    // Generate a random 4-character suffix
    const suffix = Math.random().toString(36).substring(2, 6)
    finalUsername = `${cleanBase}_${suffix}`

    const existing = await users.findOne({ username: finalUsername })
    if (!existing) {
      isUnique = true
    }
    attempts++
  }

  // Fallback if somehow collisions persist
  if (!isUnique) {
    finalUsername = `${cleanBase}_${Date.now().toString(36).slice(-4)}`
  }

  return finalUsername
}
