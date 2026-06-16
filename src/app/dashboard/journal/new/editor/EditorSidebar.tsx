import Link from 'next/link'

const editorNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Journal',
    href: '/dashboard/journal',
  },
  {
    label: 'Drafts',
    href: '/dashboard/journal/drafts',
  },
  {
    label: 'Ideas',
    href: '/dashboard/journal/ideas',
  },
  {
    label: 'Archive',
    href: '/dashboard/journal/archive',
  },
  {
    label: 'Projects',
    href: '/admin/projects',
  },
  {
    label: 'Media',
    href: '/admin/media',
  },
  {
    label: 'CMS',
    href: '/admin/cms',
  },
]

export default function EditorSidebar() {
  return (
    <aside className="editor-sidebar">

      <nav
        className="sidebar-nav"
        aria-label="Editor Navigation"
      >
        {editorNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

    </aside>
  )
}