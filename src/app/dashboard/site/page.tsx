'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

import { PageBlock, BlockType, BlockContent } from '@/lib/blocks/types'
import {
  getBlocksForPage, insertBlock, duplicateBlockRow, deleteBlockRow, saveBlocksBatch,
} from '@/lib/blocks/queries'
import { flushOfflineQueue, getOfflineQueue } from '@/lib/offlineSync'
import { supabase } from '@/lib/supabase'

import BlockList from './BlockList'
import PreviewCanvas, { type Viewport } from './PreviewCanvas'
import SettingsPanel from './SettingsPanel'
import GlobalSettingsPanel from './GlobalSettingsPanel'
import './block-builder.css'
import { saveVersion, listVersions, restoreVersion, type Version } from '@/lib/versionHistory'

type PageTab = 'home' | 'journal' | 'collections' | 'projects' | 'worlds' | 'about' | 'start'

const PAGE_TABS: { id: PageTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'journal', label: 'Journal' },
  { id: 'collections', label: 'Collections' },
  { id: 'projects', label: 'Projects' },
  { id: 'worlds', label: 'Worlds' },
  { id: 'about', label: 'About' },
  { id: 'start', label: 'Start Here' },
]

export default function SiteBuilderPage() {
  const [activeTab, setActiveTab] = useState<PageTab | 'global'>('home')
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [queuedCount, setQueuedCount] = useState(0)

  const [showHistory, setShowHistory] = useState(false)
const [versions, setVersions] = useState<Version[]>([])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  useEffect(() => {
    if (activeTab === 'global') return
    loadBlocks(activeTab)
  }, [activeTab])

  useEffect(() => {
    function refreshQueueCount() {
      setQueuedCount(getOfflineQueue().length)
    }

    function flushQueuedChanges() {
      flushOfflineQueue(supabase).then(refreshQueueCount)
    }

    refreshQueueCount()
    window.addEventListener('online', flushQueuedChanges)
    window.addEventListener('storage', refreshQueueCount)

    return () => {
      window.removeEventListener('online', flushQueuedChanges)
      window.removeEventListener('storage', refreshQueueCount)
    }
  }, [])

  async function loadBlocks(page: PageTab) {
    setLoading(true)
    const data = await getBlocksForPage(page)
    setBlocks(data)
    setSelectedId(data[0]?.id ?? null)
    setLoading(false)
  }

  async function handleAddBlock(type: BlockType) {
    if (activeTab === 'global') return
    const block = await insertBlock(activeTab, type, blocks.length)
    if (block) {
      setBlocks(prev => [...prev, block])
      setSelectedId(block.id)
    }
  }

  async function handleDuplicate(block: PageBlock) {
    const copy = await duplicateBlockRow(block, blocks.length)
    if (!copy) return
    const idx = blocks.findIndex(b => b.id === block.id)
    const next = [...blocks]
    next.splice(idx + 1, 0, copy)
    setBlocks(next)
    setSelectedId(copy.id)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this block?')) return
    if (activeTab === 'global') return
    await deleteBlockRow(id)
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
    setQueuedCount(getOfflineQueue().length)
  }

  function handleContentChange(id: string, content: BlockContent) {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, content } : b)))
    setSaved(false)

  function handleBlockMeta(id: string, updates: Partial<Pick<PageBlock, 'variant' | 'animation' | 'styleOverrides'>>) {
  setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  setSaved(false)
}
  }

  function handleSaveVersion() {
  const v = saveVersion(activeTab as string, blocks)
  setVersions(listVersions(activeTab as string))
  alert(`Saved: ${v.label}`)
}

function handleRestoreVersion(versionId: string) {
  if (!confirm('Restore this version? Current blocks will be overwritten.')) return
  const restored = restoreVersion(activeTab as string, versionId)
  if (restored) {
    setBlocks(restored)
    setShowHistory(false)
    setSaved(false)
  }
}

useEffect(() => {
  if (activeTab !== 'global') {
    setVersions(listVersions(activeTab as string))
  }
}, [activeTab])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setBlocks(prev => {
      const oldIndex = prev.findIndex(b => b.id === active.id)
      const newIndex = prev.findIndex(b => b.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const saveAll = useCallback(async () => {
    setSaving(true)
    await saveBlocksBatch(blocks)
    setSaving(false)
    setSaved(true)
    setQueuedCount(getOfflineQueue().length)
    setTimeout(() => setSaved(false), 2000)
  }, [blocks])

  async function syncNow() {
    setSaving(true)
    await saveBlocksBatch(blocks)
    await flushOfflineQueue(supabase)
    setQueuedCount(getOfflineQueue().length)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null
  const [viewport, setViewport] = useState<Viewport>('desktop')

  return (
    <div className="bb-shell">

      <div className="bb-topbar">
        <div className="bb-topbar-left">
          <h1>Site Builder</h1>
          <div className="bb-page-tabs">
            {PAGE_TABS.map(tab => (
              <button
                key={tab.id}
                className={`bb-page-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <button
              className={`bb-page-tab bb-page-tab--global ${activeTab === 'global' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('global')}
            >
              Global Settings
            </button>
          </div>
        </div>

        {activeTab !== 'global' && (
          <div className="bb-save-cluster">
            {queuedCount > 0 && (
              <span className="bb-sync-pill">{queuedCount} queued</span>
            )}
            <button className="bb-secondary-btn" onClick={syncNow} disabled={saving}>
              Sync
            </button>
            <button className="bb-save-btn" onClick={saveAll} disabled={saving}>
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>

            <button className="bb-secondary-btn" onClick={handleSaveVersion}>
                Save Version
              </button>
              <button
                className="bb-secondary-btn"
                onClick={() => setShowHistory(v => !v)}
              >
                History ({versions.length})
            </button>
          </div>
        )}
      </div>

      {activeTab === 'global' ? (
        <GlobalSettingsPanel />
      ) : loading ? (
        <div className="bb-loading">Loading blocks...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="bb-body">

            <div className="bb-left">
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <BlockList
              blocks={blocks}
              selectedId={selectedId}
              onSelectAction={setSelectedId}
              onAddAction={handleAddBlock}
              onDuplicateAction={handleDuplicate}
              onDeleteAction={handleDelete}
            />

          {showHistory && (
                <div className="bb-history-panel">
                  <div className="bb-history-header">
                    <span>Version History</span>
                    <button onClick={() => setShowHistory(false)}>×</button>
                  </div>
                  {versions.length === 0 ? (
                    <p className="bb-history-empty">No saved versions yet.</p>
                  ) : (
        <div className="bb-history-list">
          {versions.map(v => (
            <div key={v.id} className="bb-history-item">
              <div>
                <strong>{v.label}</strong>
                <span>{new Date(v.savedAt).toLocaleString()}</span>
              </div>
              <button onClick={() => handleRestoreVersion(v.id)}>Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
              </SortableContext>
            </div>

            <div className="bb-center">
              <PreviewCanvas
                blocks={blocks}
                selectedId={selectedId}
                onSelectAction={setSelectedId}
                viewport={viewport}
                onViewportChangeAction={setViewport}
            />            
</div>

            <div className="bb-right">
              {selectedBlock ? (
                <SettingsPanel
                  block={selectedBlock}
                  onChangeAction={content => handleContentChange(selectedBlock.id, content)}
                />
              ) : (
                <div className="bb-right-empty">
                  <p>Select a block to edit its settings.</p>
                </div>
              )}
            </div>

          </div>
        </DndContext>
      )}
    </div>
  )
}
