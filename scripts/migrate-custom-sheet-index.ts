import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in your .env.local file')
  process.exit(1)
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI!)

    console.log(
      "Connected. Checking for index 'userId_1_link_1' in 'customsheetproblems'..."
    )

    const collection = mongoose.connection.collection('customsheetproblems')
    const indexes = await collection.indexes()

    const indexExists = indexes.some((idx) => idx.name === 'userId_1_link_1')

    if (indexExists) {
      console.log("Index found. Dropping 'userId_1_link_1'...")
      await collection.dropIndex('userId_1_link_1')
      console.log('SUCCESS: Index dropped.')
    } else {
      console.log("Index 'userId_1_link_1' not found. Migration skipped.")
    }

    console.log('Migration complete.')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
