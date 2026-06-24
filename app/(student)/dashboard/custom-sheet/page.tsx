'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { OnboardingView } from './components/onboarding-view'
import { useSheets } from '@/hooks/use-sheets'

/**
 * Root Custom Sheet Page
 * - Uses SWR for cached sheet lookup (instant if already fetched)
 * - Redirects immediately to default sheet if exists
 * - Shows onboarding only when confirmed no sheets
 * - NO heavy loading animations - just minimal skeleton
 */
export default function CustomSheetMainPage() {
  const { sheets, isLoading } = useSheets()

  if (!isLoading) {
    if (sheets.length === 1) {
      // Single sheet - redirect directly
      redirect(`/dashboard/custom-sheet/${sheets[0]._id}`)
    } else if (sheets.length > 1) {
      // Multiple sheets - redirect to default or first
      const defaultSheet = sheets.find((s) => s.isDefault)
      const targetId = defaultSheet?._id || sheets[0]._id
      redirect(`/dashboard/custom-sheet/${targetId}`)
    }
  }

  // While loading, show minimal skeleton (NOT a heavy animation)
  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Minimal header skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted/50 animate-pulse rounded-lg" />
            <div className="h-4 w-32 bg-muted/30 animate-pulse rounded" />
          </div>
        </div>
        {/* Minimal content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted/30 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    )
  }

  // Only render onboarding if confirmed no sheets exist
  if (sheets.length === 0) {
    return (
      <OnboardingView
        onImportSuccess={(sheetId) => {
          redirect(`/dashboard/custom-sheet/${sheetId}`)
        }}
      />
    )
  }

  // Redirecting... (will happen from useEffect)
  return null
}
