'use client'

type Entry = {
  title: string
  updated_at: string
}

type Project = {
  id: string
  title: string
  created_at: string
}

type Props = {
  entries: Entry[]
  projects: Project[]
}

export default function RecentActivity({
  entries,
  projects,
}: Props) {

  const activity = [

    ...entries.map((entry) => ({
      type: 'Entry',
      action: 'Edited',
      title: entry.title,
      date: entry.updated_at,
    })),

    ...projects.map((project) => ({
      type: 'Project',
      action: 'Updated',
      title: project.title,
      date: project.created_at,
    })),

  ]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5)

    

  return (

    <div className="recent-activity glass-card">

      <p className="dashboard-label">
        Recent Activity
      </p>

      <h2>
        Latest Changes
      </h2>

      <div className="activity-list">

        {activity.map((item, index) => (

          <div
            key={index}
            className="activity-item"
          >

            <span className="activity-type">
              {item.type}
            </span>

            <div>

              <strong>
                {item.action}
              </strong>

              <p>
                {item.title}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}