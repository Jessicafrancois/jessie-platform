type Props = {
  kicker: string
  title: string
  subtitle?: string
}

export default function CinematicPageShell({
  kicker,
  title,
  subtitle,
}: Props) {
  return (
    <section
      className="cinematic-section"
      style={{
        paddingTop: '16rem',
        paddingBottom: '10rem',
      }}
    >

      <div className="cinematic-container">

        <div className="cinematic-kicker">
          {kicker}
        </div>

        <h1
          className="cinematic-title"
          style={{
            maxWidth: '11ch',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="cinematic-subtitle"
            style={{
              marginTop: '2rem',
            }}
          >
            {subtitle}
          </p>
        )}

      </div>

    </section>
  )
}