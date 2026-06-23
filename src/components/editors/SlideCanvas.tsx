'use client'
// ─────────────────────────────────────────────────────────────────────────────
// src/components/editor/SlideCanvas.tsx
// The interactive 1280×720 canvas where elements live.
// Handles: click-to-select, drag-to-move, corner resize, rotation,
// multi-select (shift+click), arrow-key nudge, rubber-band selection.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useCallback, useEffect, useState, KeyboardEvent } from 'react'
import type { EditorController } from '../../lib/useEditorState'
import type { SlideElement, TextElement, MediaElement, IconElement } from '@/types/editor'
import {
  elementContainerStyles, elementInnerStyles, textElementStyles,
  slideBgToCSS, ANIMATION_KEYFRAMES,
} from '../../lib/styleHelpers'
import { createElement } from '../../lib/elementFactory'
import './canvas.css'

const SLIDE_W = 1280
const SLIDE_H = 720
const GRID_SIZE = 8

interface Props {
  controller: EditorController
}

// ── Helper: snap to grid ──────────────────────────────────────────────────────

function snap(v: number, g: number, enabled: boolean) {
  return enabled ? Math.round(v / g) * g : Math.round(v)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SlideCanvas({ controller }: Props) {
  const {
    state, activeSlide, selectedElements, primarySelected,
    selectElements, clearSelection, updateElement, moveElements,
    addElement, setTool, pushHistory,
  } = controller

  const { tool, viewport, showGrid, snapToGrid, gridSize } = state

  const wrapRef  = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Inject keyframe CSS once
  useEffect(() => {
    if (document.getElementById('we-keyframes')) return
    const style = document.createElement('style')
    style.id = 'we-keyframes'
    style.textContent = ANIMATION_KEYFRAMES
    document.head.appendChild(style)
  }, [])

  // ── Drag state ────────────────────────────────────────────────────────────
  const drag = useRef<{
    type: 'move' | 'resize' | 'rotate' | 'none'
    startX: number; startY: number
    startEls: Array<{ id: string; x: number; y: number; w: number; h: number; rotation: number }>
    resizeDir?: string
    pivotX?: number; pivotY?: number; startAngle?: number; startRotation?: number
  } | null>(null)

  // ── Canvas coordinate conversion ──────────────────────────────────────────
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / viewport.zoom,
      y: (clientY - rect.top) / viewport.zoom,
    }
  }, [viewport.zoom])

  // ── Mouse down on element ──────────────────────────────────────────────────
  const onElementMouseDown = useCallback((
    e: React.MouseEvent,
    el: SlideElement,
    action: 'move' | 'resize' | 'rotate',
    resizeDir?: string
  ) => {
    if (el.locked) return
    e.stopPropagation()
    e.preventDefault()

    // Selection
    if (action === 'move') {
      if (e.shiftKey) {
        selectElements([el.id], 'toggle')
      } else if (!state.selection.ids.includes(el.id)) {
        selectElements([el.id], 'replace')
      }
    }

    if (action === 'rotate' && primarySelected) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = (primarySelected.x + primarySelected.w / 2) * viewport.zoom + rect.left
      const cy = (primarySelected.y + primarySelected.h / 2) * viewport.zoom + rect.top
      const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI
      drag.current = {
        type: 'rotate',
        startX: e.clientX, startY: e.clientY,
        startEls: [{ id: el.id, x: el.x, y: el.y, w: el.w, h: el.h, rotation: el.rotation ?? 0 }],
        pivotX: cx, pivotY: cy, startAngle, startRotation: el.rotation ?? 0,
      }
      return
    }

    const ids = action === 'move'
      ? (state.selection.ids.includes(el.id) ? state.selection.ids : [el.id])
      : [el.id]

    const startEls = ids.map(id => {
      const found = activeSlide?.elements.find(e => e.id === id)
      return found ? { id, x: found.x, y: found.y, w: found.w, h: found.h, rotation: found.rotation ?? 0 } : null
    }).filter(Boolean) as typeof drag.current extends null ? never : NonNullable<typeof drag.current>['startEls']

    drag.current = { type: action, startX: e.clientX, startY: e.clientY, startEls, resizeDir }
  }, [state.selection.ids, selectElements, primarySelected, activeSlide, viewport.zoom])

  // ── Global mouse move ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current) return
      const d = drag.current
      const dx = (e.clientX - d.startX) / viewport.zoom
      const dy = (e.clientY - d.startY) / viewport.zoom

      if (d.type === 'rotate' && d.pivotX !== undefined) {
        const angle = Math.atan2(
          e.clientY - d.pivotY!,
          e.clientX - d.pivotX!
        ) * 180 / Math.PI
        const delta = angle - d.startAngle!
        const newRot = Math.round(d.startRotation! + delta)
        const el = d.startEls[0]
        if (el) updateElement(el.id, { rotation: newRot })
        return
      }

      if (d.type === 'move') {
        d.startEls.forEach(src => {
          const nx = snap(src.x + dx, gridSize, snapToGrid)
          const ny = snap(src.y + dy, gridSize, snapToGrid)
          updateElement(src.id, { x: nx, y: ny })
        })
        return
      }

      if (d.type === 'resize' && d.startEls[0]) {
        const src = d.startEls[0]
        const dir = d.resizeDir ?? 'se'
        let x = src.x, y = src.y, w = src.w, h = src.h

        if (dir.includes('e')) w = Math.max(20, src.w + dx)
        if (dir.includes('s')) h = Math.max(20, src.h + dy)
        if (dir.includes('w')) { w = Math.max(20, src.w - dx); x = src.x + src.w - w }
        if (dir.includes('n')) { h = Math.max(20, src.h - dy); y = src.y + src.h - h }

        // Shift = maintain aspect ratio
        if (e.shiftKey && (dir.includes('se') || dir.includes('nw') || dir.includes('ne') || dir.includes('sw'))) {
          const ratio = src.w / src.h
          if (Math.abs(dx) > Math.abs(dy)) h = w / ratio
          else w = h * ratio
        }

        updateElement(src.id, {
          x: snap(x, gridSize, snapToGrid),
          y: snap(y, gridSize, snapToGrid),
          w: snap(w, gridSize, snapToGrid),
          h: snap(h, gridSize, snapToGrid),
        })
      }
    }

    const onUp = () => {
      if (drag.current) {
        pushHistory(`Move / resize`)
        drag.current = null
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [viewport.zoom, gridSize, snapToGrid, updateElement, pushHistory])

  // ── Canvas click (deselect or add element with tool) ──────────────────────
  const onCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target !== canvasRef.current) return
    if (tool === 'select' || tool === 'pan') {
      clearSelection()
      return
    }
    // Quick-add with tool
    const pos = toCanvas(e.clientX, e.clientY)
    const typeMap: Record<string, Parameters<typeof createElement>[0]> = {
      text: 'body', rect: 'rect', ellipse: 'ellipse', line: 'line',
    }
    const elType = typeMap[tool]
    if (elType) {
      const el = createElement(elType, pos)
      if (el) { addElement(el); setTool('select') }
    }
  }, [tool, toCanvas, clearSelection, addElement, setTool])

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).contentEditable === 'true') return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const delta = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft')  { e.preventDefault(); moveElements(state.selection.ids, -delta, 0) }
      if (e.key === 'ArrowRight') { e.preventDefault(); moveElements(state.selection.ids, delta, 0) }
      if (e.key === 'ArrowUp')    { e.preventDefault(); moveElements(state.selection.ids, 0, -delta) }
      if (e.key === 'ArrowDown')  { e.preventDefault(); moveElements(state.selection.ids, 0, delta) }
      if (e.key === 'Escape') clearSelection()
    }
    window.addEventListener('keydown', onKeyDown as any)
    return () => window.removeEventListener('keydown', onKeyDown as any)
  }, [state.selection.ids, moveElements, clearSelection])

  // ── Wheel zoom ────────────────────────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        controller.setViewport({ zoom: Math.min(4, Math.max(0.1, viewport.zoom + (e.deltaY < 0 ? 0.05 : -0.05))) })
      }
    }
    wrap.addEventListener('wheel', onWheel, { passive: false })
    return () => wrap.removeEventListener('wheel', onWheel)
  }, [viewport.zoom, controller])

  if (!activeSlide) return null

  const bgStyle = slideBgToCSS(activeSlide.background)

  return (
    <div className="we-canvas-wrap" ref={wrapRef}>
      {/* Grid overlay (behind slide) */}
      {showGrid && (
        <div
          className="we-canvas-grid-bg"
          style={{
            width: SLIDE_W * viewport.zoom,
            height: SLIDE_H * viewport.zoom,
            backgroundSize: `${gridSize * viewport.zoom}px ${gridSize * viewport.zoom}px`,
          }}
        />
      )}

      {/* THE SLIDE */}
      <div
        ref={canvasRef}
        className="we-slide"
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${viewport.zoom})`,
          transformOrigin: 'top left',
          ...bgStyle,
        }}
        onClick={onCanvasClick}
        onContextMenu={e => e.preventDefault()}
      >
        {/* Background image / video layer */}
        {activeSlide.background.type === 'image' && activeSlide.background.imageUrl && (
          <div
            className="we-slide-bg-img"
            style={{ backgroundImage: `url(${activeSlide.background.imageUrl})` }}
          />
        )}

        {/* Overlay */}
        {activeSlide.background.overlay && (
          <div
            className="we-slide-overlay"
            style={{
              background: activeSlide.background.overlay,
              mixBlendMode: (activeSlide.background.overlayBlend ?? 'normal') as any,
            }}
          />
        )}

        {/* Grid on slide */}
        {showGrid && (
          <div
            className="we-slide-grid"
            style={{ backgroundSize: `${gridSize}px ${gridSize}px` }}
          />
        )}

        {/* Empty state */}
        {activeSlide.elements.length === 0 && (
          <div className="we-slide-empty">
            <div className="we-slide-empty-icon">+</div>
            <div className="we-slide-empty-text">Add elements from the left panel</div>
          </div>
        )}

        {/* Elements — sorted by zIndex */}
        {[...activeSlide.elements]
          .sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
          .map(el => (
            <SlideElementRenderer
              key={el.id}
              el={el}
              selected={state.selection.ids.includes(el.id)}
              onMouseDown={onElementMouseDown}
            />
          ))
        }
      </div>
    </div>
  )
}

// ── Element renderer ──────────────────────────────────────────────────────────

interface ElemProps {
  el: SlideElement
  selected: boolean
  onMouseDown: (e: React.MouseEvent, el: SlideElement, action: 'move' | 'resize' | 'rotate', dir?: string) => void
}

function SlideElementRenderer({ el, selected, onMouseDown }: ElemProps) {
  const containerStyle = elementContainerStyles(el)
  const innerStyle = elementInnerStyles(el)

  const textEl = el as TextElement
  const isText = ['heading','subheading','body','quote','label','callout','code'].includes(el.type)
  const isMedia = ['image','video','gif'].includes(el.type)
  const isIcon = el.type === 'icon'
  const isShape = ['rect','ellipse','triangle','line'].includes(el.type)
  const isWorld = ['character','location','artifact','lore','organization','event'].includes(el.type)

  return (
    <div
      className={`we-el ${selected ? 'we-el--selected' : ''} ${el.locked ? 'we-el--locked' : ''}`}
      style={containerStyle}
      onMouseDown={e => onMouseDown(e, el, 'move')}
    >
      {/* INNER CONTENT */}
      <div className="we-el-inner" style={innerStyle}>
        {isText && (
          <div
            className="we-el-text"
            style={textElementStyles(textEl)}
            contentEditable
            suppressContentEditableWarning
            onMouseDown={e => e.stopPropagation()}
          >
            {textEl.text}
          </div>
        )}

        {isMedia && (() => {
          const m = el as MediaElement
          if (m.type === 'image') {
            return m.src
              ? <img src={m.src} alt={m.alt} className="we-el-img" style={{ objectFit: m.objectFit, objectPosition: m.objectPosition }} />
              : <div className="we-el-img-placeholder"><span>🖼</span><span>Click to set image URL</span></div>
          }
          if (m.type === 'video') {
            return m.src
              ? <video src={m.src} className="we-el-video" autoPlay={m.autoplay} muted={m.muted} loop={m.loop} controls={m.controls} />
              : <div className="we-el-video-placeholder"><span>▶</span><span>Video placeholder</span></div>
          }
          return null
        })()}

        {isIcon && (() => {
          const ic = el as IconElement
          return <div className="we-el-icon" style={{ fontSize: ic.iconSize, color: ic.iconColor }}>{ic.icon}</div>
        })()}

        {el.type === 'divider' && (
          <div className="we-el-divider" style={{ width: '100%', height: el.stroke?.width ?? 1, background: el.stroke?.color ?? 'rgba(255,255,255,0.2)' }} />
        )}

        {(el.type === 'card' || el.type === 'bento' || el.type === 'frame') && (
          <div className="we-el-frame-inner" />
        )}

        {isWorld && (() => {
          const w = el as any
          const icons: Record<string, string> = { character:'👤', location:'📍', artifact:'🏺', lore:'📜', organization:'🏛', event:'⚡' }
          return (
            <div className="we-el-world-obj">
              <span className="we-el-world-icon">{icons[el.type] ?? '○'}</span>
              <span className="we-el-world-label">{w.label}</span>
              {w.sublabel && <span className="we-el-world-sublabel">{w.sublabel}</span>}
            </div>
          )
        })()}

        {isShape && el.type === 'triangle' && (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,100 0,100" fill={el.fill?.color ?? 'rgba(155,109,255,0.2)'} />
          </svg>
        )}
      </div>

      {/* SELECTION UI */}
      {selected && (
        <>
          {/* Resize handles */}
          {(['nw','n','ne','e','se','s','sw','w'] as const).map(dir => (
            <div
              key={dir}
              className={`we-rh we-rh-${dir}`}
              onMouseDown={e => onMouseDown(e, el, 'resize', dir)}
            />
          ))}

          {/* Rotate handle */}
          <div className="we-rotate-handle" onMouseDown={e => onMouseDown(e, el, 'rotate')}>
            ↺
          </div>

          {/* Selection label */}
          <div className="we-el-label">{el.type}</div>
        </>
      )}
    </div>
  )
}