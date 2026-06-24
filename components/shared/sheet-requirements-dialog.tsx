'use client'

import React from 'react'
import { FileSpreadsheet, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SheetRequirementsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function SheetRequirementsDialog({
  open,
  onOpenChange,
  onConfirm,
}: SheetRequirementsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[560px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-3xl border-2">
        {/* Header Section - Fixed at top */}
        <DialogHeader className="px-6 pt-6 pb-4 space-y-3">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-orange-500 shrink-0" />
            <span>
              Sheet <span className="text-orange-500">Requirements</span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Please ensure your Excel or CSV sheet has the following columns for
            automatic parsing.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-6">
            {/* Required Columns Section */}
            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-3">
                Required Columns
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Pattern', 'Problem', 'Difficulty', 'Link'].map((col) => (
                  <div
                    key={col}
                    className="flex items-center gap-2 p-3 bg-background rounded-xl border border-orange-500/20 shadow-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                    <span className="font-bold text-sm uppercase tracking-tight">
                      {col}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-600 px-2 py-1 rounded">
                  Supported: .xlsx
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-600 px-2 py-1 rounded">
                  Supported: .csv
                </span>
              </div>
            </div>

            {/* Example Structure Section */}
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 dark:text-gray-300">
                Example Structure
              </div>
              <div className="rounded-2xl border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                          Pattern
                        </TableHead>
                        <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                          Problem
                        </TableHead>
                        <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                          Difficulty
                        </TableHead>
                        <TableHead className="h-10 text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                          Link
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="font-bold text-xs uppercase tracking-tight whitespace-nowrap">
                          Sliding Window
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          Max Sum...
                        </TableCell>
                        <TableCell className="text-xs font-black text-green-500 uppercase tracking-tighter whitespace-nowrap">
                          Easy
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                          leetcode...
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="font-bold text-xs uppercase tracking-tight whitespace-nowrap">
                          Two Pointers
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          Pair Sum...
                        </TableCell>
                        <TableCell className="text-xs font-black text-yellow-500 uppercase tracking-tighter whitespace-nowrap">
                          Medium
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                          leetcode...
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <p className="text-[9px] sm:hidden text-gray-700 dark:text-gray-300 text-center italic">
                ← Scroll table horizontally →
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section - Fixed at bottom */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/10 flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold uppercase tracking-widest text-sm h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest gap-2 rounded-xl shadow-lg shadow-orange-500/20 text-sm h-11 px-6"
          >
            <Upload className="h-4 w-4" />
            Select File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
