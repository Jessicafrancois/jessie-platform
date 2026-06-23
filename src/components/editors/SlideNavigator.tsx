'use client'
// ─────────────────────────────────────────────────────────────────────────────
// src/components/editor/SlideNavigator.tsx
// Left panel: slide thumbnails, drag-to-reorder, add/delete/duplicate.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import type { EditorController } from '../../lib/useEditorState'
import type { Slide } from '@/types/editor'
import { slideThumbnailBg, elementInnerStyles, textElementStyles } from '../../lib/styleHelpers'
import { createSlide } from '@/types/editor'
import './navigator.css'

const THUMB_W = 152
const THUMB_H = Math.round(THUMB_W * (720 / 1280))  // ≈ 86

interface Props {
  controller: EditorController
  worldId: string
}

export default function SlideNavigator({ controller, worldId }: Props) {
  const {
    state, addSlide, deleteSlide, duplicateSlide,
    reorderSlides, selectSlide, updateSlide,
  } = controller

  const { slides, activeSlideIndex } = state
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // ── Add new slide ─────────────────────────────────────────────────────────
  function handleAdd() {
    const slide = createSlide(worldId, slides.length, `Slide ${slides.length + 1}`)
    addSlide(slide)
  }

  // ── Drag to reorder ───────────────────────────────────────────────────────
  function onDragStart(e: React.DragEvent, index: number) {
    setDraggingIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  function onDrop(e: React.DragEvent, toIndex: number) {
    e.preventDefault()
    if (draggingIndex !== null && draggingIndex !== toIndex) {
      reorderSlides(draggingIndex, toIndex)
    }
    setDraggingIndex(null)
    setDragOverIndex(null)
  }

  function onDragEnd() {
    setDraggingIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="we-nav">
      <div className="we-nav-header">
        <span className="we-nav-label">Slides</span>
        <button className="we-nav-add-btn" onClick={handleAdd} title="Add slide">
          <Plus size={14} />
        </button>
      </div>

      <div className="we-nav-list">
        {slides.map((slide: Slide, index: number) => (
          <SlideThumb
            key={slide.id}
            slide={slide}
            index={index}
            isActive={index === activeSlideIndex}
            isDragging={draggingIndex === index}
            isDragOver={dragOverIndex === index && draggingIndex !== index}
            onSelect={() => selectSlide(index)}
            onDuplicate={() => duplicateSlide(index)}
            onDelete={() => deleteSlide(index)}
            onToggleHidden={() => updateSlide(index, { isHidden: !slide.isHidden })}
            onDragStart={e => onDragStart(e, index)}
            onDragOver={e => onDragOver(e, index)}
            onDrop={e => onDrop(e, index)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

// ── Slide thumb ───────────────────────────────────────────────────────────────

interface ThumbProps {
  slide: Slide
  index: number
  isActive: boolean
  isDragging: boolean
  isDragOver: boolean
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
  onToggleHidden: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
}

function SlideThumb({
  slide, index, isActive, isDragging, isDragOver,
  onSelect, onDuplicate, onDelete, onToggleHidden,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: ThumbProps) {
  const [hovered, setHovered] = useState(false)

  const scale = THUMB_W / 1280

  return (
    <div
      className={[
        'we-thumb',
        isActive  ? 'we-thumb--active'  : '',
        isDragging  ? 'we-thumb--dragging' : '',
        isDragOver  ? 'we-thumb--drop-target' : '',
        slide.isHidden ? 'we-thumb--hidden' : '',
      ].join(' ')}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle */}
      <div className="we-thumb-grip">
        <GripVertical size={12} />
      </div>

      {/* Number */}
      <span className="we-thumb-num">{index + 1}</span>

      {/* Preview */}
      <div
        className="we-thumb-preview"
        style={{ width: THUMB_W, height: THUMB_H }}
        onClick={onSelect}
      >
        {/* Background */}
        <div
          className="we-thumb-bg"
          style={slideThumbnailBg(slide.background)}
        />

        {/* Mini elements */}
        <div
          className="we-thumb-elements"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: 1280,
            height: 720,
          }}
        >
          {[...slide.elements]
            .sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
            .map(el => {
              const isText = ['heading','subheading','body','quote','label','callout','code'].includes(el.type)
              return (
                <div
                  key={el.id}
                  style={{
                    position: 'absolute',
                    left: el.x, top: el.y, width: el.w, height: el.h,
                    opacity: (el.opacity ?? 100) / 100,
                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                    zIndex: el.zIndex ?? 1,
                    background: el.fill?.type === 'solid' ? el.fill.color : 'transparent',
                    borderRadius: el.borderRadius,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isText && (
                    <span style={{
                      fontSize: (el as any).fontSize,
                      fontWeight: (el as any).fontWeight,
                      color: (el as any).textColor,
                      fontFamily: (el as any).fontFamily,
                      textAlign: (el as any).textAlign,
                      padding: '4px 8px',
                      lineHeight: (el as any).lineHeight ?? 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}>
                      {(el as any).text}
                    </span>
                  )}
                </div>
              )
            })
          }
        </div>

        {/* Hidden overlay */}
        {slide.isHidden && (
          <div className="we-thumb-hidden-overlay">
            <EyeOff size={16} />
          </div>
        )}
      </div>

      {/* Slide title */}
      <div className="we-thumb-title">{slide.title || 'Untitled'}</div>

      {/* Hover actions */}
      {hovered && (
        <div className="we-thumb-actions">
          <button onClick={onToggleHidden} title={slide.isHidden ? 'Show' : 'Hide'}>
            {slide.isHidden ? <Eye size={11} /> : <EyeOff size={11} />}
          </button>
          <button onClick={onDuplicate} title="Duplicate">
            <Copy size={11} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete() }} title="Delete" className="we-thumb-delete">
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  )
}