'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'

export function useProtectedAction() {
  const { user } = useAuth()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const isAuthenticated = !!user

  const execute = useCallback(
    (action: () => void) => {
      if (!isAuthenticated) {
        setShowAuthDialog(true)
        return
      }
      action()
    },
    [isAuthenticated]
  )

  return {
    execute,
    showAuthDialog,
    setShowAuthDialog,
    isAuthenticated,
  }
}
