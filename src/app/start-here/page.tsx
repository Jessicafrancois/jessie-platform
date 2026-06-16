import Link from 'next/link'
import './start-here.css'

import PageBackLink from '@/components/navigation/PageBackLink'
export default function StartHerePage() {
  
  return (
    <main className="start-shell">
      <PageBackLink />

      {/* HERO */}

      <section className="start-hero">
      <div className="start-hero-image" />

        <div className="start-hero-content">
          <p className="start-label">START HERE</p>

          <h1 className="start-title">
            Step Into
            <br />
            Our World
          </h1>

        <p className="start-intro">

          Welcome.

          This is a living ecosystem of
          ideas, ventures, stories,
          research, and experiences.

          All connected
          through creativity,
          psychology,
          and world building.

          Choose your path below.

        </p>

       </div>

      </section>

      {/* ABOUT ME */}

<div className="hero-scroll">
  Explore ↓
</div>

<section className="start-overview">

  <div className="start-marquee">

    <div className="start-marquee-track">

      <span>PART ARCHIVE</span>

      <span className="marquee-dot">●</span>

      <span>PART LABORATORY</span>

      <span className="marquee-dot">●</span>

      <span>PART WORLD</span>

      <span className="marquee-dot">●</span>

      <span>PART ARCHIVE</span>

      <span className="marquee-dot">●</span>

      <span>PART LABORATORY</span>

      <span className="marquee-dot">●</span>

      <span>PART WORLD</span>

    </div>

  </div>

</section>

<section className="start-editorial-image">
  <img
    src="/images/start-here/library.jpg"
    alt="Editorial atmosphere"
  />
</section>

  {/* WHO THIS IS FOR */}

<section className="start-audience">

  <p className="start-label">
    Who This Is For
  </p>

  <h2>

  Built For

  <br />

  Curious People.

</h2>

<div className="section-divider" />

</section>

    <section className="start-editorial-image">
  <img
    src="/images/start-here/library.jpg"
    alt="Editorial atmosphere"
  />
</section>

    {/* YOUR PATH */}

    <section className="start-paths">

  <Link
    href="/our-world"
    className="start-path-card"
  >

    <span>01</span>

    <div className="path-role">
      Explorer
    </div>

    <p>
      "Understand the ecosystem. See how everything connects."
    </p>

  </Link>

  <Link
    href="/library"
    className="start-path-card"
  >

    <span>02</span>

    <div className="path-role">
      Researcher
    </div>

    <p>
     "Frameworks, breakdowns, and collected insights on brand,
        psychology, and creative systems."
    </p>

  </Link>

  <Link
    href="/journal"
    className="start-path-card"
  >

    <span>03</span>

    <div className="path-role">
      Reader
    </div>

    <p>
     "Essays and reflections from the process of building
                brands, stories, and worlds."
    </p>

  </Link>

  <Link
    href="/connect"
    className="start-path-card"
  >

    <span>04</span>

    <div className="path-role">
      Builder
    </div>

    <p>
      "If you're working on something and want a thinking
                partner — start here."
    </p>

  </Link>

</section>


<div className="section-divider" />

{/* JOURNEY */}

<section className="start-journey">

  <p className="start-label">
    A Typical Journey
  </p>

  <div className="journey-list">

    <div className="journey-step">

      <span>01</span>

      <div>

        <h3>
          Discover An Idea
        </h3>

        <p>
          Everything begins with curiosity.
        </p>

      </div>

    </div>

    <div className="journey-step">

      <span>02</span>

      <div>

        <h3>
          Explore The Archive
        </h3>

        <p>
          Research, frameworks,
          and collected insights.
        </p>

      </div>

    </div>

    <div className="journey-step">

      <span>03</span>

      <div>

        <h3>
          Read The Reflections
        </h3>

        <p>
          Essays and observations
          from the journey.
        </p>

      </div>

    </div>

    <div className="journey-step">

      <span>04</span>

      <div>

        <h3>
          Enter The Worlds
        </h3>

        <p>
          Experience how ideas evolve
          into ecosystems.
        </p>

      </div>

    </div>

  </div>

</section>

<div className="section-divider" />

    <section className="start-editorial-image">
  <img
    src="/images/start-here/library.jpg"
    alt="Editorial atmosphere"
  />
</section>

      {/* PHILOSOPHY */}

      <section className="start-philosophy">

        <blockquote>

          Every brand world begins with a question someone
        was brave enough to answer honestly.

        </blockquote>

      </section>

       {/* START NEXT*/}

      <section className="start-next">


  <p className="start-label">
    Recommended Starting Point
  </p>

  <h2>
    Begin with the Journal.
  </h2>

  <p>

    Most people understand the thinking before they understand
        the worlds. The journal is where the thinking lives.

  </p>

  <Link
    href="/journal"
    className="start-button"
  >
    Explore Our Archive"
  </Link>

</section>

<div className="section-divider" />

      {/* SIGNATURE */}

      <section className="start-signature">

  <h2 className="start-handwriting">
    Every world starts
    <br />
    as a single thought.
  </h2>

  <div className="start-line" />

   <p className="start-handwriting">
      Jessica Francois
    </p>

  <span>
    Creative Strategist • Brand Architect"
  </span>

</section>

    </main>
  )
}