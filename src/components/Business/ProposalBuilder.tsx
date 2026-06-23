// ─── src/components/Business/ProposalBuilder.tsx ────────────────────────────
// Replaces: src/components/thriv3/ProposalBuilder.tsx (delete that file)
// This file already exists at src/components/Business/ — REPLACE its contents.
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type {
  BusinessService,
  BusinessProposal,
  DeliverableItem,
  AddonItem,
} from '@/types/business'

function uid() { return Math.random().toString(36).slice(2) }

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="biz-copy-btn"
      data-copied={copied}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

// ── Draggable deliverable list ────────────────────────────────────────────────
function DeliverableList({
  items,
  onChange,
}: {
  items: DeliverableItem[]
  onChange: (items: DeliverableItem[]) => void
}) {
  const [dragging, setDragging] = useState<string | null>(null)

  function addItem() { onChange([...items, { id: uid(), text: '' }]) }
  function updateItem(id: string, text: string) {
    onChange(items.map(i => (i.id === id ? { ...i, text } : i)))
  }
  function removeItem(id: string) { onChange(items.filter(i => i.id !== id)) }
  function onDragStart(id: string) { setDragging(id) }
  function onDrop(targetId: string) {
    if (!dragging || dragging === targetId) return
    const from = items.findIndex(i => i.id === dragging)
    const to   = items.findIndex(i => i.id === targetId)
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
    setDragging(null)
  }

  return (
    <div className="biz-deliverable-list">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`biz-deliverable-row ${dragging === item.id ? 'is-dragging' : ''}`}
          draggable
          onDragStart={() => onDragStart(item.id)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => onDrop(item.id)}
        >
          <span className="biz-drag-handle">⠿</span>
          <span className="biz-deliverable-num">{String(i + 1).padStart(2, '0')}</span>
          <input
            className="biz-deliverable-input"
            value={item.text}
            onChange={e => updateItem(item.id, e.target.value)}
            placeholder="Deliverable…"
          />
          <button className="biz-deliverable-remove" onClick={() => removeItem(item.id)}>×</button>
        </div>
      ))}
      <button className="biz-add-row-btn" onClick={addItem}>+ Add deliverable</button>
    </div>
  )
}

// ── Addon / Fee row list ──────────────────────────────────────────────────────
function LineItemList({
  items,
  onChange,
  placeholder,
}: {
  items: AddonItem[]
  onChange: (items: AddonItem[]) => void
  placeholder: string
}) {
  function add() { onChange([...items, { id: uid(), label: '', amount: '' }]) }
  function update(id: string, field: 'label' | 'amount', val: string) {
    onChange(items.map(i => (i.id === id ? { ...i, [field]: val } : i)))
  }
  function remove(id: string) { onChange(items.filter(i => i.id !== id)) }

  return (
    <div className="biz-lineitem-list">
      {items.map(item => (
        <div key={item.id} className="biz-lineitem-row">
          <input
            className="biz-input biz-input--flex"
            value={item.label}
            onChange={e => update(item.id, 'label', e.target.value)}
            placeholder={placeholder}
          />
          <input
            className="biz-input biz-input--amount"
            value={item.amount}
            onChange={e => update(item.id, 'amount', e.target.value)}
            placeholder="$0"
          />
          <button className="biz-deliverable-remove" onClick={() => remove(item.id)}>×</button>
        </div>
      ))}
      <button className="biz-add-row-btn" onClick={add}>+ Add</button>
    </div>
  )
}

// ── Main ProposalBuilder ──────────────────────────────────────────────────────
export default function ProposalBuilder() {
  const [services, setServices]           = useState<BusinessService[]>([])
  const [proposals, setProposals]         = useState<BusinessProposal[]>([])
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null)
  const [preview, setPreview]             = useState(false)
  const [saving, setSaving]               = useState(false)
  const [view, setView]                   = useState<'list' | 'edit'>('list')

  const DEFAULT_FORM = () => ({
    client_name: '',
    client_business: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    services: [] as string[],
    other_service: '',
    problem: '',
    problem_notes: '',
    solution: '',
    deliverables: [] as DeliverableItem[],
    timeline: '',
    timeline_notes: '',
    investment: '',
    deposit: '',
    milestone: '',
    final_payment: '',
    addons: [] as AddonItem[],
    fees: [] as AddonItem[],
  })

  const [form, setForm] = useState(DEFAULT_FORM())

  useEffect(() => { loadServices(); loadProposals() }, [])

  async function loadServices() {
    const { data } = await supabase
      .from('biz_services')
      .select('*')
      .eq('status', 'active')
      .order('sort_order')
    setServices(data ?? [])
  }

  async function loadProposals() {
    const { data } = await supabase
      .from('biz_proposals')
      .select('*')
      .order('updated_at', { ascending: false })
    setProposals(data ?? [])
  }

  function setField(key: string, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function toggleService(name: string) {
    setField(
      'services',
      form.services.includes(name)
        ? form.services.filter(s => s !== name)
        : [...form.services, name],
    )
    const svc = services.find(s => s.name === name)
    if (svc && !form.services.includes(name)) {
      const existing = form.deliverables.map(d => d.text)
      const newItems = svc.deliverables
        .filter((d: string) => !existing.includes(d))
        .map((d: string) => ({ id: uid(), text: d }))
      setField('deliverables', [...form.deliverables, ...newItems])
    }
  }

  async function saveProposal() {
    setSaving(true)
    const payload = { ...form }
    if (activeProposalId) {
      await supabase
        .from('biz_proposals')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', activeProposalId)
    } else {
      const { data } = await supabase
        .from('biz_proposals')
        .insert({ ...payload, status: 'draft' })
        .select()
        .single()
      if (data) setActiveProposalId(data.id)
    }
    await loadProposals()
    setSaving(false)
  }

  function openProposal(p: BusinessProposal) {
    setActiveProposalId(p.id)
    setForm({
      client_name: p.client_name ?? '',
      client_business: p.client_business ?? '',
      date: p.date ?? '',
      services: p.services ?? [],
      other_service: p.other_service ?? '',
      problem: p.problem ?? '',
      problem_notes: p.problem_notes ?? '',
      solution: p.solution ?? '',
      deliverables: p.deliverables ?? [],
      timeline: p.timeline ?? '',
      timeline_notes: p.timeline_notes ?? '',
      investment: p.investment ?? '',
      deposit: p.deposit ?? '',
      milestone: p.milestone ?? '',
      final_payment: p.final_payment ?? '',
      addons: p.addons ?? [],
      fees: p.fees ?? [],
    })
    setView('edit')
  }

  function newProposal() {
    setActiveProposalId(null)
    setForm(DEFAULT_FORM())
    setPreview(false)
    setView('edit')
  }

  async function archiveProposal(id: string) {
    await supabase.from('biz_proposals').update({ status: 'archived' }).eq('id', id)
    await loadProposals()
  }

  async function markStatus(id: string, status: string) {
    await supabase.from('biz_proposals').update({ status }).eq('id', id)
    await loadProposals()
  }

  const addonTotal = form.addons.reduce(
    (sum, a) => sum + (parseFloat(a.amount.replace(/[^0-9.]/g, '')) || 0), 0,
  )
  const feeTotal = form.fees.reduce(
    (sum, f) => sum + (parseFloat(f.amount.replace(/[^0-9.]/g, '')) || 0), 0,
  )

  const proposalText = `CREATIVE PROPOSAL
${form.services.length ? form.services.join(' + ').toUpperCase() : 'CUSTOM ENGAGEMENT'}
${form.other_service ? `+ ${form.other_service.toUpperCase()}` : ''}

Prepared for: ${form.client_name || '[Client Name]'}
${form.client_business ? `Business: ${form.client_business}` : ''}
Date: ${form.date}
Prepared by: Jessica Francois — Creative Consultant

────────────────────────────────────────

THE SITUATION

${form.problem || '[Describe the creative or strategic gap.]'}
${form.problem_notes ? `\nNotes: ${form.problem_notes}` : ''}

────────────────────────────────────────

THE DIRECTION

${form.solution || '[Describe your approach.]'}

────────────────────────────────────────

WHAT YOU RECEIVE

${form.deliverables.map((d, i) => `${String(i + 1).padStart(2, '0')}. ${d.text}`).join('\n') || '[Deliverables]'}

────────────────────────────────────────

TIMELINE

${form.timeline || '[Timeline]'}
${form.timeline_notes ? `\n${form.timeline_notes}` : ''}

────────────────────────────────────────

INVESTMENT

Total: ${form.investment || '[Amount]'}
${form.addons.length ? `\nAdd-ons:\n${form.addons.map(a => `— ${a.label}: ${a.amount}`).join('\n')}` : ''}
${form.fees.length ? `\nFees:\n${form.fees.map(f => `— ${f.label}: ${f.amount}`).join('\n')}` : ''}
${addonTotal || feeTotal ? `\nAdditional total: $${(addonTotal + feeTotal).toFixed(2)}` : ''}

Payment structure:
— 30% deposit to begin: ${form.deposit || '[Amount]'}
— 30% at project midpoint: ${form.milestone || '[Amount]'}
— 40% on final delivery: ${form.final_payment || '[Amount]'}

Accepted payments: CashApp · Zelle · Venmo · Square

This proposal is valid for 48 hours from the date above.

────────────────────────────────────────

NEXT STEPS

1. Review and confirm this proposal
2. Submit your deposit to lock your start date
3. You'll receive an onboarding questionnaire within 24 hours
4. We begin

Questions? Reply directly to this message or email thriv3.llc@gmail.com

────────────────────────────────────────

Jessica Francois
Creative Consultant — Strategy · Campaigns · Brand Direction
thriv3.llc@gmail.com`

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div>
        <div className="biz-page-header">
          <div>
            <div className="biz-page-kicker">Business</div>
            <h1 className="biz-h1">Proposals</h1>
            <p className="biz-subtitle">All your proposals in one place.</p>
          </div>
          <button className="biz-btn" onClick={newProposal}>+ New Proposal</button>
        </div>

        <div className="biz-proposal-list">
          {proposals.length === 0 && (
            <div className="biz-empty">No proposals yet. Create your first one.</div>
          )}
          {proposals.map(p => (
            <div key={p.id} className={`biz-proposal-row biz-proposal-row--${p.status}`}>
              <div className="biz-proposal-row-main" onClick={() => openProposal(p)}>
                <div className="biz-proposal-row-client">
                  {p.client_name || 'Untitled Proposal'}
                  {p.client_business && (
                    <span className="biz-proposal-row-biz">{p.client_business}</span>
                  )}
                </div>
                <div className="biz-proposal-row-meta">
                  <span className={`biz-status-badge biz-status-badge--${p.status}`}>{p.status}</span>
                  {p.services?.length > 0 && (
                    <span className="biz-proposal-row-services">{p.services.join(' · ')}</span>
                  )}
                  {p.investment && <span className="biz-proposal-row-amount">{p.investment}</span>}
                  <span className="biz-proposal-row-date">
                    {p.date || new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="biz-proposal-row-actions">
                <button className="biz-ghost-btn" onClick={() => openProposal(p)}>Edit</button>
                {p.status === 'draft' && (
                  <button className="biz-ghost-btn biz-ghost-btn--accent" onClick={() => markStatus(p.id, 'sent')}>
                    Mark Sent
                  </button>
                )}
                {p.status === 'sent' && (
                  <>
                    <button className="biz-ghost-btn biz-ghost-btn--success" onClick={() => markStatus(p.id, 'accepted')}>
                      Accepted
                    </button>
                    <button className="biz-ghost-btn biz-ghost-btn--danger" onClick={() => markStatus(p.id, 'declined')}>
                      Declined
                    </button>
                  </>
                )}
                <button className="biz-ghost-btn biz-ghost-btn--danger" onClick={() => archiveProposal(p.id)}>
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── EDIT VIEW ─────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="biz-page-header">
        <div>
          <button className="biz-back-btn" onClick={() => setView('list')}>← All Proposals</button>
          <h1 className="biz-h1">{activeProposalId ? 'Edit Proposal' : 'New Proposal'}</h1>
        </div>
        <div className="biz-header-actions">
          <button className="biz-ghost-btn" onClick={() => setPreview(!preview)}>
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
          <CopyBtn text={proposalText} />
          <button className="biz-btn" onClick={saveProposal} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div className={`biz-proposal-grid ${preview ? 'biz-proposal-grid--with-preview' : ''}`}>
        {/* ── FORM ─────────────────────────────────────────────── */}
        <div className="biz-form-col">

          {/* CLIENT */}
          <div className="biz-card">
            <div className="biz-card-title">Client Info</div>
            <label className="biz-label">Client name</label>
            <input className="biz-input" value={form.client_name}
              onChange={e => setField('client_name', e.target.value)} placeholder="Founder or company name" />
            <label className="biz-label">Business / brand</label>
            <input className="biz-input" value={form.client_business}
              onChange={e => setField('client_business', e.target.value)} placeholder="What they do" />
            <label className="biz-label">Date</label>
            <input className="biz-input" value={form.date}
              onChange={e => setField('date', e.target.value)} />
          </div>

          {/* SERVICES */}
          <div className="biz-card">
            <div className="biz-card-title">
              Services <span className="biz-card-title-sub">Select all that apply</span>
            </div>
            <div className="biz-service-chips">
              {services.map(s => (
                <button
                  key={s.id}
                  className={`biz-chip ${form.services.includes(s.name) ? 'is-selected' : ''}`}
                  style={{ '--chip-color': s.color } as React.CSSProperties}
                  onClick={() => toggleService(s.name)}
                >
                  {s.name}
                </button>
              ))}
              <button
                className={`biz-chip ${form.services.includes('Other') ? 'is-selected' : ''}`}
                onClick={() => {
                  if (form.services.includes('Other')) {
                    setField('services', form.services.filter(s => s !== 'Other'))
                  } else {
                    setField('services', [...form.services, 'Other'])
                  }
                }}
              >
                Other
              </button>
            </div>
            {form.services.includes('Other') && (
              <>
                <label className="biz-label" style={{ marginTop: 12 }}>Describe the other service</label>
                <input className="biz-input" value={form.other_service}
                  onChange={e => setField('other_service', e.target.value)} placeholder="Custom engagement description" />
              </>
            )}
          </div>

          {/* THE SITUATION */}
          <div className="biz-card">
            <div className="biz-card-title">The Situation</div>
            <label className="biz-label">What problem are we solving?</label>
            <textarea className="biz-textarea" value={form.problem}
              onChange={e => setField('problem', e.target.value)}
              placeholder="Describe the creative or strategic gap — what the client is dealing with and why it matters right now." />
            <label className="biz-label" style={{ marginTop: 12 }}>
              Notes <span className="biz-label-optional">(internal, not included in proposal)</span>
            </label>
            <textarea className="biz-textarea biz-textarea--sm" value={form.problem_notes}
              onChange={e => setField('problem_notes', e.target.value)}
              placeholder="Discovery call notes, context, what they said verbatim…" />
            <label className="biz-label" style={{ marginTop: 12 }}>Your approach</label>
            <textarea className="biz-textarea" value={form.solution}
              onChange={e => setField('solution', e.target.value)}
              placeholder="What you'll do and why it's the right move for this brand right now." />
          </div>

          {/* DELIVERABLES */}
          <div className="biz-card">
            <div className="biz-card-title">Deliverables & Timeline</div>
            <label className="biz-label">
              Deliverables <span className="biz-label-optional">drag to reorder</span>
            </label>
            <DeliverableList items={form.deliverables} onChange={v => setField('deliverables', v)} />
            <label className="biz-label" style={{ marginTop: 16 }}>Timeline</label>
            <input className="biz-input" value={form.timeline}
              onChange={e => setField('timeline', e.target.value)} placeholder="2–3 weeks" />
            <label className="biz-label" style={{ marginTop: 12 }}>
              Timeline notes <span className="biz-label-optional">(internal)</span>
            </label>
            <textarea className="biz-textarea biz-textarea--sm" value={form.timeline_notes}
              onChange={e => setField('timeline_notes', e.target.value)}
              placeholder="Milestones, client-dependent dates, dependencies…" />
          </div>

          {/* INVESTMENT */}
          <div className="biz-card">
            <div className="biz-card-title">Investment</div>
            <div className="biz-row-2">
              <div>
                <label className="biz-label">Total</label>
                <input className="biz-input" value={form.investment}
                  onChange={e => setField('investment', e.target.value)} placeholder="$6,500" />
              </div>
              <div>
                <label className="biz-label">Deposit (30%)</label>
                <input className="biz-input" value={form.deposit}
                  onChange={e => setField('deposit', e.target.value)} placeholder="$1,950" />
              </div>
              <div>
                <label className="biz-label">Midpoint (30%)</label>
                <input className="biz-input" value={form.milestone}
                  onChange={e => setField('milestone', e.target.value)} placeholder="$1,950" />
              </div>
              <div>
                <label className="biz-label">Final (40%)</label>
                <input className="biz-input" value={form.final_payment}
                  onChange={e => setField('final_payment', e.target.value)} placeholder="$2,600" />
              </div>
            </div>
            <label className="biz-label" style={{ marginTop: 20 }}>Add-ons</label>
            <LineItemList items={form.addons} onChange={v => setField('addons', v)}
              placeholder="Add-on name (e.g. Rush delivery)" />
            <label className="biz-label" style={{ marginTop: 16 }}>Fees</label>
            <LineItemList items={form.fees} onChange={v => setField('fees', v)}
              placeholder="Fee name (e.g. Platform license)" />
          </div>

        </div>

        {/* ── PREVIEW ──────────────────────────────────────────── */}
        {preview && (
          <div className="biz-preview-col">
            <div className="biz-proposal-preview">
              <pre className="biz-proposal-pre">{proposalText}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}