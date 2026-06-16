interface PageHeroProps {
  label: string
  title: string
  intro: string
}

export default function PageHero({
  label,
  title,
  intro
}: PageHeroProps) {
  return (
    <section className="page-hero">

      <p className="page-label">
        {label}
      </p>

      <h1 className="page-title">
        {title}
      </h1>

      <p className="page-intro">
        {intro}
      </p>

    </section>
  )
}