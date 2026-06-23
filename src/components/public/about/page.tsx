import { supabase } from '@/lib/supabase'
import { PageBlock } from '@/lib/blocks/types'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import '@/components/blocks/blocks.css'

export const revalidate = 60

export default async function AboutPage() {
  const { data } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page', 'about')
    .order('sort_order', { ascending: true })

  const blocks = (data ?? []) as PageBlock[]

  return (
    <main className="public-page">
      {blocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </main>
  )
}