export default function HomeHero() {
  return (
    <section className="cinematic-hero cinematic-container">

      <div
        className="ambient-glow glow-bronze"
        style={{
          top: '-10%',
          right: '-10%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.25,
          zIndex: 0,
        }}
      >

        <img
          className="parallax"
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

      </div>

      <div className="cinematic-hero-content reveal">

        <div className="cinematic-kicker">
          Founder • Strategist • World Builder
        </div>

        <h1 className="cinematic-title">
          Building worlds people emotionally belong to.
        </h1>

        <p className="cinematic-subtitle">
          Immersive worlds for visionary ventures.
        </p>

      </div>

    </section>
  )
}