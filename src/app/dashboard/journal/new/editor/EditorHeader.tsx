// EditorHeader.tsx  (full replacement)
'use client'

import ActiveEditors from '@/components/collaboration/ActiveEditors'
import type { ActiveUser } from '@/types'

type EditorHeaderProps = {
  title: string
  setTitleAction: (value: string) => void
  excerpt: string
  setExcerptAction: (value: string) => void
  wordCount: number
  readingTime: number
  progress: number
  status: string
  activeUsers?: ActiveUser[]
}

export default function EditorHeader({
  title,
  setTitleAction,
  excerpt,
  setExcerptAction,
  wordCount,
  readingTime,
  progress,
  status,
  activeUsers = [],
}: EditorHeaderProps) {
  return (
    <div className="editor-document-header">
      <div className="writing-progress-bar" style={{ width: `${progress}%` }} />

      {/* Currently Editing bar */}
      {activeUsers.length > 0 && (
        <div className="editor-active-bar">
          <ActiveEditors activeUsers={activeUsers} />
        </div>
      )}

      <div className="editor-stats-card">
        <div className="stat-item">
          <span className="stat-label">Words</span>
          <span className="stat-value">{wordCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Read Time</span>
          <span className="stat-value">{readingTime} min</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status</span>
          <span className="stat-value">{status}</span>
        </div>
      </div>

    </div>
  )
}