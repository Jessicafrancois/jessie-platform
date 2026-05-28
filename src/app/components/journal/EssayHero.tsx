type Props = {
  title: string
  intro: string
}

export default function EssayHero({
  title,
  intro,
}: Props) {

  return (
    <section
      className="cinematic-section cinematic-container"
      style={{
        paddingTop: '16rem',
        paddingBottom: '8rem',
      }}
    >

      <div className="constraint-lg">

        <div className="cinematic-kicker">
          Essay
        </div>

        <h1
          className="display-xl balance"
          style={{
            maxWidth: '10ch',
            marginBottom: '2rem',
          }}
        >
          {title}
        </h1>

        <p
          className="editorial-copy"
          style={{
            maxWidth: '720px',
          }}
        >
          {intro}
        </p>

      </div>

    </section>
  )
}