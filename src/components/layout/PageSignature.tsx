interface PagePhilosophyProps {
  quote: string
}

export default function PagePhilosophy({
  quote
}: PagePhilosophyProps) {
  return (
    <section className="page-philosophy">

      <blockquote>
        {quote}
      </blockquote>

    </section>
  )
}