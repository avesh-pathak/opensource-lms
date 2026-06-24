'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { AuthDialog } from '@/components/auth/auth-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, LayoutDashboard, Settings } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const LOGOUT_SLANGS = [
  'Jaa rahe ho? Kahe Babua!',
  'Arre, abhi to aaye the!',
  'Garda macha ke jaa rahe ho?',
  'Abhi logout mat kariye!',
  'Phurrr... Chale gaye?',
]

export function UserProfileMenu() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [randomSlang, setRandomSlang] = useState('')

  const handleLoginClick = () => {
    if (pathname?.startsWith('/admin')) {
      router.push('/auth/admin-login')
    } else {
      setShowAuth(true)
    }
  }

  if (!user) {
    return (
      <>
        <Button
          onClick={handleLoginClick}
          variant="default"
          className="rounded-full px-4 h-9 text-xs md:px-6 md:h-10 md:text-sm font-bold shadow-lg shadow-[#FB923C]/20 hover:scale-105 transition-all text-black bg-[#FB923C] hover:bg-[#FB923C]/90"
        >
          Login
        </Button>
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      </>
    )
  }

  const initials =
    user.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  const handleLogoutClick = () => {
    const slang =
      LOGOUT_SLANGS[Math.floor(Math.random() * LOGOUT_SLANGS.length)]
    setRandomSlang(slang)
    setShowLogoutConfirm(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-primary/10 hover:border-primary transition-all duration-300 p-0 shadow-lg shadow-black/5 hover:shadow-primary/20 bg-background group"
          >
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage
                src={user.image}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50 font-black text-sm text-foreground/80 group-hover:text-primary transition-colors">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col">
                <p className="text-sm font-bold leading-none">
                  {user.name || 'Engineer'}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {user.email}
                </p>
              </div>
              {user.username && (
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
                  <span className="text-[10px] font-mono text-primary font-bold">
                    @{user.username}
                  </span>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer font-medium">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/profile"
              className="cursor-pointer font-medium"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/profile"
              className="cursor-pointer font-medium"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 font-bold"
            onClick={handleLogoutClick}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="max-w-[360px] rounded-[24px] border-border bg-background shadow-2xl">
          <AlertDialogHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tight">
                Sure Logout?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-bold text-orange-500 italic">
                &quot;{randomSlang}&quot;
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <AlertDialogCancel className="rounded-xl font-bold bg-secondary/50 border-none hover:bg-secondary transition-all">
              Wait, I&apos;m staying!
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => logout()}
              className="rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Log me out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
