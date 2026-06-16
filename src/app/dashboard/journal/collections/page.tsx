'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import '../cms.css'

type Collection = {
  id: string
  name: string
  slug: string
  description: string
  hero_image?: string
  created_at?: string
  entry_count?: number
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Collection | null>(null)

  useEffect(() => { fetchCollections() }, [])

  async function fetchCollections() {
    const { data } = await supabase
      .from('collections')
      .select(`*, entries(count)`)
      .order('name', { ascending: true })

    setCollections(
      (data || []).map(c => ({
        ...c,
        entry_count: c.entries?.[0]?.count || 0,
      }))
    )
  }

  async function createCollection() {
    if (!name.trim()) return
    setLoading(true)
    const slug = name.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    await supabase.from('collections').insert({ name, slug, description })
    setName('')
    setDescription('')
    await fetchCollections()
    setLoading(false)
  }

  async function saveEdit() {
    if (!editing) return
    setLoading(true)
    await supabase
      .from('collections')
      .update({
        name: editing.name,
        description: editing.description,
        hero_image: editing.hero_image,
      })
      .eq('id', editing.id)
    setEditing(null)
    await fetchCollections()
    setLoading(false)
  }

  async function deleteCollection(id: string) {
    if (!confirm('Delete this collection?')) return
    await supabase.from('collections').delete().eq('id', id)
    fetchCollections()
  }

  const filtered = collections.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="cms-page">
      <div className="cms-header">
        <div>
          <h1>Collections</h1>
          <p>Organize entries by knowledge domain, world, or theme.</p>
        </div>
      </div>

      <div className="cms-create">
        <input
          type="text"
          placeholder="Collection name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createCollection()}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className="cms-button" onClick={createCollection} disabled={loading}>
          {loading ? 'Creating...' : 'Create Collection'}
        </button>
      </div>

      <input
        className="cms-search"
        placeholder="Search collections..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="cms-grid">
        {filtered.map(collection => (
          <div key={collection.id} className="cms-card">
            {editing?.id === collection.id ? (
              <div className="cms-card-edit">
                <input
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="cms-edit-input"
                />
                <textarea
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="cms-edit-textarea"
                />
                <input
                  placeholder="Hero image URL (from Supabase Storage)"
                  value={editing.hero_image || ''}
                  onChange={e => setEditing({ ...editing, hero_image: e.target.value })}
                  className="cms-edit-input"
                />
                <div className="cms-edit-actions">
                  <button className="cms-button" onClick={saveEdit} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cms-button-ghost" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {collection.hero_image && (
                  <img
                    src={collection.hero_image}
                    alt={collection.name}
                    className="cms-card-cover"
                  />
                )}
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <span className="cms-slug">/{collection.slug}</span>
                <span className="cms-count">{collection.entry_count || 0} entries</span>
                <div className="cms-card-actions">
                  <button onClick={() => setEditing(collection)}>Edit</button>
                  <button onClick={() => deleteCollection(collection.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}