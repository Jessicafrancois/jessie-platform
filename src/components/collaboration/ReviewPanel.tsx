// components/collaboration/ReviewPanel.tsx
'use client'

import { useState } from 'react'
import ReviewTaskCard from './ReviewTaskCard'
import type { EntryComment, CollaboratorRole, Collaborator } from '@/types'
import { ROLE_PERMISSIONS } from '@/types'

interface Props {
  entryId: string
  comments: EntryComment[]
  collaborators: Collaborator[]
  currentUserRole: CollaboratorRole | null
  onAddComment: (content: string, parentId?: string) => void
  onResolve: (id: string) => void
  onCreateTask: (params: {
    content: string
    assignedTo?: string
    dueDate?: string
  }) => void
}

type FilterMode = 'all' | 'open' | 'resolved' | 'tasks'

export default function ReviewPanel({
  entryId,
  comments,
  collaborators,
  currentUserRole,
  onAddComment,
  onResolve,
  onCreateTask,
}: Props) {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [newComment, setNewComment] = useState('')
  const [taskMode, setTaskMode] = useState(false)
  const [assignTo, setAssignTo] = useState('')
  const [dueDate, setDueDate] = useState('')

  const canComment = currentUserRole ? ROLE_PERMISSIONS[currentUserRole].canComment : false
  const canResolve = currentUserRole ? ROLE_PERMISSIONS[currentUserRole].canResolve : false

  const filtered = comments.filter(c => {
    if (filter === 'open')     return !c.resolved
    if (filter === 'resolved') return c.resolved
    if (filter === 'tasks')    return !!c.assigned_to || !!c.due_date
    return true
  })

  function submitComment() {
    if (!newComment.trim()) return
    if (taskMode) {
      onCreateTask({ content: newComment, assignedTo: assignTo || undefined, dueDate: dueDate || undefined })
    } else {
      onAddComment(newComment)
    }
    setNewComment('')
    setAssignTo('')
    setDueDate('')
    setTaskMode(false)
  }

  return (
    <aside className="review-panel">
      <div className="review-panel__header">
        <h3 className="review-panel__title">Review</h3>
        <span className="review-panel__count">{comments.filter(c => !c.resolved).length} open</span>
      </div>

      {/* Filter bar */}
      <div className="review-panel__filters">
        {(['all', 'open', 'resolved', 'tasks'] as FilterMode[]).map(f => (
          <button
            key={f}
            className={`review-filter-btn ${filter === f ? 'review-filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Comment list */}
      <div className="review-panel__list">
        {filtered.length === 0
          ? <p className="review-panel__empty">No comments yet.</p>
          : filtered.map(c => (
              <ReviewTaskCard
                key={c.id}
                comment={c}
                collaborators={collaborators}
                canResolve={canResolve}
                onResolve={onResolve}
                onReply={(text, parentId) => onAddComment(text, parentId)}
              />
            ))
        }
      </div>

      {/* New comment / task composer */}
      {canComment && (
        <div className="review-panel__composer">
          <div className="review-composer-mode">
            <button
              className={`review-composer-tab ${!taskMode ? 'review-composer-tab--active' : ''}`}
              onClick={() => setTaskMode(false)}
            >
              Comment
            </button>
            <button
              className={`review-composer-tab ${taskMode ? 'review-composer-tab--active' : ''}`}
              onClick={() => setTaskMode(true)}
            >
              Assign Task
            </button>
          </div>

          <textarea
            className="review-composer-textarea"
            placeholder={taskMode ? 'Describe the task… use @name to mention' : 'Add a comment…'}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
          />

          {taskMode && (
            <div className="review-task-fields">
              <select
                className="review-task-assign-select"
                value={assignTo}
                onChange={e => setAssignTo(e.target.value)}
              >
                <option value="">Assign to…</option>
                {collaborators.map(c => (
                  <option key={c.id} value={c.user_id ?? ''}>
                    {c.display_name ?? c.email}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="review-task-due-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                placeholder="Due date"
              />
            </div>
          )}

          <button className="review-submit-btn" onClick={submitComment}>
            {taskMode ? 'Create Task' : 'Post Comment'}
          </button>
        </div>
      )}
    </aside>
  )
}