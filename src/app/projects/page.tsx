import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import './projects.css'

import PageBackLink from '@/components/navigation/PageBackLink'

export const revalidate = 60

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, description, category, status, year, cover_image')
    .order('created_at', { ascending: false })

  return (
    
    <main className="projects-page">

    <PageBackLink />

      <section className="projects-hero">
        <div className="projects-hero-label">PROJECTS</div>
        <h1 className="projects-hero-headline">
          Brands Built to
          <br />
          Be Belonged To
        </h1>
      </section>

      <section className="projects-stack">
        {projects?.map((project, index) => (
          <div key={project.id} className="projects-stack-card">

            <div className="projects-stack-card-left">
              <div className="projects-stack-number">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="projects-stack-meta">
                {project.year && <span>{project.year}</span>}
                {project.category && <span>• {project.category}</span>}
              </div>

              <h2 className="projects-stack-title">{project.title}</h2>

              <p className="projects-stack-description">{project.description}</p>

              <Link
                href={`/projects/${project.slug || project.id}`}
                className="projects-stack-cta"
              >
                View Case Study →
              </Link>
            </div>

            <div className="projects-stack-card-right">
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="projects-stack-image"
                />
              ) : (
                <div className="projects-stack-image-placeholder" />
              )}
            </div>

          </div>
        ))}
      </section>

    </main>
  )
}