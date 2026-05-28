'use client'

import { use, useEffect, useState } from 'react'

import PageContainer from '../../../components/layout/PageContainer'

import { supabase } from '../../../lib/supabase'

import SectionRenderer from '../../../components/sections/SectionRenderer'

export default function PublicProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const [project, setProject] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!projectData) {
        setLoading(false)
        return
      }

      setProject(projectData)

      const { data: sectionData } = await supabase
        .from('project_sections')
        .select('*')
        .eq('project_id', projectData.id)
        .order('sort_order')

      setSections(sectionData || [])
      setLoading(false)
    }

    loadProject()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading project...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex items-center justify-center">
        Project not found
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-white blur-[160px]" />

        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px]"
          style={{
            backgroundColor:
              project.accent_color || '#e8c86d',
          }}
        />
      </div>

      <PageContainer>
        <div className="py-24 relative z-10">
          <nav className="flex items-center justify-between mb-20">
            <div className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Muse Studios
            </div>

            <div className="flex gap-8 text-sm text-neutral-400">
              <a href="/projects">
                Projects
              </a>

              <a href="/about">
                About
              </a>
            </div>
          </nav>

          <div className="mb-24">
            <div
              className="text-sm uppercase tracking-[0.3em] mb-6"
              style={{
                color:
                  project.accent_color ||
                  '#e8c86d',
              }}
            >
              {project.category}
            </div>

            <h1 className="text-7xl md:text-8xl font-semibold leading-none mb-8 max-w-5xl">
              {project.title}
            </h1>

            <p className="text-2xl text-neutral-400 max-w-3xl leading-relaxed">
              {project.short_description}
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </main>
  )
}
