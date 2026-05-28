type Props = {
  body: string[]
}

export default function EssayBody({
  body,
}: Props) {

  return (
    <section className="cinematic-section cinematic-container">

      <div
        className="constraint-sm"
        style={{
          margin: '0 auto',
        }}
      >

        {body.map((paragraph, index) => (

          <p
            key={index}
            className="editorial-copy"
            style={{
              marginBottom: '3rem',

              fontSize: '1.08rem',

              lineHeight: '2',
            }}
          >
            {paragraph}
          </p>

        ))}

      </div>

    </section>
  )
}