'use client'

// ─── src/components/Business/BusinessShell.tsx ───────────────────────────────

import { useState } from 'react'
import ProposalBuilder from './ProposalBuilder'
import MessageTemplates from './MessageTemplates'
import ServiceCards from './ServiceCards'
import OfferFAQ from './OfferFAQ'
import OutreachPipeline from './OutreachPipeline'
import ClientManager from './ClientManager'




type Tab = 'proposals' | 'messages' | 'services' | 'faq' | 'outreach' | 'clients'

const TABS: { id: Tab; label: string }[] = [
  { id: 'proposals', label: 'Proposal Builder' },
  { id: 'messages',  label: 'Message Templates' },
  { id: 'services',  label: 'Service Descriptions' },
  { id: 'faq',       label: 'FAQ & Offers' },
  { id: 'outreach',  label: 'Outreach Pipeline' },
  { id: 'clients',   label: 'Client Management' },
]

export default function BusinessShell() {
  const [tab, setTab] = useState<Tab>('proposals')

  return (
    <div className="biz-shell">
      <nav className="biz-nav">
        <span className="biz-nav-brand">JF</span>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`biz-nav-btn ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="biz-page">
        {tab === 'proposals' && <ProposalBuilder />}
        {tab === 'messages'  && <MessageTemplates />}
        {tab === 'services'  && <ServiceCards />}
        {tab === 'faq'       && <OfferFAQ />}
        {tab === 'outreach'  && <OutreachPipeline />}
        {tab === 'clients'   && <ClientManager />}
      </div>
    </div>
  )
}