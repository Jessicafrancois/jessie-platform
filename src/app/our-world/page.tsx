import './our-world.css'
import WorldSlider from '@/components/worlds/WorldSlider'

import PageBackLink from '@/components/navigation/PageBackLink'

export default function OurWorldPage() {
  return (
    <main className="world-page">
      <PageBackLink />

      <section className="world-hero">
        <div className="world-bg-word">WORLDS</div>
        <div className="world-hero-content">
          <span className="world-label">World Index</span>
          <h1>Our World</h1>
          <p>
           A collection of ventures,
            universes, and ideas, built with intention, connected by
            purpose.
          </p>
        </div>
      </section>

      {/* WorldSlider is now connected to Supabase */}
      <WorldSlider />

      <section className="world-signature">
        <p>Worlds are built long before they are seen.</p>
      </section>

    </main>
  )
}