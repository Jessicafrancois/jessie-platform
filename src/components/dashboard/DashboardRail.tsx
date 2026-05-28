
type Inquiry = {
  name: string
  email: string
  company: string
}

type Props = {
  inquiries: Inquiry[]
}

export default function DashboardRail({
  inquiries,
}: Props) {

  const latestInquiry =
    inquiries[0]

  return (

    <aside className="dashboard-rail">

      <div className="glass-card rail-card">

        <p className="dashboard-label">
          Inquiries
        </p>

        <h3>
          {inquiries.length} Active Leads
        </h3>

        <span>

          {latestInquiry
            ? latestInquiry.name
            : 'No inquiries yet.'}

        </span>

      </div>

      <div className="glass-card rail-card">

        <p className="dashboard-label">
          Latest Contact
        </p>

        <h3>
          {latestInquiry?.company || 'Waiting'}
        </h3>

        <span>
          {latestInquiry?.email || 'No recent lead'}
        </span>

      </div>

    </aside>

  )
}
