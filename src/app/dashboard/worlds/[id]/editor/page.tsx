import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import WorldEditor from '@/components/worlds/WorldEditor'
import './world-editor.css'

type Props = { params: Promise<{ id: string }> }

export default async function WorldEditorPage({ params }: Props) {
  const { id } = await params

  const { data: world, error: worldError } = await supabase
    .from('worlds')
    .select('*')
    .eq('id', id)
    .single()

  if (worldError) console.error('world error:', worldError)
  if (!world) notFound()

  const { data: slides, error: slidesError } = await supabase
    .from('world_slides')
    .select('*')
    .eq('world_id', id)
    .order('sort_order', { ascending: true })

  if (slidesError) console.error('slides error:', slidesError)

  return (
    <WorldEditor
      world={world}
      initialSlides={slides ?? []}
    />
  )
}