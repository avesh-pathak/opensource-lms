import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI not found in .env')
  process.exit(1)
}

async function fixUsernames() {
  const client = new MongoClient(uri as string)
  try {
    await client.connect()
    const db = client.db()
    const users = db.collection('users')

    const allUsers = await users.find({}).toArray()
    console.log(`Checking ${allUsers.length} users...`)

    for (const user of allUsers) {
      if (!user.username || user.username === '') {
        const base = (user.name || user.email || 'user')
          .split('@')[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .slice(0, 15)

        let isUnique = false
        let finalUsername = ''
        let attempts = 0

        while (!isUnique && attempts < 10) {
          const suffix = Math.random().toString(36).substring(2, 6)
          finalUsername = `${base}_${suffix}`
          const dup = await users.findOne({ username: finalUsername })
          if (!dup) isUnique = true
          attempts++
        }

        if (isUnique) {
          await users.updateOne(
            { _id: user._id },
            { $set: { username: finalUsername } }
          )
          console.log(`Assigned [${finalUsername}] to [${user.email}]`)
        }
      }
    }
    console.log('Cleanup complete.')
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

fixUsernames()
