import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function ProjectsDashboardPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      short_description,
      cover_image,
      category,
      year,
      status
    `)

  if (error) {
    return (
      <pre>
        {JSON.stringify(error, null, 2)}
      </pre>
    )
  }

  return (
    <main style={{ padding: '40px' }}>
      <h1>Projects</h1>

      {projects?.map(project => (
        <div
          key={project.id}
          style={{
            border: '1px solid #333',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <h2>{project.title}</h2>

          <p>{project.short_description}</p>

          <p>{project.status}</p>
        </div>
      ))}
    </main>
  )
}