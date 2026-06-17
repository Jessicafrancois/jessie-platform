'use client'
import type { Metadata } from 'next'

import { useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type {World,WorldSlide,} from '@/types/worlds'

type Props = {
  slide: WorldSlide
  world: World
  onChangeAction: (updates: Partial<WorldSlide>) => void
}

const SLIDE_TYPES = [
  'hero', 'narrative', 'philosophy', 'vision',
  'timeline', 'gallery', 'projects', 'journal', 'quote', 'cta'
]

const TRANSITIONS = ['fade', 'slide', 'push', 'reveal', 'zoom', 'parallax', 'wipe']


export default function SlideSettings({ slide, world, onChangeAction }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  async function uploadImage(file: File) {
    const path = `worlds/${world.slug}/slides/${slide.id}-${file.name}`
    const { error } = await supabase.storage
      .from('worlds')
      .upload(path, file, { upsert: true })

    if (error) { console.error(error); return }

    const { data } = supabase.storage
      .from('worlds')
      .getPublicUrl(path)

    onChangeAction({ background_image: data.publicUrl })
  }

  return (
    <div className="ss-root">
      <div className="ss-section">
        <label className="ss-label">Slide Type</label>
        <select
          className="ss-select"
          value={slide.slide_type}
          onChange={(e) => onChangeAction({ slide_type: e.target.value as WorldSlide['slide_type'] })}
        >
          {SLIDE_TYPES.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="ss-section">
        <label className="ss-label">Title</label>
        <input
          className="ss-input"
          value={slide.title ?? ''}
          onChange={(e) => onChangeAction({ title: e.target.value })}
          placeholder="Slide title"
        />
      </div>

      <div className="ss-section">
        <label className="ss-label">Subtitle</label>
        <input
          className="ss-input"
          value={slide.subtitle ?? ''}
          onChange={(e) => onChangeAction({ subtitle: e.target.value })}
          placeholder="Subtitle or tagline"
        />
      </div>

      <div className="ss-section">
        <label className="ss-label">Content / Body</label>
        <textarea
          className="ss-textarea"
          value={slide.content ?? ''}
          onChange={(e) => onChangeAction({ content: e.target.value })}
          placeholder="Body copy or quote text"
          rows={4}
        />
      </div>

      <div className="ss-section">
        <label className="ss-label">Background Image</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) uploadImage(file)
          }}
        />
        <button
          className="ss-upload-btn"
          onClick={() => fileRef.current?.click()}
        >
          Upload Image
        </button>
        {slide.background_image && (
          <div className="ss-img-preview">
            <img src={slide.background_image} alt="Background preview" />
            <button
              className="ss-img-remove"
              onClick={() => onChangeAction({ background_image: '' })}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="ss-section">
        <label className="ss-label">
          Overlay Strength: {Math.round((slide.overlay_strength ?? 0.6) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={slide.overlay_strength ?? 0.6}
          onChange={(e) => onChangeAction({ overlay_strength: parseFloat(e.target.value) })}
          className="ss-range"
        />
      </div>

      <div className="ss-section">
        <label className="ss-label">Transition</label>
        <select
          className="ss-select"
          value={slide.transition}
          onChange={(e) => onChangeAction({ transition: e.target.value as WorldSlide['transition'] })}
        >
          {TRANSITIONS.map(t => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="ss-section">
        <label className="ss-label">Duration: {slide.duration}ms</label>
        <input
          type="range"
          min="300"
          max="2000"
          step="100"
          value={slide.duration}
          onChange={(e) => onChangeAction({ duration: parseInt(e.target.value, 10) })}
          className="ss-range"
        />
      </div>

      <div className="ss-section">
        <label className="ss-label">Text Alignment</label>
        <div className="ss-align-group">
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              className={`ss-align-btn ${slide.text_alignment === a ? 'ss-align-btn--active' : ''}`}
              onClick={() => onChangeAction({ text_alignment: a })}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}