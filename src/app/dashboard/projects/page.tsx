'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './projects-dashboard.css'

type Project = {
  id: string
  title: string
  description: string | null
  status: string | null
  progress: number | null
  updated_at: string | null
}

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, status, progress, updated_at')
      .order('updated_at', { ascending: false })

    if (error) console.error('PROJECTS LOAD ERROR:', error)
    setProjects((data as Project[]) || [])
    setLoading(false)
  }

  return (
    <main className="dashboard-page">
      <div className="projects-dashboard-actions">
        <Link href="/dashboard/projects/new">Create Project</Link>
      </div>

      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">Projects</p>
          <h1>Project Dashboard</h1>
          <p className="dashboard-hero-copy">
            Track creative work, progress, and archive finished builds.
          </p>
        </div>
      </section>

      {loading && (
        <div className="projects-dashboard-empty">
          <p>Loading projects...</p>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="projects-dashboard-empty">
          <h2>No projects yet.</h2>
          <p>Create the first project to start building the portfolio.</p>
          <Link href="/dashboard/projects/new">Create Project</Link>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="dashboard-grid">
          {projects.map(project => {
            const progress = project.progress ?? 0

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="dashboard-card project-dashboard-card"
              >
                <div className="project-top">
                  <h3>{project.title}</h3>
                  <span>{project.status || 'Planning'}</span>
                </div>
                <p>{project.description || 'No description yet.'}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <small>{progress}% complete</small>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
