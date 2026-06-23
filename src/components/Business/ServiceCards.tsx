// ─── src/components/Business/ServiceCards.tsx ───────────────────────────────
// Replaces: src/components/thriv3/ServiceCards.tsx (delete that file)
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { BusinessService } from '@/types/business'

export default function ServiceCards() {
  const [services, setServices]   = useState<BusinessService[]>([])
  const [active, setActive]       = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [copied, setCopied]       = useState<string | null>(null)

  const blankForm = () => ({
    code: '', name: '', tagline: '', description: '', deliverables: [''],
    timeline: '', price: '', best_for: '', color: '#C8A97E',
  })
  const [form, setForm] = useState(blankForm())

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('biz_services')
      .select('*')
      .neq('status', 'deleted')
      .order('sort_order')
    setServices(data ?? [])
  }

  function resetForm() { setForm(blankForm()); setEditingId(null); setShowForm(false) }

  async function save() {
    if (!form.name) return
    const deliverables = form.deliverables.filter(d => d.trim())
    if (editingId) {
      await supabase
        .from('biz_services')
        .update({ ...form, deliverables, updated_at: new Date().toISOString() })
        .eq('id', editingId)
    } else {
      await supabase
        .from('biz_services')
        .insert({ ...form, deliverables, sort_order: services.length, status: 'active' })
    }
    await load()
    resetForm()
  }

  async function archive(id: string) {
    await supabase.from('biz_services').update({ status: 'archived' }).eq('id', id)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this service?')) return
    await supabase.from('biz_services').update({ status: 'deleted' }).eq('id', id)
    await load()
  }

  function startEdit(s: BusinessService) {
    setForm({
      code: s.code ?? '', name: s.name, tagline: s.tagline ?? '',
      description: s.description ?? '',
      deliverables: s.deliverables.length ? s.deliverables : [''],
      timeline: s.timeline ?? '', price: s.price ?? '',
      best_for: s.best_for ?? '', color: s.color,
    })
    setEditingId(s.id)
    setShowForm(true)
  }

  function setDel(i: number, val: string) {
    const next = [...form.deliverables]; next[i] = val
    setForm(f => ({ ...f, deliverables: next }))
  }
  function addDel() { setForm(f => ({ ...f, deliverables: [...f.deliverables, ''] })) }
  function removeDel(i: number) {
    setForm(f => ({ ...f, deliverables: f.deliverables.filter((_, idx) => idx !== i) }))
  }

  function copyText(s: BusinessService) {
    return `${s.name}\n${s.tagline}\n\n${s.description}\n\nDeliverables:\n${s.deliverables.map(d => `— ${d}`).join('\n')}\n\nTimeline: ${s.timeline}\nInvestment: ${s.price}\nBest for: ${s.best_for}`
  }

  function copy(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="biz-page-header">
        <div>
          <div className="biz-page-kicker">Business</div>
          <h1 className="biz-h1">Service Descriptions</h1>
          <p className="biz-subtitle">Your complete offer stack — copy-ready for your site, proposals, or DMs.</p>
        </div>
        <button className="biz-btn" onClick={() => { resetForm(); setShowForm(true) }}>+ Add Service</button>
      </div>

      {showForm && (
        <div className="biz-card biz-form-modal">
          <div className="biz-form-modal-header">
            <span className="biz-card-title">{editingId ? 'Edit Service' : 'New Service'}</span>
            <button className="biz-icon-btn" onClick={resetForm}>×</button>
          </div>
          <div className="biz-row-2">
            <div>
              <label className="biz-label">Code (e.g. 07)</label>
              <input className="biz-input" value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="07" />
            </div>
            <div>
              <label className="biz-label">Color</label>
              <input className="biz-input" value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#C8A97E" />
            </div>
          </div>
          <label className="biz-label" style={{ marginTop: 12 }}>Service name</label>
          <input className="biz-input" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" />
          <label className="biz-label" style={{ marginTop: 12 }}>Tagline</label>
          <input className="biz-input" value={form.tagline}
            onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Short tagline" />
          <label className="biz-label" style={{ marginTop: 12 }}>Description</label>
          <textarea className="biz-textarea" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <label className="biz-label" style={{ marginTop: 12 }}>Deliverables</label>
          {form.deliverables.map((d, i) => (
            <div key={i} className="biz-deliverable-row">
              <input className="biz-deliverable-input" value={d}
                onChange={e => setDel(i, e.target.value)} placeholder={`Deliverable ${i + 1}`} />
              <button className="biz-deliverable-remove" onClick={() => removeDel(i)}>×</button>
            </div>
          ))}
          <button className="biz-add-row-btn" onClick={addDel}>+ Add deliverable</button>
          <div className="biz-row-2" style={{ marginTop: 12 }}>
            <div>
              <label className="biz-label">Timeline</label>
              <input className="biz-input" value={form.timeline}
                onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))} />
            </div>
            <div>
              <label className="biz-label">Investment</label>
              <input className="biz-input" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
          </div>
          <label className="biz-label" style={{ marginTop: 12 }}>Best for</label>
          <input className="biz-input" value={form.best_for}
            onChange={e => setForm(f => ({ ...f, best_for: e.target.value }))} />
          <div className="biz-form-actions">
            <button className="biz-ghost-btn" onClick={resetForm}>Cancel</button>
            <button className="biz-btn" onClick={save}>{editingId ? 'Save Changes' : 'Create Service'}</button>
          </div>
        </div>
      )}

      <div className="biz-service-grid">
        {services.filter(s => s.status !== 'deleted').map(s => (
          <div
            key={s.id}
            className={`biz-card biz-service-card ${active === s.id ? 'is-open' : ''} biz-service-card--${s.status}`}
            onClick={() => setActive(active === s.id ? null : s.id)}
          >
            <div className="biz-service-card-header">
              <div>
                <div className="biz-service-code" style={{ color: s.color }}>{s.code} — {s.price}</div>
                <div className="biz-service-name">{s.name}</div>
                <div className="biz-service-tagline">{s.tagline}</div>
              </div>
              <span className="biz-timeline-badge">{s.timeline}</span>
            </div>
            {active === s.id && (
              <>
                <hr className="biz-divider" />
                <p className="biz-service-desc">{s.description}</p>
                <div className="biz-label" style={{ marginTop: 12 }}>Deliverables</div>
                <div className="biz-deliverable-tags">
                  {s.deliverables.map((d, i) => <span key={i} className="biz-tag">{d}</span>)}
                </div>
                <div className="biz-label" style={{ marginTop: 12 }}>Best for</div>
                <p className="biz-service-best">{s.best_for}</p>
                <div className="biz-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="biz-copy-btn" data-copied={copied === s.id}
                    onClick={() => copy(s.id, copyText(s))}>
                    {copied === s.id ? 'Copied ✓' : 'Copy'}
                  </button>
                  <button className="biz-ghost-btn" onClick={() => startEdit(s)}>Edit</button>
                  <button className="biz-ghost-btn" onClick={() => archive(s.id)}>Archive</button>
                  <button className="biz-ghost-btn biz-ghost-btn--danger" onClick={() => remove(s.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}