import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'Warning: MONGODB_URI is missing. Production features requiring MongoDB will fail.'
    )
  } else {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  // Force write concern to 1 to avoid "majority" errors on standalone instances
  w: '1' as any,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri || 'mongodb://localhost:27017/dummy', options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri || 'mongodb://localhost:27017/dummy', options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
