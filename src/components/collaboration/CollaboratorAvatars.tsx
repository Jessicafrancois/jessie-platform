
// components/collaboration/CollaboratorAvatars.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Collaborator } from '@/types'

interface Props {
  entryId: string
  max?: number
}

export default function CollaboratorAvatars({ entryId, max = 4 }: Props) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  useEffect(() => {
    supabase
      .from('entry_collaborators')
      .select('*')
      .eq('entry_id', entryId)
      .eq('status', 'accepted')
      .then(({ data }) => setCollaborators(data || []))
  }, [entryId])

  if (collaborators.length === 0) return null

  const visible = collaborators.slice(0, max)
  const overflow = collaborators.length - max

  return (
    <div className="collab-avatars">
      {visible.map((c, i) => (
        <div
          key={c.id}
          className="collab-avatar collab-avatar--stacked"
          style={{
            zIndex: max - i,
            background: c.avatar_url ? 'transparent' : `hsl(${hashToHue(c.email)}, 60%, 40%)`,
          }}
          title={c.display_name ?? c.email}
        >
          {c.avatar_url
            ? <img src={c.avatar_url} alt={c.display_name ?? c.email} />
            : (c.display_name ?? c.email)[0].toUpperCase()
          }
        </div>
      ))}
      {overflow > 0 && (
        <div className="collab-avatar collab-avatar--overflow" title={`${overflow} more`}>
          +{overflow}
        </div>
      )}
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