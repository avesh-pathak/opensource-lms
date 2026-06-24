/**
 * Simple In-Memory Rate Limiter (Token Bucket / LRU style)
 *
 * Note: This stores state in memory. In a serverless environment (Vercel),
 * memory is not shared across lambdas, so this is "best effort" per instance.
 * For strict distributed rate limiting, we would need Redis (Upstash).
 *
 * But for a single-instance or low-traffic scaling, this works well enough
 * to prevent basic abuse.
 */

type Options = {
  uniqueTokenPerInterval?: number // Max number of unique IPs to track (LRU size)
  interval?: number // Window size in ms
}

export class RateLimiter {
  tokenCache: Map<string, number[]>
  uniqueTokenPerInterval: number
  interval: number

  constructor(options?: Options) {
    this.tokenCache = new Map()
    this.uniqueTokenPerInterval = options?.uniqueTokenPerInterval || 500
    this.interval = options?.interval || 60000 // 1 minute default
  }

  check(limit: number, token: string): Promise<boolean> {
    return new Promise((resolve) => {
      const now = Date.now()
      const windowStart = now - this.interval

      let timestamps = this.tokenCache.get(token) || []

      // Filter out old timestamps
      timestamps = timestamps.filter((timestamp) => timestamp > windowStart)

      // Current usage count
      const currentUsage = timestamps.length

      if (currentUsage >= limit) {
        // Rate limit exceeded
        resolve(false)
        return
      }

      // Add new timestamp
      timestamps.push(now)
      this.tokenCache.set(token, timestamps)

      // LRU-like cleanup if map gets too big
      if (this.tokenCache.size > this.uniqueTokenPerInterval) {
        // Delete the oldest inserted (first key in iterator)
        const firstKey = this.tokenCache.keys().next().value
        if (firstKey) this.tokenCache.delete(firstKey)
      }

      resolve(true)
    })
  }

  cleanup() {
    const now = Date.now()
    const windowStart = now - this.interval
    for (const [token, timestamps] of this.tokenCache.entries()) {
      const valid = timestamps.filter((ts) => ts > windowStart)
      if (valid.length === 0) {
        this.tokenCache.delete(token)
      } else {
        this.tokenCache.set(token, valid)
      }
    }
  }
}

// Singleton instances for different limits
export const authLimiter = new RateLimiter({ interval: 10 * 1000 }) // 10 seconds window
export const paymentLimiter = new RateLimiter({ interval: 60 * 1000 }) // 1 minute window
export const apiLimiter = new RateLimiter({ interval: 60 * 1000 }) // 1 minute window

export async function rateLimit(
  token: string,
  limit: number = 10
): Promise<{ success: boolean }> {
  const success = await apiLimiter.check(limit, token)
  return { success }
}
