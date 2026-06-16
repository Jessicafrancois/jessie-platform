import Link from 'next/link'
import './journal.css'
import { supabase } from '@/lib/supabase'
import PageBackLink from '@/components/navigation/PageBackLink'

export const revalidate = 60

export default async function JournalPage() {

  const [entriesRes, collectionsRes] = await Promise.all([
    supabase
      .from('entries')
      .select('id, title, slug, excerpt, cover_image, tags, published_at, entry_type, reading_time, collection_id')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('collections')
      .select('id, name, slug, description')
      .order('name', { ascending: true }),
  ])

  const entries = entriesRes.data || []
  const collections = collectionsRes.data || []
  const featured = entries[0]

  // Word count from excerpts (full content word count happens in editor)
  const totalWords = entries.reduce((total, entry) => {
    const text = typeof entry.excerpt === 'string' ? entry.excerpt : ''
    return total + text.split(/\s+/).filter(Boolean).length
  }, 0)

  // Timeline from published_at
  const timeline = entries.reduce((acc: Record<string, Record<string, number>>, entry) => {
    if (!entry.published_at) return acc
    const date = new Date(entry.published_at)
    const year = date.getFullYear().toString()
    const month = date.toLocaleString('default', { month: 'long' })
    if (!acc[year]) acc[year] = {}
    acc[year][month] = (acc[year][month] || 0) + 1
    return acc
  }, {})

  if (!featured) {
    return (
      <main className="journal-shell">
        <PageBackLink />
        <div className="journal-empty">
          <h2>The archive is being built.</h2>
          <p>Check back soon.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="journal-shell">
      <PageBackLink />

      <div className="journal-masthead">
        <div className="journal-hero-bg-word">ARCHIVE</div>
        <p className="journal-masthead-byline">Jessica Francois</p>
        <p className="journal-masthead-section">The Journal</p>
      </div>

      <section className="journal-layout">

        <aside className="journal-sidebar">
          <div className="journal-sidebar-top">
            <p className="journal-logo">The Journal</p>
            <div className="journal-vertical">LIVING ARCHIVE</div>
          </div>
          <div className="journal-sidebar-bottom">
            <div className="journal-accent-block" />
            <div className="journal-sidebar-meta">
              <span>Volume 01</span>
              <span>2026 Edition</span>
              <span>Collection 001</span>
            </div>
          </div>
        </aside>

        <div className="journal-feature-image">
          {featured.cover_image && (
            <>
              <img src={featured.cover_image} alt={featured.title} />
              <div className="journal-image-label">Featured Entry</div>
            </>
          )}
        </div>

        <section className="journal-content">
          <div className="journal-top-grid">
            <div className="journal-publication-note">
              <span className="journal-kicker">Living Archive</span>
              <p>
                Ideas don't live in isolation. This is where strategy meets
                story — a record of observations, frameworks, and reflections
                gathered while building brands, researching human behavior,
                and designing worlds that mean something.
              </p>
            </div>

            <div className="journal-small-image">
              {featured.cover_image && (
                <img src={featured.cover_image} alt={featured.title} />
              )}
            </div>

            <div className="obsessions-card">
              <span className="journal-kicker">Current Obsessions</span>
              <ul>
                <li>Neuroscience</li>
                <li>Brand Psychology</li>
                <li>Worldbuilding</li>
                <li>Creative Systems</li>
                <li>Spanish</li>
              </ul>
            </div>
          </div>

          <Link href={`/journal/${featured.slug}`} className="journal-featured">
            <div className="journal-featured-labels">
              <span className="journal-label">Featured Entry</span>
              {featured.published_at && new Date(featured.published_at)
                .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <h1 className="journal-title">{featured.title}</h1>
            <p className="journal-intro">{featured.excerpt}</p>
            <div className="journal-publication-meta">
              <span>Volume 01</span>
              <span>{featured.entry_type || 'Essay'}</span>
              <span>Living Archive</span>
            </div>
          </Link>
        </section>

        <div className="journal-divider" />

        {collections.length > 0 && (
          <section className="journal-collections">
            <div className="journal-collections-header">
              <p className="journal-feed-label">Curated Collections</p>
              <div className="journal-collections-grid">
                {collections.map((collection, index) => (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="journal-collection-card"
                  >
                    <span className="journal-collection-number">
                      {(index + 1).toString().padStart(3, '0')}
                    </span>
                    <h3>The {collection.name} Collection</h3>
                    <p>
                      {collection.description ||
                        `Entries, research, and observations related to ${collection.name}.`}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="library-worlds">
          <div className="library-worlds-header">
            <p className="journal-feed-label">Connected Worlds</p>
            <h2 className="journal-feed-heading">Where These Ideas Live</h2>
            <p className="library-worlds-intro">
              Every entry eventually finds its way into something larger.
              These are the worlds where research becomes reality.
            </p>
          </div>
          <div className="library-worlds-grid">
            <Link href="/worlds/muse-studios" className="library-world-card">
              <span>001</span>
              <h3>Muse Studios</h3>
              <p>Creative ecosystems, brand strategy, and community architecture.</p>
            </Link>
            <Link href="/worlds/roadwise" className="library-world-card">
              <span>002</span>
              <h3>Roadwise</h3>
              <p>Freight technology, owner-operator culture, and logistics built human.</p>
            </Link>
            <Link href="/worlds/twisted-stars" className="library-world-card">
              <span>003</span>
              <h3>Twisted Stars</h3>
              <p>Psychological fantasy exploring identity, memory, and power.</p>
            </Link>
          </div>
        </section>

        <section className="journal-archive-bar">
          <div className="journal-stat">
            <span className="journal-stat-number">{entries.length}</span>
            <span className="journal-stat-label">Published Entries</span>
          </div>
          <div className="journal-stat">
            <span className="journal-stat-number">{collections.length}</span>
            <span className="journal-stat-label">Collections</span>
          </div>
          <div className="journal-stat">
            <span className="journal-stat-number">{totalWords.toLocaleString()}</span>
            <span className="journal-stat-label">Words Written</span>
          </div>
          <div className="journal-stat">
            <span className="journal-stat-number">Living</span>
            <span className="journal-stat-label">Archive Status</span>
          </div>
          <div className="journal-stat">
            <span className="journal-stat-number">2026</span>
            <span className="journal-stat-label">Current Volume</span>
          </div>
        </section>

        <section className="journal-feed">
          <div className="journal-feed-header">
            <p className="journal-feed-label">The Archive</p>
            <h2 className="journal-feed-heading">Recently Added</h2>
          </div>
          <div className="journal-feed-inner">
            {entries.slice(1).map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.slug}`} className="journal-feed-card">
                <div className="journal-feed-image">
                  {entry.cover_image
                    ? <img src={entry.cover_image} alt={entry.title} />
                    : <div className="journal-feed-image-placeholder" />
                  }
                </div>
                <div className="journal-feed-content">
                  <div className="journal-entry-meta">
                    <span className="journal-entry-type">{entry.entry_type || 'Essay'}</span>
                    {entry.reading_time && <span>{entry.reading_time} min read</span>}
                    <span>Archive Entry</span>
                  </div>
                  <h3 className="journal-feed-title">{entry.title}</h3>
                  <p className="journal-feed-intro">{entry.excerpt}</p>
                  <div className="journal-feed-footer">
                    <span>Continue Reading →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="archive-timeline">
          <Link href="/journal/search" className="journal-search-link">
            Search The Archive →
          </Link>
          <div className="archive-timeline-header">
            <p className="journal-feed-label">Archive Timeline</p>
            <h2 className="journal-feed-heading">Explore By Date</h2>
          </div>
          <div className="archive-years">
            {Object.entries(timeline).reverse().map(([year, months]) => (
              <div key={year} className="archive-year">
                <h3>{year}</h3>
                <div className="archive-months">
                  {Object.entries(months).map(([month, count]) => (
                    <Link
                      key={month}
                      href={`/journal?year=${year}&month=${month.toLowerCase()}`}
                      className="archive-month"
                    >
                      <span>{month}</span>
                      <span>{count} {count === 1 ? 'Entry' : 'Entries'}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="library-philosophy">
          <blockquote>
            Every world begins as an observation.
            Every observation becomes an idea.
            Every idea has the potential to become
            an experience worth belonging to.
          </blockquote>
        </section>

        <section className="journal-signature">
          <p className="journal-signature-label">From The Editor</p>
          <p className="journal-signature-copy">
            This archive exists as a record of curiosity — a place to
            document strategy, explore questions, preserve discoveries, and
            trace the evolution of the worlds being built along the way.
            Nothing here is finished. Everything here is alive.
          </p>
          <div className="journal-editor-signoff">
            <span className="journal-signoff-line" />
            <p className="journal-editor-name">Jessica Francois</p>
          </div>
        </section>

      </section>
    </main>
  )
}