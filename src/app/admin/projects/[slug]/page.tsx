import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kpbehguoxekpfejjahcf.supabase.co',
  'sb_publishable_FEPU3lc-DQs86oa-Q7Fl9A_pP6pDxrZ'
)

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!project) {
    return (
      <main className="p-10">
        Project not found
      </main>
    )
  }

  return (
    <main className="min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-4">
        {project.title}
      </h1>

      <p className="text-xl mb-8">
        {project.category}
      </p>

      <p className="max-w-2xl text-lg">
        {project.short_description}
      </p>

    </main>
  )
}