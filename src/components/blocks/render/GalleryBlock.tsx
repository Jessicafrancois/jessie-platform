import { GalleryContent } from '@/lib/blocks/types'

export default function GalleryBlock({ content }: { content: GalleryContent }) {
  if (!content.images?.length) return null
  return (
    <div className="block-gallery">
      {content.images.map((img, i) => (
        <div key={i} className="block-gallery-item">
          <img src={img} alt="" />
        </div>
      ))}
    </div>
  )
}