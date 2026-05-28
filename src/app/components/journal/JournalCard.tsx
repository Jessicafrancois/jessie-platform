type Props = {
  title: string
  description: string
  image: string
}

export default function JournalCard({
  title,
  description,
  image,
}: Props) {
  return (
    <article
      className="journal-card reveal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >

      <div className="fullscreen-media section-dark">

        <img
          className="parallax"
          src={image}
          alt={title}
        />

      </div>

      <div
        style={{
          maxWidth: '760px',
        }}
      >

        <div className="cinematic-kicker">
          Journal Entry
        </div>

        <h2
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            lineHeight: '0.95',
            letterSpacing: '-0.05em',
            marginBottom: '1.5rem',
          }}
        >
          {title}
        </h2>

        <p className="editorial-copy">
          {description}
        </p>

        <div
          style={{
            marginTop: '2rem',
            color: 'var(--bronze)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          Enter Story →
        </div>

      className="reveal reveal-delay-1"
      </div>

    </article>
  )
}