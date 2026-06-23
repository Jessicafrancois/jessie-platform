import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MoodboardEmbedContent } from '@/lib/blocks/types'

export default async function MoodboardEmbedBlock({
  content,
}: {
  content: MoodboardEmbedContent
}) {
  if (!content.moodboardId) return null

  const { data: mb } = await supabase
    .from('moodboards')
    .select('id, title, slug, cover_image, description, slides')
    .eq('id', content.moodboardId)
    .single()

  if (!mb) return null

  const title = content.title || mb.title

  if (content.displayMode === 'cover_link') {
    return (
      <div className="block-moodboard-card">
        {mb.cover_image && (
          <div className="block-moodboard-card-cover">
            <img src={mb.cover_image} alt={title} />
          </div>
        )}
        <div className="block-moodboard-card-body">
          <h3>{title}</h3>
          {mb.description && <p>{mb.description}</p>}
          <Link href={`/moodboards/${mb.slug}`} className="block-moodboard-cta">
            {content.ctaLabel || 'View Presentation'}
          </Link>
        </div>
      </div>
    )
  }

  // full mode — render slides inline
  const slides: Array<{ image?: string; caption?: string }> = mb.slides ?? []

  return (
    <section className="block-moodboard-full">
      <h2>{title}</h2>
      <div className="block-moodboard-slides">
        {slides.map((slide, i) =>
          slide.image ? (
            <figure key={i} className="block-moodboard-slide">
              <img src={slide.image} alt={slide.caption || ''} />
              {slide.caption && <figcaption>{slide.caption}</figcaption>}
            </figure>
          ) : null
        )}
      </div>
      <div className="block-moodboard-link-row">
        <Link href={`/moodboards/${mb.slug}`}>Open full presentation →</Link>
      </div>
    </section>
  )
}