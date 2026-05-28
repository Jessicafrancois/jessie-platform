import './journal.css'
import Link from 'next/link'

import Navbar from '../../components/Navbar'

import { getPublishedEssays } from '../../lib/essays'

export default async function JournalPage() {

  const essays = await getPublishedEssays()

  const featured = essays[0]

  if (!featured) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#111',
          color: 'white',
          padding: '4rem',
        }}
      >
        No essays yet.
      </main>
    )
  }

  return (
    <main className="journal-shell">


      {/* HERO */}

      <div className="journal-layout">

        <aside className="journal-sidebar">

          <div>

            <p className="journal-logo">
              Jessie Journal
            </p>

            <div className="journal-vertical">
              Immersive Essays
            </div>

          </div>

        </aside>

        <div className="journal-feature-image">

          <img
            src={featured.image}
            alt={featured.title}
          />

          <div className="journal-image-overlay" />

        </div>

        <section className="journal-content">

          <Link
            href={`/journal/${featured.slug}`}
            className="journal-featured"
          >

            <p className="journal-label">
              Featured Essay
            </p>

            <h1 className="journal-title">
              {featured.title}
            </h1>

            <p className="journal-intro">
              {featured.intro}
            </p>

          </Link>

        </section>

      </div>

      {/* FEED */}

      <section className="journal-feed">

        <div className="journal-feed-inner">

          {essays.slice(1).map((essay) => (

            <Link
              key={essay.id}
              href={`/journal/${essay.slug}`}
              className="journal-feed-card"
            >

              <div className="journal-feed-image">

                <img
                  src={essay.image}
                  alt={essay.title}
                />

              </div>

              <div className="journal-feed-content">

                <p className="journal-label">
                  Essay
                </p>

                <h2 className="journal-feed-title">
                  {essay.title}
                </h2>

                <p className="journal-feed-intro">
                  {essay.intro}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>
  )
}