type Props = {
  image: string
}

export default function EssayFeatureImage({
  image,
}: Props) {

  return (
    <section className="cinematic-section">

      <div
        className="fullscreen-media"
        style={{
          height: '90vh',
        }}
      >

        <img
          src={image}
          alt=""
        />

      </div>

    </section>
  )
}