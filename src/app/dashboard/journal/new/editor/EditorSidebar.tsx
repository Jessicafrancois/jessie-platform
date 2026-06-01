import Link from 'next/link'

const editorNavItems = [
  {
    label: 'Back to Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Drafts',
    href: '/dashboard/journal/drafts',
  },
  {
    label: 'Archives',
    href: '/dashboard/journal/archive',
  },
  {
    label: 'Ideas',
    href: '/dashboard/journal/ideas',
  },
]

export default function EditorSidebar() {
  return (
    <aside className="editor-sidebar">
      <div className="sidebar-logo">
        Muse
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Journal editor"
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
