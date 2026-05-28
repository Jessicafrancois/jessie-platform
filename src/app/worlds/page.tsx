<CinematicNav />  

import WorldCard from '../components/WorldCard'
<section
  className="cinematic-section cinematic-container"
  style={{
    paddingTop: '12rem',
  }}
>

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14rem',
    }}
  >

    <WorldCard
      title="Muse Studios"
      description="An immersive ecosystem exploring cinematic storytelling, founder mythology, and emotional narrative systems."
      image="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=1800&auto=format&fit=crop"
    />

    <WorldCard
      title="Roadwise"
      description="A narrative-driven platform exploring movement, transformation, healing, and identity through experiential storytelling."
      image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop"
    />

    <WorldCard
      title="Innovative Ventures"
      description="Immersive venture ecosystems designed around emotional gravity, experiential design, and strategic world-building."
      image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1800&auto=format&fit=crop"
    />

  </div>

</section>

export default function WorldsPage() {
  return (
    <main className="cinematic-page">

      <CinematicPageShell
        kicker="Worlds"
        title="Every venture deserves a world."
        subtitle="Cinematic ecosystems designed for emotional connection and immersion."
      />

    </main>
  )
}