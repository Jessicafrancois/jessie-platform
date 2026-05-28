type Props = {
  title: string
  text: string
}

export default function FounderStatement({
  title,
  text,
}: Props) {
  return (
    <section
      className="cinematic-section cinematic-container reveal"
      style={{
        paddingTop: '16rem',
        paddingBottom: '16rem',
      }}
    >

      <div
        style={{
          maxWidth: '1100px',
        }}
      >

        <div className="cinematic-kicker">
          {title}
        </div>

        <p
          style={{
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            lineHeight: '0.9',
            letterSpacing: '-0.06em',
          }}
        >
          {text}
        </p>

        className="reveal reveal-delay-1"
      </div>

    </section>
  )
}