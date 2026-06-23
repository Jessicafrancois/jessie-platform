'use client'
// ─────────────────────────────────────────────────────────────────────────────
// TiptapEditor.tsx — Tiptap 3.27.1 final clean version
//
// WHAT CHANGED FROM PREVIOUS VERSION
// ────────────────────────────────────
// 1. BubbleMenu and FloatingMenu are now their own components
//    (EditorBubbleMenu / EditorFloatingMenu) imported from separate files.
//    They must NOT be imported from @tiptap/react or @tiptap/extension-*
//    directly in this file anymore.
//
// 2. immediatelyRender removed entirely — was causing the
//    "Type 'true' is not assignable to type 'false'" error.
//
// 3. setContent(html, false) → setContent(html, { emitUpdate: false })
//    Boolean second argument was removed in 3.27.
//
// 4. Image inserted via insertContent({type:'image',...}) not setImage()
//
// PACKAGES REQUIRED (run once if not already installed)
// ──────────────────────────────────────────────────────
// npm install @tiptap/extension-character-count@3.27.1
//             @tiptap/extension-image@3.27.1
//             @tiptap/extension-table@3.27.1
//             @tiptap/extension-table-row@3.27.1
//             @tiptap/extension-table-cell@3.27.1
//             @tiptap/extension-table-header@3.27.1
//             @tiptap/extension-bubble-menu@3.27.1
//             @tiptap/extension-floating-menu@3.27.1
//             @floating-ui/dom@^1.6.0
// ─────────────────────────────────────────────────────────────────────────────

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useState, useCallback, useRef } from 'react'

import StarterKit     from '@tiptap/starter-kit'
import Underline      from '@tiptap/extension-underline'
import TextAlign      from '@tiptap/extension-text-align'
import { TextStyle }  from '@tiptap/extension-text-style'
import Color          from '@tiptap/extension-color'
import Highlight      from '@tiptap/extension-highlight'
import Placeholder    from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link           from '@tiptap/extension-link'
import Image          from '@tiptap/extension-image'
import Youtube        from '@tiptap/extension-youtube'
import TaskList       from '@tiptap/extension-task-list'
import TaskItem       from '@tiptap/extension-task-item'
import { Table }      from '@tiptap/extension-table'
import TableRow       from '@tiptap/extension-table-row'
import TableCell      from '@tiptap/extension-table-cell'
import TableHeader    from '@tiptap/extension-table-header'

import { supabase }          from '@/lib/supabase'
import {
  flushOfflineQueue,
  readLocalValue,
  syncOrQueue,
  writeLocalValue,
} from '@/lib/offlineSync'
import Toolbar               from '../Toolbar'
import Topbar                from '../../components/Topbar'
import EditorMetaBar         from '../EditorMetaBar'
import EditorHeader          from '../EditorHeader'
import CoverSelector         from '../CoverSelector'
import EditorBubbleMenu      from './EditorBubbleMenu'
import EditorFloatingMenu    from './EditorFloatingMenu'
import { Typography }        from '../extensions/Typography'

import '../editor.css'

// ── Types ─────────────────────────────────────────────────────────────────────

type EditorViewMode = 'editor' | 'review' | 'preview' | 'create' | 'edit' | 'presentation' | 'focus'

type TiptapEditorProps = {
  initialData?: {
    id?: string
    title?: string
    intro?: string
    content?: object
    collection_id?: string
    series_id?: string
    type?: string
    status?: string
    featured?: boolean
    tags?: string[]
    cover_image?: string
  }
  viewMode?: EditorViewMode
}

const TARGET_WORDS = 1500

type EntryPayload = {
  id: string
  title: string
  slug: string
  intro: string
  cover_image: string | null
  content: object
  collection_id: string | null
  series_id: string | null
  type: string
  featured: boolean
  tags: string[]
  status: string
  published: boolean
  published_at?: string
  updated_at: string
}

const ENTRY_DRAFT_KEY = 'jessie:entry-draft'
const EDITOR_PREFS_KEY = 'jessie:editor-preferences'

type SearchMatch = {
  from: number
  to: number
}

type EditorPreferences = {
  theme: string
  viewMode: EditorViewMode
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TiptapEditor({
  initialData,
  viewMode = 'editor',
}: TiptapEditorProps) {

  // ── Meta state ───────────────────────────────────────────────────────────
  const [entryId,    setEntryId]    = useState<string | null>(initialData?.id ?? null)
  const [title,      setTitle]      = useState(initialData?.title ?? '')
  const [excerpt,    setExcerpt]    = useState(initialData?.intro ?? '')
  const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? '')
  const [collection, setCollection] = useState(initialData?.collection_id ?? '')
  const [series,     setSeries]     = useState(initialData?.series_id ?? '')
  const [entryType,  setEntryType]  = useState(initialData?.type ?? 'Essay')
  const [status,     setStatus]     = useState(initialData?.status ?? 'Draft')
  const [featured,   setFeatured]   = useState(initialData?.featured ?? false)
  const [tags,       setTags]       = useState<string[]>(initialData?.tags ?? [])
  const [slug,       setSlug]       = useState('')

  const [collections, setCollections] = useState<{ id: string; name: string }[]>([])
  const [seriesList,  setSeriesList]  = useState<{ id: string; name: string }[]>([])

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty' | 'error'>('saved')
  const [publishing, setPublishing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [theme, setTheme] = useState(() =>
    readLocalValue<EditorPreferences>(EDITOR_PREFS_KEY, { theme: 'system', viewMode }).theme,
  )
  const [editorViewMode, setEditorViewMode] = useState<EditorViewMode>(() =>
    readLocalValue<EditorPreferences>(EDITOR_PREFS_KEY, { theme: 'system', viewMode }).viewMode,
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([])
  const [activeSearchIndex, setActiveSearchIndex] = useState(0)
  const [searchVersion, setSearchVersion] = useState(0)

  const dirtyRef     = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    writeLocalValue(EDITOR_PREFS_KEY, { theme, viewMode: editorViewMode })
  }, [theme, editorViewMode])

  useEffect(() => {
    function flushQueuedChanges() {
      flushOfflineQueue(supabase)
    }

    flushOfflineQueue(supabase)
    window.addEventListener('online', flushQueuedChanges)

    return () => {
      window.removeEventListener('online', flushQueuedChanges)
    }
  }, [])

  // ── Editor setup ─────────────────────────────────────────────────────────

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: { color: '#d8bc6e', width: 2 },
      }),

      Underline,
      TextStyle,
      Typography,
      Color,

      Highlight.configure({ multicolor: true }),

      TextAlign.configure({ types: ['heading', 'paragraph'] }),

      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === 'heading'
            ? 'Heading…'
            : "Write something, or type '/' for commands…",
      }),

      CharacterCount,

      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),

      Image.configure({ allowBase64: true }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),

      TaskList,
      TaskItem.configure({ nested: true }),

      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],

    content:  initialData?.content ?? '',
    editable: editorViewMode !== 'review' && editorViewMode !== 'preview',

    onUpdate: () => {
      dirtyRef.current = true
      setSaveStatus('dirty')
      scheduleSave()
    },
  })

  const collectSearchMatches = useCallback(
    (query: string) => {
      if (!editor) return []
      const needle = query.trim().toLowerCase()
      if (!needle) return []

      const matches: SearchMatch[] = []
      editor.state.doc.descendants((node, pos) => {
        if (!node.isText || !node.text) return
        const haystack = node.text.toLowerCase()
        let index = haystack.indexOf(needle)

        while (index !== -1) {
          matches.push({
            from: pos + index,
            to: pos + index + needle.length,
          })
          index = haystack.indexOf(needle, index + Math.max(needle.length, 1))
        }
      })

      return matches
    },
    [editor],
  )

  const goToSearchMatch = useCallback(
    (index: number, matches = searchMatches) => {
      if (!editor || matches.length === 0) return
      const nextIndex = ((index % matches.length) + matches.length) % matches.length
      const match = matches[nextIndex]

      setActiveSearchIndex(nextIndex)
      editor.chain().focus().setTextSelection(match).scrollIntoView().run()
    },
    [editor, searchMatches],
  )

  const updateSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      const matches = collectSearchMatches(query)
      setSearchMatches(matches)
      setActiveSearchIndex(0)
      if (matches.length > 0) goToSearchMatch(0, matches)
    },
    [collectSearchMatches, goToSearchMatch],
  )

  useEffect(() => {
    if (!editor) return

    function handleUpdate() {
      setSearchVersion(version => version + 1)
    }

    editor.on('update', handleUpdate)
    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor])

  useEffect(() => {
    if (!searchQuery) {
      setSearchMatches([])
      setActiveSearchIndex(0)
      return
    }

    const matches = collectSearchMatches(searchQuery)
    setSearchMatches(matches)
    setActiveSearchIndex(current => {
      if (matches.length === 0) return 0
      return Math.min(current, matches.length - 1)
    })
  }, [collectSearchMatches, searchQuery, searchVersion])

  // ── Auto-save ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (initialData || !editor) return

    const localDraft = readLocalValue<Partial<EntryPayload> | null>(ENTRY_DRAFT_KEY, null)
    if (!localDraft) return

    setEntryId(localDraft.id ?? null)
    setTitle(localDraft.title ?? '')
    setExcerpt(localDraft.intro ?? '')
    setCoverImage(localDraft.cover_image ?? '')
    setCollection(localDraft.collection_id ?? '')
    setSeries(localDraft.series_id ?? '')
    setEntryType(localDraft.type ?? 'Essay')
    setStatus(localDraft.status ?? 'Draft')
    setFeatured(localDraft.featured ?? false)
    setTags(localDraft.tags ?? [])
    setSlug(localDraft.slug ?? '')

    if (localDraft.content) {
      editor.commands.setContent(localDraft.content, { emitUpdate: false })
    }
  }, [editor, initialData])

  function scheduleSave() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      if (dirtyRef.current) saveDraft(true)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (dirtyRef.current) saveDraft(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Slug ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    setSlug(
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
    )
  }, [title])

  // ── editable sync ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!editor) return
    editor.setEditable(editorViewMode !== 'review' && editorViewMode !== 'preview')
  }, [editor, editorViewMode])

  // ── Load metadata ─────────────────────────────────────────────────────────

  useEffect(() => {
    async function loadMeta() {
      const [cRes, sRes] = await Promise.all([
        supabase.from('collections').select('id, name').order('name'),
        supabase.from('series').select('id, name').order('name'),
      ])
      setCollections(cRes.data ?? [])
      setSeriesList(sRes.data ?? [])
    }
    loadMeta()
  }, [])

  // ── Build payload ─────────────────────────────────────────────────────────

  function buildPayload(id: string, publishOverride?: boolean): EntryPayload {
    return {
      id,
      title,
      slug,
      intro:         excerpt,
      cover_image:   coverImage || null,
      content:       editor?.getJSON() ?? {},
      collection_id: collection || null,
      series_id:     series || null,
      type:          entryType,
      featured,
      tags,
      status:        publishOverride ? 'Published' : status,
      published:     publishOverride ?? (status === 'Published'),
      ...(publishOverride ? { published_at: new Date().toISOString() } : {}),
      updated_at:    new Date().toISOString(),
    }
  }

  // ── Save draft ─────────────────────────────────────────────────────────────

  const saveDraft = useCallback(
    async (silent = false) => {
      if (!editor) return
      if (!title.trim()) {
        if (!silent) alert('Please add a title before saving.')
        return
      }

      setSaveStatus('saving')

      const stableId = entryId ?? crypto.randomUUID()
      if (!entryId) setEntryId(stableId)

      const payload = buildPayload(stableId)
      writeLocalValue(ENTRY_DRAFT_KEY, payload)

      const { queued, error } = await syncOrQueue(supabase, {
        table: 'entries',
        operation: 'upsert',
        payload,
      })

      if (error) {
        console.error('Save error:', error)
        if (!queued) setSaveStatus('error')
        if (!silent && !queued) alert(`Error: ${String(error)}`)
        return
      }

      if (!queued) {
        await syncOrQueue(supabase, {
          table: 'entry_revisions',
          operation: 'insert',
          payload: {
          entry_id: stableId,
          title,
          intro:    excerpt,
          content:  editor.getJSON(),
          },
        })
      }

      dirtyRef.current = false
      setSaveStatus('saved')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, title, slug, excerpt, coverImage, collection, series, entryType, featured, tags, status, entryId],
  )

  // ── Publish ───────────────────────────────────────────────────────────────

  async function publishEntry() {
    if (!editor || !title.trim()) {
      alert('Please add a title before publishing.')
      return
    }
    setPublishing(true)

    const stableId = entryId ?? crypto.randomUUID()
    if (!entryId) setEntryId(stableId)

    const payload = buildPayload(stableId, true)
    writeLocalValue(ENTRY_DRAFT_KEY, payload)

    const { queued, error } = await syncOrQueue(supabase, {
      table: 'entries',
      operation: 'upsert',
      payload,
    })

    if (error) {
      console.error('Publish error:', error)
      if (!queued) alert(`Error: ${String(error)}`)
      setPublishing(false)
      return
    }

    setStatus('Published')
    dirtyRef.current = false
    setSaveStatus('saved')
    setPublishing(false)
    alert(queued ? 'Entry saved locally and will publish when back online.' : 'Entry published!')
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  const wordCount   = editor?.storage.characterCount?.words() ?? 0
  const progress    = Math.min(100, (wordCount / TARGET_WORDS) * 100)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const saveLabel =
    saveStatus === 'saving' ? 'Saving…'        :
    saveStatus === 'dirty'  ? 'Unsaved'         :
    saveStatus === 'error'  ? 'Error saving'    :
                              'Saved'

  // ── Drag-and-drop block reorder ───────────────────────────────────────────

  useEffect(() => {
    if (!editor) return
    const editorEl = editor.view.dom as HTMLElement
    let dragSrcEl: HTMLElement | null = null

    function getBlockEl(e: DragEvent): HTMLElement | null {
      let el = e.target as HTMLElement | null
      while (el && el.parentElement !== editorEl) el = el.parentElement
      return el?.parentElement === editorEl ? el : null
    }

    function onDragStart(e: DragEvent) {
      const block = getBlockEl(e)
      if (!block) return
      dragSrcEl = block
      block.classList.add('is-dragging')
      setIsDragging(true)
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', block.outerHTML)
      }
    }

    function onDragOver(e: DragEvent) {
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
      const block = getBlockEl(e)
      editorEl.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'))
      if (block && block !== dragSrcEl) block.classList.add('drop-target')
    }

    function onDrop(e: DragEvent) {
      e.preventDefault()
      const block = getBlockEl(e)
      editorEl.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'))
      if (!block || !dragSrcEl || block === dragSrcEl) return

      const rect = block.getBoundingClientRect()
      const insertBefore = e.clientY < rect.top + rect.height / 2

      insertBefore
        ? editorEl.insertBefore(dragSrcEl, block)
        : editorEl.insertBefore(dragSrcEl, block.nextSibling)

      dragSrcEl.classList.remove('is-dragging')
      dragSrcEl = null
      setIsDragging(false)

      // ── FIX: second arg is now an options object, not a boolean ───────────
      editor.commands.setContent(editorEl.innerHTML, { emitUpdate: false })

      dirtyRef.current = true
      setSaveStatus('dirty')
      scheduleSave()
    }

    function onDragEnd() {
      editorEl.querySelectorAll('.is-dragging, .drop-target').forEach(el => {
        el.classList.remove('is-dragging', 'drop-target')
      })
      dragSrcEl = null
      setIsDragging(false)
    }

    function attachDraggable() {
      Array.from(editorEl.children).forEach(child => {
        ;(child as HTMLElement).setAttribute('draggable', 'true')
        ;(child as HTMLElement).classList.add('editor-block')
      })
    }

    attachDraggable()
    const observer = new MutationObserver(attachDraggable)
    observer.observe(editorEl, { childList: true })

    editorEl.addEventListener('dragstart', onDragStart)
    editorEl.addEventListener('dragover',  onDragOver)
    editorEl.addEventListener('drop',      onDrop)
    editorEl.addEventListener('dragend',   onDragEnd)

    return () => {
      observer.disconnect()
      editorEl.removeEventListener('dragstart', onDragStart)
      editorEl.removeEventListener('dragover',  onDragOver)
      editorEl.removeEventListener('drop',      onDrop)
      editorEl.removeEventListener('dragend',   onDragEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  // ── Render ────────────────────────────────────────────────────────────────

    return (

      <>
      <Topbar
        saveDraftAction={() => saveDraft(false)}
        publishEntryAction={publishEntry}
        entryId={entryId ?? undefined}
        editor={editor}
        theme={theme}
        setThemeAction={setTheme}
        viewMode={editorViewMode}
        setViewModeAction={(value) => setEditorViewMode(value as EditorViewMode)}
        saveLabel={saveLabel}
        publishing={publishing}
        searchQuery={searchQuery}
        searchMatchCount={searchMatches.length}
        activeSearchIndex={activeSearchIndex}
        onSearchChangeAction={updateSearch}
        onSearchNextAction={() => goToSearchMatch(activeSearchIndex + 1)}
        onSearchPreviousAction={() => goToSearchMatch(activeSearchIndex - 1)}
      />

      <div className="editor-workspace">

      <div className="editor-content-column">

      <div className="editor-document">

      <EditorMetaBar
        slug={slug}
        setSlugAction={setSlug}
        collection={collection}
        setCollectionAction={setCollection}
        collections={collections}
        seriesList={seriesList}
        series={series}
        setSeriesAction={setSeries}
        entryType={entryType}
        setEntryTypeAction={setEntryType}
        status={status}
        setStatusAction={setStatus}
        featured={featured}
        setFeaturedAction={setFeatured}
        tags={tags}
        setTagsAction={setTags}
      />

     <CoverSelector
  coverImage={coverImage}
  setCoverImageAction={
    setCoverImage
  }
/>
      <Toolbar
        editor={editor}
      />

      <EditorHeader
        title={title}
        setTitleAction={setTitle}
        excerpt={excerpt}
        setExcerptAction={setExcerpt}
        wordCount={wordCount}
        readingTime={readingTime}
        progress={progress}
        status={status}
      />

      <EditorContent
        editor={editor}
        className="editor-content"
      />

    </div>

  </div>

</div>

</>
)
}
