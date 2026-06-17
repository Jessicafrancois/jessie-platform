'use client'

import { useState } from 'react'
import { WebNodeType, TYPE_META } from './WebNode'
import './web-canvas.css'

const ORDER: WebNodeType[] = [
  'tag', 'note', 'journal', 'draft', 'series',
  'media', 'collection', 'document', 'moodboard',
]

export default function AddNodeToolbar({ onAddAction }: { onAddAction: (type: WebNodeType) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="web-toolbar">
      <button className="web-toolbar-add-btn" onClick={() => setOpen(o => !o)}>
        + Add Card
      </button>

      {open && (
        <div className="web-toolbar-menu" onMouseLeave={() => setOpen(false)}>
          {ORDER.map(type => {
            const meta = TYPE_META[type]
            return (
              <button
                key={type}
                className="web-toolbar-item"
                onClick={() => { onAddAction(type); setOpen(false) }}
              >
                <span className="web-toolbar-item-icon" style={{ background: meta.defaultColor }}>
                  {meta.icon}
                </span>
                {meta.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}