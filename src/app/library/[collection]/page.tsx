import Link from 'next/link'
import { getPublishedEssays } from '../../../lib/essays'
import './collection.css'

type PageProps = {
  params: Promise<{
    collection: string
  }>
}

export default async function CollectionPage({
  params,
}: PageProps) {

  const { collection } = await params

  const essays = await getPublishedEssays()

  const collectionEssays = essays.filter(
    (essay: any) =>
      essay.collection?.toLowerCase() ===
      collection.toLowerCase()
  )

  const collectionDescriptions: Record<string, string> = {
  psychology:
    'Exploring human behavior, identity, emotion, motivation, and decision making.',

  business:
    'Strategy, ventures, creative ecosystems, and experience design.',

  worldbuilding:
    'Narrative systems, immersive experiences, stories, and fictional worlds.',

  archive:
    'Observations, reflections, field notes, experiments, and lessons learned.',
}

const featuredEssay =
  collectionEssays[0]


  const collectionData = {
  psychology: {
    title: 'The Psychology Collection',
    description:
      'Identity, behavior, motivation, and decision making.',

    backgroundWord: 'MIND',

    image:
      '/images/collections/psychology.jpg'
  },

  worldbuilding: {
    title: 'The Worldbuilding Collection',
    description:
      'Stories, systems, worlds, and experiences.',

    backgroundWord: 'WORLDS',

    image:
      '/images/collections/worldbuilding.jpg'
  },

  business: {
    title: 'The Business Collection',
    description:
      'Strategy, ventures, architecture, and growth.',

    backgroundWord: 'BUILD',

    image:
      '/images/collections/business.jpg'
  }
}

const collectionKey =
  collection.toLowerCase() as keyof typeof collectionData

const currentCollection =
  collectionData[collectionKey]

  currentCollection?.title
  currentCollection?.description
  currentCollection?.backgroundWord
  currentCollection?.image

console.log(collection)
console.log(
  essays.map(
    essay => essay.collection
  )
)


  return (
    <main className="collection-shell">

       {/* COLLECTION HERO */}

 <section className="collection-hero">

        <div className="collection-cover">

  <img
    src={currentCollection?.image}
    alt={currentCollection?.title}
  />

</div>

  <div className="collection-bg-word">
    {currentCollection?.backgroundWord}
  </div>

  <p className="collection-kicker">
    Archive Collection
  </p>

  <h1 className="collection-title">
    {currentCollection?.title || collection}
  </h1>

  <p className="collection-description">
    {
      currentCollection?.description ||
      'A curated collection of essays, notes, and discoveries.'
    }
  </p>

    <div className="collection-stat">

      <span className="stat-number">
        {collectionEssays.length}
      </span>

      <span className="stat-label">
        Entries
      </span>

    </div>

</section>


 {/* COLLECTION FEATURE */}


<section className="collection-featured">

  <span>
    Featured Entry
  </span>

  <h2>
    {featuredEssay?.title}
  </h2>

  <p>
    {featuredEssay?.intro}
  </p>

</section>

  <section className="collection-empty">

    <p className="collection-kicker">
      Coming Soon
    </p>

    <h2>
      This collection is currently being assembled.
    </h2>

    <p>
      Essays, research notes, observations,
      and discoveries will appear here as
      the archive grows.
    </p>

  </section>


<section className="article-navigation">

  <Link
    href={`/library/${collection.toLowerCase()}`}
    className="article-nav-card"
  >

    <span>
      Return to Collection
    </span>

    <h3>
      {currentCollection?.title || collection}
    </h3>

  </Link>

</section>


 {/* COLLECTION FEED */}

      <section className="collection-feed">

        {collectionEssays.map((essay: any) => (

          <Link
              key={essay.id}
              href={`/journal/${essay.slug}`}
              className="collection-card"
            >

              <span className="entry-type">
                {essay.type || 'Essay'}
              </span>

              <h3>
                {essay.title}
              </h3>

              <p>
                {essay.intro}
              </p>

              <span className="entry-link">
                Continue Reading →
              </span>

            </Link>

        ))}

      </section>


    </main>
  )
}