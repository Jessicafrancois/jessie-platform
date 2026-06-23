import {
  ColumnsContent, BlockType, BlockContent,
  HeroContent, RichTextContent, ImageContent,
  QuoteContent, ButtonContent, SpacerContent, DividerContent,
} from '@/lib/blocks/types'

import HeroBlock from './HeroBlock'
import RichTextBlock from './RichTextBlock'
import ImageBlock from './ImageBlock'
import QuoteBlock from './QuoteBlock'
import ButtonBlock from './ButtonBlock'
import SpacerBlock from './SpacerBlock'
import DividerBlock from './DividerBlock'

function InlineBlock({ type, content }: { type: BlockType; content: BlockContent }) {
  switch (type) {
    case 'hero':     return <HeroBlock     content={content as HeroContent}     />
    case 'richtext': return <RichTextBlock content={content as RichTextContent} />
    case 'image':    return <ImageBlock    content={content as ImageContent}    />
    case 'quote':    return <QuoteBlock    content={content as QuoteContent}    />
    case 'button':   return <ButtonBlock   content={content as ButtonContent}   />
    case 'spacer':   return <SpacerBlock   content={content as SpacerContent}   />
    case 'divider':  return <DividerBlock  content={content as DividerContent}  />
    default:         return null
  }
}

const LAYOUT_FRACTIONS: Record<ColumnsContent['layout'], string> = {
  '2-col': '1fr 1fr',
  '3-col': '1fr 1fr 1fr',
  '1-2':   '1fr 2fr',
  '2-1':   '2fr 1fr',
}

export default function ColumnsBlock({ content }: { content: ColumnsContent }) {
  return (
    <div
      className="block-columns"
      style={{ gridTemplateColumns: LAYOUT_FRACTIONS[content.layout], gap: content.gap }}
    >
      {content.slots.map((slot, i) => (
        <div key={i} className="block-columns-slot">
          {slot.blocks.map((sub, j) => (
            <InlineBlock key={j} type={sub.type} content={sub.content} />
          ))}
        </div>
      ))}
    </div>
  )
}