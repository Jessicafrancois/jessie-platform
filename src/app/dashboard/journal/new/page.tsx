'use client'

import { useState } from 'react'
import { supabase } from '../../../../lib/supabase'

import '../../dashboard.css'

type TextBlock = {
  type: 'paragraph' | 'heading' | 'quote'
  content: string
}

type MediaBlock = {
  type: 'image' | 'video'
  url: string
}

type EditorBlock = TextBlock | MediaBlock

export default function NewJournalPage() {
  const [title, setTitle] = useState('')
  const [intro, setIntro] = useState('')
  const [image, setImage] = useState('')

  const [blocks, setBlocks] =
    useState<EditorBlock[]>([
      {
        type: 'paragraph',
        content: '',
      },
    ])

  function addBlock(type: string) {
    let newBlock: EditorBlock

    switch (type) {
      case 'paragraph':
      case 'heading':
      case 'quote':
        newBlock = {
          type,
          content: '',
        }
        break

      case 'image':
      case 'video':
        newBlock = {
          type,
          url: '',
        }
        break

      default:
        return
    }

    setBlocks([
      ...blocks,
      newBlock,
    ])
  }

  async function handlePublish() {
    const slug =
      title
        .toLowerCase()
        .replace(/\s+/g, '-')

    const { error } =
      await supabase
        .from('essays')
        .insert({
          title,
          slug,
          intro,
          image,
          published: true,
          content: JSON.stringify(blocks),
        })

    if (error) {
      console.error(error)
      return
    }

    alert('Essay published.')
  }

  return (
    <main className="editor-page">
      <div className="editor-shell">

        <div className="editor-toolbar">

          <button
            onClick={() =>
              addBlock('paragraph')
            }
          >
            ¶
          </button>

          <button
            onClick={() =>
              addBlock('heading')
            }
          >
            H
          </button>

          <button
            onClick={() =>
              addBlock('quote')
            }
          >
            ❝
          </button>

          <div className="toolbar-divider" />

          <button
            onClick={() =>
              addBlock('image')
            }
          >
            🖼
          </button>

          <button
            onClick={() =>
              addBlock('video')
            }
          >
            ▶
          </button>

          <div className="toolbar-divider" />

          <button>
            B
          </button>

          <button>
            I
          </button>

          <button>
            U
          </button>

        </div>

        <div className="editor-header">

          <input
            className="editor-cover"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            placeholder="Cover image URL"
          />

          <input
            className="editor-title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="New Essay"
          />

          <textarea
            className="editor-intro"
            value={intro}
            onChange={(e) =>
              setIntro(e.target.value)
            }
            placeholder="Write the opening..."
          />

        </div>

        <div className="editor-canvas">

          {blocks.map((block, index) => (
            <div
              key={index}
              className="editor-block"
            >

              {'content' in block && (
                <textarea
                  value={block.content}
                  onChange={(e) => {

                    const updated =
                      [...blocks]

                    updated[index] = {
                      ...block,
                      content:
                        e.target.value,
                    } as EditorBlock

                    setBlocks(updated)
                  }}
                  placeholder={block.type}
                />
              )}

              {'url' in block && (
                <input
                  type="text"
                  value={block.url}
                  onChange={(e) => {

                    const updated =
                      [...blocks]

                    updated[index] = {
                      ...block,
                      url:
                        e.target.value,
                    } as EditorBlock

                    setBlocks(updated)
                  }}
                  placeholder={`${block.type} URL`}
                />
              )}

            </div>
          ))}

        </div>

        <button
          className="publish-button"
          onClick={handlePublish}
        >
          Publish Essay
        </button>

      </div>
    </main>
  )
}