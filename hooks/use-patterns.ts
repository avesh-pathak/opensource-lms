'use client'

import useSWR, { mutate } from 'swr'

export interface CustomPattern {
  id: string
  name: string
  slug: string
  total: number
  solved: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch patterns')
  return res.json()
}

/**
 * Hook for fetching patterns for a specific sheet
 * - Caches per sheetId (each sheet has its own cache entry)
 * - Revalidates in background when revisiting
 * - keepPreviousData ensures UI doesn't flash empty during refetch
 */
export function usePatterns(sheetId: string | null) {
  const key = sheetId ? `/api/custom-sheet/patterns?sheetId=${sheetId}` : null

  const { data, error, isLoading, isValidating } = useSWR<CustomPattern[]>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30s deduplication
      errorRetryCount: 2,
      keepPreviousData: true,
    }
  )

  return {
    patterns: data ?? [],
    isLoading,
    isValidating,
    error,
  }
}

/**
 * Trigger background revalidation for patterns of a specific sheet
 */
export function revalidatePatterns(sheetId: string) {
  return mutate(`/api/custom-sheet/patterns?sheetId=${sheetId}`)
}

/**
 * Optimistically add a pattern to cache (for after import)
 */
export async function invalidatePatternsAfterImport(sheetId: string) {
  // Just trigger revalidation - backend has the truth
  return mutate(`/api/custom-sheet/patterns?sheetId=${sheetId}`)
}
