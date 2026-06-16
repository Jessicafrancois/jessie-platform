'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import './inquiries.css'

type Source = 'all' | 'collaborations' | 'partnerships' | 'inquiries'
type Status = 'new' | 'in-review' | 'responded' | 'closed'

type Item = {
  details: string | undefined
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
  notes?: string
  source: Source
}

const STATUSES: Status[] = ['new', 'in-review', 'responded', 'closed']

const STATUS_COLORS: Record<string, string> = {
  new: '#d8bc6e',
  'in-review': '#64b4ff',
  responded: '#50c878',
  closed: 'rgba(255,255,255,.25)',
}

export default function InquiriesPage() {
  const [items, setItems] = useState<Item[]>([])
  const [activeSource, setActiveSource] = useState<Source>('all')
  const [activeStatus, setActiveStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Item | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [c, p, i] = await Promise.all([
      supabase.from('collaborations').select('*').order('created_at', { ascending: false }),
      supabase.from('partnerships').select('*').order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
    ])

    const all: Item[] = [
      ...(c.data || []).map(x => ({ ...x, source: 'collaborations' as Source })),
      ...(p.data || []).map(x => ({ ...x, source: 'partnerships' as Source })),
      ...(i.data || []).map(x => ({ ...x, source: 'inquiries' as Source })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setItems(all)
    setLoading(false)
  }

  async function updateStatus(item: Item, status: string) {
    const table = item.source
    await supabase.from(table).update({ status, updated_at: new Date().toISOString() }).eq('id', item.id)
    setItems(prev => prev.map(i => i.id === item.id && i.source === item.source ? { ...i, status } : i))
    if (selected?.id === item.id) setSelected({ ...item, status })
  }

  async function saveNotes() {
    if (!selected) return
    await supabase.from(selected.source).update({ notes }).eq('id', selected.id)
    setItems(prev => prev.map(i =>
      i.id === selected.id && i.source === selected.source ? { ...i, notes } : i
    ))
  }

  const filtered = items.filter(item => {
    if (activeSource !== 'all' && item.source !== activeSource) return false
    if (activeStatus !== 'all' && item.status !== activeStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.company?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts = {
    new: items.filter(i => i.status === 'new').length,
    all: items.length,
    collaborations: items.filter(i => i.source === 'collaborations').length,
    partnerships: items.filter(i => i.source === 'partnerships').length,
    inquiries: items.filter(i => i.source === 'inquiries').length,
  }

  return (
    <div className="inquiries-page">

      <div className="inquiries-header">
        <div>
          <h1>Inquiries</h1>
          <p>All incoming messages, collaborations, and partnerships.</p>
        </div>
        {counts.new > 0 && (
          <div className="inquiries-new-badge">{counts.new} new</div>
        )}
      </div>

      {/* STATS */}
      <div className="inquiries-stats">
        <div className="inquiries-stat">
          <span className="inquiries-stat-num">{counts.all}</span>
          <span className="inquiries-stat-label">Total</span>
        </div>
        <div className="inquiries-stat">
          <span className="inquiries-stat-num inquiries-stat-num--new">{counts.new}</span>
          <span className="inquiries-stat-label">New</span>
        </div>
        <div className="inquiries-stat">
          <span className="inquiries-stat-num">{counts.collaborations}</span>
          <span className="inquiries-stat-label">Collaborations</span>
        </div>
        <div className="inquiries-stat">
          <span className="inquiries-stat-num">{counts.partnerships}</span>
          <span className="inquiries-stat-label">Partnerships</span>
        </div>
      </div>

      <div className="inquiries-body">

        {/* LIST */}
        <div className="inquiries-list-panel">

          <div className="inquiries-filters">
            <div className="inquiries-filter-tabs">
              {(['all', 'collaborations', 'partnerships', 'inquiries'] as Source[]).map(s => (
                <button
                  key={s}
                  className={`inquiries-filter-tab ${activeSource === s ? 'is-active' : ''}`}
                  onClick={() => setActiveSource(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="inquiries-filter-row">
              <input
                className="inquiries-search"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="inquiries-status-filter"
                value={activeStatus}
                onChange={e => setActiveStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="inquiries-list">
            {loading ? (
              <div className="inquiries-loading">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="inquiries-empty">No messages found.</div>
            ) : (
              filtered.map(item => (
                <div
                  key={`${item.source}-${item.id}`}
                  className={`inquiry-row ${selected?.id === item.id ? 'is-selected' : ''}`}
                  onClick={() => { setSelected(item); setNotes(item.notes || '') }}
                >
                  <div className="inquiry-row-left">
                    <div className="inquiry-row-name">
                      {item.name || item.company || 'Anonymous'}
                    </div>
                    <div className="inquiry-row-meta">
                      <span className="inquiry-source">{item.source}</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="inquiry-row-preview">
                      {(item.message || item.project || item.opportunity || '').slice(0, 80)}...
                    </div>
                  </div>
                  <div
                    className="inquiry-status-dot"
                    style={{ background: STATUS_COLORS[item.status] || 'rgba(255,255,255,.2)' }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* DETAIL */}
        <div className="inquiries-detail-panel">
          {selected ? (
            <>
              <div className="inquiry-detail-header">
                <div>
                  <h3 className="inquiry-detail-name">
                    {selected.name || selected.company || 'Anonymous'}
                  </h3>
                  <a href={`mailto:${selected.email}`} className="inquiry-detail-email">
                    {selected.email}
                  </a>
                </div>
                <span className="inquiry-detail-source">{selected.source}</span>
              </div>

              <div className="inquiry-detail-status-row">
                <span className="inquiry-detail-label">Status</span>
                <div className="inquiry-status-btns">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      className={`inquiry-status-btn ${selected.status === s ? 'is-active' : ''}`}
                      style={selected.status === s ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
                      onClick={() => updateStatus(selected, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="inquiry-detail-notes">
                <span className="inquiry-detail-label">Internal Notes</span>
                <textarea
                  className="inquiry-notes-input"
                  placeholder="Add notes about this inquiry..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                />
                <button className="inquiry-notes-save" onClick={saveNotes}>Save Notes</button>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: Your inquiry`}
                className="inquiry-reply-btn"
              >
                Reply via Email →
              </a>
            </>
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