import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { JournalFeedContent } from '@/lib/blocks/types'

export default async function JournalFeedBlock({ content }: { content: JournalFeedContent }) {
  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, slug, excerpt, cover_image, entry_type')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(content.limit || 3)

  if (!entries?.length) return null

  return (
    <section className="block-journal-feed">
      {content.title && <h2>{content.title}</h2>}
      <div className="block-journal-feed-grid">
        {entries.map(entry => (
          <Link key={entry.id} href={`/journal/${entry.slug}`} className="block-journal-card">
            {entry.cover_image && <img src={entry.cover_image} alt={entry.title} />}
            <span>{entry.entry_type || 'Essay'}</span>
            <h3>{entry.title}</h3>
            {entry.excerpt && <p>{entry.excerpt}</p>}
          </Link>
        ))}
      </div>
    </section>
  )
}