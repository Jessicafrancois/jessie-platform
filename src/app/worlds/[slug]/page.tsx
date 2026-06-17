import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { supabase } from '@/lib/supabase'
import WorldViewer from '@/components/worlds/WorldViewer'

import './world-viewer.css'


export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params
  const { data: world } = await supabase
    .from('worlds')
    .select('title, description, hero_poster')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!world) return {}
  return {
    title: world.title,
    description: world.description,
    openGraph: {
      title: world.title,
      description: world.description ?? undefined,
      images: world.hero_poster ? [world.hero_poster] : [],
    },
  }
}

export default async function WorldPage({ params }: Props) {
  const { slug } = await params

  const { data: world, error: worldError } = await supabase
    .from('worlds')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (worldError) console.error('world error:', worldError)
  if (!world) notFound()

  const { data: slides, error: slidesError } = await supabase
    .from('world_slides')
    .select('*')
    .eq('world_id', world.id)
    .order('sort_order', { ascending: true })

  if (slidesError) console.error('slides error:', slidesError)

  return (
    <WorldViewer
      world={world}
      slides={slides ?? []}
    />
  )
}