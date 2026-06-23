'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const FIELDS = [
  { section: 'default', key: 'title', label: 'Default Site Title', type: 'text' },
  { section: 'default', key: 'description', label: 'Default Meta Description', type: 'textarea' },
  { section: 'default', key: 'og_image', label: 'Default Open Graph Image URL', type: 'text' },
  { section: 'default', key: 'twitter_image', label: 'Default Twitter Image URL', type: 'text' },
  { section: 'brand', key: 'name', label: 'Brand Name', type: 'text' },
  { section: 'brand', key: 'tagline', label: 'Tagline', type: 'text' },
  { section: 'social', key: 'instagram', label: 'Instagram URL', type: 'text' },
  { section: 'social', key: 'twitter', label: 'Twitter/X URL', type: 'text' },
  { section: 'social', key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
]

export default function GlobalSettingsPanel() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('site_settings').select('*').eq('page', 'seo')
    const map: Record<string, string> = {}
    ;(data ?? []).forEach(s => { map[`${s.section}.${s.key}`] = s.value ?? '' })
    setValues(map)
    setLoading(false)
  }

  const getValue = (section: string, key: string) => values[`${section}.${key}`] ?? ''
  const setValue = (section: string, key: string, value: string) =>
    setValues(prev => ({ ...prev, [`${section}.${key}`]: value }))

  async function save() {
    setSaving(true)
    await Promise.all(
      FIELDS.map(field =>
        supabase.from('site_settings').upsert(
          {
            page: 'seo',
            section: field.section,
            key: field.key,
            value: getValue(field.section, field.key),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'page,section,key' }
        )
      )
    )
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="bb-loading">Loading...</div>

  return (
    <div className="bb-global-settings">
      <div className="bb-global-header">
        <div>
          <h2>Global Settings</h2>
          <p>SEO defaults, brand identity, and social links — applied site-wide.</p>
        </div>
        <button className="bb-save-btn" onClick={save} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="bb-global-fields">
        {FIELDS.map(field => (
          <div key={`${field.section}.${field.key}`} className="bb-field">
            <label className="bb-label">
              <span className="bb-label-section">{field.section}</span>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className="bb-textarea"
                rows={3}
                value={getValue(field.section, field.key)}
                onChange={e => setValue(field.section, field.key, e.target.value)}
              />
            ) : (
              <input
                className="bb-input"
                value={getValue(field.section, field.key)}
                onChange={e => setValue(field.section, field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}