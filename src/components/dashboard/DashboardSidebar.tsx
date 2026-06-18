'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV_SECTIONS = [
{
label: 'Content',
items: [
{ href: '/dashboard/journal', label: 'Journal' },
{ href: '/dashboard/journal/drafts', label: 'Drafts' },
{ href: '/dashboard/journal/ideas', label: 'Ideas' },
{ href: '/dashboard/journal/publishing', label: 'Publishing' },
{ href: '/dashboard/journal/archive', label: 'Archive' },
{ href: '/dashboard/journal/collections', label: 'Collections' },
{ href: '/dashboard/journal/series', label: 'Series' },
{ href: '/dashboard/journal/tags', label: 'Tags' },
{ href: '/worlds', label: 'Worlds Dashboard' },],
},

{
label: 'Creation',
items: [
{ href: '/dashboard/projects', label: 'Projects' },
{ href: '/dashboard/worlds', label: 'Worlds' },
{ href: '/dashboard/moodboards/[id]', label: 'Moodboards' },
{ href: '/dashboard/media', label: 'Media' },
],
},

{
label: 'System',
items: [
{ href: '/dashboard/fonts', label: 'Fonts' },
{ href: '/dashboard/site', label: 'Site Editor' },
{ href: '/dashboard/inquiries', label: 'Inquiries' },
],
},
]

export default function DashboardSidebar() {
const [openSections, setOpenSections] = useState({
Content: true,
Creation: true,
System: false,
})

async function handleLogout() {
await supabase.auth.signOut()
window.location.href = '/login'
}

function toggleSection(section: string) {
setOpenSections(prev => ({
...prev,
[section]: !prev[section as keyof typeof prev],
}))
}

return ( <aside className="dashboard-dock"> <div className="dashboard-brand">
Jessie </div>

  <a
    href="/dashboard"
    className="dashboard-nav-item dashboard-home-link"
  >
    Home
  </a>

  <nav className="dashboard-dock-nav">

    {NAV_SECTIONS.map(section => (
      <div
        key={section.label}
        className="dashboard-nav-section"
      >
        <button
          type="button"
          className="dashboard-section-header"
          onClick={() =>
            toggleSection(section.label)
          }
        >
          <span>{section.label}</span>

          {openSections[
            section.label as keyof typeof openSections
          ] ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {openSections[
          section.label as keyof typeof openSections
        ] && (
          <div className="dashboard-section-items">
            {section.items.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="dashboard-nav-item dashboard-nav-item--nested"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    ))}

    <div className="dashboard-sidebar-footer">
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

  </nav>
</aside>


)
}
