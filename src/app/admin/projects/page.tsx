import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kpbehguoxekpfejjahcf.supabase.co',
  'sb_publishable_FEPU3lc-DQs86oa-Q7Fl9A_pP6pDxrZ'
)

export default async function ProjectsPage() {

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  console.log(projects)
  console.log(error)

  return (
    <main className="min-h-screen p-10">

      <div className="flex items-center justify-between mb-10">

        <h1 className="text-5xl font-bold">
          Projects
        </h1>

        <Link
          href="/admin/projects/new"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          New Project
        </Link>

      </div>

      <div className="grid gap-6">

        {projects?.map((project) => (

          <div
            key={project.id}
            className="border rounded-2xl p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-semibold mb-2">
                  {project.title}
                </h2>

                <p className="text-gray-500 mb-2">
                  {project.category}
                </p>

                <p className="max-w-2xl">
                  {project.short_description}
                </p>

              </div>

              <div className="flex gap-3">

                <Link
  href={`/admin/projects/edit/${project.id}`}
  className="border px-4 py-2 rounded-lg"
>
  Edit
</Link>

                <button className="border px-4 py-2 rounded-lg">
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  )
}