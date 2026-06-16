'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import '../../projects/[id]/project-edit.css' // Reuse project-edit.css

const WORLD_TYPES = ['Brand', 'Story', 'Community', 'Ecosystem', 'Concept']
const WORLD_STATUSES = ['Active', 'In Development', 'On Hold', 'Archived']

type Props = { params: Promise<{ id: string }> }

export default function WorldEditPage({ params }: Props) {
  const router = useRouter()
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('Active')
  const [coverImage, setCoverImage] = useState('')
  const [philosophy, setPhilosophy] = useState('')
  const [narrative, setNarrative] = useState('')
  const [vision, setVision] = useState('')

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      loadWorld(p.id)
    })
  }, [])

  async function loadWorld(worldId: string) {
    const { data } = await supabase
      .from('worlds')
      .select('*')
      .eq('id', worldId)
      .single()

    if (!data) { router.push('/dashboard/worlds'); return }

    setTitle(data.title || '')
    setSlug(data.slug || '')
    setDescription(data.description || '')
    setType(data.type || '')
    setStatus(data.status || 'Active')
    setCoverImage(data.cover_image || '')
    setPhilosophy(data.philosophy || '')
    setNarrative(data.narrative || '')
    setVision(data.vision || '')
    setLoading(false)
  }

  async function save() {
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')

    const { error: dbError } = await supabase
      .from('worlds')
      .update({
        title: title.trim(),
        slug: slug || null,
        description: description.trim() || null,
        type: type || null,
        status,
        cover_image: coverImage.trim() || null,
        philosophy: philosophy.trim() || null,
        narrative: narrative.trim() || null,
        vision: vision.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (dbError) { setError(dbError.message); setSaving(false); return }
    router.push('/dashboard/worlds')
  }

  async function deleteWorld() {
    if (!confirm('Delete this world permanently?')) return
    await supabase.from('worlds').delete().eq('id', id)
    router.push('/dashboard/worlds')
  }

  if (loading) return <div className="project-edit-loading">Loading...</div>

  return (
    <div className="project-edit">
      <div className="project-edit-header">
        <div>
          <Link href="/dashboard/worlds" className="project-edit-back">← Worlds</Link>
          <h1>Edit World</h1>
        </div>
        <div className="project-edit-header-actions">
          <button className="project-edit-delete" onClick={deleteWorld}>Delete</button>
          <button className="project-edit-save" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="project-edit-error">{error}</div>}

      <div className="project-edit-body">
        <div className="project-edit-main">

          <div className="project-edit-field">
            <label>World Name</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="project-edit-row" style={{ gridTemplateColumns: '2fr 1fr 1.5fr' }}>
            <div className="project-edit-field">
              <label>URL Slug</label>
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="world-slug" />
            </div>
            <div className="project-edit-field">
              <label>Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="">Select type</option>
                {WORLD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="project-edit-field">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {WORLD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="project-edit-field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="project-edit-field">
            <label>Cover Image URL</label>
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
            {coverImage && (
              <div className="project-edit-cover-preview">
                <img src={coverImage} alt="Preview" />
              </div>
            )}
          </div>

          <div className="project-edit-divider"><span>World Narrative</span></div>

          <div className="project-edit-field">
            <label>Philosophy</label>
            <textarea value={philosophy} onChange={e => setPhilosophy(e.target.value)} rows={4} />
          </div>

          <div className="project-edit-field">
            <label>The Story / Narrative</label>
            <textarea value={narrative} onChange={e => setNarrative(e.target.value)} rows={5} />
          </div>

          <div className="project-edit-field">
            <label>The Vision</label>
            <textarea value={vision} onChange={e => setVision(e.target.value)} rows={4} />
          </div>

        </div>

        <div className="project-edit-sidebar">
          <p className="project-edit-sidebar-label">Preview</p>
          <div className="project-edit-preview">
            <div className="project-edit-preview-cover">
              {coverImage
                ? <img src={coverImage} alt="" />
                : <div className="project-edit-preview-empty">{title[0]?.toUpperCase() || '?'}</div>
              }
            </div>
            <div className="project-edit-preview-body">
              <div className="project-edit-preview-meta">{type && <span>{type}</span>}</div>
              <h3>{title || 'World Name'}</h3>
              <p>{description || 'Description...'}</p>
            </div>
          </div>
          {slug && (
            <a
              href={`/worlds/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="project-edit-view-public"
            >
              View Public Page →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}