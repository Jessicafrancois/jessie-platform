'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { readLocalValue, writeLocalValue } from '@/lib/offlineSync'
import Link from 'next/link'
import './project-edit.css'

type Props = { params: Promise<{ id: string }> }
type ProjectWorkItem = {
  id: string
  title: string
  due_date?: string
  completed: boolean
}

type ProjectWork = {
  milestones: ProjectWorkItem[]
  tasks: ProjectWorkItem[]
  deliverables: ProjectWorkItem[]
}

const EMPTY_WORK: ProjectWork = {
  milestones: [],
  tasks: [],
  deliverables: [],
}

function workKey(projectId: string) {
  return `jessie:project-work:${projectId}`
}

function createWorkItem(title: string, dueDate: string): ProjectWorkItem {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    due_date: dueDate || undefined,
    completed: false,
  }
}

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
  const [dueDate, setDueDate] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [story, setStory] = useState('')
  const [challenge, setChallenge] = useState('')
  const [solution, setSolution] = useState('')
  const [outcome, setOutcome] = useState('')
  const [progress, setProgress] = useState(0)
  const [milestones, setMilestones] = useState<ProjectWorkItem[]>([])
  const [tasks, setTasks] = useState<ProjectWorkItem[]>([])
  const [deliverables, setDeliverables] = useState<ProjectWorkItem[]>([])
  const [newMilestone, setNewMilestone] = useState('')
  const [newMilestoneDue, setNewMilestoneDue] = useState('')
  const [newTask, setNewTask] = useState('')
  const [newTaskDue, setNewTaskDue] = useState('')
  const [newDeliverable, setNewDeliverable] = useState('')
  const [newDeliverableDue, setNewDeliverableDue] = useState('')

  useEffect(() => {
    params.then(p => {
      setId(p.id)
      loadProject(p.id)
      const localWork = readLocalValue<ProjectWork>(workKey(p.id), EMPTY_WORK)
      setMilestones(localWork.milestones)
      setTasks(localWork.tasks)
      setDeliverables(localWork.deliverables)
    })
  }, [])

  useEffect(() => {
    if (!id) return
    writeLocalValue(workKey(id), { milestones, tasks, deliverables })
  }, [id, milestones, tasks, deliverables])

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
    setDueDate(data.due_date || '')
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
        due_date: dueDate || null,
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

  async function archiveProject() {
    if (!confirm('Archive this project?')) return
    await supabase
      .from('projects')
      .update({ status: 'Archived', updated_at: new Date().toISOString() })
      .eq('id', id)
    router.push('/dashboard/projects')
  }

  function addWorkItem(
    type: keyof ProjectWork,
    title: string,
    dueDate: string,
  ) {
    if (!title.trim()) return
    const item = createWorkItem(title, dueDate)

    if (type === 'milestones') {
      setMilestones(prev => [...prev, item])
      setNewMilestone('')
      setNewMilestoneDue('')
    } else if (type === 'tasks') {
      setTasks(prev => [...prev, item])
      setNewTask('')
      setNewTaskDue('')
    } else {
      setDeliverables(prev => [...prev, item])
      setNewDeliverable('')
      setNewDeliverableDue('')
    }
  }

  function toggleWorkItem(type: keyof ProjectWork, itemId: string) {
    const toggle = (items: ProjectWorkItem[]) =>
      items.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )

    if (type === 'milestones') setMilestones(toggle)
    if (type === 'tasks') setTasks(toggle)
    if (type === 'deliverables') setDeliverables(toggle)
  }

  function removeWorkItem(type: keyof ProjectWork, itemId: string) {
    const remove = (items: ProjectWorkItem[]) => items.filter(item => item.id !== itemId)

    if (type === 'milestones') setMilestones(remove)
    if (type === 'tasks') setTasks(remove)
    if (type === 'deliverables') setDeliverables(remove)
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
          <button className="project-edit-archive" onClick={archiveProject} disabled={status === 'Archived'}>
            {status === 'Archived' ? 'Archived' : 'Archive'}
          </button>
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
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
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

          <div className="project-edit-work-grid">
            <div className="project-edit-work-section">
              <div className="project-edit-divider">
                <span>Milestones</span>
              </div>
              <div className="project-edit-work-list">
                {milestones.map(item => (
                  <div key={item.id} className="project-edit-work-item">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleWorkItem('milestones', item.id)}
                    />
                    <span className={item.completed ? 'is-complete' : ''}>{item.title}</span>
                    {item.due_date && <small>{item.due_date}</small>}
                    <button onClick={() => removeWorkItem('milestones', item.id)}>x</button>
                  </div>
                ))}
              </div>
              <div className="project-edit-work-add">
                <input
                  value={newMilestone}
                  onChange={e => setNewMilestone(e.target.value)}
                  placeholder="Add milestone"
                  onKeyDown={e => e.key === 'Enter' && addWorkItem('milestones', newMilestone, newMilestoneDue)}
                />
                <input
                  type="date"
                  value={newMilestoneDue}
                  onChange={e => setNewMilestoneDue(e.target.value)}
                />
                <button onClick={() => addWorkItem('milestones', newMilestone, newMilestoneDue)}>
                  Add
                </button>
              </div>
            </div>

            <div className="project-edit-work-section">
              <div className="project-edit-divider">
                <span>Tasks</span>
              </div>
              <div className="project-edit-work-list">
                {tasks.map(item => (
                  <div key={item.id} className="project-edit-work-item">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleWorkItem('tasks', item.id)}
                    />
                    <span className={item.completed ? 'is-complete' : ''}>{item.title}</span>
                    {item.due_date && <small>{item.due_date}</small>}
                    <button onClick={() => removeWorkItem('tasks', item.id)}>x</button>
                  </div>
                ))}
              </div>
              <div className="project-edit-work-add">
                <input
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  placeholder="Add task"
                  onKeyDown={e => e.key === 'Enter' && addWorkItem('tasks', newTask, newTaskDue)}
                />
                <input
                  type="date"
                  value={newTaskDue}
                  onChange={e => setNewTaskDue(e.target.value)}
                />
                <button onClick={() => addWorkItem('tasks', newTask, newTaskDue)}>
                  Add
                </button>
              </div>
            </div>

            <div className="project-edit-work-section">
              <div className="project-edit-divider">
                <span>Deliverables</span>
              </div>
              <div className="project-edit-work-list">
                {deliverables.map(item => (
                  <div key={item.id} className="project-edit-work-item">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleWorkItem('deliverables', item.id)}
                    />
                    <span className={item.completed ? 'is-complete' : ''}>{item.title}</span>
                    {item.due_date && <small>{item.due_date}</small>}
                    <button onClick={() => removeWorkItem('deliverables', item.id)}>x</button>
                  </div>
                ))}
              </div>
              <div className="project-edit-work-add">
                <input
                  value={newDeliverable}
                  onChange={e => setNewDeliverable(e.target.value)}
                  placeholder="Add deliverable"
                  onKeyDown={e => e.key === 'Enter' && addWorkItem('deliverables', newDeliverable, newDeliverableDue)}
                />
                <input
                  type="date"
                  value={newDeliverableDue}
                  onChange={e => setNewDeliverableDue(e.target.value)}
                />
                <button onClick={() => addWorkItem('deliverables', newDeliverable, newDeliverableDue)}>
                  Add
                </button>
              </div>
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
                {dueDate && <span>Due {new Date(`${dueDate}T00:00:00`).toLocaleDateString()}</span>}
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
