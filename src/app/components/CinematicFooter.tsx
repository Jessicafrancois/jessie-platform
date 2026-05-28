export default function CinematicFooter() {
  return (
    <footer
      className="cinematic-section"
      style={{
        paddingBottom: '6rem',
      }}
    >

      <div className="cinematic-container">

        <div className="fade-divider" />

        <div
          style={{
            paddingTop: '5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >

          <div>

            <div
              style={{
                fontSize: '2rem',
                marginBottom: '1rem',
              }}
            >
              Jessica Francois
            </div>

            <p className="editorial-copy">
              Building immersive narrative systems
              for the next generation of ventures.
            </p>

          </div>

          <div
            style={{
              color: 'rgba(230,226,215,0.5)',
            }}
          >
            Narrative Worlds © 2026
          </div>

        </div>

      </div>

    </footer>
  )
}