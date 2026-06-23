'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import './inquiries.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type Source = 'all' | 'collaborations' | 'partnerships' | 'inquiries'
type Status = 'Open' | 'Closed' | 'Approved' | 'Declined' | 'Archived'

type Item = {
  details?: string
  id: string
  name: string
  email: string
  message?: string
  company?: string
  project?: string
  opportunity?: string
  budget?: string
  status: string
  created_at: string
  updated_at?: string
  notes?: string
  archived?: boolean
  source: 'collaborations' | 'partnerships' | 'inquiries'
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: Status[] = ['Open', 'Closed', 'Approved', 'Declined', 'Archived']

const STATUS_META: Record<string, { color: string; label: string }> = {
  Open:     { color: '#d8bc6e',               label: 'Open'     },
  Closed:   { color: 'rgba(255,255,255,.3)',  label: 'Closed'   },
  Approved: { color: '#50c878',               label: 'Approved' },
  Declined: { color: '#e05a5a',               label: 'Declined' },
  Archived: { color: 'rgba(255,255,255,.28)', label: 'Archived' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function previewText(item: Item) {
  return (item.message || item.project || item.opportunity || item.details || '').slice(0, 90)
}

function normalizeStatus(status?: string): Status {
  const value = (status || '').toLowerCase()
  if (value === 'closed') return 'Closed'
  if (value === 'declined') return 'Declined'
  if (value === 'archived') return 'Archived'
  if (value === 'approved' || value === 'responded') return 'Approved'
  return 'Open'
}

function archivesStatus(status: string) {
  return status === 'Closed' || status === 'Declined' || status === 'Archived'
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InquiriesPage() {
  const router = useRouter()

  const [items, setItems]           = useState<Item[]>([])
  const [activeSource, setActiveSource] = useState<Source>('all')
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [showArchived, setShowArchived] = useState(false)
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState<Item | null>(null)
  const [notes, setNotes]           = useState('')
  const [notesSaved, setNotesSaved] = useState(false)
  const [loading, setLoading]       = useState(true)
  const [converting, setConverting] = useState(false)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [confirmDecline, setConfirmDecline] = useState(false)

  useEffect(() => { loadAll() }, [])

  // ── Data loading ────────────────────────────────────────────────────────────

  async function loadAll() {
    setLoading(true)
    const [c, p, i] = await Promise.all([
      supabase.from('collaborations').select('*').order('created_at', { ascending: false }),
      supabase.from('partnerships').select('*').order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
    ])

    const all: Item[] = [
      ...(c.data || []).map(x => ({ ...x, status: normalizeStatus(x.status), source: 'collaborations' as const })),
      ...(p.data || []).map(x => ({ ...x, status: normalizeStatus(x.status), source: 'partnerships'   as const })),
      ...(i.data || []).map(x => ({ ...x, status: normalizeStatus(x.status), source: 'inquiries'      as const })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setItems(all)
    setLoading(false)
  }

  // ── Mutations ───────────────────────────────────────────────────────────────

  async function updateStatus(item: Item, status: string) {
    const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() }
    if (archivesStatus(status)) patch.archived = true

    await supabase.from(item.source).update(patch).eq('id', item.id)

    setItems(prev =>
      prev.map(i =>
        i.id === item.id && i.source === item.source
          ? { ...i, ...patch }
          : i
      )
    )
    if (selected?.id === item.id && selected.source === item.source) {
      setSelected(prev => prev ? { ...prev, ...patch } : prev)
    }
    setConfirmDecline(false)
    if (archivesStatus(status) && !showArchived) setSelected(null)
  }

  async function toggleArchive(item: Item) {
    const archived = !item.archived
    await supabase
      .from(item.source)
      .update({ archived, updated_at: new Date().toISOString() })
      .eq('id', item.id)

    setItems(prev =>
      prev.map(i =>
        i.id === item.id && i.source === item.source ? { ...i, archived } : i
      )
    )
    if (selected?.id === item.id && selected.source === item.source) {
      setSelected(prev => prev ? { ...prev, archived } : prev)
      // Close detail pane if we're hiding archived and this just got archived
      if (archived && !showArchived) setSelected(null)
    }
    setConfirmArchive(false)
  }

  async function saveNotes() {
    if (!selected) return
    await supabase
      .from(selected.source)
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', selected.id)
    setItems(prev =>
      prev.map(i =>
        i.id === selected.id && i.source === selected.source ? { ...i, notes } : i
      )
    )
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  // ── Convert to Client ───────────────────────────────────────────────────────
  // Creates a row in `clients` with prefilled data from the inquiry,
  // then navigates to the new client's dashboard page.

  async function convertToClient(item: Item) {
    setConverting(true)

    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('email', item.email)
      .maybeSingle()

    if (existing) {
      // Client already exists - open the CRM workspace.
      router.push('/dashboard/business')
      setConverting(false)
      return
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name:         item.name || item.company || 'New Client',
        email:        item.email,
        company:      item.company || null,
        source:       item.source,
        source_id:    item.id,
        status:       'Inquiry',
        notes:        item.notes || null,
        created_at:   new Date().toISOString(),
        updated_at:   new Date().toISOString(),
      })
      .select()
      .single()

    if (!error && client) {
      // Mark the original inquiry as converted
      await supabase
        .from(item.source)
        .update({ status: 'Closed', archived: true, updated_at: new Date().toISOString() })
        .eq('id', item.id)

      router.push('/dashboard/business')
    }

    setConverting(false)
  }

  // ── Filtering ───────────────────────────────────────────────────────────────

  const filtered = items.filter(item => {
    if (!showArchived && item.archived) return false
    if (showArchived && !item.archived) return false
    if (activeSource !== 'all' && item.source !== activeSource) return false
    if (activeStatus !== 'all' && item.status !== activeStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        item.name?.toLowerCase().includes(q)        ||
        item.email?.toLowerCase().includes(q)       ||
        item.company?.toLowerCase().includes(q)     ||
        item.message?.toLowerCase().includes(q)     ||
        item.project?.toLowerCase().includes(q)     ||
        item.opportunity?.toLowerCase().includes(q)
      )
    }
    return true
  })

  // ── Counts ──────────────────────────────────────────────────────────────────

  const active   = items.filter(i => !i.archived)
  const archived = items.filter(i => i.archived)

  const counts = {
    new:            active.filter(i => i.status === 'Open').length,
    total:          active.length,
    collaborations: active.filter(i => i.source === 'collaborations').length,
    partnerships:   active.filter(i => i.source === 'partnerships').length,
    inquiries:      active.filter(i => i.source === 'inquiries').length,
    archived:       archived.length,
  }

  // ── Select helper ───────────────────────────────────────────────────────────

  function selectItem(item: Item) {
    setSelected(item)
    setNotes(item.notes || '')
    setConfirmArchive(false)
    setConfirmDecline(false)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="inquiries-page">

      {/* HEADER */}
      <div className="inquiries-header">
        <div>
          <h1>Inquiries</h1>
          <p>Incoming messages, collaborations, and partnership requests.</p>
        </div>
        <div className="inquiries-header-actions">
          {counts.new > 0 && (
            <div className="inquiries-new-badge">{counts.new} open</div>
          )}
          <button
            className={`inquiries-archive-toggle ${showArchived ? 'is-active' : ''}`}
            onClick={() => { setShowArchived(s => !s); setSelected(null) }}
          >
            {showArchived
              ? `← Active (${counts.total})`
              : `Archive (${counts.archived})`}
          </button>
        </div>
      </div>

      {/* STATS — only show when not in archive view */}
      {!showArchived && (
        <div className="inquiries-stats">
          <div className="inquiries-stat">
            <span className="inquiries-stat-num">{counts.total}</span>
            <span className="inquiries-stat-label">Total</span>
          </div>
          <div className="inquiries-stat">
            <span className="inquiries-stat-num inquiries-stat-num--new">{counts.new}</span>
            <span className="inquiries-stat-label">Open</span>
          </div>
          <div className="inquiries-stat">
            <span className="inquiries-stat-num">{counts.collaborations}</span>
            <span className="inquiries-stat-label">Collabs</span>
          </div>
          <div className="inquiries-stat">
            <span className="inquiries-stat-num">{counts.partnerships}</span>
            <span className="inquiries-stat-label">Partnerships</span>
          </div>
          <div className="inquiries-stat">
            <span className="inquiries-stat-num">{counts.inquiries}</span>
            <span className="inquiries-stat-label">General</span>
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="inquiries-body">

        {/* LIST PANEL */}
        <div className="inquiries-list-panel">

          <div className="inquiries-filters">
            {/* Source tabs */}
            <div className="inquiries-filter-tabs">
              {(['all', 'collaborations', 'partnerships', 'inquiries'] as Source[]).map(s => (
                <button
                  key={s}
                  className={`inquiries-filter-tab ${activeSource === s ? 'is-active' : ''}`}
                  onClick={() => setActiveSource(s)}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {/* Search + status filter */}
            <div className="inquiries-filter-row">
              <input
                className="inquiries-search"
                placeholder="Search name, email, message…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="inquiries-status-filter"
                value={activeStatus}
                onChange={e => setActiveStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          <div className="inquiries-list">
            {loading ? (
              <div className="inquiries-loading">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="inquiries-empty">
                {showArchived ? 'No archived inquiries.' : 'No messages found.'}
              </div>
            ) : (
              filtered.map(item => (
                <div
                  key={`${item.source}-${item.id}`}
                  className={`inquiry-row ${selected?.id === item.id && selected?.source === item.source ? 'is-selected' : ''}`}
                  onClick={() => selectItem(item)}
                >
                  <div className="inquiry-row-left">
                    <div className="inquiry-row-top">
                      <span className="inquiry-row-name">
                        {item.name || item.company || 'Anonymous'}
                      </span>
                      <span className="inquiry-row-date">{fmtDate(item.created_at)}</span>
                    </div>
                    <div className="inquiry-row-meta">
                      <span className="inquiry-source-chip inquiry-source-chip--{item.source}">
                        {item.source}
                      </span>
                      {item.archived && (
                        <span className="inquiry-archived-chip">archived</span>
                      )}
                    </div>
                    <div className="inquiry-row-preview">{previewText(item)}</div>
                  </div>
                  <div
                    className="inquiry-status-dot"
                    style={{ background: STATUS_META[item.status]?.color ?? 'rgba(255,255,255,.2)' }}
                    title={STATUS_META[item.status]?.label}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div className="inquiries-detail-panel">
          {selected ? (
            <div className="inquiry-detail-scroll">

              {/* Header */}
              <div className="inquiry-detail-header">
                <div>
                  <h3 className="inquiry-detail-name">
                    {selected.name || selected.company || 'Anonymous'}
                  </h3>
                  <a href={`mailto:${selected.email}`} className="inquiry-detail-email">
                    {selected.email}
                  </a>
                  <div className="inquiry-detail-received">
                    Received {fmtDate(selected.created_at)}
                    {selected.updated_at && selected.updated_at !== selected.created_at && (
                      <> · Updated {fmtDate(selected.updated_at)}</>
                    )}
                  </div>
                </div>
                <span className={`inquiry-detail-source-chip inquiry-detail-source-chip--${selected.source}`}>
                  {selected.source}
                </span>
              </div>

              {/* Status row */}
              <div className="inquiry-detail-status-row">
                <span className="inquiry-detail-label">Status</span>
                <div className="inquiry-status-btns">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      className={`inquiry-status-btn ${selected.status === s ? 'is-active' : ''} inquiry-status-btn--${s.replace('-','')}`}
                      style={
                        selected.status === s
                          ? { borderColor: STATUS_META[s].color, color: STATUS_META[s].color }
                          : {}
                      }
                      onClick={() => {
                        if (s === 'Declined') { setConfirmDecline(true); return }
                        updateStatus(selected, s)
                      }}
                    >
                      {STATUS_META[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decline confirm */}
              {confirmDecline && (
                <div className="inquiry-confirm-banner inquiry-confirm-banner--decline">
                  <p>Mark as declined? This will also archive the inquiry.</p>
                  <div className="inquiry-confirm-actions">
                    <button
                      className="inquiry-confirm-btn inquiry-confirm-btn--danger"
                      onClick={() => updateStatus(selected, 'Declined')}
                    >
                      Yes, decline &amp; archive
                    </button>
                    <button
                      className="inquiry-confirm-btn"
                      onClick={() => setConfirmDecline(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Fields */}
              <div className="inquiry-detail-fields">
                {selected.project && (
                  <div className="inquiry-detail-field">
                    <span className="inquiry-detail-label">Project</span>
                    <p>{selected.project}</p>
                  </div>
                )}
                {selected.company && (
                  <div className="inquiry-detail-field">
                    <span className="inquiry-detail-label">Company</span>
                    <p>{selected.company}</p>
                  </div>
                )}
                {selected.opportunity && (
                  <div className="inquiry-detail-field">
                    <span className="inquiry-detail-label">Opportunity</span>
                    <p>{selected.opportunity}</p>
                  </div>
                )}
                {selected.budget && (
                  <div className="inquiry-detail-field">
                    <span className="inquiry-detail-label">Budget</span>
                    <p>{selected.budget}</p>
                  </div>
                )}
                {(selected.message || selected.details) && (
                  <div className="inquiry-detail-field">
                    <span className="inquiry-detail-label">Message</span>
                    <p>{selected.message || selected.details}</p>
                  </div>
                )}
              </div>

              {/* Internal notes */}
              <div className="inquiry-detail-notes">
                <div className="inquiry-detail-notes-header">
                  <span className="inquiry-detail-label">Internal Notes</span>
                  {notesSaved && <span className="inquiry-notes-saved">Saved ✓</span>}
                </div>
                <textarea
                  className="inquiry-notes-input"
                  placeholder="Add notes, next steps, context…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                />
                <button className="inquiry-notes-save" onClick={saveNotes}>
                  Save Notes
                </button>
              </div>

              {/* Actions */}
              <div className="inquiry-detail-actions">

                {/* Convert to client */}
                {!selected.archived && selected.status !== 'Declined' && (
                  <button
                    className="inquiry-action-btn inquiry-action-btn--primary"
                    onClick={() => convertToClient(selected)}
                    disabled={converting}
                  >
                    {converting ? 'Creating…' : '→ Convert to Client'}
                  </button>
                )}

                {/* Reply */}
                <a
                  href={`mailto:${selected.email}?subject=Re: Your ${selected.source.replace(/s$/, '')} inquiry`}
                  className="inquiry-action-btn inquiry-action-btn--secondary"
                >
                  Reply via Email
                </a>

                {/* Archive / Unarchive */}
                {!confirmArchive ? (
                  <button
                    className="inquiry-action-btn inquiry-action-btn--ghost"
                    onClick={() => setConfirmArchive(true)}
                  >
                    {selected.archived ? 'Unarchive' : 'Archive'}
                  </button>
                ) : (
                  <div className="inquiry-confirm-banner">
                    <p>{selected.archived ? 'Move back to active?' : 'Archive this inquiry?'}</p>
                    <div className="inquiry-confirm-actions">
                      <button
                        className="inquiry-confirm-btn inquiry-confirm-btn--danger"
                        onClick={() => toggleArchive(selected)}
                      >
                        {selected.archived ? 'Yes, unarchive' : 'Yes, archive'}
                      </button>
                      <button
                        className="inquiry-confirm-btn"
                        onClick={() => setConfirmArchive(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="inquiry-detail-empty">
              <p>Select a message to view details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
