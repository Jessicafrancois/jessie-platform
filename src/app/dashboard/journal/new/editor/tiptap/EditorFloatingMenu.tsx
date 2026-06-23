'use client'
// ─────────────────────────────────────────────────────────────────────────────
// EditorFloatingMenu.tsx
// Appears when cursor is on a blank/empty line.
// Block picker — insert headings, lists, quote, task list, divider, image.
//
// Import path for 3.27:
//   import { FloatingMenu } from '@tiptap/react/menus'
//
// tippyOptions is GONE in 3.27 — use the `options` prop instead.
// ─────────────────────────────────────────────────────────────────────────────

import { FloatingMenu } from '@tiptap/react/menus'

type Props = {
  editor: any
}

type BlockItem = {
  label: string
  icon: string
  title: string
  action: () => void
  isActive?: boolean
}

export default function EditorFloatingMenu({ editor }: Props) {
  const blocks: BlockItem[] = [
    {
      label: 'H1',
      icon: 'H1',
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      icon: 'H2',
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'H3',
      icon: 'H3',
      title: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    {
      label: '•',
      icon: '•',
      title: 'Bullet list',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      label: '1.',
      icon: '1.',
      title: 'Ordered list',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      label: '"',
      icon: '"',
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
    {
      label: '☐',
      icon: '☐',
      title: 'Task list',
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive('taskList'),
    },
    {
      label: '—',
      icon: '—',
      title: 'Divider',
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      label: '🖼',
      icon: '🖼',
      title: 'Image',
      action: () => {
        const url = prompt('Image URL:')
        if (url) {
          editor.chain().focus().insertContent({
            type: 'image',
            attrs: { src: url },
          }).run()
        }
      },
    },
    {
      label: '</>',
      icon: '</>',
      title: 'Code block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
  ]

  return (
    <FloatingMenu
      editor={editor}
      className="editor-floating-menu"
    >
      {blocks.map(block => (
        <button
          key={block.label}
          type="button"
          className={`floating-btn ${block.isActive ? 'is-active' : ''}`}
          onClick={block.action}
          title={block.title}
        >
          {block.icon}
        </button>
      ))}
    </FloatingMenu>
  )
}