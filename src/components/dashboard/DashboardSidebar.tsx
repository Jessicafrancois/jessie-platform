'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const PRIMARY_ITEMS = [
{ href: '/dashboard', label: 'Home' },
{ href: '/dashboard/journal', label: 'Journal' },
{ href: '/dashboard/projects', label: 'Projects' },
{ href: '/dashboard/[id]/worlds', label: 'Worlds' },
{ href: '/dashboard/media', label: 'Media' },
{ href: '/dashboard/site', label: 'Site Editor' },
{ href: '/dashboard/inquiries', label: 'Inquiries' },
]

const SECONDARY_ITEMS = [
{ href: '/dashboard/journal/drafts', label: 'Drafts' },
{ href: '/dashboard/journal/ideas', label: 'Ideas' },
{ href: '/dashboard/journal/publishing', label: 'Publishing' },
{ href: '/dashboard/journal/archive', label: 'Archive' },
{ href: '/dashboard/journal/collections', label: 'Collections' },
{ href: '/dashboard/journal/series', label: 'Series' },
{ href: '/dashboard/journal/tags', label: 'Tags' },
{ href: '/dashboard/moodboards', label: 'Moodboards' },

{ href: '/dashboard/fonts', label: 'Fonts' },

]

export default function DashboardSidebar() {
const [showMore, setShowMore] = useState(false)

async function handleLogout() {
await supabase.auth.signOut()
window.location.href = '/login'
}

return ( <aside className="dashboard-dock"> <div className="dashboard-brand">
Jessie </div>

  <nav className="dashboard-dock-nav">
    {PRIMARY_ITEMS.map((item) => (
      <a
        key={item.href}
        href={item.href}
        className="dashboard-nav-item"
      >
        {item.label}
      </a>
    ))}

    <button
      className="dashboard-more-button"
      onClick={() => setShowMore(!showMore)}
      type="button"
    >
      <Menu size={18} />
    </button>

    {showMore && (
      <div className="dashboard-more-menu">
        {SECONDARY_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="dashboard-nav-item"
          >
            {item.label}
          </a>
        ))}

        <a
          href="/"
          className="dashboard-nav-item"
        >
          View Site
        </a>

        <button
          onClick={handleLogout}
          className="logout-button"
          type="button"
        >
          Logout
        </button>
      </div>
    )}
  </nav>
</aside>


)
}
