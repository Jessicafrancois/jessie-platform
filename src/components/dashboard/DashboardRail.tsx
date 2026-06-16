
type Inquiry = {
  name: string
  email: string
  company: string
}

type DashboardRailProps = {
  inquiries: Inquiry[]
  projects: any[]
  entries: any[]
}

export default function DashboardRail({
  inquiries,
  projects,
  entries,
}: DashboardRailProps) {

  const latestInquiry =
    inquiries[0]
    

  return (

    <aside className="dashboard-rail">

      <div className="glass-card rail-card">

  <p className="dashboard-label">
    Today's Focus
  </p>

  <div className="focus-stat">

    <strong>
      {projects.length}
    </strong>

    <span>
      Active Projects
    </span>

  </div>

  <div className="focus-stat">

    <strong>
      {
        entries.filter(
          (entry: any) =>
            entry.status?.toLowerCase() === 'draft'
        ).length
      }
    </strong>

    <span>
      Draft Entries
    </span>

  </div>

  <div className="focus-stat">

    <strong>
      {inquiries.length}
    </strong>

    <span>
      Open Leads
    </span>

  </div>

</div>

      <div className="glass-card rail-card">

  <p className="dashboard-label">
    Active Projects
  </p>

  {projects.slice(0, 3).map((project: any) => (

    <div
      key={project.id}
      className="rail-item"
    >

      <strong>
        {project.title}
      </strong>

      <span>
        {project.status}
      </span>

    </div>

  ))}

</div>

<div className="glass-card rail-card">

  <p className="dashboard-label">
    Recent Entries
  </p>

  {entries.slice(0, 5).map((entry: any) => (

    <div
      key={entry.slug}
      className="rail-item"
    >

      <strong>
        {entry.title}
      </strong>

      <span>
        {entry.status}
      </span>

    </div>

  ))}

</div>

<div className="glass-card rail-card">

  <p className="dashboard-label">
    Open Inquiries
  </p>

  <h3>
    {inquiries.length} Active Leads
  </h3>

  {latestInquiry ? (

    <div className="rail-item">

      <strong>
        {latestInquiry.name}
      </strong>

      <span>
        {latestInquiry.company}
      </span>

      <span>
        {latestInquiry.email}
      </span>

    </div>

  ) : (

    <p>
      No inquiries yet.
    </p>

  )}

</div>
</aside>
  )

}