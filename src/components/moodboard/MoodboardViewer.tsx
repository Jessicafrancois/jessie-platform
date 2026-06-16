'use client'

import { useState } from 'react'
import './moodboard-viewer.css'

type Slide = {
  id: string
  order: number
  type: string
  title: string
  content: string
  images: string[]
}

type Moodboard = {
  id: string
  title: string
  slides: Slide[]
  projects?: { title: string; description: string } | null
}

const SLIDE_TYPE_ICONS: Record<string, string> = {
  brief: '◈', strategy: '▸', moodboard: '◎',
  direction: '✦', deliverables: '□', text: '≡', gallery: '◐'
}

export default function MoodboardViewer({ moodboard }: { moodboard: Moodboard }) {
  const slides = moodboard.slides || []
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const prev = () => setCurrent(i => Math.max(0, i - 1))
  const next = () => setCurrent(i => Math.min(slides.length - 1, i + 1))

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'Escape') setFullscreen(false)
  }

  const slide = slides[current]

  return (
    <main
      className={`mb-viewer ${fullscreen ? 'mb-viewer--fullscreen' : ''}`}
      onKeyDown={handleKey}
      tabIndex={0}
    >

      {/* HEADER */}
      <div className="mb-viewer-header">
        <div className="mb-viewer-header-left">
          <h1 className="mb-viewer-title">{moodboard.title}</h1>
          {moodboard.projects?.title && (
            <span className="mb-viewer-project">{moodboard.projects.title}</span>
          )}
        </div>
        <div className="mb-viewer-header-right">
          <span className="mb-viewer-counter">
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <button
            className="mb-viewer-fullscreen-btn"
            onClick={() => setFullscreen(f => !f)}
          >
            {fullscreen ? '⊡' : '⊞'}
          </button>
        </div>
      </div>

      {/* SLIDE */}
      <div className="mb-viewer-slide">
        {slide ? (
          <>
            <div className="mb-viewer-slide-type">
              {SLIDE_TYPE_ICONS[slide.type] || '◇'}
              {slide.type.replace(/_/g, ' ')}
            </div>

            <h2 className="mb-viewer-slide-title">{slide.title}</h2>

            {slide.content && (
              <p className="mb-viewer-slide-content">{slide.content}</p>
            )}

            {slide.images && slide.images.length > 0 && (
              <div className={`mb-viewer-images mb-viewer-images--${Math.min(slide.images.length, 4)}`}>
                {slide.images.map((img, idx) => (
                  <div key={idx} className="mb-viewer-image-wrapper">
                    <img src={img} alt={`${slide.title} ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="mb-viewer-empty">
            <p>No slides in this moodboard.</p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="mb-viewer-nav">
        <button
          className="mb-viewer-arrow"
          onClick={prev}
          disabled={current === 0}
        >
          ←
        </button>

        <div className="mb-viewer-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`mb-viewer-dot ${idx === current ? 'is-active' : ''}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>

        <button
          className="mb-viewer-arrow"
          onClick={next}
          disabled={current === slides.length - 1}
        >
          →
        </button>
      </div>

      {/* FILMSTRIP */}
      <div className="mb-viewer-filmstrip">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            className={`mb-viewer-filmstrip-item ${idx === current ? 'is-active' : ''}`}
            onClick={() => setCurrent(idx)}
          >
            <span className="mb-viewer-filmstrip-icon">{SLIDE_TYPE_ICONS[s.type] || '◇'}</span>
            <span className="mb-viewer-filmstrip-title">{s.title}</span>
          </button>
        ))}
      </div>

    </main>
  )
}