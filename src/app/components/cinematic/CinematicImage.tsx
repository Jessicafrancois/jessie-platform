type Props = {
  image: string
  height?: string
}

export default function CinematicImage({
  image,
  height = '90vh',
}: Props) {
  return (
    <section className="cinematic-section reveal">

      <div
        className="fullscreen-media section-dark"
        style={{
          height,
        }}
      >

        <img
          className="parallax"
          src={image}
          alt=""
        />

      </div>

    </section>
  )
}