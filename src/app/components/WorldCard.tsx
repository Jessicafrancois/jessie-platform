type Props = {
  title: string
  description: string
  image: string
}

export default function WorldCard({
  title,
  description,
  image,
}: Props) {
  return (
    <div
      className="reveal"
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
          maxWidth: '700px',
        }}
      >

        <div className="cinematic-kicker">
          Venture World
        </div>

        <h2 className="editorial-heading">
          {title}
        </h2>

        <p className="editorial-copy">
          {description}
        </p>
      className="reveal reveal-delay-1"
      </div>

    </div>
  )
}