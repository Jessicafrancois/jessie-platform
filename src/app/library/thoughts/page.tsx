import Link from 'next/link'

export default function ThoughtsPage() {
  return (
    <main className="library-page">

      <section className="library-hero">

        <p className="library-label">
          Collection 001
        </p>

        <h1 className="library-title">
          Thoughts
        </h1>

        <p className="library-intro">
          A collection of observations,
          campaign breakdowns,
          mental models,
          and ideas gathered while
          building worlds.
        </p>

      </section>
<div className="library-meta">

        <div>
            <span>Status</span>
            <strong>Active</strong>
        </div>

        <div>
            <span>Collection</span>
            <strong>001</strong>
        </div>

        <div>
            <span>Type</span>
            <strong>Archive</strong>
        </div>

        </div>
        <section className="collection-purpose">

  <p className="collection-purpose-label">
    Collection Purpose
  </p>

  <p className="collection-purpose-copy">

    Thoughts is an archive of campaign
    breakdowns, strategic observations,
    mental models, and ideas that help
    explain why certain experiences,
    brands, and stories resonate.

  </p>

</section>
    <section className="featured-breakdown">

  <div className="featured-breakdown-content">

    <p className="library-label">
      Featured Analysis
    </p>

    <h2>
      Why Great Campaigns
      Become Cultural Moments
    </h2>

    <p>
      A framework for understanding
      how campaigns move beyond
      advertising and become part
      of culture.
    </p>

    <Link
      href="/library/thoughts/campaign-framework"
      className="library-button"
    >
      Open Case File
    </Link>

  </div>

</section>
<section className="collection-entries">

  <div className="entries-header">

    <p className="library-label">
      Archive Entries
    </p>

    <h2>
      Campaign Breakdowns
    </h2>

  </div>

  <div className="entries-grid">

    <Link
      href="/library/thoughts/barbie"
      className="entry-card"
    >

      <span>Entry 001</span>

      <h3>
        Barbie
      </h3>

      <p>
        How a movie became
        a cultural movement.
      </p>

    </Link>

    <Link
      href="/library/thoughts/duolingo"
      className="entry-card"
    >

      <span>Entry 002</span>

      <h3>
        Duolingo
      </h3>

      <p>
        Turning a mascot
        into a media property.
      </p>

    </Link>

    <Link
      href="/library/thoughts/liquid-death"
      className="entry-card"
    >

      <span>Entry 003</span>

      <h3>
        Liquid Death
      </h3>

      <p>
        Building a beverage
        company through narrative.
      </p>

    </Link>

  </div>

</section>

<section className="related-collections">

  <p className="library-label">
    Related Collections
  </p>

  <div className="related-grid">

    <div className="related-card">

      <span>Collection 002</span>

      <h3>Research</h3>

    </div>

    <div className="related-card">

      <span>Collection 003</span>

      <h3>World Building</h3>

    </div>

  </div>

</section>

<section className="collection-philosophy">

  <blockquote>

    Thoughts are snapshots.

    Some become systems.

    Some become ventures.

    Some become worlds.

  </blockquote>

  <p className="collection-signature">
    Jessica Francois
  </p>

</section>

    </main>
  )
}