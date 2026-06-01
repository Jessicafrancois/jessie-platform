
'use client'

import { useState } from 'react'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import EditorCanvas from './components/EditorCanvas'

import TiptapEditor from './editor/TiptapEditor'

import './editor.css'

import type {
  Block,
  BlockType,
} from './types'

import { createBlock }
  from './utils/createBlock'

export default function NewJournalPage() {
  const [title, setTitle] =
    useState('')

  const [blocks, setBlocks] =
    useState<Block[]>([
      {
        id: crypto.randomUUID(),
        type: 'paragraph',
        content: '',
      },
    ])

  const [
    showBlockMenu,
    setShowBlockMenu,
  ] = useState(false)

  const [
    activeBlockId,
    setActiveBlockId,
  ] = useState<string | null>(null)

  function updateBlock(
    id: string,
    content: string
  ) {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              content,
            }
          : block
      )
    )
  }

      function addBlock(
        type: BlockType
      ) {
        const newBlock =
          createBlock(type)

        setBlocks((prev) => [
          ...prev,
          newBlock,
        ])

        setActiveBlockId(
          newBlock.id
        )

        setShowBlockMenu(false)
      }

  function convertBlock(
    id: string,
    type: BlockType
  ) {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              type,
            }
          : block
      )
    )
  }

  function handlePublish() {
    console.log('publish')
  }

function insertBlockAfter(
  afterId: string,
  type: BlockType
)
{
  const newBlock =
    createBlock(type)

  setBlocks((prev) => {
    const index =
      prev.findIndex(
        (block) =>
          block.id === afterId
      )

    if (index === -1)
      return prev

    const copy = [...prev]

    copy.splice(
      index + 1,
      0,
      newBlock
    )

    return copy
  })
}


  return (
    <div className="editor-layout">
      <Sidebar />

      <main className="editor-main">
        <Topbar
          onPublish={handlePublish}
        />

        <TiptapEditor />
        
    
      </main>
    </div>
  )
}

