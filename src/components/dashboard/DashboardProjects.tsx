
type Project = {
  id: number
  title: string
  description: string
  status: string
  progress: number
}

type Props = {
  projects: Project[]
}

export default function DashboardProjects({
  projects,
}: Props) {

  return (

    <div className="dashboard-module glass-card">

      <p>
        Active Projects
      </p>

      <h2>
        Venture Worlds
      </h2>

      <div className="project-list">

        {projects.map((project) => (

          <div
            key={project.id}
            className="project-item"
          >

            <div className="project-top">

              <h3>
                {project.title}
              </h3>

              <span>
                {project.status}
              </span>

            </div>

            <p>
              {project.description}
            </p>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${project.progress}%`
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}
