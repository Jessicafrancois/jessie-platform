'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import './new-form.css'

/**
 * NewWorldForm
 * Path: src/app/dashboard/worlds/new/page.tsx
 *
 * A world is a top-level narrative/brand container.
 * Types: Brand, Story, Community, Ecosystem, Concept
 */

const WORLD_TYPES = [
  'Brand',
  'Story',
  'Community',
  'Ecosystem',
  'Concept',
]

const WORLD_STATUSES = [
  'Active',
  'In Development',
  'On Hold',
  'Archived',
]

export default function NewWorldForm() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('Active')
  const [coverImage, setCoverImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(value: string) {
    setTitle(value)
    const auto = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setSlug(auto)
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('World title is required.')
      return
    }
    if (!type) {
      setError('Please select a world type.')
      return
    }

    setSaving(true)
    setError('')

    const { error: dbError } = await supabase.from('worlds').insert({
      title: title.trim(),
      slug: slug || null,
      description: description.trim() || null,
      type,
      status,
      cover_image: coverImage || null,
    })

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
      return
    }

    router.push('/dashboard/worlds')
  }

  return (
    <div className="new-form-page">

      <div className="new-form-header">
        <button
          className="new-form-back"
          onClick={() => router.back()}
        >
          ← Worlds
        </button>
        <h1>New World</h1>
        <p>Create a brand, story universe, or creative ecosystem.</p>
      </div>

      <div className="new-form-body">

        {/* MAIN FIELDS */}
        <div className="new-form-main">

          <div className="new-form-field">
            <label htmlFor="world-title">World Name</label>
            <input
              id="world-title"
              type="text"
              placeholder="e.g. Twisted Stars, Muse Studios..."
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              autoFocus
            />
          </div>

          <div className="new-form-field">
            <label htmlFor="world-slug">
              URL Slug
              <span className="new-form-field-hint">Auto-generated from name</span>
            </label>
            <div className="new-form-slug-input">
              <span className="new-form-slug-prefix">/worlds/</span>
              <input
                id="world-slug"
                type="text"
                placeholder="world-slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="new-form-field">
            <label htmlFor="world-description">Description</label>
            <textarea
              id="world-description"
              placeholder="What is this world? What does it contain or explore?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* TYPE SELECTOR — card style */}
          <div className="new-form-field">
            <label>World Type</label>
            <div className="new-form-type-grid">
              {WORLD_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`new-form-type-card ${type === t ? 'is-selected' : ''}`}
                  onClick={() => setType(t)}
                >
                  <span className="new-form-type-icon">
                    {t === 'Brand' && '◈'}
                    {t === 'Story' && '✦'}
                    {t === 'Community' && '◎'}
                    {t === 'Ecosystem' && '⬡'}
                    {t === 'Concept' && '◇'}
                  </span>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="new-form-row">
            <div className="new-form-field">
              <label htmlFor="world-status">Status</label>
              <select
                id="world-status"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {WORLD_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="new-form-field">
            <label htmlFor="world-cover">
              Cover Image URL
              <span className="new-form-field-hint">Paste a Supabase Storage URL</span>
            </label>
            <input
              id="world-cover"
              type="text"
              placeholder="https://..."
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
            />
            {coverImage && (
              <div className="new-form-image-preview">
                <img src={coverImage} alt="Cover preview" />
              </div>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR — preview */}
        <div className="new-form-sidebar">
          <p className="new-form-sidebar-label">Preview</p>

          <div className="new-form-preview-card new-form-preview-card--world">
            <div className="new-form-preview-cover">
              {coverImage ? (
                <img src={coverImage} alt={title || 'Cover'} />
              ) : (
                <div className="new-form-preview-cover-empty">
                  <span>{title ? title[0]?.toUpperCase() : '?'}</span>
                </div>
              )}
              <div className="new-form-preview-overlay">
                {type && (
                  <span className="new-form-preview-type">{type}</span>
                )}
                <h3>{title || 'World Name'}</h3>
                <span className="new-form-preview-cta">Enter World →</span>
              </div>
            </div>
          </div>

          <div className="new-form-preview-meta-row">
            <span className={`new-form-status new-form-status--${status.toLowerCase().replace(' ', '-')}`}>
              {status}
            </span>
            {slug && (
              <span className="new-form-preview-slug">/worlds/{slug}</span>
            )}
          </div>

          {error && (
            <div className="new-form-error">
              {error}
            </div>
          )}

          <div className="new-form-actions">
            <button
              className="new-form-btn new-form-btn--ghost"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              className="new-form-btn new-form-btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Create World'}
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}