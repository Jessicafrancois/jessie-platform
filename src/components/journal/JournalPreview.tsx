// components/journal/JournalPreview.tsx
'use client'

import type { JournalEntry } from '@/app/dashboard/journal/page'

interface Props {
  entry: JournalEntry
  onClick: () => void
}

export default function JournalPreview({ entry, onClick }: Props) {
  return (
    <button
      className="journal-preview-wrapper"
      onClick={onClick}
      aria-label={`Go to: ${entry.title}`}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      {entry.cover_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="journal-preview-img"
          src={entry.cover_image}
          alt={entry.title}
        />
      ) : (
        <div
          className="journal-cover-placeholder"
          style={{ width: 160, height: 220 }}
        >
          <span style={{ fontSize: '0.55rem', opacity: 0.2 }}>No Cover</span>
        </div>
      )}
      <span className="journal-preview-label">Previous</span>
    </button>
  )
}