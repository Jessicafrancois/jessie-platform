export default function HomeGallery() {
  return (
    <section className="cinematic-section cinematic-container reveal">

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2rem',
          alignItems: 'center',
        }}
      >

        <div className="fullscreen-media section-dark">

          <img
            className="parallax"
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1800&auto=format&fit=crop"
            alt=""
          />

        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >

          <div
            className="fullscreen-media section-dark"
            style={{ height: '28vh' }}
          >

            <img
              className="parallax"
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
              alt=""
            />

          </div>

          <div
            className="fullscreen-media section-dark"
            style={{ height: '28vh' }}
          >

            <img
              className="parallax"
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop"
              alt=""
            />

          </div>

        </div>

      </div>

    </section>
  )
}