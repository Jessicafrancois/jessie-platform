
import BlockRenderer from './BlockRenderer'
import BlockMenu from './BlockMenu'

import { autoResize } from '../utils/autoResize'

import type {
  Block,
  BlockType,
} from '../types'

interface EditorCanvasProps {
  title: string

  setTitle: (
    value: string
  ) => void

  blocks: Block[]

  updateBlock: (
    id: string,
    content: string
  ) => void

  showBlockMenu: boolean

  setShowBlockMenu: (
    value: boolean
  ) => void

  addBlock: (
    type: BlockType
  ) => void

  activeBlockId: string | null

  setActiveBlockId: (
    id: string
  ) => void
}

export default function EditorCanvas({
  title,
  setTitle,
  blocks,
  updateBlock,
  showBlockMenu,
  setShowBlockMenu,
  addBlock,
  activeBlockId,
  setActiveBlockId,

}: EditorCanvasProps)
{

  return (
    <div className="editor-canvas">
      <textarea
        className="title-input"
        rows={1}
        value={title}
        placeholder="Untitled"
        onChange={(e) => {
          autoResize(e.target)
          setTitle(e.target.value)
        }}
      />

        {blocks.length === 0 && (
          <div className="editor-empty">
            Type "/" to begin writing
          </div>
        )}
        
      {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            updateBlock={updateBlock}
            setActiveBlockId={
              setActiveBlockId
            }
             insertBlockAfter={
              insertBlockAfter
                } 
          />
      
        ))}

      <div className="block-controls">
        <button
          type="button"
          className="add-block"
          onClick={() =>
            setShowBlockMenu(
              !showBlockMenu
            )
          }
        >
          +
        </button>

        {showBlockMenu && (
          <BlockMenu
            onSelect={addBlock}
          />
        )}
      </div>
    </div>
  )
}
