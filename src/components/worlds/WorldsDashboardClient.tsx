'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { WorldWithSlideCount } from '@/types/worlds'

type Props = {
  initialWorlds: WorldWithSlideCount[]
}

type StatusFilter = 'all' | 'draft' | 'published' | 'archived'

export default function WorldsDashboardClient({ initialWorlds }: Props) {
  const router = useRouter()
  const [worlds, setWorlds] = useState(initialWorlds)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const counts = useMemo(() => ({
    all:       worlds.length,
    draft:     worlds.filter(w => w.status === 'draft').length,
    published: worlds.filter(w => w.status === 'published').length,
    archived:  worlds.filter(w => w.status === 'archived').length,
  }), [worlds])

  const filtered = useMemo(() => {
    return worlds.filter(w => {
      if (filter !== 'all' && w.status !== filter) return false
      if (search && !w.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [worlds, filter, search])

  // ── CREATE ──────────────────────────────────────────────

  async function handleCreate() {
    setCreating(true)
    const title = 'Untitled World'
    const slug = `untitled-world-${Date.now()}`

    const { data, error } = await supabase
      .from('worlds')
      .insert({ title, slug, status: 'draft' })
      .select()
      .single()

    setCreating(false)

    if (error) { console.error('create world failed:', error); return }
    router.push(`/dashboard/worlds/${data.id}`)
  }

  // ── STATUS ACTIONS ──────────────────────────────────────

  async function setStatus(id: string, status: 'draft' | 'published' | 'archived') {
    setBusyId(id)
    const { error } = await supabase
      .from('worlds')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    setBusyId(null)
    if (error) { console.error('status update failed:', error); return }

    setWorlds(prev => prev.map(w => w.id === id ? { ...w, status } : w))
  }

  async function handleSoftDelete(id: string, title: string) {
    const confirmed = window.confirm(`Move "${title}" to trash? You can restore it later.`)
    if (!confirmed) return

    setBusyId(id)
    const { error } = await supabase
      .from('worlds')
      .update({ deleted_at: new Date().toISOString(), status: 'archived' })
      .eq('id', id)

    setBusyId(null)
    if (error) { console.error('delete failed:', error); return }

    setWorlds(prev => prev.filter(w => w.id !== id))
  }

  return (
    <main className="wd-page">

      {/* HEADER */}
      <div className="wd-header">
        <div>
          <h1>Worlds</h1>
          <p>Build, edit, and publish the ecosystems your brands live inside.</p>
        </div>
        <button className="wd-create-btn" onClick={handleCreate} disabled={creating}>
          {creating ? 'Creating…' : '+ New World'}
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="wd-filters">
        <div className="wd-tabs">
          {(['all', 'draft', 'published', 'archived'] as StatusFilter[]).map(f => (
            <button
              key={f}
              className={`wd-tab ${filter === f ? 'wd-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="wd-tab-count">{counts[f]}</span>
            </button>
          ))}
        </div>

        <input
          className="wd-search"
          placeholder="Search worlds…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="wd-grid">
        {filtered.length === 0 && (
          <div className="wd-empty">
            <h3>No worlds {filter !== 'all' ? `in ${filter}` : 'yet'}.</h3>
            <p>
              {filter === 'all'
                ? 'Create your first world to begin building its presentation.'
                : 'Switch tabs or create a new world.'}
            </p>
          </div>
        )}

        {filtered.map(world => (
          <div key={world.id} className={`wd-card wd-card--${world.status}`}>
            <Link href={`/dashboard/worlds/${world.id}`} className="wd-card-cover">
              {world.cover_image || world.hero_poster ? (
                <img src={world.cover_image || world.hero_poster!} alt={world.title} />
              ) : (
                <div className="wd-card-cover--empty">
                  <span>{world.title.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <span className={`wd-status-badge wd-status-badge--${world.status}`}>
                {world.status}
              </span>
            </Link>

            <div className="wd-card-body">
              <h3>{world.title}</h3>
              {world.description && <p className="wd-card-desc">{world.description}</p>}
              <div className="wd-card-meta">
                <span>{world.slide_count} slide{world.slide_count !== 1 ? 's' : ''}</span>
                <span>/{world.slug}</span>
              </div>
            </div>

            <div className="wd-card-actions">
              <Link href={`/dashboard/worlds/${world.id}`} className="wd-action">
                Edit
              </Link>
              <Link href={`/dashboard/worlds/${world.id}/editor`} className="wd-action">
                Slides
              </Link>

              {world.status === 'published' ? (
                <a href={`/worlds/${world.slug}`} target="_blank" rel="noreferrer" className="wd-action wd-action--view">
                  View →
                </a>
              ) : (
                <button
                  className="wd-action wd-action--publish"
                  onClick={() => setStatus(world.id, 'published')}
                  disabled={busyId === world.id}
                >
                  Publish
                </button>
              )}

              {world.status !== 'draft' && world.status !== 'archived' && (
                <button
                  className="wd-action"
                  onClick={() => setStatus(world.id, 'draft')}
                  disabled={busyId === world.id}
                >
                  Move to Draft
                </button>
              )}

              {world.status === 'archived' ? (
                <button
                  className="wd-action"
                  onClick={() => setStatus(world.id, 'draft')}
                  disabled={busyId === world.id}
                >
                  Restore
                </button>
              ) : (
                <button
                  className="wd-action"
                  onClick={() => setStatus(world.id, 'archived')}
                  disabled={busyId === world.id}
                >
                  Archive
                </button>
              )}

              <button
                className="wd-action wd-action--delete"
                onClick={() => handleSoftDelete(world.id, world.title)}
                disabled={busyId === world.id}
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