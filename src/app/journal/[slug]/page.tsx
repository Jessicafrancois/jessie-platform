import { notFound } from 'next/navigation'

import Navbar from '../../../components/Navbar'

import '../journal.css'

import { getEssayBySlug } from '../../../lib/essays'

import EssayRenderer from '../../../components/essay/EssayRenderer'

type Props = {
  params: {
    slug: string
  }
}

export default async function EssayPage({
  params,
}: Props) {

  const essay = await getEssayBySlug(
    params.slug
  )

  if (!essay) {
    notFound()
  }

  return (
    <main className="essay-page">

      <Navbar />

      {/* HERO */}

      <section className="essay-hero">

        <div className="essay-hero-image-wrap">

          <img
            src={essay.image}
            alt={essay.title}
            className="essay-hero-image"
          />

          <div className="essay-overlay" />

        </div>

        <div className="essay-hero-content">

          <p className="essay-meta">
            Immersive Essay
          </p>

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

    </main>
  )
}