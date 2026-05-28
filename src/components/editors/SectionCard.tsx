'use client'

import { useState } from 'react'

interface SectionCardProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export default function SectionCard({
  title,
  children,
  actions,
}: SectionCardProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0f0f0f]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          <span className="text-neutral-500">
            {open ? '−' : '+'}
          </span>

          <span className="font-medium">
            {title}
          </span>
        </button>

        {actions}
      </div>

      {open && (
        <div className="p-5">
          {children}
        </div>
      )}
    </div>
  )
}