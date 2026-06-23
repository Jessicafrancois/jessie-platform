// components/collaboration/ReviewTaskCard.tsx
'use client'

import { useState } from 'react'
import type { EntryComment, TaskStatus } from '@/types'

interface Props {
  comment: EntryComment
  collaborators: { user_id: string | null; email: string; display_name?: string }[]
  canResolve: boolean
  onResolve: (id: string) => void
  onReply: (content: string, parentId: string) => void
  onUpdateTask?: (id: string, updates: Partial<Pick<EntryComment, 'task_status' | 'assigned_to' | 'due_date'>>) => void
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  open: '#d86e6e',
  in_progress: '#d8bc6e',
  completed: '#6ed8a0',
}

export default function ReviewTaskCard({
  comment,
  collaborators,
  canResolve,
  onResolve,
  onReply,
  onUpdateTask,
}: Props) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  // Parse @mentions from content
  const mentionRegex = /@(\w+)/g
  const renderContent = comment.content.replace(mentionRegex, '<mark class="mention">@$1</mark>')

  async function submitReply() {
    if (!replyText.trim()) return
    await onReply(replyText, comment.id)
    setReplyText('')
    setReplyOpen(false)
  }

  const isTask = !!comment.assigned_to || !!comment.due_date

  return (
    <div className={`review-task-card ${comment.resolved ? 'review-task-card--resolved' : ''}`}>

      {/* Header */}
      <div className="review-task-card__header">
        <div className="review-task-card__author">
          <div className="review-task-card__avatar">
            {(comment.author_name ?? 'U')[0].toUpperCase()}
          </div>
          <div>
            <span className="review-task-card__name">{comment.author_name ?? 'User'}</span>
            <span className="review-task-card__time">
              {new Date(comment.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {isTask && (
          <span
            className="review-task-card__status-badge"
            style={{ background: STATUS_COLORS[comment.task_status] + '22', color: STATUS_COLORS[comment.task_status] }}
          >
            {STATUS_LABELS[comment.task_status]}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className="review-task-card__content"
        dangerouslySetInnerHTML={{ __html: renderContent }}
      />

      {/* Task Meta */}
      {isTask && (
        <div className="review-task-card__meta">
          {comment.assigned_to && (
            <div className="review-task-meta-item">
              <span className="review-task-meta-label">Assigned To</span>
              <span className="review-task-meta-value">
                {collaborators.find(c => c.user_id === comment.assigned_to)?.display_name
                  ?? collaborators.find(c => c.user_id === comment.assigned_to)?.email
                  ?? comment.assignee_name
                  ?? 'Unknown'}
              </span>
            </div>
          )}
          {comment.due_date && (
            <div className="review-task-meta-item">
              <span className="review-task-meta-label">Due Date</span>
              <span className="review-task-meta-value">
                {new Date(comment.due_date).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </span>
            </div>
          )}
          {onUpdateTask && (
            <div className="review-task-meta-item">
              <span className="review-task-meta-label">Status</span>
              <select
                className="review-task-status-select"
                value={comment.task_status}
                onChange={e => onUpdateTask(comment.id, { task_status: e.target.value as TaskStatus })}
              >
                {(Object.keys(STATUS_LABELS) as TaskStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="review-task-card__replies">
          {comment.replies.map(reply => (
            <div key={reply.id} className="review-task-reply">
              <div className="review-task-reply__avatar">
                {(reply.author_name ?? 'U')[0].toUpperCase()}
              </div>
              <div className="review-task-reply__body">
                <span className="review-task-reply__name">{reply.author_name ?? 'User'}</span>
                <p className="review-task-reply__text">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="review-task-card__actions">
        <button
          className="review-task-action-btn"
          onClick={() => setReplyOpen(o => !o)}
        >
          Reply
        </button>
        {canResolve && !comment.resolved && (
          <button
            className="review-task-action-btn review-task-action-btn--resolve"
            onClick={() => onResolve(comment.id)}
          >
            Resolve
          </button>
        )}
        {comment.resolved && (
          <span className="review-task-card__resolved-badge">✓ Resolved</span>
        )}
      </div>

      {/* Reply input */}
      {replyOpen && (
        <div className="review-task-reply-input">
          <textarea
            className="review-task-textarea"
            placeholder="Write a reply… use @name to mention"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={2}
          />
          <div className="review-task-reply-input__actions">
            <button className="review-task-cancel-btn" onClick={() => setReplyOpen(false)}>Cancel</button>
            <button className="review-task-submit-btn" onClick={submitReply}>Post Reply</button>
          </div>
        </div>
      )}
    </div>
  )
}