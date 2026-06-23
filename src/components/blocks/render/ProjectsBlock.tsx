import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProjectsContent } from '@/lib/blocks/types'

export default async function ProjectsBlock({ content }: { content: ProjectsContent }) {
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, slug, cover_image, category')
    .order('sort_order', { ascending: true })
    .limit(content.limit || 6)

  if (!projects?.length) return null

  return (
    <section className="block-projects">
      {content.title && <h2>{content.title}</h2>}
      <div className="block-projects-grid">
        {projects.map(project => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="block-project-card">
            {project.cover_image && <img src={project.cover_image} alt={project.title} />}
            <span>{project.category}</span>
            <h3>{project.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}