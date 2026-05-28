'use client'

import { use, useEffect, useState } from 'react'

import { supabase } from '../../../../lib/supabase'
import { SECTION_TYPES } from '../../../../lib/sectionTypes'

import SectionRenderer from '../../../../components/sections/SectionRenderer'

import SectionEditor from '../../../../components/editors/SectionEditor'
import SectionCard from '../../../../components/editors/SectionCard'

interface Section {
  id: string
  section_type: keyof typeof SECTION_TYPES
  title?: string
  content: any
  sort_order: number
}

export default function ProjectCMSPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const [project, setProject] = useState<any>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      const {
        data: projectData,
      } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!projectData) {
        setLoading(false)
        return
      }

      setProject(projectData)

      const {
        data: sectionData,
      } = await supabase
        .from('project_sections')
        .select('*')
        .eq('project_id', projectData.id)
        .order('sort_order')

      setSections(sectionData || [])
      setLoading(false)
    }

    loadProject()
  }, [slug])

  async function addSection(type: string) {
    if (!project) return

    const defaultContent =
      type === 'hero'
        ? {
            title: 'New Hero Section',
            subtitle: 'Describe this project...',
            image_url:
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          }
        : {
            heading: 'New Text Section',
            body: 'Write your content here...',
          }

    const { data } = await supabase
      .from('project_sections')
      .insert([
        {
          project_id: project.id,
          section_type: type,
          title: '',
          content: defaultContent,
          sort_order: sections.length,
        },
      ])
      .select()

    if (!data) return

    setSections([...sections, data[0]])
  }

  async function saveSection(
    sectionId: string,
    content: any
  ) {
    const { error } = await supabase
      .from('project_sections')
      .update({
        content,
      })
      .eq('id', sectionId)

    if (error) {
      console.error(error)
    }
  }

  async function deleteSection(
    sectionId: string
  ) {
    const { error } = await supabase
      .from('project_sections')
      .delete()
      .eq('id', sectionId)

    if (error) {
      console.error(error)
      return
    }

    setSections((prev) =>
      prev.filter((s) => s.id !== sectionId)
    )
  }

  async function moveSection(
    sectionId: string,
    direction: 'up' | 'down'
  ) {
    const currentIndex = sections.findIndex(
      (s) => s.id === sectionId
    )

    if (currentIndex === -1) return

    const targetIndex =
      direction === 'up'
        ? currentIndex - 1
        : currentIndex + 1

    if (
      targetIndex < 0 ||
      targetIndex >= sections.length
    ) {
      return
    }

    const updatedSections = [...sections]

    ;[
      updatedSections[currentIndex],
      updatedSections[targetIndex],
    ] = [
      updatedSections[targetIndex],
      updatedSections[currentIndex],
    ]

    const reordered = updatedSections.map(
      (section, index) => ({
        ...section,
        sort_order: index,
      })
    )

    setSections(reordered)

    for (const section of reordered) {
      await supabase
        .from('project_sections')
        .update({
          sort_order:
            section.sort_order,
        })
        .eq('id', section.id)
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading CMS...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-10 text-red-400">
        Project not found
      </div>
    )
  }

  return (
    <div className="p-10 text-white">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-semibold">
            {project.title}
          </h1>

          <p className="text-neutral-400 mt-2">
            {project.short_description}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => addSection('text')}
            className="px-5 py-3 rounded-xl bg-[#e8c86d] text-black font-medium"
          >
            + Text
          </button>

          <button
            onClick={() => addSection('hero')}
            className="px-5 py-3 rounded-xl bg-white/10 border border-white/10"
          >
            + Hero
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="border border-white/10 bg-[#111] rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-medium mb-3">
            No sections yet
          </h2>

          <p className="text-neutral-400">
            Add your first section to begin building this project.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <div
              key={section.id}
              className="grid lg:grid-cols-[420px_1fr] gap-8 items-start"
            >
              <div className="sticky top-6">
                <SectionCard
                  title={section.section_type}
                  actions={
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          moveSection(
                            section.id,
                            'up'
                          )
                        }
                        className="text-sm text-neutral-400 hover:text-white"
                      >
                        ↑
                      </button>

                      <button
                        onClick={() =>
                          moveSection(
                            section.id,
                            'down'
                          )
                        }
                        className="text-sm text-neutral-400 hover:text-white"
                      >
                        ↓
                      </button>

                      <button
                        onClick={() =>
                          deleteSection(
                            section.id
                          )
                        }
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  }
                >
                  <SectionEditor
                    section={section}
                    onChange={async (
                      updatedContent
                    ) => {
                      setSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                content:
                                  updatedContent,
                              }
                            : s
                        )
                      )

                      await saveSection(
                        section.id,
                        updatedContent
                      )
                    }}
                  />
                </SectionCard>
              </div>

              <div>
                <SectionRenderer
                  section={section}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}