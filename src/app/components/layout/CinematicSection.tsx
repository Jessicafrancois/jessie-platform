type Props = {
  text: string
}

export default function CinematicStatement({
  text,
}: Props) {
  return (
    <section
      className="cinematic-section reveal"
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >

      <div className="cinematic-container">

        <p
          style={{
            fontSize: 'clamp(2rem, 6vw, 6rem)',
            lineHeight: '0.95',
            maxWidth: '10ch',
            letterSpacing: '-0.06em',
          }}
        >
          {text}
        </p>

      </div>

    </section>
  )
}