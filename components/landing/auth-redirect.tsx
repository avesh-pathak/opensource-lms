'use client'

import React from 'react'
import { redirect, useSearchParams } from 'next/navigation'

function AuthRedirectHandlerInner() {
  const searchParams = useSearchParams()

  // Workaround for Supabase Redirect: If we land here with a code, bounce to callback
  const code = searchParams?.get('code')
  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}`)
  }

  return null
}

export function AuthRedirectHandler() {
  return (
    <React.Suspense fallback={null}>
      <AuthRedirectHandlerInner />
    </React.Suspense>
  )
}
