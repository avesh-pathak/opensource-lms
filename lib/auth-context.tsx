'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

interface User {
  id: string
  email: string
  name: string
  image?: string
  username?: string
  college?: string
  role?: 'user' | 'admin'
  isDemo?: boolean
  points: number
  problemsSolved: number
  bio?: string
  linkedIn?: string
  leetCode?: string
  isProfilePublic?: boolean
  isResumePublic?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const controller = new AbortController()
    try {
      const res = await fetch('/api/auth/session', {
        signal: controller.signal,
      })
      if (res.ok) {
        const session = await res.json()
        setUser(session?.user || null)
      } else {
        setUser(null)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to fetch session:', error)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = () => {
    window.location.href = '/api/auth/google'
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
