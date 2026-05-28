import CinematicLayout from '../components/CinematicLayout'
import CinematicPageShell from '../components/CinematicPageShell'
import CinematicFooter from '../components/CinematicFooter'
import CinematicStatement from '../components/CinematicStatement'

export default function ConnectPage() {
  return (
    <CinematicLayout>

      <CinematicPageShell
        kicker="Connect"
        title="Let’s build experiences people emotionally remember."
        subtitle="Immersive ventures, narrative ecosystems, and cinematic storytelling."
      />

      <CinematicStatement
        text="The strongest ventures create emotional gravity."
      />

      <section
        className="cinematic-section cinematic-container reveal"
        style={{
          paddingBottom: '14rem',
        }}
      >

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem',
            maxWidth: '900px',
          }}
        >

          <div>

            <div className="cinematic-kicker">
              Email
            </div>

            <a
              href="mailto:hello@yourdomain.com"
              style={{
                fontSize: 'clamp(2rem, 4vw, 4rem)',
                lineHeight: '1',
                letterSpacing: '-0.05em',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              hello@yourdomain.com
            </a>

          </div>

          <div>

            <div className="cinematic-kicker">
              Instagram
            </div>

            <a
              href="#"
              style={{
                fontSize: 'clamp(2rem, 4vw, 4rem)',
                lineHeight: '1',
                letterSpacing: '-0.05em',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              @jessicafrancois
            </a>

          </div>

        </div>

      </section>

      <CinematicFooter />

    </CinematicLayout>
  )
}