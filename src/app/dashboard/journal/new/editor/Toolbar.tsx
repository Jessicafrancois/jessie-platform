'use client'

import type { Editor } from '@tiptap/react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table2,
  Underline as UnderlineIcon,
  Undo2,
  Video,
} from 'lucide-react'

import { getFonts } from '@/lib/getFonts'
import { loadFont } from '@/lib/loadFonts'
import { readLocalValue, writeLocalValue } from '@/lib/offlineSync'

type ToolbarProps = {
  editor: Editor | null | unknown
}

type FontRecord = {
  id: string
  name: string
  family: string
  bucket_path: string
}

const FONT_SIZES = ['14', '16', '18', '22', '28', '36', '48']
const TOOLBAR_PREFS_KEY = 'jessie:editor-toolbar-preferences'

type ToolbarPreferences = {
  selectedFont: string
  fontSize: string
  textColor: string
  highlightColor: string
}

const DEFAULT_TOOLBAR_PREFS: ToolbarPreferences = {
  selectedFont: '',
  fontSize: '16',
  textColor: '#ffffff',
  highlightColor: '#fff59d',
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [fonts, setFonts] = useState<FontRecord[]>([])
  const [selectedFont, setSelectedFont] = useState(() =>
    readLocalValue<ToolbarPreferences>(TOOLBAR_PREFS_KEY, DEFAULT_TOOLBAR_PREFS).selectedFont,
  )
  const [fontSize, setFontSize] = useState(() =>
    readLocalValue<ToolbarPreferences>(TOOLBAR_PREFS_KEY, DEFAULT_TOOLBAR_PREFS).fontSize,
  )
  const [textColor, setTextColor] = useState(() =>
    readLocalValue<ToolbarPreferences>(TOOLBAR_PREFS_KEY, DEFAULT_TOOLBAR_PREFS).textColor,
  )
  const [highlightColor, setHighlightColor] = useState(() =>
    readLocalValue<ToolbarPreferences>(TOOLBAR_PREFS_KEY, DEFAULT_TOOLBAR_PREFS).highlightColor,
  )

  useEffect(() => {
    async function fetchFonts() {
      const fontList = await getFonts()
      setFonts(fontList)
    }

    fetchFonts()
  }, [])

  useEffect(() => {
    writeLocalValue(TOOLBAR_PREFS_KEY, {
      selectedFont,
      fontSize,
      textColor,
      highlightColor,
    })
  }, [selectedFont, fontSize, textColor, highlightColor])

  if (!isTiptapEditor(editor)) {
    return (
      <div className="editor-toolbar editor-toolbar--loading" aria-label="Journal formatting toolbar">
        <span>Loading toolbar...</span>
      </div>
    )
  }

  async function applyFont(fontFile: string) {
    if (!isTiptapEditor(editor)) return
    setSelectedFont(fontFile)
    if (!fontFile) return
    const fontName = await loadFont(fontFile)
    editor.chain().focus().setFontFamily(fontName).run()
  }

  function applyFontSize(size: string) {
    if (!isTiptapEditor(editor)) return
    const normalized = size.endsWith('px') ? size : `${size}px`
    setFontSize(size.replace('px', ''))
    editor.chain().focus().setFontSize(normalized).run()
  }

  function insertLink() {
    if (!isTiptapEditor(editor)) return
    const current = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Paste a link', current ?? '')
    if (url === null) return

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  function insertImage() {
    if (!isTiptapEditor(editor)) return
    const url = window.prompt('Image URL')
    if (!url?.trim()) return
    editor.chain().focus().setImage({ src: url.trim(), alt: '' }).run()
  }

  function insertVideo() {
    if (!isTiptapEditor(editor)) return
    const url = window.prompt('YouTube or video URL')
    if (!url?.trim()) return

    editor.chain().focus().setYoutubeVideo({ src: url.trim(), width: 720, height: 405 }).run()
  }

  return (
    <div className="editor-toolbar" aria-label="Journal formatting toolbar">
      <div className="toolbar-group">
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group toolbar-fonts">
        <select
          className="toolbar-font-picker"
          value={selectedFont}
          onChange={(event) => applyFont(event.target.value)}
          aria-label="Font family"
        >
          <option value="">System font</option>
          {fonts.map((font) => (
            <option key={font.id} value={font.bucket_path}>
              {font.name}
            </option>
          ))}
        </select>

        <div className="toolbar-size-wrapper">
          <button
            type="button"
            className="size-stepper"
            aria-label="Decrease font size"
            onClick={() => applyFontSize(String(Math.max(10, Number(fontSize) - 2)))}
          >
            -
          </button>
          <select
            className="toolbar-size-input"
            value={fontSize}
            onChange={(event) => applyFontSize(event.target.value)}
            aria-label="Font size"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="size-stepper"
            aria-label="Increase font size"
            onClick={() => applyFontSize(String(Math.min(96, Number(fontSize) + 2)))}
          >
            +
          </button>
        </div>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton label="Strike" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <label className="toolbar-color-button" title="Text color" aria-label="Text color">
          <span className="toolbar-color-preview" style={{ background: textColor }} />
          <input
            className="toolbar-color-input"
            type="color"
            value={textColor}
            onChange={(event) => {
              setTextColor(event.target.value)
              editor.chain().focus().setColor(event.target.value).run()
            }}
          />
        </label>
        <label className="toolbar-color-button" title="Highlight" aria-label="Highlight">
          <Highlighter size={16} />
          <input
            className="toolbar-color-input"
            type="color"
            value={highlightColor}
            onChange={(event) => {
              setHighlightColor(event.target.value)
              editor.chain().focus().toggleHighlight({ color: event.target.value }).run()
            }}
          />
        </label>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Task list" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}>
          <ListChecks size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Insert link" active={editor.isActive('link')} onClick={insertLink}>
          <Link size={16} />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={insertImage}>
          <Image size={16} />
        </ToolbarButton>
        <ToolbarButton label="Insert video" onClick={insertVideo}>
          <Video size={16} />
        </ToolbarButton>
        <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <Table2 size={16} />
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser size={16} />
        </ToolbarButton>
      </div>
    </div>
  )
}

function isTiptapEditor(editor: unknown): editor is Editor {
  return Boolean(
    editor &&
      typeof editor === 'object' &&
      'chain' in editor &&
      'isActive' in editor &&
      'commands' in editor,
  )
}

function ToolbarButton({
  active = false,
  children,
  disabled = false,
  label,
  onClick,
}: {
  active?: boolean
  children: ReactNode
  disabled?: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={active ? 'toolbar-button active' : 'toolbar-button'}
      disabled={disabled}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
