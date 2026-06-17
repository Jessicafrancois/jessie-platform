import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProjectWebCanvas from '@/components/web/ProjectWebCanvas'

export const revalidate = 0

type Props = { params: Promise<{ id: string }> }

export default async function ProjectWebPage({ params }: Props) {
  const { id } = await params

  const { data: project } = await supabase
    .from('projects')
    .select('id, title')
    .eq('id', id)
    .single()

  if (!project) notFound()

  return <ProjectWebCanvas projectId={project.id} projectTitle={project.title} />
}