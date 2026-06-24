'use client'

import { useState } from 'react'
import {
  Download,
  Table as TableIcon,
  FileCode,
  Calendar as CalendarIcon,
  Settings2,
  Loader2,
  CheckCircle2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDemoAction } from '@/hooks/use-demo-action'

interface ExportModalProps {
  onClose: () => void
  defaultType?: 'students' | 'results' | 'audit-logs'
}

export function ExportModal({
  onClose,
  defaultType = 'students',
}: ExportModalProps) {
  const { isDemoRestricted } = useDemoAction()
  const [type, setType] = useState(defaultType)
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf'>('xlsx')
  const [isExporting, setIsExporting] = useState(false)
  const [days, setDays] = useState(30)

  const handleExport = async () => {
    if (isDemoRestricted()) return
    setIsExporting(true)
    try {
      const res = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          format,
          filters: {
            days,
            // Add more filters as needed
          },
        }),
      })

      if (!res.ok) throw new Error('Export failed')

      // Create a blob from the response and trigger download
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      // Extract filename from header if possible
      const contentDisposition = res.headers.get('Content-Disposition')
      const filename =
        contentDisposition?.split('filename=')[1]?.replace(/"/g, '') ||
        `${type}_export.${format}`

      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Successfully exported ${type} as ${format.toUpperCase()}`)
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md border-border/50 bg-card overflow-hidden shadow-2xl scale-in-center">
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Download className="h-5 w-5" />
            <h2 className="text-sm font-black uppercase tracking-widest italic">
              Export Data System
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Select Type */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Settings2 className="h-3 w-3" /> Select Module
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'students', label: 'Students', icon: TableIcon },
                {
                  id: 'results',
                  label: 'Submission Results',
                  icon: CheckCircle2,
                },
                { id: 'audit-logs', label: 'Audit Logs', icon: FileCode },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setType(opt.id as any)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border transition-all text-sm font-bold',
                    type === opt.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </div>
                  {type === opt.id && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" /> Time Range
            </label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full bg-muted/50 border-border rounded-xl p-3 text-sm font-bold focus:ring-2 ring-primary outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={365}>Last 1 Year</option>
              <option value={1000}>All Time</option>
            </select>
          </div>

          {/* Select Format */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Select Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'xlsx', label: 'Excel', ext: '.xlsx' },
                { id: 'csv', label: 'CSV', ext: '.csv' },
                { id: 'pdf', label: 'Report', ext: '.pdf' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id as any)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                    format === f.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  )}
                >
                  <span className="text-xs font-black">{f.label}</span>
                  <span className="text-[9px] opacity-60">{f.ext}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Action */}
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full h-12 rounded-xl text-sm font-black uppercase tracking-widest italic flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating {format.toUpperCase()}...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Start Export
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
