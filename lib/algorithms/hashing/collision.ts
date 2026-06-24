import { VisualizerFrame, HashBucket } from '@/lib/types/visualizer'

export function generateCollisionFrames(
  keys: string[],
  numBuckets: number
): VisualizerFrame<HashBucket | string>[] {
  const frames: VisualizerFrame<HashBucket | string>[] = []
  const buckets: HashBucket[] = Array.from({ length: numBuckets }, (_, i) => ({
    index: i,
    items: [],
  }))

  const simpleHash = (s: string) => {
    let hash = 0
    for (let i = 0; i < s.length; i++) hash += s.charCodeAt(i)
    return hash % numBuckets
  }

  frames.push({
    array: [...keys],
    highlights: [],
    secondaryHighlights: [],
    visited: [],
    pointers: {},
    explanation: `Visualizing Hash Collision with Chaining. We have ${numBuckets} buckets.`,
    activeLine: 1,
    variables: { buckets: numBuckets },
    comparisons: 0,
    phase: 'search',
  })

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const hash = simpleHash(key)

    frames.push({
      array: [...keys],
      highlights: [i],
      secondaryHighlights: [],
      visited: [],
      pointers: { curr: i },
      explanation: `Hashing "${key}"... Result: ${hash}`,
      activeLine: 4,
      variables: { key, hashValue: hash, buckets: numBuckets },
      comparisons: i + 1,
      phase: 'compare',
    })

    const isCollision = buckets[hash].items.length > 0
    buckets[hash].items.push({ key, value: i, isNew: true })

    frames.push({
      array: buckets as any, // This is a bit hacky, but the canvas will handle it
      highlights: [hash],
      secondaryHighlights: [],
      visited: [],
      pointers: { bucket: hash },
      explanation: isCollision
        ? `Collision detected at bucket ${hash}! Adding "${key}" to the chain.`
        : `Adding "${key}" to bucket ${hash}.`,
      activeLine: 6,
      variables: {
        key,
        bucket: hash,
        collision: isCollision,
        buckets: numBuckets,
      },
      comparisons: i + 1,
      phase: isCollision ? 'found' : 'search',
    })

    // Reset isNew flag for next frame
    buckets[hash].items = buckets[hash].items.map((item) => ({
      ...item,
      isNew: false,
    }))
  }

  return frames
}
