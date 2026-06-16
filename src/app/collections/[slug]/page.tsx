import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageBackLink from '@/components/navigation/PageBackLink'
import './collection-detail.css'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  if (!collection) notFound()

  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, slug, excerpt, cover_image, entry_type, reading_time, published_at')
    .eq('collection_id', collection.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <main className="collection-detail">
      <PageBackLink />

      <section className="collection-detail-hero">
        {collection.hero_image ? (
          <div className="collection-detail-cover">
            <img src={collection.hero_image} alt={collection.name} />
            <div className="collection-detail-cover-overlay" />
          </div>
        ) : (
          <div className="collection-detail-cover collection-detail-cover--empty" />
        )}

        <div className="collection-detail-hero-content">
          <span className="collection-detail-label">Collection</span>
          <h1 className="collection-detail-title">{collection.name}</h1>
          {collection.description && (
            <p className="collection-detail-description">{collection.description}</p>
          )}
          <span className="collection-detail-count">
            {entries?.length || 0} {entries?.length === 1 ? 'Entry' : 'Entries'}
          </span>
        </div>
      </section>

      <section className="collection-detail-entries">
        {!entries || entries.length === 0 ? (
          <div className="collection-detail-empty">
            <p>No entries in this collection yet.</p>
            <Link href="/journal">Browse the archive →</Link>
          </div>
        ) : (
          <div className="collection-detail-grid">
            {entries.map((entry, index) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.slug}`}
                className="collection-detail-entry"
              >
                <div className="collection-detail-entry-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {entry.cover_image ? (
                  <div className="collection-detail-entry-cover">
                    <img src={entry.cover_image} alt={entry.title} />
                  </div>
                ) : (
                  <div className="collection-detail-entry-cover collection-detail-entry-cover--empty" />
                )}

                <div className="collection-detail-entry-content">
                  <div className="collection-detail-entry-meta">
                    <span>{entry.entry_type || 'Essay'}</span>
                    {entry.reading_time && <span>{entry.reading_time} min read</span>}
                    {entry.published_at && (
                      <span>
                        {new Date(entry.published_at).toLocaleDateString('en-US', {
                          month: 'long', year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="collection-detail-entry-title">{entry.title}</h2>
                  <p className="collection-detail-entry-excerpt">{entry.excerpt}</p>
                  <span className="collection-detail-entry-cta">Read Entry →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="collection-detail-back">
        <Link href="/collections" className="collection-detail-back-link">
          ← All Collections
        </Link>
      </section>

    </main>
  )
}