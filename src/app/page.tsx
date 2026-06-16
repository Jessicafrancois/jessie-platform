'use client'

import Link from 'next/link'
import './home.css'
import PageBackLink from '@/components/navigation/PageBackLink'

import PublicLayout from '@/components/public/PublicLayout'

export default function HomePage() {
  return (
    <PublicLayout>
      <PageBackLink />

      <main className="home-page">
        

        {/* HERO */}

        <section className="home-hero">

          <p className="home-label">
            Welcome
          </p>

          <h1 className="home-title">
            Ideas Become Worlds.
            Worlds Become Experiences.
          </h1>

          <div className="home-hero-copy">

            <p className="home-intro">
              An evolving ecosystem of ventures,
              stories, research, and experiences
              connected through creativity,
              psychology, and world building.
            </p>

          </div>

        </section>
        

<div className="section-divider" />

{/* CURRENT LOCATION */}

<section className="home-status">

  <div className="status-item">

    <span>Currently Building</span>

    <strong>Muse Studios</strong>

  </div>

  <div className="status-item">

    <span>Research Focus</span>

    <strong>World Building</strong>

  </div>

  <div className="status-item">

    <span>Latest Entry</span>

    <strong>Thoughts Collection</strong>

  </div>

</section>

<p className="section-number">
  001
</p>

      {/* MANIFESTO */}

      <section className="home-manifesto">

        <div className="home-manifesto-grid">

          <div>

            <p className="home-label">
              Direction
            </p>

          </div>

          <div>

            <h2 className="home-manifesto-title">
              Experiences are replacing interfaces.
            </h2>

            <p className="home-manifesto-copy">
              The strongest digital platforms will no longer
              compete through functionality alone.
              They will compete through atmosphere,
              emotional memory, narrative immersion,
              and cinematic identity.
            </p>

          </div>

        </div>

      </section>

<div className="section-divider" />
<p className="section-number">
  002
</p>

<div className="path-meta">
  Begin Here
</div>

      {/* LINKS */}

      <section className="home-paths">

  <Link
    href="/start-here"
    className="home-path-card"
  >
    <span>01</span>

    <h3>Start Here</h3>

    <p>
      Begin your journey through
      the ecosystem.
    </p>
  </Link>

  <Link
    href="/our-world"
    className="home-path-card"
  >
    <span>02</span>

    <h3>Our World</h3>

    <p>
      Explore the ventures,
      stories,
      and experiences.
    </p>
  </Link>

  <Link
    href="/library"
    className="home-path-card"
  >
    <span>03</span>

    <h3>The Library</h3>

    <p>
      Enter the archive of ideas,
      research,
      and campaign breakdowns.
    </p>
  </Link>

  <Link
    href="/journal"
    className="home-path-card"
  >
    <span>04</span>

    <h3>Journal</h3>

    <p>
      Essays,
      observations,
      and reflections.
    </p>
  </Link>

</section>

<p className="section-number">
  003
</p>

<div className="section-divider" />

      {/* FOCUS */}

<section className="home-focus">

  <p className="home-label">
    Current Focus
  </p>

  <h2>
    Muse Studios
  </h2>

  <p>

    Building a creative ecosystem
    designed for creators,
    founders,
    and communities.

    A place where ideas become
    experiences and experiences
    become opportunities.

  </p>

</section>

<p className="section-number">
  004
</p>

<div className="section-divider" />

     {/* HOME FEATURED */}


<section className="home-featured">

  <p className="home-label">
    From The Archive
  </p>

  <h2>

    Why Great Campaigns
    Become Cultural Moments

  </h2>

  <p>

    A framework for understanding
    how campaigns move beyond
    marketing and become part
    of culture.

  </p>

  <Link
    href="/library/thoughts/campaign-framework"
  >
    Open Case File
  </Link>

</section>

     {/* RECENT DISCOVERIES */}

<p className="section-number">
  005
</p>

<div className="section-divider" />

<section className="home-discoveries">

  <p className="home-label">
    Recent Discoveries
  </p>

  <div className="discoveries-list">

    <Link
      href="/library/thoughts/barbie"
      className="discovery-row"
    >

      <span className="discovery-number">
        001
      </span>

      <div className="discovery-content">

        <h3>
          Barbie
        </h3>

        <p>
          Cultural movement disguised
          as a movie launch.
        </p>

      </div>

    </Link>

    <Link
      href="/library/thoughts/duolingo"
      className="discovery-row"
    >

      <span className="discovery-number">
        002
      </span>

      <div className="discovery-content">

        <h3>
          Duolingo
        </h3>

        <p>
          Turning a mascot into media.
        </p>

      </div>

    </Link>

    <Link
      href="/library/thoughts/liquid-death"
      className="discovery-row"
    >

      <span className="discovery-number">
        003
      </span>

      <div className="discovery-content">

        <h3>
          Liquid Death
        </h3>

        <p>
          Narrative as a competitive
          advantage.
        </p>

      </div>

    </Link>

  </div>

</section>

<p className="section-number">
  006
</p>

<div className="section-divider" />

<section className="home-closing">

  <h2>

    Not everything here
    is finished.

    That's the point.

  </h2>

  <p>

    This ecosystem is being built
    in public, one idea at a time.

  </p>

</section>

      {/* MARQUEE */}

      <section className="home-marquee">

        <div className="home-marquee-track">

          <span>IMMERSIVE SYSTEMS</span>
          <span>NARRATIVE WORLDS</span>
          <span>EMOTIONAL INTERNET</span>
          <span>CINEMATIC EXPERIENCES</span>
          <span>IMMERSIVE SYSTEMS</span>
          <span>NARRATIVE WORLDS</span>
          <span>EMOTIONAL INTERNET</span>

        </div>

      </section>
    
      {/* FOOTER */}

  <footer className="home-footer">

  <div className="home-footer-line" />

  <h2>

    Ideas become worlds.
    Worlds become experiences.

  </h2>

  <div className="home-footer-navigation">

    <Link href="/start-here">
      Start Here
    </Link>

    <Link href="/our-world">
      Our World
    </Link>

    <Link href="/library">
      Library
    </Link>

    <Link href="/journal">
      Journal
    </Link>

    <Link href="/connect">
      Connect
    </Link>

  </div>

  <div className="home-footer-meta">

    <p>Jessica Francois</p>

    <p>Creative Strategist</p>

    <p>World Builder</p>

  </div>

</footer>

    </main>
 </PublicLayout>
  )
}
