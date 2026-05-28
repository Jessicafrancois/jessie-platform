type Props = {
  quote: string
}

export default function EssayQuote({
  quote,
}: Props) {

  return (
    <section className="cinematic-section cinematic-container">

      <blockquote
        className="display-lg balance"
        style={{
          maxWidth: '12ch',

          lineHeight: '1',

          borderLeft:
            '2px solid var(--bronze)',

          paddingLeft: '2rem',
        }}
      >
        {quote}
      </blockquote>

    </section>
  )
}