// ─── src/components/Business/MessageTemplates.tsx ───────────────────────────
// Replaces: src/components/thriv3/MessageTemplates.tsx (delete that file)
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { BusinessMessage } from '@/types/business'

const CATEGORIES = ['Outreach', 'Follow-ups', 'Discovery calls', 'Client management']
const CAT_COLORS: Record<string, string> = {
  'Outreach': '#C8A97E',
  'Follow-ups': '#7C9EBF',
  'Discovery calls': '#9E7CBF',
  'Client management': '#7CBF9E',
}

export default function MessageTemplates() {
  const [messages, setMessages]   = useState<BusinessMessage[]>([])
  const [active, setActive]       = useState('Outreach')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [copied, setCopied]       = useState<string | null>(null)
  const [form, setForm] = useState({ category: 'Outreach', label: '', context: '', body: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('biz_messages')
      .select('*')
      .eq('status', 'active')
      .order('sort_order')
    setMessages(data ?? [])
  }

  function resetForm() {
    setForm({ category: active, label: '', context: '', body: '' })
    setEditingId(null)
    setShowForm(false)
  }

  async function save() {
    if (!form.label || !form.body) return
    if (editingId) {
      await supabase
        .from('biz_messages')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editingId)
    } else {
      const max = messages.filter(m => m.category === form.category).length
      await supabase.from('biz_messages').insert({ ...form, sort_order: max })
    }
    await load()
    resetForm()
  }

  async function archive(id: string) {
    await supabase.from('biz_messages').update({ status: 'archived' }).eq('id', id)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this template permanently?')) return
    await supabase.from('biz_messages').update({ status: 'deleted' }).eq('id', id)
    await load()
  }

  function startEdit(m: BusinessMessage) {
    setForm({ category: m.category, label: m.label, context: m.context ?? '', body: m.body })
    setEditingId(m.id)
    setShowForm(true)
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const visible = messages.filter(m => m.category === active)

  return (
    <div>
      <div className="biz-page-header">
        <div>
          <div className="biz-page-kicker">Business</div>
          <h1 className="biz-h1">Message Templates</h1>
          <p className="biz-subtitle">Ready-to-use messages for every stage of the client journey.</p>
        </div>
        <button
          className="biz-btn"
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({ category: active, label: '', context: '', body: '' })
          }}
        >
          + Add Template
        </button>
      </div>

      {showForm && (
        <div className="biz-card biz-form-modal">
          <div className="biz-form-modal-header">
            <span className="biz-card-title">{editingId ? 'Edit Template' : 'New Template'}</span>
            <button className="biz-icon-btn" onClick={resetForm}>×</button>
          </div>
          <label className="biz-label">Category</label>
          <select className="biz-select" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <label className="biz-label" style={{ marginTop: 12 }}>Label</label>
          <input className="biz-input" value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            placeholder="Short name for this template" />
          <label className="biz-label" style={{ marginTop: 12 }}>Context (when to use)</label>
          <input className="biz-input" value={form.context}
            onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
            placeholder="e.g. Day after initial outreach — no reply yet" />
          <label className="biz-label" style={{ marginTop: 12 }}>Message body</label>
          <textarea className="biz-textarea" style={{ minHeight: 160 }} value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Write the message…" />
          <div className="biz-form-actions">
            <button className="biz-ghost-btn" onClick={resetForm}>Cancel</button>
            <button className="biz-btn" onClick={save}>
              {editingId ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </div>
      )}

      <div className="biz-cat-tabs">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`biz-cat-tab ${active === c ? 'is-active' : ''}`}
            style={{ '--cat-color': CAT_COLORS[c] } as React.CSSProperties}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="biz-template-list">
        {visible.length === 0 && (
          <div className="biz-empty">No templates in this category yet. Add one above.</div>
        )}
        {visible.map(m => (
          <div key={m.id} className="biz-card biz-template-card">
            <div className="biz-template-header">
              <div>
                <div className="biz-card-title">{m.label}</div>
                {m.context && <div className="biz-template-context">{m.context}</div>}
              </div>
              <div className="biz-template-actions">
                <button className="biz-copy-btn" data-copied={copied === m.id}
                  onClick={() => copy(m.body, m.id)}>
                  {copied === m.id ? 'Copied ✓' : 'Copy'}
                </button>
                <button className="biz-ghost-btn" onClick={() => startEdit(m)}>Edit</button>
                <button className="biz-ghost-btn" onClick={() => archive(m.id)}>Archive</button>
                <button className="biz-ghost-btn biz-ghost-btn--danger" onClick={() => remove(m.id)}>Delete</button>
              </div>
            </div>
            <hr className="biz-divider" />
            <div className="biz-template-body">{m.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}