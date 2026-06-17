import { supabase } from '@/lib/supabase'
import JournalSearchClient from '@/components/journal/JournalSearchClient'

export const revalidate = 60

export default async function SearchPage() {
  const [entriesRes, collectionsRes] =
    await Promise.all([
      supabase
        .from('entries')
        .select(`
          id,
          title,
          slug,
          intro,
          type,
          collection_id,
          tags,
          published_at,
          reading_time
        `)
        .eq('status', 'published'),

      supabase
        .from('collections')
        .select(`
          id,
          name,
          slug
        `)
        .order('name', {
          ascending: true,
        }),
    ])

  return (
    <JournalSearchClient
      entries={entriesRes.data ?? []}
      collections={collectionsRes.data ?? []}
    />
  )
}