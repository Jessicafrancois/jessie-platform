type Props = {
  title: string
  description: string
  image: string
}

export default function FeaturedEssay({
  title,
  description,
  image,
}: Props) {
  return (
    <section
      className="reveal"
      style={{
        marginBottom: '10rem',
      }}
    >

      <div
        className="fullscreen-media"
        style={{
          height: '72vh',
          marginBottom: '3rem',
        }}
      >

        <img
          src={image}
          alt={title}
        />

      </div>

      <div
        style={{
          maxWidth: '820px',
        }}
      >

        <div className="cinematic-kicker">
          Featured Essay
        </div>

        <h2
          style={{
            fontSize: 'clamp(3rem, 6vw, 6rem)',
            lineHeight: '0.92',
            letterSpacing: '-0.06em',
            marginBottom: '2rem',
          }}
        >
          {title}
        </h2>

        <p className="editorial-copy">
          {description}
        </p>

      </div>

    </section>
  )
}