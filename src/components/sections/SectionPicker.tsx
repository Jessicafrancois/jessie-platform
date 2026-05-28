'use client'

import { SECTION_REGISTRY } from '@/sections/registry'

type Props = {
  onSelect: (type: string) => void
}

export default function SectionPicker({
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.values(SECTION_REGISTRY).map((section) => (
        <button
          key={section.type}
          onClick={() => onSelect(section.type)}
          className="rounded-2xl border border-white/10 bg-black p-6 text-left transition hover:border-white/30"
        >
          <div className="mb-2 text-lg font-semibold text-white">
            {section.label}
          </div>

          <div className="text-sm text-white/50">
            {section.type}
          </div>
        </button>
      ))}
    </div>
  )
}