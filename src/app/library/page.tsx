import Link from 'next/link'
import PageBackLink from '@/components/navigation/PageBackLink'

import './library.css'

export default function LibraryPage() {
  return (
    <main className="library-shell">
      <PageBackLink />

      {/* Hero */}

      <section className="library-hero">

        <p className="library-label">
          The Archive
        </p>

        <h1 className="library-title">
          The Library
        </h1>

        <p className="library-intro">
          A living archive of ideas,
          research, campaign breakdowns,
          world building, and observations
          gathered while building worlds.
        </p>

      </section>
    <section className="library-overview">

  <div className="library-stat">

    <span className="library-stat-label">
      Status
    </span>

    <strong>
      Active
    </strong>

  </div>

  <div className="library-stat">

    <span className="library-stat-label">
      Collections
    </span>

    <strong>
      4
    </strong>

  </div>

  <div className="library-stat">

    <span className="library-stat-label">
      Entries
    </span>

    <strong>
      127
    </strong>

  </div>

  <div className="library-stat">

    <span className="library-stat-label">
      Established
    </span>

    <strong>
      2026
    </strong>

  </div>
<section className="library-collections">

  <div className="library-section-header">

    <p className="library-label">
      Collections
    </p>

    <h2>
      Archive Rooms
    </h2>

  </div>

  <div className="library-collections-grid">

  </div>
</section>
<Link
  href="/library/thoughts"
  className="library-card"
>

  <span>
    Collection 001
  </span>

  <h3>
    Thoughts
  </h3>

  <p>
    Campaign breakdowns,
    observations,
    mental models,
    and analysis.
  </p>

</Link>

<div className="library-card">

  <span>
    Collection 002
  </span>

  <h3>
    Research
  </h3>

  <p>
    Psychology,
    neuroscience,
    behavior,
    and learning.
  </p>

</div>

<div className="library-card">

  <span>
    Collection 003
  </span>

  <h3>
    World Building
  </h3>

  <p>
    Narrative systems,
    creative ecosystems,
    and immersive experiences.
  </p>

</div>
<div className="library-card">

  <span>
    Collection 004
  </span>

  <h3>
    Field Notes
  </h3>

  <p>
    Experiments,
    reflections,
    lessons,
    and observations.
  </p>

</div>
<section className="library-worlds">

  <div className="library-section-header">

    <p className="library-label">
      Connected Worlds
    </p>

    <h2>
      Where These Ideas Live
    </h2>

  </div>

  <div className="library-worlds-grid">

    <div className="library-world-card">

      <h3>Muse Studios</h3>

      <p>
        Creative strategy,
        world building,
        and immersive experiences.
      </p>

    </div>

    <div className="library-world-card">

      <h3>Roadwise</h3>

      <p>
        Healing,
        movement,
        identity,
        and transformation.
      </p>

    </div>

    <div className="library-world-card">

      <h3>Twisted Stars</h3>

      <p>
        Psychological fantasy,
        power,
        memory,
        and human nature.
      </p>

    </div>

  </div>

</section>
<section className="library-philosophy">

  <blockquote>

    Knowledge becomes valuable
    when it is collected,
    connected,
    and applied.

  </blockquote>

</section>
<section className="library-signature">

  <div className="library-signoff-line" />

  <p>
    Jessica Francois
  </p>

</section>

</section>

    </main>
  )
}