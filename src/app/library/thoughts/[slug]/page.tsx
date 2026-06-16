import Link from 'next/link'

export default async function CaseFilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

const caseFiles = {
  barbie: {
    title: "Barbie",
    category: "Campaign Breakdown",
    overview:
      "How Barbie transformed from a film release into a cultural event."
  },

  duolingo: {
    title: "Duolingo",
    category: "Campaign Breakdown",
    overview:
      "How Duolingo turned a mascot into a media brand."
  },

  "liquid-death": {
    title: "Liquid Death",
    category: "Campaign Breakdown",
    overview:
      "Building a beverage company through narrative and attention."
  }
}

  const file = caseFiles[
    slug as keyof typeof caseFiles
  ]

  if (!file) {
    return <main>Case file not found.</main>
  }

  return (
    <main className="case-file-page">

      {/* content */}


<section className="case-file-header">

  <p className="case-file-label">
    Archive Entry
  </p>

  <h1>
    {file.title}
  </h1>

  <p>
    {file.overview}
  </p>

</section>

<section className="case-file-summary">

  <h2>
    Executive Summary
  </h2>

  <p>
    One paragraph explaining
    why this campaign matters.
  </p>

</section>

<section className="campaign-snapshot">

  <div>

    <span>Brand</span>

    <strong>Barbie</strong>

  </div>

  <div>

    <span>Industry</span>

    <strong>Entertainment</strong>

  </div>

  <div>

    <span>Focus</span>

    <strong>Community Building</strong>

  </div>

  <div>

    <span>Year</span>

    <strong>2023</strong>

  </div>

</section>

<section className="case-file-overview">

  <div>

    <span>Collection</span>

    <strong>
      Thoughts
    </strong>

  </div>

  <div>

    <span>Type</span>

    <strong>
      Campaign Breakdown
    </strong>

  </div>

  <div>

    <span>Status</span>

    <strong>
      Active
    </strong>

  </div>

</section>

<section className="case-file-section">

  <h2>
    Context
  </h2>

  <p>
    Why this campaign existed.
  </p>

</section>

<section className="case-file-notes">

  <h2>
    Notes
  </h2>

  <ul>

    <li>
      Community amplified the message.
    </li>

    <li>
      Participation mattered more than reach.
    </li>

    <li>
      Story preceded promotion.
    </li>

  </ul>

</section>

<section className="case-file-observations">

  <h2>
    Observations
  </h2>

  <ul>

    <li>
      Observation One
    </li>

    <li>
      Observation Two
    </li>

    <li>
      Observation Three
    </li>

  </ul>

</section>

<section className="case-file-framework">

  <h2>
    Framework
  </h2>

  <div className="framework-steps">

    <div>Attention</div>

    <div>Participation</div>

    <div>Community</div>

    <div>Identity</div>

  </div>

</section>

<section className="case-file-applications">

  <h2>
    Applications
  </h2>

  <ul>

    <li>
      Muse Studios
    </li>

    <li>
      Roadwise
    </li>

    <li>
      Future Ventures
    </li>

  </ul>

</section>

<section className="archive-notes">

  <h2>
    Notes
  </h2>

  <p>
    Additional thoughts,
    questions,
    observations,
    and references.
  </p>

</section>

<section className="related-files">

  <p className="case-file-label">
    Related Files
  </p>

  <Link href="/library/thoughts/duolingo">
    Duolingo
  </Link>

  <Link href="/library/thoughts/liquid-death">
    Liquid Death
  </Link>

</section>

    </main>
  )
}