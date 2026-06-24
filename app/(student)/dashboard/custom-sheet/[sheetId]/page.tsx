'use client'

import React, { useState } from 'react'
import { Trash2, Plus, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useParams, useRouter, redirect } from 'next/navigation'
import { useProtectedAction } from '@/hooks/use-protected-action'
import { AuthDialog } from '@/components/auth/auth-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { SheetSelector } from '@/components/shared/sheet-selector'
import { SheetRequirementsDialog } from '@/components/shared/sheet-requirements-dialog'
import { useSheets, revalidateSheets } from '@/hooks/use-sheets'
import {
  usePatterns,
  revalidatePatterns,
  CustomPattern,
} from '@/hooks/use-patterns'

// Add context type
type UploadContext = 'create' | 'append'

export default function CustomSheetIdPage() {
  const params = useParams()
  const router = useRouter()
  const sheetId = params.sheetId as string

  // SWR hooks for data fetching with caching
  const { sheets, isLoading: sheetsLoading } = useSheets()
  const { patterns, isLoading: patternsLoading } = usePatterns(sheetId)

  const [uploading, setUploading] = useState(false)
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const [uploadContext, setUploadContext] = useState<UploadContext>('append')
  const hiddenFileInputRef = React.useRef<HTMLInputElement>(null)

  // Auth Protection
  const { execute, showAuthDialog, setShowAuthDialog } = useProtectedAction()

  // GUARD: If sheets loaded and length === 0, redirect to onboarding
  if (!sheetsLoading && sheets.length === 0) {
    redirect('/dashboard/custom-sheet')
  }

  const triggerUploadFlow = (context: UploadContext = 'append') => {
    setUploadContext(context)
    execute(() => {
      setShowFormatDialog(true)
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    startUpload(file)
  }

  const startUpload = async (file: File) => {
    setUploading(true)
    setShowFormatDialog(false)

    const formData = new FormData()
    formData.append('file', file)

    // STRICT LOGIC BRANCHING
    if (uploadContext === 'create') {
      formData.append('isNewSheet', 'true')
      formData.append('mode', 'replace')
    } else {
      formData.append('isNewSheet', 'false')
      formData.append('sheetId', sheetId)
      formData.append('mode', 'append')
    }

    try {
      const res = await fetch('/api/custom-sheet/import', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      const problemsCount = data.meta?.problemsCreated ?? 0
      const returnedSheetId = data.sheetId

      if (uploadContext === 'create') {
        if (!returnedSheetId)
          throw new Error('Backend failed to return new Sheet ID')

        toast.success('New Sheet Created', {
          description: `Added ${problemsCount} problems to your new sheet.`,
        })

        // Revalidate sheets cache then navigate
        await revalidateSheets()
        router.push(`/dashboard/custom-sheet/${returnedSheetId}`)
      } else {
        toast.success('Problems Added Successfully', {
          description: `Added ${problemsCount} new problems to this sheet.`,
        })
        // Background revalidation - no blocking
        revalidatePatterns(sheetId)
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Import Failed', {
        description: error.message,
      })
    } finally {
      setUploading(false)
      if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = ''
    }
  }

  const handleDeletePattern = async (id: string) => {
    // Optimistic update using local state filter (patterns from SWR are immutable)
    // The actual mutation happens in handleDeletePattern

    try {
      const res = await fetch(`/api/custom-sheet/patterns/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete')
      }

      toast.success('Pattern deleted')
      // Revalidate patterns after deletion
      revalidatePatterns(sheetId)
    } catch (error) {
      console.error('Delete failed', error)
      toast.error('Failed to delete pattern')
    }
  }

  const _currentSheet = sheets.find((s) => s._id === sheetId)

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      <input
        type="file"
        accept=".xlsx,.csv"
        className="hidden"
        ref={hiddenFileInputRef}
        onChange={handleFileUpload}
        disabled={uploading}
      />

      {/* Header Area - ALWAYS RENDERS IMMEDIATELY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Custom <span className="text-orange-500">Sheet</span>
            </h1>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-black tracking-widest"
            >
              Private
            </Badge>
          </div>
          <p className="text-muted-foreground font-medium">
            Your personalized tracking dashboard.
          </p>
        </div>

        {/* Top Right Controls - Show skeleton while loading */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {sheetsLoading ? (
            // Skeleton for sheet selector area
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl border border-border/50">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-8 w-32 bg-muted animate-pulse rounded-lg" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded-lg" />
            </div>
          ) : (
            sheets.length >= 1 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-xl border border-border/50">
                {sheets.length >= 2 && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Using:
                  </span>
                )}
                <SheetSelector
                  currentSheetId={sheetId}
                  sheets={sheets}
                  onCreateNew={() => triggerUploadFlow('create')}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Patterns Grid */}
      <div
        className={cn(
          'grid gap-6',
          patternsLoading || patterns.length === 0
            ? 'grid-cols-1 max-w-lg mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {patternsLoading ? (
          // Skeleton loaders for patterns (NOT a full-page spinner)
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 border border-border/40 rounded-[24px] bg-card/60 animate-pulse"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-3 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-8 w-8 bg-muted rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 bg-muted rounded" />
                    <div className="h-3 w-8 bg-muted rounded" />
                  </div>
                  <div className="h-2 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </>
        ) : patterns.length > 0 ? (
          patterns.map((pattern) => (
            <PatternCard
              key={pattern.id}
              pattern={pattern}
              onDelete={handleDeletePattern}
            />
          ))
        ) : null}

        {/* Add More Problems Card - Always visible after loading */}
        {!patternsLoading && (
          <div
            onClick={() => triggerUploadFlow('append')}
            className={cn(
              'group p-5 border border-dashed border-orange-500/30 rounded-[24px] bg-orange-500/5 hover:border-orange-500/60 hover:bg-orange-500/10 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[160px] active:scale-[0.98]',
              patterns.length === 0 && 'py-12 border-2'
            )}
          >
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              {uploading && uploadContext === 'append' ? (
                <div className="animate-spin h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full" />
              ) : (
                <Plus className="h-6 w-6 text-orange-500" />
              )}
            </div>
            <div className="text-center">
              <h4 className="text-lg font-black uppercase italic group-hover:text-orange-500 transition-colors">
                {uploading && uploadContext === 'append'
                  ? 'Importing...'
                  : 'Add More Problems'}
              </h4>
              <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-60">
                Add to this sheet
              </p>
            </div>
          </div>
        )}
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        title="Sign in to Import"
        description="You need to be logged in to save your custom sheet securely."
      />

      <SheetRequirementsDialog
        open={showFormatDialog}
        onOpenChange={setShowFormatDialog}
        onConfirm={() => hiddenFileInputRef.current?.click()}
      />
    </div>
  )
}

function PatternCard({
  pattern,
  onDelete,
}: {
  pattern: CustomPattern
  onDelete: (id: string) => void
}) {
  const progress =
    pattern.total > 0 ? (pattern.solved / pattern.total) * 100 : 0
  const clampedProgress = Math.round(Math.max(0, Math.min(100, progress)))

  return (
    <div
      className={cn(
        'group p-5 border border-border/40 rounded-[24px] bg-card/60 backdrop-blur-sm hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 space-y-6 relative overflow-hidden active:scale-[0.98]'
      )}
    >
      <Link
        href={`/dashboard/custom-sheet/pattern/${pattern.id}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">View {pattern.name}</span>
      </Link>
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 -mr-12 -mt-12 rounded-full group-hover:bg-orange-500/10 transition-all duration-500 z-0" />
      <div className="flex justify-between items-start relative z-20 pointer-events-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-black text-foreground group-hover:text-orange-500 transition-colors leading-tight italic truncate max-w-[150px] uppercase">
              {pattern.name}
            </h4>
          </div>
          <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-60">
            {pattern.solved} / {pattern.total} Solved
          </p>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all z-30 relative cursor-pointer"
                title="Delete Pattern"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Pattern?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{' '}
                  <span className="font-bold text-foreground">
                    &quot;{pattern.name}&quot;
                  </span>
                  ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(pattern.id)
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all pointer-events-none">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="space-y-2 relative z-20 pointer-events-none">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="opacity-40">Progress</span>
          <span className="text-orange-500 font-black">{clampedProgress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(251,146,60,0.4)]"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
