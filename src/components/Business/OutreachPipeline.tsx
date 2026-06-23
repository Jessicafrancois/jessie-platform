// ─── src/components/Business/OutreachPipeline.tsx ───────────────────────────
// Replaces: src/components/thriv3/OutreachPipeline.tsx (delete that file)
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  BusinessContact,
  BusinessActivity,
  ContactStatus,
  ActivityType,
} from '@/types/business'

const STATUS_ORDER: ContactStatus[] = [
  'prospect', 'reached_out', 'in_conversation',
  'proposal_sent', 'active_client', 'past_client', 'not_a_fit', 'archived',
]

const STATUS_LABELS: Record<ContactStatus, string> = {
  prospect: 'Prospect', reached_out: 'Reached Out',
  in_conversation: 'In Conversation', proposal_sent: 'Proposal Sent',
  active_client: 'Active Client', past_client: 'Past Client',
  not_a_fit: 'Not a Fit', archived: 'Archived',
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  prospect: '#555550', reached_out: '#C8A97E',
  in_conversation: '#7C9EBF', proposal_sent: '#9E7CBF',
  active_client: '#4E9E6E', past_client: '#7CBF9E',
  not_a_fit: '#6B3A3A', archived: '#333',
}

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  outreach: 'Outreach sent', follow_up: 'Follow-up', call: 'Call',
  proposal_sent: 'Proposal sent', email: 'Email', dm: 'DM',
  note: 'Note', status_change: 'Status changed',
}

export default function OutreachPipeline() {
  const [contacts, setContacts]   = useState<BusinessContact[]>([])
  const [activity, setActivity]   = useState<BusinessActivity[]>([])
  const [selected, setSelected]   = useState<BusinessContact | null>(null)
  const [filter, setFilter]       = useState<ContactStatus | 'all'>('all')
  const [search, setSearch]       = useState('')
  const [showForm, setShowForm]   = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newNote, setNewNote]     = useState('')
  const [noteType, setNoteType]   = useState<ActivityType>('note')

  const blankContact = () => ({
    name: '', business: '', email: '', phone: '',
    instagram: '', linkedin: '', source: '', tags: [] as string[],
    notes: '', status: 'prospect' as ContactStatus,
    next_follow_up: '', last_contact: '',
  })
  const [form, setForm] = useState(blankContact())

  useEffect(() => { loadContacts() }, [])
  useEffect(() => { if (selected) loadActivity(selected.id) }, [selected])

  async function loadContacts() {
    const { data } = await supabase
      .from('biz_contacts')
      .select('*')
      .order('updated_at', { ascending: false })
    setContacts(data ?? [])
  }

  async function loadActivity(contactId: string) {
    const { data } = await supabase
      .from('biz_activity')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })
      .limit(30)
    setActivity(data ?? [])
  }

  function resetForm() { setForm(blankContact()); setEditingId(null); setShowForm(false) }

  async function saveContact() {
    if (!form.name) return
    const payload = {
      ...form,
      tags: typeof form.tags === 'string'
        ? (form.tags as unknown as string).split(',').map(t => t.trim()).filter(Boolean)
        : form.tags,
      last_contact: form.last_contact || null,
      next_follow_up: form.next_follow_up || null,
    }
    if (editingId) {
      await supabase
        .from('biz_contacts')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', editingId)
    } else {
      await supabase.from('biz_contacts').insert(payload)
    }
    await loadContacts()
    resetForm()
  }

  async function updateStatus(id: string, status: ContactStatus) {
    await supabase
      .from('biz_contacts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    await supabase.from('biz_activity').insert({
      contact_id: id, type: 'status_change',
      body: `Status → ${STATUS_LABELS[status]}`,
    })
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, status } : c)))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    await loadActivity(id)
  }

  async function addActivity() {
    if (!selected || !newNote.trim()) return
    await supabase.from('biz_activity').insert({
      contact_id: selected.id, type: noteType, body: newNote.trim(),
    })
    await supabase.from('biz_contacts').update({
      last_contact: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq('id', selected.id)
    setNewNote('')
    await loadActivity(selected.id)
    await loadContacts()
  }

  async function archiveContact(id: string) {
    await supabase.from('biz_contacts').update({ status: 'archived' }).eq('id', id)
    setContacts(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  function startEdit(c: BusinessContact) {
    setForm({
      name: c.name, business: c.business ?? '', email: c.email ?? '',
      phone: c.phone ?? '', instagram: c.instagram ?? '', linkedin: c.linkedin ?? '',
      source: c.source ?? '', tags: c.tags ?? [], notes: c.notes ?? '',
      status: c.status, next_follow_up: c.next_follow_up ?? '', last_contact: c.last_contact ?? '',
    })
    setEditingId(c.id)
    setSelected(c)
    setShowForm(true)
  }

  const filtered = contacts.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false
    if (search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !(c.business ?? '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts: Record<string, number> = { all: contacts.length }
  STATUS_ORDER.forEach(s => { counts[s] = contacts.filter(c => c.status === s).length })

  const followUps = contacts.filter(c => {
    if (!c.next_follow_up) return false
    return new Date(c.next_follow_up) <= new Date(Date.now() + 86400000 * 2)
  })

  return (
    <div>
      <div className="biz-page-header">
        <div>
          <div className="biz-page-kicker">Business</div>
          <h1 className="biz-h1">Outreach Pipeline</h1>
          <p className="biz-subtitle">Track every prospect from first touch to signed client.</p>
        </div>
        <button className="biz-btn" onClick={() => { resetForm(); setShowForm(true) }}>+ Add Contact</button>
      </div>

      {followUps.length > 0 && (
        <div className="biz-alert">
          <span className="biz-alert-icon">⚡</span>
          <strong>{followUps.length} follow-up{followUps.length > 1 ? 's' : ''} due soon</strong>
          <div className="biz-alert-names">{followUps.map(c => c.name).join(' · ')}</div>
        </div>
      )}

      {showForm && (
        <div className="biz-card biz-form-modal">
          <div className="biz-form-modal-header">
            <span className="biz-card-title">{editingId ? 'Edit Contact' : 'New Contact'}</span>
            <button className="biz-icon-btn" onClick={resetForm}>×</button>
          </div>
          <div className="biz-row-2">
            <div>
              <label className="biz-label">Name</label>
              <input className="biz-input" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
            </div>
            <div>
              <label className="biz-label">Business</label>
              <input className="biz-input" value={form.business}
                onChange={e => setForm(f => ({ ...f, business: e.target.value }))} />
            </div>
            <div>
              <label className="biz-label">Email</label>
              <input className="biz-input" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="biz-label">Phone</label>
              <input className="biz-input" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="biz-label">Instagram</label>
              <input className="biz-input" value={form.instagram}
                onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@handle" />
            </div>
            <div>
              <label className="biz-label">LinkedIn</label>
              <input className="biz-input" value={form.linkedin}
                onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} />
            </div>
            <div>
              <label className="biz-label">Source</label>
              <input className="biz-input" value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                placeholder="Instagram, Tampa network, referral…" />
            </div>
            <div>
              <label className="biz-label">Status</label>
              <select className="biz-select" value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as ContactStatus }))}>
                {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="biz-label">Next Follow-up</label>
              <input className="biz-input" type="date" value={form.next_follow_up}
                onChange={e => setForm(f => ({ ...f, next_follow_up: e.target.value }))} />
            </div>
            <div>
              <label className="biz-label">Tags (comma-separated)</label>
              <input className="biz-input"
                value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()) }))}
                placeholder="founder, Tampa, creative" />
            </div>
          </div>
          <label className="biz-label" style={{ marginTop: 12 }}>Notes</label>
          <textarea className="biz-textarea" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="What you know about them, what you noticed…" />
          <div className="biz-form-actions">
            <button className="biz-ghost-btn" onClick={resetForm}>Cancel</button>
            <button className="biz-btn" onClick={saveContact}>
              {editingId ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </div>
      )}

      <div className="biz-pipeline-layout">
        {/* LEFT — list */}
        <div className="biz-pipeline-list-panel">
          <div className="biz-pipeline-filters">
            <input className="biz-input biz-input--search" value={search}
              onChange={e => setSearch(e.target.value)} placeholder="Search contacts…" />
            <div className="biz-status-filter-scroll">
              <button
                className={`biz-status-filter-btn ${filter === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All <span>{counts.all}</span>
              </button>
              {STATUS_ORDER.filter(s => s !== 'archived').map(s => (
                <button key={s}
                  className={`biz-status-filter-btn ${filter === s ? 'is-active' : ''}`}
                  style={{ '--sf-color': STATUS_COLORS[s] } as React.CSSProperties}
                  onClick={() => setFilter(s)}
                >
                  {STATUS_LABELS[s]} {counts[s] > 0 && <span>{counts[s]}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="biz-contact-list">
            {filtered.length === 0 && <div className="biz-empty">No contacts found.</div>}
            {filtered.map(c => (
              <div key={c.id}
                className={`biz-contact-row ${selected?.id === c.id ? 'is-selected' : ''}`}
                onClick={() => setSelected(c)}
              >
                <div className="biz-contact-row-dot" style={{ background: STATUS_COLORS[c.status] }} />
                <div className="biz-contact-row-info">
                  <div className="biz-contact-row-name">{c.name}</div>
                  <div className="biz-contact-row-meta">
                    {c.business && <span>{c.business}</span>}
                    <span className="biz-contact-row-status">{STATUS_LABELS[c.status]}</span>
                  </div>
                  {c.next_follow_up && (
                    <div className="biz-contact-row-followup">
                      Follow-up: {new Date(c.next_follow_up).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — detail */}
        <div className="biz-pipeline-detail-panel">
          {!selected ? (
            <div className="biz-detail-empty">Select a contact to view details and activity.</div>
          ) : (
            <>
              <div className="biz-detail-header">
                <div>
                  <h2 className="biz-detail-name">{selected.name}</h2>
                  {selected.business && <div className="biz-detail-biz">{selected.business}</div>}
                  <div className="biz-detail-links">
                    {selected.email && <a href={`mailto:${selected.email}`}>{selected.email}</a>}
                    {selected.instagram && <span>{selected.instagram}</span>}
                    {selected.phone && <span>{selected.phone}</span>}
                  </div>
                </div>
                <div className="biz-detail-header-actions">
                  <button className="biz-ghost-btn" onClick={() => startEdit(selected)}>Edit</button>
                  <button className="biz-ghost-btn biz-ghost-btn--danger"
                    onClick={() => archiveContact(selected.id)}>Archive</button>
                </div>
              </div>

              <div className="biz-status-pipeline">
                {STATUS_ORDER.slice(0, 5).map(s => (
                  <button key={s}
                    className={`biz-pipeline-stage ${selected.status === s ? 'is-active' : ''}`}
                    style={{ '--stage-color': STATUS_COLORS[s] } as React.CSSProperties}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              {selected.notes && (
                <div className="biz-detail-notes-block">
                  <div className="biz-label">Notes</div>
                  <p>{selected.notes}</p>
                </div>
              )}

              {selected.tags?.length > 0 && (
                <div className="biz-detail-tags">
                  {selected.tags.map(t => <span key={t} className="biz-tag">{t}</span>)}
                </div>
              )}

              <div className="biz-activity-log-form">
                <div className="biz-label">Log Activity</div>
                <div className="biz-row-activity">
                  <select className="biz-select biz-select--sm" value={noteType}
                    onChange={e => setNoteType(e.target.value as ActivityType)}>
                    {(Object.entries(ACTIVITY_LABELS) as [ActivityType, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <input className="biz-input biz-input--flex" value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="What happened / what was said…"
                    onKeyDown={e => { if (e.key === 'Enter') addActivity() }} />
                  <button className="biz-btn biz-btn--sm" onClick={addActivity}>Log</button>
                </div>
              </div>

              <div className="biz-activity-feed">
                {activity.length === 0 && (
                  <div className="biz-empty">No activity yet. Log the first touch above.</div>
                )}
                {activity.map(a => (
                  <div key={a.id} className="biz-activity-item">
                    <div className="biz-activity-type">{ACTIVITY_LABELS[a.type]}</div>
                    {a.body && <div className="biz-activity-body">{a.body}</div>}
                    <div className="biz-activity-date">
                      {new Date(a.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}