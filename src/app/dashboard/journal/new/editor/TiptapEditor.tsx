'use client'

import { useEditor, EditorContent } from '@tiptap/react'

import { useState,useEffect,} from 'react'

import StarterKit from '@tiptap/starter-kit'

import EditorMetaBar from './EditorMetaBar'

import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'

import CoverSelector from './CoverSelector'

import Placeholder from '@tiptap/extension-placeholder'

import EditorHeader from './EditorHeader'

import { supabase } from '@/lib/supabase'
import Toolbar from './Toolbar'


type TiptapEditorProps = {
  initialData?: any
  viewMode?: string
}

export default function TiptapEditor({
  initialData,
  viewMode = 'editor',
}: TiptapEditorProps) {


const editor = useEditor({

  extensions: [
    StarterKit,

    Underline,

    TextStyle,

    Color,

    Highlight.configure({
      multicolor: true,
    }),

    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),

    Placeholder.configure({
      placeholder: 'Start writing...',
    }),
  ],

content:
  initialData?.content || '',

  immediatelyRender: false,
})

const [collection, setCollection] =
  useState('Psychology')

  const [series, setSeries] =
  useState('')

const [collections, setCollections] =
  useState<any[]>([])

const [seriesList, setSeriesList] =
  useState<any[]>([])

  const [entryType, setEntryType] =
  useState('Essay')

  const [status, setStatus] =
  useState('Draft')

const [featured, setFeatured] =
  useState(false)

const [title, setTitle] =
  useState(
    initialData?.title || ''
  )

const [excerpt, setExcerpt] =
  useState(
    initialData?.intro || ''
  )

const targetWords = 1500

const [coverImage, setCoverImage] =
  useState('')

const [entryId, setEntryId] =
  useState(
    initialData?.id || null
  )

  useEffect(() => {

  if (!editor) return

  editor.setEditable(
    viewMode !== 'review'
  )

}, [editor, viewMode])

async function saveDraft() {

if (!editor) return

const draft = {
  title,
  slug,
  intro: excerpt,
  image: coverImage,
  content: editor.getJSON(),
  collection,
  type: entryType,
  featured,
  status: 'Draft',
  published: false,
  tags,
  updated_at: new Date().toISOString(),
}

const payload = {
  id: entryId || undefined,

  title,
  slug,
  intro: excerpt,

  content: editor.getJSON(),

  collection_id:
    collection || null,

  series_id:
    series || null,

  type: entryType,

  featured,

  tags,

  status: 'Draft',

  published: false,

  updated_at:
    new Date().toISOString(),
}

const {
data,
error,
} = await supabase


.from('entries')

.upsert(payload)

.select()


if (error) {
console.error(error)
return
}

if (data?.[0]?.id) {
setEntryId(data[0].id)
}

if (!data?.[0]?.id) {
  return
}

await supabase
  .from('entry_revisions')
  .insert({
    entry_id: data[0].id,
    title,
    intro: excerpt,
    content: editor.getJSON(),

  })

alert('Draft saved')
}

async function publishEntry() {

if (!editor) return

const payload = {


id: entryId || undefined,

title,

slug,

intro: excerpt,

content:
  editor.getJSON(),

collection,

type: entryType,

featured,

status: 'Published',

published: true,

tags,

published_at:
  new Date()
    .toISOString(),

updated_at:
  new Date()
    .toISOString(),

}

const {
data,
error,
} = await supabase


.from('entries')

.upsert(payload)

.select()


if (error) {
console.error(error)
return
}

if (data?.[0]?.id) {
setEntryId(data[0].id)
}

alert('Entry published')
}


const wordCount =
  editor
    ?.getText()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length || 0

const progress =
  Math.min(
    100,
    (wordCount / targetWords) * 100
  )

const readingTime =
  Math.max(
    1,
    Math.ceil(wordCount / 200)
  )


const [tags, setTags] = useState<string[]>([])
const [slug, setSlug] = useState('')

useEffect(() => {
  if (!editor) return

  editor.setEditable(
    viewMode !== 'review'
  )
}, [editor, viewMode])

useEffect(() => {
  const generatedSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  setSlug(generatedSlug)
}, [title])

useEffect(() => {
  loadMetaData()
}, [])

async function loadMetaData() {
  const { data: collectionsData } =
    await supabase
      .from('collections')
      .select('id,name')
      .order('name')

  const { data: seriesData } =
    await supabase
      .from('series')
      .select('id,name')
      .order('name')

  setCollections(
    collectionsData || []
  )

  setSeriesList(
    seriesData || []
  )
}

    return (

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

)
}