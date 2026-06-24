'use client'

import { useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

/**
 * Hook to protect actions from being executed by a Demo Admin.
 *
 * @returns An object containing the check and the error message
 */
export function useDemoAction() {
  const { user } = useAuth()

  // The famous Bihari toast message
  const DEMO_MESSAGE =
    'Common Babua 😄 This is a demo account. You can explore everything, but changes are disabled.'

  /**
   * Checks if the user is a demo admin.
   * If yes, shows a toast and returns true.
   * If no, returns false.
   */
  const isDemoRestricted = useCallback(() => {
    if (user?.isDemo) {
      toast.error(DEMO_MESSAGE, {
        duration: 5000,
        icon: '🚧',
      })
      return true
    }
    return false
  }, [user?.isDemo])

  return {
    isDemo: !!user?.isDemo,
    isDemoRestricted,
    demoMessage: DEMO_MESSAGE,
  }
}
