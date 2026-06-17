'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import './site.css'

type Setting = {
  id: string
  page: string
  section: string
  key: string
  value: string | null
}

type PageTab = 'home' | 'journal' | 'collections' | 'projects' | 'worlds' | 'about' | 'start' | 'navigation' | 'seo'

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'journal', label: 'Journal' },
  { id: 'collections', label: 'Collections' },
  { id: 'projects', label: 'Projects' },
  { id: 'worlds', label: 'Worlds' },
  { id: 'about', label: 'About' },
  { id: 'start', label: 'Start Here' },
  { id: 'seo', label: 'SEO Defaults' },
]

// Field definitions per page — what you can edit
const PAGE_FIELDS: Record<PageTab, { section: string; key: string; label: string; type: string }[]> = {
    home: [
        { section: 'hero', key: 'headline', label: 'Hero Headline', type: 'text' },
        { section: 'hero', key: 'subheadline', label: 'Hero Subheadline', type: 'textarea' },
        { section: 'status', key: 'currently_building', label: 'Currently Building', type: 'text' },
        { section: 'status', key: 'research_focus', label: 'Research Focus', type: 'text' },
        { section: 'focus', key: 'title', label: 'Focus Section Title', type: 'text' },
        { section: 'focus', key: 'body', label: 'Focus Section Body', type: 'textarea' },
        { section: 'manifesto', key: 'headline', label: 'Manifesto Headline', type: 'text' },
        { section: 'manifesto', key: 'body', label: 'Manifesto Body', type: 'textarea' },
        { section: 'closing', key: 'line1', label: 'Closing Line 1', type: 'text' },
        { section: 'closing', key: 'line2', label: 'Closing Line 2', type: 'text' },
    ],
    journal: [
        { section: 'hero', key: 'headline', label: 'Headline', type: 'text' },
        { section: 'hero', key: 'subheadline', label: 'Subheadline', type: 'textarea' },
        { section: 'sidebar', key: 'kicker', label: 'Sidebar Kicker', type: 'text' },
        { section: 'sidebar', key: 'description', label: 'Sidebar Description', type: 'textarea' },
        { section: 'signature', key: 'copy', label: 'Signature Copy', type: 'textarea' },
    ],
    collections: [
        { section: 'hero', key: 'headline', label: 'Headline', type: 'text' },
        { section: 'hero', key: 'subheadline', label: 'Subheadline', type: 'text' },
        { section: 'hero', key: 'hero_image', label: 'Hero Image URL', type: 'text' },
    ],
    projects: [
        { section: 'hero', key: 'headline', label: 'Headline', type: 'text' },
        { section: 'hero', key: 'subheadline', label: 'Subheadline', type: 'text' },
    ],
    worlds: [
        { section: 'hero', key: 'headline', label: 'Headline', type: 'text' },
        { section: 'hero', key: 'subheadline', label: 'Subheadline', type: 'text' },
        { section: 'signature', key: 'copy', label: 'Signature Quote', type: 'text' },
    ],
    about: [
        { section: 'hero', key: 'headline', label: 'Headline', type: 'text' },
        { section: 'hero', key: 'note', label: 'Hero Note', type: 'textarea' },
        { section: 'intro', key: 'paragraph_1', label: 'Intro Paragraph 1', type: 'textarea' },
        { section: 'intro', key: 'paragraph_2', label: 'Intro Paragraph 2', type: 'textarea' },
        { section: 'intro', key: 'photo', label: 'Profile Photo URL', type: 'text' },
        { section: 'ending', key: 'script_line', label: 'Ending Quote', type: 'text' },
        { section: 'top_left', key: 'title', label: 'Page Title (top-left)', type: 'text' },
        { section: 'top_left', key: 'role', label: 'Role (top-left)', type: 'text' },
    ],
    start: [
        { section: 'hero', key: 'headline', label: 'Hero Headline', type: 'text' },
        { section: 'hero', key: 'subheadline', label: 'Hero Subheadline', type: 'textarea' },
        { section: 'hero', key: 'hero_image', label: 'Hero Background Image URL', type: 'text' },
        { section: 'audience', key: 'headline', label: 'Audience Headline', type: 'text' },
        { section: 'philosophy', key: 'quote', label: 'Philosophy Quote', type: 'textarea' },
        { section: 'recommended', key: 'headline', label: 'Recommended Starting Point Headline', type: 'text' },
        { section: 'recommended', key: 'body', label: 'Recommended Starting Point Body', type: 'textarea' },
        { section: 'signature', key: 'script', label: 'Signature Script', type: 'text' },
    ],
    seo: [
        { section: 'default', key: 'title', label: 'Default Site Title', type: 'text' },
        { section: 'default', key: 'description', label: 'Default Meta Description', type: 'textarea' },
        { section: 'default', key: 'og_image', label: 'Default Open Graph Image URL', type: 'text' },
        { section: 'default', key: 'twitter_image', label: 'Default Twitter Image URL', type: 'text' },
        { section: 'brand', key: 'name', label: 'Brand Name', type: 'text' },
        { section: 'brand', key: 'tagline', label: 'Tagline', type: 'text' },
        { section: 'social', key: 'instagram', label: 'Instagram URL', type: 'text' },
        { section: 'social', key: 'twitter', label: 'Twitter/X URL', type: 'text' },
        { section: 'social', key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
    ],
    navigation: []
}

export default function SiteEditorPage() {
  const [activeTab, setActiveTab] = useState<PageTab>('home')
  const [settings, setSettings] = useState<Setting[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [activeTab])

  async function loadSettings() {
    setLoading(true)
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('page', activeTab)
    const data2 = data || []
    setSettings(data2)

    // Build values map: `section.key` → value
    const map: Record<string, string> = {}
    data2.forEach(s => {
      map[`${s.section}.${s.key}`] = s.value || ''
    })
    setValues(map)
    setLoading(false)
  }

  function getValue(section: string, key: string) {
    return values[`${section}.${key}`] || ''
  }

  function setValue(section: string, key: string, value: string) {
    setValues(prev => ({ ...prev, [`${section}.${key}`]: value }))
  }

  async function saveAll() {
    setSaving(true)
    const fields = PAGE_FIELDS[activeTab] || []

    for (const field of fields) {
      const value = getValue(field.section, field.key)
      await supabase
        .from('site_settings')
        .upsert({
          page: activeTab,
          section: field.section,
          key: field.key,
          value,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'page,section,key' })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fields = PAGE_FIELDS[activeTab] || []

  return (
    <div className="site-editor">

      <div className="site-editor-header">
        <div>
          <h1>Site Editor</h1>
          <p>
            Control every public page from here. Changes go live within
            60 seconds without a redeploy.
          </p>
        </div>
        <button
          className="site-save-btn"
          onClick={saveAll}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="site-editor-tabs">
        {PAGE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`site-editor-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="site-editor-loading">Loading settings...</div>
      ) : (
        <div className="site-editor-fields">
          {fields.map(field => (
            <div key={`${field.section}.${field.key}`} className="site-editor-field">
              <label className="site-editor-label">
                <span className="site-editor-label-section">{field.section}</span>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="site-editor-textarea"
                  value={getValue(field.section, field.key)}
                  onChange={e => setValue(field.section, field.key, e.target.value)}
                  rows={3}
                />
              ) : (
                <input
                  className="site-editor-input"
                  type="text"
                  value={getValue(field.section, field.key)}
                  onChange={e => setValue(field.section, field.key, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="site-editor-note">
            <span>Changes apply to public pages within 60 seconds.</span>
            <span>Images must be Supabase Storage public URLs.</span>
          </div>
        </div>
      )}

    </div>
  )
}