
import type { Block } from '../types'
import { autoResize } from '../utils/autoResize'

interface Props {
  block: Block

  updateBlock: (
    id: string,
    content: string
  ) => void

  setActiveBlockId: (
    id: string
  ) => void

  insertBlockAfter: (
    id: string,
    type: BlockType
  ) => void
  
}

export default function BlockRenderer({
  block,
  updateBlock,
  setActiveBlockId,
  insertBlockAfter,
}: Props)
{
  const commonProps = {
    rows: 1,
    value: block.content,

    onFocus: () =>
      setActiveBlockId(block.id),

    onKeyDown: (
      e: React.KeyboardEvent<
        HTMLTextAreaElement
      >
    ) => {
      if (e.key === 'Enter') {
        // Future:
        // create block below
      }
    },

    onChange: (
      e: React.ChangeEvent<
        HTMLTextAreaElement
      >
    ) => {
      autoResize(e.target)

      updateBlock(
        block.id,
        e.target.value
      )
    },
  }

  switch (block.type) {
    case 'heading1':
      return (
        <textarea
          {...commonProps}
          className="block-heading1"
          placeholder="Heading"
        />
      )

    case 'heading2':
      return (
        <textarea
          {...commonProps}
          className="block-heading2"
          placeholder="Subheading"
        />
      )

    case 'quote':
      return (
        <textarea
          {...commonProps}
          className="block-quote"
          placeholder="Quote"
        />
      )

    case 'checklist':
      return (
        <div className="checklist-block">
          <input
            type="checkbox"
            checked={
              block.checked || false
            }
            readOnly
          />

          <textarea
            {...commonProps}
            className="block-input"
            placeholder="Task"
          />
        </div>
      )

    case 'callout':
      return (
        <div className="callout-block">
          <span>💡</span>

          <textarea
            {...commonProps}
            className="block-input"
            placeholder="Callout"
          />
        </div>
      )

    case 'divider':
      return (
        <hr className="editor-divider" />
      )

    default:
      return (
        <textarea
          {...commonProps}
          className="block-input"
          placeholder="Write something..."
        />
      )
  }
}

