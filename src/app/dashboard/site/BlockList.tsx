'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageBlock, BlockType, BLOCK_DEFINITIONS } from '@/lib/blocks/types'

function SortableBlockRow({
  block, index, isSelected, onSelect, onDuplicate, onDelete,
}: {
  block: PageBlock
  index: number
  isSelected: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const def = BLOCK_DEFINITIONS.find(d => d.type === block.type)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`bb-block-row ${isSelected ? 'is-selected' : ''}`}
      onClick={onSelect}
    >
      <button className="bb-drag-handle" {...attributes} {...listeners}>⠿</button>
      <span className="bb-block-icon">{def?.icon}</span>
      <span className="bb-block-label">{def?.label ?? block.type}</span>
      <span className="bb-block-index">{index + 1}</span>
      <div className="bb-block-actions">
        <button onClick={e => { e.stopPropagation(); onDuplicate() }} title="Duplicate">⧉</button>
        <button onClick={e => { e.stopPropagation(); onDelete() }} title="Delete">×</button>
      </div>
    </div>
  )
}

export default function BlockList({
  blocks, selectedId, onSelectAction, onAddAction, onDuplicateAction, onDeleteAction,
}: {
  blocks: PageBlock[]
  selectedId: string | null
  onSelectAction: (id: string) => void
  onAddAction: (type: BlockType) => void
  onDuplicateAction: (block: PageBlock) => void
  onDeleteAction: (id: string) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const groups = Array.from(new Set(BLOCK_DEFINITIONS.map(d => d.group)))

  return (
    <div className="bb-block-list">
      <p className="bb-panel-label">Blocks</p>

      {blocks.length === 0 && (
        <div className="bb-empty-blocks">No blocks yet. Add your first one below.</div>
      )}

      {blocks.map((block, index) => (
        <SortableBlockRow
          key={block.id}
          block={block}
          index={index}
          isSelected={block.id === selectedId}
          onSelect={() => onSelectAction(block.id)}
          onDuplicate={() => onDuplicateAction(block)}
          onDelete={() => onDeleteAction(block.id)}
        />
      ))}

      <div className="bb-add-block">
        <button className="bb-add-block-btn" onClick={() => setShowPicker(s => !s)}>
          + Add Block
        </button>

        {showPicker && (
          <div className="bb-block-picker">
            {groups.map(group => (
              <div key={group} className="bb-picker-group">
                <p className="bb-picker-group-label">{group}</p>
                {BLOCK_DEFINITIONS.filter(d => d.group === group).map(def => (
                  <button
                    key={def.type}
                    className="bb-picker-item"
                    onClick={() => { onAddAction(def.type); setShowPicker(false) }}
                  >
                    <span>{def.icon}</span> {def.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}