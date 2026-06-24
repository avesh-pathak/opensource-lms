import clientPromise from '../lib/mongodb'

async function promoteToAdmin(email: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')

    const result = await users.updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    )

    if (result.matchedCount === 0) {
      console.log(`User with email ${email} not found.`)
    } else {
      console.log(`User ${email} promoted to admin successfully.`)
    }
    process.exit(0)
  } catch (error) {
    console.error('Error promoting user:', error)
    process.exit(1)
  }
}

const email = process.argv[2]
if (!email) {
  console.log('Please provide an email address.')
  process.exit(1)
}

promoteToAdmin(email)
