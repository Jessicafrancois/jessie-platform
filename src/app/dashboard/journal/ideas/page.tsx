'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  flushOfflineQueue,
  readLocalValue,
  syncOrQueue,
  writeLocalValue,
} from '@/lib/offlineSync'
import './ideas.css'

// ── Types ─────────────────────────────────────────────────────────────────────

type Idea = {
  id: string
  title: string
  notes: string | null
  world_id: string | null
  project_id: string | null
  status: 'active' | 'archived' | 'converted'
  tags: string[]
  created_at: string
  updated_at: string
  worlds?:    { id: string; title: string } | null
  projects?:  { id: string; title: string } | null
}

type World   = { id: string; title: string }
type Project = { id: string; title: string }

type FilterStatus = 'active' | 'archived' | 'all'

const IDEAS_LOCAL_KEY = 'jessie:ideas'
const JOURNAL_DRAFT_LOCAL_KEY = 'jessie:entry-draft'

// ── Component ─────────────────────────────────────────────────────────────────

export default function IdeasPage() {
  const router = useRouter()

  const [ideas, setIdeas]       = useState<Idea[]>([])
  const [worlds, setWorlds]     = useState<World[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [search, setSearch]         = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active')
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)

  const [showForm, setShowForm]     = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)

  // Form fields
  const [title, setTitle]         = useState('')
  const [notes, setNotes]         = useState('')
  const [worldId, setWorldId]     = useState('')
  const [projectId, setProjectId] = useState('')
  const [tagInput, setTagInput]   = useState('')
  const [tags, setTags]           = useState<string[]>([])

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    setLoading(true)
    const localIdeas = readLocalValue<Idea[]>(IDEAS_LOCAL_KEY, [])
    if (localIdeas.length) setIdeas(localIdeas)

    const [ideasRes, worldsRes, projectsRes] = await Promise.all([
      supabase
        .from('ideas')
        .select('*, worlds(id, title), projects(id, title)')
        .order('created_at', { ascending: false }),
      supabase.from('worlds').select('id, title').order('title'),
      supabase.from('projects').select('id, title').order('title'),
    ])

    if (ideasRes.error)   console.error('ideas error:', ideasRes.error)
    if (worldsRes.error)  console.error('worlds error:', worldsRes.error)
    if (projectsRes.error) console.error('projects error:', projectsRes.error)

    if (ideasRes.data) {
      setIdeas(ideasRes.data)
      writeLocalValue(IDEAS_LOCAL_KEY, ideasRes.data)
    }
    setWorlds(worldsRes.data ?? [])
    setProjects(projectsRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    function flushQueuedChanges() {
      flushOfflineQueue(supabase).then(loadAll)
    }

    loadAll()
    flushOfflineQueue(supabase)
    window.addEventListener('online', flushQueuedChanges)

    return () => {
      window.removeEventListener('online', flushQueuedChanges)
    }
  }, [loadAll])

  // ── Form helpers ────────────────────────────────────────────────────────────

  function resetForm() {
    setTitle('')
    setNotes('')
    setWorldId('')
    setProjectId('')
    setTags([])
    setTagInput('')
    setEditingId(null)
    setShowForm(false)
  }

  function startEdit(idea: Idea) {
    setTitle(idea.title)
    setNotes(idea.notes ?? '')
    setWorldId(idea.world_id ?? '')
    setProjectId(idea.project_id ?? '')
    setTags(idea.tags ?? [])
    setTagInput('')
    setEditingId(idea.id)
    setShowForm(true)
    // Scroll to form
    setTimeout(() => document.getElementById('idea-form')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  // ── Save ────────────────────────────────────────────────────────────────────

  async function saveIdea() {
    if (!title.trim()) return
    setSaving(true)

    const now = new Date().toISOString()
    const id = editingId ?? crypto.randomUUID()
    const payload = {
      id,
      title:      title.trim(),
      notes:      notes.trim() || null,
      world_id:   worldId   || null,
      project_id: projectId || null,
      tags,
      status:     'active' as const,
      updated_at: now,
    }

    const optimisticIdea: Idea = {
      ...payload,
      created_at: ideas.find((idea) => idea.id === id)?.created_at ?? now,
      worlds: worlds.find((world) => world.id === worldId) ?? null,
      projects: projects.find((project) => project.id === projectId) ?? null,
    }

    const nextIdeas = editingId
      ? ideas.map((idea) => (idea.id === id ? { ...idea, ...optimisticIdea } : idea))
      : [optimisticIdea, ...ideas]

    setIdeas(nextIdeas)
    writeLocalValue(IDEAS_LOCAL_KEY, nextIdeas)

    const { queued, error } = await syncOrQueue(supabase, {
      table: 'ideas',
      operation: 'upsert',
      payload: optimisticIdea,
    })

    if (error) {
      console.error('Save idea error:', error)
      if (!queued) alert(`Error: ${String(error)}`)
      setSaving(false)
      return
    }

    if (!queued) await loadAll()
    resetForm()
    setSaving(false)
  }

  // ── Archive / delete ─────────────────────────────────────────────────────

  async function archiveIdea(id: string) {
    const updated_at = new Date().toISOString()
    const nextIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, status: 'archived' as const, updated_at } : idea,
    )
    setIdeas(nextIdeas)
    writeLocalValue(IDEAS_LOCAL_KEY, nextIdeas)
    await syncOrQueue(supabase, {
      table: 'ideas',
      operation: 'update',
      payload: { status: 'archived', updated_at },
      match: { id },
    })
  }

  async function restoreIdea(id: string) {
    const updated_at = new Date().toISOString()
    const nextIdeas = ideas.map((idea) =>
      idea.id === id ? { ...idea, status: 'active' as const, updated_at } : idea,
    )
    setIdeas(nextIdeas)
    writeLocalValue(IDEAS_LOCAL_KEY, nextIdeas)
    await syncOrQueue(supabase, {
      table: 'ideas',
      operation: 'update',
      payload: { status: 'active', updated_at },
      match: { id },
    })
  }

  async function deleteIdea(id: string) {
    if (!confirm('Permanently delete this idea?')) return
    const nextIdeas = ideas.filter((idea) => idea.id !== id)
    setIdeas(nextIdeas)
    writeLocalValue(IDEAS_LOCAL_KEY, nextIdeas)
    const { queued, error } = await syncOrQueue(supabase, {
      table: 'ideas',
      operation: 'delete',
      match: { id },
    })
    if (error && !queued) { alert(`Error: ${String(error)}`); return }
  }

  // ── Convert to journal entry ────────────────────────────────────────────────

  async function convertToEntry(idea: Idea) {
    // Create a draft entry pre-filled with the idea title + notes
    const entryId = crypto.randomUUID()
    const now = new Date().toISOString()
    const entryPayload = {
      id: entryId,
      title: idea.title,
      slug: idea.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
      intro: idea.notes ?? '',
      cover_image: null,
      content: {},
      collection_id: idea.world_id ?? null,
      series_id: null,
      type: 'Essay',
      featured: false,
      tags: idea.tags,
      status: 'Draft',
      published: false,
      updated_at: now,
    }

    writeLocalValue(JOURNAL_DRAFT_LOCAL_KEY, entryPayload)

    const { queued, error } = await syncOrQueue(supabase, {
      table: 'entries',
      operation: 'insert',
      payload: entryPayload,
    })

    if (error && !queued) { alert(`Error: ${String(error)}`); return }

    // Mark idea as converted
    const nextIdeas = ideas.map((item) =>
      item.id === idea.id ? { ...item, status: 'converted' as const, updated_at: now } : item,
    )
    setIdeas(nextIdeas)
    writeLocalValue(IDEAS_LOCAL_KEY, nextIdeas)
    await syncOrQueue(supabase, {
      table: 'ideas',
      operation: 'update',
      payload: { status: 'converted', updated_at: now },
      match: { id: idea.id },
    })

    if (!queued) await loadAll()
    router.push(queued ? '/dashboard/journal/new' : `/dashboard/journal/edit/${entryId}`)
  }

  // ── Filtering ───────────────────────────────────────────────────────────────

  const filtered = ideas.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      i.title.toLowerCase().includes(q) ||
      (i.notes?.toLowerCase().includes(q) ?? false) ||
      (i.worlds?.title.toLowerCase().includes(q) ?? false) ||
      (i.projects?.title.toLowerCase().includes(q) ?? false) ||
      i.tags.some(t => t.includes(q))
    )
  })

  const counts = {
    active:   ideas.filter(i => i.status === 'active').length,
    archived: ideas.filter(i => i.status === 'archived').length,
    converted:ideas.filter(i => i.status === 'converted').length,
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <main className="ideas-page">

      {/* HEADER */}
      <div className="ideas-header">
        <div>
          <h1>Ideas</h1>
          <p>Story concepts, essays, strategy notes, and creative sparks.</p>
        </div>
        <button
          className="ideas-new-btn"
          onClick={() => { resetForm(); setShowForm(true) }}
        >
          + New Idea
        </button>
      </div>

      {/* STATS */}
      <div className="ideas-stats">
        {(['active','archived','converted'] as FilterStatus[]).map(s => (
          <button
            key={s}
            className={`ideas-stat ${filterStatus === s ? 'is-active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            <span className="ideas-stat-num">{counts[s as keyof typeof counts]}</span>
            <span className="ideas-stat-label">{s}</span>
          </button>
        ))}
        <button
          className={`ideas-stat ${filterStatus === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          <span className="ideas-stat-num">{ideas.length}</span>
          <span className="ideas-stat-label">all</span>
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="ideas-form" id="idea-form">
          <div className="ideas-form-header">
            <h3>{editingId ? 'Edit Idea' : 'New Idea'}</h3>
            <button className="ideas-form-close" onClick={resetForm}>×</button>
          </div>

          <div className="ideas-form-fields">
            <input
              className="ideas-input"
              type="text"
              placeholder="What's the idea?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
            />

            <textarea
              className="ideas-textarea"
              placeholder="Notes, context, or anything you want to capture..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
            />

            <div className="ideas-form-row">
              <div className="ideas-form-field">
                <label>World</label>
                <select
                  value={worldId}
                  onChange={e => setWorldId(e.target.value)}
                  className="ideas-select"
                >
                  <option value="">No world</option>
                  {worlds.map(w => (
                    <option key={w.id} value={w.id}>{w.title}</option>
                  ))}
                </select>
              </div>

              <div className="ideas-form-field">
                <label>Project</label>
                <select
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  className="ideas-select"
                >
                  <option value="">No project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="ideas-tag-section">
              <label>Tags</label>
              <div className="ideas-tag-input-row">
                <input
                  className="ideas-input ideas-input--tag"
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
                />
                <button className="ideas-tag-add-btn" onClick={addTag} disabled={!tagInput.trim()}>
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="ideas-tags-row">
                  {tags.map(t => (
                    <span key={t} className="ideas-tag-chip">
                      {t}
                      <button onClick={() => removeTag(t)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ideas-form-actions">
            <button className="ideas-btn-ghost" onClick={resetForm}>
              Cancel
            </button>
            <button
              className="ideas-btn-primary"
              onClick={saveIdea}
              disabled={saving || !title.trim()}
            >
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Idea'}
            </button>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="ideas-search-row">
        <input
          className="ideas-search"
          placeholder="Search ideas, notes, tags…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="ideas-list">
        {loading ? (
          <div className="ideas-loading">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="ideas-empty">
            <p>
              {search
                ? 'No ideas match your search.'
                : filterStatus === 'archived'
                ? 'No archived ideas.'
                : 'No ideas yet. Every great entry starts here.'}
            </p>
            {!search && filterStatus === 'active' && (
              <button className="ideas-new-btn" onClick={() => setShowForm(true)}>
                Add your first idea
              </button>
            )}
          </div>
        ) : (
          filtered.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={startEdit}
              onArchive={archiveIdea}
              onRestore={restoreIdea}
              onDelete={deleteIdea}
              onConvert={convertToEntry}
            />
          ))
        )}
      </div>

    </main>
  )
}

// ── Idea Card ─────────────────────────────────────────────────────────────────

interface CardProps {
  idea: Idea
  onEdit: (idea: Idea) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
  onConvert: (idea: Idea) => void
}

function IdeaCard({ idea, onEdit, onArchive, onRestore, onDelete, onConvert }: CardProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = (idea.notes?.length ?? 0) > 160

  return (
    <div className={`idea-card idea-card--${idea.status}`}>
      <div className="idea-card-body">
        <div className="idea-card-top">
          <h3 className="idea-title">{idea.title}</h3>
          {idea.status === 'converted' && (
            <span className="idea-status-chip idea-status-chip--converted">Converted</span>
          )}
          {idea.status === 'archived' && (
            <span className="idea-status-chip idea-status-chip--archived">Archived</span>
          )}
        </div>

        {idea.notes && (
          <p className={`idea-notes ${expanded ? 'idea-notes--expanded' : ''}`}>
            {expanded || !isLong ? idea.notes : idea.notes.slice(0, 160) + '…'}
            {isLong && (
              <button
                className="idea-expand-btn"
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? ' less' : ' more'}
              </button>
            )}
          </p>
        )}

        <div className="idea-meta">
          {idea.worlds?.title && (
            <span className="idea-tag idea-tag--world">◈ {idea.worlds.title}</span>
          )}
          {idea.projects?.title && (
            <span className="idea-tag idea-tag--project">▸ {idea.projects.title}</span>
          )}
          {idea.tags?.map(t => (
            <span key={t} className="idea-tag idea-tag--plain">{t}</span>
          ))}
          <span className="idea-date">
            {new Date(idea.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="idea-card-actions">
        {idea.status === 'active' && (
          <>
            <button className="idea-action-btn" onClick={() => onEdit(idea)}>
              Edit
            </button>
            <button
              className="idea-action-btn idea-action-btn--primary"
              onClick={() => onConvert(idea)}
              title="Create a journal entry from this idea"
            >
              Write →
            </button>
            <button className="idea-action-btn idea-action-btn--ghost" onClick={() => onArchive(idea.id)}>
              Archive
            </button>
          </>
        )}
        {idea.status === 'archived' && (
          <>
            <button className="idea-action-btn" onClick={() => onRestore(idea.id)}>
              Restore
            </button>
            <button
              className="idea-action-btn idea-action-btn--danger"
              onClick={() => onDelete(idea.id)}
            >
              Delete
            </button>
          </>
        )}
        {idea.status === 'converted' && (
          <button className="idea-action-btn idea-action-btn--ghost" onClick={() => onArchive(idea.id)}>
            Archive
          </button>
        )}
      </div>
    </div>
  )
}
