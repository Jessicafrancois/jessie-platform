// ─── src/components/Business/OfferFAQ.tsx ───────────────────────────────────
// Replaces: src/components/thriv3/OfferFAQ.tsx (delete that file)
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { BusinessFAQ } from '@/types/business'

export default function OfferFAQ() {
  const [faqs, setFaqs]           = useState<BusinessFAQ[]>([])
  const [open, setOpen]           = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [copied, setCopied]       = useState<string | null>(null)
  const [form, setForm] = useState({
    section: 'What you do', question: '', answer: '', color: '#C8A97E',
  })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('biz_faqs')
      .select('*')
      .eq('status', 'active')
      .order('sort_order')
    setFaqs(data ?? [])
  }

  function resetForm() {
    setForm({ section: 'What you do', question: '', answer: '', color: '#C8A97E' })
    setEditingId(null)
    setShowForm(false)
  }

  async function save() {
    if (!form.question || !form.answer) return
    if (editingId) {
      await supabase
        .from('biz_faqs')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editingId)
    } else {
      const max = faqs.filter(f => f.section === form.section).length
      await supabase.from('biz_faqs').insert({ ...form, sort_order: max })
    }
    await load()
    resetForm()
  }

  async function archive(id: string) {
    await supabase.from('biz_faqs').update({ status: 'archived' }).eq('id', id)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await supabase.from('biz_faqs').update({ status: 'deleted' }).eq('id', id)
    await load()
  }

  function startEdit(f: BusinessFAQ) {
    setForm({ section: f.section, question: f.question, answer: f.answer, color: f.color })
    setEditingId(f.id)
    setShowForm(true)
  }

  function copy(id: string, q: string, a: string) {
    navigator.clipboard.writeText(`Q: ${q}\n\nA: ${a}`)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const sections = Array.from(new Set(faqs.map(f => f.section)))
  const SECTION_COLORS: Record<string, string> = {}
  faqs.forEach(f => { SECTION_COLORS[f.section] = f.color })

  return (
    <div>
      <div className="biz-page-header">
        <div>
          <div className="biz-page-kicker">Business</div>
          <h1 className="biz-h1">FAQ & Offer Guide</h1>
          <p className="biz-subtitle">Everything a potential client needs to know.</p>
        </div>
        <button className="biz-btn" onClick={() => { resetForm(); setShowForm(true) }}>+ Add FAQ</button>
      </div>

      {showForm && (
        <div className="biz-card biz-form-modal">
          <div className="biz-form-modal-header">
            <span className="biz-card-title">{editingId ? 'Edit FAQ' : 'New FAQ'}</span>
            <button className="biz-icon-btn" onClick={resetForm}>×</button>
          </div>
          <div className="biz-row-2">
            <div>
              <label className="biz-label">Section</label>
              <input className="biz-input" value={form.section}
                onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                placeholder="e.g. What you do" />
            </div>
            <div>
              <label className="biz-label">Color</label>
              <input className="biz-input" value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
            </div>
          </div>
          <label className="biz-label" style={{ marginTop: 12 }}>Question</label>
          <input className="biz-input" value={form.question}
            onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
            placeholder="What the client would ask" />
          <label className="biz-label" style={{ marginTop: 12 }}>Answer</label>
          <textarea className="biz-textarea" style={{ minHeight: 180 }} value={form.answer}
            onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
          <div className="biz-form-actions">
            <button className="biz-ghost-btn" onClick={resetForm}>Cancel</button>
            <button className="biz-btn" onClick={save}>{editingId ? 'Save Changes' : 'Create FAQ'}</button>
          </div>
        </div>
      )}

      {sections.map(section => (
        <div key={section} className="biz-faq-section">
          <div className="biz-faq-section-label" style={{ color: SECTION_COLORS[section] }}>
            {section}
          </div>
          {faqs.filter(f => f.section === section).map(faq => (
            <div
              key={faq.id}
              className={`biz-card biz-faq-card ${open === faq.id ? 'is-open' : ''}`}
              style={{ borderColor: open === faq.id ? faq.color + '44' : undefined }}
            >
              <div className="biz-faq-question" onClick={() => setOpen(open === faq.id ? null : faq.id)}>
                <span>{faq.question}</span>
                <span className="biz-faq-toggle">{open === faq.id ? '−' : '+'}</span>
              </div>
              {open === faq.id && (
                <div className="biz-faq-answer">
                  <hr className="biz-divider" />
                  <p>{faq.answer}</p>
                  <div className="biz-card-actions" style={{ marginTop: 12 }}>
                    <button className="biz-copy-btn" data-copied={copied === faq.id}
                      onClick={() => copy(faq.id, faq.question, faq.answer)}>
                      {copied === faq.id ? 'Copied ✓' : 'Copy'}
                    </button>
                    <button className="biz-ghost-btn" onClick={() => startEdit(faq)}>Edit</button>
                    <button className="biz-ghost-btn" onClick={() => archive(faq.id)}>Archive</button>
                    <button className="biz-ghost-btn biz-ghost-btn--danger" onClick={() => remove(faq.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}