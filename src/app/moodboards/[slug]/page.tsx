import { supabase } from '@/lib/supabase'

import { notFound } from 'next/navigation'
import MoodboardViewer from '@/components/moodboard/MoodboardViewer'

export const revalidate = 60

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function MoodboardViewerPage({ params }: Props) {
  const { slug } = await params

  const { data: moodboard } = await supabase
    .from('moodboards')
    .select('*, projects(id, title, description)')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq('status', 'published')
    .single()

  if (!moodboard) notFound()

  return (
    <MoodboardViewer moodboard={moodboard} />
  )
}