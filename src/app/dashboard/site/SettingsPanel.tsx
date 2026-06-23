'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import { useEffect } from 'react'


import { PageBlock, BlockContent } from '@/lib/blocks/types'
import ImageUploadField from '@/lib/blocks/ImageUploadField'

export default function SettingsPanel({
  block,
  onChangeAction,
  onMetaChangeAction,
}: {
  block: PageBlock
  onChangeAction: (content: BlockContent) => void
  onMetaChangeAction?: (
    updates: Partial<
      Pick<PageBlock, 'variant' | 'animation' | 'styleOverrides'>
    >
  ) => void
}) {
  const content = block.content

  const set = (updates: Partial<BlockContent>) => {
    // Merge updates and cast to BlockContent to satisfy discriminator
    onChangeAction(({
      ...content,
      ...updates,
    } as unknown) as BlockContent)
  }

  return (
<>
  {block.type === 'hero' && (
    <>
      <Field label="Headline">
        <input
          className="bb-input"
          value={content.headline ?? ''}
          onChange={e => set({ headline: e.target.value })}
        />
      </Field>

      <Field label="Subheadline">
        <textarea
          className="bb-textarea"
          rows={3}
          value={content.subheadline ?? ''}
          onChange={e => set({ subheadline: e.target.value })}
        />
      </Field>
    </>
  )}

  {block.type === 'image' && (
    <ImageUploadField
      value={content.image ?? ''}
      onChange={image => set({ image })}
    />
  )}

  {block.type === 'quote' && (
    <>
      <Field label="Quote">
        <textarea
          className="bb-textarea"
          rows={4}
          value={content.quote ?? ''}
          onChange={e => set({ quote: e.target.value })}
        />
      </Field>

      <Field label="Author">
        <input
          className="bb-input"
          value={content.author ?? ''}
          onChange={e => set({ author: e.target.value })}
        />
      </Field>
    </>
  )}



      {block.type === 'hero' && (
        <>
          <Field label="Headline">
            <input className="bb-input" value={content.headline} onChange={e => set({ headline: e.target.value })} />
          </Field>
          <Field label="Subheadline">
            <textarea className="bb-textarea" rows={3} value={content.subheadline} onChange={e => set({ subheadline: e.target.value })} />
          </Field>
          <ImageUploadField label="Background Image" value={content.backgroundImage} onChangeAction={url => set({ backgroundImage: url })} />
        </>
      )}

      {block.type === 'richtext' && (
        // key={block.id} forces a fresh Tiptap instance when switching
        // between richtext blocks — without it, the editor would keep
        // showing the previously selected block's content.
        <RichTextEditorField key={block.id} html={content.html} onChange={(html, json) => set({ html, json })} />
      )}

      {block.type === 'image' && (
        <>
          <ImageUploadField label="Image" value={content.image} onChangeAction={url => set({ image: url })} />
          <Field label="Caption">
            <input className="bb-input" value={content.caption} onChange={e => set({ caption: e.target.value })} />
          </Field>
        </>
      )}

      {block.type === 'gallery' && (
        <GalleryField images={content.images ?? []} onChange={images => set({ images })} />
      )}

      {block.type === 'quote' && (
        <>
          <Field label="Quote">
            <textarea className="bb-textarea" rows={3} value={content.quote} onChange={e => set({ quote: e.target.value })} />
          </Field>
          <Field label="Author">
            <input className="bb-input" value={content.author} onChange={e => set({ author: e.target.value })} />
          </Field>
        </>
      )}

      {block.type === 'button' && (
        <>
          <Field label="Label">
            <input className="bb-input" value={content.label} onChange={e => set({ label: e.target.value })} />
          </Field>
          <Field label="URL">
            <input className="bb-input" value={content.url} onChange={e => set({ url: e.target.value })} />
          </Field>
          <Field label="Style">
            <select className="bb-select" value={content.style} onChange={e => set({ style: e.target.value })}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </Field>
        </>
      )}

      {(block.type === 'world_slider' || block.type === 'projects' || block.type === 'journal_feed') && (
        <>
          <Field label="Section Title">
            <input className="bb-input" value={content.title} onChange={e => set({ title: e.target.value })} />
          </Field>
          <Field label="Number to Show">
            <input
              className="bb-input"
              type="number"
              min={1}
              max={12}
              value={content.limit}
              onChange={e => set({ limit: parseInt(e.target.value) || 1 })}
            />
          </Field>
        </>
      )}
      
        {block.type === 'columns' && (
  <>
    <Field label="Layout">
      <select
        className="bb-select"
        value={content.layout}
        onChange={e => set({ layout: e.target.value })}
      >
        <option value="2-col">2 Equal Columns</option>
        <option value="3-col">3 Equal Columns</option>
        <option value="1-2">Narrow | Wide (1:2)</option>
        <option value="2-1">Wide | Narrow (2:1)</option>
      </select>
    </Field>

    <Field label="Gap (px)">
      <input
        className="bb-input"
        type="number"
        min={0}
        max={120}
        value={content.gap ?? 32}
        onChange={e => set({ gap: parseInt(e.target.value) || 0 })}
      />
    </Field>
  </>
)}

{block.type === 'moodboard_embed' && (
  <>
    <Field label="Moodboard ID">
      <input
        className="bb-input"
        value={content.moodboardId ?? ''}
        onChange={e => set({ moodboardId: e.target.value })}
      />
    </Field>

    <Field label="Title">
      <input
        className="bb-input"
        value={content.title ?? ''}
        onChange={e => set({ title: e.target.value })}
      />
    </Field>
  </>
)}

{block.type === 'contact_form' && (
  <>
    <Field label="Heading">
      <input
        className="bb-input"
        value={content.heading ?? ''}
        onChange={e => set({ heading: e.target.value })}
      />
    </Field>

    <Field label="Subheading">
      <textarea
        className="bb-textarea"
        rows={3}
        value={content.subheading ?? ''}
        onChange={e => set({ subheading: e.target.value })}
      />
    </Field>

    <Field label="Button Label">
      <input
        className="bb-input"
        value={content.submitLabel ?? ''}
        onChange={e => set({ submitLabel: e.target.value })}
      />
    </Field>
  </>
)}

{block.type === 'video_embed' && (
  <>
    <Field label="Video URL">
      <input
        className="bb-input"
        value={content.url ?? ''}
        onChange={e => set({ url: e.target.value })}
      />
    </Field>

    <Field label="Caption">
      <input
        className="bb-input"
        value={content.caption ?? ''}
        onChange={e => set({ caption: e.target.value })}
      />
    </Field>
  </>
)}

      {block.type === 'spacer' && (
        <Field label="Height (px)">
          <input
            className="bb-input"
            type="number"
            min={0}
            max={400}
            value={content.height}
            onChange={e => set({ height: parseInt(e.target.value) || 0 })}
          />
        </Field>
      )}

      {block.type === 'divider' && (
        <Field label="Style">
          <select className="bb-select" value={content.style} onChange={e => set({ style: e.target.value })}>
            <option value="line">Line</option>
            <option value="dotted">Dotted</option>
          </select>
        </Field>
      )}

      {/* ── STYLE OVERRIDES ──────────────────────────────────────── */}
<div className="bb-settings-group">
  <p className="bb-panel-label bb-panel-label--section">Style Overrides</p>

  <Field label="Variant">
  <select
    className="bb-select"
    value={block.variant ?? ''}
    onChange={e =>
      onMetaChangeAction?.({
        variant: e.target.value || undefined,
      })
    }
  >
    <option value="">Default</option>
    {block.type === 'hero' && <option value="split">Split</option>}
    {block.type === 'hero' && <option value="light">Light</option>}
    {block.type === 'hero' && <option value="gradient">Gradient</option>}
    {block.type === 'quote' && <option value="bordered">Bordered</option>}
    {block.type === 'quote' && <option value="full">Full Width</option>}
  </select>
</Field>

  <Field label="Animation">
  <select
    className="bb-select"
    value={block.animation ?? ''}
    onChange={e =>
      onMetaChangeAction?.({
        animation: e.target.value || undefined,
      })
    }
  >
    <option value="">None</option>
    <option value="fade-up">Fade Up</option>
    <option value="fade-in">Fade In</option>
    <option value="slide-left">Slide Left</option>
    <option value="slide-right">Slide Right</option>
    <option value="zoom-in">Zoom In</option>
  </select>
</Field>

  <Field label="Background Color">
    <input
      type="color"
      className="bb-color-input"
      value={(block.styleOverrides as any)?.background ?? '#050505'}
      onChange={e => {
        /* Wire via onStyleOverrideChange */
      }}
    />
  </Field>

  <Field label="Padding Top (px)">
    <input
      type="number"
      className="bb-input"
      min={0}
      max={240}
      value={(block.styleOverrides as any)?.paddingTop ?? ''}
      placeholder="inherit"
      onChange={e => {
        /* Wire via onStyleOverrideChange */
      }}
    />
  </Field>

  <Field label="Padding Bottom (px)">
    <input
      type="number"
      className="bb-input"
      min={0}
      max={240}
      value={(block.styleOverrides as any)?.paddingBottom ?? ''}
      placeholder="inherit"
      onChange={e => {
        /* Wire via onStyleOverrideChange */
      }}
    />
  </Field>

  <Field label="Shadow">
    <select
      className="bb-select"
      value={(block.styleOverrides as any)?.shadow ?? 'none'}
      onChange={e => {
        /* Wire via onStyleOverrideChange */
      }}
    >
      <option value="none">None</option>
      <option value="sm">Small</option>
      <option value="md">Medium</option>
      <option value="lg">Large</option>
    </select>
  </Field>
</div>

{/* ── TYPOGRAPHY ───────────────────────────────────────────── */}
<div className="bb-settings-group">
  <p className="bb-panel-label bb-panel-label--section">Typography</p>

  <Field label="Font Family">
    <select
      className="bb-select"
      value={(block.styleOverrides as any)?.fontFamily ?? ''}
      onChange={e => {}}
    >
      <option value="">Default (DM Sans)</option>
      <option value="Lora, serif">Lora — editorial serif</option>
      <option value="Playfair Display, serif">Playfair — display serif</option>
      <option value="Cormorant Garamond, serif">Cormorant — luxury serif</option>
      <option value="monospace">Monospace</option>
    </select>
  </Field>

  <Field label="Text Size">
    <select
      className="bb-select"
      value={(block.styleOverrides as any)?.fontSize ?? ''}
      onChange={e => {}}
    >
      <option value="">Default</option>
      <option value="sm">Small</option>
      <option value="md">Medium</option>
      <option value="lg">Large</option>
      <option value="xl">X-Large</option>
    </select>
  </Field>
</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bb-field">
      <label className="bb-label">{label}</label>
      {children}
    </div>
  )
}

function GalleryField({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  return (
    <div className="bb-field">
      <label className="bb-label">Images</label>
      <div className="bb-gallery-field-grid">
        {images.map((img, i) => (
          <div key={i} className="bb-gallery-field-item">
            <img src={img} alt="" />
            <button onClick={() => onChange(images.filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
      </div>
      <ImageUploadField
        label="Add Image"
        value=""
        onChangeAction={url => { if (url) onChange([...images, url]) }}
      />
    </div>
  )
}

function TestimonialItemsField({
  items,
  onChange,
}: {
  items: {
    quote: string
    author: string
    role?: string
  }[]
  onChange: (
    items: {
      quote: string
      author: string
      role?: string
    }[]
  ) => void
}) {
  return (
    <div className="bb-field">
      <label className="bb-label">Testimonials</label>

      {items.map((item, index) => (
        <div key={index} className="bb-repeater-item">
          <input
            className="bb-input"
            placeholder="Author"
            value={item.author}
            onChange={e => {
              const next = [...items]
              next[index].author = e.target.value
              onChange(next)
            }}
          />

          <input
            className="bb-input"
            placeholder="Role"
            value={item.role ?? ''}
            onChange={e => {
              const next = [...items]
              next[index].role = e.target.value
              onChange(next)
            }}
          />

          <textarea
            className="bb-textarea"
            rows={3}
            placeholder="Quote"
            value={item.quote}
            onChange={e => {
              const next = [...items]
              next[index].quote = e.target.value
              onChange(next)
            }}
          />

          <button
            onClick={() =>
              onChange(items.filter((_, i) => i !== index))
            }
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={() =>
          onChange([
            ...items,
            {
              quote: '',
              author: '',
              role: '',
            },
          ])
        }
      >
        Add Testimonial
      </button>
    </div>
  )
}

function StatItemsField({
  items,
  onChange,
}: {
  items: {
    label: string
    value: string
  }[]
  onChange: (
    items: {
      label: string
      value: string
    }[]
  ) => void
}) {
  return (
    <div className="bb-field">
      <label className="bb-label">Stats</label>

      {items.map((item, index) => (
        <div key={index} className="bb-repeater-item">
          <input
            className="bb-input"
            placeholder="Label"
            value={item.label}
            onChange={e => {
              const next = [...items]
              next[index].label = e.target.value
              onChange(next)
            }}
          />

          <input
            className="bb-input"
            placeholder="Value"
            value={item.value}
            onChange={e => {
              const next = [...items]
              next[index].value = e.target.value
              onChange(next)
            }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          onChange([
            ...items,
            {
              label: '',
              value: '',
            },
          ])
        }
      >
        Add Stat
      </button>
    </div>
  )
}

function FAQItemsField({
  items,
  onChange,
}: {
  items: {
    question: string
    answer: string
  }[]
  onChange: (
    items: {
      question: string
      answer: string
    }[]
  ) => void
}) {
  return (
    <div className="bb-field">
      <label className="bb-label">FAQ Items</label>

      {items.map((item, index) => (
        <div key={index} className="bb-repeater-item">
          <input
            className="bb-input"
            placeholder="Question"
            value={item.question}
            onChange={e => {
              const next = [...items]
              next[index].question = e.target.value
              onChange(next)
            }}
          />

          <textarea
            className="bb-textarea"
            rows={3}
            placeholder="Answer"
            value={item.answer}
            onChange={e => {
              const next = [...items]
              next[index].answer = e.target.value
              onChange(next)
            }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          onChange([
            ...items,
            {
              question: '',
              answer: '',
            },
          ])
        }
      >
        Add FAQ
      </button>
    </div>
  )
}

function LogoItemsField({
  items,
  onChange,
}: {
  items: string[]
  onChange: (items: string[]) => void
}) {
  return (
    <div className="bb-field">
      <label className="bb-label">Logos</label>

      {items.map((logo, index) => (
        <div key={index}>
          <input
            className="bb-input"
            value={logo}
            placeholder="Logo URL"
            onChange={e => {
              const next = [...items]
              next[index] = e.target.value
              onChange(next)
            }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          onChange([...items, ''])
        }
      >
        Add Logo
      </button>
    </div>
  )
}

function TeamMemberItemsField({
  items,
  onChange,
}: {
  items: {
    name: string
    role: string
    photo?: string
    bio?: string
  }[]
  onChange: (
    items: {
      name: string
      role: string
      photo?: string
      bio?: string
    }[]
  ) => void
}) {
  return (
    <div className="bb-field">
      <label className="bb-label">Team Members</label>

      {items.map((item, index) => (
        <div key={index} className="bb-repeater-item">
          <input
            className="bb-input"
            placeholder="Name"
            value={item.name}
            onChange={e => {
              const next = [...items]
              next[index].name = e.target.value
              onChange(next)
            }}
          />

          <input
            className="bb-input"
            placeholder="Role"
            value={item.role}
            onChange={e => {
              const next = [...items]
              next[index].role = e.target.value
              onChange(next)
            }}
          />

          <input
            className="bb-input"
            placeholder="Photo URL"
            value={item.photo ?? ''}
            onChange={e => {
              const next = [...items]
              next[index].photo = e.target.value
              onChange(next)
            }}
          />

          <textarea
            className="bb-textarea"
            rows={2}
            placeholder="Bio"
            value={item.bio ?? ''}
            onChange={e => {
              const next = [...items]
              next[index].bio = e.target.value
              onChange(next)
            }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          onChange([
            ...items,
            {
              name: '',
              role: '',
              photo: '',
              bio: '',
            },
          ])
        }
      >
        Add Team Member
      </button>
    </div>
  )
}

function RichTextEditorField({
  html, onChange,
}: {
  html: string
  onChange: (html: string, json: Record<string, unknown>) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit, TiptapLink],
    content: html,
    onUpdate: ({ editor }) => onChange(editor.getHTML(), editor.getJSON()),
  })

  // Sync once on mount only — the `key={block.id}` on the parent call
  // is what actually handles switching between different blocks.
  useEffect(() => {
    if (editor && html !== editor.getHTML()) editor.commands.setContent(html)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  

  return (
    <div className="bb-field">
      <label className="bb-label">Content</label>
      <div className="bb-tiptap-toolbar">
        <button onClick={() => editor?.chain().focus().toggleBold().run()}><b>B</b></button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</button>
        <button onClick={() => editor?.chain().focus().toggleBlockquote().run()}>" Quote</button>
      </div>
      <div className="bb-tiptap-editor">
        <EditorContent editor={editor} />  
      </div>
    </div>
  )
}