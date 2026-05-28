type Props = {
  text: string

  align?: 'left' | 'center'
}

export default function CinematicStatement({
  text,
  align = 'left',
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

      <div
        className="cinematic-container"
        style={{
          textAlign:
            align === 'center'
              ? 'center'
              : 'left',
        }}
      >

        <p
          className="display-xl balance"
          style={{
            maxWidth:
              align === 'center'
                ? '14ch'
                : '10ch',

            margin:
              align === 'center'
                ? '0 auto'
                : '0',
          }}
        >
          {text}
        </p>

      </div>

    </section>
  )
}