import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageBackLink from '@/components/navigation/PageBackLink'
import './project-detail.css'

export const revalidate = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url: RequestInfo | URL, options?: RequestInit) =>
        fetch(url, { ...options, next: { revalidate: 60 } } as RequestInit),
    },
  }
)

type Props = { params: Promise<{ slug: string }> }

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  if (projectError) console.error('project error:', projectError)
  if (!project) notFound()

  // Related entries
  const { data: entries, error: entriesError } = await supabase
    .from('entries')
    .select('id, title, slug, intro, type, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(4)

  if (entriesError) console.error('entries error:', entriesError)

  return (
    <main className="project-detail">
      <PageBackLink />

      {/* HERO */}
      <section className="project-detail-hero">
        {project.image ? (
          <div className="project-detail-cover">
            <img src={project.image} alt={project.title} />
            <div className="project-detail-cover-overlay" />
          </div>
        ) : (
          <div className="project-detail-cover project-detail-cover--empty" />
        )}

        <div className="project-detail-hero-content">
          <div className="project-detail-meta">
            {project.year && <span>{project.year}</span>}
            {project.category && <span>{project.category}</span>}
            <span
              className={`project-detail-status project-detail-status--${
                project.status?.toLowerCase().replace(/\s+/g, '-') || 'active'
              }`}
            >
              {project.status || 'Active'}
            </span>
          </div>
          <h1 className="project-detail-title">{project.title}</h1>
          <p className="project-detail-intro">{project.description}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="project-detail-body">

        {project.story && (
          <div className="project-detail-section">
            <span className="project-detail-section-label">Overview</span>
            <p>{project.story}</p>
          </div>
        )}

        {project.challenge && (
          <div className="project-detail-section">
            <span className="project-detail-section-label">The Challenge</span>
            <p>{project.challenge}</p>
          </div>
        )}

        {project.solution && (
          <div className="project-detail-section">
            <span className="project-detail-section-label">The Strategy</span>
            <p>{project.solution}</p>
          </div>
        )}

        {project.outcome && (
          <div className="project-detail-section">
            <span className="project-detail-section-label">The Outcome</span>
            <p>{project.outcome}</p>
          </div>
        )}

      </section>

      {/* RELATED ENTRIES */}
      {entries && entries.length > 0 && (
        <section className="project-detail-related">
          <p className="project-detail-related-label">From The Archive</p>
          <h2>Related Writing</h2>
          <div className="project-detail-entries">
            {entries.map(entry => (
              <Link
                key={entry.id}
                href={`/journal/${entry.slug}`}
                className="project-detail-entry-card"
              >
                <span className="project-detail-entry-type">
                  {entry.type || 'Essay'}
                </span>
                <h3>{entry.title}</h3>
                <p>{entry.intro}</p>
                <span>Read →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BACK */}
      <section className="project-detail-back">
        <Link href="/projects" className="project-detail-back-link">
          ← All Projects
        </Link>
      </section>

    </main>
  )
}