// app/admin/cms/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

/*
  IMPORTANT:
  This is NOT a rewrite.
  This is a direct migration layer from the existing HTML CMS.

  Goals:
  - preserve workflows
  - preserve state shape
  - preserve Supabase structure
  - preserve section schemas
  - preserve drag/drop
  - preserve preview system

  Phase 1:
  Single-file parity migration.
*/

// ─────────────────────────────────────────────────────────────
// Supabase
// Replace with your existing env setup after parity is confirmed
// ─────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─────────────────────────────────────────────────────────────
// Types
// DO NOT over-type content yet
// ─────────────────────────────────────────────────────────────

type ViewType = 'projects' | 'cms' | 'preview' | 'media' | 'sql'

interface Project {
  id: string
  title: string
  slug: string
  category?: string
  status?: string
  short_description?: string
  created_at?: string
}

interface ProjectSection {
  id: string
  project_id: string
  section_type: string
  title?: string
  sort_order: number
  content: any
}

interface CMSState {
  view: ViewType
  projects: Project[]
  currentProject: Project | null
  sections: ProjectSection[]
  editingSection: ProjectSection | null
  draggingIdx: number | null
  uploading: boolean
}

// ─────────────────────────────────────────────────────────────
// Section metadata
// direct migration from existing file
// ─────────────────────────────────────────────────────────────

const SECTION_TYPES = {
  hero: {
    label: 'Hero',
    icon: '🎯',
    color: 'bg-purple-500/10 text-purple-300',
    desc: 'Large hero with title & media',
  },
  text: {
    label: 'Text',
    icon: '📝',
    color: 'bg-blue-500/10 text-blue-300',
    desc: 'Rich text with optional heading',
  },
  gallery: {
    label: 'Gallery',
    icon: '🖼️',
    color: 'bg-green-500/10 text-green-300',
    desc: 'Image gallery with layouts',
  },
  quote: {
    label: 'Quote',
    icon: '💬',
    color: 'bg-yellow-500/10 text-yellow-300',
    desc: 'Pull quote',
  },
  timeline: {
    label: 'Timeline',
    icon: '📅',
    color: 'bg-cyan-500/10 text-cyan-300',
    desc: 'Timeline events',
  },
  metrics: {
    label: 'Metrics',
    icon: '📊',
    color: 'bg-pink-500/10 text-pink-300',
    desc: 'Results & metrics',
  },
  process: {
    label: 'Process',
    icon: '⚙️',
    color: 'bg-teal-500/10 text-teal-300',
    desc: 'Process steps',
  },
  reflection: {
    label: 'Reflection',
    icon: '💡',
    color: 'bg-orange-500/10 text-orange-300',
    desc: 'Insights',
  },
  moodboard: {
    label: 'Moodboard',
    icon: '🎨',
    color: 'bg-sky-500/10 text-sky-300',
    desc: 'Visual references',
  },
  related: {
    label: 'Related',
    icon: '🔗',
    color: 'bg-amber-500/10 text-amber-300',
    desc: 'Related projects',
  },
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function CMSPage() {
  const [state, setState] = useState<CMSState>({
    view: 'projects',
    projects: [],
    currentProject: null,
    sections: [],
    editingSection: null,
    draggingIdx: null,
    uploading: false,
  })

  const [loading, setLoading] = useState(true)

  // ─────────────────────────────────────────────────────────
  // Initial Load
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setLoading(true)

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setState((prev) => ({
      ...prev,
      projects: data || [],
    }))

    setLoading(false)
  }

  // ─────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────

  function nav(view: ViewType) {
    setState((prev) => ({
      ...prev,
      view,
    }))
  }

  // ─────────────────────────────────────────────────────────
  // Open CMS
  // ─────────────────────────────────────────────────────────

  async function openCMS(projectId: string) {
    const project = state.projects.find((p) => p.id === projectId)

    const { data, error } = await supabase
      .from('project_sections')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order')

    if (error) {
      console.error(error)
      return
    }

    setState((prev) => ({
      ...prev,
      currentProject: project || null,
      sections: data || [],
      view: 'cms',
    }))
  }

  // ─────────────────────────────────────────────────────────
  // Add Section
  // preserve content schema
  // ─────────────────────────────────────────────────────────

  function getDefaultContent(type: string) {
    switch (type) {
      case 'hero':
        return {
          title: '',
          subtitle: '',
          image_url: '',
          cta_text: '',
          cta_url: '',
        }

      case 'text':
        return {
          heading: '',
          body: '',
        }

      case 'gallery':
        return {
          layout: 'grid',
          images: [],
        }

      case 'quote':
        return {
          quote: '',
          author: '',
          role: '',
        }

      case 'timeline':
        return {
          events: [],
        }

      case 'metrics':
        return {
          metrics: [],
        }

      case 'process':
        return {
          steps: [],
        }

      case 'reflection':
        return {
          heading: '',
          insights: [],
        }

      case 'moodboard':
        return {
          images: [],
          theme: '',
        }

      case 'related':
        return {
          project_ids: [],
        }

      default:
        return {}
    }
  }

  async function addSection(type: string) {
    if (!state.currentProject) return

    const payload = {
      project_id: state.currentProject.id,
      section_type: type,
      sort_order: state.sections.length,
      content: getDefaultContent(type),
    }

    const { data, error } = await supabase
      .from('project_sections')
      .insert([payload])
      .select()

    if (error) {
      console.error(error)
      return
    }

    setState((prev) => ({
      ...prev,
      sections: [...prev.sections, data[0]],
    }))
  }

  // ─────────────────────────────────────────────────────────
  // Edit Section
  // preserve editing workflow
  // ─────────────────────────────────────────────────────────

  function editSection(sectionId: string) {
    const section = state.sections.find((s) => s.id === sectionId)

    if (!section) return

    setState((prev) => ({
      ...prev,
      editingSection: structuredClone(section),
    }))
  }

  function updateContent(key: string, value: any) {
    if (!state.editingSection) return

    setState((prev) => ({
      ...prev,
      editingSection: {
        ...prev.editingSection!,
        content: {
          ...prev.editingSection!.content,
          [key]: value,
        },
      },
    }))
  }

  async function saveSection() {
    if (!state.editingSection) return

    const section = state.editingSection

    const { error } = await supabase
      .from('project_sections')
      .update({
        title: section.title,
        content: section.content,
      })
      .eq('id', section.id)

    if (error) {
      console.error(error)
      return
    }

    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === section.id ? section : s
      ),
      editingSection: null,
    }))
  }

  // ─────────────────────────────────────────────────────────
  // Drag + Drop
  // preserve algorithm
  // ─────────────────────────────────────────────────────────

  function dragStart(index: number) {
    setState((prev) => ({
      ...prev,
      draggingIdx: index,
    }))
  }

  async function dragDrop(toIndex: number) {
    if (state.draggingIdx === null) return

    const from = state.draggingIdx

    if (from === toIndex) return

    const arr = [...state.sections]

    const [item] = arr.splice(from, 1)

    arr.splice(toIndex, 0, item)

    const updated = arr.map((s, i) => ({
      ...s,
      sort_order: i,
    }))

    setState((prev) => ({
      ...prev,
      sections: updated,
      draggingIdx: null,
    }))

    await Promise.all(
      updated.map((s) =>
        supabase
          .from('project_sections')
          .update({
            sort_order: s.sort_order,
          })
          .eq('id', s.id)
      )
    )
  }

  // ─────────────────────────────────────────────────────────
  // Render Helpers
  // migrated from string templates
  // ─────────────────────────────────────────────────────────

  function renderSectionPreview(section: ProjectSection) {
    const c = section.content || {}

    switch (section.section_type) {
      case 'hero':
        return (
          <div className="rounded-xl bg-zinc-900 overflow-hidden border border-zinc-800">
            {c.image_url && (
              <img
                src={c.image_url}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">
                {c.title || 'Hero Title'}
              </h2>

              {c.subtitle && (
                <p className="text-zinc-400">
                  {c.subtitle}
                </p>
              )}
            </div>
          </div>
        )

      case 'text':
        return (
          <div>
            {c.heading && (
              <h3 className="text-xl font-semibold mb-4">
                {c.heading}
              </h3>
            )}

            <div className="text-zinc-300 whitespace-pre-wrap leading-7">
              {c.body}
            </div>
          </div>
        )

      case 'quote':
        return (
          <div className="border-l-4 border-yellow-400 pl-6 py-2">
            <blockquote className="text-xl italic">
              "{c.quote}"
            </blockquote>

            {c.author && (
              <div className="mt-3 text-zinc-400 text-sm">
                — {c.author}
              </div>
            )}
          </div>
        )

      case 'gallery':
        return (
          <div className="grid grid-cols-2 gap-4">
            {(c.images || []).map((img: any, i: number) => (
              <div
                key={i}
                className="aspect-video rounded-lg overflow-hidden bg-zinc-900"
              >
                {img.url && (
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="text-zinc-500">
            Preview not available
          </div>
        )
    }
  }

  // ─────────────────────────────────────────────────────────
  // Editor Renderer
  // preserve editor structure
  // ─────────────────────────────────────────────────────────

  function renderEditorFields(section: ProjectSection) {
    const c = section.content || {}

    switch (section.section_type) {
      case 'hero':
        return (
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Hero Title
              </label>

              <input
                value={c.title || ''}
                onChange={(e) =>
                  updateContent('title', e.target.value)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Subtitle
              </label>

              <textarea
                value={c.subtitle || ''}
                onChange={(e) =>
                  updateContent('subtitle', e.target.value)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 min-h-[120px]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Image URL
              </label>

              <input
                value={c.image_url || ''}
                onChange={(e) =>
                  updateContent('image_url', e.target.value)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
              />
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Heading
              </label>

              <input
                value={c.heading || ''}
                onChange={(e) =>
                  updateContent('heading', e.target.value)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Body
              </label>

              <textarea
                value={c.body || ''}
                onChange={(e) =>
                  updateContent('body', e.target.value)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 min-h-[240px]"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-zinc-500">
            Editor not migrated yet
          </div>
        )
    }
  }

  // ─────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}

      <aside className="w-[240px] border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="text-lg font-semibold">
            ✦ Jessie
          </div>

          <div className="text-sm text-zinc-500 mt-1">
            Content Platform
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => nav('projects')}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              state.view === 'projects'
                ? 'bg-zinc-800'
                : 'hover:bg-zinc-900'
            }`}
          >
            Projects
          </button>
        </div>
      </aside>

      {/* Main */}

      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Topbar */}

        <div className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
          <div className="font-medium">
            {state.view === 'projects' && 'Projects'}
            {state.view === 'cms' &&
              state.currentProject?.title}
          </div>

          {state.view === 'cms' && (
            <button
              onClick={() => addSection('text')}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm"
            >
              + Add Section
            </button>
          )}
        </div>

        {/* Content */}

        <div className="flex-1 overflow-auto">
          {/* Projects */}

          {state.view === 'projects' && (
            <div className="p-8 space-y-4">
              {loading && (
                <div className="text-zinc-500">
                  Loading...
                </div>
              )}

              {state.projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-zinc-800 rounded-xl p-6 bg-zinc-950 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-lg">
                      {project.title}
                    </div>

                    <div className="text-sm text-zinc-500 mt-1">
                      {project.slug}
                    </div>
                  </div>

                  <button
                    onClick={() => openCMS(project.id)}
                    className="border border-zinc-700 px-4 py-2 rounded-lg text-sm hover:bg-zinc-900"
                  >
                    Edit Sections
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CMS */}

          {state.view === 'cms' && (
            <div className="grid grid-cols-[420px_1fr] h-full">
              {/* Section List */}

              <div className="border-r border-zinc-800 overflow-auto p-6">
                <div className="space-y-3">
                  {state.sections.map((section, index) => {
                    const meta =
                      SECTION_TYPES[
                        section.section_type as keyof typeof SECTION_TYPES
                      ]

                    return (
                      <div
                        key={section.id}
                        draggable
                        onDragStart={() => dragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => dragDrop(index)}
                        className="border border-zinc-800 rounded-xl p-4 bg-zinc-950 cursor-move"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`text-xs px-2 py-1 rounded ${meta?.color}`}
                          >
                            {meta?.icon} {meta?.label}
                          </div>

                          <button
                            onClick={() =>
                              editSection(section.id)
                            }
                            className="text-sm text-zinc-400 hover:text-white"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="text-sm text-zinc-500">
                          {section.title ||
                            section.section_type}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Editor */}

              <div className="grid grid-cols-2 h-full">
                {/* Form */}

                <div className="overflow-auto p-8 border-r border-zinc-800">
                  {state.editingSection ? (
                    <>
                      <div className="mb-8">
                        <label className="block mb-2 text-sm text-zinc-400">
                          Section Title
                        </label>

                        <input
                          value={
                            state.editingSection.title || ''
                          }
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              editingSection: {
                                ...prev.editingSection!,
                                title: e.target.value,
                              },
                            }))
                          }
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
                        />
                      </div>

                      {renderEditorFields(
                        state.editingSection
                      )}

                      <div className="mt-8">
                        <button
                          onClick={saveSection}
                          className="bg-white text-black px-5 py-3 rounded-lg"
                        >
                          Save Section
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-500">
                      Select a section to edit
                    </div>
                  )}
                </div>

                {/* Preview */}

                <div className="overflow-auto p-8 bg-zinc-950">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-6">
                    Live Preview
                  </div>

                  {state.editingSection &&
                    renderSectionPreview(
                      state.editingSection
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}