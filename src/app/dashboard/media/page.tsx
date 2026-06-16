'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import './media.css'

type MediaAsset = {
  id: string
  filename: string
  file_url: string
  media_type: string
  folder: string
  size_bytes: number
  is_published: boolean
  created_at: string
  alt_text?: string
}

type FilterType = 'all' | 'image' | 'video' | 'audio' | 'document'
type ViewMode = 'grid' | 'list'
type SortOrder = 'newest' | 'oldest' | 'name'

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  async function loadAssets() {
    setLoading(true)
    let query = supabase.from('media_assets').select('*')

    if (filterType !== 'all') {
      query = query.ilike('media_type', `${filterType}%`)
    }

    if (sortOrder === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else if (sortOrder === 'oldest') {
      query = query.order('created_at', { ascending: true })
    } else {
      query = query.order('filename', { ascending: true })
    }

    const { data } = await query
    setAssets(data || [])
    setLoading(false)
  }

  useEffect(() => { loadAssets() }, [filterType, sortOrder])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `media/${filename}`

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(path, file)

      if (uploadError) {
        console.error(uploadError)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(path)

      await supabase.from('media_assets').insert({
        filename: file.name,
        file_url: publicUrl,
        media_type: file.type,
        folder: 'media',
        size_bytes: file.size,
        is_published: false,
      })
    }

    setUploading(false)
    loadAssets()
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm('Delete this asset permanently?')) return

    // Extract path from URL
    const path = fileUrl.split('/assets/')[1]
    if (path) {
      await supabase.storage.from('assets').remove([path])
    }
    await supabase.from('media_assets').delete().eq('id', id)
    setActiveMenu(null)
    loadAssets()
  }

  async function handleArchive(id: string) {
    await supabase
      .from('media_assets')
      .update({ folder: 'archived' })
      .eq('id', id)
    setActiveMenu(null)
    loadAssets()
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.length} assets?`)) return
    for (const id of selectedIds) {
      const asset = assets.find(a => a.id === id)
      if (asset) {
        const path = asset.file_url.split('/assets/')[1]
        if (path) await supabase.storage.from('assets').remove([path])
        await supabase.from('media_assets').delete().eq('id', id)
      }
    }
    setSelectedIds([])
    loadAssets()
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function formatBytes(bytes: number) {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const filtered = assets.filter(asset =>
    asset.filename?.toLowerCase().includes(search.toLowerCase())
  )

  const sidebarFilters: { label: string; value: FilterType }[] = [
    { label: 'All Media', value: 'all' },
    { label: 'Images', value: 'image' },
    { label: 'Videos', value: 'video' },
    { label: 'Audio', value: 'audio' },
    { label: 'Documents', value: 'document' },
  ]

  return (
    <div className="media-page">

      {/* SIDEBAR */}
      <aside className="media-sidebar">
        <h3 className="media-sidebar-title">Library</h3>
        <nav className="media-sidebar-nav">
          {sidebarFilters.map(f => (
            <button
              key={f.value}
              className={`media-sidebar-btn ${filterType === f.value ? 'is-active' : ''}`}
              onClick={() => setFilterType(f.value)}
            >
              {f.label}
            </button>
          ))}
          <div className="media-sidebar-divider" />
          <button
            className={`media-sidebar-btn ${filterType === 'all' ? '' : ''}`}
            onClick={() => {
              setFilterType('all')
              // Will need archive filter — future state
            }}
          >
            Archived
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="media-content">

        {/* HEADER */}
        <div className="media-header">
          <div className="media-header-text">
            <h1>Media Library</h1>
            <p>
              Images, video, audio, and documents — stored and tracked
              across every world, project, and entry.
            </p>
          </div>
          <label className="media-upload-button">
            {uploading ? 'Uploading...' : '+ Upload'}
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* TOOLBAR */}
        <div className="media-toolbar">
          <div className="media-view-toggle">
            <button
              className={`media-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`media-view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>

          <input
            className="media-search"
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="media-sort"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A–Z</option>
          </select>

          {selectedIds.length > 0 && (
            <button className="media-bulk-delete" onClick={handleBulkDelete}>
              Delete {selectedIds.length} selected
            </button>
          )}
        </div>

        {/* GRID / LIST */}
        {loading ? (
          <div className="media-loading">Loading assets...</div>
        ) : filtered.length === 0 ? (
          <div className="media-empty">
            <h3>No media found</h3>
            <p>Upload your first asset to start building your library.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="media-grid">
            {filtered.map(asset => (
              <div
                key={asset.id}
                className={`media-card ${selectedIds.includes(asset.id) ? 'is-selected' : ''}`}
              >
                <div className="media-card-select">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(asset.id)}
                    onChange={() => toggleSelect(asset.id)}
                  />
                </div>

                <div
                  className="media-card-actions"
                  style={{ position: 'relative' }}
                >
                  <button
                    className="media-menu-button"
                    onClick={() =>
                      setActiveMenu(activeMenu === asset.id ? null : asset.id)
                    }
                  >
                    ⋮
                  </button>
                  {activeMenu === asset.id && (
                    <div className="media-menu-dropdown">
                      <button onClick={() => handleArchive(asset.id)}>
                        Archive
                      </button>
                      <button
                        className="media-menu-delete"
                        onClick={() => handleDelete(asset.id, asset.file_url)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="media-preview">
                  {asset.media_type?.startsWith('image') ? (
                    <img src={asset.file_url} alt={asset.alt_text || asset.filename} />
                  ) : asset.media_type?.startsWith('video') ? (
                    <div className="media-preview-icon">▶</div>
                  ) : (
                    <div className="media-preview-icon">📄</div>
                  )}
                </div>

                <div className="media-info">
                  <h4 className="media-filename">{asset.filename}</h4>
                  <p className="media-meta">
                    {asset.media_type?.split('/')[0]} · {formatBytes(asset.size_bytes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="media-list">
            <div className="media-list-header">
              <span>Name</span>
              <span>Type</span>
              <span>Size</span>
              <span>Uploaded</span>
              <span></span>
            </div>
            {filtered.map(asset => (
              <div key={asset.id} className="media-list-row">
                <div className="media-list-name">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(asset.id)}
                    onChange={() => toggleSelect(asset.id)}
                  />
                  {asset.media_type?.startsWith('image') && (
                    <img
                      src={asset.file_url}
                      alt=""
                      className="media-list-thumb"
                    />
                  )}
                  <span>{asset.filename}</span>
                </div>
                <span>{asset.media_type?.split('/')[0] || '—'}</span>
                <span>{formatBytes(asset.size_bytes)}</span>
                <span>
                  {new Date(asset.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <div className="media-list-actions">
                  <button onClick={() => handleArchive(asset.id)}>Archive</button>
                  <button
                    className="media-list-delete"
                    onClick={() => handleDelete(asset.id, asset.file_url)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}