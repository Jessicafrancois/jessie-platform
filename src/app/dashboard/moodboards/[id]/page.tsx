'use client'

import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import './moodboard-editor.css'

type SlideType = 'brief' | 'strategy' | 'moodboard' | 'direction' | 'deliverables' | 'text' | 'gallery'
type CanvasItemType = 'image' | 'video' | 'shape' | 'sticker' | 'color'

type CanvasItem = {
  id: string
  type: CanvasItemType
  x: number
  y: number
  w: number
  h: number
  rotation: number
  z: number
  src?: string
  text?: string
  color?: string
  shape?: 'rect' | 'circle'
}

type Slide = {
  id: string
  order: number
  type: SlideType
  title: string
  content: string
  images: string[]
  canvasItems?: CanvasItem[]
}

const SLIDE_TYPES: { value: SlideType; label: string; icon: string }[] = [
  { value: 'brief',        label: 'Project Brief',       icon: '◈' },
  { value: 'strategy',     label: 'Strategy',            icon: '▸' },
  { value: 'moodboard',    label: 'Moodboard',           icon: '◎' },
  { value: 'direction',    label: 'Creative Direction',  icon: '✦' },
  { value: 'deliverables', label: 'Deliverables',        icon: '□' },
  { value: 'text',         label: 'Text Block',          icon: '≡' },
  { value: 'gallery',      label: 'Image Gallery',       icon: '◐' },
]

const STICKERS = ['Spark', 'Star', 'Note', 'Arrow', 'Heart']
const COLOR_SWATCHES = ['#d8bc6e', '#f2efe8', '#d95f59', '#5f8dd9', '#4a9d7f', '#111111']

type Props = { params: Promise<{ id: string }> }

export default function MoodboardEditorPage({ params }: Props) {
  const router = useRouter()
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState('draft')
  const [projectId, setProjectId] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [slides, setSlides] = useState<Slide[]>([])
  const [activeSlide, setActiveSlide] = useState<string | null>(null)
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'dirty'>('saved')
  const [loading, setLoading] = useState(true)
  const [isNew, setIsNew] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragRef = useRef<{
    itemId: string
    mode: 'move' | 'resize' | 'rotate'
    startX: number
    startY: number
    item: CanvasItem
  } | null>(null)

  useEffect(() => {
    params.then(p => {
      if (p.id === 'new') {
        setIsNew(true)
        setSlides([createSlide('brief', 0)])
        setLoading(false)
      } else {
        setId(p.id)
        loadMoodboard(p.id)
      }
    })
    loadProjects()
  }, [])

  useEffect(() => {
    if (loading) return
    setSaveState('dirty')

    const draftKey = id ? `jessie:moodboard-draft:${id}` : 'jessie:moodboard-draft:new'
    window.localStorage.setItem(draftKey, JSON.stringify({
      title,
      slug,
      status,
      projectId,
      coverImage,
      slides,
      updated_at: new Date().toISOString(),
    }))

    if (!title.trim()) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      save(false, true)
    }, 1800)

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, status, projectId, coverImage, slides, loading])

  async function loadProjects() {
    const { data } = await supabase.from('projects').select('id, title').order('title')
    setProjects(data || [])
  }

  async function loadMoodboard(mbId: string) {
    const { data } = await supabase
      .from('moodboards')
      .select('*')
      .eq('id', mbId)
      .single()

    if (!data) { router.push('/dashboard/moodboards'); return }

    setTitle(data.title)
    setSlug(data.slug || '')
    setStatus(data.status)
    setProjectId(data.project_id || '')
    setCoverImage(data.cover_image || '')
    setSlides(data.slides || [])
    if (data.slides?.length) setActiveSlide(data.slides[0].id)
    setLoading(false)
  }

  function createSlide(type: SlideType, order: number): Slide {
    const typeLabel = SLIDE_TYPES.find(t => t.value === type)?.label || type
    return {
      id: `slide-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      order,
      type,
      title: typeLabel,
      content: '',
      images: [],
      canvasItems: [],
    }
  }

  function addSlide(type: SlideType) {
    const newSlide = createSlide(type, slides.length)
    setSlides(prev => [...prev, newSlide])
    setActiveSlide(newSlide.id)
  }

  function updateSlide(slideId: string, updates: Partial<Slide>) {
    setSlides(prev =>
      prev.map(s => s.id === slideId ? { ...s, ...updates } : s)
    )
  }

  function removeSlide(slideId: string) {
    if (!confirm('Remove this slide?')) return
    setSlides(prev => prev.filter(s => s.id !== slideId))
    setActiveSlide(slides[0]?.id || null)
  }

  function moveSlide(slideId: string, direction: 'up' | 'down') {
    const idx = slides.findIndex(s => s.id === slideId)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === slides.length - 1) return

    const newSlides = [...slides]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]]
    setSlides(newSlides.map((s, i) => ({ ...s, order: i })))
  }

  function addImage(slideId: string, url: string) {
    if (!url.trim()) return
    updateSlide(slideId, {
      images: [
        ...(slides.find(s => s.id === slideId)?.images || []),
        url.trim()
      ]
    })
  }

  function removeImage(slideId: string, imgUrl: string) {
    const slide = slides.find(s => s.id === slideId)
    if (!slide) return
    updateSlide(slideId, { images: slide.images.filter(img => img !== imgUrl) })
  }

  function addCanvasItem(type: CanvasItemType) {
    if (!currentSlide) return

    const src = (type === 'image' || type === 'video')
      ? window.prompt(type === 'image' ? 'Image URL' : 'Video URL')?.trim()
      : ''

    if ((type === 'image' || type === 'video') && !src) return

    const nextZ = Math.max(0, ...(currentSlide.canvasItems || []).map(item => item.z)) + 1
    const item: CanvasItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      x: 120,
      y: 100,
      w: type === 'sticker' ? 120 : 220,
      h: type === 'sticker' ? 90 : 150,
      rotation: 0,
      z: nextZ,
      src,
      text: type === 'sticker' ? STICKERS[0] : undefined,
      color: type === 'color' ? COLOR_SWATCHES[0] : type === 'shape' ? '#d8bc6e' : undefined,
      shape: type === 'shape' ? 'rect' : undefined,
    }

    updateSlide(currentSlide.id, {
      canvasItems: [...(currentSlide.canvasItems || []), item],
    })
    setSelectedItem(item.id)
  }

  function updateCanvasItem(itemId: string, updates: Partial<CanvasItem>) {
    if (!currentSlide) return
    updateSlide(currentSlide.id, {
      canvasItems: (currentSlide.canvasItems || []).map(item =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    })
  }

  function removeCanvasItem(itemId: string) {
    if (!currentSlide) return
    updateSlide(currentSlide.id, {
      canvasItems: (currentSlide.canvasItems || []).filter(item => item.id !== itemId),
    })
    setSelectedItem(null)
  }

  function moveLayer(itemId: string, direction: 'front' | 'back') {
    if (!currentSlide) return
    const items = currentSlide.canvasItems || []
    const zValues = items.map(item => item.z)
    updateCanvasItem(itemId, {
      z: direction === 'front' ? Math.max(...zValues, 0) + 1 : Math.min(...zValues, 0) - 1,
    })
  }

  function startCanvasDrag(event: PointerEvent, item: CanvasItem, mode: 'move' | 'resize' | 'rotate') {
    event.preventDefault()
    event.stopPropagation()
    setSelectedItem(item.id)
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    dragRef.current = {
      itemId: item.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      item,
    }
  }

  function handleCanvasDrag(event: PointerEvent) {
    const drag = dragRef.current
    if (!drag) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY

    if (drag.mode === 'move') {
      updateCanvasItem(drag.itemId, {
        x: Math.max(0, drag.item.x + dx),
        y: Math.max(0, drag.item.y + dy),
      })
    }

    if (drag.mode === 'resize') {
      updateCanvasItem(drag.itemId, {
        w: Math.max(48, drag.item.w + dx),
        h: Math.max(48, drag.item.h + dy),
      })
    }

    if (drag.mode === 'rotate') {
      updateCanvasItem(drag.itemId, {
        rotation: Math.round(drag.item.rotation + dx / 2),
      })
    }
  }

  function stopCanvasDrag(event: PointerEvent) {
    if (!dragRef.current) return
    try {
      ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
    } catch {}
    dragRef.current = null
  }

  async function save(publish = false, silent = false) {
    if (!title.trim()) {
      if (!silent) alert('Title is required')
      return
    }
    setSaving(true)
    setSaveState('saving')

    const autoSlug = title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')

    const payload = {
      title: title.trim(),
      slug: slug || autoSlug,
      status: publish ? 'published' : status,
      project_id: projectId || null,
      cover_image: coverImage || null,
      slides,
      updated_at: new Date().toISOString(),
    }

    let savedId = id
    if (isNew) {
      const { data } = await supabase.from('moodboards').insert(payload).select().single()
      if (data) { savedId = data.id; setId(data.id); setIsNew(false) }
    } else {
      await supabase.from('moodboards').update(payload).eq('id', id)
    }

    setSaving(false)
    setSaveState('saved')
    if (publish) router.push(`/moodboards/${payload.slug}`)
  }

  const currentSlide = slides.find(s => s.id === activeSlide)
  const currentCanvasItems = [...(currentSlide?.canvasItems || [])].sort((a, b) => a.z - b.z)
  const activeCanvasItem = currentCanvasItems.find(item => item.id === selectedItem)

  if (loading) return <div className="moodboard-editor-loading">Loading...</div>

  return (
    <div className="moodboard-editor">

      {/* TOP BAR */}
      <div className="moodboard-editor-topbar">
        <div className="moodboard-editor-topbar-left">
          <Link href="/dashboard/moodboards" className="moodboard-back">← Moodboards</Link>
          <input
            className="moodboard-title-input"
            placeholder="Moodboard title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="moodboard-editor-topbar-right">
          <select
            className="moodboard-project-select"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
          >
            <option value="">No project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <select
            className="moodboard-status-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="moodboard-save-btn" onClick={() => save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <span className="moodboard-save-state">
            {saveState === 'dirty' ? 'Autosaving...' : saveState === 'saving' ? 'Saving...' : 'Saved'}
          </span>
          <button className="moodboard-publish-btn" onClick={() => save(true)} disabled={saving}>
            Publish →
          </button>
        </div>
      </div>

      <div className="moodboard-editor-body">

        {/* SLIDE LIST (left) */}
        <div className="moodboard-slide-list">
          <p className="moodboard-slide-list-label">Slides</p>

          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`moodboard-slide-thumb ${activeSlide === slide.id ? 'is-active' : ''}`}
              onClick={() => setActiveSlide(slide.id)}
            >
              <span className="moodboard-slide-thumb-num">{index + 1}</span>
              <div className="moodboard-slide-thumb-info">
                <span className="moodboard-slide-thumb-type">
                  {SLIDE_TYPES.find(t => t.value === slide.type)?.icon}
                </span>
                <span className="moodboard-slide-thumb-title">{slide.title}</span>
              </div>
              <div className="moodboard-slide-thumb-controls">
                <button onClick={e => { e.stopPropagation(); moveSlide(slide.id, 'up') }}>↑</button>
                <button onClick={e => { e.stopPropagation(); moveSlide(slide.id, 'down') }}>↓</button>
                <button onClick={e => { e.stopPropagation(); removeSlide(slide.id) }}>×</button>
              </div>
            </div>
          ))}

          {/* ADD SLIDE */}
          <div className="moodboard-add-slide">
            <p className="moodboard-add-label">Add Slide</p>
            <div className="moodboard-add-grid">
              {SLIDE_TYPES.map(type => (
                <button
                  key={type.value}
                  className="moodboard-add-btn"
                  onClick={() => addSlide(type.value)}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SLIDE EDITOR (center) */}
        <div className="moodboard-slide-editor">
          {currentSlide ? (
            <>
              <div className="moodboard-slide-editor-header">
                <input
                  className="moodboard-slide-title-input"
                  value={currentSlide.title}
                  onChange={e => updateSlide(currentSlide.id, { title: e.target.value })}
                />
                <select
                  value={currentSlide.type}
                  onChange={e => updateSlide(currentSlide.id, { type: e.target.value as SlideType })}
                  className="moodboard-slide-type-select"
                >
                  {SLIDE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <textarea
                className="moodboard-slide-content"
                placeholder="Write slide content here — strategy, brief, direction, notes..."
                value={currentSlide.content}
                onChange={e => updateSlide(currentSlide.id, { content: e.target.value })}
              />

              {/* IMAGE SECTION */}
              <div className="moodboard-slide-images">
                <p className="moodboard-slide-images-label">Images</p>

                <div className="moodboard-image-add">
                  <input
                    id={`img-input-${currentSlide.id}`}
                    type="text"
                    placeholder="Paste Supabase Storage URL..."
                    className="moodboard-image-input"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget
                        addImage(currentSlide.id, input.value)
                        input.value = ''
                      }
                    }}
                  />
                  <button
                    className="moodboard-image-add-btn"
                    onClick={() => {
                      const input = document.getElementById(`img-input-${currentSlide.id}`) as HTMLInputElement
                      if (input?.value) {
                        addImage(currentSlide.id, input.value)
                        input.value = ''
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                {currentSlide.images.length > 0 && (
                  <div className="moodboard-image-grid">
                    {currentSlide.images.map((img, idx) => (
                      <div key={idx} className="moodboard-image-item">
                        <img src={img} alt={`Slide image ${idx + 1}`} />
                        <button
                          className="moodboard-image-remove"
                          onClick={() => removeImage(currentSlide.id, img)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="moodboard-freeform">
                <div className="moodboard-freeform-header">
                  <div>
                    <p className="moodboard-slide-images-label">Freeform Canvas</p>
                    <span className="moodboard-freeform-hint">Drag, resize, rotate, layer, and autosave canvas assets.</span>
                  </div>
                  <div className="moodboard-freeform-actions">
                    <button onClick={() => addCanvasItem('image')}>Image</button>
                    <button onClick={() => addCanvasItem('video')}>Video</button>
                    <button onClick={() => addCanvasItem('shape')}>Shape</button>
                    <button onClick={() => addCanvasItem('sticker')}>Sticker</button>
                    <button onClick={() => addCanvasItem('color')}>Color</button>
                  </div>
                </div>

                <div
                  className="moodboard-canvas"
                  onPointerMove={handleCanvasDrag}
                  onPointerUp={stopCanvasDrag}
                  onPointerLeave={stopCanvasDrag}
                  onPointerDown={() => setSelectedItem(null)}
                >
                  {currentCanvasItems.map(item => (
                    <div
                      key={item.id}
                      className={`moodboard-canvas-item moodboard-canvas-item--${item.type} ${selectedItem === item.id ? 'is-selected' : ''}`}
                      style={{
                        left: item.x,
                        top: item.y,
                        width: item.w,
                        height: item.h,
                        zIndex: item.z,
                        transform: `rotate(${item.rotation}deg)`,
                        background: item.type === 'color' || item.type === 'shape' ? item.color : undefined,
                        borderRadius: item.shape === 'circle' ? '999px' : undefined,
                      }}
                      onPointerDown={event => startCanvasDrag(event, item, 'move')}
                    >
                      {item.type === 'image' && item.src && <img src={item.src} alt="" />}
                      {item.type === 'video' && item.src && <video src={item.src} muted loop controls />}
                      {item.type === 'sticker' && <span>{item.text}</span>}
                      {selectedItem === item.id && (
                        <>
                          <button
                            className="moodboard-canvas-rotate"
                            onPointerDown={event => startCanvasDrag(event, item, 'rotate')}
                            aria-label="Rotate asset"
                          />
                          <button
                            className="moodboard-canvas-resize"
                            onPointerDown={event => startCanvasDrag(event, item, 'resize')}
                            aria-label="Resize asset"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {activeCanvasItem && (
                  <div className="moodboard-inspector">
                    <div className="moodboard-inspector-title">
                      <strong>{activeCanvasItem.type}</strong>
                      <button onClick={() => removeCanvasItem(activeCanvasItem.id)}>Remove</button>
                    </div>
                    <label>
                      Rotate
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={activeCanvasItem.rotation}
                        onChange={event => updateCanvasItem(activeCanvasItem.id, { rotation: Number(event.target.value) })}
                      />
                    </label>
                    {(activeCanvasItem.type === 'shape' || activeCanvasItem.type === 'color') && (
                      <label>
                        Color
                        <input
                          type="color"
                          value={activeCanvasItem.color || '#d8bc6e'}
                          onChange={event => updateCanvasItem(activeCanvasItem.id, { color: event.target.value })}
                        />
                      </label>
                    )}
                    {activeCanvasItem.type === 'shape' && (
                      <label>
                        Shape
                        <select
                          value={activeCanvasItem.shape || 'rect'}
                          onChange={event => updateCanvasItem(activeCanvasItem.id, { shape: event.target.value as CanvasItem['shape'] })}
                        >
                          <option value="rect">Rectangle</option>
                          <option value="circle">Circle</option>
                        </select>
                      </label>
                    )}
                    {activeCanvasItem.type === 'sticker' && (
                      <label>
                        Sticker
                        <select
                          value={activeCanvasItem.text || STICKERS[0]}
                          onChange={event => updateCanvasItem(activeCanvasItem.id, { text: event.target.value })}
                        >
                          {STICKERS.map(sticker => <option key={sticker} value={sticker}>{sticker}</option>)}
                        </select>
                      </label>
                    )}
                    <div className="moodboard-layer-actions">
                      <button onClick={() => moveLayer(activeCanvasItem.id, 'front')}>Bring Front</button>
                      <button onClick={() => moveLayer(activeCanvasItem.id, 'back')}>Send Back</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="moodboard-slide-empty">
              <p>Select a slide to edit or add a new one.</p>
            </div>
          )}
        </div>

        {/* PREVIEW (right) */}
        <div className="moodboard-slide-preview">
          <p className="moodboard-preview-label">
            Preview — Slide {slides.findIndex(s => s.id === activeSlide) + 1} of {slides.length}
          </p>
          {currentSlide && (
            <div className="moodboard-preview-card">
              <div className="moodboard-preview-type">
                {SLIDE_TYPES.find(t => t.value === currentSlide.type)?.icon}
                {SLIDE_TYPES.find(t => t.value === currentSlide.type)?.label}
              </div>
              <h3 className="moodboard-preview-title">{currentSlide.title}</h3>
              {currentSlide.content && (
                <p className="moodboard-preview-content">{currentSlide.content}</p>
              )}
              {currentSlide.images.length > 0 && (
                <div className="moodboard-preview-images">
                  {currentSlide.images.slice(0, 4).map((img, idx) => (
                    <img key={idx} src={img} alt="" className="moodboard-preview-img" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
