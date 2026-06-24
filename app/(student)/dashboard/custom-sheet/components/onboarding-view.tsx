'use client'

import React, { useState, useRef } from 'react'
import {
  Upload,
  FileSpreadsheet,
  Lock,
  Split,
  BarChart3,
  FileType,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {} from '@/components/ui/dialog'
import {} from '@/components/ui/table'
import { SheetRequirementsDialog } from '@/components/shared/sheet-requirements-dialog'
import { revalidateSheets } from '@/hooks/use-sheets'

interface OnboardingViewProps {
  onImportSuccess: (sheetId: string) => void
}

export function OnboardingView({ onImportSuccess }: OnboardingViewProps) {
  const [uploading, setUploading] = useState(false)
  const [showFormatDialog, setShowFormatDialog] = useState(false)
  const hiddenFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setShowFormatDialog(false)

    try {
      // DIRECT ATOMIC IMPORT (Create + Import in one go)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isNewSheet', 'true')
      formData.append('mode', 'replace') // Force replace on new sheets for cleanliness

      const importRes = await fetch('/api/custom-sheet/import', {
        method: 'POST',
        body: formData,
      })

      const importData = await importRes.json()

      if (!importRes.ok) {
        throw new Error(importData.error || 'Upload failed')
      }

      const patternsCount = importData.meta?.patternsCreated ?? 0
      const problemsCount = importData.meta?.problemsCreated ?? 0
      const newSheetId = importData.sheetId

      if (!newSheetId) {
        throw new Error('Backend did not return a valid Sheet ID.')
      }

      toast.success('Sheet Created Successfully', {
        description: `Created ${patternsCount} patterns and imported ${problemsCount} problems.`,
      })

      // Revalidate SWR cache to refresh sheet list immediately
      await revalidateSheets()

      onImportSuccess(newSheetId)
    } catch (error: any) {
      console.error('Import error:', error)
      toast.error('Import Failed', {
        description: error.message,
      })
    } finally {
      setUploading(false)
      if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      <input
        type="file"
        accept=".xlsx,.csv"
        className="hidden"
        ref={hiddenFileInputRef}
        onChange={handleFileUpload}
        disabled={uploading}
      />

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <FileSpreadsheet className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Custom <span className="text-orange-500">DSA Sheet</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Import your own DSA sheet and track it privately
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Steps */}
        <div className="space-y-8">
          <div className="space-y-6">
            <StepItem
              icon={FileType}
              title="1. Prepare your sheet"
              description="Format your questions in Excel (.xlsx) or CSV. Required columns: Pattern, Problem, Difficulty, Link."
            />
            <StepItem
              icon={Upload}
              title="2. Upload your file"
              description="Drag & drop your file here. We support .xlsx and .csv formats."
            />
            <StepItem
              icon={Split}
              title="3. Automatic Splitting"
              description="We automatically categorize problems by pattern found in your sheet."
            />
            <StepItem
              icon={BarChart3}
              title="4. Track Progress"
              description="Get detailed analytics and progress tracking for your custom sheet."
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border/50 max-w-md">
            <Lock className="h-3 w-3" />
            <span>
              Your custom sheet is visible only to you. Data is stored securely.
            </span>
          </div>
        </div>

        {/* Right Side: Upload Dropzone Card */}
        <div className="relative group">
          {/* Animated Background Glow - Pure Orange as requested */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />

          <div className="relative bg-card/80 dark:bg-zinc-900/90 border border-orange-500/20 backdrop-blur-md rounded-[28px] p-8 md:p-12 text-center space-y-8 flex flex-col items-center justify-center min-h-[400px] shadow-2xl overflow-hidden">
            {/* Running Round Animation */}
            <div className="relative">
              {/* Rotating Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/50 animate-[spin_10s_linear_infinite]" />
              <div className="absolute -inset-2 rounded-full border border-orange-500/20 animate-[spin_15s_linear_infinite_reverse]" />

              <div className="h-24 w-24 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 z-10 relative group-hover:scale-105 transition-transform duration-500">
                {uploading ? (
                  <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full" />
                ) : (
                  <Upload className="h-8 w-8 text-orange-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-br from-orange-500 to-orange-700 bg-clip-text text-transparent uppercase tracking-tight">
                {uploading ? 'Parsing your sheet...' : 'Upload XLSX / CSV'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[280px] mx-auto font-medium">
                Drag and drop or click to browse.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <CustomBadge>Supported: .xlsx</CustomBadge>
              <CustomBadge>Supported: .csv</CustomBadge>
            </div>

            <div className="w-full max-w-sm">
              <div
                onClick={
                  !uploading ? () => setShowFormatDialog(true) : undefined
                }
                className={cn(
                  'cursor-pointer w-full h-12 flex items-center justify-center rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-sm transition-all hover:bg-orange-600 active:scale-[0.98] shadow-lg shadow-orange-500/20',
                  uploading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {uploading ? 'Importing...' : 'Choose File'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SheetRequirementsDialog
        open={showFormatDialog}
        onOpenChange={setShowFormatDialog}
        onConfirm={() => hiddenFileInputRef.current?.click()}
      />
    </div>
  )
}

function StepItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 group-hover:text-orange-500 transition-all duration-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

function CustomBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-lg bg-secondary/50 text-xs font-bold text-muted-foreground border border-border/10">
      {children}
    </span>
  )
}
