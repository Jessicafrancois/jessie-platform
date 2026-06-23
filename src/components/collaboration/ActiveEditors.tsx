// components/collaboration/ActiveEditors.tsx
'use client'

import type { ActiveUser } from '@/types'

interface Props {
  activeUsers: ActiveUser[]
}

export default function ActiveEditors({ activeUsers }: Props) {
  if (activeUsers.length === 0) return null

  return (
    <div className="active-editors">
      <span className="active-editors__label">Currently Editing</span>
      <div className="active-editors__avatars">
        {activeUsers.map(u => (
          <div
            key={u.user_id}
            className="active-editors__avatar"
            style={{ borderColor: u.color }}
            title={`${u.display_name} — ${u.action}`}
          >
            {u.avatar_url
              ? <img src={u.avatar_url} alt={u.display_name} />
              : <span>{u.display_name[0].toUpperCase()}</span>
            }
            <span
              className="active-editors__indicator"
              style={{ background: u.color }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}