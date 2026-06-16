'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import '../cms.css'
import './ideas.css'

type Idea = {
  id: string
  title: string
  notes: string | null
  world_id: string | null
  project_id: string | null
  created_at: string
  worlds?: { id: string; title: string } | null
  projects?: { id: string; title: string } | null
}

type World = { id: string; title: string }
type Project = { id: string; title: string }

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [worlds, setWorlds] = useState<World[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [worldId, setWorldId] = useState('')
  const [projectId, setProjectId] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const [ideasRes, worldsRes, projectsRes] = await Promise.all([
      supabase
        .from('ideas')
        .select(`*, worlds(id, title), projects(id, title)`)
        .order('created_at', { ascending: false }),
      supabase.from('worlds').select('id, title').order('title'),
      supabase.from('projects').select('id, title').order('title'),
    ])
    setIdeas(ideasRes.data || [])
    setWorlds(worldsRes.data || [])
    setProjects(projectsRes.data || [])
  }

  function resetForm() {
    setTitle('')
    setNotes('')
    setWorldId('')
    setProjectId('')
    setEditingId(null)
    setShowForm(false)
  }

  async function saveIdea() {
    if (!title.trim()) return
    setLoading(true)

    const payload = {
      title: title.trim(),
      notes: notes.trim() || null,
      world_id: worldId || null,
      project_id: projectId || null,
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      await supabase.from('ideas').update(payload).eq('id', editingId)
    } else {
      await supabase.from('ideas').insert(payload)
    }

    await loadAll()
    resetForm()
    setLoading(false)
  }

  function startEdit(idea: Idea) {
    setTitle(idea.title)
    setNotes(idea.notes || '')
    setWorldId(idea.world_id || '')
    setProjectId(idea.project_id || '')
    setEditingId(idea.id)
    setShowForm(true)
  }

  async function deleteIdea(id: string) {
    if (!confirm('Delete this idea?')) return
    await supabase.from('ideas').delete().eq('id', id)
    loadAll()
  }

  const filtered = ideas.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="cms-page ideas-page">

      <div className="cms-header">
        <div>
          <h1>Ideas</h1>
          <p>Story concepts, essays, strategy notes, and creative sparks.</p>
        </div>
        <button
          className="ideas-new-btn"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Add Idea
        </button>
      </div>

      {showForm && (
        <div className="ideas-form">
          <div className="ideas-form-header">
            <h3>{editingId ? 'Edit Idea' : 'New Idea'}</h3>
            <button className="ideas-form-close" onClick={resetForm}>×</button>
          </div>

          <div className="ideas-form-fields">
            <input
              className="ideas-input"
              type="text"
              placeholder="Idea title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
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
                <label>Associated World</label>
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
                <label>Associated Project</label>
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
          </div>

          <div className="ideas-form-actions">
            <button className="ideas-btn-ghost" onClick={resetForm}>Cancel</button>
            <button
              className="ideas-btn-primary"
              onClick={saveIdea}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Create Idea'}
            </button>
          </div>
        </div>
      )}

      <input
        className="cms-search"
        placeholder="Search ideas..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="ideas-list">
        {filtered.length === 0 && (
          <div className="ideas-empty">
            <p>No ideas yet. Every great entry starts here.</p>
            <button className="ideas-new-btn" onClick={() => setShowForm(true)}>
              Add your first idea
            </button>
          </div>
        )}

        {filtered.map(idea => (
          <div key={idea.id} className="idea-card">
            <div className="idea-card-content">
              <h3 className="idea-title">{idea.title}</h3>
              {idea.notes && (
                <p className="idea-notes">{idea.notes}</p>
              )}
              <div className="idea-associations">
                {idea.worlds?.title && (
                  <span className="idea-tag idea-tag--world">
                    ◈ {idea.worlds.title}
                  </span>
                )}
                {idea.projects?.title && (
                  <span className="idea-tag idea-tag--project">
                    ▸ {idea.projects.title}
                  </span>
                )}
                <span className="idea-date">
                  {new Date(idea.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="idea-card-actions">
              <button
                className="idea-action-btn"
                onClick={() => startEdit(idea)}
              >
                Edit
              </button>
              <Link
                href="/dashboard/journal/new"
                className="idea-action-btn idea-action-btn--primary"
              >
                Write →
              </Link>
              <button
                className="idea-action-btn idea-action-btn--delete"
                onClick={() => deleteIdea(idea.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </main>
  )
}