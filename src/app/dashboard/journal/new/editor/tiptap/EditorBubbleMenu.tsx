'use client'
// ─────────────────────────────────────────────────────────────────────────────
// EditorBubbleMenu.tsx
// Appears when text is selected inside the editor.
// Floating toolbar for inline formatting — bold, italic, underline,
// headings, blockquote, link, and gold highlight.
//
// Import path for 3.27:
//   import { BubbleMenu } from '@tiptap/react/menus'
//
// tippyOptions is GONE in 3.27 — use the `options` prop instead.
// ─────────────────────────────────────────────────────────────────────────────

import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/core'

type Props = {
  editor: Editor
}

export default function EditorBubbleMenu({ editor }: Props) {
  return (
    <BubbleMenu
      editor={editor}
      className="editor-bubble-menu"
    >
      {/* BOLD */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <b>B</b>
      </button>

      {/* ITALIC */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <i>I</i>
      </button>

      {/* UNDERLINE */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <u>U</u>
      </button>

      <div className="bubble-sep" />

      {/* H2 */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H2
      </button>

      {/* H3 */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        H3
      </button>

      <div className="bubble-sep" />

      {/* BLOCKQUOTE */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        "
      </button>

      {/* LINK */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('link') ? 'is-active' : ''}`}
        onClick={() => {
          const prev = editor.getAttributes('link').href ?? ''
          const url  = prompt('URL:', prev)
          if (url === null) return
          if (url === '') {
            editor.chain().focus().unsetLink().run()
          } else {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        title="Link"
      >
        🔗
      </button>

      {/* GOLD HIGHLIGHT */}
      <button
        type="button"
        className={`bubble-btn bubble-btn--gold ${
          editor.isActive('highlight', { color: '#d8bc6e' }) ? 'is-active' : ''
        }`}
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: '#d8bc6e' }).run()
        }
        title="Gold highlight"
      >
        A
      </button>

      {/* STRIKETHROUGH */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <s>S</s>
      </button>

      {/* INLINE CODE */}
      <button
        type="button"
        className={`bubble-btn ${editor.isActive('code') ? 'is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline code"
      >
        {'<>'}
      </button>
    </BubbleMenu>
  )
}