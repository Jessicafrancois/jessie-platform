import { essays } from "@/src/data/essays"

<DashboardEssays
  essays={essays}
/>

type Essay = {
  title: string
  slug: string
}

type Props = {
  essays: Essay[]
}

export default function DashboardEssays({
  essays,
}: Props) {

  return (

    <div className="dashboard-module glass-card">

      <p>
        Recent Essays
      </p>

      <h2>
        Latest Writing
      </h2>

      <div className="essay-list">

        {essays.map((essay) => (

          <a
            key={essay.slug}
            href={`/journal/${essay.slug}`}
            className="essay-link"
          >

            {essay.title}

          </a>

        ))}

      </div>

    </div>

  )
}

