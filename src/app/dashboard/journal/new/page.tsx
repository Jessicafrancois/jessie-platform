'use client'

import { useState } from 'react'

import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

import { supabase } from '../../../../lib/supabase'

const inputStyle = {
  width: '100%',
  padding: '1rem',
  background: '#111',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
}

function SortableBlock({
  block,
  index,
  blocks,
  setBlocks,
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: index,
  })

  const style = {
    transform:
      CSS.Transform.toString(transform),

    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border:
          '1px solid rgba(255,255,255,0.08)',
        padding: '1rem',
        background: '#181818',
      }}
    >

      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          opacity: 0.5,
          marginBottom: '1rem',
        }}
      >
        Drag
      </div>

      <select
        value={block.type}
        onChange={(e) => {

          const updated = [...blocks]

          updated[index].type =
            e.target.value

          setBlocks(updated)
        }}
        style={inputStyle}
      >

        <option value="paragraph">
          Paragraph
        </option>

        <option value="quote">
          Quote
        </option>

        <option value="ambient-quote">
          Ambient Quote
        </option>

        <option value="image">
          Image
        </option>

        <option value="fullscreen-image">
          Fullscreen Image
        </option>

        <option value="split">
          Split Layout
        </option>

      </select>

      <textarea
        rows={6}
        value={block.content || ''}

        onChange={(e) => {

          const updated = [...blocks]

          updated[index].content =
            e.target.value

          setBlocks(updated)
        }}

        placeholder="Block content"

        style={{
          ...inputStyle,
          marginTop: '1rem',
        }}
      />

      {block.type === 'split' && (

        <input
          placeholder="Image URL"

          value={block.image || ''}

          onChange={(e) => {

            const updated = [...blocks]

            updated[index].image =
              e.target.value

            setBlocks(updated)
          }}

          style={{
            ...inputStyle,
            marginTop: '1rem',
          }}
        />

      )}

      <button
        onClick={() => {

          setBlocks(
            blocks.filter(
              (_: any, i: number) =>
                i !== index
            )
          )
        }}

        style={{
          marginTop: '1rem',
        }}
      >
        Delete
      </button>

    </div>
  )
}

export default function NewEssayPage() {

  const [title, setTitle] =
    useState('')

  const [intro, setIntro] =
    useState('')

  const [image, setImage] =
    useState('')

  const [blocks, setBlocks] =
    useState<any[]>([
      {
        type: 'paragraph',
        content: '',
      },
    ])

  async function createEssay() {

    const slug = title
      .toLowerCase()
      .replaceAll(' ', '-')

    await supabase
      .from('essays')
      .insert({
        title,
        intro,
        image,
        slug,
        content: blocks,
        published: true,
      })

    window.location.href =
      '/journal'
  }

  return (
    <main
      style={{
        background: '#111',
        color: 'white',
        minHeight: '100vh',

        display: 'grid',

        gridTemplateColumns:
          '420px 1fr',
      }}
    >

      {/* EDITOR */}

      <div
        style={{
          padding: '2rem',

          borderRight:
            '1px solid rgba(255,255,255,0.08)',

          overflowY: 'auto',
          height: '100vh',
        }}
      >

        <h1>Create Essay</h1>

        <div
          style={{
            display: 'grid',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >

          <input
            placeholder="Title"

            value={title}

            onChange={(e) =>
              setTitle(e.target.value)
            }

            style={inputStyle}
          />

          <input
            placeholder="Intro"

            value={intro}

            onChange={(e) =>
              setIntro(e.target.value)
            }

            style={inputStyle}
          />

          <input
            placeholder="Hero Image URL"

            value={image}

            onChange={(e) =>
              setImage(e.target.value)
            }

            style={inputStyle}
          />

          <DndContext
            collisionDetection={
              closestCenter
            }

            onDragEnd={(event: any) => {

              const {
                active,
                over,
              } = event

              if (!over) return

              if (
                active.id !== over.id
              ) {

                setBlocks((items) => {

                  const oldIndex =
                    items.findIndex(
                      (_: any, i: number) =>
                        i === active.id
                    )

                  const newIndex =
                    items.findIndex(
                      (_: any, i: number) =>
                        i === over.id
                    )

                  return arrayMove(
                    items,
                    oldIndex,
                    newIndex
                  )
                })
              }
            }}
          >

            <SortableContext
              items={blocks.map(
                (_: any, i: number) => i
              )}

              strategy={
                verticalListSortingStrategy
              }
            >

              <div
                style={{
                  display: 'grid',
                  gap: '1rem',
                }}
              >

                {blocks.map(
                  (
                    block,
                    index
                  ) => (

                    <SortableBlock
                      key={index}

                      block={block}
                      index={index}

                      blocks={blocks}
                      setBlocks={setBlocks}
                    />

                  )
                )}

              </div>

            </SortableContext>

          </DndContext>

          <button
            onClick={() => {

              setBlocks([
                ...blocks,

                {
                  type: 'paragraph',
                  content: '',
                },
              ])
            }}
          >
            Add Block
          </button>

          <button
            onClick={createEssay}
          >
            Publish Essay
          </button>

        </div>

      </div>

      {/* PREVIEW */}

      <div
        style={{
          overflowY: 'auto',
          height: '100vh',
          background: '#0d0d0d',
        }}
      >

        <section
          style={{
            minHeight: '70vh',

            position: 'relative',

            display: 'flex',
            alignItems: 'flex-end',

            padding: '4rem',
          }}
        >

          {image && (

            <img
              src={image}
              alt=""

              style={{
                position: 'absolute',
                inset: 0,

                width: '100%',
                height: '100%',

                objectFit: 'cover',

                opacity: 0.35,
              }}
            />

          )}

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '700px',
            }}
          >

            <h1
              style={{
                fontSize: '5rem',
                lineHeight: 0.9,
                fontWeight: 300,
              }}
            >
              {title || 'Untitled Essay'}
            </h1>

            <p
              style={{
                marginTop: '2rem',
                lineHeight: 2,
                opacity: 0.7,
              }}
            >
              {intro}
            </p>

          </div>

        </section>

      </div>

    </main>
  )
}