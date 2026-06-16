'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import './publishing.css'

type Entry = {
  id: string
  title: string
  slug: string
  status: string
  visibility: string
  published_at: string | null
  scheduled_at: string | null
  seo_title: string | null
  meta_description: string | null
  og_image: string | null
  updated_at: string
}

type ActiveTab = 'queue' | 'published' | 'scheduled' | 'drafts'

export default function PublishingPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [activeTab, setActiveTab] = useState<ActiveTab>('queue')
  const [editing, setEditing] = useState<Entry | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadEntries() {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('id, title, slug, status, visibility, published_at, scheduled_at, seo_title, meta_description, og_image, updated_at')
      .order('updated_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  useEffect(() => { loadEntries() }, [])

  async function savePublishingSettings() {
    if (!editing) return
    setSaving(true)

    const { error } = await supabase
      .from('entries')
      .update({
        seo_title: editing.seo_title,
        meta_description: editing.meta_description,
        og_image: editing.og_image,
        visibility: editing.visibility,
        scheduled_at: editing.scheduled_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editing.id)

    if (!error) {
      await loadEntries()
      setEditing(null)
    }
    setSaving(false)
  }

  async function publishNow(entry: Entry) {
    if (!confirm(`Publish "${entry.title}" now?`)) return

    await supabase
      .from('entries')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        scheduled_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entry.id)

    loadEntries()
  }

  async function unpublish(entry: Entry) {
    if (!confirm(`Unpublish "${entry.title}"?`)) return

    await supabase
      .from('entries')
      .update({
        status: 'draft',
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entry.id)

    loadEntries()
  }

  async function schedulePublish(entry: Entry, datetime: string) {
    await supabase
      .from('entries')
      .update({
        status: 'scheduled',
        scheduled_at: new Date(datetime).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', entry.id)

    loadEntries()
  }

  const tabs = [
    { id: 'queue' as ActiveTab, label: 'Publishing Queue', statuses: ['draft'] },
    { id: 'scheduled' as ActiveTab, label: 'Scheduled', statuses: ['scheduled'] },
    { id: 'published' as ActiveTab, label: 'Published', statuses: ['published'] },
    { id: 'drafts' as ActiveTab, label: 'All Drafts', statuses: ['draft', 'archived'] },
  ]

  const currentTab = tabs.find(t => t.id === activeTab)
  const filtered = entries.filter(e => currentTab?.statuses.includes(e.status))

  const stats = {
    published: entries.filter(e => e.status === 'published').length,
    scheduled: entries.filter(e => e.status === 'scheduled').length,
    drafts: entries.filter(e => e.status === 'draft').length,
  }

  return (
    <div className="publishing-page">

      <div className="publishing-header">
        <div>
          <h1>Publishing</h1>
          <p>
            Control visibility, SEO, scheduling, and publication status
            for every entry.
          </p>
        </div>
        <Link href="/dashboard/journal/new" className="publishing-new-btn">
          + New Entry
        </Link>
      </div>

      {/* STATS ROW */}
      <div className="publishing-stats">
        <div className="publishing-stat">
          <span className="publishing-stat-number">{stats.published}</span>
          <span className="publishing-stat-label">Published</span>
        </div>
        <div className="publishing-stat">
          <span className="publishing-stat-number">{stats.scheduled}</span>
          <span className="publishing-stat-label">Scheduled</span>
        </div>
        <div className="publishing-stat">
          <span className="publishing-stat-number">{stats.drafts}</span>
          <span className="publishing-stat-label">Drafts</span>
        </div>
      </div>

      {/* TABS */}
      <div className="publishing-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`publishing-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="publishing-tab-count">
              {entries.filter(e => tab.statuses.includes(e.status)).length}
            </span>
          </button>
        ))}
      </div>

      {/* ENTRY LIST */}
      {loading ? (
        <div className="publishing-loading">Loading entries...</div>
      ) : (
        <div className="publishing-list">
          {filtered.length === 0 ? (
            <div className="publishing-empty">
              <p>No entries in this category yet.</p>
              <Link href="/dashboard/journal/new">Create your first entry →</Link>
            </div>
          ) : (
            filtered.map(entry => (
              <div key={entry.id} className="publishing-entry">
                <div className="publishing-entry-info">
                  <div className="publishing-entry-top">
                    <h3 className="publishing-entry-title">{entry.title}</h3>
                    <span className={`publishing-status publishing-status--${entry.status}`}>
                      {entry.status}
                    </span>
                    <span className={`publishing-visibility publishing-visibility--${entry.visibility || 'public'}`}>
                      {entry.visibility || 'public'}
                    </span>
                  </div>

                  <div className="publishing-entry-meta">
                    <span>/{entry.slug}</span>
                    {entry.published_at && (
                      <span>
                        Published {new Date(entry.published_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    )}
                    {entry.scheduled_at && (
                      <span className="publishing-scheduled-time">
                        Scheduled for {new Date(entry.scheduled_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </span>
                    )}
                    <span>
                      SEO: {entry.seo_title ? '✓' : '—'} |
                      Meta: {entry.meta_description ? '✓' : '—'} |
                      OG: {entry.og_image ? '✓' : '—'}
                    </span>
                  </div>
                </div>

                <div className="publishing-entry-actions">
                  {entry.status === 'draft' && (
                    <>
                      <button
                        className="publishing-btn publishing-btn--primary"
                        onClick={() => publishNow(entry)}
                      >
                        Publish Now
                      </button>
                      <button
                        className="publishing-btn"
                        onClick={() => {
                          const dt = prompt('Schedule for (YYYY-MM-DD HH:MM):')
                          if (dt) schedulePublish(entry, dt)
                        }}
                      >
                        Schedule
                      </button>
                    </>
                  )}
                  {entry.status === 'published' && (
                    <button
                      className="publishing-btn"
                      onClick={() => unpublish(entry)}
                    >
                      Unpublish
                    </button>
                  )}
                  {entry.status === 'scheduled' && (
                    <button
                      className="publishing-btn"
                      onClick={() => publishNow(entry)}
                    >
                      Publish Now
                    </button>
                  )}
                  <button
                    className="publishing-btn publishing-btn--seo"
                    onClick={() => setEditing(entry)}
                  >
                    SEO Settings
                  </button>
                  <Link
                    href={`/dashboard/journal/edit/${entry.id}`}
                    className="publishing-btn"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SEO SETTINGS DRAWER */}
      {editing && (
        <div className="seo-drawer-overlay" onClick={() => setEditing(null)}>
          <div className="seo-drawer" onClick={e => e.stopPropagation()}>

            <div className="seo-drawer-header">
              <h2>SEO & Publishing Settings</h2>
              <button className="seo-drawer-close" onClick={() => setEditing(null)}>×</button>
            </div>

            <div className="seo-drawer-body">

              <div className="seo-field">
                <label>SEO Title</label>
                <input
                  type="text"
                  placeholder="Override title for search engines..."
                  value={editing.seo_title || ''}
                  onChange={e => setEditing({ ...editing, seo_title: e.target.value })}
                  maxLength={60}
                />
                <span className="seo-field-count">
                  {(editing.seo_title || '').length}/60
                </span>
              </div>

              <div className="seo-field">
                <label>Meta Description</label>
                <textarea
                  placeholder="Brief description for search engines..."
                  value={editing.meta_description || ''}
                  onChange={e => setEditing({ ...editing, meta_description: e.target.value })}
                  maxLength={160}
                />
                <span className="seo-field-count">
                  {(editing.meta_description || '').length}/160
                </span>
              </div>

              <div className="seo-field">
                <label>Open Graph Image URL</label>
                <input
                  type="text"
                  placeholder="Paste Supabase image URL..."
                  value={editing.og_image || ''}
                  onChange={e => setEditing({ ...editing, og_image: e.target.value })}
                />
                {editing.og_image && (
                  <img
                    src={editing.og_image}
                    alt="OG preview"
                    className="seo-og-preview"
                  />
                )}
              </div>

              <div className="seo-field">
                <label>Visibility</label>
                <select
                  value={editing.visibility || 'public'}
                  onChange={e => setEditing({ ...editing, visibility: e.target.value })}
                >
                  <option value="public">Public</option>
                  <option value="members">Members Only</option>
                  <option value="private">Private (Draft Only)</option>
                </select>
              </div>

              <div className="seo-field">
                <label>Schedule Publish</label>
                <input
                  type="datetime-local"
                  value={editing.scheduled_at
                    ? new Date(editing.scheduled_at).toISOString().slice(0, 16)
                    : ''}
                  onChange={e => setEditing({ ...editing, scheduled_at: e.target.value })}
                />
                <p className="seo-field-help">
                  Leave blank to publish manually. Set a date to schedule.
                </p>
              </div>

              {/* SEO PREVIEW */}
              <div className="seo-preview">
                <p className="seo-preview-label">Search Preview</p>
                <div className="seo-preview-card">
                  <div className="seo-preview-url">jessiefrancois.com/journal/{editing.slug}</div>
                  <div className="seo-preview-title">
                    {editing.seo_title || editing.title}
                  </div>
                  <div className="seo-preview-description">
                    {editing.meta_description || 'No meta description set.'}
                  </div>
                </div>
              </div>

            </div>

            <div className="seo-drawer-footer">
              <button className="seo-cancel-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button
                className="seo-save-btn"
                onClick={savePublishingSettings}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}