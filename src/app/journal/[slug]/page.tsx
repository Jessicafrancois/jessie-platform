import { notFound } from 'next/navigation'

import Navbar from '../../../components/Navbar'

import '../journal.css'

import Link from 'next/link'

import { getEssayBySlug } from '../../../lib/essays'

import EssayRenderer from '../../../components/essay/EssayRenderer'
import { supabase } from '@/lib/supabase'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function EssayPage({
  params,
}: Props) {

const { slug } =
  await params

console.log(
  'Slug:',
  slug
)

const essay =
  await getEssayBySlug(
    slug
  )

  if (!essay) {
    notFound()
  }

  const { data: relatedEntries } = await supabase
    .from('entries')
    .select('*')
.eq(
  'collection',
  essay.collection || ''
)
  const relatedEssays = (relatedEntries?.filter((related: any) => related.slug !== essay.slug) || []).slice(0, 3)

  return (
    <main className="essay-page">

      <Navbar />

      {/* HERO */}

      <section className="essay-hero">

        <div className="essay-hero-image-wrap">

          {essay.image && (
  <img
    src={essay.image}
    alt={essay.title}
    className="essay-hero-image"
  />
)}

          <div className="essay-overlay" />

        </div>

        <div className="essay-hero-content">

          <p className="essay-meta">
            Immersive Essay
          </p>
        <div className="article-breadcrumbs">

            <Link href="/journal">
              Journal
            </Link>

            <span>→</span>

            <Link
              href={`/library/${essay.collection.toLowerCase()}`}
            >
              {essay.collection}
            </Link>

            <span>→</span>

            <span>
              {essay.title}
            </span>

          </div>

          <h1 className="essay-title">
            {essay.title}
          </h1>

          <p className="essay-intro">
            {essay.intro}
          </p>

        </div>

      </section>

      {/* BODY */}

      <section className="essay-body">

        <div className="essay-grid">

          <EssayRenderer
            blocks={essay.content}
          />

        </div>

      </section>

      <section className="related-reading">

  <p className="related-kicker">
    Continue Exploring
  </p>

  <h2>
    More From The {essay.collection} Collection
  </h2>

  <div className="related-grid">

    {relatedEssays.map((related: any) => (

      <Link
        key={related.id}
        href={`/journal/${related.slug}`}
        className="related-card"
      >

        <span className="related-type">
          {related.type || 'Essay'}
        </span>

        <h3>
          {related.title}
        </h3>

        <p>
          {related.intro}
        </p>

      </Link>

    ))}

  </div>

</section>

    </main>
  )
}