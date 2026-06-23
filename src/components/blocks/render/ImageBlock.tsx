import { ImageContent } from '@/lib/blocks/types'

export default function ImageBlock({ content }: { content: ImageContent }) {
  if (!content.image) return null
  return (
    <figure className="block-image">
      <img src={content.image} alt={content.caption || ''} />
      {content.caption && <figcaption>{content.caption}</figcaption>}
    </figure>
  )
}