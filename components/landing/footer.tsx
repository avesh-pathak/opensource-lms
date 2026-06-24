import React from 'react'
import { ShieldCheck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#FB923C] flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="font-black tracking-tighter uppercase text-sm">
            Babua DSA
          </span>
        </div>
        <div className="flex gap-8 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Built for the Babua Mindset
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          © 2026 Babua DSA. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
