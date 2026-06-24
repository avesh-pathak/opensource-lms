'use client'

import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  MoreHorizontal,
  User,
  Mail,
  Shield,
  Calendar,
  Eye,
  ExternalLink,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { TableSkeleton } from '@/components/skeletons/table-skeleton'

const ITEMS_PER_PAGE = 20

function AdminUsersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize from URL params
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

  // Debounce search input
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (debouncedSearch) params.set('q', debouncedSearch)
    const queryString = params.toString()
    window.history.replaceState(
      null,
      '',
      `/admin/users${queryString ? `?${queryString}` : ''}`
    )
  }, [page, debouncedSearch])

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })
      if (debouncedSearch) {
        params.set('q', debouncedSearch)
      }
      const res = await fetch(`/api/admin/users?${params}`)
      if (res.ok) {
        const { data } = await res.json()
        setUsers(data.users || [])
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages)
          setTotalUsers(data.pagination.total)
        }
      }
    } catch (_error) {
      toast.error('Failed to fetch users')
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setPage(1)
  }

  const updateUserStatus = async (userId: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        toast.success('User updated successfully')
        fetchUsers()
      } else {
        toast.error('Failed to update user')
      }
    } catch (_error) {
      toast.error('An error occurred')
    }
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">
            User Directory
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage and monitor platform users.
            {totalUsers > 0 && (
              <span className="ml-2 text-xs text-primary">
                ({totalUsers} total)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          {isSearching ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            placeholder="Search by name, email, or username..."
            className="pl-11 pr-10 h-12 bg-card/50 border-border/50 rounded-2xl focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          className="h-12 w-12 rounded-2xl border-border/50 bg-card/50"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border/50">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground italic animate-pulse">
                Loading Directory...
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground italic">
                No users found.
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                  className="p-4 hover:bg-muted/20 transition-colors cursor-pointer active:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="font-bold">
                          {user.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-foreground">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {user.email}
                        </div>
                        {user.username && (
                          <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider mt-0.5">
                            @{user.username}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.role === 'admin' ? 'default' : 'secondary'
                        }
                        className="text-[8px]"
                      >
                        {user.role || 'User'}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Joined{' '}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    Role
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <div className="p-4">
                        <TableSkeleton
                          rowCount={10}
                          columnCount={4}
                          showActions={true}
                        />
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-muted-foreground italic"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr
                      key={user._id}
                      onClick={() => router.push(`/admin/users/${user._id}`)}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                            <AvatarImage src={user.image} />
                            <AvatarFallback className="font-bold">
                              {user.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                              {user.name}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                            </div>
                            <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="max-w-[120px] truncate block lg:max-w-none">
                                {user.email}
                              </span>
                            </div>
                            {user.username && (
                              <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider mt-0.5">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            user.role === 'admin' ? 'default' : 'secondary'
                          }
                          className="uppercase text-[10px] tracking-widest font-black rounded-lg"
                        >
                          {user.role || 'User'}
                        </Badge>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl w-48"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-black italic">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer font-medium"
                              onClick={() =>
                                router.push(`/admin/users/${user._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-black italic text-muted-foreground">
                              Role
                            </DropdownMenuLabel>
                            {user.role !== 'admin' ? (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer font-medium text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-500/10"
                                onClick={() =>
                                  updateUserStatus(user._id, { role: 'admin' })
                                }
                              >
                                <Shield className="h-4 w-4" /> Promote to Admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer font-medium text-amber-600 focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-500/10"
                                onClick={() =>
                                  updateUserStatus(user._id, { role: 'user' })
                                }
                              >
                                <User className="h-4 w-4" /> Demote to User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest font-black italic text-muted-foreground">
                              Access
                            </DropdownMenuLabel>
                            {user.isBanned ? (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer font-medium text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-500/10"
                                onClick={() =>
                                  updateUserStatus(user._id, {
                                    isBanned: false,
                                  })
                                }
                              >
                                <Shield className="h-4 w-4" /> Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer font-medium text-rose-600 focus:text-rose-700 focus:bg-rose-50 dark:focus:bg-rose-500/10"
                                onClick={() =>
                                  updateUserStatus(user._id, { isBanned: true })
                                }
                              >
                                <Shield className="h-4 w-4" /> Ban User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="border-t border-border/50 py-6">
              <Pagination>
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page > 1) setPage((p) => p - 1)
                      }}
                      className={cn(
                        'text-[10px] font-black uppercase tracking-widest rounded-xl',
                        page === 1 && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>

                  {(() => {
                    const pages: (number | 'ellipsis')[] = []
                    if (totalPages <= 5) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i)
                    } else {
                      pages.push(1)
                      if (page > 3) pages.push('ellipsis')
                      for (
                        let i = Math.max(2, page - 1);
                        i <= Math.min(totalPages - 1, page + 1);
                        i++
                      ) {
                        pages.push(i)
                      }
                      if (page < totalPages - 2) pages.push('ellipsis')
                      pages.push(totalPages)
                    }

                    return pages.map((p, idx) => (
                      <PaginationItem key={idx}>
                        {p === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setPage(p)
                            }}
                            isActive={page === p}
                            className={cn(
                              'text-[10px] font-black uppercase tracking-widest rounded-xl w-10 h-10',
                              page === p &&
                                'border-primary bg-primary/10 text-primary'
                            )}
                          >
                            {p}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page < totalPages) setPage((p) => p + 1)
                      }}
                      className={cn(
                        'text-[10px] font-black uppercase tracking-widest rounded-xl',
                        page >= totalPages && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminUsers() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AdminUsersContent />
    </Suspense>
  )
}
