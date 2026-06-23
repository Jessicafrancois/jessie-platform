'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  Client,
  ClientStatus,
  CommunicationLogEntry,
  Deliverable,
  TimelineEvent,
} from '@/types/business'

type ProjectOption = {
  id: string
  title: string
}

const PIPELINE: ClientStatus[] = [
  'Inquiry',
  'Discovery',
  'Proposal',
  'Active',
  'Completed',
  'Archived',
]

const STATUS_COLORS: Record<ClientStatus, string> = {
  Inquiry: 'biz-status-Inquiry',
  Discovery: 'biz-status-Discovery',
  Proposal: 'biz-status-Proposal',
  Active: 'biz-status-Active',
  Completed: 'biz-status-Completed',
  Archived: 'biz-status-Archived',
}

function uid() {
  return Math.random().toString(36).slice(2)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function emptyClient(): Omit<Client, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'Inquiry',
    notes: '',
    documents: [],
    linked_project_ids: [],
    deliverables: [],
    communication_log: [],
    timeline: [],
    payment_amount: undefined,
    payment_status: 'unpaid',
    payment_due: '',
  }
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeStatus, setActiveStatus] = useState<ClientStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Partial<Client> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [newDeliverable, setNewDeliverable] = useState('')
  const [newDelivDue, setNewDelivDue] = useState('')
  const [newCommSummary, setNewCommSummary] = useState('')
  const [newCommMethod, setNewCommMethod] =
    useState<CommunicationLogEntry['method']>('email')
  const [newCommDir, setNewCommDir] =
    useState<CommunicationLogEntry['direction']>('outbound')
  const [newTimelineLabel, setNewTimelineLabel] = useState('')
  const [newTimelineNote, setNewTimelineNote] = useState('')
  const [newDoc, setNewDoc] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('CLIENT LOAD ERROR:', error)
    setClients((data as Client[]) || [])
    setLoading(false)
  }, [])

  const loadProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title')
      .order('title')

    if (error) console.error('PROJECT LOAD ERROR:', error)
    setProjects((data as ProjectOption[]) || [])
  }, [])

  useEffect(() => {
    load()
    loadProjects()
  }, [load, loadProjects])

  const visible = clients.filter(client => {
    if (activeStatus !== 'all' && client.status !== activeStatus) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      client.name.toLowerCase().includes(q) ||
      client.email.toLowerCase().includes(q) ||
      (client.company || '').toLowerCase().includes(q)
    )
  })

  function countOf(status: ClientStatus) {
    return clients.filter(client => client.status === status).length
  }

  function openNew() {
    setEditing(emptyClient())
    setIsNew(true)
  }

  function openEdit(client: Client) {
    setEditing({ ...client })
    setIsNew(false)
  }

  function closeModal() {
    setEditing(null)
    setIsNew(false)
    resetInlineInputs()
  }

  function resetInlineInputs() {
    setNewDeliverable('')
    setNewDelivDue('')
    setNewCommSummary('')
    setNewTimelineLabel('')
    setNewTimelineNote('')
    setNewDoc('')
  }

  function patch<K extends keyof Client>(key: K, value: Client[K]) {
    setEditing(prev => (prev ? { ...prev, [key]: value } : prev))
  }

  function addLinkedProject(projectId: string) {
    if (!editing || !projectId) return
    const existing = editing.linked_project_ids || []
    if (existing.includes(projectId)) return
    patch('linked_project_ids', [...existing, projectId])
  }

  function removeLinkedProject(projectId: string) {
    if (!editing) return
    patch(
      'linked_project_ids',
      (editing.linked_project_ids || []).filter(id => id !== projectId)
    )
  }

  function projectTitle(projectId: string) {
    return projects.find(project => project.id === projectId)?.title || 'Untitled project'
  }

  function addDeliverable() {
    if (!newDeliverable.trim() || !editing) return
    const item: Deliverable = {
      id: uid(),
      title: newDeliverable.trim(),
      due_date: newDelivDue || undefined,
      completed: false,
    }
    patch('deliverables', [...(editing.deliverables || []), item])
    setNewDeliverable('')
    setNewDelivDue('')
  }

  function toggleDeliverable(id: string) {
    if (!editing) return
    patch(
      'deliverables',
      (editing.deliverables || []).map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  function removeDeliverable(id: string) {
    if (!editing) return
    patch(
      'deliverables',
      (editing.deliverables || []).filter(item => item.id !== id)
    )
  }

  function addComm() {
    if (!newCommSummary.trim() || !editing) return
    const entry: CommunicationLogEntry = {
      id: uid(),
      date: new Date().toISOString(),
      method: newCommMethod,
      direction: newCommDir,
      summary: newCommSummary.trim(),
    }
    patch('communication_log', [entry, ...(editing.communication_log || [])])
    setNewCommSummary('')
  }

  function removeComm(id: string) {
    if (!editing) return
    patch(
      'communication_log',
      (editing.communication_log || []).filter(entry => entry.id !== id)
    )
  }

  function addTimeline() {
    if (!newTimelineLabel.trim() || !editing) return
    const event: TimelineEvent = {
      id: uid(),
      date: new Date().toISOString(),
      label: newTimelineLabel.trim(),
      note: newTimelineNote.trim() || undefined,
    }
    patch('timeline', [event, ...(editing.timeline || [])])
    setNewTimelineLabel('')
    setNewTimelineNote('')
  }

  function removeTimeline(id: string) {
    if (!editing) return
    patch('timeline', (editing.timeline || []).filter(event => event.id !== id))
  }

  function addDoc() {
    if (!newDoc.trim() || !editing) return
    patch('documents', [...(editing.documents || []), newDoc.trim()])
    setNewDoc('')
  }

  function removeDoc(url: string) {
    if (!editing) return
    patch('documents', (editing.documents || []).filter(doc => doc !== url))
  }

  async function archiveClient() {
    if (!editing?.id || isNew) return
    if (!window.confirm('Archive this client? You can restore them later.')) return
    await supabase
      .from('clients')
      .update({
        status: 'Archived',
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', editing.id)
    closeModal()
    load()
  }

  async function save() {
    if (!editing || !editing.name?.trim()) return
    setSaving(true)

    const payload = {
      name: editing.name.trim(),
      email: editing.email?.trim() || '',
      company: editing.company?.trim() || null,
      phone: editing.phone?.trim() || null,
      status: editing.status || 'Inquiry',
      notes: editing.notes?.trim() || null,
      documents: editing.documents || [],
      linked_project_ids: editing.linked_project_ids || [],
      deliverables: editing.deliverables || [],
      communication_log: editing.communication_log || [],
      timeline: editing.timeline || [],
      payment_amount: editing.payment_amount ?? null,
      payment_status: editing.payment_status || 'unpaid',
      payment_due: editing.payment_due || null,
      updated_at: new Date().toISOString(),
    }

    if (isNew) {
      const { error } = await supabase
        .from('clients')
        .insert({ ...payload, created_at: new Date().toISOString() })
      if (error) console.error('CLIENT INSERT ERROR:', error)
    } else {
      const { error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', editing.id)
      if (error) console.error('CLIENT UPDATE ERROR:', error)
    }

    setSaving(false)
    closeModal()
    load()
  }

  return (
    <>
      <div className="biz-header">
        <div>
          <h1>Clients</h1>
          <p>Manage your client pipeline from inquiry to completion.</p>
        </div>
        <button className="biz-add-btn" onClick={openNew}>
          + Add Client
        </button>
      </div>

      <div className="biz-pipeline">
        <button
          className={`biz-tab${activeStatus === 'all' ? ' active' : ''}`}
          onClick={() => setActiveStatus('all')}
        >
          All
          <span className="biz-tab-count">{clients.length}</span>
        </button>
        {PIPELINE.map(status => (
          <button
            key={status}
            className={`biz-tab${activeStatus === status ? ' active' : ''}`}
            onClick={() => setActiveStatus(status)}
          >
            {status}
            <span className="biz-tab-count">{countOf(status)}</span>
          </button>
        ))}
      </div>

      <div className="biz-search-row">
        <input
          className="biz-search"
          placeholder="Search clients..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
      </div>

      <div className="biz-grid">
        {loading && <div className="biz-empty">Loading clients...</div>}

        {!loading && visible.length === 0 && (
          <div className="biz-empty">
            {search || activeStatus !== 'all'
              ? 'No clients match your filters.'
              : 'No clients yet. Add your first one above.'}
          </div>
        )}

        {visible.map(client => (
          <div
            key={client.id}
            className="biz-card"
            onClick={() => openEdit(client)}
          >
            <div className="biz-card-top">
              <div>
                <div className="biz-card-name">{client.name}</div>
                {client.company && (
                  <div className="biz-card-company">{client.company}</div>
                )}
              </div>
              <span className={`biz-status-badge ${STATUS_COLORS[client.status]}`}>
                {client.status}
              </span>
            </div>

            <div className="biz-card-email">{client.email}</div>

            <div className="biz-card-footer">
              {client.payment_status && (
                <span className={`biz-payment-pill biz-payment-${client.payment_status}`}>
                  {client.payment_status === 'unpaid'
                    ? 'Unpaid'
                    : client.payment_status === 'partial'
                      ? 'Partial'
                      : 'Paid'}
                  {client.payment_amount
                    ? ` · $${client.payment_amount.toLocaleString()}`
                    : ''}
                </span>
              )}
              <span className="biz-card-date">{formatDate(client.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div
          className="biz-modal-backdrop"
          onClick={event => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <div className="biz-modal">
            <div className="biz-modal-header">
              <h2>{isNew ? 'New Client' : editing.name || 'Edit Client'}</h2>
              <button className="biz-modal-close" onClick={closeModal}>
                x
              </button>
            </div>

            <div className="biz-row">
              <div className="biz-field">
                <label className="biz-label">Name *</label>
                <input
                  className="biz-input"
                  value={editing.name || ''}
                  onChange={event => patch('name', event.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="biz-field">
                <label className="biz-label">Email</label>
                <input
                  className="biz-input"
                  type="email"
                  value={editing.email || ''}
                  onChange={event => patch('email', event.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="biz-row">
              <div className="biz-field">
                <label className="biz-label">Company</label>
                <input
                  className="biz-input"
                  value={editing.company || ''}
                  onChange={event => patch('company', event.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div className="biz-field">
                <label className="biz-label">Phone</label>
                <input
                  className="biz-input"
                  value={editing.phone || ''}
                  onChange={event => patch('phone', event.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="biz-field">
              <label className="biz-label">Pipeline Status</label>
              <select
                className="biz-select"
                value={editing.status || 'Inquiry'}
                onChange={event =>
                  patch('status', event.target.value as ClientStatus)
                }
              >
                {PIPELINE.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="biz-section-title">Linked Projects</div>
            <div className="biz-list" style={{ marginBottom: 10 }}>
              {(editing.linked_project_ids || []).map(projectId => (
                <div key={projectId} className="biz-list-item">
                  <span className="biz-list-item-text">
                    {projectTitle(projectId)}
                  </span>
                  <button
                    className="biz-list-remove"
                    onClick={() => removeLinkedProject(projectId)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <select
              className="biz-select"
              value=""
              onChange={event => addLinkedProject(event.target.value)}
            >
              <option value="">Link a project...</option>
              {projects
                .filter(project => !(editing.linked_project_ids || []).includes(project.id))
                .map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
            </select>

            <div className="biz-section-title">Payment</div>
            <div className="biz-row">
              <div className="biz-field">
                <label className="biz-label">Amount ($)</label>
                <input
                  className="biz-input"
                  type="number"
                  value={editing.payment_amount ?? ''}
                  onChange={event =>
                    patch(
                      'payment_amount',
                      event.target.value ? Number(event.target.value) : undefined
                    )
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="biz-field">
                <label className="biz-label">Payment Status</label>
                <select
                  className="biz-select"
                  value={editing.payment_status || 'unpaid'}
                  onChange={event =>
                    patch(
                      'payment_status',
                      event.target.value as Client['payment_status']
                    )
                  }
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <div className="biz-field">
              <label className="biz-label">Due Date</label>
              <input
                className="biz-input"
                type="date"
                value={editing.payment_due || ''}
                onChange={event => patch('payment_due', event.target.value)}
              />
            </div>

            <div className="biz-section-title">Deliverables</div>
            <div className="biz-list">
              {(editing.deliverables || []).map(item => (
                <div key={item.id} className="biz-list-item">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleDeliverable(item.id)}
                  />
                  <span
                    className={`biz-list-item-text${
                      item.completed ? ' done' : ''
                    }`}
                  >
                    {item.title}
                  </span>
                  {item.due_date && (
                    <span className="biz-list-item-date">{item.due_date}</span>
                  )}
                  <button
                    className="biz-list-remove"
                    onClick={() => removeDeliverable(item.id)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div className="biz-add-row">
              <input
                className="biz-input"
                placeholder="Deliverable title"
                value={newDeliverable}
                onChange={event => setNewDeliverable(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && addDeliverable()}
              />
              <input
                className="biz-input"
                type="date"
                value={newDelivDue}
                onChange={event => setNewDelivDue(event.target.value)}
                style={{ maxWidth: 140 }}
              />
              <button className="biz-inline-btn" onClick={addDeliverable}>
                Add
              </button>
            </div>

            <div className="biz-section-title">Communication Log</div>
            <div
              className="biz-add-row"
              style={{ flexWrap: 'wrap', marginBottom: 12 }}
            >
              <select
                className="biz-select"
                value={newCommMethod}
                onChange={event =>
                  setNewCommMethod(
                    event.target.value as CommunicationLogEntry['method']
                  )
                }
                style={{ maxWidth: 110 }}
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="message">Message</option>
                <option value="other">Other</option>
              </select>
              <select
                className="biz-select"
                value={newCommDir}
                onChange={event =>
                  setNewCommDir(
                    event.target.value as CommunicationLogEntry['direction']
                  )
                }
                style={{ maxWidth: 120 }}
              >
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
              <input
                className="biz-input"
                placeholder="Summary..."
                value={newCommSummary}
                onChange={event => setNewCommSummary(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && addComm()}
                style={{ flex: 1, minWidth: 160 }}
              />
              <button className="biz-inline-btn" onClick={addComm}>
                Log
              </button>
            </div>
            <div>
              {(editing.communication_log || []).map(entry => (
                <div key={entry.id} className="biz-comm-entry">
                  <div className="biz-comm-meta">
                    <span className="biz-comm-method">{entry.method}</span>
                    <span className="biz-comm-dir">{entry.direction}</span>
                    <span className="biz-comm-date">
                      {formatDate(entry.date)}
                    </span>
                    <button
                      className="biz-list-remove"
                      onClick={() => removeComm(entry.id)}
                    >
                      x
                    </button>
                  </div>
                  <div className="biz-comm-summary">{entry.summary}</div>
                </div>
              ))}
            </div>

            <div className="biz-section-title">Timeline</div>
            <div
              className="biz-add-row"
              style={{ flexWrap: 'wrap', marginBottom: 12 }}
            >
              <input
                className="biz-input"
                placeholder="Event label (e.g. Proposal sent)"
                value={newTimelineLabel}
                onChange={event => setNewTimelineLabel(event.target.value)}
                style={{ flex: 1 }}
              />
              <input
                className="biz-input"
                placeholder="Note (optional)"
                value={newTimelineNote}
                onChange={event => setNewTimelineNote(event.target.value)}
                style={{ flex: 1 }}
              />
              <button className="biz-inline-btn" onClick={addTimeline}>
                Add
              </button>
            </div>
            {(editing.timeline || []).length > 0 && (
              <div className="biz-timeline">
                {(editing.timeline || []).map(event => (
                  <div key={event.id} className="biz-timeline-event">
                    <div className="biz-timeline-date">
                      {formatDate(event.date)}
                    </div>
                    <div className="biz-timeline-label">{event.label}</div>
                    {event.note && (
                      <div className="biz-timeline-note">{event.note}</div>
                    )}
                    <button
                      className="biz-list-remove"
                      style={{ position: 'absolute', right: 0, top: 4 }}
                      onClick={() => removeTimeline(event.id)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="biz-section-title">Documents</div>
            <div className="biz-list" style={{ marginBottom: 10 }}>
              {(editing.documents || []).map((doc, index) => (
                <div key={`${doc}-${index}`} className="biz-list-item">
                  <span
                    className="biz-list-item-text"
                    style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}
                  >
                    {doc}
                  </span>
                  <button
                    className="biz-list-remove"
                    onClick={() => removeDoc(doc)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div className="biz-add-row">
              <input
                className="biz-input"
                placeholder="Document URL or label"
                value={newDoc}
                onChange={event => setNewDoc(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && addDoc()}
              />
              <button className="biz-inline-btn" onClick={addDoc}>
                Add
              </button>
            </div>

            <div className="biz-section-title">Notes</div>
            <div className="biz-field">
              <textarea
                className="biz-textarea"
                value={editing.notes || ''}
                onChange={event => patch('notes', event.target.value)}
                placeholder="Internal notes about this client..."
                rows={4}
              />
            </div>

            <div className="biz-modal-actions">
              <button className="biz-save-btn" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : isNew ? 'Create Client' : 'Save Changes'}
              </button>
              <button className="biz-ghost-btn" onClick={closeModal}>
                Cancel
              </button>
              {!isNew && editing.status !== 'Archived' && (
                <button className="biz-danger-btn" onClick={archiveClient}>
                  Archive
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
