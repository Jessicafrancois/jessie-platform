// components/journal/JournalNavigation.tsx
'use client'

interface Props {
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export default function JournalNavigation({ onPrev, onNext, hasPrev, hasNext }: Props) {
  return (
    <nav className="journal-arrows" aria-label="Browse entries">
      <button
        className="journal-arrow"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous entry"
      >
        ←
      </button>
      <button
        className="journal-arrow"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next entry"
      >
        →
      </button>
    </nav>
  )
}