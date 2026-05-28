
type Props = {
  quote?: string
  author?: string
}

export default function DashboardHero({
  quote,
  author,
}: Props) {

  return (

    <div className="dashboard-hero glass-card">

      <p className="dashboard-label">
        Today's Spark
      </p>

      <h1>
        {quote}
      </h1>

      <span>
        {author}
      </span>

    </div>

  )
}