'use client'
// ─────────────────────────────────────────────────────────────────────────────
// SettingsMenu.tsx
// Fully working settings dropdown for the journal editor.
// Does NOT depend on external hooks that may not exist.
// All features either work or degrade gracefully.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ThemeSelector from '../components/ThemeSelector'
import ViewSelector  from '../components/ViewSelector'
import './editor.css'

// ── Types ─────────────────────────────────────────────────────────────────────

type Collaborator = {
  id: string
  email: string
  role: 'viewer' | 'editor' | 'owner'
  user_id: string
}

type SettingsMenuProps = {
  entryId?: string
  editor?: any           // Tiptap editor instance — for export
  theme: string
  setThemeAction: (value: string) => void
  viewMode: string
  setViewModeAction: (value: string) => void
  onSaveDraftAction?: () => void
  onPublishAction?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SettingsMenu({
  entryId,
  editor,
  theme,
  setThemeAction,
  viewMode,
  setViewModeAction,
  onSaveDraftAction,
  onPublishAction,
}: SettingsMenuProps) {
  const router = useRouter()

  const [open, setOpen]               = useState(false)
  const [collabOpen, setCollabOpen]   = useState(false)
  const [favorited, setFavorited]     = useState(false)
  const [favLoading, setFavLoading]   = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState<'viewer' | 'editor'>('editor')
  const [inviting, setInviting]       = useState(false)
  const [inviteError, setInviteError] = useState('')

  const menuRef = useRef<HTMLDivElement>(null)

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Load favorite status ───────────────────────────────────────────────────
  useEffect(() => {
    if (!entryId) return
    supabase
      .from('favorites')
      .select('id')
      .eq('entry_id', entryId)
      .maybeSingle()
      .then(({ data }) => setFavorited(!!data))
  }, [entryId])

  // ── Load collaborators ────────────────────────────────────────────────────
  useEffect(() => {
    if (!entryId) return
    supabase
      .from('entry_collaborators')
      .select('*')
      .eq('entry_id', entryId)
      .then(({ data }) => setCollaborators(data ?? []))
  }, [entryId])

  // ── Toggle favorite ───────────────────────────────────────────────────────
  async function toggleFavorite() {
    if (!entryId || favLoading) return
    setFavLoading(true)
    if (favorited) {
      await supabase.from('favorites').delete().eq('entry_id', entryId)
      setFavorited(false)
    } else {
      await supabase.from('favorites').insert({ entry_id: entryId })
      setFavorited(true)
    }
    setFavLoading(false)
  }

  // ── Copy helpers ──────────────────────────────────────────────────────────
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied')
    } catch {
      toast('Failed to copy link')
    }
  }

  async function copyText() {
    try {
      const text = editor?.getText() ?? document.body.innerText
      await navigator.clipboard.writeText(text)
      toast('Content copied')
    } catch {
      toast('Failed to copy content')
    }
  }

  // ── Export ────────────────────────────────────────────────────────────────
  function exportMarkdown() {
    if (!editor) return
    const md = htmlToMarkdown(editor.getHTML())
    downloadFile(md, 'entry.md', 'text/markdown')
  }

  function exportHTML() {
    if (!editor) return
    downloadFile(editor.getHTML(), 'entry.html', 'text/html')
  }

  function exportJSON() {
    if (!editor) return
    downloadFile(JSON.stringify(editor.getJSON(), null, 2), 'entry.json', 'application/json')
  }

  function exportPDF() {
    window.print()
  }

  // ── Invite collaborator ───────────────────────────────────────────────────
  async function inviteCollaborator() {
    if (!entryId || !inviteEmail.trim()) return
    setInviting(true)
    setInviteError('')

    // Look up user by email
    const { data: user } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', inviteEmail.trim())
      .maybeSingle()

    if (!user) {
      setInviteError('No user found with that email.')
      setInviting(false)
      return
    }

    const { error } = await supabase
      .from('entry_collaborators')
      .upsert({
        entry_id: entryId,
        user_id: user.id,
        email: inviteEmail.trim(),
        role: inviteRole,
      }, { onConflict: 'entry_id,user_id' })

    if (error) {
      setInviteError(error.message)
    } else {
      setInviteEmail('')
      // Reload collaborators
      const { data } = await supabase.from('entry_collaborators').select('*').eq('entry_id', entryId)
      setCollaborators(data ?? [])
      toast('Collaborator invited')
    }
    setInviting(false)
  }

  async function removeCollaborator(id: string) {
    await supabase.from('entry_collaborators').delete().eq('id', id)
    setCollaborators(prev => prev.filter(c => c.id !== id))
  }

  async function changeRole(id: string, role: 'viewer' | 'editor') {
    await supabase.from('entry_collaborators').update({ role }).eq('id', id)
    setCollaborators(prev => prev.map(c => c.id === id ? { ...c, role } : c))
  }

  // ── Toast (minimal) ───────────────────────────────────────────────────────
  function toast(msg: string) {
    const el = document.createElement('div')
    el.className = 'sm-toast'
    el.textContent = msg
    document.body.appendChild(el)
    setTimeout(() => { el.classList.add('show') }, 10)
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300) }, 2200)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="settings-menu" ref={menuRef}>

      {/* Trigger button */}
      <button
        type="button"
        className={`sm-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Settings"
        aria-label="Open settings"
      >
        <span className="sm-trigger-line" />
        <span className="sm-trigger-line" />
        <span className="sm-trigger-line" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="sm-dropdown" role="menu">

          {/* ── APPEARANCE ── */}
          <Section label="Appearance">
            <ThemeSelector theme={theme} setThemeAction={setThemeAction} />
          </Section>

          <Divider />

          {/* ── VIEW ── */}
          <Section label="View">
            <ViewSelector viewMode={viewMode} setViewModeAction={setViewModeAction} />
          </Section>

          <Divider />

          {/* ── PUBLISHING ── */}
          <Section label="Publishing">
            {onSaveDraftAction && (
              <MenuItem
                onClick={() => { onSaveDraftAction(); setOpen(false) }}
                icon=""
              >
                Save Draft
              </MenuItem>
            )}
            {onPublishAction && (
              <MenuItem
                onClick={() => { onPublishAction(); setOpen(false) }}
                icon=""
              >
                Publish Entry
              </MenuItem>
            )}
            <MenuItem onClick={() => router.push('/dashboard/journal/schedule')} icon="📅">
              Schedule Post
            </MenuItem>
            <MenuItem onClick={() => router.push('/dashboard/journal/seo')} icon="🔍">
              SEO Settings
            </MenuItem>
          </Section>

          <Divider />

          {/* ── ORGANIZATION ── */}
          <Section label="Organization">
            <MenuItem
              onClick={toggleFavorite}
              icon={favorited ? '★' : '☆'}
              active={favorited}
              disabled={favLoading}
            >
              {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
            </MenuItem>
            <MenuItem onClick={() => router.push('/dashboard/journal/ideas')} icon="💡">
              Save as Idea
            </MenuItem>
          </Section>

          <Divider />

          {/* ── EXPORT ── */}
          <Section label="Export">
            <MenuItem onClick={exportMarkdown} icon="📝" disabled={!editor}>Export Markdown</MenuItem>
            <MenuItem onClick={exportHTML}     icon="🌐" disabled={!editor}>Export HTML</MenuItem>
            <MenuItem onClick={exportJSON}     icon="{ }" disabled={!editor}>Export JSON</MenuItem>
            <MenuItem onClick={exportPDF}      icon="🖨">Print / PDF</MenuItem>
          </Section>

          <Divider />

          {/* ── COLLABORATION ── */}
          <Section label="Collaboration">
            <MenuItem onClick={copyLink} icon="🔗">Copy Entry Link</MenuItem>
            <MenuItem
              onClick={() => { setCollabOpen(o => !o); }}
              icon="👥"
              badge={collaborators.length > 0 ? collaborators.length : undefined}
            >
              {collabOpen ? 'Hide Collaborators' : 'Manage Collaborators'}
            </MenuItem>

            {collabOpen && (
              <div className="sm-collab">
                {/* Invite form */}
                <div className="sm-invite">
                  <input
                    className="sm-input"
                    type="email"
                    placeholder="Email address…"
                    value={inviteEmail}
                    onChange={e => { setInviteEmail(e.target.value); setInviteError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') inviteCollaborator() }}
                  />
                  <select
                    className="sm-select"
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as 'viewer' | 'editor')}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    className="sm-invite-btn"
                    onClick={inviteCollaborator}
                    disabled={inviting || !inviteEmail.trim()}
                  >
                    {inviting ? '…' : 'Invite'}
                  </button>
                </div>
                {inviteError && <p className="sm-error">{inviteError}</p>}

                {/* Collaborator list */}
                {collaborators.length > 0 && (
                  <div className="sm-collab-list">
                    {collaborators.map(c => (
                      <div key={c.id} className="sm-collab-row">
                        <span className="sm-collab-email">{c.email}</span>
                        <select
                          className="sm-select sm-select--sm"
                          value={c.role}
                          onChange={e => changeRole(c.id, e.target.value as 'viewer' | 'editor')}
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                        </select>
                        <button className="sm-remove-btn" onClick={() => removeCollaborator(c.id)}>×</button>
                      </div>
                    ))}
                  </div>
                )}

                {collaborators.length === 0 && !inviting && (
                  <p className="sm-collab-empty">No collaborators yet.</p>
                )}
              </div>
            )}
          </Section>

          <Divider />

          {/* ── HISTORY ── */}
          <Section label="Clipboard">
            <MenuItem onClick={copyText} icon="📋">Copy Entry Text</MenuItem>
          </Section>

        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="sm-section">
      <div className="sm-section-label">{label}</div>
      {children}
    </div>
  )
}

function Divider() {
  return <div className="sm-divider" />
}

function MenuItem({
  children, onClick, icon, active, disabled, badge,
}: {
  children: React.ReactNode
  onClick?: () => void
  icon?: string
  active?: boolean
  disabled?: boolean
  badge?: number
}) {
  return (
    <button
      className={`sm-item ${active ? 'is-active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
    >
      {icon && <span className="sm-item-icon">{icon}</span>}
      <span className="sm-item-label">{children}</span>
      {badge !== undefined && <span className="sm-badge">{badge}</span>}
    </button>
  )
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function htmlToMarkdown(html: string): string {
  // Simple, dependency-free HTML → Markdown
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
    .replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}