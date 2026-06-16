import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageBackLink from '@/components/navigation/PageBackLink'
import './world-detail.css'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export default async function WorldDetailPage({ params }: Props) {
  const { slug } = await params

  const { data: world } = await supabase
    .from('worlds')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  if (!world) notFound()

  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, slug, excerpt, entry_type, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, description, cover_image')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <main className="world-detail">
      <PageBackLink />

      {/* HERO */}
      <section className="world-detail-hero">
        {world.cover_image ? (
          <div className="world-detail-cover">
            <img src={world.cover_image} alt={world.title} />
            <div className="world-detail-cover-overlay" />
          </div>
        ) : (
          <div className="world-detail-cover world-detail-cover--empty" />
        )}

        <div className="world-detail-hero-content">
          <span className="world-detail-type">{world.type}</span>
          <h1 className="world-detail-title">{world.title}</h1>
          <p className="world-detail-intro">{world.description}</p>
        </div>
      </section>

      {/* NARRATIVE */}
      {(world.philosophy || world.narrative || world.vision) && (
        <section className="world-detail-narrative">
          {world.philosophy && (
            <div className="world-detail-section">
              <span className="world-detail-section-label">Philosophy</span>
              <p>{world.philosophy}</p>
            </div>
          )}
          {world.narrative && (
            <div className="world-detail-section">
              <span className="world-detail-section-label">The Story</span>
              <p>{world.narrative}</p>
            </div>
          )}
          {world.vision && (
            <div className="world-detail-section">
              <span className="world-detail-section-label">The Vision</span>
              <p>{world.vision}</p>
            </div>
          )}
        </section>
      )}

      {/* RELATED PROJECTS */}
      {projects && projects.length > 0 && (
        <section className="world-detail-projects">
          <p className="world-detail-related-label">Projects</p>
          <h2>Built Inside This World</h2>
          <div className="world-detail-projects-grid">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.slug || project.id}`}
                className="world-detail-project-card"
              >
                {project.cover_image ? (
                  <img src={project.cover_image} alt={project.title} className="world-detail-project-cover" />
                ) : (
                  <div className="world-detail-project-cover world-detail-project-cover--empty" />
                )}
                <div className="world-detail-project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span>View Project →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RELATED ENTRIES */}
      {entries && entries.length > 0 && (
        <section className="world-detail-entries">
          <p className="world-detail-related-label">From The Archive</p>
          <h2>Related Writing</h2>
          <div className="world-detail-entries-grid">
            {entries.map(entry => (
              <Link
                key={entry.id}
                href={`/journal/${entry.slug}`}
                className="world-detail-entry-card"
              >
                <span className="world-detail-entry-type">{entry.entry_type || 'Essay'}</span>
                <h3>{entry.title}</h3>
                <p>{entry.excerpt}</p>
                <span className="world-detail-entry-cta">Read →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="world-detail-signature">
        <p>Worlds are built long before they are seen.</p>
        <Link href="/our-world" className="world-detail-back-link">← All Worlds</Link>
      </section>

    </main>
  )
}