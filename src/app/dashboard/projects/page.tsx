import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

import '../dashboard.css'

export default async function ProjectsDashboardPage() {
const {
data: projects,
error,
} = await supabase
.from('projects')
.select('*')
.order('created_at', {
ascending: false,
})

if (error) {
return ( <pre>
{JSON.stringify(error, null, 2)} </pre>
)
}

return ( <main className="projects-dash-page"> <DashboardHeader
     title="Projects"
     subtitle="Every venture, case study, and build — tracked and organized."
   />

  <div className="projects-dash-header">
    <Link
      href="/dashboard/projects/new"
      className="projects-dash-new"
    >
      + New Project
    </Link>
  </div>

  <div className="projects-dash-grid">
    {!projects?.length && (
      <div className="projects-dash-empty">
        <h3>No projects yet.</h3>

        <Link href="/dashboard/projects/new">
          Create your first project →
        </Link>
      </div>
    )}

    {projects?.map((project, index) => (
      <Link
        key={project.id}
        href={`/dashboard/projects/${project.id}`}
        className="projects-dash-card"
      >
        <div className="projects-dash-card-number">
          {String(index + 1).padStart(2, '0')}
        </div>

        {project.cover_image ? (
          <div className="projects-dash-card-cover">
            <img
              src={project.cover_image}
              alt={project.title}
            />
          </div>
        ) : (
          <div className="projects-dash-card-cover projects-dash-card-cover--empty" />
        )}

        <div className="projects-dash-card-body">
          <div className="projects-dash-card-meta">
            {project.year && (
              <span>{project.year}</span>
            )}

            {project.category && (
              <span>{project.category}</span>
            )}

            {project.status && (
              <span
                className={`projects-dash-status projects-dash-status--${project.status
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {project.status}
              </span>
            )}
          </div>

          <h2 className="projects-dash-card-title">
            {project.title}
          </h2>

          <p className="projects-dash-card-desc">
            {project.short_description}
          </p>
        </div>
      </Link>
    ))}
  </div>
</main>

)
}
