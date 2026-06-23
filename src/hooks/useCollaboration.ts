// hooks/useCollaboration.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Collaborator,CollaboratorRole, EntryComment, ActiveUser, CollaborationActivity, } from '@/types'

// Stable random colors for user presence
const PRESENCE_COLORS = [
  '#d8bc6e', '#6e9cd8', '#d86e6e', '#6ed8a0',
  '#b86ed8', '#d8906e', '#6ed8d4', '#d86ea8',
]

function getColorForUser(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PRESENCE_COLORS[Math.abs(hash) % PRESENCE_COLORS.length]
}

export function useCollaboration(entryId: string | null) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [comments, setComments] = useState<EntryComment[]>([])
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserRole, setCurrentUserRole] = useState<CollaboratorRole | null>(null)
  const presenceChannel = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // ── Load collaborators ──────────────────────────────────────
  const loadCollaborators = useCallback(async () => {
    if (!entryId) return
    const { data } = await supabase
      .from('entry_collaborators')
      .select('*')
      .eq('entry_id', entryId)
      .eq('status', 'accepted')
    setCollaborators(data || [])

    // Determine current user's role
    const { data: { user } } = await supabase.auth.getUser()
    if (user && data) {
      const me = data.find(c => c.user_id === user.id)
      setCurrentUserRole(me?.role ?? null)
    }
  }, [entryId])

  // ── Load comments ───────────────────────────────────────────
  const loadComments = useCallback(async () => {
    if (!entryId) return
    const { data } = await supabase
      .from('entry_comments')
      .select('*')
      .eq('entry_id', entryId)
      .is('parent_id', null)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }, [entryId])

  // ── Invite collaborator ─────────────────────────────────────
  const inviteCollaborator = useCallback(async (email: string, role: CollaboratorRole) => {
    if (!entryId) return { error: 'No entry ID' }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
      .from('entry_collaborators')
      .insert({
        entry_id: entryId,
        email: email.toLowerCase().trim(),
        role,
        invited_by: user.id,
        status: 'pending',
      })

    if (!error) await loadCollaborators()
    return { error: error?.message ?? null }
  }, [entryId, loadCollaborators])

  // ── Remove collaborator ─────────────────────────────────────
  const removeCollaborator = useCallback(async (collaboratorId: string) => {
    const { error } = await supabase
      .from('entry_collaborators')
      .delete()
      .eq('id', collaboratorId)
    if (!error) await loadCollaborators()
    return { error: error?.message ?? null }
  }, [loadCollaborators])

  // ── Change role ─────────────────────────────────────────────
  const changeRole = useCallback(async (collaboratorId: string, role: CollaboratorRole) => {
    const { error } = await supabase
      .from('entry_collaborators')
      .update({ role })
      .eq('id', collaboratorId)
    if (!error) await loadCollaborators()
    return { error: error?.message ?? null }
  }, [loadCollaborators])

  // ── Transfer ownership ──────────────────────────────────────
  const transferOwnership = useCallback(async (toCollaboratorId: string) => {
    if (!entryId) return { error: 'No entry ID' }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Demote current owner to editor
    await supabase
      .from('entry_collaborators')
      .update({ role: 'editor' })
      .eq('entry_id', entryId)
      .eq('user_id', user.id)

    // Promote target to owner
    const { error } = await supabase
      .from('entry_collaborators')
      .update({ role: 'owner' })
      .eq('id', toCollaboratorId)

    if (!error) await loadCollaborators()
    return { error: error?.message ?? null }
  }, [entryId, loadCollaborators])

  // ── Add comment ─────────────────────────────────────────────
  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!entryId) return { error: 'No entry ID' }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
      .from('entry_comments')
      .insert({
        entry_id: entryId,
        user_id: user.id,
        content,
        parent_id: parentId ?? null,
      })

    if (!error) await loadComments()
    return { error: error?.message ?? null }
  }, [entryId, loadComments])

  // ── Resolve comment ─────────────────────────────────────────
  const resolveComment = useCallback(async (commentId: string) => {
    const { error } = await supabase
      .from('entry_comments')
      .update({ resolved: true })
      .eq('id', commentId)
    if (!error) await loadComments()
    return { error: error?.message ?? null }
  }, [loadComments])

  // ── Create review task ──────────────────────────────────────
  const createReviewTask = useCallback(async (params: {
    content: string
    assignedTo?: string
    dueDate?: string
    parentId?: string
  }) => {
    if (!entryId) return { error: 'No entry ID' }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
      .from('entry_comments')
      .insert({
        entry_id: entryId,
        user_id: user.id,
        content: params.content,
        parent_id: params.parentId ?? null,
        assigned_to: params.assignedTo ?? null,
        due_date: params.dueDate ?? null,
        task_status: 'open',
      })

    if (!error) await loadComments()
    return { error: error?.message ?? null }
  }, [entryId, loadComments])

  // ── Realtime: comments ──────────────────────────────────────
  useEffect(() => {
    if (!entryId) return

    const channel = supabase
      .channel(`comments:${entryId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entry_comments', filter: `entry_id=eq.${entryId}` },
        () => { loadComments() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [entryId, loadComments])

  // ── Realtime: presence ──────────────────────────────────────
  useEffect(() => {
    if (!entryId) return

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return

      const channel = supabase.channel(`presence:${entryId}`, {
        config: { presence: { key: user.id } },
      })

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState<{ display_name: string; avatar_url?: string; action: string }>()
          const users: ActiveUser[] = Object.entries(state).map(([uid, presences]) => {
            const p = presences[0]
            return {
              user_id: uid,
              display_name: p.display_name ?? 'User',
              avatar_url: p.avatar_url,
              color: getColorForUser(uid),
              action: p.action ?? 'viewing',
              last_seen: new Date().toISOString(),
            }
          })
          setActiveUsers(users)
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              display_name: user.user_metadata?.name ?? user.email ?? 'User',
              avatar_url: user.user_metadata?.avatar_url,
              action: 'editing',
            })
          }
        })

      presenceChannel.current = channel
    })

    return () => {
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current)
      }
    }
  }, [entryId])

  // ── Initial load ────────────────────────────────────────────
  useEffect(() => {
    if (!entryId) return
    setLoading(true)
    Promise.all([loadCollaborators(), loadComments()]).finally(() => setLoading(false))
  }, [entryId, loadCollaborators, loadComments])

  return {
    collaborators,
    comments,
    activeUsers,
    loading,
    currentUserRole,
    inviteCollaborator,
    removeCollaborator,
    changeRole,
    transferOwnership,
    addComment,
    resolveComment,
    createReviewTask,
    reload: () => Promise.all([loadCollaborators(), loadComments()]),
  }
}