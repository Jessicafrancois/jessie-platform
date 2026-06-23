'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { syncFonts } from '@/lib/syncFonts'

import './fonts.css'

type FontRecord = {
id: string
name: string
family: string
bucket_path: string
category: string
font_weight?: number
font_style?: string
active?: boolean
is_variable?: boolean
created_at?: string
}

export default function FontManagerPage() {
const [fonts, setFonts] = useState<FontRecord[]>([])
const [loading, setLoading] = useState(false)
const [search, setSearch] = useState('')

async function loadFonts() {
const { data, error } = await supabase
.from('fonts')
.select('*')
.order('name')


if (error) {
  console.error(error)
  return
}

setFonts(data || [])


}

async function handleSync() {
setLoading(true)


try {
  const imported = await syncFonts()

  await loadFonts()

  alert(`${imported} fonts synced`)
} catch (error) {
  console.error(error)
  alert('Failed to sync fonts')
}

setLoading(false)


}

async function deleteFont(id: string) {
const confirmed = window.confirm(
'Delete this font record?'
)


if (!confirmed) return

const { error } = await supabase
  .from('fonts')
  .delete()
  .eq('id', id)

if (error) {
  console.error(error)
  alert(error.message)
  return
}

await loadFonts()


}

useEffect(() => {
loadFonts()
}, [])

const filteredFonts = fonts.filter((font) => {
const query = search.toLowerCase()

return (
  font.name?.toLowerCase().includes(query) ||
  font.family?.toLowerCase().includes(query) ||
  font.category?.toLowerCase().includes(query)
)


})

return ( <main className="fonts-page"> <div className="fonts-header"> <div> <h1 className="fonts-title">
Font Library </h1>


      <p className="fonts-subtitle">
        Manage fonts synced from your
        Supabase storage bucket.
      </p>
    </div>

    <div className="fonts-actions">
      <button
        onClick={handleSync}
        disabled={loading}
        className="fonts-btn"
      >
        {loading
          ? 'Syncing...'
          : 'Sync Fonts'}
      </button>
    </div>
  </div>

  <div className="fonts-search">
    <input
      type="text"
      placeholder="Search fonts..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />
  </div>

  <div className="fonts-stats">
    Total Fonts: {filteredFonts.length}
  </div>

  <div className="fonts-grid">
    {filteredFonts.map((font) => (
      <div
        key={font.id}
        className="font-card"
      >
        <div>
          <h3 className="font-name">
            {font.name}
          </h3>

          <div className="font-family">
            {font.family}
          </div>

          <div className="font-meta">
            <span className="font-tag">
              {font.category}
            </span>

            {font.font_weight && (
              <span className="font-tag">
                Weight {font.font_weight}
              </span>
            )}

            {font.font_style && (
              <span className="font-tag">
                {font.font_style}
              </span>
            )}

            {font.is_variable && (
              <span className="font-tag">
                Variable
              </span>
            )}

            {font.active && (
              <span className="font-tag">
                Active
              </span>
            )}
          </div>

          <div className="font-path">
            {font.bucket_path}
          </div>
        </div>

        <div className="font-actions">
          <button
            onClick={() =>
              deleteFont(font.id)
            }
            className="font-delete"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {filteredFonts.length === 0 && (
    <div className="font-empty">
      <div className="font-empty-title">
        No Fonts Found
      </div>

      <div className="font-empty-text">
        Click Sync Fonts to import fonts
        from your Supabase bucket.
      </div>
    </div>
  )}
</main>


)
}
