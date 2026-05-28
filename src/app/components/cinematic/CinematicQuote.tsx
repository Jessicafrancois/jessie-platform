type Props = {
  quote: string
}

export default function CinematicQuote({
  quote,
}: Props) {
  return (
    <section className="cinematic-section reveal">

      <div className="cinematic-container">

        <blockquote className="quote-block">
          {quote}
        </blockquote>

      </div>

    </section>
  )
}