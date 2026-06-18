import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import './[slug]/world-viewer.css'

export default async function WorldsPage() {

const { data: worlds, error } = await supabase
.from('worlds')
.select(`       id,
      title,
      slug,
      description,
      cover_image
    `)
.is('deleted_at', null)
.order('updated_at', {
ascending: false,
})

if (error) {
console.error(error)
}

return ( <main className="worlds-directory">


  <section className="worlds-hero">

    <h1 className="wv-title">
      Worlds
    </h1>

    <p className="wv-subtitle-main">
      Explore immersive universes,
      stories, and brand ecosystems.
    </p>

  </section>

  <div className="worlds-grid">

    {(worlds ?? []).map((world) => (

      <Link
        key={world.id}
        href={`/worlds/${world.slug}`}
        className="world-card"
      >

        {world.cover_image ? (

          <img
            src={world.cover_image}
            alt={world.title}
            className="world-card-image"
          />

        ) : (

          <div className="world-card-fallback" />

        )}

        <div className="world-card-overlay" />

        <div className="world-card-content">

          <h2>
            {world.title}
          </h2>

          <p>
            {world.description}
          </p>

        </div>

      </Link>

    ))}

  </div>

</main>


)
}
