import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShieldCheck, X } from 'lucide-react'

const BIHARI_PHRASES = [
  'Ka ho Babua!',
  'Bhak budbak! Login.',
  'Ae Chotu, jaldi!',
  'Garda machana hai?',
  'Bahut tej ho?',
  'Login kro, jhakas hai.',
]

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  description?: string
}

export function AuthDialog({
  open,
  onOpenChange,
  trigger,
  title: _title = 'Authentication Required',
  description: _description,
}: AuthDialogProps) {
  const { login } = useAuth()
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false)
  const [randomPhrase, setRandomPhrase] = useState('')

  useEffect(() => {
    if (open) {
      const index = Math.floor(Math.random() * BIHARI_PHRASES.length)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRandomPhrase(BIHARI_PHRASES[index])
    }
  }, [open])

  const handleGoogleLogin = () => {
    setIsAuthLoading(true)
    login()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className="max-w-[340px] border border-orange-500/20 bg-background text-foreground p-0 gap-0 overflow-hidden shadow-2xl rounded-[32px] transition-all duration-500 ring-1 ring-border/5 left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
      >
        {/* Custom Close Button */}
        <div className="absolute right-5 top-5 z-50">
          <DialogClose className="rounded-full p-1.5 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border/50 backdrop-blur-md">
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        {/* Header Section - Simplified "Uni-color" Theme */}
        <div className="relative h-32 w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-500/10 to-transparent">
          {/* Simplified Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 scale-75">
            <div className="group relative">
              <div className="absolute -inset-6 bg-orange-500/10 rounded-full blur-2xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] bg-orange-500 shadow-[0_15px_30px_-10px_rgba(249,115,22,0.5)] border border-white/20">
                <ShieldCheck className="h-10 w-10 text-white stroke-[1.2]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 pb-8 pt-2 space-y-6 text-center">
          <div className="space-y-4">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-500">
                Identity Verification
              </p>
              <DialogTitle className="text-2xl font-black tracking-tight leading-none text-foreground">
                Student <span className="text-orange-500">Access</span>
              </DialogTitle>
            </div>

            {/* High-Visibility Slang Tag */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs tracking-tight shadow-[0_10px_20px_-5px_rgba(249,115,22,0.3)] animate-in fade-in zoom-in-95 duration-500">
                <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                {randomPhrase || 'Kaa ho!'}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={!!isAuthLoading}
              className="relative w-full h-12 rounded-xl font-bold bg-foreground text-background hover:opacity-90 transition-all active:scale-[0.97] group overflow-hidden shadow-lg text-[13px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {isAuthLoading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </>
                )}
              </span>
            </Button>
          </div>

          {/* Footer Info */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <div className="h-px w-8 bg-border" />
            <div className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
              <span>Encrypted</span>
              <span className="h-0.5 w-0.5 rounded-full bg-orange-500" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
