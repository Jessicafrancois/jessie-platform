type Props = {
  handleLogout: () => void
}

export default function DashboardDock({
  handleLogout,
}: Props) {

  return (

    <aside className="dashboard-dock">

      <div className="dashboard-brand">
        Jessie
      </div>

      <nav className="dashboard-dock-nav">

        <a href="/dashboard">
          Home
        </a>

        <a href="/dashboard/journal/new">
          Journal
        </a>

        <a href="/dashboard/projects">
          Projects
        </a>

        <a href="/dashboard/inquiries">
          Inquiries
        </a>

        <a href="/">
          Site
        </a>

        <button
          onClick={handleLogout}
          className="logout-button"
        >

          Logout

        </button>

      </nav>

    </aside>
  )
}

