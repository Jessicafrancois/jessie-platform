import { supabase } from '@/lib/supabase'

// Local fallback for StackedCardCarousel and CarouselProject type to avoid
// module resolution errors. Kept simple and self-contained so this page
// continues to work if the original component can't be resolved.
export type CarouselProject = {
  id: string
  number: string
  year: string
  category: string
  type: string
  title: string
  description: string
  slug: string
  image?: string | null
}

function StackedCardCarousel({
  projects,
  headline,
  section,
}: {
  projects: CarouselProject[]
  headline: string
  section?: string
}) {
  return (
    <main className="stacked-card-carousel">
      {section && <div className="section">{section}</div>}
      <h2 className="headline">{headline}</h2>
      <div className="cards">
        {projects.map((p) => (
          <article key={p.id} className="card">
            {p.image && <img src={p.image} alt={p.title} />}
            <div className="meta">
              <div className="number">{p.number}</div>
              <h3>{p.title}</h3>
              <p className="desc">{p.description}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export const revalidate = 0

export default async function ProjectsDashboardPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, slug, description, category, year, cover_image')
    .order('sort_order', { ascending: true })

  if (error) console.error('PROJECTS DASHBOARD ERROR:', error)

  const projectsList = projects ?? []

  if (projectsList.length === 0) {
    return (
      <main className="projects-dashboard-empty">
        <h1>No projects yet</h1>
        <p>Create a project to see it appear here as a card.</p>
      </main>
    )
  }

  const cards: CarouselProject[] = projectsList.map((p, i) => ({
    id: p.id,
    number: String(i + 1).padStart(2, '0'),
    year: p.year || '2026',
    category: p.category || 'Brand',
    type: 'Case Study',
    title: p.title,
    description: p.description || '',
    slug: p.slug || p.id,
    image: p.cover_image ?? undefined,
  }))

  return (
    <StackedCardCarousel
      projects={cards}
      headline={'Designs That Blend\nCreativity & Functionality'}
      section="PROJECTS"
    />
  )
}