'use client'
// ─────────────────────────────────────────────────────────────────────────────
// src/components/editor/WorldEditor.tsx
// Root editor shell — replaces the original WorldEditor.tsx.
// Wires together: state, keyboard shortcuts, persistence, layout.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { World } from '@/types/worlds'
import type { Slide, SlideElement } from '@/types/editor'
import { createSlide } from '@/types/editor'
import { useEditorState } from '../../lib/useEditorState'
import { createElement } from '../../lib/elementFactory'
import Toolbar from '@/app/dashboard/journal/new/editor/Toolbar'
import SlideNavigator from './SlideNavigator'
import SlideCanvas   from './SlideCanvas'
import SlideSettings from './SlideSettings'
import ElementsPanel from './ElementsPanel'
import './world-editor.css'

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  world: World
  initialSlides: Slide[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorldEditor({ world, initialSlides }: Props) {
  const router = useRouter()
  const controller = useEditorState(
    initialSlides.length ? initialSlides : [createSlide(world.id, 0, 'Slide 1')]
  )
  const { state, activeSlide, undo, redo, canUndo, canRedo, markSaved, setLeftPanel } = controller
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Auto-save ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.isDirty) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => { persistSlides() }, 1500)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.slides, state.isDirty])

  const persistSlides = useCallback(async () => {
    if (!state.isDirty) return
    try {
      // Upsert all slides in parallel
      await Promise.all(
        state.slides.map(slide =>
          supabase
            .from('world_slides')
            .upsert({
              id:           slide.id,
              world_id:     slide.worldId,
              title:        slide.title,
              notes:        slide.notes,
              sort_order:   slide.sortOrder,
              width:        slide.width,
              height:       slide.height,
              background:   slide.background,
              transition:   slide.transition,
              ambient:      slide.ambient,
              elements:     slide.elements,
              tags:         slide.tags,
              is_hidden:    slide.isHidden,
              updated_at:   new Date().toISOString(),
            }, { onConflict: 'id' })
        )
      )
      markSaved()
    } catch (err) {
      console.error('Auto-save failed:', err)
    }
  }, [state.slides, state.isDirty, markSaved])

  // ── Publish ───────────────────────────────────────────────────────────────
  const publish = useCallback(async () => {
    await persistSlides()
    await supabase.from('worlds').update({ status: 'published' }).eq('id', world.id)
    router.push(`/worlds/${world.slug}`)
  }, [persistSlides, world.id, world.slug, router])

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((e.target as HTMLElement).contentEditable === 'true') return

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key === 'v' || e.key === 'V') controller.setTool('select')
        if (e.key === 't' || e.key === 'T') controller.setTool('text')
        if (e.key === 'r' || e.key === 'R') controller.setTool('rect')
        if (e.key === 'e' || e.key === 'E') controller.setTool('ellipse')
        if (e.key === 'h' || e.key === 'H') controller.setTool('pan')
      }

      // History
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) { if (canRedo) redo() } else { if (canUndo) undo() }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); if (canRedo) redo() }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        if (state.selection.ids.length) controller.duplicateElements(state.selection.ids)
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selection.ids.length) {
        controller.deleteElements(state.selection.ids)
        controller.clearSelection()
      }

      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        persistSlides()
      }

      // Select all on slide
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        const ids = activeSlide?.elements.map(el => el.id) ?? []
        controller.selectElements(ids, 'replace')
      }

      // Escape
      if (e.key === 'Escape') {
        controller.clearSelection()
        controller.setTool('select')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [controller, state.selection.ids, undo, redo, canUndo, canRedo, activeSlide, persistSlides])

  // ── Save status label ─────────────────────────────────────────────────────
  const saveLabel = state.isSaving ? 'Saving…' : state.isDirty ? 'Unsaved changes' : 'All changes saved'

  return (
    <div className="we-root">

      {/* ── MENU BAR ── */}
      <header className="we-menubar">
        <div className="we-menubar-left">
          <a href="/dashboard/worlds" className="we-back-link">← Worlds</a>
          <span className="we-world-title">{world.title}</span>
        </div>

        <div className="we-menubar-center">
          <span className="we-save-label">{saveLabel}</span>
        </div>

        <div className="we-menubar-right">
          <a
            href={`/worlds/${world.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="we-btn we-btn--outline"
          >
            Preview ↗
          </a>
          <button className="we-btn we-btn--gold" onClick={publish}>
            Publish
          </button>
        </div>
      </header>

      {/* ── TOOLBAR ── */}
      <Toolbar editor={controller} />

      {/* ── BODY ── */}
      <div className="we-body">

        {/* LEFT PANEL */}
        <aside className="we-left">
          <div className="we-left-tabs">
            {(['slides','elements','layers'] as const).map(tab => (
              <button
                key={tab}
                className={`we-left-tab ${state.leftPanel === tab ? 'active' : ''}`}
                onClick={() => setLeftPanel(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {state.leftPanel === 'slides' && (
            <SlideNavigator controller={controller} worldId={world.id} />
          )}
          {state.leftPanel === 'elements' && (
            <ElementsPanel controller={controller} />
          )}
          {state.leftPanel === 'layers' && (
            // Layers is shown inside SlideSettings — switch right panel
            <div className="we-left-redirect">
              <p>Layers are in the right panel.</p>
              <button
                className="we-btn we-btn--outline"
                onClick={() => controller.setRightPanel('layers' as any)}
              >
                Open Layers →
              </button>
            </div>
          )}
        </aside>

        {/* CENTER CANVAS */}
        <main className="we-center">
          <div className="we-canvas-header">
            <div className="we-canvas-info">
              <span>Slide {state.activeSlideIndex + 1} / {state.slides.length}</span>
              <span>{activeSlide?.title}</span>
            </div>
            <div className="we-canvas-nav">
              <button
                className="we-btn we-btn--ghost"
                onClick={() => controller.selectSlide(Math.max(0, state.activeSlideIndex - 1))}
                disabled={state.activeSlideIndex === 0}
              >
                ◀
              </button>
              <button
                className="we-btn we-btn--ghost"
                onClick={() => controller.selectSlide(Math.min(state.slides.length - 1, state.activeSlideIndex + 1))}
                disabled={state.activeSlideIndex === state.slides.length - 1}
              >
                ▶
              </button>
              <button className="we-btn we-btn--outline" onClick={() => {/* present mode */}}>
                ⛶ Present
              </button>
            </div>
          </div>

          <SlideCanvas controller={controller} />
        </main>

        {/* RIGHT PANEL */}
        <aside className="we-right">
          <SlideSettings controller={controller} />
        </aside>

      </div>

      {/* STATUS BAR */}
      <footer className="we-statusbar">
        <span>Tool: {state.tool}</span>
        <span>Elements: {activeSlide?.elements.length ?? 0}</span>
        <span>Zoom: {Math.round(state.viewport.zoom * 100)}%</span>
        <span className="we-statusbar-right">
          {state.selection.ids.length > 0 && `${state.selection.ids.length} selected`}
        </span>
      </footer>

    </div>
  )
}