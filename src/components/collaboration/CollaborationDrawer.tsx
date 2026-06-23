// components/collaboration/CollaborationDrawer.tsx
'use client'

import { useState } from 'react'
import type { Collaborator, CollaboratorRole } from '@/types'
import { ROLE_PERMISSIONS } from '@/types'

interface Props {
  entryId: string
  collaborators: Collaborator[]
  currentUserRole: CollaboratorRole | null
  onInvite: (email: string, role: CollaboratorRole) => Promise<{ error: string | null }>
  onRemove: (id: string) => Promise<{ error: string | null }>
  onChangeRole: (id: string, role: CollaboratorRole) => Promise<{ error: string | null }>
  onTransferOwnership: (id: string) => Promise<{ error: string | null }>
  onClose: () => void
}

const ROLE_LABELS: Record<CollaboratorRole, string> = {
  owner: 'Owner',
  editor: 'Editor',
  reviewer: 'Reviewer',
  viewer: 'Viewer',
}

const ROLE_DESCRIPTIONS: Record<CollaboratorRole, string> = {
  owner: 'Full access — can delete, manage, and publish',
  editor: 'Can edit content and resolve comments',
  reviewer: 'Can add comments and review notes',
  viewer: 'Read-only access',
}

export default function CollaborationDrawer({
  entryId,
  collaborators,
  currentUserRole,
  onInvite,
  onRemove,
  onChangeRole,
  onTransferOwnership,
  onClose,
}: Props) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<CollaboratorRole>('viewer')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'invite' | 'manage'>('invite')

  const canManage = currentUserRole ? ROLE_PERMISSIONS[currentUserRole].canManageCollaborators : false

  async function handleInvite() {
    if (!email.trim()) return setError('Enter an email address.')
    setInviting(true)
    setError('')
    const { error: err } = await onInvite(email.trim(), role)
    setInviting(false)
    if (err) {
      setError(err)
    } else {
      setSuccess(`Invite sent to ${email}`)
      setEmail('')
    }
  }

  return (
    <div className="collab-drawer-overlay" onClick={onClose}>
      <div className="collab-drawer" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="collab-drawer__header">
          <div>
            <h2 className="collab-drawer__title">Collaboration</h2>
            <p className="collab-drawer__subtitle">{collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="collab-drawer__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        <div className="collab-tabs">
          <button
            className={`collab-tab ${activeTab === 'invite' ? 'collab-tab--active' : ''}`}
            onClick={() => setActiveTab('invite')}
          >
            Invite
          </button>
          <button
            className={`collab-tab ${activeTab === 'manage' ? 'collab-tab--active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage ({collaborators.length})
          </button>
        </div>

        {/* Invite Tab */}
        {activeTab === 'invite' && (
          <div className="collab-drawer__body">
            {!canManage && (
              <div className="collab-notice">
                Only the owner can invite collaborators.
              </div>
            )}

            <label className="collab-label">Email address</label>
            <input
              type="email"
              className="collab-input"
              placeholder="colleague@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInvite()}
              disabled={!canManage}
            />

            <label className="collab-label">Role</label>
            <div className="collab-role-grid">
              {(['editor', 'reviewer', 'viewer'] as CollaboratorRole[]).map(r => (
                <button
                  key={r}
                  className={`collab-role-card ${role === r ? 'collab-role-card--active' : ''}`}
                  onClick={() => setRole(r)}
                  disabled={!canManage}
                >
                  <span className="collab-role-card__name">{ROLE_LABELS[r]}</span>
                  <span className="collab-role-card__desc">{ROLE_DESCRIPTIONS[r]}</span>
                </button>
              ))}
            </div>

            {error && <p className="collab-error">{error}</p>}
            {success && <p className="collab-success">{success}</p>}

            <button
              className="collab-invite-btn"
              onClick={handleInvite}
              disabled={inviting || !canManage}
            >
              {inviting ? 'Sending…' : 'Send Invite'}
            </button>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="collab-drawer__body">
            {collaborators.length === 0 ? (
              <p className="collab-empty">No collaborators yet.</p>
            ) : (
              <ul className="collab-list">
                {collaborators.map(c => (
                  <li key={c.id} className="collab-list-item">
                    <div className="collab-avatar" style={{ background: `hsl(${hashToHue(c.email)}, 60%, 40%)` }}>
                      {(c.display_name ?? c.email)[0].toUpperCase()}
                    </div>
                    <div className="collab-list-item__info">
                      <span className="collab-list-item__name">{c.display_name ?? c.email}</span>
                      <span className="collab-list-item__status">
                        {c.status === 'pending' ? '⏳ Invite pending' : '✓ Active'}
                      </span>
                    </div>
                    {canManage && c.role !== 'owner' && (
                      <div className="collab-list-item__actions">
                        <select
                          className="collab-role-select"
                          value={c.role}
                          onChange={e => onChangeRole(c.id, e.target.value as CollaboratorRole)}
                        >
                          {(['editor', 'reviewer', 'viewer'] as CollaboratorRole[]).map(r => (
                            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                          ))}
                        </select>
                        <button
                          className="collab-remove-btn"
                          onClick={() => onRemove(c.id)}
                          title="Remove collaborator"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {canManage && c.role !== 'owner' && (
                      <button
                        className="collab-transfer-btn"
                        onClick={() => {
                          if (confirm(`Transfer ownership to ${c.display_name ?? c.email}?`)) {
                            onTransferOwnership(c.id)
                          }
                        }}
                        title="Transfer ownership"
                      >
                        Transfer Ownership
                      </button>
                    )}
                    {c.role === 'owner' && (
                      <span className="collab-owner-badge">Owner</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function hashToHue(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}