'use client'
// ─────────────────────────────────────────────────────────────────────────────
// src/components/editor/ElementsPanel.tsx
// Left panel "Elements" tab — grouped buttons to insert block types.
// ─────────────────────────────────────────────────────────────────────────────

import type { EditorController } from '../../lib/useEditorState'
import { createElement, ELEMENT_GROUPS } from '../../lib/elementFactory'
import './elements-panel.css'

interface Props {
  controller: EditorController
}

export default function ElementsPanel({ controller }: Props) {
  const { addElement, selectElements } = controller

  function handleAdd(type: Parameters<typeof createElement>[0]) {
    const el = createElement(type)
    if (!el) return
    addElement(el)
    selectElements([el.id])
  }

  return (
    <div className="we-elements-panel">
      {ELEMENT_GROUPS.map(group => (
        <div key={group.label} className="we-elem-group">
          <div className="we-elem-group-label">{group.label}</div>
          <div className="we-elem-grid">
            {group.items.map(item => (
              <button
                key={item.type}
                className="we-elem-btn"
                onClick={() => handleAdd(item.type)}
                title={`Add ${item.label}`}
              >
                <span className="we-elem-icon">{item.icon}</span>
                <span className="we-elem-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}