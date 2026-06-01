
'use client'

import { useState } from 'react'



import {
  EditorContent,
  useEditor,
} from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Toolbar from './Toolbar'

import {
  supabase,
} from '../../../../../lib/supabase'

export default function TiptapEditor() {

  const [title, setTitle] =
    useState('')

  const [excerpt, setExcerpt] =
    useState('')

  const [coverUrl, setCoverUrl] =
    useState('')

  const [uploading, setUploading] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const editor = useEditor({

    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ]

    ,
    content: '',

    immediatelyRender: false,

  })

  async function saveDraft() {

    if (!editor) return

    setSaving(true)

    const slug = title
      .toLowerCase()
      .replaceAll(' ', '-')

    const { error } =
      await supabase
        .from('essays')
        .insert({

          title,

          intro: excerpt,

          image: coverUrl,

          slug,

          content: [
            {
              type: 'tiptap',
              content:
                editor.getHTML(),
            },
          ],

        })

    setSaving(false)

    if (error) {

      console.error(error)

      alert(
        'Failed to save'
      )

      return
    }

    alert(
      'Draft saved'
    )
  }

  if (!editor) {
    return null
  }
async function uploadCover(
  file: File
) {

  setUploading(true)

  const fileName =
    `${Date.now()}-${file.name}`

  const { error } =
    await supabase.storage
      .from('essay-covers')
      .upload(
        fileName,
        file
      )

  if (error) {

    console.error(error)

    alert(
      'Upload failed'
    )

    setUploading(false)

    return
  }

  const {
    data,
  } = supabase.storage
    .from('essay-covers')
    .getPublicUrl(
      fileName
    )

  setCoverUrl(
    data.publicUrl
  )

  setUploading(false)
}

  return (
    <div className="editor-canvas">

      {/* COVER IMAGE */}

      <div
        className="cover-image-section"
      >

        <input
          className="cover-image-url"
          type="text"
          placeholder="Cover Image URL"
          value={coverUrl}
          onChange={(e) =>
            setCoverUrl(
              e.target.value
            )
          }
        />

       <input
  type="file"
  accept="image/*"
  onChange={(e) => {

    const file =
      e.target.files?.[0]

    if (!file) return

    uploadCover(file)

  }}
/>

{uploading && (
  <p>
    Uploading...
  </p>
)}


      </div>

      {/* COVER PREVIEW */}

      {coverUrl && (

        <img
          src={coverUrl}
          alt="Cover"
          style={{
            width: '100%',
            borderRadius: '12px',
            marginBottom: '2rem',
          }}
        />

      )}

      {/* TITLE */}

      <input
        className="title-input"
        type="text"
        placeholder="Untitled"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      {/* EXCERPT */}

      <textarea
        className="block-input"
        placeholder="Short description..."
        value={excerpt}
        onChange={(e) =>
          setExcerpt(
            e.target.value
          )
        }
      />

      {/* ACTIONS */}

      <div
        className="editor-actions"
      >

        <button
          onClick={saveDraft}
        >
          {saving
            ? 'Saving...'
            : 'Save Draft'}
        </button>

      </div>

      {/* TOOLBAR */}

      <Toolbar
        editor={editor}
      />

      {/* EDITOR */}

      <div
        className="journal-editor"
      >

        <EditorContent
          editor={editor}
        />

      </div>

    </div>
  )
}

