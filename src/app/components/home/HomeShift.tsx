export default function HomeShift() {
  return (
    <section
      className="cinematic-section reveal section-dark"
      style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div
        className="ambient-glow glow-forest"
        style={{
          top: '10%',
          left: '-10%',
        }}
      />

      <div
        className="cinematic-container"
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >

        <div
          style={{
            maxWidth: '1000px',
          }}
        >

          <div className="cinematic-kicker">
            The Shift
          </div>

          <h2
            style={{
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              lineHeight: '0.92',
              letterSpacing: '-0.06em',
              marginBottom: '3rem',
            }}
          >
            The internet is evolving
            from information
            into emotion.
          </h2>

          <p
            className="editorial-copy"
            style={{
              maxWidth: '620px',
            }}
          >
            Static websites are disappearing.
            Experiences are becoming immersive,
            cinematic, and emotionally alive.
          </p>

        </div>

      </div>

    </section>
  )
}