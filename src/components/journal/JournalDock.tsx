// components/journal/JournalDock.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const DOCK_LINKS = [
  { label: 'Create',  href: '/dashboard/journal/new' },
  { label: 'Archive', href: '/dashboard/journal/archive' },
  { label: 'Drafts',  href: '/dashboard/journal/drafts' },
  { label: 'Deleted', href: '/dashboard/journal/deleted' },
]

export default function JournalDock() {
  const pathname = usePathname()

  return (
    <nav className="journal-dock" aria-label="Journal sections">
      {DOCK_LINKS.map(({ label, href }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`journal-dock-btn${isActive ? ' journal-dock-btn--active' : ''}`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}