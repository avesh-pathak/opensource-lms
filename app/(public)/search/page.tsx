'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, User, Trophy, ArrowRight, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface SearchResult {
  username: string
  name: string
  image: string
  totalSolved: number
}

export default function SearchPage() {
  const _router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Debounced search
  const search = useCallback(async (q: string) => {
    if (q.length < 3) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch(`/api/public/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300) // Debounce 300ms

    return () => clearTimeout(timer)
  }, [query, search])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-orange-500/5 to-yellow-500/5" />

        <div className="relative max-w-3xl mx-auto px-4 py-12 lg:py-16 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">
              Find <span className="text-primary">Profiles</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Search for students and view their proof of work
            </p>
          </div>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by username or name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
            )}
          </div>

          {query.length > 0 && query.length < 3 && (
            <p className="text-sm text-muted-foreground">
              Type at least 3 characters to search
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {searched && results.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold">No profiles found</h2>
            <p className="text-muted-foreground text-sm">
              Try a different search term or check the spelling
            </p>
          </div>
        )}

        <div className="space-y-3">
          {results.map((user, _i) => (
            <div key={user.username}>
              <Link href={`/u/${user.username}`}>
                <Card className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-[border-color,box-shadow,transform] cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground font-mono truncate">
                        @{user.username}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 text-primary font-bold">
                          <Trophy className="w-4 h-4" />
                          {user.totalSolved}
                        </div>
                        <p className="text-xs text-muted-foreground">solved</p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-[color,transform]" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-xs text-muted-foreground/50 uppercase tracking-widest font-bold">
          Powered by Babua DSA
        </p>
      </div>
    </div>
  )
}
