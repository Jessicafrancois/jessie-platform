import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import './collections.css'

export const revalidate = 60

export default async function CollectionsPage() {
  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, slug, description, hero_image')
    .order('name', { ascending: true })

  return (
    <main className="collections-page">

      <section className="collections-hero">
        <div className="collections-hero-label">Collections</div>
        <h1 className="collections-hero-title">
          Curated Worlds
          <br />
          of Thought
        </h1>
        <p className="collections-hero-sub">
          Ideas don't live in categories. They live in worlds.
        </p>
      </section>

      <section className="collections-grid-section">
        {collections?.map((collection, index) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="collection-card"
          >
            <div className="collection-card-number">
              {String(index + 1).padStart(2, '0')}
            </div>

            {collection.hero_image ? (
              <img
                src={collection.hero_image}
                alt={collection.name}
                className="collection-cover"
              />
            ) : (
              <div className="collection-cover collection-cover--empty" />
            )}

            <div className="collection-overlay" />

            <div className="collection-card-content">
              <h2 className="collection-title">
                {collection.name}
              </h2>
              <p className="collection-description">
                {collection.description}
              </p>
              <span className="collection-cta">Explore →</span>
            </div>

          </Link>
        ))}
      </section>

    </main>
  )
}