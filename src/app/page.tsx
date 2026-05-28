'use client'

import Link from 'next/link'
import './home.css'

export default function HomePage() {

  return (

    <main className="home-page">

      {/* HERO */}

      <section className="home-hero">

        <div className="home-noise" />

        <div className="home-hero-content">

          <p className="home-kicker">
            IMMERSIVE NARRATIVE SYSTEMS
          </p>

          <h1 className="home-title">
            The future of the internet is emotional.
          </h1>

          <p className="home-intro">
            Building cinematic digital worlds,
            immersive founder ecosystems,
            and narrative-driven creative infrastructure.
          </p>

        </div>

        <div className="home-hero-image">

          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1800&auto=format&fit=crop"
            alt=""
          />

        </div>

      </section>

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

      {/* LINKS */}

      <section className="home-links-section">

        <Link
          href="/journal"
          className="home-card"
        >

          <div className="home-card-image">

            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1800&auto=format&fit=crop"
              alt=""
            />

          </div>

          <div className="home-card-content">

            <p className="home-label">
              Journal
            </p>

            <h3>
              Essays on immersive storytelling
              and emotional systems.
            </h3>

          </div>

        </Link>

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

        <div className="home-footer-grid">

          <div className="home-footer-nav-column">

            <p className="home-label">
              Navigation
            </p>

            <div className="home-footer-nav">

              <Link href="/">
                Home
              </Link>

              <Link href="/journal">
                Journal
              </Link>

              <Link href="/contact">
                Contact
              </Link>

              <Link href="/dashboard">
                Dashboard
              </Link>

            </div>

          </div>

          <div className="home-footer-signature">

            <p className="home-label">
              Signature
            </p>

            <h2>
              Building worlds that emotionally linger.
            </h2>

            <p>
              Jessie Platform is an evolving ecosystem
              focused on immersive storytelling,
              cinematic digital experiences,
              and emotional infrastructure.
            </p>

          </div>

          <div className="home-footer-meta">

            <p>
              Jessie Platform
            </p>

            <p>
              © 2026
            </p>

            <p>
              Emotional Systems
            </p>

          </div>

        </div>

      </footer>

    </main>
  )
}