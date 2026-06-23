'use client'

import { useState, useCallback } from 'react'
import type { ComponentType } from 'react'
import { supabase } from '@/lib/supabase'
import type { World, WorldSlide } from '@/types/worlds'

import { useRef } from 'react'  // update existing import
import ExportPanel from './editor/ExportPanel'
import './editor/export-panel.css'

import SlideNavigator from './editor/SlideNavigator'
import SlideCanvas from './editor/SlideCanvas'
import SlideSettings from './editor/SlideSettings'

const SlideSettingsComponent = SlideSettings as unknown as ComponentType<{
  slide: WorldSlide
  world: World
  onChange: (updates: Partial<WorldSlide>) => Promise<void>
}>

const SlideNavigatorComponent = SlideNavigator as unknown as ComponentType<{
  slides: WorldSlide[]
  activeIndex: number
  onSelect: (index: number) => void
  onAdd: () => Promise<void>
  onDuplicate: (index: number) => Promise<void>
  onDelete: (index: number) => Promise<void>
  onReorder: (from: number, to: number) => Promise<void>
}>


const [showExport, setShowExport] = useState(false)
const stageRef = useRef<HTMLElement | null>(null)

type Props = {
  world: World
  initialSlides: WorldSlide[]
}

export default function WorldEditor({ world, initialSlides }: Props) {
  const [slides, setSlides] = useState<WorldSlide[]>(initialSlides)
  const [activeIndex, setActiveIndex] = useState(0)
  const [saving, setSaving] = useState(false)

  const activeSlide = slides[activeIndex] ?? null

  const addSlide = useCallback(async () => {
    const newSlide: Partial<WorldSlide> = {
      world_id:    world.id,
      title:       'New Slide',
      subtitle:    '',
      content:     '',
      slide_type:  'narrative',
      transition:  'fade',
      duration:    800,
      sort_order:  slides.length,
      settings:    {},
    }

    const { data, error } = await supabase
      .from('world_slides')
      .insert(newSlide)
      .select()
      .single()

    if (error) { console.error(error); return }
    setSlides(prev => [...prev, data])
    setActiveIndex(slides.length)
  }, [world.id, slides.length])

  const duplicateSlide = useCallback(async (index: number) => {
    const source = slides[index]
    const { id: _, created_at: __, updated_at: ___, ...rest } = source
    const dupe = { ...rest, title: `${source.title} (copy)`, sort_order: slides.length }

    const { data, error } = await supabase
      .from('world_slides')
      .insert(dupe)
      .select()
      .single()

    if (error) { console.error(error); return }
    setSlides(prev => [...prev, data])
    setActiveIndex(slides.length)
  }, [slides])

  const deleteSlide = useCallback(async (index: number) => {
    const slide = slides[index]
    const { error } = await supabase
      .from('world_slides')
      .delete()
      .eq('id', slide.id)

    if (error) { console.error(error); return }
    setSlides(prev => prev.filter((_, i) => i !== index))
    setActiveIndex(Math.max(0, index - 1))
  }, [slides])

  const updateSlide = useCallback(async (updates: Partial<WorldSlide>) => {
    if (!activeSlide) return

    setSlides(prev =>
      prev.map((s, i) => i === activeIndex ? { ...s, ...updates } : s)
    )

    setSaving(true)
    const { error } = await supabase
      .from('world_slides')
      .update(updates)
      .eq('id', activeSlide.id)

    if (error) console.error(error)
    setSaving(false)
  }, [activeSlide, activeIndex])

  const reorderSlides = useCallback(async (from: number, to: number) => {
    const reordered = [...slides]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)

    const updated = reordered.map((s, i) => ({ ...s, sort_order: i }))
    setSlides(updated)
    setActiveIndex(to)

    // Batch update sort orders
    await Promise.all(
      updated.map(s =>
        supabase
          .from('world_slides')
          .update({ sort_order: s.sort_order })
          .eq('id', s.id)
      )
    )
  }, [slides])

  return (
    <div className="we-root">
      {/* TOP BAR */}
      <header className="we-topbar">
        <div className="we-topbar-left">
          <a href={`/dashboard/worlds`} className="we-back">← Worlds</a>
          <span className="we-world-name">{world.title}</span>
        </div>
        <div className="we-topbar-center">
          <span className="we-save-status">
            {saving ? 'Saving…' : 'Saved'}
          </span>
        </div>
        <div className="we-topbar-right">
          <a
            href={`/worlds/${world.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="we-preview-btn"
          >
            Preview ↗
          </a>

          <button
            className="we-export-trigger"
            onClick={() => setShowExport(v => !v)}
          >
            Export ↓
          </button>
          <button
            className="we-publish-btn"
            onClick={async () => {
              await supabase
                .from('worlds')
                .update({ status: 'published' })
                .eq('id', world.id)
            }}
          >
            Publish
          </button>
        </div>
      </header>

      {showExport && (
  <ExportPanel
    worldTitle={world.title}
    slides={slides}
    activeIndex={activeIndex}
    stageRef={stageRef}
    allStageRefs={{ current: [] }}
    onCloseAction={() => setShowExport(false)}
  />
)}


      {/* THREE-COLUMN LAYOUT */}
      <div className="we-body">
        {/* LEFT: Slide Navigator */}
        <aside className="we-left">
          <SlideNavigatorComponent
            slides={slides}
            activeIndex={activeIndex}
            onSelect={(index: number) => setActiveIndex(index)}
            onAdd={addSlide}
            onDuplicate={duplicateSlide}
            onDelete={deleteSlide}
            onReorder={reorderSlides}
          />
        </aside>

        {/* CENTER: Canvas */}
        <main className="we-center">
          <SlideCanvas
            slide={activeSlide}
            world={world}
          />
        </main>

        <main className="we-center" 
        ref={stageRef as React.RefObject<HTMLDivElement>}>
        </main>

        {/* RIGHT: Settings */}
        <aside className="we-right">
          {activeSlide && (
            <SlideSettingsComponent
              slide={activeSlide}
              world={world}
              onChange={updateSlide}
            />
          )}
        </aside>
      </div>
    </div>
  )
}