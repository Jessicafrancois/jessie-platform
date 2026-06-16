import { supabase } from '@/lib/supabase'
import JournalSearchClient from '@/components/journal/JournalSearchClient'
import PageBackLink from '@/components/navigation/PageBackLink'

export const revalidate = 60

export default async function SearchPage() {
  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, slug, excerpt, entry_type, collection_id, tags, published_at, reading_time')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const { data: collections } = await supabase
    .from('collections')
    .select('id, name, slug')
    .order('name')

  return (
    <main className="search-shell">
      <PageBackLink />
      <section className="search-hero">
        <p className="search-kicker">Archive Search</p>
        <h1>Search The Archive</h1>
        <p>Explore essays, research notes, reflections, and discoveries.</p>
      </section>
      <JournalSearchClient
        entries={entries || []}
        collections={collections || []}
      />
    </main>
  )
}