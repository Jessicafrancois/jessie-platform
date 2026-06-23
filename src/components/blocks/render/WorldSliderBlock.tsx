import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { WorldSliderContent } from '@/lib/blocks/types'

export default async function WorldSliderBlock({ content }: { content: WorldSliderContent }) {
  const { data: worlds } = await supabase
    .from('worlds')
    .select('id, title, slug, cover_image, tagline')
    .eq('status', 'Active')
    .order('sort_order', { ascending: true })
    .limit(content.limit || 6)

  if (!worlds?.length) return null

  return (
    <section className="block-world-slider">
      {content.title && <h2>{content.title}</h2>}
      <div className="block-world-slider-row">
        {worlds.map(world => (
          <Link key={world.id} href={`/worlds/${world.slug}`} className="block-world-card">
            {world.cover_image && <img src={world.cover_image} alt={world.title} />}
            <h3>{world.title}</h3>
            {world.tagline && <p>{world.tagline}</p>}
          </Link>
        ))}
      </div>
    </section>
  )
}