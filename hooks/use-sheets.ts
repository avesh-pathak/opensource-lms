'use client'

import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export interface Sheet {
  _id: string
  name: string
  isDefault: boolean
}

interface SheetsResponse {
  sheets: Sheet[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch sheets')
  return res.json()
}

const SHEETS_KEY = '/api/custom-sheet/sheets'

/**
 * Hook for managing sheets with SWR caching and optimistic updates
 * - Caches sheet list aggressively (60s stale time)
 * - Provides optimistic create/delete operations
 * - Deduplicates concurrent requests
 */
export function useSheets() {
  const { data, error, isLoading, isValidating } = useSWR<SheetsResponse>(
    SHEETS_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 60s - don't refetch if requested within this window
      errorRetryCount: 2,
      keepPreviousData: true,
    }
  )

  const sheets = data?.sheets ?? []

  return {
    sheets,
    isLoading,
    isValidating,
    error,
  }
}

const pendingRequests = new Map<string, Promise<any>>()

/**
 * Optimistic create sheet - adds to cache immediately, rolls back on error
 */
export async function createSheetOptimistic(
  name: string,
  router: ReturnType<typeof useRouter>
): Promise<{ success: boolean; sheetId?: string }> {
  const dedupKey = `create-${name.trim()}`
  if (pendingRequests.has(dedupKey)) {
    return pendingRequests.get(dedupKey)
  }

  // Generate temporary ID for optimistic update
  const tempId = `temp-${Date.now()}`
  const optimisticSheet: Sheet = {
    _id: tempId,
    name: name.trim(),
    isDefault: false,
  }

  // Optimistically add to cache
  await mutate<SheetsResponse>(
    SHEETS_KEY,
    (currentData) => {
      if (!currentData) return { sheets: [optimisticSheet] }
      return { sheets: [...currentData.sheets, optimisticSheet] }
    },
    { revalidate: false }
  )

  try {
    const res = await fetch(SHEETS_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to create sheet')
    }

    // Update cache with real ID
    await mutate<SheetsResponse>(
      SHEETS_KEY,
      (currentData) => {
        if (!currentData) return { sheets: [data] }
        return {
          sheets: currentData.sheets.map((s) =>
            s._id === tempId ? { ...s, _id: data._id } : s
          ),
        }
      },
      { revalidate: false }
    )

    toast.success('Sheet created successfully')

    // Navigate immediately (non-blocking)
    router.push(`/dashboard/custom-sheet/${data._id}`)

    return { success: true, sheetId: data._id }
  } catch (error: any) {
    // Rollback optimistic update
    await mutate<SheetsResponse>(
      SHEETS_KEY,
      (currentData) => {
        if (!currentData) return { sheets: [] }
        return {
          sheets: currentData.sheets.filter((s) => s._id !== tempId),
        }
      },
      { revalidate: true }
    )

    toast.error(error.message || 'Failed to create sheet')
    return { success: false }
  }
}

/**
 * Optimistic delete sheet - removes from cache immediately, redirects, rolls back on error
 */
export async function deleteSheetOptimistic(
  sheetId: string,
  sheets: Sheet[]
): Promise<{ success: boolean; nextSheetId?: string | null }> {
  // Find sheet to delete for potential rollback
  const sheetToDelete = sheets.find((s) => s._id === sheetId)
  const sheetIndex = sheets.findIndex((s) => s._id === sheetId)

  // Optimistically remove from cache
  await mutate<SheetsResponse>(
    SHEETS_KEY,
    (currentData) => {
      if (!currentData) return { sheets: [] }
      return {
        sheets: currentData.sheets.filter((s) => s._id !== sheetId),
      }
    },
    { revalidate: false }
  )

  try {
    const res = await fetch(`${SHEETS_KEY}?sheetId=${sheetId}`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Delete failed')
    }

    toast.success('Sheet deleted')

    // Return nextSheetId for navigation
    return { success: true, nextSheetId: data.nextSheetId }
  } catch (error: any) {
    // Rollback: restore deleted sheet
    if (sheetToDelete) {
      await mutate<SheetsResponse>(
        SHEETS_KEY,
        (currentData) => {
          if (!currentData) return { sheets: [sheetToDelete] }
          const newSheets = [...currentData.sheets]
          newSheets.splice(sheetIndex, 0, sheetToDelete)
          return { sheets: newSheets }
        },
        { revalidate: true }
      )
    }

    toast.error(error.message || 'Failed to delete sheet')
    return { success: false }
  }
}

/**
 * Optimistic rename sheet - updates cache immediately, rolls back on error
 */
export async function renameSheetOptimistic(
  sheetId: string,
  newName: string,
  sheets: Sheet[]
): Promise<boolean> {
  const originalSheet = sheets.find((s) => s._id === sheetId)

  // Safety check - if sheet not found, don't proceed
  if (!originalSheet) return false

  // Optimistically update cache
  await mutate<SheetsResponse>(
    SHEETS_KEY,
    (currentData) => {
      if (!currentData) return { sheets: [] }
      return {
        sheets: currentData.sheets.map((s) =>
          s._id === sheetId ? { ...s, name: newName.trim() } : s
        ),
      }
    },
    { revalidate: false }
  )

  try {
    const res = await fetch(SHEETS_KEY, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetId, name: newName.trim() }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to rename sheet')
    }

    toast.success('Sheet renamed successfully')
    return true
  } catch (error: any) {
    // Rollback: restore original name
    await mutate<SheetsResponse>(
      SHEETS_KEY,
      (currentData) => {
        if (!currentData) return { sheets: [] }
        return {
          sheets: currentData.sheets.map((s) =>
            s._id === sheetId ? originalSheet : s
          ),
        }
      },
      { revalidate: true }
    )

    toast.error(error.message || 'Failed to rename sheet')
    return false
  }
}

/**
 * Revalidate sheets cache (trigger background refetch)
 */
export function revalidateSheets() {
  return mutate(SHEETS_KEY)
}
