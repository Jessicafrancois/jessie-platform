
export default function Sidebar() {
  return (
    <aside className="editor-sidebar">
      <div className="sidebar-logo">
        Muse
      </div>

      <nav className="sidebar-nav">
        <button>Overview</button>
        <button>Drafts</button>
        <button>Published</button>
        <button>Archive</button>
      </nav>
    </aside>
  )
}

