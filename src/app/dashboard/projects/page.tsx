'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

interface Project {
  id: string
  title: string
  slug: string
  short_description?: string
  category?: string
  status?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setError(error.message)
        setLoading(false)
        return
      }

      setProjects(data || [])
      setLoading(false)
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading projects...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-red-400">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="p-10 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold">
            Projects
          </h1>

          <p className="text-neutral-400 mt-2">
            Manage ventures, case studies, and world-building systems.
          </p>
        </div>

        <button className="px-5 py-3 rounded-xl bg-[#e8c86d] text-black font-medium hover:opacity-90 transition">
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="border border-white/10 bg-[#111] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-medium mb-3">
            No projects yet
          </h2>

          <p className="text-neutral-400">
            Create your first project inside Supabase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:bg-[#181818] transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-medium">
                    {project.title}
                  </h2>

                  <p className="text-neutral-400 mt-2 max-w-2xl">
                    {project.short_description}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    {project.category && (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        {project.category}
                      </span>
                    )}

                    {project.status && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#e8c86d]/10 text-[#e8c86d] border border-[#e8c86d]/20">
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-[#e8c86d]">
                  /{project.slug}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}