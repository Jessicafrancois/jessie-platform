'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { syncFonts } from '@/lib/syncFonts'

type FontRecord = {
  id: string
  name: string
  family: string
  bucket_path: string
  category: string
  active: boolean
}

export default function FontManagerPage() {
  const [fonts, setFonts] = useState<FontRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  async function loadFonts() {
    const { data } = await supabase
      .from('font_library')
      .select('*')
      .order('family')

    setFonts(data || [])
  }

  async function handleSync() {
    setLoading(true)

    try {
      const imported = await syncFonts()

      alert(`${imported} fonts imported`)

      await loadFonts()
    } catch (error) {
      console.error(error)
      alert('Font sync failed')
    }

    setLoading(false)
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase
      .from('font_library')
      .update({
        active: !active,
      })
      .eq('id', id)

    await loadFonts()
  }

  useEffect(() => {
    loadFonts()
  }, [])

  const filteredFonts = fonts.filter(
    (font) =>
      font.name.toLowerCase().includes(search.toLowerCase()) ||
      font.family.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          Font Manager
        </h1>

        <button
          onClick={handleSync}
          disabled={loading}
          className="rounded-lg border px-4 py-2"
        >
          {loading ? 'Syncing...' : 'Sync Fonts'}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search fonts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-lg border p-3"
      />

      <div className="space-y-3">
        {filteredFonts.map((font) => (
          <div
            key={font.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <div className="font-medium">
                {font.name}
              </div>

              <div className="text-sm text-gray-500">
                {font.family}
              </div>
            </div>

            <button
              onClick={() =>
                toggleActive(font.id, font.active)
              }
              className="rounded border px-3 py-1"
            >
              {font.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}