'use client'

import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import './web-node.css'

export type WebNodeType =
  | 'tag' | 'note' | 'journal' | 'draft' | 'series'
  | 'media' | 'collection' | 'document' | 'moodboard'

export interface WebNodeData {
  type: WebNodeType
  title: string
  content?: string
  color: string
  onUpdate: (updates: Partial<Pick<WebNodeData, 'title' | 'content' | 'color'>>) => void
  onDelete: () => void
}

export const TYPE_META: Record<WebNodeType, { icon: string; label: string; defaultColor: string }> = {
  tag:        { icon: '#', label: 'Tag',        defaultColor: '#8b5cf6' },
  note:       { icon: '✎', label: 'Note',       defaultColor: '#f59e0b' },
  journal:    { icon: '✦', label: 'Journal',    defaultColor: '#d8bc6e' },
  draft:      { icon: '◇', label: 'Draft',      defaultColor: '#94a3b8' },
  series:     { icon: '≡', label: 'Series',     defaultColor: '#38bdf8' },
  media:      { icon: '◐', label: 'Media',      defaultColor: '#f472b6' },
  collection: { icon: '⬡', label: 'Collection', defaultColor: '#34d399' },
  document:   { icon: '▤', label: 'Document',   defaultColor: '#60a5fa' },
  moodboard:  { icon: '◎', label: 'Moodboard',  defaultColor: '#fb923c' },
}

const SWATCHES = [
  '#8b5cf6', '#f59e0b', '#d8bc6e', '#94a3b8', '#38bdf8',
  '#f472b6', '#34d399', '#60a5fa', '#fb923c', '#ef4444',
]

function WebNode({ data, selected }: NodeProps<WebNodeData>) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const meta = TYPE_META[data.type]

  return (
    <div
      className={`web-node ${selected ? 'is-selected' : ''}`}
      style={{ borderColor: data.color, '--node-color': data.color } as React.CSSProperties}
    >
      <Handle type="target" position={Position.Top}  className="web-node-handle" />
      <Handle type="target" position={Position.Left} className="web-node-handle" />

      <div className="web-node-header">
        <span className="web-node-icon" style={{ background: data.color }}>{meta.icon}</span>
        <span className="web-node-type">{meta.label}</span>

        <button
          className="web-node-color-btn"
          style={{ background: data.color }}
          onClick={() => setShowColorPicker(s => !s)}
          title="Change color"
        />

        <button className="web-node-delete" onClick={data.onDelete} title="Delete card">×</button>
      </div>

      {showColorPicker && (
        <div className="web-node-swatches" onMouseLeave={() => setShowColorPicker(false)}>
          {SWATCHES.map(c => (
            <button
              key={c}
              className="web-node-swatch"
              style={{ background: c }}
              onClick={() => { data.onUpdate({ color: c }); setShowColorPicker(false) }}
            />
          ))}
          <label className="web-node-custom-color-label">
            <input
              type="color"
              value={data.color}
              onChange={e => data.onUpdate({ color: e.target.value })}
              className="web-node-custom-color"
            />
            Custom
          </label>
        </div>
      )}

      {editingTitle ? (
        <input
          autoFocus
          className="web-node-title-input"
          value={data.title}
          onChange={e => data.onUpdate({ title: e.target.value })}
          onBlur={() => setEditingTitle(false)}
          onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
        />
      ) : (
        <h4 className="web-node-title" onDoubleClick={() => setEditingTitle(true)}>
          {data.title || 'Untitled'}
        </h4>
      )}

      <textarea
        className="web-node-content"
        placeholder="Add a note..."
        value={data.content || ''}
        onChange={e => data.onUpdate({ content: e.target.value })}
        rows={2}
      />

      <Handle type="source" position={Position.Bottom} className="web-node-handle" />
      <Handle type="source" position={Position.Right}  className="web-node-handle" />
    </div>
  )
}

export default memo(WebNode)