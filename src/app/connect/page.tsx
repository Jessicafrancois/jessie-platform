'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import './connect.css'

type TabType = 'collaborate' | 'partner' | 'contact'

const TABS = [
  { id: 'collaborate' as TabType, label: 'Collaborate', number: '01' },
  { id: 'partner' as TabType,     label: 'Partner',     number: '02' },
  { id: 'contact' as TabType,     label: 'Contact',     number: '03' },
]

export default function ConnectPage() {
  const [tab, setTab] = useState<TabType>('collaborate')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Collaborate
  const [collabName,     setCollabName]     = useState('')
  const [collabEmail,    setCollabEmail]    = useState('')
  const [collabProject,  setCollabProject]  = useState('')
  const [collabBudget,   setCollabBudget]   = useState('')
  const [collabTimeline, setCollabTimeline] = useState('')
  const [collabMessage,  setCollabMessage]  = useState('')

  // Partner
  const [partnerCompany,     setPartnerCompany]     = useState('')
  const [partnerContact,     setPartnerContact]     = useState('')
  const [partnerEmail,       setPartnerEmail]       = useState('')
  const [partnerOpportunity, setPartnerOpportunity] = useState('')
  const [partnerBudget,      setPartnerBudget]      = useState('')
  const [partnerDetails,     setPartnerDetails]     = useState('')

  // Contact
  const [contactName,    setContactName]    = useState('')
  const [contactEmail,   setContactEmail]   = useState('')
  const [contactSubject, setContactSubject] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  async function submitCollaborate() {
    if (!collabName || !collabEmail) return
    setSubmitting(true)
    await supabase.from('collaborations').insert({
      name: collabName, email: collabEmail,
      project: collabProject, budget: collabBudget,
      timeline: collabTimeline, message: collabMessage,
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  async function submitPartner() {
    if (!partnerCompany || !partnerEmail) return
    setSubmitting(true)
    await supabase.from('partnerships').insert({
      company: partnerCompany, contact: partnerContact,
      email: partnerEmail, opportunity: partnerOpportunity,
      budget: partnerBudget, details: partnerDetails,
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  async function submitContact() {
    if (!contactName || !contactEmail) return
    setSubmitting(true)
    await supabase.from('inquiries').insert({
      name: contactName, email: contactEmail,
      message: `[${contactSubject}] ${contactMessage}`,
      source: 'contact-page',
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <main className="connect-page">
        <div className="connect-success">
          <span className="connect-success-icon">✦</span>
          <h2>Message received.</h2>
          <p>
            Every meaningful collaboration starts with a conversation.
            I'll be in touch soon.
          </p>
          <button className="connect-success-back" onClick={() => setSubmitted(false)}>
            Send another message
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="connect-page">

      <section className="connect-hero">
        <span className="connect-label">Connect</span>
        <h1 className="connect-title">
          Let's Build
          <br />
          Something Real.
        </h1>
        <p className="connect-intro">
          Every project that matters started with a conversation.
          Choose how you'd like to connect.
        </p>
      </section>

      <div className="connect-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`connect-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => { setTab(t.id); setSubmitted(false) }}
          >
            <span className="connect-tab-number">{t.number}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="connect-form-area">

        {tab === 'collaborate' && (
          <div className="connect-form">
            <div className="connect-form-header">
              <h2>Collaborate</h2>
              <p>
                Explore opportunities to create, build, and experiment together.
                Brand strategy, creative direction, campaign architecture, and
                world-building work.
              </p>
            </div>

            <div className="connect-form-fields">
              <div className="connect-form-row">
                <div className="connect-field">
                  <label>Your Name</label>
                  <input value={collabName} onChange={e => setCollabName(e.target.value)} placeholder="Full name" />
                </div>
                <div className="connect-field">
                  <label>Email</label>
                  <input type="email" value={collabEmail} onChange={e => setCollabEmail(e.target.value)} placeholder="email@domain.com" />
                </div>
              </div>

              <div className="connect-field">
                <label>What are you building?</label>
                <input value={collabProject} onChange={e => setCollabProject(e.target.value)} placeholder="Describe the project or opportunity" />
              </div>

              <div className="connect-form-row">
                <div className="connect-field">
                  <label>Budget Range</label>
                  <select value={collabBudget} onChange={e => setCollabBudget(e.target.value)}>
                    <option value="">Select range</option>
                    <option>Under $2,500</option>
                    <option>$2,500 – $5,000</option>
                    <option>$5,000 – $10,000</option>
                    <option>$10,000+</option>
                    <option>Open to discussion</option>
                  </select>
                </div>
                <div className="connect-field">
                  <label>Timeline</label>
                  <select value={collabTimeline} onChange={e => setCollabTimeline(e.target.value)}>
                    <option value="">Select timeline</option>
                    <option>ASAP</option>
                    <option>1 – 3 months</option>
                    <option>3 – 6 months</option>
                    <option>6+ months</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>

              <div className="connect-field">
                <label>Message</label>
                <textarea
                  value={collabMessage}
                  onChange={e => setCollabMessage(e.target.value)}
                  placeholder="Tell me more about what you're working on and what kind of collaboration you have in mind."
                  rows={5}
                />
              </div>

              <button
                className="connect-submit-btn"
                onClick={submitCollaborate}
                disabled={submitting || !collabName || !collabEmail}
              >
                {submitting ? 'Sending...' : 'Start the Conversation →'}
              </button>
            </div>
          </div>
        )}

        {tab === 'partner' && (
          <div className="connect-form">
            <div className="connect-form-header">
              <h2>Partnerships</h2>
              <p>
                Brand partnerships, platform integrations, and strategic
                collaborations. If your brand aligns with the ecosystem —
                let's explore what's possible.
              </p>
            </div>

            <div className="connect-form-fields">
              <div className="connect-form-row">
                <div className="connect-field">
                  <label>Company / Brand</label>
                  <input value={partnerCompany} onChange={e => setPartnerCompany(e.target.value)} placeholder="Company name" />
                </div>
                <div className="connect-field">
                  <label>Your Name</label>
                  <input value={partnerContact} onChange={e => setPartnerContact(e.target.value)} placeholder="Contact name" />
                </div>
              </div>

              <div className="connect-field">
                <label>Email</label>
                <input type="email" value={partnerEmail} onChange={e => setPartnerEmail(e.target.value)} placeholder="email@company.com" />
              </div>

              <div className="connect-field">
                <label>Partnership Opportunity</label>
                <input value={partnerOpportunity} onChange={e => setPartnerOpportunity(e.target.value)} placeholder="What kind of partnership are you proposing?" />
              </div>

              <div className="connect-field">
                <label>Budget / Resources</label>
                <input value={partnerBudget} onChange={e => setPartnerBudget(e.target.value)} placeholder="What are you bringing to the table?" />
              </div>

              <div className="connect-field">
                <label>Details</label>
                <textarea
                  value={partnerDetails}
                  onChange={e => setPartnerDetails(e.target.value)}
                  placeholder="Describe the opportunity, what you're looking for, and why this partnership makes sense."
                  rows={5}
                />
              </div>

              <button
                className="connect-submit-btn"
                onClick={submitPartner}
                disabled={submitting || !partnerCompany || !partnerEmail}
              >
                {submitting ? 'Sending...' : 'Send Proposal →'}
              </button>
            </div>
          </div>
        )}

        {tab === 'contact' && (
          <div className="connect-form">
            <div className="connect-form-header">
              <h2>Get In Touch</h2>
              <p>
                Direct conversations, press inquiries, general questions,
                or anything else. If it matters, send it.
              </p>
            </div>

            <div className="connect-form-fields">
              <div className="connect-form-row">
                <div className="connect-field">
                  <label>Name</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="connect-field">
                  <label>Email</label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="email@domain.com" />
                </div>
              </div>

              <div className="connect-field">
                <label>Subject</label>
                <input value={contactSubject} onChange={e => setContactSubject(e.target.value)} placeholder="What's this about?" />
              </div>

              <div className="connect-field">
                <label>Message</label>
                <textarea
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Say what you need to say."
                  rows={6}
                />
              </div>

              <button
                className="connect-submit-btn"
                onClick={submitContact}
                disabled={submitting || !contactName || !contactEmail}
              >
                {submitting ? 'Sending...' : 'Send Message →'}
              </button>
            </div>
          </div>
        )}

      </div>

    </main>
  )
}