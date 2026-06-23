import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { supabase } from '@/lib/supabase'
import WorldViewer from '@/components/worlds/WorldViewer'

import './world-viewer.css'

export const revalidate = 60

type Props = {
params: Promise<{
slug: string
}>
}

export async function generateMetadata(
{ params }: Props
): Promise<Metadata> {

const { slug } = await params

const { data: world, error } = await supabase
.from('worlds')
.select(`       title,
      description
    `)
.eq('slug', slug)
.maybeSingle()

if (error) {
console.error(
'metadata world error:',
JSON.stringify(error, null, 2)
)
return {}
}

if (!world) return {}

return {
title: world.title,
description: world.description ?? undefined,
openGraph: {
title: world.title,
description: world.description ?? undefined,
},
}
}

export default async function WorldPage({
  params,
}: Props) {

  const { slug } = await params

  console.log('WORLD SLUG:', slug)

  const {
    data: world,
    error: worldError,
  } = await supabase
    .from('worlds')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (worldError) {
    console.error(
      'world error:',
      JSON.stringify(worldError, null, 2)
    )
  }

  if (!world) {
    console.warn(
      `No world found for slug: ${slug}`
    )
    notFound()
  }
const {
data: slides,
error: slidesError,
} = await supabase
.from('world_slides')
.select('*')
.eq('world_id', world.id)
.order('sort_order', {
ascending: true,
})

if (slidesError) {
console.error(
'slides error:',
JSON.stringify(slidesError, null, 2)
)
}

return (
<WorldViewer
world={world}
slides={slides ?? []}
/>
)
}
