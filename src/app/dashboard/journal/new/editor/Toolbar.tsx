
'use client'

import type { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

export default function Toolbar({
  editor,
}: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className="editor-toolbar">

      {/* HEADINGS */}

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .setParagraph()
            .run()
        }
      >
        P
      </button>

      <button
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
        H1
      </button>

      <button
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
        H2
      </button>

      {/* FORMATTING */}

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        B
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        I
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
      >
        U
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
      >
        S
      </button>

      {/* LISTS */}

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        •
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        1.
      </button>

      {/* QUOTE */}

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }
      >
        "
      </button>

      {/* ALIGNMENT */}

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign('left')
            .run()
        }
      >
        ⬅
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign('center')
            .run()
        }
      >
        ☰
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign('right')
            .run()
        }
      >
        ➡
      </button>

      {/* HISTORY */}

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        ↶
      </button>

      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        ↷
      </button>

    </div>
  )
}

