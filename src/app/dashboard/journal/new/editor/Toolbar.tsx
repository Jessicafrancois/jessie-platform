'use client'

import { useEffect, useState } from 'react'

import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Eraser,
  Image,
  Video,
  StickyNote,
  Heading1,
  Heading2,
} from 'lucide-react'

import { getFonts } from '@/lib/getFonts'
import { loadFont } from '@/lib/loadFonts'

type ToolbarProps = {
  editor: any
}

export default function Toolbar({
  editor,
}: ToolbarProps) {

  const [fonts, setFonts] = useState<
    {
      name: string
      file: string
    }[]
  >([])

  const [selectedFont, setSelectedFont] =
    useState('')

  useEffect(() => {

    async function fetchFonts() {

      const fontList =
        await getFonts()

      setFonts(fontList)

      if (fontList.length > 0) {

        setSelectedFont(
          fontList[0].file
        )

      }

    }

    fetchFonts()

  }, [])

  if (!editor) return null

  return (

    <div className="editor-toolbar">

      {/* Undo / Redo */}

      <div className="toolbar-group">

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          <Undo2 size={16} />
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          <Redo2 size={16} />
        </button>

      </div>

      {/* Font Controls */}

      <div className="toolbar-group toolbar-fonts">

        <div className="toolbar-group toolbar-fonts">
<select
  className="toolbar-font-picker"
  value={selectedFont}
  onChange={async (e) => {

    const fontFile =
      e.target.value

    setSelectedFont(
      fontFile
    )

    const fontName =
      await loadFont(
        fontFile
      )

    editor
      .chain()
      .focus()
      .setMark(
        'textStyle',
        {
          fontFamily:
            fontName,
        }
      )
      .run()

  }}
>

  {fonts.map(font => (

    <option
      key={font.file}
      value={font.file}
      style={{
        fontFamily:
          font.name,
      }}
    >
      {font.name}
    </option>

  ))}

</select>

  <div className="toolbar-size-wrapper">

    <button
      type="button"
      className="size-stepper"
    >
      −
    </button>

    <input
      type="text"
      defaultValue="16"
      className="toolbar-size-input"
    />

    <button
      type="button"
      className="size-stepper"
    >
      +
    </button>

  </div>

</div>

      </div>


      {/* Text Formatting */}

      <div className="toolbar-group">

        <button
          className={
            editor.isActive('bold')
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          <Bold size={16} />
        </button>

        <button
          className={
            editor.isActive('italic')
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <Italic size={16} />
        </button>

        <button
          className={
            editor.isActive('underline')
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
        >
          <UnderlineIcon size={16} />
        </button>

      </div>

      {/* Colors */}

      <div className="toolbar-group">

        <button
          type="button"
          className="toolbar-color-button"
          title="Text Color"
        >
          <span
            className="toolbar-color-preview"
            style={{
              background: '#000000',
            }}
          />
        </button>

        <button
          type="button"
          className="toolbar-color-button"
          title="Highlight"
        >
          <span
            className="toolbar-color-preview"
            style={{
              background: '#fff59d',
            }}
          />
        </button>

      </div>

      {/* Headings */}

      <div className="toolbar-group">

        <button
          className={
            editor.isActive(
              'heading',
              { level: 1 }
            )
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          <Heading1 size={16} />
        </button>

        <button
          className={
            editor.isActive(
              'heading',
              { level: 2 }
            )
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 size={16} />
        </button>

      </div>

      {/* Lists */}

      <div className="toolbar-group">

        <button
          className={
            editor.isActive('bulletList')
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          <List size={16} />
        </button>

        <button
          className={
            editor.isActive('orderedList')
              ? 'toolbar-button active'
              : 'toolbar-button'
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          <ListOrdered size={16} />
        </button>

      </div>

      {/* Alignment */}

      <div className="toolbar-group">

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().setTextAlign('left').run()
          }
        >
          <AlignLeft size={16} />
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().setTextAlign('center').run()
          }
        >
          <AlignCenter size={16} />
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().setTextAlign('right').run()
          }
        >
          <AlignRight size={16} />
        </button>

      </div>

      {/* Quote / Divider */}

      <div className="toolbar-group">

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote size={16} />
        </button>

        <button
          className="toolbar-button"
          onClick={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
        >
          <Minus size={16} />
        </button>

      </div>

      {/* Media */}

      <div className="toolbar-group">

        <button className="toolbar-button">
          <Image size={16} />
        </button>

        <button className="toolbar-button">
          <Video size={16} />
        </button>

        <button className="toolbar-button">
          <StickyNote size={16} />
        </button>

      </div>

      {/* Clear Formatting */}

      <div className="toolbar-group">

        <button
          className="toolbar-button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetAllMarks()
              .clearNodes()
              .run()
          }
        >
          <Eraser size={16} />
        </button>

      </div>

    </div>

  )
}