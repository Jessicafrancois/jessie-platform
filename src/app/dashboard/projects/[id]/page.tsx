'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import './project-edit.css'

type Props = { params: Promise<{ id: string }> }

export default function ProjectEditPage({ params }: Props) {
  const router = useRouter()
  const [id, setId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('Planning')
  const [year, setYear] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [story, setStory] = useState('')
  const [challenge, setChallenge] = useState('')
  const [solution, setSolution] = useState('')
  const [outcome, setOutcome] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      loadProject(p.id)
    })
  }, [])

  async function loadProject(projectId: string) {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (!data) {
      router.push('/dashboard/projects')
      return
    }

    setTitle(data.title || '')
    setSlug(data.slug || '')
    setDescription(data.description || '')
    setCategory(data.category || '')
    setStatus(data.status || 'Planning')
    setYear(data.year || '')
    setCoverImage(data.cover_image || '')
    setStory(data.story || '')
    setChallenge(data.challenge || '')
    setSolution(data.solution || '')
    setOutcome(data.outcome || '')
    setProgress(data.progress || 0)
    setLoading(false)
  }

  async function save() {
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')

    const { error: dbError } = await supabase
      .from('projects')
      .update({
        title: title.trim(),
        slug: slug || null,
        description: description.trim() || null,
        category: category.trim() || null,
        status,
        year: year.trim() || null,
        cover_image: coverImage.trim() || null,
        story: story.trim() || null,
        challenge: challenge.trim() || null,
        solution: solution.trim() || null,
        outcome: outcome.trim() || null,
        progress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (dbError) { setError(dbError.message); setSaving(false); return }
    router.push('/dashboard/projects')
  }

  async function deleteProject() {
    if (!confirm('Delete this project permanently?')) return
    await supabase.from('projects').delete().eq('id', id)
    router.push('/dashboard/projects')
  }

  if (loading) return <div className="project-edit-loading">Loading...</div>

  return (
    <div className="project-edit">

      <div className="project-edit-header">
        <div>
          <Link href="/dashboard/projects" className="project-edit-back">← Projects</Link>
          <h1>Edit Project</h1>
        </div>
        <div className="project-edit-header-actions">
          <button className="project-edit-delete" onClick={deleteProject}>Delete</button>
          <button className="project-edit-save" onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="project-edit-error">{error}</div>}

      <div className="project-edit-body">
        <div className="project-edit-main">

          <div className="project-edit-field">
            <label>Project Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="project-edit-row">
            <div className="project-edit-field">
              <label>URL Slug</label>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="project-slug"
              />
            </div>
            <div className="project-edit-field">
              <label>Year</label>
              <input value={year} onChange={e => setYear(e.target.value)} placeholder="2026" />
            </div>
            <div className="project-edit-field">
              <label>Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Brand" />
            </div>
            <div className="project-edit-field">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {['Planning','Active','In Progress','On Hold','Completed','Archived'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="project-edit-field">
            <label>Short Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="project-edit-field">
            <label>
              Progress
              <span className="project-edit-progress-value">{progress}%</span>
            </label>
            <input
              type="range" min={0} max={100} value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="project-edit-range"
            />
            <div className="project-edit-progress-track">
              <div className="project-edit-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="project-edit-field">
            <label>Cover Image URL</label>
            <input
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://... (Supabase Storage URL)"
            />
            {coverImage && (
              <div className="project-edit-cover-preview">
                <img src={coverImage} alt="Cover preview" />
              </div>
            )}
          </div>

          <div className="project-edit-divider">
            <span>Case Study Content</span>
          </div>

          <div className="project-edit-field">
            <label>Story / Overview</label>
            <textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              rows={5}
              placeholder="The full story of this project..."
            />
          </div>

          <div className="project-edit-field">
            <label>The Challenge</label>
            <textarea
              value={challenge}
              onChange={e => setChallenge(e.target.value)}
              rows={4}
              placeholder="What problem were you solving?"
            />
          </div>

          <div className="project-edit-field">
            <label>The Strategy</label>
            <textarea
              value={solution}
              onChange={e => setSolution(e.target.value)}
              rows={4}
              placeholder="What was your approach?"
            />
          </div>

          <div className="project-edit-field">
            <label>The Outcome</label>
            <textarea
              value={outcome}
              onChange={e => setOutcome(e.target.value)}
              rows={4}
              placeholder="What happened as a result?"
            />
          </div>

        </div>

        <div className="project-edit-sidebar">
          <p className="project-edit-sidebar-label">Preview Card</p>
          <div className="project-edit-preview">
            <div className="project-edit-preview-cover">
              {coverImage
                ? <img src={coverImage} alt="" />
                : <div className="project-edit-preview-empty">{title[0]?.toUpperCase() || '?'}</div>
              }
            </div>
            <div className="project-edit-preview-body">
              <div className="project-edit-preview-meta">
                {year && <span>{year}</span>}
                {category && <span>{category}</span>}
              </div>
              <h3>{title || 'Project Title'}</h3>
              <p>{description || 'Description...'}</p>
            </div>
          </div>

          <div className="project-edit-public-link">
            {slug && (
              <a
                href={`/projects/${slug}`}
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

    </div>
  )
}