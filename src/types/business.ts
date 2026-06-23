// ─── src/types/business.ts ───────────────────────────────────────────────────
// Replaces: src/types/thriv3.ts (delete that file)

export type ServiceStatus  = 'active' | 'archived' | 'deleted'
export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'archived'
export type ContactStatus  =
  | 'prospect' | 'reached_out' | 'in_conversation'
  | 'proposal_sent' | 'active_client' | 'past_client'
  | 'not_a_fit' | 'archived'
export type ClientStatus =
  | 'Inquiry'
  | 'Discovery'
  | 'Proposal'
  | 'Active'
  | 'Completed'
  | 'Archived'
  
export type ActivityType =
  | 'outreach' | 'follow_up' | 'call' | 'proposal_sent'
  | 'email' | 'dm' | 'note' | 'status_change'

export type BusinessService = {
  id: string
  code: string | null
  name: string
  tagline: string | null
  description: string | null
  deliverables: string[]
  timeline: string | null
  price: string | null
  best_for: string | null
  color: string
  status: ServiceStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export type BusinessMessage = {
  id: string
  category: string
  label: string
  context: string | null
  body: string
  status: ServiceStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export type BusinessFAQ = {
  id: string
  section: string
  question: string
  answer: string
  color: string
  status: ServiceStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export type DeliverableItem = { id: string; text: string }
export type AddonItem       = { id: string; label: string; amount: string }

export type BusinessProposal = {
  id: string
  client_name: string | null
  client_business: string | null
  date: string | null
  services: string[]
  other_service: string | null
  problem: string | null
  problem_notes: string | null
  solution: string | null
  deliverables: DeliverableItem[]
  timeline: string | null
  timeline_notes: string | null
  investment: string | null
  deposit: string | null
  milestone: string | null
  final_payment: string | null
  addons: AddonItem[]
  fees: AddonItem[]
  status: ProposalStatus
  created_at: string
  updated_at: string
}

export type BusinessContact = {
  id: string
  name: string
  business: string | null
  email: string | null
  phone: string | null
  instagram: string | null
  linkedin: string | null
  source: string | null
  tags: string[]
  notes: string | null
  status: ContactStatus
  last_contact: string | null
  next_follow_up: string | null
  created_at: string
  updated_at: string
}

export type BusinessActivity = {
  id: string
  contact_id: string
  type: ActivityType
  body: string | null
  template_used: string | null
  created_at: string
}

export type BusinessClient = {
  id: string
  contact_id: string | null
  name: string
  business: string | null
  email: string | null
  service: string | null
  services: string[]
  start_date: string | null
  end_date: string | null
  total_value: string | null
  deposit_paid: boolean
  milestone_paid: boolean
  final_paid: boolean
  status: ClientStatus
  notes: string | null
  next_action: string | null
  next_action_date: string | null
  created_at: string
  updated_at: string
}

export type BusinessDeliverable = {
  id: string
  client_id: string
  title: string
  notes: string | null
  due_date: string | null
  completed: boolean
  sort_order: number
  created_at: string
}

export type CommunicationLogEntry = {
  id: string
  date: string
  method: 'email' | 'call' | 'meeting' | 'message' | 'other'
  summary: string
  direction: 'inbound' | 'outbound'
}
 
export type Deliverable = {
  id: string
  title: string
  due_date?: string
  completed: boolean
}
 
export type TimelineEvent = {
  id: string
  date: string
  label: string
  note?: string
}
 
export type Client = {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  status: ClientStatus
  notes?: string
  documents?: string[]
  linked_project_ids?: string[]
  deliverables?: Deliverable[]
  communication_log?: CommunicationLogEntry[]
  timeline?: TimelineEvent[]
  payment_amount?: number
  payment_status?: 'unpaid' | 'partial' | 'paid'
  payment_due?: string
  created_at: string
  updated_at: string
  archived_at?: string
}
