// types.ts  (replace entire file)

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'quote'
  | 'checklist'
  | 'callout'
  | 'divider'

export interface Block {
  id: string
  type: BlockType
  content: string
  checked?: boolean
}

// ─── Collaboration ────────────────────────────────────────────

export type CollaboratorRole = 'owner' | 'editor' | 'reviewer' | 'viewer'
export type CollaboratorStatus = 'pending' | 'accepted' | 'declined'
export type TaskStatus = 'open' | 'in_progress' | 'completed'

export interface Collaborator {
  id: string
  entry_id: string
  user_id: string | null
  email: string
  role: CollaboratorRole
  invited_by: string | null
  status: CollaboratorStatus
  created_at: string
  // joined from auth.users via RPC or view
  display_name?: string
  avatar_url?: string
}

export interface CollaborationActivity {
  id: string
  entry_id: string
  user_id: string | null
  action: string
  metadata: Record<string, unknown> | null
  created_at: string
  // joined
  display_name?: string
  avatar_url?: string
  color?: string   // random per-user presence color
}

export interface EntryComment {
  id: string
  entry_id: string
  user_id: string
  parent_id: string | null
  content: string
  resolved: boolean
  assigned_to: string | null
  due_date: string | null
  task_status: TaskStatus
  mentioned_users: string[] | null
  created_at: string
  updated_at: string
  // joined
  author_name?: string
  author_avatar?: string
  assignee_name?: string
  replies?: EntryComment[]
}

export interface ActiveUser {
  user_id: string
  display_name: string
  avatar_url?: string
  color: string
  action: string
  last_seen: string
}

// ─── Favorites ────────────────────────────────────────────────

export interface FavoriteEntry {
  id: string
  user_id: string
  entry_id: string
  created_at: string
}

// ─── Permissions helper ───────────────────────────────────────

export const ROLE_PERMISSIONS: Record<CollaboratorRole, {
  canEdit: boolean
  canComment: boolean
  canResolve: boolean
  canPublish: boolean
  canManageCollaborators: boolean
  canDelete: boolean
}> = {
  owner: {
    canEdit: true,
    canComment: true,
    canResolve: true,
    canPublish: true,
    canManageCollaborators: true,
    canDelete: true,
  },
  editor: {
    canEdit: true,
    canComment: true,
    canResolve: true,
    canPublish: false,
    canManageCollaborators: false,
    canDelete: false,
  },
  reviewer: {
    canEdit: false,
    canComment: true,
    canResolve: false,
    canPublish: false,
    canManageCollaborators: false,
    canDelete: false,
  },
  viewer: {
    canEdit: false,
    canComment: false,
    canResolve: false,
    canPublish: false,
    canManageCollaborators: false,
    canDelete: false,
  },
}